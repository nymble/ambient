#!/usr/bin/env node

const lib = require('./lib');
const fs = require('fs');
const path = require('path');

async function sendMessage() {
  // Parse arguments
  const args = process.argv.slice(2).reduce((acc, arg) => {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) {
      acc[match[1]] = match[2];
    } else {
      acc[arg.replace(/^--/, '')] = true;
    }
    return acc;
  }, {});

  if (!args.to || !args.subject || !args.body) {
    console.error('Usage: node send.js --to="email@example.com" --subject="Subject" --body="Body" [--attachment="/path/to/file"] [--cc="..."] [--bcc="..."] [--account=name]');
    process.exit(1);
  }

  const accountName = lib.getAccountName(args.account);
  const config = lib.loadConfig();
  const fromEmail = config.accounts[accountName].email;
  
  const boundary = `StellaBoundary_${Date.now().toString(16)}`;
  
  // Build RFC 2822 email with potential attachments
  let lines = [
    `From: ${fromEmail}`,
    `To: ${args.to}`
  ];
  
  if (args.cc) lines.push(`Cc: ${args.cc}`);
  if (args.bcc) lines.push(`Bcc: ${args.bcc}`);
  
  lines.push(`Subject: ${args.subject}`);
  lines.push('MIME-Version: 1.0');

  if (args.attachment) {
    lines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
    lines.push('');
    lines.push(`--${boundary}`);
    lines.push('Content-Type: text/plain; charset=UTF-8');
    lines.push('');
    lines.push(args.body);
    
    // Process attachment
    const filePath = path.resolve(args.attachment);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Attachment not found: ${filePath}`);
    }
    
    const fileName = path.basename(filePath);
    const fileContent = fs.readFileSync(filePath).toString('base64');
    
    lines.push(`--${boundary}`);
    lines.push(`Content-Type: application/octet-stream; name="${fileName}"`);
    lines.push('Content-Transfer-Encoding: base64');
    lines.push(`Content-Disposition: attachment; filename="${fileName}"`);
    lines.push('');
    lines.push(fileContent);
    lines.push(`--${boundary}--`);
  } else {
    lines.push('Content-Type: text/plain; charset=UTF-8');
    lines.push('');
    lines.push(args.body);
  }
  
  const email = lines.join('\r\n');
  const encodedEmail = lib.encodeBase64Url(email);
  
  // Send message
  console.log(`Sending email from account: ${accountName} (${fromEmail})`);
  console.log(`To: ${args.to}`);
  console.log(`Subject: ${args.subject}`);
  if (args.attachment) console.log(`Attachment: ${args.attachment}`);
  console.log('');
  
  const response = await lib.apiRequest(
    'POST',
    '/gmail/v1/users/me/messages/send',
    accountName,
    { raw: encodedEmail }
  );
  
  console.log(`✓ Email sent successfully!`);
  console.log(`Message ID: ${response.id}`);
  console.log(`Thread ID: ${response.threadId}`);
}

sendMessage().catch(error => {
  console.error('Error:', error.message);
  if (error.response) {
    console.error('Details:', JSON.stringify(error.response, null, 2));
  }
  process.exit(1);
});
