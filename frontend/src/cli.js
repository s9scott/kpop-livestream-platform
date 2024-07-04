/**
 * CLI for quota tracker
 */

const { displayQuotaUsage } = require('./quotaTracker');

const handleCommand = (command) => {
  switch (command) {
    case 'showQuota':
      displayQuotaUsage();
      break;
    default:
      console.log('Unknown command');
      break;
  }
};

const command = process.argv[2];
handleCommand(command);
