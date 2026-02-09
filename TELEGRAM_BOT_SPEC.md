# Telegram → ClaudeBot Ticket Parsing Specification

## Overview

This document defines how the Telegram PM bot should parse group chat messages and convert them into structured tickets for the ClaudeBot (EC2) to process.

---

## Message Format

### Standard Ticket Creation

```
@listcart ticket: <description>
```

**Example:**
```
@listcart ticket: Add a loading spinner to the cart search box when searching
```

### Ticket with Type

```
@listcart ticket:<type> <description>
```

**Types:**
- `ui` - Frontend/visual changes
- `api` - Backend/API changes
- `feature` - New functionality
- `fix` - Bug fixes
- `docs` - Documentation
- `style` - CSS/Tailwind only
- `refactor` - Code cleanup

**Example:**
```
@listcart ticket:ui Make the pricing cards have a subtle hover animation
```

### Ticket with Priority

```
@listcart ticket:<type>:<priority> <description>
```

**Priorities:**
- `urgent` - Do immediately, interrupt current work
- `high` - Next in queue
- `normal` - Standard queue (default)
- `low` - When time permits

**Example:**
```
@listcart ticket:fix:urgent The checkout button is broken on mobile
```

---

## Auto-Risk Classification

The bot should auto-assign risk levels based on keywords in the description:

### HIGH Risk (requires human approval)
Keywords: `schema`, `prisma`, `database`, `auth`, `payment`, `stripe`, `api route`, `delete`, `drop`, `migration`

### MEDIUM Risk (proceed with caution)
Keywords: `api`, `server action`, `form`, `validation`, `state`, `context`

### LOW Risk (auto-proceed)
Keywords: `css`, `tailwind`, `color`, `spacing`, `text`, `copy`, `typo`, `icon`, `animation`

---

## Ticket File Generation

When a valid ticket message is received, generate a markdown file:

### Filename
```
TICKET-{NNNN}.md
```

Where `{NNNN}` is the next sequential number (zero-padded to 4 digits).

### File Structure

```markdown
id: TICKET-{NNNN}
status: ready_for_dev
type: {type}
risk: {auto-detected risk}
priority: {priority}
created: {ISO timestamp}
source: telegram
author: {telegram username}

## Goal
{First sentence of description}

## Requirements
{Full description}

## Acceptance Criteria
- [ ] Change implemented
- [ ] Build passes
- [ ] Deployed to production
```

---

## Conversation Threading

### Multi-message tickets

If a user sends multiple messages in quick succession (within 60 seconds), concatenate them:

```
@listcart ticket: I want to add a feature
where users can see their recent carts
on the homepage
maybe with status indicators
```

→ Combines into single ticket with full description.

### Ticket Amendments

```
@listcart amend TICKET-0017: Also make it show the total value
```

→ Appends to existing ticket's requirements.

### Ticket Status Updates

```
@listcart status TICKET-0017 in_progress
```

Valid statuses:
- `ready_for_dev`
- `in_progress`
- `blocked`
- `done`
- `cancelled`

---

## Bot Responses

### Ticket Created
```
✅ Created TICKET-{NNNN}
Type: {type} | Risk: {risk} | Priority: {priority}

"{first 50 chars of description}..."

ClaudeBot will pick this up shortly.
```

### Ticket Status Changed
```
📋 TICKET-{NNNN} → {new_status}
```

### Error Responses
```
❌ Could not parse ticket. Use format:
@listcart ticket: <description>
```

---

## Group Chat Commands

### List Open Tickets
```
@listcart list
```
→ Shows last 10 open tickets with status

### Get Ticket Details
```
@listcart show TICKET-0017
```
→ Shows full ticket content

### Check Bot Status
```
@listcart status
```
→ Shows:
- Queue length
- Current ticket being processed
- Last deployment time
- ClaudeBot health

### Force Redeploy
```
@listcart deploy
```
→ Triggers Vercel redeploy (admin only)

---

## Integration Points

### 1. Telegram Bot (Python/Node)
- Listens to group chat
- Parses messages matching `@listcart` pattern
- Creates ticket files locally
- Commits and pushes to GitHub

### 2. GitHub Repository
- Receives ticket files in `/tickets/` directory
- Auto-triggers Vercel preview (if enabled)

### 3. EC2 ClaudeBot
- Watches `/tickets/` for `ready_for_dev` status
- Processes tickets in priority order
- Updates status to `in_progress` → `done`
- Commits changes to main
- Pushes to trigger Vercel deploy

### 4. Vercel
- Auto-deploys on push to main
- Provides preview URLs for PR-based workflow

---

## Example Workflow

```
1. [Telegram] User: @listcart ticket:ui Add a trust badge section showing Australian hosting

2. [Bot] Creates TICKET-0018.md:
   - type: ui
   - risk: low (detected: "section", "badge")
   - priority: normal

3. [Bot] Commits & pushes to GitHub

4. [Bot → Telegram] ✅ Created TICKET-0018
   Type: ui | Risk: low | Priority: normal
   "Add a trust badge section showing Austr..."

5. [EC2] ClaudeBot picks up TICKET-0018
   - Reads ticket
   - Locates relevant files (app/page.tsx)
   - Implements trust section
   - Runs build
   - Commits with "feat: TICKET-0018 - Add trust section"
   - Pushes to main

6. [Vercel] Auto-deploys

7. [Bot → Telegram] 🚀 TICKET-0018 deployed!
   Preview: https://listcart-prod.vercel.app
```

---

## Security Considerations

1. **Admin Commands**: `deploy`, `status`, ticket deletion should be admin-only
2. **Rate Limiting**: Max 10 tickets per user per hour
3. **Content Filtering**: Block tickets with suspicious keywords (drop, truncate, delete *)
4. **Audit Log**: Keep record of all ticket creations and who created them

---

## Future Enhancements

1. **Slack Integration**: Mirror to Slack channel
2. **Voice Notes**: Transcribe voice messages to tickets
3. **Screenshot Parsing**: OCR screenshots to extract bug reports
4. **AI Triage**: Auto-prioritize based on user sentiment
5. **Estimates**: AI-generated time estimates per ticket

