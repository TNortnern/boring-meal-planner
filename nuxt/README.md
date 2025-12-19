# BORING Meal Planner

A meal planning application built with Nuxt UI, Payload CMS, and PostgreSQL.

## Stack

- **Frontend**: Nuxt 3 + Nuxt UI
- **Backend**: Payload CMS (Next.js)
- **Database**: PostgreSQL 16
- **CDN**: Bunny CDN (optional)

## Docker Setup (Recommended)

The easiest way to run the full stack locally is with Docker Compose.

### Prerequisites

- Docker and Docker Compose installed
- Copy `.env.example` to `.env` and fill in required values

### Quick Start with Docker

```bash
# Copy environment file
cp .env.example .env

# Generate a secure PAYLOAD_SECRET
openssl rand -base64 32

# Add the generated secret to .env
# Edit .env and set PAYLOAD_SECRET=<generated-secret>

# Start all services (postgres, payload, nuxt)
docker-compose up

# Or run in detached mode
docker-compose up -d
```

### Access the Application

- **Frontend (Nuxt)**: http://localhost:3009
- **Payload Admin**: http://localhost:3010/admin
- **PostgreSQL**: localhost:5434 (mapped to avoid conflicts)

### Docker Services

- **postgres**: PostgreSQL 16 Alpine (port 5434:5432)
  - Database: `boring_db`
  - User: `boring_user`
  - Persistent data volume
  - Health checks

- **payload**: Payload CMS backend (port 3010:3000)
  - Hot-reload enabled
  - Auto-accepts database migrations in dev
  - Bunny CDN integration

- **nuxt**: Nuxt frontend (port 3009:3001)
  - Hot-reload enabled
  - Proxies Payload admin and API

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database!)
docker-compose down -v

# Rebuild services after code changes
docker-compose up --build

# Run a single service
docker-compose up postgres
```

## Local Development (Without Docker)

### Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Renovate integration

Install [Renovate GitHub app](https://github.com/apps/renovate/installations/select_target) on your repository and you are good to go.
