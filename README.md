# auth-ui

Authentication UI for Barricade - Dark mode SPA with login, registration, and dashboard.

## Features

- **Login** (`/login`) - Authenticate with existing credentials
- **Register** (`/register`) - Create new account
- **Dashboard** (`/dashboard`) - Base page showing username and logout button

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- React Router v6
- Tailwind CSS (dark mode by default)
- shadcn/ui components
- sonner (toast notifications)
- Nginx (static file server)

## API Integration

The frontend expects the Barricade Go backend to be available at `/api`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/login` | POST | Authenticate user |
| `/api/v1/register` | POST | Create new user |
| `/api/v1/logout` | POST | Clear session |
| `/api/v1/whoami` | GET | Get current user info |

In production, the Gateway API routes `/api/*` to the backend and all other routes to this frontend.

## Development

```bash
# Install dependencies
npm install

# Run dev server (proxies /api to localhost:8080)
npm run dev

# Build for production
npm run build
```

## Deployment

### Docker

```bash
# Build image
docker build -t auth-ui:latest .

# Run locally
docker run -p 80:80 auth-ui:latest
```

## Project Structure

```
src/
├── components/ui/      # shadcn/ui components (Button, Card, Input, Label)
├── features/
│   ├── auth/
│   │   └── pages/      # Login, Register
│   └── admin/
│       └── pages/      # Dashboard
├── lib/
│   ├── api.ts          # API client
│   ├── auth.ts         # Auth loader/checks
│   └── utils.ts        # Tailwind utilities
├── styles/
│   └── globals.css     # Tailwind + dark theme
├── main.tsx            # React entry point
├── routes.tsx          # Route definitions
└── App.tsx
```
