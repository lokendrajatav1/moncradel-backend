const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    const errorMessage = err.errors?.map(e => e.message).join(', ') || 'Validation failed';
    return res.status(400).json({
      success: false,
      message: errorMessage,
      errors: err.errors
    });
  }
};

module.exports = validate;
