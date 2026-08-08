const Setting = require('./setting.model');

/**
 * Get all settings formatted as a key-value object
 */
const getSettingsConfig = async () => {
  const settings = await Setting.find();
  
  // Convert array of docs into a single key-value object for easy frontend use
  const config = {};
  settings.forEach(s => {
    config[s.key] = s.value;
  });

  return config;
};

/**
 * Update or create a setting
 */
const updateSetting = async (settingData) => {
  const { key, value, description } = settingData;

  const setting = await Setting.findOneAndUpdate(
    { key },
    { value, description },
    { new: true, upsert: true, runValidators: true } // upsert creates it if it doesn't exist
  );

  return setting;
};

module.exports = {
  getSettingsConfig,
  updateSetting
};
