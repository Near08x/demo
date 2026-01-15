<div align="center">
  <h1>📊 Business Management System</h1>
  <p><strong>Full-stack business management platform with POS, inventory control, and financial analytics</strong></p>
  
  <p>
    <a href="https://demo-lyart-zeta-92.vercel.app"><strong>Live Demo →</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/Tests-57%20passing-success?style=flat" alt="Tests" />
    <img src="https://img.shields.io/badge/Deployed-Vercel-black?style=flat&logo=vercel" alt="Vercel" />
  </p>
</div>

---

## 📋 Overview

A production-ready business management system designed for small to medium retail operations. This demo showcases enterprise-grade architecture patterns including Server-Side Rendering, comprehensive testing, and security-first development.

**Built with production experience** — this application is based on a real-world system currently in use by an active retail business, adapted as a portfolio demonstration project.

## ✨ Key Features

### 💰 Point of Sale (POS)
- Fast checkout with real-time inventory updates
- Support for multiple payment methods
- Thermal receipt printing
- Sales history and reporting

### 📦 Inventory Management
- Product catalog with categories
- Stock level tracking and alerts
- Automated restock calculations
- Barcode/SKU support

### 📊 Financial Analytics
- Real-time sales dashboards
- Revenue and profit tracking
- Interactive charts (Recharts)
- Business metrics visualization

### 👥 Client Management
- Customer database with purchase history
- Credit and payment tracking
- Customer analytics

### 🏦 Loan System (Advanced)
- Automated installment calculations
- Late fee management
- Payment distribution algorithms
- Comprehensive loan tracking

### 🔐 Security & Performance
- HttpOnly cookies with JWT authentication
- CSRF protection (SameSite cookies)
- Restrictive Content Security Policy
- Server-Side Rendering for optimal performance
- 57 comprehensive test suite

## 🛠️ Tech Stack

**Framework & Language**
- [Next.js 15.5](https://nextjs.org/) with App Router
- TypeScript 5.0 (strict mode)
- React 18 with Server Components

**Backend & Database**
- [Supabase](https://supabase.com/) (PostgreSQL)
- Direct server-side queries (optimized SSR)
- Row Level Security (RLS)

**UI & Styling**
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) components
- [Recharts](https://recharts.org/) for data visualization
- Responsive design (mobile-first)

**Testing & Quality**
- [Vitest](https://vitest.dev/) (57 tests)
- Unit & integration testing
- API endpoint testing

**DevOps**
- Vercel deployment
- Docker support
- GitHub Actions ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account (or PostgreSQL)
- npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Near08x/demo.git
cd demo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations (optional)
npm run migrate

# Start development server
npm run dev
```

Open [http://localhost:9000](http://localhost:9000) in your browser.

### Demo Credentials

**Live Demo**: [https://demo-lyart-zeta-92.vercel.app](https://demo-lyart-zeta-92.vercel.app)

```
Email: demo@example.com
Password: DemoPassword123
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (RESTful)
│   ├── (pages)/           # Application pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn)
│   └── [domain]/         # Domain-specific components
├── lib/                   # Utilities & configs
│   ├── supabaseClient.ts # Supabase client
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
├── modules/               # Business logic
│   └── loans/            # Loan module (service layer)
└── schemas/               # Zod validation schemas
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# View test coverage
npm run test:coverage
```

**Test Coverage**: 57 tests across calculator utilities, service layer, and API routes.

## 🏗️ Architecture Highlights

- **Server Components by Default**: 88% SSR optimization
- **Repository Pattern**: Clean data access layer
- **Service Layer**: Business logic separation
- **Factory Pattern**: Loan calculation strategies
- **Zod Validation**: Type-safe input validation
- **Security Headers**: CSP, X-Frame-Options, HSTS

## 🔒 Security Features

- ✅ HttpOnly secure cookies (7-day JWT expiration)
- ✅ CSRF protection via SameSite=Lax
- ✅ Content Security Policy (production-ready)
- ✅ Input validation (Zod schemas)
- ✅ XSS prevention headers
- ✅ SQL injection prevention (Supabase RLS)

## 📊 Performance

- **First Contentful Paint**: < 1.2s
- **Time to Interactive**: < 2.5s
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)
- **Bundle Size**: Optimized with code splitting

## 🐳 Docker Support

```bash
# Build Docker image
docker build -t studio-demo .

# Run container
docker run -p 9000:9000 studio-demo
```

See [DOCKER.md](./DOCKER.md) for detailed deployment instructions.

## 📚 Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md) - System design and patterns
- [API Reference](./docs/API.md) - Endpoint documentation
- [Security Guide](./SECURITY.md) - Security implementation details
- [Deployment Guide](./VERCEL_DEPLOYMENT.md) - Production deployment

## 🤝 Contributing

This is a portfolio demonstration project. While not actively seeking contributions, feel free to:
- Open issues for bugs or suggestions
- Fork for your own learning
- Provide feedback on architecture decisions

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

[MIT License](./LICENSE) - feel free to use this code for learning and portfolio purposes.

## 🔗 Connect

**Robert Vasquez**
- GitHub: [@Near08x](https://github.com/Near08x)
- LinkedIn: [robertvasquez08](https://www.linkedin.com/in/robertvasquez08)
- X/Twitter: [@robertvasquez08](https://x.com/robertvasquez08)

---

<div align="center">
  <p><strong>Built with Next.js • Deployed on Vercel</strong></p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
