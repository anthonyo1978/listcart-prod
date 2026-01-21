# ListCart Setup Guide

## Quick Start (Recommended)

The easiest way to get started is using Prisma's local development database:

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Prisma Dev Database

In a terminal, start the local Prisma Postgres instance:

```bash
npx prisma dev
```

This will:
- Start a local PostgreSQL database
- Display a DATABASE_URL connection string
- Keep running in the background

**Important**: Keep this terminal open while developing.

### 3. Configure Environment

Copy the TCP DATABASE_URL from the Prisma dev output (it looks like `postgres://postgres:postgres@localhost:XXXXX/template1...`) and create a `.env` file:

```bash
echo 'DATABASE_URL="postgres://postgres:postgres@localhost:XXXXX/template1?sslmode=disable"' > .env
```

Replace `XXXXX` with the actual port number from your Prisma dev output (usually around 51214).

### 4. Push Database Schema

```bash
npx prisma db push
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Start Development Server

In a new terminal:

```bash
npm run dev
```

### 7. Open the App

Navigate to http://localhost:3000

---

## Alternative Setup (Using Your Own Database)

If you prefer to use your own PostgreSQL database or Supabase:

### 1. Create a `.env` file

```bash
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
```

### 2. Push Schema and Generate Client

```bash
npx prisma db push
npx prisma generate
```

### 3. Start Development Server

```bash
npm run dev
```

---

## Troubleshooting

### Database Connection Error

If you see errors like "Can't reach database server at localhost:5432":

1. Check that Prisma dev is running (or your own database)
2. Verify the DATABASE_URL in `.env` matches your Prisma dev port
3. Try restarting the Next.js dev server: `pkill -f "next dev" && npm run dev`

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Prisma Client Errors

If you see Prisma Client generation errors:

```bash
# Clean and regenerate
rm -rf node_modules/.prisma
npx prisma generate
```

---

## Database Tools

### Prisma Studio

View and edit your database with a GUI:

```bash
npx prisma studio
```

### Reset Database

To start fresh:

```bash
# Stop Prisma dev (Ctrl+C)
# Start it again
npx prisma dev

# Push schema
npx prisma db push
```

---

## Production Deployment

For production, you'll need a hosted PostgreSQL database:

1. **Supabase** (Recommended)
   - Create a free account at https://supabase.com
   - Create a new project
   - Get the connection string from Settings > Database
   - Use the "Connection Pooling" string for better performance

2. **Railway**
   - Create a PostgreSQL service
   - Copy the DATABASE_URL
   - Add to your environment variables

3. **Vercel Postgres**
   - Create a Postgres database in Vercel
   - Link to your project
   - Environment variables are auto-configured

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add your DATABASE_URL in Vercel dashboard
# Settings > Environment Variables > DATABASE_URL
```

---

## Testing the Application

### Complete User Flow

1. **Agent Creates Cart**
   - Visit http://localhost:3000
   - Click "Create a ListCart"
   - Fill in property and vendor details
   - Submit form

2. **Agent Shares Link**
   - Copy the vendor link from the agent view
   - Note the cart status (DRAFT)

3. **Vendor Selects Services**
   - Open the vendor link in a new tab/browser
   - Review pre-selected recommended pack
   - Toggle services as desired
   - Select payment option
   - Confirm selection

4. **Agent Reviews Approval**
   - Return to agent view
   - See APPROVED status
   - View selected services and total
   - Expand "Generated Emails" to see:
     - Agent summary email
     - Individual supplier work orders

---

## Development Tips

- Use **Prisma Studio** (`npx prisma studio`) to inspect data
- The `.env` file is gitignored - never commit it
- Turbopack is enabled by default for fast refresh
- Check `terminals/` folder for background process logs

---

## Support

For issues or questions:
- Check the main README.md
- Review Prisma docs: https://www.prisma.io/docs
- Review Next.js docs: https://nextjs.org/docs

