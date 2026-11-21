# BreatheWise implementation plan

## Platform fit
The existing workspace is a TanStack Start + React 19 + TypeScript + Tailwind v4 app, not a Next.js project. Lovable supports this starter, so the implementation will keep TanStack Start rather than replace the framework. Stage 1 will be frontend-only; database, sign-in, and external API work will wait for later stages and their required setup. Vercel and Google Cloud Run deployment compatibility is not assumed from the current Cloudflare Worker configuration and will be evaluated before deployment work.

## Proposed structure
```text
src/
  routes/                 # Public home plus dashboard and feature pages
  components/             # Shared navigation, page shell, reusable visual elements
  features/               # Air quality, planner, indoor air, travel, impact, community, chat UI
  lib/                    # Demo fixtures, AQI presentation helpers, formatting
  styles.css              # Semantic design tokens and global styles
  server/                 # Later: server-only API integrations
  integrations/           # Later: generated Lovable Cloud clients
public/                    # Local static assets
```

## Stages
1. **Frontend foundation (requested now):** Replace the blank home screen with a polished BreatheWise experience, establish its semantic color/type system and responsive navigation, and build the air-quality dashboard with clearly labeled demo readings, forecasts, recommendations, and interactive trend visualization. Keep the feature areas organized for later pages; do not add fake live readings or backend calls.
2. **Pages and navigation:** Build the daily planner, indoor-air advisor, green-travel comparison, impact tracker, and community hub as connected, responsive experiences with working local interactions and empty/error/loading states.
3. **Mock-data behavior:** Add realistic fixtures and interactive behavior across the views, with transparent labels and stated assumptions for estimates.
4. **Air quality and AI:** Add secure server-side air-quality and AI integrations, validate inputs, preserve uncertainty, and avoid fabricated readings or medical claims. Use the requested provider where supported by the workspace; keep secrets server-side.
5. **Accounts and persistence:** Before writing authentication code, ask whether profile data is needed; enable Lovable Cloud before implementing persistent backend features, then add protected user preferences, recommendations, actions, impact history, and community reports with appropriate access controls.
6. **Verification:** Run relevant project tests, inspect build diagnostics, and verify the main responsive user flows.
7. **Deployment readiness:** Check the current runtime against Vercel and Google Cloud Run requirements, and add only deployment configuration that the supported runtime can actually use.

## Stage 1 details
- Keep the current TanStack Start and Tailwind v4 foundation; use installed Recharts and Lucide packages where appropriate.
- Put page files in `src/routes/`, shared UI in `src/components/`, and focused air-quality UI/data in `src/features/` and `src/lib/`.
- Give every content page its own app-specific title and social metadata when it is added.
- Keep Stage 1 free of sign-in, database, live API, or AI behavior; clearly label all sample readings as demo data.
