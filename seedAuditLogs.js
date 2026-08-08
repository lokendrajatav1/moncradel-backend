const mongoose = require('mongoose');
require('dotenv').config();

const AuditLog = require('./src/modules/auditLog/auditLog.model');
const User = require('./src/modules/user/user.model');

const seedAuditLogs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    // Clear existing logs
    await AuditLog.deleteMany({});
    console.log('Cleared existing audit logs.');

    // Get an admin user
    let admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.log('No admin user found, fetching any user...');
      admin = await User.findOne({});
    }

    if (!admin) {
      console.log('No users found in database. Cannot create audit logs without a user.');
      process.exit(1);
    }

    const baseLogs = [
      { action: 'UPDATED_SETTING', resource: 'Delivery Fee', details: 'Changed from ₹40 to ₹50', ipAddress: '192.168.1.1' },
      { action: 'DELETED_USER', resource: 'User ID: 8901', details: 'Account closed by request', ipAddress: '10.0.0.5' },
      { action: 'CREATED_COUPON', resource: 'Coupon: DIWALI50', details: '50% discount added', ipAddress: '192.168.1.10' },
      { action: 'GENERATED_REPORT', resource: 'Financial Report', details: 'Monthly revenue report generated', ipAddress: '192.168.1.20' },
      { action: 'UPDATED_MENU', resource: 'Standard Meal', details: 'Added extra roti option', ipAddress: '192.168.1.5' },
      { action: 'LOGIN_SUCCESS', resource: 'Admin Dashboard', details: 'Logged in from new device', ipAddress: '192.168.2.11' },
      { action: 'FAILED_LOGIN', resource: 'Admin Dashboard', details: 'Invalid password attempt', ipAddress: '172.16.0.4' },
      { action: 'UPDATED_PROFILE', resource: 'Admin Profile', details: 'Changed email address', ipAddress: '192.168.1.1' },
      { action: 'CREATED_USER', resource: 'User ID: 8902', details: 'Created new delivery partner account', ipAddress: '10.0.0.8' }
    ];

    const logsToCreate = [];
    for (let i = 0; i < 100; i++) {
      const baseLog = baseLogs[i % baseLogs.length];
      logsToCreate.push({
        userId: admin._id,
        action: baseLog.action,
        resource: `${baseLog.resource} #${i + 1}`,
        details: baseLog.details,
        ipAddress: baseLog.ipAddress,
        createdAt: new Date(Date.now() - (100 - i) * 60 * 60 * 1000) // spread over the last 100 hours
      });
    }

    await AuditLog.insertMany(logsToCreate);
    console.log('Successfully seeded audit logs!');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding audit logs:', error);
    process.exit(1);
  }
};

seedAuditLogs();
