#!/usr/bin/env node

const lib = require('./lib');

async function listMessages() {
  // Parse arguments
  const args = process.argv.slice(2).reduce((acc, arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    acc[key] = value || true;
    return acc;
  }, {});

  const accountName = lib.getAccountName(args.account);
  const query = args.query || '';
  const maxResults = parseInt(args.max || '20', 10);
  
  // Build query string
  const queryParams = new URLSearchParams({
    maxResults: maxResults.toString()
  });
  
  if (query) {
    queryParams.set('q', query);
  }
  
  // List messages
  const response = await lib.apiRequest(
    'GET',
    `/gmail/v1/users/me/messages?${queryParams.toString()}`,
    accountName
  );
  
  if (!response.messages || response.messages.length === 0) {
    console.log('No messages found.');
    return;
  }
  
  console.log(`Found ${response.messages.length} message(s) for account: ${accountName}\n`);
  
  // Fetch details for each message (in parallel)
  const messageDetails = await Promise.all(
    response.messages.map(msg =>
      lib.apiRequest('GET', `/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`, accountName)
    )
  );
  
  // Display messages
  messageDetails.forEach((msg, idx) => {
    const headers = msg.payload.headers.reduce((acc, h) => {
      acc[h.name.toLowerCase()] = h.value;
      return acc;
    }, {});
    
    const isUnread = msg.labelIds && msg.labelIds.includes('UNREAD');
    const isStarred = msg.labelIds && msg.labelIds.includes('STARRED');
    const unreadMark = isUnread ? '[UNREAD] ' : '';
    const starMark = isStarred ? '⭐ ' : '';
    
    console.log(`${idx + 1}. ${starMark}${unreadMark}${headers.subject || '(no subject)'}`);
    console.log(`   From: ${headers.from || 'unknown'}`);
    console.log(`   Date: ${headers.date || 'unknown'}`);
    console.log(`   ID: ${msg.id}`);
    console.log(`   Snippet: ${msg.snippet || ''}`);
    console.log();
  });
  
  console.log(`---\nTotal: ${response.messages.length} message(s)`);
  if (response.resultSizeEstimate > response.messages.length) {
    console.log(`(${response.resultSizeEstimate - response.messages.length} more available - increase --max to see more)`);
  }
}

listMessages().catch(error => {
  console.error('Error:', error.message);
  if (error.response) {
    console.error('Details:', JSON.stringify(error.response, null, 2));
  }
  process.exit(1);
});
