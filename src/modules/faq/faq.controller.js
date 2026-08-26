const faqService = require('./faq.service');

// @desc    Create a FAQ
// @route   POST /api/faqs
// @access  Public (temporarily for admin)
const createFaq = async (req, res, next) => {
  try {
    const faq = await faqService.createFaq(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active FAQs
// @route   GET /api/faqs
// @access  Public
const getFaqs = async (req, res, next) => {
  try {
    const targetApp = req.query.targetApp;
    // Show all FAQs for admin panel temporarily
    const faqs = await faqService.getFaqs('admin', targetApp);
    res.status(200).json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a FAQ
// @route   PUT /api/faqs/:id
// @access  Public (temporarily)
const updateFaq = async (req, res, next) => {
  try {
    const faq = await faqService.updateFaq(req.params.id, req.body);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a FAQ
// @route   DELETE /api/faqs/:id
// @access  Public (temporarily)
const deleteFaq = async (req, res, next) => {
  try {
    const faq = await faqService.deleteFaq(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.status(200).json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder FAQs
// @route   PUT /api/faqs/reorder
// @access  Public (temporarily)
const reorderFaqs = async (req, res, next) => {
  try {
    const { faqIds } = req.body;
    if (!faqIds || !Array.isArray(faqIds)) {
      return res.status(400).json({ success: false, message: 'faqIds array is required' });
    }
    await faqService.reorderFaqs(faqIds);
    res.status(200).json({ success: true, message: 'FAQs reordered successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFaq,
  getFaqs,
  updateFaq,
  deleteFaq,
  reorderFaqs
};
