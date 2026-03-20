#!/usr/bin/env node

const lib = require('./lib');

async function manageMessage() {
  // Parse arguments
  const args = process.argv.slice(2).reduce((acc, arg) => {
    if (!arg.startsWith('--')) {
      acc.messageId = arg;
    } else {
      const [key, value] = arg.replace(/^--/, '').split('=');
      acc[key] = value || true;
    }
    return acc;
  }, {});

  if (!args.messageId) {
    console.error('Usage: node manage.js <message-id> [--mark-read] [--mark-unread] [--archive] [--delete] [--star] [--unstar] [--account=name]');
    process.exit(1);
  }

  const accountName = lib.getAccountName(args.account);
  const messageId = args.messageId;
  
  // Determine action
  const actions = [];
  
  if (args['mark-read']) {
    actions.push({ type: 'modify', addLabels: [], removeLabels: ['UNREAD'] });
  }
  if (args['mark-unread']) {
    actions.push({ type: 'modify', addLabels: ['UNREAD'], removeLabels: [] });
  }
  if (args.archive) {
    actions.push({ type: 'modify', addLabels: [], removeLabels: ['INBOX'] });
  }
  if (args.star) {
    actions.push({ type: 'modify', addLabels: ['STARRED'], removeLabels: [] });
  }
  if (args.unstar) {
    actions.push({ type: 'modify', addLabels: [], removeLabels: ['STARRED'] });
  }
  if (args.delete) {
    actions.push({ type: 'trash' });
  }
  
  if (actions.length === 0) {
    console.error('Error: No action specified. Use --mark-read, --mark-unread, --archive, --delete, --star, or --unstar');
    process.exit(1);
  }
  
  // Execute actions
  for (const action of actions) {
    if (action.type === 'modify') {
      const body = {};
      if (action.addLabels.length > 0) body.addLabelIds = action.addLabels;
      if (action.removeLabels.length > 0) body.removeLabelIds = action.removeLabels;
      
      await lib.apiRequest(
        'POST',
        `/gmail/v1/users/me/messages/${messageId}/modify`,
        accountName,
        body
      );
      
      const actionDesc = [
        ...action.addLabels.map(l => `+${l}`),
        ...action.removeLabels.map(l => `-${l}`)
      ].join(', ');
      
      console.log(`✓ Modified message: ${actionDesc}`);
    } else if (action.type === 'trash') {
      await lib.apiRequest(
        'POST',
        `/gmail/v1/users/me/messages/${messageId}/trash`,
        accountName
      );
      
      console.log(`✓ Moved message to trash`);
    }
  }
  
  console.log(`\nAccount: ${accountName}`);
  console.log(`Message ID: ${messageId}`);
}

manageMessage().catch(error => {
  console.error('Error:', error.message);
  if (error.response) {
    console.error('Details:', JSON.stringify(error.response, null, 2));
  }
  process.exit(1);
});
