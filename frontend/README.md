# SarkariFynx — Client (React + Vite)

The frontend for SarkariFynx: a government-jobs notification portal UI built with React 18,
Vite 5, Tailwind CSS 3.4, and React Router 6. It runs entirely on mock/seed data, so no
backend is required to develop or demo it.

## Quick start

> Requires Node.js 18+ and npm.

```bash
npm install
npm run dev        # start dev server (http://localhost:5173)
npm run build      # production build → dist/
npm run preview    # preview the production build
```

## Structure

```
src/
├── components/
│   ├── BrandIcon.jsx      # tinted department emblem (no external images)
│   ├── CategoryBox.jsx    # boxed link list with "New" badges
│   ├── Footer.jsx
│   ├── Header.jsx         # sticky top bar: nav, "Post Job Alert", theme, user menu
│   ├── HeroBanner.jsx     # "Trending" auto-advancing carousel with rotating emblem
│   ├── JobCard.jsx        # compact + row variants
│   ├── MusicPlayer.jsx    # "Now Playing" widget (from the mockup)
│   ├── PopularCard.jsx    # course card
│   ├── RightSidebar.jsx   # quick search + top categories + recruiters + player
│   ├── SectionHeader.jsx
│   ├── Sidebar.jsx        # left nav drawer (MENU / LIBRARY / ACCOUNT)
│   └── TableView.jsx      # key/value + matrix tables
├── context/ThemeContext.jsx   # light/dark, persisted to localStorage
├── data/seed.js               # jobs, categories, recruiters, courses, nowPlaying
├── layouts/MainLayout.jsx     # sidebar + header + content + footer shell
├── pages/
│   ├── Home.jsx
│   ├── JobDetails.jsx
│   ├── CategoryPage.jsx   # /category/:slug and /latest/:kind
│   ├── SearchPage.jsx
│   ├── ExamsPage.jsx
│   ├── AdminDashboard.jsx
│   └── Placeholder.jsx    # secondary routes + 404
├── services/api.js            # mock API (Promises w/ latency); swap for axios later
├── App.jsx                    # routes
├── main.jsx                   # entry (BrowserRouter + StrictMode)
└── index.css                  # Tailwind directives + CSS-variable theme tokens
```

## Theming

Colors are defined as CSS variables in `src/index.css` under `:root` (light) and `.dark`
(dark), then mapped to semantic Tailwind color names (`page`, `surface`, `elevated`,
`subtle`, `hairline`, `ink`/`ink-soft`/`ink-muted`/`ink-faint`) in `tailwind.config.js`.
Toggling the theme flips the `dark` class on `<html>`; the choice is saved to `localStorage`
under `sarkarifynx-theme`.

## Data / API

Components fetch through `src/services/api.js` rather than importing seed data directly for
network-style reads. Each function returns a Promise with a short delay to emulate a real
request. To connect a backend later, replace the function bodies with `axios`/`fetch` calls
(a commented example is included in the file) and set `VITE_API_URL`.

## Tooling notes

- Tailwind is pinned to v3.4 (the config/`@tailwind` directive syntax used here).
- Icons come from `lucide-react`.
- The Inter font is loaded via Google Fonts in `index.html`.
