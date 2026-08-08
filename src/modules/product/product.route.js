const express = require('express');
const router = express.Router();
const { addProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('./product.controller');
const { protect } = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const validate = require('../../middleware/validate');
const { addProductSchema, updateProductSchema } = require('./product.validation');

// Temporarily unprotected for testing
router.route('/')
  .post(upload.array('images', 5), validate(addProductSchema), addProduct)
  .get(getProducts);

router.route('/:id')
  .get(getProductById)
  .put(upload.array('images', 5), validate(updateProductSchema), updateProduct)
  .delete(deleteProduct);

module.exports = router;
