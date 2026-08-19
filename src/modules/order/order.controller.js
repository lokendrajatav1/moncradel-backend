const orderService = require('./order.service');
const { uploadToCloudinary } = require('../../utils/cloudinary');
const Earning = require('../earning/earning.model'); // We will create this
const Order = require('./order.model');

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

    // Emitting real-time event to the kitchen using Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('new_order', { orderId: order._id, mealId: order.mealId, status: 'pending' });
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
            { kitchenId: { $exists: false } },
            { kitchenId: null }
          ]
        };
        if (filters.$or) {
          filters.$and = [ { $or: filters.$or }, kitchenFilter ];
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
          filters.$and = [ { $or: filters.$or }, deliveryFilter ];
          delete filters.$or;
        } else {
          filters.$or = deliveryFilter.$or;
        }
      }
    }
    // If no req.user (admin unprotected testing), filters remain {} -> returns all orders.

    const { totalCount, data: orders } = await orderService.getOrders(filters, req.query);
    res.status(200).json({ success: true, count: orders.length, total: totalCount, data: orders });
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

    if (status === 'cancelled' && cancellationReason) {
      updatedFields.cancellationReason = cancellationReason;
    }

    const timeFields = {
      preparing: 'preparingAt',
      ready: 'readyAt',
      out_for_delivery: 'outForDeliveryAt',
      delivered: 'deliveredAt',
      cancelled: 'cancelledAt'
    };

    if (timeFields[status]) {
      updatedFields[timeFields[status]] = new Date();
    }

    // Allow admin to update delivery address
    if (deliveryAddress && req.user && req.user.role === 'admin') {
      updatedFields.deliveryAddress = deliveryAddress;
    }

    // Allow admin to explicitly assign kitchen and delivery
    if (req.user && req.user.role === 'admin') {
      if (kitchenId) updatedFields.kitchenId = kitchenId;
      if (deliveryId) updatedFields.deliveryId = deliveryId;
    }

    // If kitchen accepts the order, assign kitchenId
    if (req.user && status === 'preparing' && req.user.role === 'kitchen') {
      updatedFields.kitchenId = req.user._id;
    }
    // If delivery picks it up, assign deliveryId
    if (req.user && status === 'out_for_delivery' && req.user.role === 'delivery') {
      updatedFields.deliveryId = req.user._id;
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
      } catch (err) {
        console.error("Could not generate earning", err);
      }
    }

    const order = await orderService.updateOrderStatus(req.params.id, status, updatedFields);
    
    // Broadcast status update to the specific order room
    const io = req.app.get('io');
    if (io) {
      io.to(`order_${order._id}`).emit('status_update', { orderId: order._id, status, proof: updatedFields.proofOfDeliveryImageUrl });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus
};
