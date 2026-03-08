# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Copy source code
COPY . .

# Generate Prisma client and build the app
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:22-alpine

# Install FFmpeg for live streaming processes
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy only necessary files from the builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Command to run migrations and start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
