const articleService = require('./article.service');
const { uploadToCloudinary } = require('../../utils/cloudinary');

// @desc    Create a new article
// @route   POST /api/articles
// @access  Private (Admin)
const createArticle = async (req, res, next) => {
  try {
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'articles');
      req.body.coverImage = result.secure_url;
    }

    const article = await articleService.createArticle(req.body, req.user._id);
    res.status(201).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
const getArticles = async (req, res, next) => {
  try {
    let filters = {};
    
    // Quick search by title or category
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filters.$or = [
        { title: searchRegex },
        { category: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }
    // Always delete search from query so APIFeatures doesn't try to filter by it
    delete req.query.search;

    // Only return published articles if not requested by admin
    // Or if public route, always return published
    if (!req.user || req.user.role !== 'admin') {
      filters.isPublished = true;
    }

    const { totalCount, data } = await articleService.getArticles(filters, req.query);
    res.status(200).json({ success: true, count: data.length, total: totalCount, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article by slug
// @route   GET /api/articles/slug/:slug
// @access  Public
const getArticleBySlug = async (req, res, next) => {
  try {
    const article = await articleService.getArticleBySlug(req.params.slug);
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    if (error.message === 'Article not found') {
      return res.status(404).json({ success: false, message: 'Article not found or not published' });
    }
    next(error);
  }
};

// @desc    Get single article by ID
// @route   GET /api/articles/:id
// @access  Private (Admin)
const getArticleById = async (req, res, next) => {
  try {
    const article = await articleService.getArticleById(req.params.id);
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    if (error.message === 'Article not found') {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    next(error);
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private (Admin)
const updateArticle = async (req, res, next) => {
  try {
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'articles');
      req.body.coverImage = result.secure_url;
    }
    
    const article = await articleService.updateArticle(req.params.id, req.body);
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    if (error.message === 'Article not found') {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    next(error);
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private (Admin)
const deleteArticle = async (req, res, next) => {
  try {
    await articleService.deleteArticle(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.message === 'Article not found') {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    next(error);
  }
};

module.exports = {
  createArticle,
  getArticles,
  getArticleBySlug,
  getArticleById,
  updateArticle,
  deleteArticle
};
