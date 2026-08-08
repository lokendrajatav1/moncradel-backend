const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    console.error("Zod Validation Error:", err);
    let errorMessage = 'Validation failed';
    if (err.errors && Array.isArray(err.errors)) {
      errorMessage = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    return res.status(400).json({
      success: false,
      message: errorMessage,
      errors: err.errors || err
    });
  }
};

module.exports = validate;
