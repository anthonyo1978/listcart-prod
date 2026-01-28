# 🏗️ ARCHITECTURE MAP - ListCart Structure

> ⚠️ **REFERENCE ONLY** - Do not read unless explicitly instructed. Read BOT_BRIEF.md first.

**Purpose:** Understand how data flows through the app and how components connect.

---

## 📊 APP ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                    VERCEL DEPLOYMENT                     │
│  Next.js 16 (App Router) + React Server Components      │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    ROUTING (App Router)                  │
│  app/page.tsx          → Landing (/)                     │
│  app/create/           → Create Cart (/create)           │
│  app/c/[cartId]/agent/ → Agent View (/c/ABC123/agent)   │
│  app/v/[token]/        → Vendor View (/v/TOKEN)          │
│  app/my-carts/         → Dashboard (/my-carts)           │
│  app/settings/         → Settings (/settings)            │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   DATA LAYER                             │
│  lib/actions.ts        → Server Actions (DB writes)      │
│  lib/prisma.ts         → Database Client                 │
│  app/api/*             → API Routes (REST endpoints)     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                 DATABASE (Supabase)                      │
│  PostgreSQL in Singapore                                 │
│  Schema: prisma/schema.prisma                            │
│  Tables: Cart, CartItem, Service, Vendor, etc.          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 KEY USER FLOWS

### **1. CREATE LISTCART**
```
User lands on /
  ↓
Clicks "Create ListCart"
  ↓
Fills form (/create)
  ↓
Submits → createCart() server action
  ↓
Creates Cart + CartItems (all selected: false, priceCents: 0)
  ↓
Redirects to /c/[cartId]/agent
```

**Files involved:**
- `app/page.tsx` - Landing with CTA
- `app/create/page.tsx` - Form
- `lib/actions.ts` - `createCart()`

### **2. BUILD SERVICE PACKAGE**
```
Agent on /c/[cartId]/agent
  ↓
Sees service categories (all unchecked, $0)
  ↓
Checks category → optimistic UI update
  ↓
Expands "Select service providers"
  ↓
Checks vendor → price updates instantly
  ↓
Vendor + price saved to CartItem
```

**Files involved:**
- `app/c/[cartId]/agent/page.tsx` - Page wrapper
- `components/ServiceBuilderWithVendors.tsx` - Main UI
- `lib/actions.ts` - `updateCartItem()`, `updateCartItemVendor()`

### **3. SEND TO PROVIDERS**
```
Agent selects vendors
  ↓
Clicks communication mode (FCFS or Review)
  ↓
Modal shows vendor count
  ↓
Confirms → sendCartToVendors()
  ↓
Cart status → SENT
  ↓
Success modal with payment preference
```

**Files involved:**
- `components/VendorCommunicationSelector.tsx` - Mode selector
- `components/VendorSentModal.tsx` - Success modal
- `lib/actions.ts` - `sendCartToVendors()`

---

## 📐 COMPONENT HIERARCHY

### **Landing Page (`app/page.tsx`)**
```
Page (Client Component)
├── Navbar
│   └── UserMenu
├── Hero Section
│   └── CartSearchBox
├── Features Section
├── Pricing Section
├── Roadmap Section
├── Resources Section
├── About Section
└── Footer
```

### **Agent Cart View (`app/c/[cartId]/agent/page.tsx`)**
```
Page (Server Component)
├── Navbar
│   └── UserMenu
├── Timeline (Train station status)
├── Cart Header (Property details)
├── VendorCommunicationSelector (if DRAFT)
├── ServiceBuilderWithVendors (if DRAFT/SENT)
│   ├── Service Category List
│   │   ├── Checkbox (toggle selected)
│   │   ├── Expand vendors button
│   │   └── Vendor list (with prices)
│   └── Total Bar (with commission breakdown)
└── ServiceCommunicationHub (if SENT)
    └── WhatsApp-style chat threads
```

### **Settings Page (`app/settings/page.tsx`)**
```
Page (Server Component)
├── Navbar
│   └── UserMenu
└── Accordions
    ├── Service Package Builder
    │   ├── ServicePackageBuilder
    │   │   ├── Service Category List (drag-drop)
    │   │   └── ServiceVendorManagerWithDnD
    │   │       └── Vendor list (drag-drop)
    │   ├── AddServiceForm
    │   └── EditServiceForm
    ├── Finance & Commission
    │   └── FinanceCommissionSettings
    ├── Email Follow Up Rules (placeholder)
    └── Automation & Agentic Support (placeholder)
```

---

## 🔄 DATA FLOW PATTERNS

### **Pattern 1: Optimistic UI**
```typescript
// Component calls server action
const handleToggle = (item) => {
  // 1. Update UI immediately (optimistic)
  setOptimisticItems({ ...item, selected: !item.selected })
  
  // 2. Send to server in background
  startTransition(async () => {
    await updateCartItem(item.id, cartId, { selected: !item.selected })
    
    // 3. Clear optimistic state (server is truth)
    clearOptimistic(item.id)
  })
}
```

**Why:** < 100ms perceived response time (Performance SLA)

### **Pattern 2: Server Actions**
```typescript
// lib/actions.ts
'use server'

export async function updateCartItem(itemId, cartId, data) {
  await prisma.cartItem.update({
    where: { id: itemId },
    data,
  })
  // NO revalidatePath for performance
  return { success: true }
}
```

**Why:** Direct DB updates, no unnecessary page revalidations

### **Pattern 3: API Routes (when needed)**
```typescript
// app/api/vendors/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const serviceKey = searchParams.get('serviceKey')
  
  const vendors = await prisma.serviceVendor.findMany({
    where: { serviceKey },
    include: { vendor: true },
  })
  
  return Response.json(vendors)
}
```

**Why:** Used for client-side data fetching (e.g., expanding vendor list)

---

## 🗄️ DATABASE SCHEMA (HIGH-LEVEL)

```
Cart
├── id (PK)
├── friendlyId (LC-001, LC-002...)
├── status (DRAFT, SENT, VENDOR_APPROVED, PAID...)
├── propertyAddress
├── agentName, agentEmail
├── vendorName (seller)
└── CartItems (1-to-many)
    ├── id (PK)
    ├── cartId (FK)
    ├── serviceKey (PHOTO_FLOORPLAN, COPYWRITING...)
    ├── selected (boolean)
    ├── priceCents (integer)
    ├── vendorId (FK to Vendor, nullable)
    └── itemStatus (PENDING, AGENT_APPROVED...)

Service
├── id (PK)
├── serviceKey (unique)
├── name, description
├── supplierType (PHOTOGRAPHER, COPYWRITER...)
├── priceCents (base price)
├── displayOrder
└── defaultSelected (not used in cart creation)

Vendor
├── id (PK)
├── businessName
├── contactName, email, phone
└── ServiceVendors (1-to-many)
    ├── id (PK)
    ├── vendorId (FK)
    ├── serviceKey
    ├── priceCents (vendor-specific price)
    └── displayOrder

AgentSettings
├── id (PK)
├── agentEmail
├── globalCommissionPercent (default 2%)
└── autoApplyCommission
```

**Key Relationships:**
- Cart → CartItems (cascade delete)
- CartItem → Vendor (nullable, SET NULL on delete)
- Vendor → ServiceVendors (cascade delete)

---

## 🎨 STYLING ARCHITECTURE

### **Tailwind + CSS Modules**
- **Global styles:** `app/globals.css`
- **Component styles:** Inline Tailwind classes
- **Theme:** Defined in `tailwind.config.ts`
- **Dark mode:** Using `dark:` prefix

### **Common Patterns**
```typescript
// Card
className="border rounded-lg p-4 bg-white dark:bg-gray-800"

// Button Primary
className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"

// Input
className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"

// Container
className="max-w-7xl mx-auto px-6"
```

---

## 🚀 DEPLOYMENT PIPELINE

```
Developer/Bot pushes to main
  ↓
GitHub webhook triggers
  ↓
Vercel starts build
  ↓
1. npm install
2. npx prisma generate
3. npm run build (TypeScript check + Next.js build)
  ↓
Build succeeds
  ↓
Deploy to production
  ↓
~2 minutes later: Live at listcart-prod.vercel.app
```

**Environment Variables (in Vercel):**
- `DATABASE_URL` - Supabase connection string
- `NEXT_PUBLIC_BASE_URL` - App URL
- `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` - Build version

---

## 🔒 SECURITY & AUTH

**Current State:** MVP - No real auth
- Agent email hardcoded in forms (`lee.sales@estates.com.au`)
- Vendor view uses token-based access (cart.token)

**Future:** Will add proper auth (Clerk, Auth0, or Supabase Auth)

---

## 📈 PERFORMANCE CONSIDERATIONS

1. **Optimistic UI** - All updates feel instant
2. **No unnecessary revalidations** - Removed `revalidatePath` from hot paths
3. **Memoization** - `useMemo`, `useCallback` prevent re-renders
4. **Database location** - Supabase in Singapore (some latency from Vercel US)
5. **Bundle size** - Not yet optimized, but Next.js does code splitting

**SLA:** All user interactions < 1 second

---

## 🧪 TESTING

**Current:** Manual testing only
**No automated tests** - Focus on speed of iteration

**Testing workflow:**
1. Make change
2. Push to main
3. Vercel deploys
4. Test in production

---

**TIP:** When making changes, trace the flow:  
UI Component → Event Handler → Server Action → Database → Response → UI Update

