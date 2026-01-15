# Demo Setup Guide

This guide will help you set up the demo instance of the Business Management System.

## Prerequisites

- Node.js 18 or higher
- A Supabase account
- Git

## Step 1: Create a Supabase Project for Demo

1. Go to [Supabase](https://supabase.com) and create a new project
2. Name it something like "business-mgmt-demo"
3. Wait for the project to be ready
4. Go to Project Settings > API
5. Copy your project URL and anon key

## Step 2: Set Up the Database

1. In your Supabase project, go to the SQL Editor
2. Run the following SQL to create the necessary tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  id_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2),
  stock INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  category TEXT,
  barcode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loans table
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_number TEXT,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  client_name TEXT,
  principal DECIMAL(10, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  loan_term INTEGER NOT NULL,
  loan_type TEXT NOT NULL,
  loan_date TIMESTAMPTZ DEFAULT NOW(),
  start_date TIMESTAMPTZ NOT NULL,
  due_date TIMESTAMPTZ,
  amount DECIMAL(10, 2) NOT NULL,
  amount_to_pay DECIMAL(10, 2) NOT NULL,
  amount_applied DECIMAL(10, 2) DEFAULT 0,
  overdue_amount DECIMAL(10, 2) DEFAULT 0,
  late_fee DECIMAL(10, 2) DEFAULT 0,
  total_pending DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'Pendiente',
  cashier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Installments table
CREATE TABLE installments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  principal_amount DECIMAL(10, 2) NOT NULL,
  interest_amount DECIMAL(10, 2) NOT NULL,
  paid_amount DECIMAL(10, 2) DEFAULT 0,
  late_fee DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'Pendiente',
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales table
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  subtotal DECIMAL(10, 2),
  tax DECIMAL(10, 2),
  total DECIMAL(10, 2) NOT NULL,
  amount DECIMAL(10, 2),
  amount_paid DECIMAL(10, 2),
  change_returned DECIMAL(10, 2),
  payment_method TEXT NOT NULL,
  customer_email TEXT,
  customer_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sale Items table
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow all for demo purposes)
CREATE POLICY "Allow all on clients" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all on loans" ON loans FOR ALL USING (true);
CREATE POLICY "Allow all on installments" ON installments FOR ALL USING (true);
CREATE POLICY "Allow all on sales" ON sales FOR ALL USING (true);
CREATE POLICY "Allow all on sale_items" ON sale_items FOR ALL USING (true);
```

## Step 3: Configure Environment Variables

1. Copy the demo environment file:
```bash
cp .env.demo.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_DEMO_MODE=true
```

## Step 4: Seed Demo Data

Install dependencies and run the seeder:

```bash
npm install
npm run seed-demo
```

This will populate your database with:
- 5 demo clients
- 6 demo products
- 4 demo loans with installments
- 3 demo sales

## Step 5: Create a Demo User

In Supabase:
1. Go to Au Dashboard:
1. Go to **Authentication** → **Users**
2. Click **"Add User"** or **"Invite"**
3. Enter:
   - Email: `demo@example.com`
   - Password: `DemoPassword123`
   - ✅ **Auto Confirm User** (important!)
4. Click **"Create User"** or **"Send Invitation"**

> ⚠️ Make sure to enable **"Auto Confirm User"** so the user can login immediately without email verification.
## Step 6: Run Locally

```bash
npm run dev
```

Visit http://localhost:9002 and log in with:
- Email: demo@example.com
- Password: DemoPassword123

## Step 7: Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_DEMO_MODE=true`
5. Deploy!

## Demo Data Reset

To reset demo data, simply run the seeder again:

```bash
npm run seed-demo
```

You can also set up a scheduled task to reset data periodically.

## Security Notes for Demo

⚠️ **Important**: This is a public demo. Make sure:
- Use a separate Supabase project (not production)
- Don't store sensitive or real data
- Consider adding rate limiting
- Monitor usage to prevent abuse
- Set up data reset automation

## Customization

You can customize the demo data by editing `scripts/seed-demo-data.ts`

## Support

For issues or questions, create an issue on GitHub or contact via email.

---

Happy demoing! 🚀
