const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const AUTH_DIR = path.join(process.env.HOME, '.gmail-auth');
const CREDENTIALS_PATH = path.join(AUTH_DIR, 'credentials.json');
const CONFIG_PATH = path.join(AUTH_DIR, 'config.json');

// Ensure auth directory exists
function ensureAuthDir() {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }
}

// Load credentials
function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(`Credentials not found at ${CREDENTIALS_PATH}. Run setup first.`);
  }
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
}

// Load config
function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Config not found at ${CONFIG_PATH}. See references/SETUP.md`);
  }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

// Get account name (use provided or default from config)
function getAccountName(providedAccount) {
  const config = loadConfig();
  const accountName = providedAccount || config.default;
  
  if (!config.accounts[accountName]) {
    throw new Error(`Account "${accountName}" not found in config`);
  }
  
  return accountName;
}

// Load tokens for account
function loadTokens(accountName) {
  const tokenPath = path.join(AUTH_DIR, `tokens-${accountName}.json`);
  if (!fs.existsSync(tokenPath)) {
    throw new Error(`Tokens not found for account "${accountName}". Run: node scripts/auth.js --account=${accountName}`);
  }
  return JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
}

// Save tokens for account
function saveTokens(accountName, tokens) {
  const tokenPath = path.join(AUTH_DIR, `tokens-${accountName}.json`);
  fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
}

// Refresh access token if needed
async function refreshAccessToken(credentials, tokens, accountName) {
  const payload = new URLSearchParams({
    client_id: credentials.installed.client_id,
    client_secret: credentials.installed.client_secret,
    refresh_token: tokens.refresh_token,
    grant_type: 'refresh_token'
  });

  const response = await httpsRequest('POST', 'oauth2.googleapis.com', '/token', {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(payload.toString())
  }, payload.toString());

  const newTokens = { ...tokens, ...response };
  saveTokens(accountName, newTokens);
  return newTokens;
}

// Make authenticated API request
async function apiRequest(method, path, accountName, body = null, headers = {}) {
  const credentials = loadCredentials();
  let tokens = loadTokens(accountName);
  
  // Check if token is expired (with 5 min buffer)
  if (tokens.expiry_date && tokens.expiry_date < Date.now() + 300000) {
    tokens = await refreshAccessToken(credentials, tokens, accountName);
  }
  
  const requestHeaders = {
    'Authorization': `Bearer ${tokens.access_token}`,
    'Content-Type': 'application/json',
    ...headers
  };
  
  if (body) {
    requestHeaders['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
  }
  
  try {
    return await httpsRequest(method, 'gmail.googleapis.com', path, requestHeaders, body ? JSON.stringify(body) : null);
  } catch (error) {
    // If 401, try refreshing token once
    if (error.statusCode === 401) {
      tokens = await refreshAccessToken(credentials, tokens, accountName);
      requestHeaders['Authorization'] = `Bearer ${tokens.access_token}`;
      return await httpsRequest(method, 'gmail.googleapis.com', path, requestHeaders, body ? JSON.stringify(body) : null);
    }
    throw error;
  }
}

// Generic HTTPS request helper
function httpsRequest(method, hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path,
      method,
      headers
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            const error = new Error(parsed.error?.message || `HTTP ${res.statusCode}`);
            error.statusCode = res.statusCode;
            error.response = parsed;
            reject(error);
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        }
      });
    });
    
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// Decode base64url
function decodeBase64Url(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64').toString('utf8');
}

// Encode base64url
function encodeBase64Url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

module.exports = {
  ensureAuthDir,
  loadCredentials,
  loadConfig,
  getAccountName,
  loadTokens,
  saveTokens,
  apiRequest,
  httpsRequest,
  decodeBase64Url,
  encodeBase64Url,
  AUTH_DIR,
  CREDENTIALS_PATH,
  CONFIG_PATH
};
