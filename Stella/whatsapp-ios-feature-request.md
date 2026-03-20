# Feature Request: WhatsApp QR Login in iOS App

## Problem
Currently, linking WhatsApp to OpenClaw requires running `openclaw channels login` in a terminal, which generates a QR code. This is problematic for users who:

- Access their gateway via managed/cloud deployment (no SSH access)
- Only have mobile devices (iOS/Android)
- Use the iOS app without computer access

The current workflow forces users to:
1. SSH into the server (requires credentials they may not have)
2. Run CLI commands (not accessible from iOS)
3. Display terminal QR codes (can't be scanned from same device)

## Proposed Solution

Add **WhatsApp channel linking directly in the iOS app** with one of these approaches:

### Option 1: In-App QR Display (Preferred)
- Add "Link WhatsApp" button in iOS app settings
- App makes WebSocket call to gateway: `web.login.start` method
- Gateway returns scannable QR code data
- App displays QR code on screen
- User scans with WhatsApp on another device OR uses camera roll trick

### Option 2: Web Interface Integration
- Gateway's Control UI (port 18789) already exists
- Add WhatsApp channel management page to Control UI
- Include "Link WhatsApp" button that displays QR
- iOS app can open this in a web view or Safari
- User scans QR from web interface

### Option 3: Push QR to Paired Device
- iOS app requests WhatsApp login
- Gateway generates QR and pushes it to iOS via node notification
- iOS displays the QR code in a notification or full-screen overlay
- User scans with WhatsApp

## Current Workaround (Not Ideal)
Users currently must:
- Install SSH client (Termius) on iPhone
- Obtain SSH credentials for their server
- SSH in and run `openclaw channels login`
- Take screenshot of terminal QR
- Scan screenshot from another device

This is complex and breaks the "just works" iOS app experience.

## Related Gateway Methods
The gateway already exposes these WebSocket methods (per the plugin code):
- `web.login.start` - Start WhatsApp login flow
- `web.login.wait` - Wait for QR scan completion

These should be accessible to iOS clients but currently aren't exposed in the UI.

## Benefits
- Seamless onboarding for mobile-first users
- No need for SSH access or terminal knowledge
- Aligns with iOS app's "QuickClaw" branding (quick setup)
- Reduces support burden for managed deployments
- Better UX for non-technical users

## User Story
> "As an iOS app user without computer access, I want to link my WhatsApp account directly from the app, so I can start chatting with my assistant without needing SSH or terminal access."

## Platform
- **Affected**: iOS app, Android app (potentially)
- **Gateway**: Already supports the backend via Baileys + WS methods
- **Missing**: Frontend UI to trigger and display the QR

## Priority
**High** - This is a significant UX blocker for mobile-first and managed deployment users.

---

**Environment:**
- OpenClaw version: 2026.2.6-3
- Platform: iOS (quickclaw.app managed deployment)
- Current workaround: SSH + terminal (not feasible for many users)

cc: @openclaw/maintainers
