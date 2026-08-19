const cloudinary = require('../config/cloudinary');

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The memory buffer from multer
 * @param {String} folder - The folder name in Cloudinary
 * @returns {Promise<Object>} The Cloudinary response object
 */
const uploadToCloudinary = (fileBuffer, folder = 'moncradle') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = { uploadToCloudinary };
