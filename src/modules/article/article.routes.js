const express = require('express');
const router = express.Router();
const articleController = require('./article.controller');
const { protect, authorize } = require('../../middleware/auth');

// Public routes (Optionally authenticate to pass req.user for draft visibility logic)
// We use a custom middleware or just optional protect if we want admin to see drafts on the list.
// For now, let's keep it simple: Public list only shows published.
// But we'll add optional auth so req.user is populated if they are logged in.
const optionalProtect = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') 
    ? req.headers.authorization.split(' ')[1] 
    : null;
    
  if (token) {
    return protect(req, res, next);
  }
  next();
};

router.get('/', optionalProtect, articleController.getArticles);
router.get('/slug/:slug', articleController.getArticleBySlug);

const upload = require('../../middleware/upload');

// Protected Admin Routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', upload.single('image'), articleController.createArticle);
router.get('/:id', articleController.getArticleById);
router.put('/:id', upload.single('image'), articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);

module.exports = router;
