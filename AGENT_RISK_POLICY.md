# AGENT RISK DECISION POLICY

## Risk Classification

### LOW RISK (Execute Immediately)
Files that affect presentation only:
- `app/**/page.tsx` (UI changes, not logic)
- `components/**/*.tsx` (presentational components)
- `app/globals.css`, `*.css`
- `tailwind.config.*`
- `*.md` (documentation)

Changes:
- Text/copy edits
- CSS class modifications (Tailwind utilities)
- Layout adjustments (spacing, alignment)
- Styling changes (colors, fonts, borders)

### MEDIUM RISK (Execute with Logging)
Files with client-side logic:
- `components/**/*.tsx` (if adding/changing hooks or state)
- `app/**/layout.tsx`
- Form validation logic (client-side only)

Changes:
- Adding UI components
- Modifying component structure
- Changing props or interfaces (non-breaking)

### HIGH RISK (Do Not Execute Without Approval)
Files that affect data, auth, or contracts:
- `prisma/schema.prisma`
- `lib/actions.ts` (server actions)
- `app/api/**/*` (API routes)
- `*.config.ts` (Next.js, TypeScript, build configs)
- `.env*`, environment variables
- Database migrations

Changes:
- Schema modifications
- Server action logic
- API endpoint changes
- Authentication/authorization
- Payment/billing logic
- External API integrations

## Default Actions

- **LOW:** Execute → Commit → Push
- **MEDIUM:** Execute → Commit → Push → Log decision
- **HIGH:** Halt → Request human approval

## Uncertainty Rule

**If risk level is ambiguous, treat as HIGH.**

If a change spans multiple risk levels, use the highest.

## Examples

✅ LOW: Change `text-gray-900` to `text-blue-600` in `app/page.tsx`  
⚠️ MEDIUM: Add `useState` hook to `components/Navbar.tsx`  
🛑 HIGH: Add field to `Cart` model in `prisma/schema.prisma`

