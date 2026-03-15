# Adrien Portfolio

A Windows 95-inspired portfolio built with React, TypeScript, and Vite. The project turns a standard personal site into an interactive desktop experience, using draggable windows, retro UI patterns, built-in mini apps, and media-rich content to present creative work in a way that is memorable and technically deliberate.

## Overview

This portfolio is designed as a functioning retro desktop rather than a traditional scroll-based landing page. Visitors interact with the site the way they would use an old operating system: opening folders, switching between windows, minimizing apps to the taskbar, exploring projects, launching mini experiences, and browsing content through themed interfaces.

The goal of the build is twofold:
- present personal work, interests, and credentials in a format that feels distinctive
- demonstrate front-end engineering through interaction design, state management, and custom UI behavior instead of relying on a template portfolio layout

## Experience Highlights

- Windows 95 desktop shell with a persistent taskbar and Start menu
- Draggable, resizable, minimizable, and maximizable application windows
- Z-index window management so the active app correctly comes to the front
- Desktop shortcuts for key portfolio sections and built-in apps
- "About Me" notepad-style intro window
- Folder-style Projects and Certificates views
- Contact window styled like a classic mail client
- Internet Explorer-inspired search experience powered by DuckDuckGo results
- Embedded Winamp player with a local playlist and custom skin
- Playable Paint canvas, Solitaire screen, and a custom Minesweeper implementation
- Recycle Bin state persisted with `localStorage`
- CRT/flicker visual treatment and classic bevel styling applied globally

## Tech Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS via CDN utilities in `index.html`
- `@react95/icons` for era-accurate iconography
- `webamp` for the media player experience

## Architecture

The app is intentionally lightweight and mostly self-contained.

- `App.tsx` acts as the desktop orchestrator. It owns the window registry, open/minimized/maximized state, z-index ordering, positioning, sizing, and the content mounted inside each app window.
- `components/Window.tsx` provides the reusable desktop window chrome, drag behavior, resize handling, maximize logic, and generic frame layout.
- `components/Taskbar.tsx` renders the Start button, open-program tabs, and live clock.
- `components/StartMenu.tsx` supplies the retro start menu presentation.
- `components/WebampPlayer.tsx` handles runtime loading of Webamp, playlist hydration, event wiring, and synchronization with the desktop window state.
- `components/MinesweeperContent.tsx` contains the custom game logic, board generation, reveal flood-fill behavior, flagging, and win/loss states.
- `public/` stores images, certificates, audio assets, and the Winamp skin used by the experience.

## Implementation Details

### Desktop State Model

Each desktop app is represented through a shared `WindowData` shape defined in `types.ts`. That model includes:
- identity and title
- open/minimized/maximized state
- z-index
- position and size
- minimum sizing constraints
- icon and rendered content
- optional chrome/menu visibility overrides

This makes the desktop extensible: new windows can be added by registering another object in the `windows` state map and supplying the content component.

### Window Management

The desktop behavior is driven by a small set of focused actions inside `App.tsx`:
- opening windows
- closing windows
- minimizing and restoring
- toggling maximize state
- bringing the active window to the front
- updating position and size after drag/resize interactions

That creates a single source of truth for desktop interactions and avoids scattered UI state across multiple components.

### Themed Content Surfaces

The portfolio content is presented through interface metaphors that match the overall system:
- notepad-style text for the introduction
- classic folder views for projects and certificates
- inbox-style contact layout
- browser-like search interface for Internet Explorer

This keeps the content aligned with the concept instead of placing standard cards inside a retro shell.

### Mini Applications

The project goes beyond static content by including interactive apps:
- Paint uses an HTML canvas with multiple tools, color selection, and shape support
- Minesweeper is implemented in React with generated boards, flood reveal logic, right-click flagging, and retro pixel glyph rendering
- Webamp is mounted separately from the standard window chrome because it manages its own panes and layout

These features make the portfolio feel like a usable system rather than a single-page mockup.

## Project Structure

```text
.
|-- App.tsx
|-- index.tsx
|-- index.html
|-- types.ts
|-- vite.config.ts
|-- components/
|   |-- DesktopIcon.tsx
|   |-- MinesweeperContent.tsx
|   |-- StartMenu.tsx
|   |-- Taskbar.tsx
|   |-- WebampPlayer.tsx
|   `-- Window.tsx
`-- public/
    |-- certificates/
    |-- music/
    `-- *.png / *.jpg / *.wsz assets
```

## Running Locally

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The app is configured to run on port `3000` in development.

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## External Runtime Dependencies

A few parts of the experience rely on external network access at runtime:
- Webamp is loaded from `https://unpkg.com/webamp/built/webamp.bundle.min.js`
- the Internet Explorer window fetches search results from the DuckDuckGo instant answer API
- Google Fonts and the Tailwind CDN are referenced from `index.html`

If you want the project to be fully self-contained for deployment, those assets and integrations should be bundled or replaced with local equivalents.

## Why This Portfolio Stands Out

Most portfolio sites explain creativity. This one demonstrates it through the interface itself. The build uses nostalgia as a product decision, but the implementation is grounded in practical front-end engineering: reusable window primitives, controlled state transitions, custom interaction handling, and a cohesive visual system carried across every section.

## Future Improvements

- replace placeholder project file entries with direct project detail pages or downloadable case studies
- connect the contact form to a real email or form backend
- improve mobile behavior for smaller screens
- add automated tests around the window manager and game logic
- self-host third-party assets for more reliable offline-friendly deployment

## License

This project is intended as a personal portfolio build. Update licensing terms here if you plan to distribute or open-source it formally.
