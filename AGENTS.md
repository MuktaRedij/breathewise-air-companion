# BreatheWise Engineering Guidelines

## Architecture Overview

- **Routes**: Thin route definitions and page shells in `src/routes/`.
- **Features**: Domain-specific presentation, interactive dashboards, and feature screens in `src/features/`.
- **Components**: Reusable UI primitives and layout controls in `src/components/`.
- **Services**: Business logic, API integrations (Gemini, Google Maps Air Quality, Supabase), and persistence in `src/services/`.
- **Contexts**: Cross-cutting state (active location, live AQI data, user profile) in `src/contexts/`.
- **Constants**: Regional AQI standards (CPCB, EPA), breakpoints, and curated city catalogs in `src/constants/`.
- **Types**: Shared TypeScript interfaces and domain schemas in `src/types/`.

## Code Conventions

- Keep business and calculation logic decoupled from presentation components.
- Support both Indian CPCB NAQI and US EPA AQI standards accurately.
- Never present simulated/demo data as live measurements without clear labeling.
- Keep server-side API keys (`GEMINI_API_KEY`, Supabase service keys) out of client-side bundles.
