/**
 * Demo Data Seeder
 * Populates the demo Supabase instance with realistic sample data
 * Run with: ts-node scripts/seed-demo-data.ts
 */

import { createClient } from '@supabase/supabase-js';

// Demo Supabase credentials - replace with your demo instance
const DEMO_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const DEMO_SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(DEMO_SUPABASE_URL, DEMO_SUPABASE_KEY);

// Sample demo clients
const demoClients = [
  {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0101',
    address: '123 Main St, New York, NY 10001',
    id_number: 'ID-001234',
    notes: 'Regular customer, excellent credit history'
  },
  {
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1-555-0102',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    id_number: 'ID-002345',
    notes: 'Business owner, prefers monthly payments'
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    phone: '+1-555-0103',
    address: '789 Pine Rd, Chicago, IL 60601',
    id_number: 'ID-003456',
    notes: 'First-time customer'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0104',
    address: '321 Elm St, Houston, TX 77001',
    id_number: 'ID-004567',
    notes: 'Prefers bi-weekly payments'
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1-555-0105',
    address: '654 Maple Dr, Phoenix, AZ 85001',
    id_number: 'ID-005678',
    notes: 'Corporate account'
  }
];

// Sample demo products
const demoProducts = [
  {
    name: 'Laptop Pro 15"',
    description: 'High-performance laptop for professionals',
    price: 1299.99,
    cost: 899.00,
    stock: 25,
    sku: 'TECH-LAP-001',
    category: 'Electronics',
    barcode: '1234567890123'
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking',
    price: 29.99,
    cost: 15.00,
    stock: 100,
    sku: 'TECH-MOU-002',
    category: 'Electronics',
    barcode: '1234567890124'
  },
  {
    name: 'Office Chair Executive',
    description: 'Comfortable office chair with lumbar support',
    price: 299.99,
    cost: 180.00,
    stock: 15,
    sku: 'FURN-CHA-001',
    category: 'Furniture',
    barcode: '1234567890125'
  },
  {
    name: 'Smartphone X12',
    description: 'Latest smartphone with advanced features',
    price: 899.99,
    cost: 650.00,
    stock: 30,
    sku: 'TECH-PHO-003',
    category: 'Electronics',
    barcode: '1234567890126'
  },
  {
    name: 'Desk Lamp LED',
    description: 'Adjustable LED desk lamp with USB charging',
    price: 49.99,
    cost: 25.00,
    stock: 50,
    sku: 'FURN-LAM-002',
    category: 'Furniture',
    barcode: '1234567890127'
  },
  {
    name: 'Wireless Keyboard',
    description: 'Mechanical wireless keyboard with RGB lighting',
    price: 89.99,
    cost: 50.00,
    stock: 40,
    sku: 'TECH-KEY-004',
    category: 'Electronics',
    barcode: '1234567890128'
  }
];

// Generate demo loans with realistic data
function generateDemoLoans(clientIds: string[]) {
  const today = new Date();
  const loans = [];

  // Loan 1: Active loan with some payments made
  loans.push({
    client_id: clientIds[0],
    amount: 5000.00,
    interest_rate: 15.0,
    term_months: 12,
    payment_frequency: 'monthly',
    start_date: new Date(today.getFullYear(), today.getMonth() - 3, 1).toISOString(),
    status: 'active',
    notes: 'Laptop purchase financing'
  });

  // Loan 2: Recently started loan
  loans.push({
    client_id: clientIds[1],
    amount: 3000.00,
    interest_rate: 12.0,
    term_months: 6,
    payment_frequency: 'biweekly',
    start_date: new Date(today.getFullYear(), today.getMonth() - 1, 15).toISOString(),
    status: 'active',
    notes: 'Business equipment loan'
  });

  // Loan 3: Completed loan
  loans.push({
    client_id: clientIds[2],
    amount: 2000.00,
    interest_rate: 10.0,
    term_months: 6,
    payment_frequency: 'monthly',
    start_date: new Date(today.getFullYear() - 1, today.getMonth(), 1).toISOString(),
    status: 'completed',
    notes: 'Furniture purchase - paid off early'
  });

  // Loan 4: Active loan
  loans.push({
    client_id: clientIds[3],
    amount: 7500.00,
    interest_rate: 18.0,
    term_months: 18,
    payment_frequency: 'weekly',
    start_date: new Date(today.getFullYear(), today.getMonth() - 2, 1).toISOString(),
    status: 'active',
    notes: 'Multiple items purchase'
  });

  return loans;
}

async function seedDemoData() {
  try {
    console.log('🚀 Starting demo data seeding...\n');

    // 1. Seed Clients
    console.log('📋 Seeding clients...');
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .insert(demoClients)
      .select();

    if (clientsError) throw clientsError;
    console.log(`✅ Created ${clients?.length} demo clients\n`);

    // 2. Seed Products
    console.log('📦 Seeding products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .insert(demoProducts)
      .select();

    if (productsError) throw productsError;
    console.log(`✅ Created ${products?.length} demo products\n`);

    // 3. Seed Loans
    console.log('💰 Seeding loans...');
    const clientIds = clients?.map(c => c.id) || [];
    const demoLoans = generateDemoLoans(clientIds);
    
    const { data: loans, error: loansError } = await supabase
      .from('loans')
      .insert(demoLoans)
      .select();

    if (loansError) throw loansError;
    console.log(`✅ Created ${loans?.length} demo loans\n`);

    // 4. Generate installments for active loans
    console.log('📅 Generating loan installments...');
    let totalInstallments = 0;
    
    for (const loan of loans || []) {
      if (loan.status === 'active') {
        const installments = generateInstallmentsForLoan(loan);
        const { error: installmentsError } = await supabase
          .from('installments')
          .insert(installments);
        
        if (installmentsError) throw installmentsError;
        totalInstallments += installments.length;
      }
    }
    console.log(`✅ Created ${totalInstallments} installments\n`);

    // 5. Create some demo sales
    console.log('🛒 Seeding sales...');
    const demoSales = generateDemoSales(products || [], clientIds);
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .insert(demoSales)
      .select();

    if (salesError) throw salesError;
    console.log(`✅ Created ${sales?.length} demo sales\n`);

    console.log('🎉 Demo data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Clients: ${clients?.length}`);
    console.log(`   - Products: ${products?.length}`);
    console.log(`   - Loans: ${loans?.length}`);
    console.log(`   - Installments: ${totalInstallments}`);
    console.log(`   - Sales: ${sales?.length}`);

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  }
}

function generateInstallmentsForLoan(loan: any) {
  const installments = [];
  const installmentAmount = loan.amount / loan.term_months;
  const startDate = new Date(loan.start_date);

  for (let i = 0; i < loan.term_months; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    const isPaid = i < 2; // Mark first 2 installments as paid

    installments.push({
      loan_id: loan.id,
      installment_number: i + 1,
      amount: installmentAmount,
      due_date: dueDate.toISOString(),
      status: isPaid ? 'paid' : 'pending',
      paid_date: isPaid ? new Date(dueDate.setDate(dueDate.getDate() - 2)).toISOString() : null,
      paid_amount: isPaid ? installmentAmount : null
    });
  }

  return installments;
}

function generateDemoSales(products: any[], clientIds: string[]) {
  const today = new Date();
  const sales = [];

  // Sale 1: Recent sale
  sales.push({
    client_id: clientIds[0],
    total_amount: products[0].price + products[1].price,
    payment_method: 'credit_card',
    sale_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toISOString(),
    status: 'completed',
    items: [
      { product_id: products[0].id, quantity: 1, unit_price: products[0].price },
      { product_id: products[1].id, quantity: 1, unit_price: products[1].price }
    ]
  });

  // Sale 2: Today's sale
  sales.push({
    client_id: clientIds[1],
    total_amount: products[3].price,
    payment_method: 'cash',
    sale_date: today.toISOString(),
    status: 'completed',
    items: [
      { product_id: products[3].id, quantity: 1, unit_price: products[3].price }
    ]
  });

  // Sale 3: Last week
  sales.push({
    client_id: clientIds[2],
    total_amount: products[2].price,
    payment_method: 'financing',
    sale_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7).toISOString(),
    status: 'completed',
    items: [
      { product_id: products[2].id, quantity: 1, unit_price: products[2].price }
    ]
  });

  return sales;
}

// Run the seeder
seedDemoData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
