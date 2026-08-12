const Address = require('./address.model');

/**
 * Add a new address
 */
const addAddress = async (userId, addressData) => {
  const { title, street, city, state, zipCode, phone, isDefault } = addressData;

  // If this is set as default, remove default from others
  if (isDefault) {
    await Address.updateMany({ userId }, { isDefault: false });
  }

  const address = await Address.create({
    userId,
    title,
    street,
    city,
    state,
    zipCode,
    phone,
    isDefault: isDefault || false
  });

  return address;
};

/**
 * Get all addresses for a user
 */
const getAddresses = async (userId) => {
  return await Address.find({ userId }).sort('-isDefault -createdAt');
};

const updateAddress = async (id, updateData) => {
  if (updateData.isDefault) {
    const address = await Address.findById(id);
    if (address) {
      await Address.updateMany({ userId: address.userId }, { isDefault: false });
    }
  }
  return await Address.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteAddress = async (id) => {
  return await Address.findByIdAndDelete(id);
};

module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress
};
