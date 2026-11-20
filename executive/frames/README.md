# Frames — scroll image sequence

Add your sequential image frames here. The site auto-detects them — no code changes needed.

## Naming

```
frame-001.jpg
frame-002.jpg
frame-003.jpg
...
```

- Sequential, starting at `frame-001`.
- `.jpg` is tried first, `.png` as a fallback for each number.
- Keep the same dimensions / aspect ratio for every frame (e.g. 1280×720 or 1920×1080).
- Keep each frame reasonably small (under ~200 KB each is ideal) so the page loads fast.

## How it works

`../script.js` probes `frame-001`, `frame-002`, … in order and stops after 6 consecutive missing numbers, so gaps end the sequence. Frames are preloaded progressively and scrubbed with `requestAnimationFrame`, mapped directly to vertical scroll progress (0% → first frame, 100% → last frame, finishing exactly at the footer).

## Until frames are added

This folder is intentionally empty right now. With 0 frames, the site renders an interactive dark ambient canvas instead (animated gradient waves and particles that respond to the mouse and to scroll) — the page still looks complete, not broken.
