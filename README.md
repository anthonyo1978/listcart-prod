# ListCart

**Listing Made Simple**

ListCart is an MVP web application that streamlines the property listing service coordination process. It enables real estate agents to create customized service carts, vendors to select and approve services, and automatically generates confirmation summaries and supplier work orders.

## Features

- **Agent Dashboard**: Create listing carts with property and vendor details
- **Vendor Selection Page**: Secure link for vendors to review and approve services
- **Recommended Service Packs**: Pre-configured service bundles with customization options
- **Payment Options**: Support for "Pay Now" and "Pay at Settlement"
- **Email Generation**: Automated creation of agent summaries and supplier work orders (MVP: displayed in UI, not sent)
- **Real-time Status Tracking**: Monitor cart progression from draft to approval

## Services Included

1. **Photography + Floorplan** - $450.00
2. **Copywriting** - $180.00
3. **Signboard** - $250.00
4. **Digital Upgrade (Social Boost)** - $150.00
5. **Styling Consultation** - $99.00

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Authentication**: None (MVP - simple access via unique tokens)

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd listcart
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the database**

The project uses Prisma's local development database. Start it with:

```bash
npx prisma dev
```

This will start a local PostgreSQL instance and provide you with a DATABASE_URL. Keep this terminal running.

4. **Set up the database schema**

In a new terminal, push the schema to the database:

```bash
DATABASE_URL="<url-from-prisma-dev>" npx prisma db push
```

Or for convenience, the DATABASE_URL is already configured in `.env` if you used `npx prisma dev`.

5. **Generate Prisma Client**

```bash
npx prisma generate
```

6. **Run the development server**

```bash
npm run dev
```

7. **Open the application**

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Alternative Database Setup

If you prefer to use your own PostgreSQL instance or Supabase:

1. Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

2. Run migrations:

```bash
npx prisma db push
npx prisma generate
```

## Usage Flow

### 1. Create a Cart (Agent)

- Navigate to the home page
- Click "Create a ListCart"
- Fill in property address and vendor details
- Optionally add agent details
- Submit to create the cart

### 2. Share with Vendor

- After creation, you'll be redirected to the agent view
- Copy the unique vendor link
- Share this link with the property vendor

### 3. Vendor Selection

- Vendor opens the link
- Reviews the recommended service pack (pre-selected)
- Can toggle services on/off
- Selects payment option (Pay Now / Pay at Settlement)
- Confirms selection

### 4. Review Results (Agent)

- Return to the agent view using the cart URL
- See updated status (APPROVED)
- View selected services and total cost
- Review generated email payloads in the "Generated Emails" section

## Project Structure

```
listcart/
├── app/
│   ├── page.tsx              # Landing page
│   ├── create/
│   │   └── page.tsx          # Agent cart creation form
│   ├── v/[token]/
│   │   ├── page.tsx          # Vendor cart page (server)
│   │   └── VendorCartClient.tsx  # Vendor cart (client)
│   └── c/[cartId]/agent/
│       ├── page.tsx          # Agent cart view (server)
│       └── AgentCartClient.tsx   # Agent cart (client)
├── components/
│   ├── ServiceCard.tsx       # Service selection card
│   └── TotalBar.tsx          # Sticky total bar
├── lib/
│   ├── actions.ts            # Server actions
│   ├── prisma.ts             # Prisma client
│   └── services.ts           # Service definitions & utils
└── prisma/
    └── schema.prisma         # Database schema
```

## Database Schema

### Models

- **Cart**: Main cart entity with property and vendor info
- **CartItem**: Individual service items in a cart
- **OutboundEmail**: Generated email payloads (not sent in MVP)

### Enums

- **CartStatus**: DRAFT, SENT, APPROVED
- **PaymentChoice**: PAY_NOW, PAY_LATER
- **SupplierType**: PHOTOGRAPHER, COPYWRITER, SIGNBOARD, DIGITAL, STYLIST
- **OutboundEmailType**: AGENT_SUMMARY, SUPPLIER_WORK_ORDER

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Prisma commands
npx prisma studio          # Open database GUI
npx prisma generate        # Generate Prisma Client
npx prisma db push         # Push schema changes
npx prisma migrate dev     # Create a migration
```

## MVP Limitations

This is an MVP with the following intentional limitations:

- **No Authentication**: Simple token-based access for vendors
- **No Email Sending**: Email payloads are generated and displayed but not sent
- **No Payment Processing**: Payment choice is recorded but not processed
- **No Supplier Management**: Supplier emails are placeholders
- **Happy Path Only**: Minimal error handling and edge cases
- **No Cart Editing**: Once created, carts cannot be modified (only approved)

## Future Enhancements

- User authentication and authorization
- Email integration (SendGrid, Resend, etc.)
- Payment processing (Stripe, Square)
- Supplier portal and job acceptance
- Cart editing and cancellation
- File uploads (photos, documents)
- SMS notifications
- Advanced reporting and analytics
- Multi-agent/agency support

## Contributing

This is an MVP project. Feel free to fork and enhance!

## License

MIT

---

Built with ❤️ using Next.js and Prisma

AI DevBox: enabled
