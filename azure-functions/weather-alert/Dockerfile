# Use a proper base image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (include devDependencies for build)
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Vite project
RUN npm run build


# -------- Production Stage --------
FROM node:18-alpine AS prod

# Set working directory
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

# Expose Vite's preview server port
EXPOSE 5173

# Command to run the preview server on port 5173
CMD ["npm", "run", "preview", "--", "--port", "5173", "--host"]
