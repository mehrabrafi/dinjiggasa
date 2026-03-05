# Stage 1: Build the app
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Run the app
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary files from builder
# We use the standalone output feature of Next.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# Set the hostname to 0.0.0.0 to make it accessible inside a container
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
