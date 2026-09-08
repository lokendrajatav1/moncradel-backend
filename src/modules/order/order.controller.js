const orderService = require('./order.service');
const { uploadToCloudinary } = require('../../utils/cloudinary');
const Earning = require('../earning/earning.model'); // We will create this
const Order = require('./order.model');
const eventEmitter = require('../../events/eventEmitter');
const { addNotificationJob } = require('../../queues/notification.queue');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Parents only)
const createOrder = async (req, res) => {
  try {
    let parentId;

    if (req.user && req.user.role === 'admin') {
      if (!req.body.parentId) {
        return res.status(400).json({ success: false, message: 'parentId is required when admin creates an order' });
      }
      parentId = req.body.parentId;
    } else if (req.user && req.user.role === 'parent') {
      parentId = req.user._id;
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized to create orders' });
    }

    const order = await orderService.createOrder(req.body, parentId);

    // Only notify kitchen/listeners IMMEDIATELY if it's a Cash on Delivery order.
    // For online payments, we should wait until the payment succeeds.
    if (order.paymentMethod === 'cod') {
      // Create a Payment record for COD so it shows up in Admin > Payments
      const Payment = require('../payment/payment.model');
      await Payment.create({
        userId: parentId,
        amount: order.totalAmount,
        orderId: order._id,
        status: 'pending'
      });

      eventEmitter.emit('order.created', { order, user: req.user });

      // Emitting real-time event to the kitchen using Socket.io
      const io = req.app.get('io');
      if (io) {
        io.emit('new_order', { orderId: order._id, mealId: order.mealId, status: 'pending' });
      }
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get orders based on role
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    let filters = {};

    // Quick search logic across related collections
    if (req.query.search) {
      // Remove leading # if user searches for #123456
      const searchTerm = req.query.search.replace(/^#/, '');
      const searchRegex = new RegExp(searchTerm, 'i');

      const [User, Baby, Meal, Product] = [
        require('../user/user.model'),
        require('../baby/baby.model'),
        require('../meal/meal.model'),
        require('../product/product.model')
      ];

      const [users, babies, meals, products] = await Promise.all([
        User.find({ name: { $regex: searchRegex } }).select('_id'),
        Baby.find({ name: { $regex: searchRegex } }).select('_id'),
        Meal.find({ name: { $regex: searchRegex } }).select('_id'),
        Product.find({ name: { $regex: searchRegex } }).select('_id')
      ]);

      filters.$or = [
        { parentId: { $in: users.map(u => u._id) } },
        { babyId: { $in: babies.map(b => b._id) } },
        { 'items.mealId': { $in: meals.map(m => m._id) } },
        { 'items.productId': { $in: products.map(p => p._id) } },
        { status: { $regex: searchRegex } },
        { $expr: { $regexMatch: { input: { $toString: '$_id' }, regex: searchRegex } } }
      ];

      const mongoose = require('mongoose');
      if (mongoose.Types.ObjectId.isValid(searchTerm)) {
        // If they pasted a full 24-character ObjectId
        filters.$or.push({ _id: searchTerm });
      }
    }

    // Always remove search to prevent APIFeatures from processing it directly
    delete req.query.search;

    if (req.user) {
      if (req.user.role === 'parent') {
        filters.parentId = req.user._id;
      } else if (req.user.role === 'kitchen') {
        const kitchenFilter = {
          $or: [
            { kitchenId: req.user._id },
            {
              $and: [
                { $or: [{ kitchenId: { $exists: false } }, { kitchenId: null }] },
                { rejectedKitchens: { $ne: req.user._id } }
              ]
            }
          ]
        };
        if (filters.$or) {
          filters.$and = [{ $or: filters.$or }, kitchenFilter];
          delete filters.$or;
        } else {
          filters.$or = kitchenFilter.$or;
        }
      } else if (req.user.role === 'delivery') {
        const deliveryFilter = {
          $or: [
            { status: 'ready' },
            { status: { $in: ['out_for_delivery', 'delivered'] }, deliveryId: req.user._id }
          ]
        };
        if (filters.$or) {
          filters.$and = [{ $or: filters.$or }, deliveryFilter];
          delete filters.$or;
        } else {
          filters.$or = deliveryFilter.$or;
        }
      }

      // Filter out online prepaid orders that are NOT paid yet from everyone EXCEPT parents.
      // Parents should still see their pending/failed online orders so they can track or retry.
      if (req.user.role !== 'parent') {
        const validPaymentFilter = {
          $or: [
            { paymentMethod: 'cod' },
            { paymentMethod: { $in: ['upi', 'card'] }, paymentStatus: 'paid' }
          ]
        };

        if (filters.$and) {
          filters.$and.push(validPaymentFilter);
        } else if (filters.$or) {
          filters.$and = [{ $or: filters.$or }, validPaymentFilter];
          delete filters.$or;
        } else {
          Object.assign(filters, validPaymentFilter);
        }
      }
    }
    // If role is kitchen or delivery, we only want orders that have at least one NON-subscription item
    if (req.user && (req.user.role === 'kitchen' || req.user.role === 'delivery')) {
      filters['items'] = { $elemMatch: { isSubscription: { $ne: true } } };
    }

    const { totalCount, data: orders } = await orderService.getOrders(filters, req.query);

    // Strip subscription items from the response for kitchen and delivery
    let processedOrders = orders;
    if (req.user && (req.user.role === 'kitchen' || req.user.role === 'delivery')) {
      processedOrders = orders.map(order => {
        const orderObj = order.toObject ? order.toObject() : order;
        orderObj.items = orderObj.items.filter(item => !item.isSubscription);
        return orderObj;
      });
    }

    res.status(200).json({ success: true, count: processedOrders.length, total: totalCount, data: processedOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status, deliveryAddress, cancellationReason, kitchenId, deliveryId, otp } = req.body;
    let updatedFields = {};

    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    let finalStatus = status;

    // Multi-Kitchen Rejection Logic:
    // If a kitchen declines a PENDING order, pass/forward it to other available kitchens instead of cancelling the customer's whole order!
    if (req.user && req.user.role === 'kitchen' && existingOrder.status === 'pending' && status === 'cancelled') {
      const User = require('../user/user.model');

      const newRejectedKitchens = [...(existingOrder.rejectedKitchens || []), req.user._id];
      const newRejectionHistory = [
        ...(existingOrder.rejectionHistory || []),
        {
          kitchenId: req.user._id,
          reason: cancellationReason || 'Kitchen unable to prepare at this time',
          rejectedAt: new Date()
        }
      ];

      updatedFields.rejectedKitchens = newRejectedKitchens;
      updatedFields.rejectionHistory = newRejectionHistory;
      updatedFields.kitchenId = null; // ensure unassigned

      // Check if there are other kitchens in the system that haven't rejected this order yet
      const otherAvailableKitchens = await User.find({
        role: 'kitchen',
        _id: { $nin: newRejectedKitchens }
      }).select('_id name');

      if (otherAvailableKitchens.length > 0) {
        // Keep order as 'pending' so next kitchen can accept it!
        finalStatus = 'pending';

        // Notify other kitchens via socket.io
        const io = req.app.get('io');
        if (io) {
          io.emit('new_order', { orderId: existingOrder._id, status: 'pending', forwarded: true });
        }
      } else {
        // All kitchens have rejected or none left -> Auto-cancel
        finalStatus = 'cancelled';
        updatedFields.cancellationReason = cancellationReason || 'All available kitchens were unable to fulfill this order';
        updatedFields.cancelledBy = req.user._id;
        updatedFields.cancelledByRole = 'kitchen';
      }
    } else if (status === 'cancelled') {
      if (cancellationReason) {
        updatedFields.cancellationReason = cancellationReason;
      }
      if (req.user) {
        updatedFields.cancelledBy = req.user._id;
        updatedFields.cancelledByRole = req.user.role;
      } else {
        updatedFields.cancelledByRole = 'system';
      }
    }

    const timeFields = {
      preparing: 'preparingAt',
      ready: 'readyAt',
      out_for_delivery: 'outForDeliveryAt',
      delivered: 'deliveredAt',
      cancelled: 'cancelledAt'
    };

    if (timeFields[finalStatus]) {
      updatedFields[timeFields[finalStatus]] = new Date();
    }

    // Allow admin to update delivery address
    if (deliveryAddress && req.user && req.user.role === 'admin') {
      updatedFields.deliveryAddress = deliveryAddress;
    }

    // Allow admin to explicitly assign kitchen and delivery
    if (req.user && req.user.role === 'admin') {
      if (kitchenId !== undefined) {
        updatedFields.kitchenId = kitchenId ? kitchenId : null;
      }
      if (deliveryId !== undefined) {
        updatedFields.deliveryId = deliveryId ? deliveryId : null;

        // Notify the delivery boy about the assignment if it's new
        if (deliveryId) {
          const currentOrder = await Order.findById(req.params.id);
          if (!currentOrder.deliveryId || currentOrder.deliveryId.toString() !== deliveryId.toString()) {
            try {
              await addNotificationJob({
                userId: deliveryId,
                title: 'New Order Assigned',
                message: `You have been assigned to deliver order #${req.params.id.substring(0, 6)}`,
                orderId: req.params.id
              });
            } catch (err) {
              console.error("Failed to queue assignment notification", err);
            }
          }
        }
      }
    }

    // If kitchen accepts the order, assign kitchenId
    if (req.user && status === 'preparing' && req.user.role === 'kitchen') {
      updatedFields.kitchenId = req.user._id;
    }
    // If delivery picks it up, assign deliveryId
    if (req.user && status === 'out_for_delivery' && req.user.role === 'delivery') {
      updatedFields.deliveryId = req.user._id;
    }

    // Packaging Proof of Kitchen logic
    if (req.user && status === 'ready' && (req.user.role === 'kitchen' || req.user.role === 'kitchen_staff' || req.user.role === 'admin')) {
      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'proofs');
        updatedFields.packagingProofImageUrl = uploadResult.secure_url;
      }
    }

    // Proof of delivery logic
    if (req.user && status === 'delivered' && req.user.role === 'delivery') {
      const orderToDeliver = await Order.findById(req.params.id);

      if (orderToDeliver.isOtpRequired) {
        if (!otp || otp !== orderToDeliver.deliveryOtp) {
          return res.status(400).json({ success: false, message: 'Invalid or missing OTP for delivery' });
        }
      }

      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'proofs');
        updatedFields.proofOfDeliveryImageUrl = uploadResult.secure_url;
      }

      // Auto-generate Earning for the delivery driver (Fixed ₹50 for now)
      try {
        await Earning.create({
          deliveryId: req.user._id,
          orderId: req.params.id,
          amount: 50,
          status: 'pending'
        });

        // If it's a COD order, mark the associated Payment as success since money is collected
        if (orderToDeliver.paymentMethod === 'cod') {
          const Payment = require('../payment/payment.model');
          await Payment.findOneAndUpdate(
            { orderId: req.params.id },
            { status: 'success' }
          );
        }
      } catch (err) {
        console.error("Could not generate earning or update COD payment", err);
      }
    }

    const order = await orderService.updateOrderStatus(req.params.id, finalStatus, updatedFields);

    // Restore stock if cancelled
    if (finalStatus === 'cancelled') {
      await orderService.restoreProductStock(req.params.id);
    }

    // Notify delivery partner when order is ready to be picked up
    if (finalStatus === 'ready' && order.deliveryId) {
      try {
        await addNotificationJob({
          userId: order.deliveryId,
          title: 'Order Ready for Pickup',
          message: `Order #${order._id.toString().substring(0, 6)} is ready at the kitchen. Please pick it up.`,
          orderId: order._id.toString()
        });
      } catch (err) {
        console.error("Failed to queue order ready notification", err);
      }
    }

    // Broadcast status update to the specific order room
    const io = req.app.get('io');
    if (io) {
      io.to(`order_${order._id}`).emit('status_update', { orderId: order._id, status: finalStatus, proof: updatedFields.proofOfDeliveryImageUrl });
    }

    res.status(200).json({
      success: true,
      message: finalStatus === 'pending' && status === 'cancelled'
        ? 'Order declined and forwarded to other available kitchens'
        : 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const orderDoc = await orderService.getOrderById(req.params.id);

    if (!orderDoc) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    let order = orderDoc.toObject ? orderDoc.toObject() : orderDoc;

    if (req.user && (req.user.role === 'kitchen' || req.user.role === 'delivery')) {
      order.items = order.items.filter(item => !item.isSubscription);
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};
