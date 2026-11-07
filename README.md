# JT & Partners — Global Surf frontend assessment

React + TypeScript + Vite, with GSAP ScrollTrigger. Assets are downloaded from the supplied Figma file and served locally from `public/assets`.

## Run

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. On Windows PowerShell with restricted scripts, use `npm.cmd` instead of `npm`.

```sh
npm run build
npm run preview
```

Deploy the `dist` directory to any static host. No runtime secrets or backend are required.

## Behavior

- One project with the two supplied Figma states: initial title and expanded details. The title disappears fully before the details reveal, and the hero stays pinned through a long reading hold before releasing.
- Scroll to pin the hero, transition from the project title to its details, then release into the rest of the page. Keyboard users can focus the banner and press Enter or Space to seek through the same sequence. Reduced-motion mode keeps the same reading interval without animated transitions.
- GSAP animates the initial title, pills and menu bar, scroll-driven overlay/image/details, individual heading reveals, image reveals and a footer wordmark that starts a GSAP marquee on hover. Intro and scroll animations use different elements to avoid conflicting transforms.
- GSAP matchMedia reverts animations and pinning on unmount. Reduced motion preserves the initial screen and scrolls through the pinned reading interval without animated transitions.
- Responsive layouts, accessible menu controls, static Engineering row and expandable award content, office selector, phone and email actions.
- Source content is isolated in `src/projects.ts`; the hero is in `src/Hero.tsx`, section animation in `src/usePageMotion.ts`, and other components in `src/main.tsx`. Styles are in `src/styles.css` and `src/refinements.css`.

## Content still required

1. Font resolved: the supplied HongKong Light, Regular and Medium WOFF2 files in `public/fonts` are self-hosted through `src/refinements.css`. Their internal PostScript names were verified as `HongKong-Light`, `HongKong-Regular` and `HongKong-Medium`. The page uses upright Light (300), matching the Figma family and style.
2. No additional project records are needed for the revised scope. Placeholder projects have been removed.
3. The remaining two award records and full award article/link. Only one award was present; the three progress marks are visual indicators, not fabricated records.
4. Abu Dhabi and Lebanon office addresses, and official social profile URLs. Social links currently open the platform home pages and are labelled accordingly for assistive technology.

## Verification

`npm run build` runs TypeScript checking and builds the production bundle. With the dev server running, `node verify-motion.mjs` checks 1920 px, 1366 px and 390 px layouts, initial visibility, scroll-driven title/details transitions, decorative blocks, native plus-icon sizes, four-line award heading, office alignment, footer marquee, overflow and reduced motion. Set `CHROME_PATH` to an installed Chromium executable on another machine. Captures are saved in ignored `verification/`.

Figma source: https://www.figma.com/proto/hFlxU9uVBySYuJY2gIgG4d/JTP-Dev---test?node-id=5-2&p=f&t=hmEpLaYaaVeQT21J-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1
