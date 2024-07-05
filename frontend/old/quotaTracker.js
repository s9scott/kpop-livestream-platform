/*
 * Quota Tracker
 * to run: node cli.js showQuota
 */
const fs = require('fs');
const path = './quotaUsage.json';

// Initialize quota usage file if it doesn't exist
if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify({ usage: 0 }, null, 2));
}

// Update quota usage
const updateQuotaUsage = (points) => {
  const quotaData = JSON.parse(fs.readFileSync(path));
  quotaData.usage += points;
  fs.writeFileSync(path, JSON.stringify(quotaData, null, 2));
};

// Log quota usage
const logQuotaUsage = (endpoint, points) => {
  updateQuotaUsage(points);
  const quotaData = JSON.parse(fs.readFileSync(path));
};

// Display quota usage
const displayQuotaUsage = () => {
  const quotaData = JSON.parse(fs.readFileSync(path));
  console.log(`
  ==========================
  Quota Tracker
  ==========================
  Total Quota Used: ${quotaData.usage}
  Remaining Quota: ${10000 - quotaData.usage}
  Quota Percentage: ${((quotaData.usage / 10000) * 100).toFixed(2)}%
  ==========================
  `);
};

// Export functions
module.exports = { logQuotaUsage, displayQuotaUsage };
