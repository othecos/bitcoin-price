# Bitcoin Price Tracker

A real-time Bitcoin price tracking application built with Next.js and Express. The application displays current Bitcoin prices, historical data through interactive charts, and provides a Bitcoin/USD calculator.

## Features

- Real-time Bitcoin price updates using WebSocket
- Animation when the price changes
- Historical price data visualization with D3.js
  - Can be seen in a modal or as a flip card
- Bitcoin/USD calculator
- Fallback to local storage when offline
- Comprehensive test coverage

## Prerequisites

Before you begin, ensure you have installed:

- Node.js (v18 or higher)
- pnpm (v8 or higher)

## Installation

1. Clone the repository:

```bash
git clone git@github.com:othecos/bitcoin-price.git
cd bitcoin-price
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

For the backend (`apps/backend/.env`):

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
```

For the frontend (`apps/frontend/.env`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. To be able to have more data in the database, you can change the interval of the price updates in the backend.

```ts
// apps/backend/src/modules/bitcoin/bitcoin.constants.ts
// Bitcoin Price Update Interval
export const BITCOIN_PRICE_UPDATE_INTERVAL = 5 * 1000;
```

## Running the Applications

### Development Mode

To run both applications simultaneously:

```bash
pnpm dev
```

To run applications individually:

Backend:

```bash
pnpm --filter backend dev
```

Frontend:

```bash
pnpm --filter frontend dev
```

## Testing

The project includes several types of tests:

- Unit tests for components
- Integration tests for API endpoints
- Hook testing
- Service layer testing

Run the test suites:

```bash
# Run all tests with coverage
pnpm test

# Run tests in watch mode
pnpm test -- --watch
```

## API Endpoints

### Backend API

- `GET /api/bitcoin/price` - Get the latest Bitcoin price
- `GET /api/bitcoin/history` - Get historical Bitcoin prices
  - Query Parameters:
    - `limit` (optional): Number of historical entries to return (default: 10)

### WebSocket Events

- `bitcoin:price-update` - Real-time price updates

## Tech Stack

Frontend:

- Next.js
- React
- TypeScript
- TailwindCSS
- Socket.io-client
- D3.js
- React Query
- Jest & Testing Library

Backend:

- Express
- TypeScript
- SQLite
- TypeORM
- Socket.io
- Jest

## License

[MIT License](LICENSE)
