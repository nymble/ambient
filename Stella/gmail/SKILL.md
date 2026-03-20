---
name: gmail
description: Full Gmail integration with multi-account support. Use when the user asks to check email, read inbox, search emails, send messages, manage emails (archive, delete, mark read/unread, star), or any Gmail-related task. Supports multiple Gmail accounts with account selection.
---

# Gmail Integration

Complete Gmail management with multi-account support via Gmail API.

## Prerequisites

Before using this skill, the user must complete OAuth2 setup. See [references/SETUP.md](references/SETUP.md).

## Available Actions

All scripts support `--account` flag to specify which account (uses default if omitted).

### List Messages

```bash
node scripts/list.js [--account=work] [--query="is:unread"] [--max=20]
```

Common queries:
- `is:unread` - Unread messages
- `from:person@example.com` - From specific sender
- `subject:invoice` - Subject contains text
- `after:2024/01/01` - Date filtering
- `has:attachment` - Has attachments
- `is:starred` - Starred messages

### Read Message

```bash
node scripts/read.js <message-id> [--account=work]
```

Returns full message content including body, attachments, headers.

### Send Message

```bash
node scripts/send.js --to="recipient@example.com" --subject="Subject" --body="Message body" [--account=work] [--cc="cc@example.com"] [--bcc="bcc@example.com"]
```

### Search Across All Accounts

```bash
node scripts/search-all.js --query="from:boss@company.com"
```

### Manage Messages

```bash
# Mark as read
node scripts/manage.js <message-id> --mark-read [--account=work]

# Mark as unread
node scripts/manage.js <message-id> --mark-unread [--account=work]

# Archive
node scripts/manage.js <message-id> --archive [--account=work]

# Delete
node scripts/manage.js <message-id> --delete [--account=work]

# Star
node scripts/manage.js <message-id> --star [--account=work]

# Unstar
node scripts/manage.js <message-id> --unstar [--account=work]
```

## Workflow

1. **Check inbox**: Use `list.js` with relevant query
2. **Read interesting messages**: Use `read.js` with message IDs from list
3. **Take action**: Send replies with `send.js` or manage with `manage.js`
4. **Search when needed**: Use `search-all.js` to find messages across accounts

## Multi-Account Usage

Account names are defined in `~/.gmail-auth/config.json` during setup. Common pattern:

- No `--account` flag: Uses default account
- `--account=work`: Uses work account
- `--account=personal`: Uses personal account

## Important Notes

- All scripts require OAuth2 credentials to be configured (see SETUP.md)
- Message IDs are returned by `list.js` and used by other scripts
- Gmail API has rate limits (check references/API.md)
- Attachments are base64 encoded when reading messages
