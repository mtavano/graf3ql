# graf3ql

GraphQL client with response comparision and visual diff support.

## Requirements

- Node.js 20+

## Setup

```bash
npm install
```

## Development

Run frontend and backend togheter:

```bash
npm run dev:full
```

Or separatly:

```bash
# Frontend (Vite)
npm run dev

# Backend (Express)
npm run dev:server
```

App runs on `http://localhost:5173`, proxy on `http://localhost:3005`.

## Build

```bash
npm run build
```

## Production

```bash
npm run start
```

Server serves the built frontend and GraphQL proxy on port `3005`.
