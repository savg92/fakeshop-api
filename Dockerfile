FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Generate a fresh package-lock.json
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create production image
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files and build artifacts
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]