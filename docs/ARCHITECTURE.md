# Architecture Guide

Comprehensive overview of the Business Management System architecture, design patterns, and technical decisions.

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Patterns](#architecture-patterns)
4. [Folder Structure](#folder-structure)
5. [Data Flow](#data-flow)
6. [Key Components](#key-components)
7. [Security Architecture](#security-architecture)
8. [Performance Optimization](#performance-optimization)

---

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Browser / Client                      │
│              (Next.js App Router Frontend)               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js Server Components                   │
│         (SSR - 88% optimization achieved)                │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Page Components (async server-side fetch)      │  │
│  │  - Dashboard (/), POS (/pos), Inventory, etc    │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────────┐    ┌──────────────────┐
│   API Routes     │    │  Service Layer   │
│ (POST/GET/etc)   │    │ (Business Logic) │
│  /api/loans/     │    │  loans.service   │
│  /api/sales/     │    │  loans.calculator│
│  /api/auth/      │    │  loans.repository│
└────────┬─────────┘    └────────┬─────────┘
         │                        │
         └────────────┬───────────┘
                      ▼
         ┌─────────────────────────┐
         │  Supabase (PostgreSQL)  │
         │  ├─ Authentication      │
         │  ├─ Database (RLS)      │
         │  └─ Real-time (optional)│
         └─────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Next.js 15.5** - React framework with App Router
- **React 18** - UI library with Server Components
- **TypeScript 5.0** - Type safety (strict mode)
- **Tailwind CSS 3.4** - Utility-first CSS
- **shadcn/ui** - Pre-built component library
- **Recharts** - Data visualization library
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless functions
- **Supabase** - PostgreSQL database + Auth
- **Row Level Security (RLS)** - Data protection
- **PostgREST** - Auto-generated REST API

### Testing & Quality
- **Vitest** - Unit and integration testing
- **Testing Library** - Component testing
- **57 test suite** - Comprehensive coverage

### DevOps
- **Vercel** - Production deployment
- **Docker** - Containerization
- **GitHub Actions** - CI/CD ready

---

## Architecture Patterns

### 1. **Server-First Architecture**

By default, all pages are **Server Components**. This means:

```typescript
// ✅ GOOD - Server Component (default)
export const revalidate = 60; // ISR every 60s

async function getLoans() {
  return await supabase
    .from('loans')
    .select('*')
    .order('created_at', { ascending: false });
}

export default async function LoansPage() {
  const loans = await getLoans();
  return <LoansClient loans={loans} />;
}
```

**Benefits:**
- Direct database queries (no N+1 problem)
- No API over-fetching
- Automatic caching via ISR
- Smaller JavaScript bundle
- Better SEO

### 2. **Repository Pattern**

Data access is abstracted in a repository layer:

```
src/modules/loans/
├── loans.repository.ts    # Data access layer
├── loans.service.ts       # Business logic
├── loans.calculator.ts    # Complex calculations
└── index.ts               # Exports
```

**Example:**

```typescript
// loans.repository.ts
export class LoansRepository {
  async findById(id: string) {
    return await supabase
      .from('loans')
      .select('*')
      .eq('id', id)
      .single();
  }

  async create(loan: CreateLoanDTO) {
    return await supabase
      .from('loans')
      .insert([loan])
      .select()
      .single();
  }
}

// loans.service.ts
export class LoansService {
  constructor(private repo: LoansRepository) {}

  async createLoan(data: CreateLoanDTO) {
    const loan = await this.repo.create(data);
    // Business logic here
    return loan;
  }
}
```

**Benefits:**
- Separation of concerns
- Easy to test (mock repo)
- Reusable data access logic
- Single source of truth

### 3. **Service Layer**

Complex business logic is isolated in service classes:

```typescript
// loans.service.ts
export class LoansService {
  async processPayment(loanId: string, amount: number) {
    const loan = await this.repo.findById(loanId);
    
    // Business logic
    const distribution = this.calculator.distributePayment(
      loan,
      amount
    );

    // Update installments
    await this.repo.updateInstallments(distribution);
    
    return { loanId, paid: amount };
  }

  private validatePayment(loan: Loan, amount: number) {
    // Validation logic
  }
}
```

**Benefits:**
- Testable business logic
- Reusable across API and components
- Clear domain knowledge
- Easy to maintain

### 4. **Factory Pattern**

For complex object creation, we use factories:

```typescript
// loans.calculator.ts
export class LoanCalculator {
  calculateInstallments(
    amount: number,
    term: number,
    interestRate: number
  ): Installment[] {
    // Complex calculation logic
    return installments;
  }

  distributePayment(
    loan: Loan,
    amount: number
  ): PaymentDistribution {
    // Algorithm to distribute payment across installments
  }
}
```

**Benefits:**
- Encapsulation of complex logic
- Easy to unit test
- Reusable calculations
- Type-safe

### 5. **Validation Schema Pattern**

Input validation using Zod schemas:

```typescript
// schemas/loan.schema.ts
export const createLoanSchema = z.object({
  client_id: z.string().uuid(),
  amount: z.number().positive(),
  term: z.number().int().min(1).max(60),
  interest_rate: z.number().min(0).max(100),
  status: z.enum(['active', 'completed', 'defaulted']),
});

export type CreateLoanDTO = z.infer<typeof createLoanSchema>;

// API route
export async function POST(request: Request) {
  const data = await request.json();
  const validated = createLoanSchema.parse(data); // Throws if invalid
  // Process validated data
}
```

**Benefits:**
- Type-safe validation
- Automatic TypeScript inference
- Runtime safety
- Clear documentation

---

## Folder Structure

```
src/
├── app/
│   ├── api/                    # API routes (backend)
│   │   ├── auth/              # Authentication
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   ├── loans/             # Loans API
│   │   │   ├── route.ts       # GET, POST
│   │   │   ├── [id]/route.ts  # PUT, DELETE
│   │   │   └── route.test.ts  # Tests
│   │   ├── sales/
│   │   ├── products/
│   │   ├── clients/
│   │   └── users/
│   │
│   └── (pages)/               # Pages (frontend)
│       ├── page.tsx           # Dashboard
│       ├── layout.tsx         # Root layout
│       ├── loans/
│       │   ├── page.tsx       # List loans
│       │   └── [id].tsx       # Loan details
│       ├── pos/               # Point of Sale
│       ├── inventory/         # Inventory management
│       ├── finance/           # Financial dashboards
│       ├── clients/           # Client management
│       ├── login/             # Authentication
│       └── settings/          # App settings
│
├── components/                # React components
│   ├── ui/                    # Base components (shadcn)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── loans/                 # Loan-specific components
│   │   ├── loans-client.tsx
│   │   ├── loan-form.tsx
│   │   ├── payment-modal.tsx
│   │   └── loan-table.tsx
│   ├── pos/                   # POS-specific components
│   ├── inventory/             # Inventory components
│   ├── dashboard/             # Dashboard widgets
│   ├── finance/               # Finance components
│   ├── header.tsx             # Top navigation
│   ├── nav.tsx                # Sidebar navigation
│   └── main-layout.tsx        # Main layout wrapper
│
├── lib/                       # Utilities and configs
│   ├── supabaseClient.ts      # Supabase client setup
│   ├── supabaseServer.ts      # Server-side Supabase
│   ├── types.ts               # Global TypeScript types
│   ├── utils.ts               # Helper functions
│   ├── loans.ts               # Loan utilities
│   ├── logger.ts              # Logging utility
│   └── placeholder-images.ts  # Demo images
│
├── modules/                   # Feature modules (business logic)
│   └── loans/
│       ├── loans.repository.ts       # Data access
│       ├── loans.service.ts          # Business logic
│       ├── loans.calculator.ts       # Calculations
│       ├── loans.service.test.ts     # Service tests
│       ├── loans.calculator.test.ts  # Calculator tests
│       └── index.ts                  # Exports
│
├── schemas/                   # Zod validation schemas
│   ├── loan.schema.ts
│   ├── sale.schema.ts
│   ├── product.schema.ts
│   ├── client.schema.ts
│   └── index.ts
│
├── hooks/                     # Custom React hooks
│   ├── use-auth.tsx          # Authentication hook
│   ├── use-mobile.tsx        # Mobile detection
│   └── use-toast.ts          # Toast notifications
│
├── middleware.ts              # Next.js middleware
├── globals.css               # Global styles
└── layout.tsx                # Root layout
```

---

## Data Flow

### Server Component Data Fetching

```
Page Load
   ↓
[Server Component] (app/loans/page.tsx)
   ├─ async function getLoans()
   ├─ Direct Supabase query (no API)
   ├─ Data returned to component
   │
   └─→ [Rendered HTML]
        ├─ Static/ISR cache
        └─→ [Browser] Hydrated page
```

### Mutation Flow (Create/Update)

```
User Action (Form Submit)
   ↓
[Client Component] (uses "use client")
   ├─ Form validation (Zod)
   ├─ POST to /api/loans
   │
   ├─→ [API Route] (src/app/api/loans/route.ts)
   │    ├─ Parse & validate request
   │    ├─ LoansService.create()
   │    │  ├─ LoansRepository.create()
   │    │  ├─ Supabase insert
   │    │  └─ Return created loan
   │    └─ Response 200 + data
   │
   ├─ Revalidate cache (revalidatePath)
   └─ Update UI / toast notification
```

### Payment Processing Flow

```
Make Payment (Complex)
   ↓
[Client Component] - Payment Modal
   ├─ Enter amount
   ├─ POST /api/loans/[id]/pay
   │
   ├─→ [API Route]
   │    ├─ Validate payment
   │    ├─ LoansService.processPayment()
   │    │  ├─ Get loan details
   │    │  ├─ LoanCalculator.distributePayment()
   │    │  │  ├─ Algorithm: distribute across installments
   │    │  │  ├─ Calculate late fees
   │    │  │  └─ Return distribution map
   │    │  ├─ Update installments (batch)
   │    │  ├─ Create payment record
   │    │  └─ Update loan status
   │    └─ Response with payment details
   │
   ├─ Revalidate /loans page
   └─ Show success toast
```

---

## Key Components

### 1. **Pages (Server Components)**

```typescript
// app/loans/page.tsx
export const revalidate = 60; // Cache for 60 seconds

async function getLoans() {
  const { data, error } = await supabase
    .from('loans')
    .select('*, profiles(name, email)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export default async function LoansPage() {
  const loans = await getLoans();
  return <LoansClient loans={loans} />;
}
```

**Characteristics:**
- Async/await syntax
- Direct database access
- No client JavaScript
- ISR/Static generation

### 2. **Client Components**

```typescript
// components/loans/loans-client.tsx
'use client';

import { useState } from 'react';
import { LoansTable } from './loan-table';
import { PaymentModal } from './payment-modal';

export function LoansClient({ loans }) {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  return (
    <>
      <LoansTable 
        loans={loans}
        onPayClick={(loan) => {
          setSelectedLoan(loan);
          setShowPayment(true);
        }}
      />
      {showPayment && (
        <PaymentModal
          loan={selectedLoan}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  );
}
```

**Characteristics:**
- 'use client' directive
- React hooks (useState, useEffect)
- Event handlers
- Interactive UI

### 3. **API Routes**

```typescript
// app/api/loans/route.ts
import { loansService } from '@/modules/loans';
import { createLoanSchema } from '@/schemas/loan.schema';

export async function GET(request: Request) {
  const loans = await loansService.findAll();
  return Response.json(loans);
}

export async function POST(request: Request) {
  const data = await request.json();
  
  // Validate
  const validated = createLoanSchema.parse(data);
  
  // Create
  const loan = await loansService.create(validated);
  
  return Response.json(loan, { status: 201 });
}

export async function PATCH(request: Request) {
  // Update existing loan
}

export async function DELETE(request: Request) {
  // Delete loan
}
```

**Characteristics:**
- Handles HTTP methods
- Input validation
- Service layer calls
- JSON responses

### 4. **Service Layer**

```typescript
// modules/loans/loans.service.ts
export class LoansService {
  constructor(
    private repository: LoansRepository,
    private calculator: LoanCalculator
  ) {}

  async create(data: CreateLoanDTO): Promise<Loan> {
    // Validation
    this.validateLoan(data);

    // Create loan record
    const loan = await this.repository.create(data);

    // Calculate and create installments
    const installments = this.calculator.calculateInstallments(
      data.amount,
      data.term,
      data.interest_rate
    );

    await this.repository.createInstallments(loan.id, installments);

    return loan;
  }

  async processPayment(loanId: string, amount: number) {
    const loan = await this.repository.findById(loanId);
    
    // Distribution algorithm
    const distribution = this.calculator.distributePayment(loan, amount);

    // Update database
    await this.repository.updateInstallments(distribution);

    return { success: true, distributed: distribution };
  }
}
```

### 5. **Repository Layer**

```typescript
// modules/loans/loans.repository.ts
export class LoansRepository {
  async findById(id: string) {
    return await supabase
      .from('loans')
      .select('*')
      .eq('id', id)
      .single();
  }

  async create(loan: CreateLoanDTO) {
    return await supabase
      .from('loans')
      .insert([loan])
      .select()
      .single();
  }

  async updateInstallments(updates: InstallmentUpdate[]) {
    // Batch update
    return await supabase
      .from('installments')
      .upsert(updates);
  }
}
```

---

## Security Architecture

### 1. **Authentication Flow**

```
Login Form
   ↓
[POST /api/auth/login]
   ├─ Validate email/password
   ├─ Supabase Auth.signIn()
   ├─ Create JWT token
   ├─ Set HttpOnly Secure Cookie
   └─ Response redirect to dashboard

Browser
   └─ Automatically sends cookie with requests
```

### 2. **Authorization**

```typescript
// Middleware: Check authentication
middleware.ts
   ├─ Verify JWT from cookie
   ├─ Attach user to request
   └─ Allow/deny based on route

// Database: Row Level Security (RLS)
SELECT * FROM loans
WHERE user_id = auth.uid()  -- Only user's loans
```

### 3. **Security Headers**

```
Content-Security-Policy:
  ├─ script-src 'self' 'unsafe-inline'
  ├─ style-src 'self' 'unsafe-inline'
  ├─ img-src 'self' data: https:
  ├─ connect-src 'self' https://supabase.co
  └─ frame-ancestors 'none'

X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

### 4. **Input Validation**

```typescript
// All API inputs validated with Zod
const createLoanSchema = z.object({
  amount: z.number().positive(),
  term: z.number().int().min(1),
  interest_rate: z.number().min(0).max(100),
  // ...
});

// Throws on invalid input
const data = createLoanSchema.parse(userInput);
```

---

## Performance Optimization

### 1. **Server-Side Rendering (88% optimization)**

```
Pages using SSR:          8/9 (89%)
├─ Dashboard ✓
├─ POS ✓
├─ Inventory ✓
├─ Finance ✓
├─ Loans ✓
├─ Clients ✓
├─ Settings ✓
└─ Login ✓ (correct - auth page)
```

**Impact:**
- No data fetching waterfall
- Pre-rendered HTML at edge
- Faster First Contentful Paint
- Better Core Web Vitals

### 2. **Incremental Static Regeneration (ISR)**

```typescript
// Cached for 60 seconds, then regenerated
export const revalidate = 60;

// Different cache times per page
/            → 60s (dashboard changes frequently)
/pos         → 300s (sales less frequent)
/finance     → 60s (analytics updated often)
/inventory   → 300s (products stable)
```

### 3. **Code Splitting**

```typescript
// Automatic chunk splitting
import dynamic from 'next/dynamic';

const LoansChart = dynamic(
  () => import('@/components/loans-chart'),
  { loading: () => <Skeleton /> }
);
```

### 4. **Image Optimization**

```typescript
import Image from 'next/image';

// Automatic:
// - Lazy loading
// - Format negotiation (WebP)
// - Responsive sizes
// - Blur placeholder
```

### 5. **Bundle Analysis**

```bash
# Analyze bundle size
ANALYZE=true npm run build

# Results show:
// - app.js: 101kB (shared)
// - loans: 21.9kB (route)
// - pos: 9.61kB (route)
```

---

## Testing Strategy

### 1. **Unit Tests** (20 tests)

```typescript
// modules/loans/loans.calculator.test.ts
describe('LoanCalculator', () => {
  it('should calculate installments correctly', () => {
    const installments = calculator.calculateInstallments(
      1000,  // amount
      12,    // term
      5      // interest rate
    );
    expect(installments).toHaveLength(12);
    expect(installments[0].principal).toBeLessThan(100);
  });
});
```

### 2. **Integration Tests** (18 tests)

```typescript
// modules/loans/loans.service.test.ts
describe('LoansService', () => {
  it('should create loan with installments', async () => {
    const loan = await service.create({
      client_id: 'xxx',
      amount: 1000,
      term: 12,
      interest_rate: 5,
    });
    expect(loan.id).toBeDefined();
  });
});
```

### 3. **API Tests** (19 tests)

```typescript
// app/api/loans/route.test.ts
describe('POST /api/loans', () => {
  it('should create loan via API', async () => {
    const response = await fetch('/api/loans', {
      method: 'POST',
      body: JSON.stringify(loanData),
    });
    expect(response.status).toBe(201);
  });
});
```

**Coverage: 57 tests total**

---

## Deployment Architecture

### Development
```
localhost:9000
   ↓
Next.js Dev Server (Turbopack)
   ├─ Hot reload
   ├─ Fast refresh
   └─ Dev tools
```

### Production
```
Vercel Edge
   ├─ Build: npm run build
   ├─ Deploy: Auto-redeployment on push
   ├─ Environment variables configured
   └─ Custom domain support

Alternatively (Docker):
   ├─ Build: docker build
   ├─ Push: docker hub username/demo:v1
   └─ Run: docker run -p 9000:9000
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Server Components by default | Reduce JS bundle, improve performance |
| Repository Pattern | Testable, reusable data access |
| Service Layer | Clear separation of business logic |
| Zod Validation | Type-safe, runtime validation |
| ISR over SSG | Fresh data without on-demand regeneration |
| HttpOnly Cookies | XSS protection for JWT |
| Supabase RLS | Database-level authorization |
| 57 Test Suite | Comprehensive coverage and confidence |

---

## Future Improvements

- [ ] Implement WebSocket for real-time updates
- [ ] Add GraphQL layer for complex queries
- [ ] Implement caching layer (Redis)
- [ ] Add microservices for payment processing
- [ ] Implement event sourcing for audit trail
- [ ] Add internationalization (i18n)
- [ ] Mobile app (React Native)

---

**For more information, see:**
- [API Reference](./API.md)
- [Security Guide](../SECURITY.md)
- [README](../README.md)
