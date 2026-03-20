# Gmail API Reference

## Rate Limits

- **Quota**: 1 billion quota units per day (per project)
- **Per-user rate limit**: 250 quota units per user per second

### Quota Costs

| Operation | Quota Cost |
|-----------|------------|
| List messages | 5 |
| Get message | 5 |
| Send message | 100 |
| Modify message | 5 |
| Delete message | 10 |

Typical usage rarely hits limits unless doing bulk operations.

## Common Query Syntax

### Basic Operators

- `from:user@example.com` - From address
- `to:user@example.com` - To address
- `subject:meeting` - Subject contains text
- `label:inbox` - Messages in label
- `is:unread` - Unread messages
- `is:read` - Read messages
- `is:starred` - Starred messages
- `has:attachment` - Has attachments
- `filename:pdf` - Specific file type

### Date Filters

- `after:2024/01/01` - After date
- `before:2024/12/31` - Before date
- `older_than:1d` - Older than 1 day (d=day, m=month, y=year)
- `newer_than:2d` - Newer than 2 days

### Combinations

Use space for AND, OR for alternatives:

- `from:boss@company.com is:unread` - Unread from boss
- `subject:(invoice OR receipt)` - Invoice or receipt in subject
- `from:user@example.com has:attachment` - From user with attachment

## Message Format

Messages are returned in RFC 2822 format. Key fields:

```json
{
  "id": "187a1b2c3d4e5f6g",
  "threadId": "187a1b2c3d4e5f6g",
  "labelIds": ["INBOX", "UNREAD"],
  "snippet": "Preview text...",
  "payload": {
    "headers": [
      {"name": "From", "value": "sender@example.com"},
      {"name": "Subject", "value": "Email subject"},
      {"name": "Date", "value": "Mon, 9 Feb 2026 21:00:00 -0800"}
    ],
    "body": {
      "data": "base64-encoded-content"
    },
    "parts": []
  }
}
```

## Scopes Required

This skill uses:

- `https://www.googleapis.com/auth/gmail.modify` - Read and modify (not delete)
- `https://www.googleapis.com/auth/gmail.send` - Send email

## API Endpoints

- List: `GET /gmail/v1/users/me/messages`
- Get: `GET /gmail/v1/users/me/messages/{id}`
- Send: `POST /gmail/v1/users/me/messages/send`
- Modify: `POST /gmail/v1/users/me/messages/{id}/modify`
- Trash: `POST /gmail/v1/users/me/messages/{id}/trash`

Full documentation: https://developers.google.com/gmail/api/reference/rest
