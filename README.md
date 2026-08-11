<div align="center">
  <img src="public/icon-192.png" width="96" alt="IRON PROTOCOL icon" />
  <h1>IRON PROTOCOL</h1>
  <p><strong>An eight-week workout plan that behaves like a focused training companion, not a spreadsheet.</strong></p>
  <p>
    <a href="https://iron-protocol-lilac.vercel.app"><strong>Open the app</strong></a>
    ·
    <a href="#features">Features</a>
    ·
    <a href="#run-locally">Run locally</a>
  </p>
  <p>
    <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" />
    <img alt="PWA" src="https://img.shields.io/badge/PWA-Offline--first-5A0FC8?logo=pwa&logoColor=white" />
    <img alt="Local first" src="https://img.shields.io/badge/Data-Local%20only-22C55E" />
  </p>
</div>

## The idea

Most workout trackers begin with configuration. IRON PROTOCOL begins with **today's workout**.

It packages a progressive eight-week home-training program into a mobile-first PWA: three sessions per week, round-by-round guidance, rest timing, exercise notes, and just enough progress data to keep the plan honest.

No account, backend, subscription, or feed. The app works offline and stores everything on the device.

## Features

- **Eight-week progressive program** — conditioning, strength, and calisthenics phases with three workouts per week.
- **Round-by-round workout mode** — exercise checklist, prescribed reps and weights, priority movements, and expandable notes.
- **Rest timers** — separate timing for exercises and rounds.
- **Program navigation** — inspect any week and intentionally move the active plan forward.
- **Calendar history** — see completed sessions without turning training into administrative work.
- **Weight and nutrition tracking** — lightweight daily entries with a 30-day trend graph.
- **Mood and energy check-in** — capture the immediate post-workout effect alongside completion data.
- **Strength progress** — summarize completed work around key movements.
- **Installable PWA** — offline cache, standalone display, portrait-first layout, and automatic updates.
- **Local-first storage** — training history never leaves the browser.

## Product principles

### The next action is always obvious

The default screen shows the next session, the current round, and the exact movement to perform. Secondary information lives in dedicated tabs.

### Completion should feel earned

A workout can only be completed after every exercise in every round is checked. The finish moment triggers a short wellbeing check-in and celebration before moving to history.

### Progress without account overhead

The app uses versionable browser storage for completed sessions, body weight, nutrition notes, and endorphin check-ins. It stays useful in a garage, park, or hotel gym with unreliable connectivity.

## Data flow

```text
8-week plan data
      │
      ▼
Today's session ──► round checklist ──► completion
                                           │
                         ┌─────────────────┴──────────────┐
                         ▼                                ▼
                  calendar history                mood / energy
                         │                                │
                         └──────────────┬─────────────────┘
                                        ▼
                                progress views

All state → localStorage → offline PWA
```

## Stack

| Area | Technology |
| --- | --- |
| UI | React 19, Tailwind CSS, Base UI / shadcn components |
| Motion | Framer Motion |
| Build | Vite 7 |
| Offline | vite-plugin-pwa + Workbox |
| Persistence | Browser localStorage |
| Deployment | Vercel |

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

No environment variables or backend services are required.

## Project structure

```text
src/
  data/          eight-week plan and exercise library
  tabs/          workout, program, calendar, and progress views
  components/    timers, check-ins, celebrations, navigation
  hooks/         persistent local state
  context/       visual theme
vite.config.js   app build and PWA manifest
```

## Current scope

IRON PROTOCOL is intentionally a single-program product. It does not yet include custom plan authoring, cloud sync, or multi-user coaching. The constraint keeps the experience direct: open the app and train.

---

<div align="center">
  Built to turn a real training plan into a calm, offline-first product with zero setup friction.
</div>
