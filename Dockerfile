# Step 1: Build the Vite app
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build

# Step 2: Serve with nginx
FROM nginx:alpine

# Copy built files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default nginx config and replace with custom one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
