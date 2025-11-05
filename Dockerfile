# syntax=docker/dockerfile:1
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (cache-friendly)
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Expose port
EXPOSE 3000

# Run the dev server
CMD ["npm", "run", "dev"]
