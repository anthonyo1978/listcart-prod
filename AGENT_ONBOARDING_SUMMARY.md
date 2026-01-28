# 🤖 AGENT ONBOARDING SUMMARY

**Repo:** listcart-prod | **Stack:** Next.js 16 + TypeScript + Tailwind + Supabase + Vercel

## 📍 READ FIRST
- **BOT_BRIEF.md** - Start here, always
- **BOT_MANIFEST.md** - File map & where to find things
- **CHANGE_PLAYBOOK.md** - How to make changes safely

## 🎯 QUICK NAVIGATION

**Pages:**
- Landing: `app/page.tsx` (Client component, has Navbar + Hero + Pricing)
- Create Cart: `app/create/page.tsx`
- Agent View: `app/c/[cartId]/agent/page.tsx`
- My Carts: `app/my-carts/page.tsx`
- Settings: `app/settings/page.tsx`

**Key Components:**
- Navbar: `components/Navbar.tsx`
- Service Builder: `components/ServiceBuilderWithVendors.tsx`
- User Menu: `components/UserMenu.tsx`

**Global Styles:** `app/globals.css` + Tailwind config in `tailwind.config.ts`

## ✅ SAFE CHANGES (No approval needed)
- Copy/text tweaks
- Colors, spacing, borders (Tailwind classes)
- Button styles, hover states
- Layout adjustments (padding, margin, flex/grid)

## ⚠️ HIGH-RISK (Ask first!)
- Database schema (`prisma/schema.prisma`)
- Server actions (`lib/actions.ts`)
- API routes (`app/api/**`)
- Environment variables (`.env*`)
- Authentication logic

## 🚀 COMMIT FORMAT
```
Type: Brief description

Examples:
UI: Change landing page background to blue
Fix: Correct pricing card alignment
Style: Update button hover states
```

## 📦 WORKFLOW
1. Locate file (use BOT_MANIFEST.md)
2. Make change
3. Check syntax (no need to test locally)
4. Commit with clear message
5. Push to main → auto-deploys to Vercel

**SLA:** < 1s response times, optimistic UI, performance-first

