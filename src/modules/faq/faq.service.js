const Faq = require('./faq.model');

/**
 * Create a new FAQ
 */
const createFaq = async (faqData) => {
  const { question, answer, targetApp, category, isActive } = faqData;
  const activeStatus = isActive === undefined ? true : (isActive === 'true' || isActive === true);

  const faq = await Faq.create({
    question,
    answer,
    targetApp,
    category: category || 'general',
    isActive: activeStatus
  });

  return faq;
};

/**
 * Get FAQs
 */
const getFaqs = async (userRole, targetAppFilter) => {
  const filter = {};
  if (userRole !== 'admin') {
    filter.isActive = true;
  }
  if (targetAppFilter) {
    filter.targetApp = targetAppFilter;
  }
  
  return await Faq.find(filter).sort({ sortOrder: 1, createdAt: -1 });
};

/**
 * Update a FAQ
 */
const updateFaq = async (id, faqData) => {
  const { question, answer, targetApp, category, isActive } = faqData;
  const updateFields = {};

  if (question !== undefined) updateFields.question = question;
  if (answer !== undefined) updateFields.answer = answer;
  if (targetApp !== undefined) updateFields.targetApp = targetApp;
  if (category !== undefined) updateFields.category = category;
  if (isActive !== undefined) {
    updateFields.isActive = (isActive === 'true' || isActive === true);
  }

  return await Faq.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true
  });
};

/**
 * Delete a FAQ
 */
const deleteFaq = async (id) => {
  return await Faq.findByIdAndDelete(id);
};

/**
 * Reorder FAQs
 */
const reorderFaqs = async (faqIds) => {
  const operations = faqIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { sortOrder: index } }
    }
  }));

  if (operations.length > 0) {
    await Faq.bulkWrite(operations);
  }
  return true;
};

module.exports = {
  createFaq,
  getFaqs,
  updateFaq,
  deleteFaq,
  reorderFaqs
};
