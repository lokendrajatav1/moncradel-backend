const Article = require('./article.model');
const APIFeatures = require('../../utils/apiFeatures');

const createArticle = async (data, authorId) => {
  const article = await Article.create({
    ...data,
    authorId
  });
  return article;
};

const getArticles = async (filters, queryString) => {
  const features = new APIFeatures(Article.find(filters).populate('authorId', 'name avatar'), queryString)
    .filter()
    .sort()
    .paginate();

  const articles = await features.query;
  const totalCount = await Article.countDocuments(filters);

  return { totalCount, data: articles };
};

const getArticleById = async (id) => {
  const article = await Article.findById(id).populate('authorId', 'name avatar');
  if (!article) {
    throw new Error('Article not found');
  }
  return article;
};

const getArticleBySlug = async (slug) => {
  const article = await Article.findOne({ slug, isPublished: true }).populate('authorId', 'name avatar');
  if (!article) {
    throw new Error('Article not found');
  }
  return article;
};

const updateArticle = async (id, data) => {
  const article = await Article.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
  if (!article) {
    throw new Error('Article not found');
  }
  return article;
};

const deleteArticle = async (id) => {
  const article = await Article.findByIdAndDelete(id);
  if (!article) {
    throw new Error('Article not found');
  }
  return article;
};

module.exports = {
  createArticle,
  getArticles,
  getArticleById,
  getArticleBySlug,
  updateArticle,
  deleteArticle
};
