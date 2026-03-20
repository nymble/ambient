#!/usr/bin/env node

const http = require('http');
const { URL } = require('url');
const lib = require('./lib');

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.send'
];

const REDIRECT_URI = 'http://localhost:8888';

async function authorize() {
  // Parse arguments
  const args = process.argv.slice(2).reduce((acc, arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    acc[key] = value || true;
    return acc;
  }, {});

  const accountName = args.account || lib.loadConfig().default;
  
  console.log(`\nAuthorizing account: ${accountName}`);
  console.log('---');
  
  lib.ensureAuthDir();
  const credentials = lib.loadCredentials();
  const client = credentials.installed;
  
  // Build authorization URL
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', client.client_id);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', SCOPES.join(' '));
  authUrl.searchParams.set('access_type', 'offline');
  // authUrl.searchParams.set('prompt', 'consent');
  
  console.log('Open this URL in your browser:\n');
  console.log(authUrl.toString());
  console.log('\nWaiting for authorization...\n');
  
  // Start local server to receive callback
  const code = await new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, REDIRECT_URI);
      
      if (url.pathname === '/') {
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');
        
        if (error) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<h1>Authorization failed</h1><p>You can close this window.</p>');
          server.close();
          reject(new Error(`Authorization failed: ${error}`));
        } else if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<h1>Authorization successful!</h1><p>You can close this window and return to the terminal.</p>');
          server.close();
          resolve(code);
        }
      }
    });
    
    server.listen(8888, () => {
      console.log('Local server listening on port 8888...');
    });
    
    server.on('error', reject);
  });
  
  // Exchange code for tokens
  const payload = new URLSearchParams({
    code,
    client_id: client.client_id,
    client_secret: client.client_secret,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code'
  });
  
  const tokens = await lib.httpsRequest(
    'POST',
    'oauth2.googleapis.com',
    '/token',
    {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(payload.toString())
    },
    payload.toString()
  );
  
  // Add expiry date
  tokens.expiry_date = Date.now() + (tokens.expires_in * 1000);
  
  // Save tokens
  lib.saveTokens(accountName, tokens);
  
  console.log(`✓ Authorization successful for account: ${accountName}`);
  console.log(`Tokens saved to: ${lib.AUTH_DIR}/tokens-${accountName}.json`);
  console.log('\nYou can now use the Gmail scripts with this account.');
}

authorize().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
