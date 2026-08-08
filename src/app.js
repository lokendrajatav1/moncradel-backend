const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

const app = express();

// Middleware
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }));
}
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Route imports
const authRoutes = require('./modules/auth/auth.route');
const userRoutes = require('./modules/user/user.route');
const customerRoutes = require('./modules/customer/customer.route');
const doctorRoutes = require('./modules/doctor/doctor.route');
const deliveryPartnerRoutes = require('./modules/deliveryPartner/deliveryPartner.route');
const kitchenPartnerRoutes = require('./modules/kitchenPartner/kitchenPartner.route');
const babyRoutes = require('./modules/baby/baby.route');
const mealRoutes = require('./modules/meal/meal.route');
const orderRoutes = require('./modules/order/order.route');
const reviewRoutes = require('./modules/review/review.route');
const notificationRoutes = require('./modules/notification/notification.route');
const earningRoutes = require('./modules/earning/earning.route');
const supportRoutes = require('./modules/support/support.route');
const appointmentRoutes = require('./modules/appointment/appointment.route');
const growthRoutes = require('./modules/growth/growth.route');
const prescriptionRoutes = require('./modules/prescription/prescription.route');
const paymentRoutes = require('./modules/payment/payment.route');
const subscriptionRoutes = require('./modules/subscription/subscription.route');
const subscriptionPlanRoutes = require('./modules/subscriptionPlan/subscriptionPlan.route');
const productRoutes = require('./modules/product/product.route');
const nutritionPlanRoutes = require('./modules/nutritionPlan/nutritionPlan.route');
const inventoryRoutes = require('./modules/inventory/inventory.route');
const hygieneRoutes = require('./modules/hygiene/hygiene.route');
const batchRoutes = require('./modules/batch/batch.route');
const analyticsRoutes = require('./modules/analytics/analytics.route');
const bannerRoutes = require('./modules/banner/banner.route');
const couponRoutes = require('./modules/coupon/coupon.route');
const settingRoutes = require('./modules/setting/setting.route');
const auditLogRoutes = require('./modules/auditLog/auditLog.route');
const cartRoutes = require('./modules/cart/cart.route');
const addressRoutes = require('./modules/address/address.route');
const milestoneRoutes = require('./modules/milestone/milestone.route');
const standardMilestoneRoutes = require('./modules/standardMilestone/standardMilestone.route');
const walletRoutes = require('./modules/wallet/wallet.route');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/delivery-partners', deliveryPartnerRoutes);
app.use('/api/kitchen-partners', kitchenPartnerRoutes);
app.use('/api/babies', babyRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/earnings', earningRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/growth', growthRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/subscription-plans', subscriptionPlanRoutes);
app.use('/api/products', productRoutes);
app.use('/api/nutrition-plans', nutritionPlanRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/hygiene', hygieneRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/standard-milestones', standardMilestoneRoutes);
app.use('/api/wallet', walletRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Moncradel API' });
});

// Error Handler Middleware (must be after all routes)
app.use(errorHandler);

module.exports = app;
