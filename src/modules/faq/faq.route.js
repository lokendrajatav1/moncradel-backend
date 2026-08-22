const express = require('express');
const router = express.Router();
const { createFaq, getFaqs, updateFaq, deleteFaq, reorderFaqs } = require('./faq.controller');

// Temporarily unprotected for admin panel testing
router.route('/')
  .post(createFaq)
  .get(getFaqs);

router.put('/reorder', reorderFaqs);

router.route('/:id')
  .put(updateFaq)
  .delete(deleteFaq);

module.exports = router;
