#!/usr/bin/env node

const lib = require('./lib');
const fs = require('fs');
const path = require('path');

async function sendMessageWithAttachment() {
  // Parse arguments
  const args = process.argv.slice(2).reduce((acc, arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    acc[key] = value || true;
    return acc;
  }, {});

  if (!args.to || !args.subject || !args.body || !args.attachment) {
    console.error('Usage: node send-attachment.js --to="email@example.com" --subject="Subject" --body="Body" --attachment="/path/to/file" [--account=name]');
    process.exit(1);
  }

  const accountName = lib.getAccountName(args.account);
  const config = lib.loadConfig();
  const fromEmail = config.accounts[accountName].email;
  
  // Read attachment
  const attachmentPath = args.attachment;
  const attachmentName = path.basename(attachmentPath);
  const attachmentData = fs.readFileSync(attachmentPath);
  const attachmentBase64 = attachmentData.toString('base64');
  
  // Detect MIME type
  const ext = path.extname(attachmentName).toLowerCase();
  const mimeTypes = {
    '.txt': 'text/plain',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.zip': 'application/zip',
    '.tar': 'application/x-tar',
    '.gz': 'application/gzip',
    '.tgz': 'application/gzip',
  };
  const mimeType = mimeTypes[ext] || 'application/octet-stream';
  
  // Build multipart MIME email
  const boundary = '----=_Part_0_' + Date.now() + '.' + Math.random();
  
  const lines = [
    `From: ${fromEmail}`,
    `To: ${args.to}`,
    `Subject: ${args.subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    '',
    args.body,
    '',
    `--${boundary}`,
    `Content-Type: ${mimeType}; name="${attachmentName}"`,
    'Content-Transfer-Encoding: base64',
    `Content-Disposition: attachment; filename="${attachmentName}"`,
    '',
    attachmentBase64,
    '',
    `--${boundary}--`
  ];
  
  const email = lines.join('\r\n');
  const encodedEmail = lib.encodeBase64Url(email);
  
  // Send message
  console.log(`Sending email from account: ${accountName} (${fromEmail})`);
  console.log(`To: ${args.to}`);
  console.log(`Subject: ${args.subject}`);
  console.log(`Attachment: ${attachmentName} (${attachmentData.length} bytes)\n`);
  
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

sendMessageWithAttachment().catch(error => {
  console.error('Error:', error.message);
  if (error.response) {
    console.error('Details:', JSON.stringify(error.response, null, 2));
  }
  process.exit(1);
});
