const Wallet = require('./wallet.model');

/**
 * Get user wallet, creating it if it doesn't exist
 */
const getWalletByUserId = async (userId) => {
  let wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    wallet = await Wallet.create({ userId, balance: 0, transactions: [] });
  }

  return wallet;
};

/**
 * Add or deduct funds from wallet
 */
const createTransaction = async (transactionData) => {
  const { userId, type, amount, description } = transactionData;
  
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = await Wallet.create({ userId, balance: 0, transactions: [] });
  }

  if (type === 'debit' && wallet.balance < amount) {
    throw new Error('Insufficient wallet balance');
  }

  wallet.transactions.push({ type, amount, description });
  
  if (type === 'credit') {
    wallet.balance += amount;
  } else {
    wallet.balance -= amount;
  }

  await wallet.save();
  return wallet;
};

module.exports = {
  getWalletByUserId,
  createTransaction
};
