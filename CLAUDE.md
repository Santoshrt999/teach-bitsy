# CLAUDE.md — Teach Bitsy 🤖

Guidance for Claude Code (and humans) working in this repo.

## What this is

**Teach Bitsy** is a 100% client-side, kid-facing (ages 5–9) train-your-own-model web app.
A child collects webcam/drag-in photos into two buckets, trains an in-browser image
classifier (transfer learning on MobileNet), tests it, then deliberately "tricks" it to
learn about data quality. **No backend. No accounts. No uploads. No tracking.**

## ⚖️ Non-negotiable: privacy & safety (read before changing anything)

- **Everything runs on-device.** Webcam frames and images are processed in-memory and stored
  only in the browser (IndexedDB, added in Phase 5). The `getUserMedia` stream is never
  recorded or transmitted.
- **COPPA posture:** the app collects *no* personal information from children, so there's
  essentially nothing to comply with. This zero-backend design *is* the safety model — do not
  add analytics, telemetry, accounts, or any network upload. The only allowed network traffic
  is a one-time **download** of public model weights + (self-hosted) fonts.
- A restrictive **CSP `<meta>`** in `index.html` enforces this. If you add a network origin,
  justify it against the privacy posture and update the CSP deliberately.
- Always show the **kid-readable webcam explainer before** requesting camera permission.

## Tech stack

Vite 6 · React 19 · TypeScript (strict) · Tailwind v4 (CSS-first `@theme`) · `motion`
(framer-motion) · Zustand · TensorFlow.js 4.x (WebGPU→WebGL→WASM) · MobileNet v3-small
(hosted TFJS graph model) · `vite-plugin-pwa` · Vitest + RTL · **pnpm**.

## Commands

```bash
pnpm dev        # dev server
pnpm build      # tsc -b && vite build
pnpm typecheck  # tsc --noEmit
pnpm lint       # eslint
pnpm test       # vitest run
```

Always run **typecheck + lint + test** before committing.

## Architecture / layout

```
src/
  App.tsx            # accessible 4-tab stepper (Collect→Teach→Test→Trick)
  types.ts           # BitsyMood, Screen
  state/useStore.ts  # Zustand: screen, grownUpMode, buckets[], examples[], dataset actions
  lib/
    dataset.ts       # PURE nudge/canTeach helpers (unit-tested)
    image.ts         # center-crop → square JPEG data URL (canvas; webcam + upload)
    ml/ …            # (Phase 3) backend init, mobilenet loader, trainer
  components/
    Bitsy.tsx        # SVG mascot, `mood` prop drives the face; motion gated on reduced-motion
    ui/Button.tsx ui/Card.tsx   # chunky design-system primitives
    Webcam.tsx ImageDrop.tsx PolaroidCard.tsx BucketColumn.tsx
  screens/           # CollectScreen (built), Teach/Test/Trick (shells until their phase)
tests/               # vitest: dataset.test.ts, store.test.ts (+ more in later phases)
```

## Design system (approved — match exactly)

- Palette tokens in `src/index.css` `@theme`: paper `#FFF9EF`, ink `#2B2545`, yellow `#FFC94D`,
  blue `#5AB8F0`, coral `#FF7A6B`, mint `#5FD6A0`.
- Fonts: **Fredoka** (display/buttons), **Nunito** (body) — self-hosted via `@fontsource`.
- Style: 4px ink borders, hard offset shadows (`shadow-hard` = `0 6px 0 ink`), pill buttons,
  big rounded corners. Playful but disciplined.
- **Always respect `prefers-reduced-motion`** (gate every animation). Mobile-first (tablets).
- **Bitsy** appears on every screen; her `mood` (`curious`/`thinking`/`proud`/`confused`)
  reflects model/dataset state.

## Conventions

- TypeScript strict; no unused locals/params (enforced). Keep ML/DOM out of pure helpers so
  they stay unit-testable (see `lib/dataset.ts`).
- Dispose TF.js tensors (`tf.tidy`/`dispose()`); store embeddings as `Float32Array`, not live
  tensors — watch `tf.memory().numTensors` across retrains. **Gotcha:** `model.dispose()` does
  NOT free the Adam optimizer's slot vars — `disposeHead()` disposes `head.optimizer` too.
- **MobileNet is self-hosted** at `public/models/mobilenet-v3-small/` and loaded from the
  same-origin `${BASE_URL}models/...` (no third-party requests). TF.js is lazy-loaded via
  `import('../lib/ml/teach')` so it stays out of the main bundle. Hyperparameters live in the
  tf-free `lib/ml/config.ts` so UI can show them without importing TF.js.
- Accessibility is a hard requirement: keyboard nav, focus rings, ARIA labels, contrast.

## Tasks / build phases

Pace: **checkpoint after each phase** (build → show it runs → continue). Each phase's gate =
`typecheck` + `lint` + `test` + `build` all green.

- [x] **Phase 1 — Scaffold + design system + Bitsy.** Vite/React/TS strict, Tailwind v4 tokens,
  self-hosted fonts, `ui/Button`+`ui/Card`, Bitsy (4 moods + speech bubble), accessible stepper.
- [x] **Phase 2 — Collect screen + dataset store.** Editable buckets, webcam capture (privacy
  explainer), drag-drop/upload, polaroids, balance/<5 nudge. 12 unit tests.
- [x] **Phase 3 — Teach screen + TF.js pipeline.** Backend fallback, self-hosted MobileNet
  v3-small, lazy TF.js, transfer-learning head, Smartness + Oops/loss meters, confetti.
- [ ] **Phase 4 — Test + Trick screens.** Live predict + confidence bar + active-learning-lite;
  guided mislabel → confused → fix → recover → takeaway card.
- [ ] **Phase 5 — PWA + persistence + tests + README + deploy.** IndexedDB persistence + reset,
  installable/offline PWA, remaining tests, CI workflow, Vercel config.

See **PROGRESS.md** for the detailed per-phase log.
