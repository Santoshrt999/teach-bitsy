# PROGRESS — Teach Bitsy 🤖

Phase-by-phase build log. Newest status at a glance:

| Phase | Title | Status |
|------:|-------|--------|
| 1 | Scaffold + design system + Bitsy | ✅ Done |
| 2 | Collect screen + dataset store | ✅ Done |
| 3 | Teach screen + TF.js pipeline | ⬜ Next |
| 4 | Test + Trick screens | ⬜ Pending |
| 5 | PWA + persistence + tests + README + deploy | ⬜ Pending |

Build pace: **checkpoint after each phase**. Verification gate each phase = `typecheck` +
`lint` + `test` + `build` all green.

---

## ✅ Phase 1 — Scaffold + design system + Bitsy

- Vite 6 + React 19 + TS strict (project references), Tailwind v4 `@theme` palette tokens.
- Self-hosted Fredoka/Nunito (`@fontsource`) → zero third-party requests, offline-ready.
- CSP `<meta>` locks the app to on-device only.
- `ui/Button`, `ui/Card` design-system primitives (chunky borders + hard shadows).
- **Bitsy** mascot: SVG robot, `mood` prop → 4 faces, speech bubble, reduced-motion-gated wobble.
- Accessible 4-tab stepper shell (roving tabindex, arrow keys, ARIA) + grown-up-mode toggle.
- Fix: bumped Vitest 2.1 → 3.2.6 to share Vite 6 (was pulling its own Vite 5).
- Verified: typecheck ✅ · lint ✅ · build ✅ (105 kB gz) · dev HTTP 200.

## ✅ Phase 2 — Collect screen + dataset store

- Zustand store extended: `buckets[]` + `examples[]` with `addExample`/`removeExample`/
  `renameBucket`/`resetDataset`; `countInBucket` selector.
- Pure helpers `lib/dataset.ts`: `datasetNudge` (need-more vs imbalance) + `canTeach`.
- `lib/image.ts`: center-crop → 256² JPEG data URL for webcam + uploads; 8 MB cap, type guard.
- Components: `Webcam` (privacy-first explainer → camera → shutter, stops tracks on close),
  `ImageDrop` (drag-drop + file picker), `PolaroidCard` (delete), `BucketColumn`.
- `CollectScreen` rewritten: two editable buckets, live counts, nudge → Bitsy mood/message,
  camera modal per bucket.
- Tests: `dataset.test.ts` (7) + `store.test.ts` (5) — **12 passing**.
- Verified: typecheck ✅ · lint ✅ · test ✅ (12) · build ✅ (109 kB gz).

## ⬜ Phase 3 — Teach screen + TF.js pipeline (next)

- `lib/ml/backend.ts`: init WebGPU→WebGL→WASM, log active backend.
- `lib/ml/mobilenet.ts`: lazy-load v3-small graph model (pinned TFJS URL) with "Waking up my
  brain…" loader; `embed(pixels)` → 1024-d. **Verify the weights URL loads; surface 404s.**
- `lib/ml/trainer.ts`: precompute embeddings per example, train dense head (Adam, ~30 epochs,
  categorical CE), predict; dispose tensors.
- Teach screen: ✨ Teach button, Smartness meter (acc), Oops meter (animated SVG loss curve),
  grown-up-mode relabel ("Loss J(w,b)" + LR + epochs), Bitsy thinking→proud, confetti.
- Gate: head train < 5 s on 10–30 imgs; `tf.memory().numTensors` stable across 3 retrains.

## Notes / decisions

- Pace: checkpoint each phase. Git: pushing to `github.com/Santoshrt999/teach-bitsy`.
- MobileNet: **v3-small from hosted TFJS graph model**, cached via PWA (Phase 5).
- Risk: hosted v3-small weights URL can move — pin + verify at Phase 3.
