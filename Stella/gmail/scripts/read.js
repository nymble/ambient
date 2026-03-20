#!/usr/bin/env node

const lib = require('./lib');

async function readMessage() {
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
    console.error('Usage: node read.js <message-id> [--account=name]');
    process.exit(1);
  }

  const accountName = lib.getAccountName(args.account);
  
  // Fetch full message
  const msg = await lib.apiRequest(
    'GET',
    `/gmail/v1/users/me/messages/${args.messageId}?format=full`,
    accountName
  );
  
  // Parse headers
  const headers = msg.payload.headers.reduce((acc, h) => {
    acc[h.name.toLowerCase()] = h.value;
    return acc;
  }, {});
  
  // Display message
  console.log(`\n=== EMAIL MESSAGE ===\n`);
  console.log(`From: ${headers.from || 'unknown'}`);
  console.log(`To: ${headers.to || 'unknown'}`);
  if (headers.cc) console.log(`Cc: ${headers.cc}`);
  console.log(`Date: ${headers.date || 'unknown'}`);
  console.log(`Subject: ${headers.subject || '(no subject)'}`);
  console.log(`\nMessage ID: ${msg.id}`);
  console.log(`Thread ID: ${msg.threadId}`);
  console.log(`Labels: ${msg.labelIds ? msg.labelIds.join(', ') : 'none'}`);
  console.log(`\n--- MESSAGE BODY ---\n`);
  
  // Extract body
  const body = extractBody(msg.payload);
  console.log(body);
  
  // List attachments
  const attachments = extractAttachments(msg.payload);
  if (attachments.length > 0) {
    console.log(`\n--- ATTACHMENTS (${attachments.length}) ---\n`);
    attachments.forEach((att, idx) => {
      console.log(`${idx + 1}. ${att.filename} (${att.mimeType}, ${Math.round(att.size / 1024)}KB)`);
      console.log(`   Attachment ID: ${att.attachmentId}`);
    });
  }
  
  console.log('\n====================\n');
}

function extractBody(payload) {
  // If body has data, decode it
  if (payload.body && payload.body.data) {
    return lib.decodeBase64Url(payload.body.data);
  }
  
  // Otherwise, search parts for text/plain or text/html
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body && part.body.data) {
        return lib.decodeBase64Url(part.body.data);
      }
    }
    
    for (const part of payload.parts) {
      if (part.mimeType === 'text/html' && part.body && part.body.data) {
        return lib.decodeBase64Url(part.body.data);
      }
    }
    
    // Recursively search multipart
    for (const part of payload.parts) {
      if (part.mimeType.startsWith('multipart/')) {
        const body = extractBody(part);
        if (body) return body;
      }
    }
  }
  
  return '(no body found)';
}

function extractAttachments(payload, attachments = []) {
  if (payload.filename && payload.body && payload.body.attachmentId) {
    attachments.push({
      filename: payload.filename,
      mimeType: payload.mimeType,
      size: payload.body.size,
      attachmentId: payload.body.attachmentId
    });
  }
  
  if (payload.parts) {
    payload.parts.forEach(part => extractAttachments(part, attachments));
  }
  
  return attachments;
}

readMessage().catch(error => {
  console.error('Error:', error.message);
  if (error.response) {
    console.error('Details:', JSON.stringify(error.response, null, 2));
  }
  process.exit(1);
});
