const mongoose = require('mongoose');
const slugify = require('slugify');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  coverImage: {
    type: String
  },
  category: {
    type: String,
    required: true,
    default: 'Uncategorized'
  },
  tags: [{
    type: String
  }],
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  readTime: {
    type: Number,
    default: 2
  }
}, { timestamps: true });

// Pre-save hook to generate slug and readTime
articleSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true
    });
  }

  if (this.isModified('content') && this.content) {
    // Rough estimate: ~1000 characters = 1 minute read
    this.readTime = Math.max(2, Math.ceil(this.content.length / 1000));
  }
  
  next();
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
