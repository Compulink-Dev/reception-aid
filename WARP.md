# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Reception Aid is a comprehensive reception management system built with Next.js 15, Payload CMS 3.68, and MongoDB. The application handles visitor management, security gate operations, vehicle tracking, parcel logging, travel logs, and phone call records. It features role-based access control (admin, reception, security, employee) with separate authentication systems for the Payload CMS admin panel and the custom dashboard application.

## Development Commands

### Starting the Application
```bash
pnpm dev              # Start development server on http://localhost:3000
pnpm devsafe          # Clean build and start dev (removes .next folder first)
pnpm build            # Build for production
pnpm start            # Start production server
```

### Testing
```bash
pnpm test             # Run all tests (integration + e2e)
pnpm test:int         # Run integration tests with Vitest
pnpm test:e2e         # Run end-to-end tests with Playwright
```

Integration tests are located in `tests/int/**/*.int.spec.ts` and run in jsdom environment.
E2E tests are located in `tests/e2e/` and use Playwright with Chromium.

### Code Quality
```bash
pnpm lint             # Run ESLint for code quality checks
```

### Payload CMS Commands
```bash
pnpm payload                 # Access Payload CLI
pnpm generate:types          # Generate TypeScript types from Payload collections
pnpm generate:importmap      # Generate import map for Payload
```

### Docker Setup (Optional)
```bash
docker-compose up            # Start MongoDB and the app
docker-compose up -d         # Start in detached mode
```

When using Docker, set `DATABASE_URI=mongodb://mongo/reception-aid` in `.env`.

## Architecture

### Dual-App Structure
The project has two distinct applications running on the same Next.js server:

1. **Payload CMS Admin Panel** (`/admin`)
   - Accessible at `/admin` routes
   - Uses Payload's built-in authentication system
   - Manages all collections through the Payload UI
   - Authenticated with `payload-token` cookie

2. **Custom Dashboard Application** (`/dashboard`)
   - Routes under `/dashboard` (visitors, security, parcels, etc.)
   - Custom authentication via `/api/auth/login`
   - Role-based access control enforced in `middleware.ts`
   - Authenticated with `payload-token` and `user` cookies

### Authentication Flow
- **Payload Admin**: Uses Payload's built-in auth (collection: `users`)
- **Custom App**: Custom login at `/api/auth/login` using Payload's `payload.login()` API
- Middleware (`middleware.ts`) handles route protection and role-based access:
  - `/admin/*` - Bypassed, Payload handles its own auth
  - `/dashboard/security/*` - Security role only
  - `/dashboard/reception/*` - Reception and admin roles only
  - `/dashboard/admin/*` - Admin role only

### Collections (Payload CMS)
Located in `src/collections/`:
- **Users** - Auth-enabled with roles (admin, reception, security, employee)
- **Visitors** - Guest check-in/check-out records
- **Vehicles** - Vehicle tracking and parking management
- **TravelLogs** - Employee travel records
- **ParcelLogs** - Package tracking and delivery
- **PhoneCalls** - Phone call logs
- **Employees** - Employee directory
- **Clients** - Client information
- **Media** - File uploads with size variants

After modifying collections, always run `pnpm generate:types` to update `src/payload-types.ts`.

### API Routes
Custom API routes in `src/app/api/`:
- `auth/login` - Custom authentication endpoint
- `auth/register` - User registration
- `users/login`, `users/me` - User management
- `visitors/[id]` - Visitor operations
- `vehicles/[id]` - Vehicle operations
- `parcels` - Parcel operations
- `collective` - Collective data endpoints
- `debug/*` - Debug utilities

Payload's auto-generated API routes are at `/api/{collection-slug}`.

### State Management
Global state managed with Zustand in `src/store/appStore.ts`:
- User session state
- UI state (sidebar visibility)
- Quick actions state
- Notification system

Uses `zustand/middleware/persist` for localStorage persistence.

### Validation
Zod schemas for form validation in `src/lib/validations.ts`:
- `visitorSchema`, `travelLogSchema`, `parcelSchema`, `phoneCallSchema`, `vehicleSchema`

Use these schemas with `react-hook-form` via `@hookform/resolvers`.

### UI Components
- **Radix UI** primitives for accessible components
- **shadcn/ui** style component library in `src/components/ui/`
- **Tailwind CSS 4** with PostCSS for styling
- Path alias: `@/*` maps to `src/*`

Component configuration in `components.json` (shadcn CLI).

### Key Pages Structure
- `src/app/(payload)/admin/` - Payload CMS admin UI
- `src/app/(app)/(auth)/signin/` - Custom login page
- `src/app/(app)/(dashboard)/dashboard/` - Main dashboard and feature pages:
  - `visitors/` - Visitor management
  - `security/` - Security gate, vehicle logs, mileage tracking
  - `parcels/` - Parcel tracking, deliveries, history
  - `travel/` - Travel logs, history, reports
  - `calls/` - Phone call logs and reports
  - `vehicles/` - Company and visitor vehicles
  - `employees/` - Employee directory
  - `clients/` - Client management
  - `settings/` - Application settings
  - `reports/` - Various report views

## Environment Variables
Required variables in `.env`:
```bash
DATABASE_URI=mongodb://127.0.0.1/reception-aid  # MongoDB connection string
PAYLOAD_SECRET=your-secret-here                  # Payload JWT secret
```

Use `.env.example` as template. Never commit `.env` file.

## Important Patterns

### Adding New Collections
1. Create collection config in `src/collections/NewCollection.ts`
2. Import and add to `collections` array in `src/payload.config.ts`
3. Run `pnpm generate:types` to update TypeScript types
4. Restart dev server to apply changes

### Middleware Route Protection
When adding new protected routes, update `middleware.ts`:
- Add to `publicPaths` array if route should be public
- Add role-based checks for role-specific routes
- Payload routes (`/admin`, `/api/payload`) are always allowed through

### Working with Forms
1. Define validation schema in `src/lib/validations.ts`
2. Use `react-hook-form` with `@hookform/resolvers/zod`
3. Submit to appropriate API route
4. Use Zustand store for notifications/feedback

### Styling
- Use Tailwind utility classes
- Follow existing color scheme (blue, green, purple, orange for different modules)
- Responsive design: mobile-first with `md:`, `lg:` breakpoints
- Dark mode support via `next-themes` (if implementing new features)

## Code Style
- **Prettier** config: single quotes, no semicolons, 100 char line width
- **ESLint**: Next.js rules with TypeScript, warnings for `any`, unused vars
- Use `@typescript-eslint` ignore patterns: `^_` for unused variables
- Prefer `const` over `let`, arrow functions for callbacks
- Use TypeScript strict mode

## Testing Notes
- Integration tests use Vitest with jsdom and React Testing Library
- E2E tests use Playwright, configured to start dev server automatically
- Test environment file: `test.env`
- CI retries: 2, no parallel execution on CI

## Node Version
- Required: Node.js ^18.20.2 or >=20.9.0
- Package manager: pnpm ^9 or ^10 (required, not npm/yarn)

## Common Workflows

### Debugging Authentication Issues
1. Check `middleware.ts` logs for route matching
2. Verify cookies exist: `payload-token` and `user`
3. Use `/api/debug/cookies` endpoint to inspect cookies
4. Check user role matches route requirements

### Adding New Dashboard Feature
1. Create page in `src/app/(app)/(dashboard)/dashboard/[feature]/`
2. Add API route if needed in `src/app/api/[feature]/`
3. Update navigation in dashboard layout
4. Add role checks in `middleware.ts` if role-specific
5. Create necessary UI components in `src/components/`

### Database Schema Changes
1. Modify collection in `src/collections/`
2. Run `pnpm generate:types`
3. Update any affected API routes
4. Test with both Payload admin and custom app
5. MongoDB schema is handled automatically by Mongoose adapter
