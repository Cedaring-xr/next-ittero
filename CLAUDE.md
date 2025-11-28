# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next-Ittero is a Next.js 14 application with AWS Amplify Cognito authentication, built with TypeScript, React, and Tailwind CSS. The app provides user management with journal and list features, following a dashboard-based architecture with role-based access control.

## Development Commands

**Start development server:**
```bash
npm run dev
```
Server runs on http://localhost:3000

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm run start
```

**Lint code:**
```bash
npm run lint
```

**Run Playwright tests:**
```bash
npx playwright test
```

**Run specific test file:**
```bash
npx playwright test tests/example.spec.ts
```

**Run tests in UI mode:**
```bash
npx playwright test --ui
```

## Environment Setup

Required environment variables (see `.env.example`):
- `NEXT_PUBLIC_USER_POOL_ID` - AWS Cognito User Pool ID
- `NEXT_PUBLIC_USER_POOL_CLIENT_ID` - AWS Cognito User Pool Client ID

## Architecture

### Authentication Flow

The app uses AWS Amplify with Cognito for authentication with both client-side and server-side configurations:

**Client-side config:** `src/app/amplify-cognito-config.ts` configures Amplify for SSR-enabled client operations

**Server-side utilities:** `src/utils/amplify-server-utils.ts` provides `runWithAmplifyServerContext` and `authenticatedUser` for server-side auth operations

**Middleware:** `src/middleware.ts` protects dashboard routes and implements role-based access:
- Redirects unauthenticated users from `/dashboard/*` to `/auth/login`
- Restricts `/dashboard/admins` to users in the 'Admins' Cognito group
- Redirects authenticated users from public pages to `/dashboard`

**Auth actions:** `src/lib/cognitoActions.ts` contains all authentication server actions:
- Sign up, confirm signup, sign in, sign out
- Password reset and confirmation
- User attribute updates (email, name, password)

**Client hook:** `src/app/hooks/user-auth-user.tsx` provides `useAuthUser()` hook for client components to access current user data including admin status

### User Roles

Users have an `isAdmin` property determined by membership in the 'Admins' Cognito group. This is checked both server-side (middleware, server utils) and client-side (auth hook).

### Route Structure

The app follows Next.js App Router conventions with the following structure:

**Public routes:**
- `/` - Landing page
- `/faq` - FAQ page
- `/auth/*` - Authentication pages (login, signup, confirm-signup, reset-password)

**Protected routes (require authentication):**
- `/dashboard` - Main dashboard
- `/dashboard/profile` - User profile settings
- `/dashboard/lists` - List management
- `/dashboard/lists/newList` - Create new list
- `/dashboard/journal` - Journal entries
- `/dashboard/journal/newJournal` - Create new journal entry
- `/dashboard/admins` - Admin-only section (requires 'Admins' group membership)

### UI Component Organization

**Component structure:**
- `src/ui/` - All reusable UI components
- `src/ui/auth/` - Authentication forms (login, signup, password reset, etc.)
- `src/ui/dashboard/` - Dashboard-specific components (sidenav, nav-links, logout-form)
- `src/ui/profile-settings/` - Profile update forms
- `src/ui/info/` - Informational components (banner, footer, landing-info)

**Form pattern:** Forms use React Hook Form and Next.js server actions. Auth forms call handlers from `cognitoActions.ts` and use `useFormState` for error handling.

**Layout pattern:** Dashboard uses a sidebar layout with `src/app/dashboard/layout.tsx` wrapping all dashboard pages. Individual feature sections (journal, lists) have their own nested layouts.

### Styling

- Uses Tailwind CSS with custom configuration in `tailwind.config.ts`
- Uses `@tailwindcss/forms` plugin for form styling
- Custom fonts defined in `src/ui/fonts.ts`
- Uses `clsx` for conditional className construction
- Color scheme: Slate/stone backgrounds with indigo accents

### Path Aliases

TypeScript is configured with `@/*` aliasing to `./src/*` for cleaner imports.

## API Routes

API route handlers are organized in:
- `src/api/journal/routes.ts` - Journal-related API endpoints
- `src/api/list/routes.ts` - List-related API endpoints

Note: These files are currently minimal placeholders.

## Testing

Tests use Playwright and are located in the `tests/` directory:
- `tests/example.spec.ts` - Example test file
- `tests/helpers/` - Test helper utilities
- `tests/profile/` - Profile-related tests
- `tests/sign-in/` - Sign-in flow tests

Test configuration in `playwright.config.ts` includes:
- Runs tests across Chromium, Firefox, and WebKit
- Loads environment variables from `.env`
- Test directory: `./tests`
- HTML reporter enabled

## Key Patterns to Follow

**Authentication in server components:**
```typescript
import { authenticatedUser } from '@/utils/amplify-server-utils'

export async function SomeServerComponent() {
  const user = await authenticatedUser({ request, response })
  // user contains userId, username, isAdmin
}
```

**Authentication in client components:**
```typescript
import useAuthUser from '@/app/hooks/user-auth-user'

export function SomeClientComponent() {
  const user = useAuthUser()
  // user contains userId, username, email, name, isAdmin
}
```

**Server actions for forms:**
```typescript
import { useFormState } from 'react-dom'

const [errorMessage, dispatch] = useFormState(handleServerAction, undefined)

<form action={dispatch}>
  {/* form fields */}
</form>
```
