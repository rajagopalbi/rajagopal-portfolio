# Rajagopal Mandadi — Portfolio Website

Animated, single-page portfolio for Rajagopal Mandadi, Specialist Data Engineer / Power BI Developer, Bengaluru, India.

## Files

- `index.html` — the whole portfolio page (Hero, About, Skills, Experience, Projects, Education, Contact)
- `styles.css` — dark navy (`#0f2040` / `#1B365D`) + teal styling, animations, responsive layout
- `script.js` — scroll-reveal (IntersectionObserver), animated counters, animated skill bars, mobile menu, active nav highlighting, footer year
- Cinematic upgrade (21 Nov 2026): full-screen hero with word-by-word headline reveal, mouse-move 3D tilt on the photo and project cards, hero parallax, top scroll-progress bar, staggered fade/slide/scale section reveals, skill marquee, animated section-heading underlines, alternating timeline slide-ins, animated mouse scroll indicator. Respects `prefers-reduced-motion`.
- `photo.jpg` — profile photo, kept as a separate local copy. `index.html` embeds the same photo as a base64 data URI, so the page works on GitHub Pages without a separate image file.

## How to view it

Open `index.html` in any browser — no build step, no server needed.

Or host it with GitHub Pages: push this folder to a GitHub repo, then enable Pages from the `main` branch.

## Sections

Hero (5+ years experience, 25 skills, 3 Cisco dashboards, 5 roles) · About · Skills · Experience (timeline, LTIMindtree → Zensar/Cisco → Aravina → Medi Assist → Raptakos & Brett) · Projects (Serviceability ROI, Customer QBR, RUSS, plus other Power BI work) · Education (B.Pharmacy, JNTU, 2013–2017) · Contact (LinkedIn, phone, location — no email address is listed)

## Notes

- All facts are from Rajagopal's verified resume / LinkedIn. No clients, metrics, or projects were invented.
- Style reference: cinematic scroll-animated portfolio sites, in the style of the YouTube video " $7000 Portfolio Website With Free AI Tools In 10 Minutes || No Coding" (https://www.youtube.com/watch?v=tf_yi6DtDOQ).
- No external images are used except `photo.jpg`. Fonts are system fonts.
