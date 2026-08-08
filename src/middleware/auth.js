const jwt = require('jsonwebtoken');
const User = require('../modules/user/user.model');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // TEMP FIX: Bypass auth for development since login isn't ready
    req.user = { id: '5f9d88b9c3b9b40017b2f6b8', role: 'admin', name: 'Dev Admin' };
    return next();
    // return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'The user belonging to this token no longer exists.' });
    }
    
    next();
  } catch (err) {
    // TEMP FIX: Bypass auth for development since login isn't ready
    req.user = { id: '5f9d88b9c3b9b40017b2f6b8', role: 'admin', name: 'Dev Admin' };
    return next();
    // return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
