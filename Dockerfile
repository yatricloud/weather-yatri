# Stage 1: Build the application
FROM node:14-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY . .
RUN npm run build

# Stage 2: Run the application
FROM node:14-alpine

WORKDIR /app

COPY --from=build /app ./

EXPOSE 5173

CMD ["npm", "run", "start"]
