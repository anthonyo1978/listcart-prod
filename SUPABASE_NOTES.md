# 🗄️ SUPABASE NOTES - Database & Environment

> ✅ **USE FOR:** Database and environment variables only. Read BOT_BRIEF.md first.

**Purpose:** How the database works, environment variables, and how to avoid breaking production.

---

## 🔑 ENVIRONMENT VARIABLES

### **Critical Vars (in Vercel, not in code!)**

**DATABASE_URL**
- Location: Vercel → Settings → Environment Variables
- Format: `postgresql://postgres.PROJECT:[PASSWORD]@aws-region.pooler.supabase.com:5432/postgres?sslmode=require&pgbouncer=true`
- Used by: Prisma client to connect to database
- **NEVER commit this to git!** ✅ Already in .gitignore

**NEXT_PUBLIC_BASE_URL**
- Location: Vercel → Settings → Environment Variables
- Example: `https://listcart-prod.vercel.app`
- Used by: Email generation, vendor links
- Safe to expose (public)

**NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA**
- Location: Automatically set by Vercel
- Used by: BuildNumber component (bottom-left version)
- Safe to expose (public)

---

## 📦 DATABASE SCHEMA OVERVIEW

### **Main Tables**

**Cart** - The main ListCart entity
```typescript
Cart {
  id: string (PK)
  friendlyId: string (LC-001, LC-002...) [UNIQUE]
  status: CartStatus (DRAFT, SENT, VENDOR_APPROVED...)
  propertyAddress: string
  vendorName: string (property seller)
  agentName: string
  agentEmail: string
  token: string (for vendor access) [UNIQUE]
  totalCents: int
  // ... more fields
}
```

**CartItem** - Services in a cart
```typescript
CartItem {
  id: string (PK)
  cartId: string (FK → Cart)
  serviceKey: string (PHOTO_FLOORPLAN, COPYWRITING...)
  name: string
  description: string
  priceCents: int (starts at 0, set when vendor selected)
  selected: boolean (checkbox state)
  vendorId: string | null (FK → Vendor)
  itemStatus: CartItemStatus (PENDING, AGENT_APPROVED...)
  agentNotes: string | null
  // ... more fields
}
```

**Service** - Service catalog (Photo, Copy, Signboard...)
```typescript
Service {
  id: string (PK)
  serviceKey: string [UNIQUE]
  name: string
  description: string
  supplierType: SupplierType
  priceCents: int (base price, not used directly)
  displayOrder: int (for drag-drop)
  isActive: boolean
  defaultSelected: boolean (not used in cart creation)
}
```

**Vendor** - Service providers
```typescript
Vendor {
  id: string (PK)
  businessName: string
  contactName: string | null
  email: string | null
  phone: string | null
  isActive: boolean
}
```

**ServiceVendor** - Junction table (Vendor prices per service)
```typescript
ServiceVendor {
  id: string (PK)
  vendorId: string (FK → Vendor)
  serviceKey: string
  priceCents: int (vendor-specific price)
  displayOrder: int
  isPreferred: boolean
}
```

**AgentSettings** - Global settings per agent
```typescript
AgentSettings {
  id: string (PK)
  agentEmail: string [UNIQUE]
  globalCommissionPercent: float (default 2%)
  autoApplyCommission: boolean
}
```

---

## 🔄 HOW PRISMA WORKS

### **Client Location**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prisma = globalThis.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
```

### **Usage in Server Actions**
```typescript
// lib/actions.ts
'use server'

import { prisma } from './prisma'

export async function updateCartItem(itemId, cartId, data) {
  await prisma.cartItem.update({
    where: { id: itemId },
    data,
  })
  return { success: true }
}
```

### **Usage in API Routes**
```typescript
// app/api/services/route.ts
import { prisma } from '@/lib/prisma'

export async function GET() {
  const services = await prisma.service.findMany()
  return Response.json(services)
}
```

---

## ⚠️ SCHEMA CHANGES (HIGH-RISK!)

### **DON'T DO THIS:**
```bash
# Editing schema directly
nano prisma/schema.prisma

# Running migrations manually
npx prisma migrate dev

# Changing field types
# Adding/removing tables
```

### **IF YOU MUST (with approval):**
```bash
# 1. Edit schema
nano prisma/schema.prisma

# 2. Create migration
npx prisma migrate dev --name describe_change

# 3. Test locally first!

# 4. Push to GitHub (triggers Vercel build)
git push origin main

# 5. Monitor Vercel build for Prisma errors
```

---

## 🗃️ COMMON QUERIES (Read-Only Reference)

### **Get Cart with Items**
```typescript
const cart = await prisma.cart.findUnique({
  where: { id: cartId },
  include: {
    items: true,
    outboundEmails: true,
  },
})
```

### **Get Services with Vendors**
```typescript
const services = await prisma.service.findMany({
  where: { isActive: true },
  orderBy: { displayOrder: 'asc' },
})
```

### **Get Vendors for Service**
```typescript
const vendors = await prisma.serviceVendor.findMany({
  where: { serviceKey: 'PHOTO_FLOORPLAN' },
  include: { vendor: true },
  orderBy: { displayOrder: 'asc' },
})
```

---

## 🚫 WHAT NOT TO DO

### **❌ Never Commit .env Files**
```bash
# These are gitignored - KEEP IT THAT WAY
.env
.env.local
.env.production
```

### **❌ Never Hardcode Database URLs**
```typescript
// BAD
const db = new PrismaClient({
  datasources: {
    db: { url: 'postgresql://user:pass@host/db' }
  }
})

// GOOD
// Use process.env.DATABASE_URL (automatic with Prisma)
```

### **❌ Never Delete Tables Without Backup**
```sql
-- DON'T DO THIS
DROP TABLE "Cart";
```

### **❌ Never Change Schema in Production**
- All schema changes go through migrations
- Test locally first
- Deploy through Vercel build

---

## ✅ SAFE DATABASE OPERATIONS

### **Read Queries**
```typescript
// These are safe - they don't modify data
prisma.cart.findMany()
prisma.cart.findUnique()
prisma.service.findMany()
```

### **Soft Deletes**
```typescript
// Update isActive instead of deleting
await prisma.service.update({
  where: { id },
  data: { isActive: false }
})
```

---

## 🔍 DEBUGGING DATABASE ISSUES

### **Check Connection**
```bash
# Run locally (requires DATABASE_URL in .env)
npx prisma studio

# Opens GUI at http://localhost:5555
```

### **View Schema**
```bash
npx prisma format
# Formats and validates schema
```

### **Generate Types**
```bash
npx prisma generate
# Regenerates TypeScript types
```

---

## 📊 CURRENT SUPABASE SETUP

**Project:** xksjzswwvaytzwwyhkki  
**Region:** Singapore (ap-southeast-1)  
**Connection:** Session pooling (port 5432)  
**SSL:** Required  

**Tables Created:** Cart, CartItem, Service, Vendor, ServiceVendor, AgentSettings, OutboundEmail

**Seed Data:** 5 default services (Photography, Copywriting, Signboard, Digital, Styling)

---

## 🎯 ENV VAR WORKFLOW

### **Local Development**
```bash
# .env file (not committed)
DATABASE_URL="postgresql://..."
```

### **Production (Vercel)**
```
1. Vercel Dashboard
2. Settings → Environment Variables
3. Add/Edit DATABASE_URL
4. Save
5. Redeploy (changes take effect)
```

### **Checking Current Value**
```typescript
// In code (server-side only)
console.log('DB connected:', !!process.env.DATABASE_URL)
// Don't log the actual value!
```

---

## 🚨 EMERGENCY: Database Connection Fails

### **Symptoms**
```
Error: Can't reach database server at ...
PrismaClientInitializationError
```

### **Fixes**
1. Check DATABASE_URL is set in Vercel
2. Verify Supabase project is Active (not Paused)
3. Check connection string format (port, host, SSL)
4. Verify password is URL-encoded if special chars
5. Try direct connection vs pooler

### **Quick Test**
```bash
# Test connection locally
npx prisma db pull
# If succeeds, connection works
```

---

## 📝 MIGRATION FILES

**Location:** `prisma/migrations/`

**DO NOT:**
- Edit migration files manually
- Delete migration files
- Reorder migrations

**DO:**
- Let Prisma generate migrations
- Keep migrations in git
- Run migrations in sequence

---

## 🎯 GOLDEN RULES

1. **DATABASE_URL is sacred** - Never commit it
2. **Schema changes need approval** - Too risky for bot
3. **Migrations go through Prisma** - No manual SQL
4. **Test locally first** - Before pushing schema changes
5. **Supabase is production** - Treat with care
6. **Connection pooling is on** - Don't change it
7. **SSL is required** - Don't remove it

---

**Remember:** The database is the single source of truth. Handle with care! 🗄️🔒

