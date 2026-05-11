# Ellen's Hair Salon Management System

A comprehensive Next.js + React full-stack management system for hair salons with bookings, clients, transactions, inventory, and profit analysis.

## Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with JWT
- **Database**: MySQL with Prisma ORM
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

## Features

### Dashboard
- Today's statistics (bookings, income, expenses, profit)
- Available cash tracking
- Low stock alerts
- Upcoming bookings
- Income vs expenses charts
- Quick action buttons

### Bookings Management
- Create, read, update, delete bookings
- Track booking status (Pending, Completed, Cancelled)
- Search and filter by date, status
- Client information tracking
- Estimated amount tracking

### Client Management
- Client database with contact information
- Transaction history per client
- Total amount spent tracking
- Search functionality

### Transactions
- Track money-in and money-out
- Investment and withdrawal tracking
- Multiple payment methods
- Category-based expenses (Rent, Supplies, Electricity, Transport, etc.)
- Search and filter by type and date range
- Transaction analysis

### Inventory Management
- Track salon supplies and hair stock
- Low stock alerts (items with qty ≤ 5)
- Calculate total inventory value
- Add, edit, delete items
- Categories: Hair, SuppliesFOund, Chemicals, Tools

### Profit Analysis
- Monthly profit trends
- Income vs expenses visualization
- Expense breakdown by category
- Profit margin calculation
- Cash flow tracking
- Data-driven recommendations

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MySQL database running
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd salon-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/ellens_salon"
   NEXTAUTH_SECRET="your-secret-key-change-in-production"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## Default Credentials

- **Username**: `admin`
- **Password**: `admin`

⚠️ **Change these immediately in production!**

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   ├── login/            # Login page
│   ├── dashboard/        # Dashboard page
│   ├── bookings/         # Bookings pages
│   ├── clients/          # Clients pages
│   ├── transactions/     # Transactions pages
│   ├── inventory/        # Inventory pages
│   └── profit-analysis/  # Profit analysis page
├── components/           # Reusable components
├── lib/                  # Utility functions
├── types/                # TypeScript types
└── utils/                # Helper functions
prisma/
├── schema.prisma         # Database schema
└── seed.ts               # Database seeding script
```

## Database Models

- **User**: Admin/staff usernames and passwords
- **Booking**: Client bookings with status tracking
- **Client**: Client information and contact details
- **Transaction**: Financial transactions (income, expenses, investments, withdrawals)
- **Inventory**: Stock tracking with cost prices and quantities

## Usage Tips

### Adding a New Booking
1. Go to **Bookings** → **New Booking**
2. Fill in client info, style, date/time, and medium reached
3. Click **Create Booking**

### Recording a Transaction
1. Go to **Transactions** → **New Transaction**
2. Select type (Money In/Out, Investment, Withdrawal)
3. Choose category and payment method
4. Enter amount and date
5. Click **Create Transaction**

### Monitoring Inventory
1. Go to **Inventory**
2. Items with quantity ≤ 5 are highlighted in yellow
3. Click on an item to update quantity or cost

### Analyzing Profits
1. Go to **Profit Analysis**
2. View monthly trends and expense breakdown
3. Check recommendations for business insights

## API Endpoints

All endpoints require authentication (NextAuth JWT token).

### Bookings
- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/[id]` - Get booking details
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Delete booking

### Clients
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create client
- `GET /api/clients/[id]` - Get client detail
- `PUT /api/clients/[id]` - Update client
- `DELETE /api/clients/[id]` - Delete client

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/[id]` - Get transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Inventory
- `GET /api/inventory` - List items
- `POST /api/inventory` - Create item
- `GET /api/inventory/[id]` - Get item
- `PUT /api/inventory/[id]` - Update item
- `DELETE /api/inventory/[id]` - Delete item

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Deployment

### Vercel (Recommended for Frontend)
```bash
vercel deploy
```

### Database Hosting Options
- PlanetScale (MySQL serverless)
- Railway
- AWS RDS
- DigitalOcean

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
npx prisma db execute --stdin < test.sql
```

### Migrations
```bash
# Create new migration
npx prisma migrate dev --name description

# Reset database
npx prisma migrate reset
```

### Build Issues
```bash
# Clear cache
rm -rf .next
npm run build
```

## Development

### Add a new page
1. Create `/src/app/[feature]/page.tsx`
2. Wrap with `<ProtectedLayout>`
3. Add navigation item to `Navigation.tsx`

### Add a new API route
1. Create `/src/app/api/[resource]/route.ts`
2. Check authentication with `getServerSession(authOptions)`
3. Handle CRUD operations

## Security Notes

- Change default admin credentials immediately
- Use strong `NEXTAUTH_SECRET` in production
- Enable HTTPS in production
- Regularly backup your database
- Keep dependencies updated

## Support & Contributions

For issues or feature requests, please open an issue or contact the development team.

## License

Proprietary - Ellen's Hair Salon

---

**Built with ❤️ for Ellen's Hair Salon**
