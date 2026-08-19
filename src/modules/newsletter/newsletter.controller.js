const Newsletter = require('./newsletter.model');

exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        return res.status(200).json({ success: true, message: 'Resubscribed successfully!' });
      }
      return res.status(400).json({ success: false, message: 'You are already subscribed!' });
    }

    await Newsletter.create({ email });

    res.status(201).json({
      success: true,
      message: 'Subscribed to newsletter successfully!'
    });
  } catch (error) {
    next(error);
  }
};

exports.unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const subscriber = await Newsletter.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'No subscription found with that email' });
    }

    subscriber.active = false;
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'Unsubscribed successfully'
    });
  } catch (error) {
    next(error);
  }
};
