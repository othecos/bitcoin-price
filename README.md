# Bitcoin Price Tracker

A full-stack application for tracking Bitcoin prices in real-time.

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- React Query
- Socket.IO Client
- Jest & React Testing Library

### Backend
- Node.js
- Express
- TypeScript
- TypeORM
- SQLite
- Socket.IO

### DevOps
- Turborepo
- pnpm
- Docker
- ESLint
- Prettier

## Project Structure

```
bitcoin-price/
├── apps/
│   ├── frontend/         # Next.js frontend application
│   └── backend/          # Express backend application
├── packages/
│   ├── ui/               # Shared UI components
│   ├── eslint-config/    # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
├── docker-compose.yml    # Docker Compose configuration
└── package.json          # Root package.json for the monorepo
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm
- Docker and Docker Compose (for containerized development)

### Development

#### Using Docker (recommended)

1. Clone the repository
2. Start the development environment:

```bash
pnpm docker:up
```

This will start both the frontend and backend services in development mode with hot reloading.

3. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

4. To stop the services:

```bash
pnpm docker:down
```

#### Local Development

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Start the development servers:

```bash
pnpm dev
```

This will start both the frontend and backend in development mode.

### Building for Production

To build all applications:

```bash
pnpm build
```

### Testing

To run tests for all applications:

```bash
pnpm test
```

## License

MIT 