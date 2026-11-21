# BreatheWise Air Companion

# Build BreatheWise – AI-Powered Urban Air Quality Assistant

Act as a senior full-stack engineer, UI/UX designer, and AI application architect.

Build a production-quality, responsive web application called **BreatheWise**.

Tagline: "Breathe better. Live smarter. Build cleaner communities."

## 1. Technology Stack

Use the following technologies:

- Next.js with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide icons
- Recharts for charts
- Gemini API for AI features
- Supabase for authentication and database
- Google Maps Platform Air Quality API for air quality information
- Browser Geolocation API for location detection

The application must be deployable on Vercel and Google Cloud Run.

## 2. Design Requirements

Create a premium, modern environmental technology dashboard.

Design inspiration:
- Modern SaaS dashboards
- Apple-like minimalism
- Environmental sustainability applications
- Clean and intuitive mobile-first layouts

Color palette:
- Deep forest green
- Emerald green
- Teal
- Off-white
- Soft gray
- Amber and red for pollution warnings

Use:
- Rounded cards
- Subtle shadows
- Smooth transitions
- Clean typography
- Responsive navigation
- Interactive charts
- Beautiful data visualizations

Avoid generic AI-generated website aesthetics.

## 3. Application Pages

### A. Landing Page

Create a beautiful landing page with:
- BreatheWise branding
- Hero section
- Live air-quality preview
- Explanation of application features
- How it works
- Environmental impact statistics
- Call-to-action buttons
- Footer

### B. Main Dashboard

Display:
- User's current location
- Current AQI
- Pollution severity
- PM2.5 and PM10
- Other available pollutant readings
- Air-quality forecast
- Health recommendations
- Pollution trend chart
- Today's recommended actions

Allow users to search for another city.

### C. AI Daily Planner

Build a personalized daily planner.

Collect:
- Location
- Occupation
- Daily commute method
- Exercise habits
- Household type
- Lifestyle preferences

Generate recommendations for morning, afternoon and evening.

Explain why each recommendation is useful.

### D. Indoor Air Quality Assistant

Create an AI-powered home air-quality advisor.

Features:
- Indoor pollution reduction suggestions
- Ventilation recommendations
- Air purifier guidance
- Dust management
- Indoor pollution source identification
- Personalized household recommendations

### E. Green Travel Advisor

Compare:
- Walking
- Cycling
- Public transport
- Metro
- Carpooling
- Personal vehicles

Display estimated emissions and environmental benefits.

Allow users to select their usual commute and compare sustainable alternatives.

### F. Sustainability Impact Tracker

Create an interactive impact dashboard showing:
- Estimated CO2 emissions avoided
- Sustainable trips
- Green actions completed
- Weekly and monthly progress
- Achievement badges
- Personal sustainability score

Clearly label calculated figures as estimates and show their assumptions.

### G. Community Hub

Create:
- Community pollution reports
- Local pollution hotspots
- Community challenges
- Clean-air campaigns
- User contributions
- Neighborhood environmental awareness

### H. AI Chat Assistant

Create a floating AI chat interface.

The assistant should answer questions such as:

- Is it safe to go jogging today?
- How can I protect my family from PM2.5?
- What is the best time to open my windows?
- How can I reduce pollution exposure during my commute?
- What can I do to reduce my carbon footprint?

Use Gemini API with structured prompts.

Never fabricate AQI measurements or present AI-generated medical advice as a substitute for professional guidance.

## 4. AI Architecture

Create reusable AI service functions:

- generateDailyRoutine()
- generateIndoorAirAdvice()
- generateTravelRecommendations()
- generateCommunitySuggestions()
- generateChatResponse()

Pass actual air-quality information and user preferences into Gemini.

Use structured JSON responses wherever possible.

The AI should:
- Explain recommendations.
- Explain the expected benefit.
- Prioritize practical and affordable actions.
- Adapt recommendations to the user's lifestyle.
- Identify uncertainty and missing data.

## 5. External API Integration

Create separate service modules for:

- Google Air Quality API
- Gemini API
- Supabase
- Geolocation

Keep API keys in environment variables.

Create .env.example with all required environment variables.

If API credentials are unavailable, use realistic mock data with a clear DEMO DATA label.

Never pretend mock data is live data.

## 6. Database Design

Create Supabase tables for:

- users
- user_preferences
- daily_recommendations
- sustainability_actions
- impact_history
- community_reports

Implement appropriate authentication and database access policies.

## 7. Important UX Requirements

- Fully responsive desktop, tablet and mobile layouts.
- Loading skeletons.
- Error states.
- Empty states.
- Interactive charts.
- Accessible components.
- Clear pollution severity indicators.
- Functional navigation.
- Realistic demo data.
- No non-functional buttons.

## 8. Development Instructions

Work in stages.

Stage 1: Create the project structure and complete the frontend.

Stage 2: Implement all pages and navigation.

Stage 3: Add mock data and interactive dashboard functionality.

Stage 4: Integrate external APIs and Gemini.

Stage 5: Implement Supabase authentication and persistence.

Stage 6: Test the application and fix errors.

Stage 7: Prepare deployment configurations for Vercel and Google Cloud Run.

Before starting, create an implementation plan and explain the proposed folder structure.

Do not stop after creating a landing page. Build the complete working application.

Prioritize a visually impressive and functional MVP, clean code, reusable components, and easy deployment.

Start by examining the workspace, then implement Stage 1.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c0c18fd0-b212-4af6-bf56-b92cde3243ff).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
