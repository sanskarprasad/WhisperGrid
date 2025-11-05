# syntax=docker/dockerfile:1
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Enable corepack to use the yarn version from your package.json
RUN corepack enable

# Copy all package manifests and lockfile first
# This is optimized for Docker layer caching in a monorepo
COPY package.json yarn.lock* ./
COPY turbo.json ./
COPY apps/docs/package.json ./apps/docs/
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies using yarn (this will set up workspaces)
RUN yarn install --frozen-lockfile

# Copy the rest of the project source code
COPY . .

# Expose port (from your docker-compose.yml)
EXPOSE 3000

# Run the dev server (this command is correct)
CMD ["npm", "run", "dev"]