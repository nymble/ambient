# Gmail Integration Skill

I've built you a complete Gmail integration skill with full multi-account support.

## What You Have

**Location:** `/root/workspace/gmail/`

**Package:** `/root/workspace/gmail.skill.tar.gz` (ready to install)

**Features:**
- ✓ Read inbox across multiple accounts
- ✓ Search emails with powerful Gmail query syntax
- ✓ Send emails
- ✓ Manage messages (mark read, archive, star, delete)
- ✓ Multi-account support with easy switching

## Quick Start

### 1. Set Up OAuth2 Credentials

You need Google Cloud credentials first. Open `/root/workspace/gmail/references/SETUP.md` for the complete guide.

**TL;DR:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable Gmail API
4. Create OAuth2 desktop credentials
5. Download JSON as `~/.gmail-auth/credentials.json`

### 2. Configure Your Accounts

Create `~/.gmail-auth/config.json`:

```json
{
  "default": "personal",
  "accounts": {
    "personal": {
      "email": "your.email@gmail.com"
    },
    "work": {
      "email": "work@company.com"
    }
  }
}
```

### 3. Authorize Each Account

```bash
cd /root/workspace/gmail
node scripts/auth.js --account=personal
node scripts/auth.js --account=work
```

This opens a browser for Google OAuth. Grant permissions, and tokens are saved automatically.

### 4. Test It

```bash
# List recent emails
node scripts/list.js --account=personal --max=5

# Search across all accounts
node scripts/search-all.js --query="is:unread"

# Read a specific message
node scripts/read.js <message-id> --account=personal

# Send an email
node scripts/send.js --to="friend@example.com" --subject="Hello" --body="Test message" --account=personal
```

## Using With OpenClaw

Once installed as a skill, just ask me:
- "Check my inbox"
- "Show unread emails from my work account"
- "Search all my emails for 'invoice'"
- "Send an email to..."
- "Archive that message"

I'll automatically use the Gmail scripts when you ask email-related questions.

## Files Included

```
gmail/
├── SKILL.md              # Main skill documentation
├── references/
│   ├── SETUP.md         # OAuth2 setup guide
│   └── API.md           # Gmail API reference
└── scripts/
    ├── lib.js           # Shared library (OAuth, API calls)
    ├── auth.js          # Authorization flow
    ├── list.js          # List messages
    ├── read.js          # Read message content
    ├── send.js          # Send email
    ├── manage.js        # Manage messages
    └── search-all.js    # Search across accounts
```

## Next Steps

1. **Complete OAuth setup** (see `gmail/references/SETUP.md`)
2. **Authorize your accounts** (run `auth.js` for each)
3. **Test the scripts** manually to verify everything works
4. **Install the skill** in OpenClaw (copy to skills directory or install from tarball)
5. **Ask me to check your email** and I'll handle it automatically

## Installation

To install this skill in OpenClaw:

```bash
# Option 1: Copy to skills directory
cp -r /root/workspace/gmail /path/to/openclaw/skills/

# Option 2: Extract tarball to skills directory
cd /path/to/openclaw/skills/
tar -xzf /root/workspace/gmail.skill.tar.gz
```

Then restart OpenClaw gateway to load the skill.

## Important Notes

- **Privacy**: All OAuth tokens are stored locally in `~/.gmail-auth/`
- **Security**: Never share your credentials.json or token files
- **Rate Limits**: Gmail API has quotas (see `gmail/references/API.md`)
- **Multi-account**: Use `--account=name` flag to specify which account

---

That's it! Once OAuth is set up, you can ask me to handle your email and I'll use these scripts automatically. The setup takes about 15 minutes the first time, then it's seamless forever.

Let me know when you're ready to set up the OAuth credentials and I'll walk you through it step by step.
