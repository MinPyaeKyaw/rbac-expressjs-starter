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

# Step 9: Expose port (adjust based on your Express server port)
EXPOSE 2000

# Step 10: Run the app
CMD ["node", "dist/server.js"]
