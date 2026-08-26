const multer = require('multer');

// Store files in memory so we can upload them directly to Cloudinary
const storage = multer.memoryStorage();

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for actual file uploads
    fieldSize: 25 * 1024 * 1024 // 25MB limit for text fields (like A+ Content with Base64)
  }
});

module.exports = upload;
