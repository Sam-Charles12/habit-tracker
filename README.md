# Habit Tracker PWA

## Project Overview

Habit Tracker is a mobile-first Progressive Web App built with Next.js (App Router), React, TypeScript, and Tailwind CSS. It allows users to sign up, log in, create and manage daily habits, track streaks, and use the app offline after the first load. All data is stored locally in the browser using `localStorage` — no backend, no external database, no authentication service.

This project was built to Stage 3 specification, prioritizing technical discipline, deterministic behavior, and full testability.

---

## Setup Instructions

**Prerequisites:**
- Node.js v18 or later
- npm v9 or later

**Install dependencies:**

```bash
npm install
```

**Install Playwright browsers** (required for end-to-end tests):

```bash
npx playwright install
```

---

## Run Instructions

**Start the development server:**

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

**Build for production:**

```bash
npm run build
npm start
```

---

## Test Instructions

Run all tests (unit, integration, and end-to-end):

```bash
npm test
```

Run individual test suites:

```bash
# Unit tests with coverage report
npm run test:unit

# Integration and component tests
npm run test:integration

# End-to-end tests (requires the dev or production server to be running)
npm run test:e2e
```

**Coverage requirement:** The unit test suite generates a coverage report. All files inside `src/lib` must meet a minimum of 80% line coverage.

---

## Local Persistence Structure

All data is stored in the browser's `localStorage` under three keys:

### `habit-tracker-users`

A JSON array of registered user objects:

```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "password": "plaintext",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### `habit-tracker-session`

Either `null` (no active session) or a session object:

```json
{
  "userId": "uuid",
  "email": "user@example.com"
}
```

### `habit-tracker-habits`

A JSON array of habit objects belonging to all users. Each component filters by `userId` at runtime:

```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "Drink Water",
    "description": "8 glasses a day",
    "frequency": "daily",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "completions": ["2025-01-01", "2025-01-02"]
  }
]
```

Completion dates are stored as unique ISO calendar date strings (`YYYY-MM-DD`). Duplicate dates are not permitted. Streaks are computed at runtime from this array — no streak value is stored directly.

---

## PWA Support

The app meets the basic installable PWA requirements through the following:

**`public/manifest.json`**
Defines the app's name, short name, start URL, display mode, theme color, background color, and icon references for 192×192 and 512×512 sizes.

**`public/sw.js`**
A service worker that caches the app shell on first load. On subsequent visits — including offline visits — the cached shell is served, preventing a hard crash. The service worker is registered on the client side inside the root layout using a `useEffect` call that checks for `serviceWorker` support before registering.

**Icons**
Two PNG icons are included at `public/icons/icon-192.png` and `public/icons/icon-512.png`, referenced in the manifest.

**Offline behavior**
Once the app has been loaded at least once, the cached shell will render without a network connection. Dynamic data (habits, session) still comes from `localStorage`, which is available offline, so the full app experience is preserved without any network dependency.

---

## Trade-offs and Limitations

- **No password hashing** — Passwords are stored in plain text in `localStorage`. This is intentional for this stage. In a production app, passwords would be hashed (e.g. with bcrypt) and stored server-side.
- **Client-side route protection only** — Because auth state lives in `localStorage`, route protection is handled client-side. There is a brief render window before the redirect fires on protected routes. A real app would use server-side session validation via cookies and middleware.
- **Single frequency type** — Only `daily` frequency is implemented, as required by the spec. The frequency selector is present in the UI but locked to `daily`.
- **Shared localStorage across tabs** — All browser tabs share the same `localStorage`. Opening the app in two tabs as different users is not a supported use case and may produce inconsistent state.
- **No data migration** — There is no versioning or migration strategy for the localStorage schema. If the shape of stored data changes between versions, existing data in the browser may break the app until `localStorage` is manually cleared.
- **Offline cache is app shell only** — The service worker caches the app shell (HTML, JS, CSS). It does not implement background sync or IndexedDB-backed offline writes. All persistence is `localStorage`-based, which is already available offline by default.

---

## Test File to Behavior Map

### Unit Tests

| Test File | Behavior Verified |
|---|---|
| `tests/unit/slug.test.ts` | Verifies `getHabitSlug` correctly lowercases, trims, collapses spaces, replaces spaces with hyphens, and strips non-alphanumeric characters from habit names |
| `tests/unit/validators.test.ts` | Verifies `validateHabitName` rejects empty input, rejects names over 60 characters, and returns a trimmed value for valid input |
| `tests/unit/streaks.test.ts` | Verifies `calculateCurrentStreak` returns 0 for empty completions, returns 0 when today is not completed, counts consecutive days correctly, deduplicates dates, and breaks the streak when a day is missing |
| `tests/unit/habits.test.ts` | Verifies `toggleHabitCompletion` adds a missing date, removes an existing date, does not mutate the original habit, and never produces duplicate completion dates |

### Integration / Component Tests

| Test File | Behavior Verified |
|---|---|
| `tests/integration/auth-flow.test.tsx` | Verifies signup form creates a session and redirects; duplicate email signup shows an error; login form stores a session; invalid login credentials show an error |
| `tests/integration/habit-form.test.tsx` | Verifies habit name validation on empty input; habit creation renders the card in the list; editing preserves immutable fields (`id`, `userId`, `createdAt`, `completions`); deletion requires explicit confirmation; toggling completion updates the streak display immediately |

### End-to-End Tests

| Test File | Behavior Verified |
|---|---|
| `tests/e2e/app.spec.ts` | Full user flows across the app: splash screen redirect behavior for authenticated and unauthenticated users; dashboard route protection; signup and login flows; habit creation, completion, and streak updates; session and habit persistence across page reloads; logout and redirect; offline app shell load after first visit |

```
