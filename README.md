# NightShift MD

Emergency triage system for streamlined patient intake and doctor monitoring.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite (Rolldown)
- **Styling**: Tailwind CSS with custom dark theme
- **Backend**: Supabase (PostgreSQL, Real-time, Storage)
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Add your Supabase credentials to `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Set up your Supabase backend:
   - Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - Create the database schema using `supabase-setup.sql`
   - Create the storage bucket and policies using `supabase-storage-setup.sql`

### Development

Run the development server:
```bash
npm run dev
```

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

### Testing

Run tests:
```bash
npm run test
```

## Deployment

### 🚀 Ready to Deploy?

**[→ Deploy Now in 5 Minutes](./DEPLOY_NOW.md)** - Quick start guide

### 📚 Documentation

**[→ Deployment Documentation Index](./DEPLOYMENT_INDEX.md)** - Complete guide to all deployment docs

- 📋 [Production Checklist](./PRODUCTION_CHECKLIST.md) - Complete before deploying
- 🚀 [Quick Deploy Guide](./QUICK_DEPLOY.md) - Fast deployment steps
- 📖 [Detailed Deployment Guide](./DEPLOYMENT.md) - Comprehensive instructions
- ✅ [Post-Deployment Checklist](./POST_DEPLOYMENT_CHECKLIST.md) - Verify deployment
- 📊 [Deployment Summary](./DEPLOYMENT_SUMMARY.md) - Overview and statistics

### Quick Deploy

**Vercel** (Recommended):
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

**Netlify**:
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

**Required Environment Variables**:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Pre-Deployment

Before deploying, run:
```bash
npm run build          # Build production bundle
npm run preview        # Test locally
npm run predeploy      # Run pre-deployment checks
```

## Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI components
│   ├── patient/     # Patient interface components
│   ├── doctor/      # Doctor dashboard components
│   └── layout/      # Layout components
├── pages/           # Page components
├── services/        # API and service layer
├── hooks/           # Custom React hooks
├── context/         # React context providers
├── utils/           # Utility functions
└── styles/          # Global styles
```

## Design System

### Colors

- **Primary Background**: `#0A1A2F`
- **Accent**: `#00E5A5` (Neon green)
- **Risk Levels**:
  - Critical: `#EF4444` (Red)
  - Medium: `#F59E0B` (Orange)
  - Low: `#10B981` (Green)

### Typography

- **Font Family**: Inter (sans-serif)
- **Monospace**: JetBrains Mono

## License

Private - All rights reserved
