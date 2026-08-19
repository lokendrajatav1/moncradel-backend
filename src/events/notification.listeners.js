const eventEmitter = require('./eventEmitter');
const { addNotificationJob } = require('../queues/notification.queue');

// Listener for New Order
eventEmitter.on('order.created', async ({ order, user }) => {
  try {
    await addNotificationJob({
      isAdminBroadcast: true,
      triggeredByAdminId: user && user.role === 'admin' ? user._id : null,
      title: 'New Order Received',
      message: `Order #${order._id.toString().substring(0, 6)} has been placed.`,
      orderId: order._id,
      data: { type: 'new_order', orderId: order._id.toString() }
    });
  } catch (error) {
    console.error('Error in order.created listener:', error);
  }
});

// Listener for New Appointment
eventEmitter.on('appointment.created', async ({ appointment, user }) => {
  try {
    await addNotificationJob({
      isAdminBroadcast: true,
      triggeredByAdminId: user && user.role === 'admin' ? user._id : null,
      title: 'New Appointment Booked',
      message: `A new appointment has been scheduled for ${appointment.appointmentDate}.`,
      data: { type: 'new_appointment', appointmentId: appointment._id.toString() }
    });
  } catch (error) {
    console.error('Error in appointment.created listener:', error);
  }
});

// Listener for New Support Ticket
eventEmitter.on('support.created', async ({ ticket, user }) => {
  try {
    const formattedIssueType = ticket.issueType ? ticket.issueType.replace('_', ' ').toUpperCase() : 'General Issue';
    await addNotificationJob({
      isAdminBroadcast: true,
      triggeredByAdminId: user && user.role === 'admin' ? user._id : null,
      title: 'New Support Ticket',
      message: `A new support ticket has been created regarding "${formattedIssueType}".`,
      data: { type: 'new_ticket', ticketId: ticket._id.toString() }
    });
  } catch (error) {
    console.error('Error in support.created listener:', error);
  }
});

// Listener for New Subscription
eventEmitter.on('subscription.created', async ({ subscription, user }) => {
  try {
    await addNotificationJob({
      isAdminBroadcast: true,
      triggeredByAdminId: user && user.role === 'admin' ? user._id : null,
      title: 'New Subscription',
      message: `A new subscription has been purchased for plan ID ${subscription.planId}.`,
      data: { type: 'new_subscription', subscriptionId: subscription._id.toString() }
    });
  } catch (error) {
    console.error('Error in subscription.created listener:', error);
  }
});

console.log('Notification event listeners registered.');
