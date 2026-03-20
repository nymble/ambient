# Gmail OAuth2 Setup Guide

## Overview

The Gmail skill uses OAuth2 for secure authentication. You need to:
1. Create a Google Cloud project
2. Enable Gmail API
3. Create OAuth2 credentials
4. Authorize each Gmail account

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it (e.g., "OpenClaw Gmail")
4. Click "Create"

## Step 2: Enable Gmail API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Gmail API"
3. Click "Enable"

## Step 3: Create OAuth2 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure OAuth consent screen:
   - User Type: External
   - App name: OpenClaw Gmail
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `https://www.googleapis.com/auth/gmail.modify` and `https://www.googleapis.com/auth/gmail.send`
   - Test users: Add your Gmail addresses
   - Save
4. Back to "Create OAuth client ID":
   - Application type: Desktop app
   - Name: OpenClaw
   - Click "Create"
5. Download the JSON file (click download icon)
6. Save as `~/.gmail-auth/credentials.json`

## Step 4: Create Config File

Create `~/.gmail-auth/config.json`:

```json
{
  "default": "personal",
  "accounts": {
    "personal": {
      "email": "your.email@gmail.com"
    },
    "work": {
      "email": "work.email@company.com"
    }
  }
}
```

Adjust account names and emails as needed.

## Step 5: Authorize Accounts

Run the auth script for each account:

```bash
node scripts/auth.js --account=personal
node scripts/auth.js --account=work
```

Each will:
1. Open a browser to Google OAuth
2. Ask you to log in and authorize
3. Save tokens to `~/.gmail-auth/tokens-<account>.json`

## Verification

Test with:

```bash
node scripts/list.js --account=personal --max=5
```

Should list your 5 most recent emails.

## Troubleshooting

**"invalid_grant" error**: Tokens expired, re-run `auth.js`
**"insufficient permissions" error**: Check OAuth scopes in Cloud Console
**No accounts found**: Verify config.json exists and is valid JSON
**Browser doesn't open**: Copy the URL from terminal and open manually
