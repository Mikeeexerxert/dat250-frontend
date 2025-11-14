# FeedAPP Starter

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

Copy the environment file:

```bash
# command-line
cp .env.example .env
```

## Development Server

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Docker

Build Docker image

```bash
docker build -t feed-app .
```

Run Docker container with environment variables

```bash
docker run -p 3000:3000 --env-file .env feed-app
```