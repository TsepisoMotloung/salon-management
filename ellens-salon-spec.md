# Ellen's Hair Salon — Management System Spec

## Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js + React + Tailwind CSS |
| Auth | NextAuth.js |
| Database | MySQL + Prisma ORM |
| Charts | Recharts |
| Icons | Lucide React |

## Pages
```
/login
/dashboard
/bookings          /bookings/new    /bookings/[id]
/clients           /clients/[id]
/transactions      /transactions/new
/inventory
/profit-analysis
```

## Project Structure
```
src/ ├── app/ ├── components/ ├── lib/ ├── prisma/
     ├── services/ ├── hooks/ ├── types/ ├── utils/ └── styles/
```

---

## Database Models (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
}

model Booking {
  id              String   @id @default(cuid())
  fullname        String
  phoneNumber     String
  styleRequested  String
  mediumReached   String   // WhatsApp | Facebook | TikTok | Instagram | Walk-in | Referral
  bookingDate     DateTime
  estimatedAmount Float?
  notes           String?
  status          String   // Pending | Completed | Cancelled
  createdAt       DateTime @default(now())
}

model Client {
  id           String        @id @default(cuid())
  fullname     String
  phoneNumber  String
  createdAt    DateTime      @default(now())
  transactions Transaction[]
}

model Transaction {
  id              String   @id @default(cuid())
  type            String   // money-in | money-out | investment | withdrawal
  category        String
  amount          Float
  description     String?
  paymentMethod   String
  transactionDate DateTime
  clientId        String?
  client          Client?  @relation(fields: [clientId], references: [id])
  createdAt       DateTime @default(now())
}

model Inventory {
  id        String   @id @default(cuid())
  itemName  String
  category  String
  quantity  Int
  costPrice Float
  createdAt DateTime @default(now())
}
```

---

## Features by Module

### Dashboard
- Stats: today's bookings, income, expenses, profit, available cash
- Alerts: upcoming bookings, low stock
- Charts: income vs expenses, monthly profit trend, booking activity
- Quick actions: add booking, add transaction, add stock

### Bookings
Fields: date, time, fullname, style, medium reached, phone, estimated amount, notes, status
Features: create, edit, delete, search; filter by day / week / month

### Clients
Fields: fullname, phone, booking history, total spent, last visit, styles history
Features: add, edit, search, view transaction history

### Transactions
**Types & categories:**
- Money In → customer payments, deposits
- Money Out → rent, supplies, electricity, transport, other
- Investments → savings, investment transfers
- Withdrawals → owner/personal use

Fields: type, category, amount, date, time, description, payment method, related client (optional)
Features: add, edit, delete, search; filter by day / month / year / type
Tracks: expected cashflow, full money trail (source → destination → remaining cash)

### Inventory
Fields: item name, category, quantity, cost price, date added
Features: add, update, delete, low stock alerts, history
Examples: sprays, gel, braiding hair, shampoo, hair food

### Profit Analysis
Metrics: total income, total expenses, net profit, investments, withdrawals, remaining cash
Views: monthly, quarterly, annual
Charts: income vs expenses, profit trend, expense breakdown
Suggestions (auto, based on performance): save more, reinvest in stock, reduce expenses, expand services

---

## UI/UX Principles
- Mobile-first, thumb-friendly, bottom navigation
- Large buttons, minimal typing, fast loading
- Fully responsive

## Logo
- Style: elegant, minimal, feminine, modern
- Elements: stylized hair silhouette + scissors/comb + "E" integration
- Colors: black/white primary; gold + soft nude pink accents

## Deployment
- Frontend: Vercel
- Database: PlanetScale or Railway
