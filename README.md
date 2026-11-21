# BreatheWise – AI-Powered Urban Air Quality Assistant

> **"Breathe better. Live smarter. Build cleaner communities."**

BreatheWise is a production-grade, vendor-independent urban environmental intelligence platform. It synthesizes real-time air quality telemetry, atmospheric science, personalized lifestyle routines, and low-emission commute analytics into a cohesive, actionable dashboard.

---

## Key Highlights

- **Dual AQI Standards**: Full support for both **Indian CPCB National AQI (NAQI)** and **US EPA AQI**, featuring precise breakpoint calculations across 6 criteria pollutants (PM2.5, PM10, O₃, NO₂, SO₂, CO).
- **Context-Aware AI Engine**: Integrates with Google Gemini API (with a scientifically grounded rule-based expert fallback) to provide location-specific, actionable health defense and emissions advice.
- **Indoor Air Quality Advisor**: Clear guidance on mechanical True HEPA filtration, ventilation timing based on outdoor ambient infiltration, and warnings against harmful ozone-generating devices.
- **Green Commute & Carbon Calculator**: Interactive trip comparator evaluating emission factors (walk, cycle, transit, metro, carpool, solo driving) with transparent assumptions and persistent impact tracking.
- **Community Clean-Air Hub**: Hyperlocal citizen reporting of smoke, construction dust, and traffic hotspots, coupled with community clean-commuting campaigns.
- **Vendor-Independent & Self-Contained**: Runs cleanly with standard `npm`, TanStack Start, and Vite in VS Code or Google Antigravity, with automated container builds for Google Cloud Run and Vercel.

---

## Technology Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (Full-stack SSR on Vite & Nitro)
- **UI & Styling**: React 19, [Tailwind CSS v4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com)
- **Visualizations**: [Recharts](https://recharts.org) & Lucide Icons
- **AI Integrations**: Google Gemini API via server-side functions with expert rule engine fallback
- **Data Integrations**: Google Maps Platform Air Quality API with regional baseline calibrations
- **State & Persistence**: Typed localStorage persistence engine with Supabase-ready schema compatibility
- **Testing**: [Vitest](https://vitest.dev) with jsdom environment

---

## Folder Structure

```
├── Dockerfile                  # Production container for Google Cloud Run
├── .dockerignore
├── .env.example                # Documented environment variable template
├── package.json
├── tsconfig.json
├── vite.config.ts              # Vite & Nitro compilation configuration
├── vitest.config.ts            # Vitest unit test configuration
├── src/
│   ├── components/             # Reusable UI controls and app shell
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── brand-mark.tsx      # Application logo and brand identity
│   │   └── breathewise-app-shell.tsx # Responsive header, nav, footer & AI chat
│   ├── config/
│   │   └── env.ts              # Safe environment variable validator
│   ├── constants/
│   │   ├── aqi-standards.ts    # Indian CPCB NAQI & US EPA breakpoint tables
│   │   └── cities.ts           # Curated catalog of Indian and global cities
│   ├── contexts/
│   │   └── air-quality-context.tsx # Shared location, AQI, and user profile state
│   ├── features/               # Domain-specific application screens
│   │   ├── air-quality/        # AQI dashboard, gauges, trends, pollutants
│   │   ├── community/          # Citizen reporting & community challenges
│   │   ├── home/               # Branded landing page and hero section
│   │   ├── impact/             # Cumulative CO2e avoided tracker & milestones
│   │   ├── indoor-air/         # Source control, HEPA purifier & ventilation advisor
│   │   ├── planner/            # Personalized 3-moment daily routine planner
│   │   └── travel/             # Green commute comparison & emission factors
│   ├── lib/
│   │   ├── error-logger.ts     # Vendor-agnostic runtime & SSR error handler
│   │   ├── impact-estimates.ts # Passenger-kilometer emission mathematics
│   │   └── utils.ts            # Class name merging utilities
│   ├── routes/                 # File-based routes (TanStack Router)
│   ├── services/               # Core business services
│   │   ├── ai.service.ts       # Gemini API client & expert health reasoning
│   │   ├── air-quality.service.ts # Data fetcher, calculator & Google Maps client
│   │   └── storage.service.ts  # Cross-session persistence engine
│   ├── test/                   # Automated unit and integration test suites
│   ├── types/                  # TypeScript interface definitions
│   ├── server.ts               # SSR entry point and catastrophic error guard
│   ├── start.ts                # TanStack Start middleware & CSRF protection
│   └── styles.css              # Tailwind v4 theme definitions and design tokens
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd breathewise-air-companion

# Install dependencies cleanly
npm install
```

### Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable                          | Description                                         | Required?                           |
| :-------------------------------- | :-------------------------------------------------- | :---------------------------------- |
| `GEMINI_API_KEY`                  | Google Gemini API key for AI features               | Optional (Fallback engine active)   |
| `GEMINI_MODEL`                    | Gemini model name (default: `gemini-1.5-flash`)     | Optional                            |
| `GOOGLE_MAPS_AIR_QUALITY_API_KEY` | Live Google Maps Air Quality API key                | Optional (Regional baseline active) |
| `NITRO_PRESET`                    | Nitro deployment target (`node-server` or `vercel`) | Optional                            |
| `PORT`                            | Local or container port (default: 8080)             | Optional                            |

> **Note**: If API keys are not supplied, BreatheWise automatically runs in **Verified Regional Baseline Mode**, featuring authentic pollutant distributions and an advanced rule-based expert intelligence engine.

---

## Development & Testing

```bash
# Start local development server
npm run dev

# Run unit tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

---

## Production Deployment

### Option A: Google Cloud Run (Recommended Container)

Build and deploy with Docker:

```bash
# Build production Docker image
docker build -t breathewise:latest .

# Run container locally to test
docker run -p 8080:8080 -e PORT=8080 breathewise:latest

# Deploy to Google Cloud Run
gcloud run deploy breathewise \
  --image gcr.io/<PROJECT_ID>/breathewise:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Option B: Vercel

```bash
# Set Vercel Nitro preset and build
export NITRO_PRESET=vercel
npm run build
```

Or connect the GitHub repository directly to Vercel.

---

## License

MIT License. Designed and maintained independently.
