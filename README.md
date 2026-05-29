# AstroDesk Frontend

React frontend for the AstroDesk helpdesk system.

**Stack:** React 19 · TypeScript · Vite · TanStack Router · TanStack Query · Tailwind CSS v4 · Shadcn UI

---

## Prerequisites

- Node.js 18+
- npm
- AstroDesk Backend running on `http://localhost:8080` (see [backend README](../AstroDesk-backend/README.md))

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Skopiuj plik środowiskowy:

```bash
cp .env.example .env
```

Domyślna wartość wskazuje na localhost — dla lokalnego devu nie trzeba nic zmieniać:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Start the dev server

```bash
npm run dev
```

App is available at **http://localhost:3000**

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build (`vite build && tsc`) |
| `npm run serve` | Preview production build locally |
| `npm run test` | Run tests with Vitest |
| `npm run deploy` | Build and deploy to GitHub Pages |

---

## Adding UI Components

New Shadcn UI components:

```bash
pnpx shadcn@latest add <component-name>
```

---

## Notes

- Backend must be running before logging in — auth uses Spring Security session cookies
- Login credentials match the LDAP users defined in the backend (see backend README)
