# 📁 BOT MANIFEST - File Map & Context

> ✅ **USE FOR:** Locating files and routes only. Read BOT_BRIEF.md first.

**Purpose:** Quick reference to locate any file or component in the repo.

---

## 🎯 "WHERE IS X?" - FILE PATHS

### **PAGES (App Router)**

| What | Path | Notes |
|------|------|-------|
| **Landing Page** | `app/page.tsx` | Client component, full website |
| **Create Cart** | `app/create/page.tsx` | Form to create new ListCart |
| **Agent Cart View** | `app/c/[cartId]/agent/page.tsx` | Main cart management UI |
| **Vendor View** | `app/v/[token]/page.tsx` | Vendor approval interface |
| **My Carts Dashboard** | `app/my-carts/page.tsx` | List all carts with status |
| **Settings** | `app/settings/page.tsx` | Service package builder settings |

### **LAYOUTS & GLOBAL**

| What | Path | Notes |
|------|------|-------|
| **Root Layout** | `app/layout.tsx` | Has BuildNumber component |
| **Global CSS** | `app/globals.css` | Tailwind imports + custom styles |
| **Tailwind Config** | `tailwind.config.ts` | Theme, colors, plugins |

### **NAVIGATION & UI SHELL**

| What | Path | Notes |
|------|------|-------|
| **Navbar** | `components/Navbar.tsx` | Top nav with links + user menu |
| **User Menu** | `components/UserMenu.tsx` | Profile dropdown in navbar |
| **Build Number** | `components/BuildNumber.tsx` | Bottom-left version indicator |

### **CORE COMPONENTS**

| What | Path | Notes |
|------|------|-------|
| **Service Builder** | `components/ServiceBuilderWithVendors.tsx` | Main cart builder with vendors |
| **Service Builder (Simple)** | `components/ServiceBuilder.tsx` | Vendor view version |
| **Service Card** | `components/ServiceCard.tsx` | Individual service display |
| **Service Communication Hub** | `components/ServiceCommunicationHub.tsx` | WhatsApp-style chat |
| **Cart Search Box** | `components/CartSearchBox.tsx` | LC-XXX search on home page |
| **Vendor Communication Selector** | `components/VendorCommunicationSelector.tsx` | Send to providers modal |
| **Vendor Sent Modal** | `components/VendorSentModal.tsx` | Success modal after sending |

### **SETTINGS COMPONENTS**

| What | Path | Notes |
|------|------|-------|
| **Service Package Builder** | `components/settings/ServicePackageBuilder.tsx` | Main settings interface |
| **Add Service Form** | `components/settings/AddServiceForm.tsx` | Create new service |
| **Edit Service Form** | `components/settings/EditServiceForm.tsx` | Edit existing service |
| **Finance Settings** | `components/settings/FinanceCommissionSettings.tsx` | Commission % settings |
| **Vendor Manager** | `components/settings/ServiceVendorManagerWithDnD.tsx` | Drag-drop vendor list |

### **BUSINESS LOGIC**

| What | Path | Notes |
|------|------|-------|
| **Server Actions** | `lib/actions.ts` | ⚠️ All database operations |
| **Prisma Client** | `lib/prisma.ts` | Database client singleton |
| **Service Definitions** | `lib/services.ts` | Service types & helpers |

### **API ROUTES**

| What | Path | Notes |
|------|------|-------|
| **Services API** | `app/api/services/route.ts` | CRUD for services |
| **Service Edit** | `app/api/services/[id]/route.ts` | Update single service |
| **Service Reorder** | `app/api/services/reorder/route.ts` | Drag-drop order |
| **Vendors API** | `app/api/vendors/route.ts` | CRUD for vendors |
| **Carts API** | `app/api/carts/route.ts` | Fetch all carts |
| **Cart Search** | `app/api/carts/search/route.ts` | Search by friendlyId |
| **Finance Settings** | `app/api/settings/finance/route.ts` | Get/set commission |

### **DATABASE**

| What | Path | Notes |
|------|------|-------|
| **Schema** | `prisma/schema.prisma` | ⚠️ HIGH-RISK - DB structure |
| **Seed Data** | `prisma/seed.ts` | Initial service data |
| **SQL Setup** | `setup.sql` | Raw SQL for manual setup |

### **DOCUMENTATION**

| What | Path | Notes |
|------|------|-------|
| **README** | `README.md` | Project overview |
| **Deployment** | `DEPLOYMENT.md` | How to deploy |
| **Performance SLA** | `PERFORMANCE_SLA.md` | < 1s requirement |
| **Security Audit** | `SECURITY_AUDIT.md` | Safe for public repo |
| **Quick Deploy** | `QUICK_DEPLOY.md` | 5-step deployment |

---

## 🔍 FINDING THINGS BY FEATURE

### **"I want to change the landing page"**
1. Main page: `app/page.tsx`
2. Navbar: `components/Navbar.tsx`
3. Hero section: Lines 12-100 in `app/page.tsx`
4. Pricing section: Lines 246-315 in `app/page.tsx`
5. Features section: Lines 80-245 in `app/page.tsx`

### **"I want to update pricing"**
1. Pricing UI: `app/page.tsx` (lines 246-315)
2. Pricing calculation: `components/ServiceBuilderWithVendors.tsx`
3. Commission settings: `components/settings/FinanceCommissionSettings.tsx`

### **"I want to change navigation"**
1. Main navbar: `components/Navbar.tsx`
2. User menu: `components/UserMenu.tsx`
3. Links in navbar: `components/Navbar.tsx` (lines 20-50)

### **"I want to update cart builder"**
1. Agent view: `components/ServiceBuilderWithVendors.tsx`
2. Vendor view: `components/ServiceBuilder.tsx`
3. Individual service: `components/ServiceCard.tsx`

### **"I want to change colors/styling"**
1. Global CSS: `app/globals.css`
2. Tailwind config: `tailwind.config.ts`
3. Component styles: Inline Tailwind classes in each `.tsx`

---

## 📚 CONTEXT FILES

| File | Purpose |
|------|---------|
| **BOT_BRIEF.md** | Start here - overview & mission |
| **BOT_MANIFEST.md** | This file - where everything is |
| **ARCHITECTURE_MAP.md** | How the app is structured |
| **CHANGE_PLAYBOOK.md** | Step-by-step change process |
| **STYLE_GUIDE.md** | Tailwind patterns & design system |
| **SUPABASE_NOTES.md** | Database & env vars |
| **PERFORMANCE_SLA.md** | Performance requirements |
| **SECURITY_AUDIT.md** | What's safe/unsafe |

---

## 🎨 DESIGN SYSTEM COMPONENTS

**Buttons:** Look in any component for patterns, common classes:
- Primary: `bg-blue-600 hover:bg-blue-700 text-white`
- Secondary: `bg-gray-200 hover:bg-gray-300 text-gray-900`
- Danger: `bg-red-600 hover:bg-red-700 text-white`

**Cards:** Usually have:
- `border rounded-lg p-4 bg-white dark:bg-gray-800`

**Inputs:**
- `border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500`

---

## 🚨 HIGH-RISK FILES (Ask Before Touching)

1. `prisma/schema.prisma` - Database schema
2. `lib/actions.ts` - Server actions (DB operations)
3. `app/api/**` - API routes
4. `.env*` - Environment variables (gitignored)
5. `lib/prisma.ts` - Database client
6. `next.config.ts` - Build configuration

---

## ✅ SAFE FILES (Edit Freely)

1. `app/page.tsx` - Landing page
2. `components/Navbar.tsx` - Navigation
3. `app/globals.css` - Styles
4. Any component in `components/` (except logic changes)
5. Documentation files (`*.md`)

---

**TIP:** Use `grep -r "searchterm" app/` to find where something is used!

