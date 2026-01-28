# ListCart - Production Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier works!)
- Database choice (see options below)

---

## Step-by-Step Deployment

### 1. Push Code to GitHub

```bash
# If not already initialized
git init
git add .
git commit -m "Ready for production deployment"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/listcart.git
git branch -M main
git push -u origin main
```

### 2. Database Setup

#### Option A: Vercel Postgres (Simplest)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Storage" → "Create Database"
3. Select "Postgres"
4. Choose a name: `listcart-db`
5. Vercel will auto-configure `DATABASE_URL`

#### Option B: Supabase (Recommended for Demos)

1. Go to [supabase.com](https://supabase.com)
2. Create new project: `listcart`
3. Go to Project Settings → Database
4. Copy the "Connection String" (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password
6. Save for Step 4

#### Option C: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project → Add Postgres
3. Copy the `DATABASE_URL` from connection settings
4. Save for Step 4

---

### 3. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Install Command:** `npm install` (default)

4. Click **"Deploy"** (Don't worry about env vars yet)

---

### 4. Configure Environment Variables

After initial deployment:

1. Go to your project dashboard on Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add these variables:

```env
# Database
DATABASE_URL=your_database_connection_string_here

# App URL (Vercel provides this automatically, but you can customize)
NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app
```

4. Click **"Save"**

---

### 5. Run Database Migrations & Seed

After deploying, you need to set up the database schema:

#### Method 1: From Local (Recommended for first deploy)

```bash
# Set production database URL temporarily
export DATABASE_URL="your_production_database_url"

# Run migrations
npx prisma db push

# Seed default data
npm run seed

# Unset to go back to local
unset DATABASE_URL
```

#### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Run migration command
vercel env pull .env.production
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npx prisma db push
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npm run seed
```

---

### 6. Redeploy (to pick up env vars)

Back in Vercel:
1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**

---

## 🎉 Done! Your App is Live!

Visit: `https://your-app-name.vercel.app`

---

## 🔧 Quick Commands Reference

```bash
# View production logs
vercel logs

# Deploy from CLI
vercel --prod

# Check build
vercel build

# Run dev locally with production data
DATABASE_URL="prod_url" npm run dev
```

---

## 📋 Pre-Demo Checklist

- [ ] App loads successfully
- [ ] Create a test cart
- [ ] Mark cart as "Sent to Providers"
- [ ] Click through service communications
- [ ] Test Photography conversation reveal
- [ ] Accept a provider quote
- [ ] Generate and send invoice
- [ ] Test on mobile device

---

## 🚨 Troubleshooting

### Build Fails
- Check Vercel deployment logs
- Verify all dependencies in package.json
- Ensure TypeScript has no errors: `npm run build` locally

### Database Connection Error
- Verify DATABASE_URL format
- Check database allows external connections
- For Supabase: Enable connection pooling

### "Prisma Client Not Found"
- Add postinstall script to package.json (should already be there)
- Redeploy

### Environment Variables Not Working
- Ensure variables are saved in Vercel
- Redeploy after adding/changing variables
- Check variable names match exactly

---

## 🎯 Demo Tips for Your Friend

1. **Create a test cart** ahead of time
2. **Walk through the flow:**
   - Create cart → Send to providers → View communications
   - Click Photography to reveal negotiation
   - Accept quote → Generate invoice
3. **Highlight the gold:**
   - "All conversations in one place - no more email chaos!"
   - "See the full negotiation timeline"
   - "Accept with one click"
4. **Mobile-friendly** - show on phone too!

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs

---

**Built with ❤️ for ListCart MVP**


Wed Jan 28 02:09:12 UTC 2026
