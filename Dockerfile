# Step 1: Use official Node image as base
FROM node:20-alpine AS builder

# Step 2: Set working directory
WORKDIR /app

# Step 3: Install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the source code
COPY . .

# Step 5: Build TypeScript
RUN npm run build

# Step 6: Create a smaller image for production
FROM node:20-alpine

# Step 7: Set working directory
WORKDIR /app

# Step 8: Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
# Copy source files needed for migrations and seeds
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/seeds ./seeds
COPY --from=builder /app/knexfile.ts ./knexfile.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/src ./src

# Step 9: Install mysql client for health checks
RUN apk add --no-cache mysql-client

# Step 10: Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Step 11: Expose port (adjust based on your Express server port)
EXPOSE 3000

# Step 12: Set entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Step 13: Run the app
CMD ["node", "dist/server.js"]
