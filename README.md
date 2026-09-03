# Fuel Check

Fuel Check is an installable web app for timing an aircraft fuel-consumption check. Enter an initial fuel reading, let the timer run, and enter a final reading to estimate fuel burn, remaining endurance, and projected burn-out times.

> [!CAUTION]
> Fuel Check is an informational aid, not an approved flight-planning or fuel-management instrument. Verify every result using approved aircraft documentation, procedures, and instrumentation before making operational decisions.

## Features

- Live elapsed-time display during a fuel check
- Fuel burn rate calculated in pounds per hour
- Remaining endurance displayed in hours and minutes
- Projected fuel burn-out time
- VFR and IFR reserve time estimates
- Persistent results across page refreshes using local storage
- Start, restart, calculate, and reset workflows with input validation
- Online/offline status indicator
- Installable Progressive Web App with offline support
- Service-worker update notification
- Responsive interface for desktop and mobile devices

## How it works

1. Select **Start** and enter the initial fuel quantity in pounds.
2. Allow the check to run for a representative period.
3. Select **Calculate** and enter the final fuel quantity.
4. Review the calculated burn rate, endurance, burn-out time, and reserve times.
5. Use **Restart** for a new check or **Reset** to clear the current data.

The app calculates the results with these relationships:

```text
fuel used = initial fuel - final fuel
burn rate = fuel used × (60 / elapsed minutes)
endurance = final fuel / burn rate
```

The projected VFR and IFR times are currently calculated by subtracting 20 and 30 minutes, respectively, from the estimated burn-out time.

## Data persistence

The current calculation is stored in the browser's local storage and restored when the page is refreshed. Data stays on the device and is not sent to a server. Resetting the calculator replaces the saved calculation with its default values.

Browser storage is specific to an origin, so data saved on one domain or development port will not appear on another.

## Local development

### Requirements

- Node.js
- npm

### Setup

```bash
git clone <repository-url>
cd fuel-check
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

### Available commands

```bash
npm run dev      # Start the development server
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build locally
npm run lint     # Run Oxlint
```

## PWA testing

Create and serve a production build to test installation, caching, and service-worker updates under production-like conditions:

```bash
npm run build
npm run preview
```

Service workers require a secure context in production. Deploy over HTTPS; browsers also treat `localhost` as a secure context for local development.

## Built with

- React 19 and TypeScript
- Vite
- Tailwind CSS
- Base UI and shadcn/ui components
- Lucide icons
- Vite PWA and Workbox
- Oxlint and Prettier

## Project structure

```text
src/
├── components/       UI, dialogs, stopwatch, and result presentation
├── hooks/            Online-status and service-worker hooks
├── types/            Calculator state types
├── App.tsx           State, persistence, and calculation logic
└── main.tsx          Application entry point and providers
```
