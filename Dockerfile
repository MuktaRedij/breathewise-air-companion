# -----------------------------------------------------------------------------
# BreatheWise Production Container for Google Cloud Run / Container Platforms
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package.json package-lock.json ./

# Install clean dependencies
RUN npm ci

# Copy source code and configurations
COPY . .

# Set Nitro preset to standalone Node.js server
ENV NITRO_PRESET=node-server
ENV NODE_ENV=production

# Compile production bundle
RUN npm run build

# -----------------------------------------------------------------------------
# Minimal Production Runtime
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080

# Copy compiled standalone output from builder
COPY --from=builder /app/.output ./.output

# Railway and Cloud Run inject PORT dynamically (Nitro listens on 0.0.0.0:$PORT)
CMD ["node", ".output/server/index.mjs"]
