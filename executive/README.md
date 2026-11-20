# Rajagopal Mandadi — Executive Portfolio

A second, executive portfolio website for Rajagopal Mandadi — Specialist Data Engineer at LTIMindtree, Power BI Developer, Azure Data Engineer & Power Platform Architect.

This lives in a subfolder of the main portfolio repo (`rajagopal-portfolio`), so the first portfolio at the repo root is untouched.

## What it is

- `index.html` — landing page with a scroll-driven HTML5 canvas animation. It scrubs through an image sequence in `frames/` as you scroll (0% → 100%, finishing exactly at the footer). Until frames are added, it shows an interactive dark ambient canvas instead.
- `projects.html` — dedicated projects page: "Data Engineering & Automation Architectures", with three architectural deep-dives, on a static dark background with amber / crimson ambient glows.
- `styles.css` / `script.js` — shared design system and canvas engine (vanilla JS, no dependencies).
- `frames/` — add sequential frames as `frame-001.jpg`, `frame-002.jpg`, … (see `frames/README.md`).

Design: executive dark minimalism (`#0A0A0C`, `#F8FAFC`, `#94A3B8`, `#F59E0B` amber, `#38BDF8` cyan), Plus Jakarta Sans + JetBrains Mono, sticky `RAJAGOPAL.DEV` navbar, "Book a Consultation" modal (LinkedIn + phone — no invented email).

## View it

Local preview — from this folder, run a static server, then open it:

```bash
cd executive
python3 -m http.server 8000
# open http://localhost:8000/
```

On GitHub Pages (once pushed), it will be at:

```
https://rajagopalbi.github.io/rajagopal-portfolio/executive/
```

Note: the frame sequence needs to be served over HTTP(S) — opening `index.html` directly from disk may block some frame loads in some browsers. The local server above is the reliable way to preview.

## Add frames

Export your portrait / animation as a numbered image sequence into `frames/` — see `frames/README.md`. No code changes needed.
