# Ellen's Hair Salon - Quick Start Guide

## 🚀 Getting Started

Follow these steps to get the application running:

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables
Create a `.env.local` file in the root directory with:

```env
# Database (MySQL required)
# For local MySQL:
DATABASE_URL="mysql://root:password@localhost:3306/ellens_salon"

# For Railway/PlanetScale, use their connection string

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"  # Generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

### Step 3: Create MySQL Database
```sql
CREATE DATABASE IF NOT EXISTS ellens_salon;
USE ellens_salon;
```

### Step 4: Initialize Database
```bash
# Run migrations
npx prisma migrate dev --name init

# Seed sample data (creates admin user and sample data)
npx prisma db seed
```

### Step 5: Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🔐 Login Credentials

**Default Admin Account:**
- Username: `admin`
- Password: `admin`

⚠️ **Important**: Change these credentials in production!

---

## 📋 Default Sample Data

The seed script creates:

### Admin User
- Username: `admin`
- Password: `admin`

### Sample Clients
- Thandi Njoko
- Nokuthula Dlamini
- Precious Mthembu

### Sample Inventory Items
- Brazilian Hair (20 units)
- Peruvian Hair (15 units)
- Hair Gel (10 units)
- Hair Spray (8 units)
- Shampoo (12 units)

---

## 💾 Database Setup Options

### Option 1: Local MySQL (Recommended for Development)
1. Install MySQL Server
2. Create database: `ellens_salon`
3. Set connection string in `.env.local`

### Option 2: Railway.app (Easy Cloud Setup)
1. Sign up at railway.app
2. Create MySQL database
3. Copy connection string to `.env.local`

### Option 3: PlanetScale (Free Tier Available)
1. Sign up at planetscale.com
2. Create MySQL database
3. Copy connection string to `.env.local`

---

## 📁 Project Structure

```
src/
  app/                  # Next.js app directory
    api/               # API routes
    login/             # Login page
    dashboard/         # Dashboard
    bookings/          # Bookings CRUD
    clients/           # Clients management
    transactions/      # Financial transactions
    inventory/         # Stock management
    profit-analysis/   # Analytics & reports
  components/          # Reusable React components
  lib/                 # Backend utilities
  types/               # TypeScript definitions
  utils/               # Helper functions
prisma/
  schema.prisma        # Database schema
  seed.ts              # Seed script
```

---

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start dev server

# Build & Deploy
npm run build           # Build for production
npm start               # Start production server

# Database
npx prisma migrate dev  # Create & run migrations
npx prisma studio      # Open Prisma Studio
npx prisma db seed     # Seed sample data
npx prisma migrate reset # Reset database

# Linting
npm run lint            # Run ESLint
```

---

## ✨ Features Ready to Use

✅ **Authentication** - Secure login with NextAuth  
✅ **Dashboard** - Real-time stats and alerts  
✅ **Bookings** - Full CRUD with status tracking  
✅ **Clients** - Client management with history  
✅ **Transactions** - Income/expense tracking  
✅ **Inventory** - Stock management with low stock alerts  
✅ **Profit Analysis** - Charts and financial insights  
✅ **Mobile Responsive** - Works on all devices  

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database connection errors
- Check MySQL is running
- Verify DATABASE_URL is correct
- Ensure database exists

### Port 3000 already in use
```bash
npm run dev -- -p 3001  # Use different port
```

### Prisma errors
```bash
npx prisma generate    # Regenerate Prisma client
npx prisma migrate reset # Reset database
```

---

## 📚 Next Steps

1. **Customize**: Update styles in `tailwind.config.js`
2. **Add Users**: Go to Database tab in Prisma Studio
3. **Upload Logo**: Add `public/logo.png`
4. **Deploy**: Push to GitHub, deploy on Vercel

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment for Production
Set these in your deployment platform:
```
DATABASE_URL=<production-database-url>
NEXTAUTH_SECRET=<generate-new-secret>
NEXTAUTH_URL=<your-domain>
```

---

## 📞 Support

- Check README.md for detailed documentation
- Review `.env.example` for all available options
- Check Prisma docs: https://www.prisma.io/docs

Enjoy using Ellen's Hair Salon Management System! 💇‍♀️
