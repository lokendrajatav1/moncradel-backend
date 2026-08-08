const productService = require('./product.service');

// @desc    Add a product
// @route   POST /api/products
// @access  Private (Admin)
const addProduct = async (req, res, next) => {
  try {
    // Temporarily unprotected for admin panel testing
    /*
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    */

    const product = await productService.addProduct(req.body, req.file);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    // For admin, return all products, even out of stock
    const { data: products, totalCount } = await productService.getAllProducts(req.query);
    res.status(200).json({ success: true, count: totalCount, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public (temporarily)
const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.files);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public (temporarily)
const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    next(error);
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
