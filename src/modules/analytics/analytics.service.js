const User = require('../user/user.model');
const Order = require('../order/order.model');
const Payment = require('../payment/payment.model');
const Appointment = require('../appointment/appointment.model');
const Earning = require('../earning/earning.model');
const Withdrawal = require('../withdrawal/withdrawal.model');
const mongoose = require('mongoose');

/**
 * Get dashboard analytics for admin
 */
const getDashboardAnalytics = async () => {
  // 1. User Stats
  const totalUsers = await User.countDocuments();
  const parentsCount = await User.countDocuments({ role: 'parent' });
  const driversCount = await User.countDocuments({ role: 'driver' });
  
  // 2. Order Stats
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: { $in: ['pending', 'preparing'] } });
  const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

  // 3. Revenue Stats
  const payments = await Payment.find({ status: 'success' });
  const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

  // 4. Today's Data
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysOrdersCount = await Order.countDocuments({
    createdAt: { $gte: today }
  });

  // 5. Recent Orders (last 5)
  const recentOrders = await Order.find()
    .sort('-createdAt')
    .limit(5)
    .populate('parentId', 'name')
    .populate('items.mealId', 'name')
    .populate('items.productId', 'name')
    .select('parentId items totalAmount status createdAt');

  // 6. Weekly Revenue (last 7 days)
  const weeklyRevenue = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);

    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);

    const dayPayments = await Payment.find({
      status: 'success',
      createdAt: { $gte: day, $lt: nextDay }
    });
    const dayRevenue = dayPayments.reduce((acc, curr) => acc + curr.amount, 0);

    weeklyRevenue.push({
      name: dayNames[day.getDay()],
      revenue: dayRevenue
    });
  }

  // 7. Top Selling Meals (Top 5)
  const topMeals = await Order.aggregate([
    { $unwind: '$items' },
    { $match: { 'items.mealId': { $exists: true, $ne: null } } },
    { $group: { _id: '$items.mealId', count: { $sum: '$items.quantity' } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'meals', localField: '_id', foreignField: '_id', as: 'meal' } },
    { $unwind: '$meal' },
    { $project: { name: '$meal.name', count: 1 } }
  ]);

  // 8. User Growth (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0,0,0,0);
  
  const userGrowthAgg = await User.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const userGrowth = userGrowthAgg.map(item => {
    const [year, month] = item._id.split('-');
    return {
      name: `${monthNames[parseInt(month, 10) - 1]} ${year}`,
      users: item.count
    };
  });

  // 9. Sales by Category (Age Group)
  const salesByCategory = await Order.aggregate([
    { $unwind: '$items' },
    { $match: { 'items.mealId': { $exists: true, $ne: null } } },
    { $lookup: { from: 'meals', localField: 'items.mealId', foreignField: '_id', as: 'meal' } },
    { $unwind: '$meal' },
    { $group: { _id: '$meal.suitableForAgeGroup', value: { $sum: '$items.quantity' } } },
    { $project: { name: '$_id', value: 1, _id: 0 } }
  ]);

  // 10. Order Status Distribution (Last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const orderStatusDistribution = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $group: { _id: '$status', value: { $sum: 1 } } },
    { $project: { name: '$_id', value: 1, _id: 0 } }
  ]);

  return {
    users: {
      total: totalUsers,
      parents: parentsCount,
      drivers: driversCount
    },
    orders: {
      total: totalOrders,
      pending: pendingOrders,
      delivered: deliveredOrders,
      today: todaysOrdersCount
    },
    revenue: {
      total: totalRevenue
    },
    recentOrders,
    weeklyRevenue,
    topMeals,
    userGrowth,
    salesByCategory,
    orderStatusDistribution
  };
};

/**
 * Get dashboard analytics for a specific doctor
 */
const getDoctorAnalytics = async (doctorId) => {
  const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

  // --- Clinical Metrics ---
  const clinicalStats = await Appointment.aggregate([
    { $match: { doctorId: doctorObjectId } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        cancelled: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        },
        uniquePatients: { $addToSet: '$babyId' }
      }
    }
  ]);

  const stats = clinicalStats[0] || { total: 0, completed: 0, cancelled: 0, uniquePatients: [] };
  const uniquePatientsCount = stats.uniquePatients.length;

  // --- Financial Metrics ---
  const financialStats = await Earning.aggregate([
    { $match: { staffId: doctorObjectId, staffRole: 'doctor' } },
    {
      $group: {
        _id: null,
        totalEarned: { $sum: '$amount' }
      }
    }
  ]);

  const fStats = financialStats[0] || { totalEarned: 0 };
  const totalEarned = fStats.totalEarned;

  const withdrawalStats = await Withdrawal.aggregate([
    { $match: { doctorId: doctorObjectId, status: { $in: ['pending', 'approved'] } } },
    {
      $group: {
        _id: null,
        pendingSettlement: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] }
        },
        totalWithdrawn: {
          $sum: { $cond: [{ $eq: ['$status', 'approved'] }, '$amount', 0] }
        }
      }
    }
  ]);

  const wStats = withdrawalStats[0] || { pendingSettlement: 0, totalWithdrawn: 0 };
  const pendingSettlement = wStats.pendingSettlement;
  const totalWithdrawn = wStats.totalWithdrawn;

  const availableBalance = totalEarned - pendingSettlement - totalWithdrawn;

  // --- 7-Day Graphs ---
  const financialGraphData = [];
  const clinicalGraphData = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    dayStart.setDate(dayStart.getDate() - i);

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    // Financial Day
    const dayEarnings = await Earning.aggregate([
      { 
        $match: { 
          staffId: doctorObjectId, 
          createdAt: { $gte: dayStart, $lt: dayEnd } 
        } 
      },
      { $group: { _id: null, revenue: { $sum: '$amount' } } }
    ]);
    const dayRevenue = dayEarnings[0]?.revenue || 0;
    
    financialGraphData.push({
      name: dayNames[dayStart.getDay()],
      revenue: dayRevenue
    });

    // Clinical Day
    const dayAppointments = await Appointment.aggregate([
      { 
        $match: { 
          doctorId: doctorObjectId,
          createdAt: { $gte: dayStart, $lt: dayEnd } 
        } 
      },
      {
        $group: {
          _id: null,
          appointments: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);

    clinicalGraphData.push({
      name: dayNames[dayStart.getDay()],
      appointments: dayAppointments[0]?.appointments || 0,
      completed: dayAppointments[0]?.completed || 0
    });
  }

  return {
    financial: {
      totalEarned,
      availableBalance,
      pendingSettlement,
      totalWithdrawn,
      graphData: financialGraphData
    },
    clinical: {
      totalAppointments: stats.total,
      completedAppointments: stats.completed,
      cancelledAppointments: stats.cancelled,
      uniquePatients: uniquePatientsCount,
      graphData: clinicalGraphData
    }
  };
};

module.exports = {
  getDashboardAnalytics,
  getDoctorAnalytics
};
