This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

#**Live Link** -- https://connected-living-swart.vercel.app

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm, pnpm, yarn, or bun

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Environment Variables

The app currently uses one optional environment variable:

- `NEXT_PUBLIC_API_URL` - overrides the API base URL used by `src/lib/api-client.ts`

If it is not set, the frontend falls back to `http://localhost:3000/api/v1`.

## Demo Login Accounts

Authentication is mocked in `src/lib/auth-mock.ts`. Use one of the built-in accounts below to enter the matching role-specific area:

| Role               | Username   | Password       | Redirect       |
| ------------------ | ---------- | -------------- | -------------- |
| Resident           | `user`     | `User@123`     | `/dashboard`   |
| Security           | `security` | `Security@123` | `/gate`        |
| Facility Manager   | `facility` | `Facility@123` | `/work-orders` |
| Service Technician | `service`  | `Service@123`  | `/jobs`        |
| Admin              | `admin`    | `Admin@123`    | `/admin`       |

## Architecture Notes

- `src/app/(resident)` and `src/app/(security)` each provide their own layout shell with desktop sidebars and mobile bottom navigation.
- The resident layout wraps content with swipe navigation support on mobile.
- `src/components/providers/theme-provider.tsx` enables system-aware theme switching.
- `src/components/providers/ui-provider.tsx` manages global UI state such as temporary interaction blocking.
- `src/lib/api.ts` contains the mock data store and client-side data access helpers used by the dashboards.
- `src/lib/api-types.ts` mirrors the backend contract for the planned NestJS integration.

## Backend Status

This repository is frontend-first and currently relies on mock auth and mock data for many screens. The integration guide in `documents/Resident_App_Backend_Integration_Guide.md` describes the API contract expected by the frontend when the real backend is connected.

## Key Behaviors

- Login uses a simulated authentication flow, not a live identity provider.
- Several dashboard widgets poll mock data to simulate live updates.
- The UI is responsive and optimized for both mobile and desktop use.
- Shared components live under `src/components/ui` and are built on top of Radix UI and Tailwind CSS.

## Useful Files

- [src/lib/auth-mock.ts](src/lib/auth-mock.ts)
- [src/lib/api.ts](src/lib/api.ts)
- [src/lib/api-client.ts](src/lib/api-client.ts)
- [src/lib/api-types.ts](src/lib/api-types.ts)
- [documents/Resident_App_Overview.md](documents/Resident_App_Overview.md)
- [documents/Resident_App_Backend_Integration_Guide.md](documents/Resident_App_Backend_Integration_Guide.md)

## Notes

- This project does not currently include a test suite.
- The README intentionally reflects the current codebase, including mocked flows and placeholder screens.
