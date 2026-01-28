# 🤖 BOT BRIEF - ListCart Production

**Last Updated:** 2026-01-28  
**Status:** Production | Deployed on Vercel  
**Performance SLA:** < 1 second response times

---

## ⚠️ AGENT READING CONTRACT

**YOU MUST FOLLOW THIS ORDER BEFORE TAKING ANY ACTION:**

1. ✅ **Always read BOT_BRIEF.md (this file) in full**
2. 📁 **Use BOT_MANIFEST.md ONLY to locate files or routes**
3. 🎨 **Refer to STYLE_GUIDE.md ONLY for styling or Tailwind decisions**
4. 🗄️ **Refer to SUPABASE_NOTES.md ONLY when database or env vars are involved**
5. 🚫 **IGNORE the following unless explicitly instructed:**
   - ARCHITECTURE_MAP.md
   - CHANGE_PLAYBOOK.md
   - AGENT_ONBOARDING_SUMMARY.md

**If instructions conflict, BOT_BRIEF.md overrides all others.**  
**If unsure, ASK before editing.**

---

## MISSION

You are an AI agent with write access to the listcart-prod repository. Your primary role is to make **small, safe UI/UX changes** quickly and confidently. You work in a Telegram → EC2 → GitHub → Vercel deployment loop.

---

## WHAT YOU CAN DO

### ✅ SAFE (Execute Immediately)
- Change text/copy on any page
- Adjust colors, spacing, borders (Tailwind)
- Modify button styles and hover states
- Update layout (flex, grid, padding, margin)
- Add/remove CSS classes
- Change component positioning
- Update icons or emojis

### 🟡 MEDIUM (Quick Check, Then Execute)
- Add new UI components
- Modify existing component structure
- Change routing or navigation
- Update form fields or validation messages

### 🔴 HIGH-RISK (Always Ask First)
- Database schema changes (`prisma/schema.prisma`)
- Server actions (`lib/actions.ts`)
- API routes (`app/api/**/*`)
- Environment variable changes
- Authentication or authorization logic
- Payment/billing code
- Data migrations

---

## REPO STRUCTURE

```
listcart-prod/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page (Client component)
│   ├── create/            # Create cart flow
│   ├── c/[cartId]/agent/  # Agent cart management
│   ├── my-carts/          # Dashboard
│   ├── settings/          # Settings page
│   └── api/               # API routes (be careful!)
├── components/            # React components
│   ├── Navbar.tsx
│   ├── ServiceBuilder*.tsx
│   └── settings/          # Settings UI
├── lib/                   # Business logic
│   ├── actions.ts         # Server actions (⚠️)
│   ├── prisma.ts          # DB client
│   └── services.ts        # Service definitions
└── prisma/                # Database
    └── schema.prisma      # Schema (⚠️ HIGH-RISK)
```

---

## TECH STACK

- **Framework:** Next.js 16.1.1 (App Router, Server Components)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + CSS modules
- **Database:** Supabase PostgreSQL + Prisma ORM
- **Deployment:** Vercel (auto-deploy from main)
- **State:** React hooks + Optimistic UI
- **Forms:** FormData + Server Actions

---

## KEY FEATURES

1. **ListCart Creation** - Agents create service packages for property listings
2. **Service Package Builder** - Select/configure services with vendor selection
3. **Agent Dashboard** - Manage multiple carts, track status
4. **Vendor Communication** - WhatsApp-style chat interface
5. **Pricing** - Dynamic pricing with agent commission
6. **Invoice Generation** - Automated with 5% platform fee

---

## PERFORMANCE NOTES

- **Optimistic UI** everywhere - changes appear instantly
- **No blocking operations** - all updates are async
- **Memoization** - useMemo, useCallback to prevent re-renders
- **Database** - Supabase in Singapore (some latency)
- **Target:** All interactions < 1s

---

## COMMIT GUIDELINES

**Format:**
```
Type: Brief description

Body (optional): More context if needed
```

**Types:**
- `UI:` - Visual changes
- `Fix:` - Bug fixes
- `Style:` - CSS/styling only
- `Refactor:` - Code restructure
- `Perf:` - Performance improvements
- `Docs:` - Documentation

**Examples:**
```
UI: Change landing hero background to gradient blue
Fix: Correct alignment of pricing cards on mobile
Style: Update button hover states to match design system
```

---

## GUARDRAILS

1. **Read BOT_MANIFEST.md** to locate files before editing
2. **Never guess file paths** - always verify first
3. **Check STYLE_GUIDE.md** for Tailwind patterns
4. **Commit often** with clear messages
5. **Push to main** - triggers Vercel deployment (~2min)
6. **Watch for build errors** in Vercel dashboard
7. **Avoid touching** `.env*`, `prisma/schema.prisma`, `lib/actions.ts` without explicit approval

---

## QUICK WINS

Want to test your setup? Try these safe changes:
1. Change landing page hero text color
2. Add more padding to a button
3. Update a placeholder text
4. Change hover state of navigation links

---

## GETTING HELP

If unsure:
1. Check **CHANGE_PLAYBOOK.md** for step-by-step guidance
2. Review **ARCHITECTURE_MAP.md** to understand structure
3. Ask human before touching high-risk areas
4. Read component code - it's well-commented

---

**Remember:** You're here to move fast on UI/UX changes. When in doubt, ask. When confident, ship it! 🚀

