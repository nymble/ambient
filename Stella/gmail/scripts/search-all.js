#!/usr/bin/env node

const lib = require('./lib');

async function searchAll() {
  // Parse arguments
  const args = process.argv.slice(2).reduce((acc, arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    acc[key] = value || true;
    return acc;
  }, {});

  if (!args.query) {
    console.error('Usage: node search-all.js --query="search terms" [--max=20]');
    process.exit(1);
  }

  const query = args.query;
  const maxResults = parseInt(args.max || '20', 10);
  const config = lib.loadConfig();
  const accountNames = Object.keys(config.accounts);
  
  console.log(`Searching ${accountNames.length} account(s) for: "${query}"\n`);
  
  // Search each account
  const results = [];
  
  for (const accountName of accountNames) {
    try {
      console.log(`Searching ${accountName}...`);
      
      const queryParams = new URLSearchParams({
        q: query,
        maxResults: maxResults.toString()
      });
      
      const response = await lib.apiRequest(
        'GET',
        `/gmail/v1/users/me/messages?${queryParams.toString()}`,
        accountName
      );
      
      if (response.messages && response.messages.length > 0) {
        // Fetch message details
        const messageDetails = await Promise.all(
          response.messages.map(msg =>
            lib.apiRequest('GET', `/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`, accountName)
          )
        );
        
        results.push({
          account: accountName,
          messages: messageDetails
        });
      }
    } catch (error) {
      console.log(`  ⚠ Failed to search ${accountName}: ${error.message}`);
    }
  }
  
  console.log('\n=== RESULTS ===\n');
  
  if (results.length === 0) {
    console.log('No messages found across any accounts.');
    return;
  }
  
  let totalCount = 0;
  
  results.forEach(result => {
    console.log(`\n--- ${result.account.toUpperCase()} (${result.messages.length} results) ---\n`);
    
    result.messages.forEach((msg, idx) => {
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
      console.log(`   Account: ${result.account}`);
      console.log(`   Snippet: ${msg.snippet || ''}`);
      console.log();
      
      totalCount++;
    });
  });
  
  console.log(`\nTotal: ${totalCount} message(s) across ${results.length} account(s)`);
}

searchAll().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
