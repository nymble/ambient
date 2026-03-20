# TOOLS.md - Environment-Specific Notes

### Cron Jobs — CRITICAL

You MUST follow these rules EXACTLY when creating cron jobs. Any deviation will cause infinite error loops:

- **ALWAYS** use `sessionTarget: "isolated"` with `"kind": "agentTurn"`
- **ALWAYS** include `"delivery": { "mode": "none" }` at the job level — this is MANDATORY
- **NEVER** use `"delivery": { "mode": "announce" }` — there are NO channel adapters, so announce mode will error and loop endlessly
- **NEVER** omit the `delivery` field — it defaults to "announce" which will loop endlessly
- **NEVER** use `sessionTarget: "main"` — there is no HEARTBEAT.md file, so main-session cron jobs will fail with "empty-heartbeat-file" and loop endlessly
- The isolated job runs in its own session, then the output is broadcast over WebSocket to the iOS app

**Correct example — one-shot reminder:**
```json
{
  "name": "reminder",
  "schedule": { "kind": "at", "at": "2026-02-06T14:00:00Z" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "Remind the user: Hello! Time to check in."
  },
  "delivery": { "mode": "none" },
  "deleteAfterRun": true
}
```

**Correct example — recurring job (every day at 9am UTC):**
```json
{
  "name": "daily-brief",
  "schedule": { "kind": "cron", "expr": "0 9 * * *", "tz": "UTC" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "Give the user their daily morning briefing."
  },
  "delivery": { "mode": "none" }
}
```

**WRONG — will fail with empty-heartbeat-file and loop:**
```json
{
  "sessionTarget": "main",
  "payload": { "kind": "systemEvent", "text": "..." }
}
```

### Sharing Files with the User

When you create files and want the user to see/download them:

- **ALWAYS** output the full absolute path in your response (e.g. `/root/workspace/story.txt`)
- The proxy detects file paths in your response and converts them into downloadable links
- You can also use the MEDIA: prefix for explicit file references: `MEDIA: /root/workspace/image.png`
- Supported file types: .txt, .md, .json, .pdf, .csv, .html, .png, .jpg, .jpeg, .gif, .webp, .svg, .mp3, .wav, .mp4
- Files must be in /root/workspace/ or /tmp/ to be accessible

### Message Tool — DO NOT USE

- Do NOT use the `message` tool — there are no channel adapters configured
- All communication with the user happens through the gateway WebSocket only

### Environment

- This is a mobile iOS app connected via gateway WebSocket proxy
- No channel adapters are installed

<!-- quickclaw-managed-persistence-policy-v1 -->
### Storage Persistence Rules (Managed)

- Ephemeral paths (lost on container/image updates):
- `/usr/*`
- `/usr/local/*`
- `/opt/*`
- `/var/tmp/*`

- Persistent paths (survive updates; backed by mounted user volume):
- `/root/workspace/*`
- `/root/.local/*`
- `/root/.npm-global/*`
- `/root/.openclaw/*`

Rule: anything needed in future sessions must be stored under persistent `/root/*` paths.

