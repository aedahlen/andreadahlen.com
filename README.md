# andreadahlen.com — modern refresh

A static, single-page redesign of the portfolio. No build step, no dependencies.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page markup — hero, selected work, about, testimonials, experience, contact |
| `styles.css` | All styling. Design tokens at the top; light + dark themes |
| `projects.js` | Case-study copy for the project detail dialog (plain data) |
| `main.js` | Theme toggle, mobile nav, scroll reveal, scroll-spy, project dialog |
| `logo.png` / `logo.webp` | The original AeD monogram badge, used in the header, About panel and favicon |

## Run locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Or open `index.html` directly in a browser.

## Deploy

Upload the four files (plus this README if you like) to any static host —
Netlify, GitHub Pages, Cloudflare Pages, an S3 bucket, etc. Nothing to compile.

## Notes

- **Theme**: follows the OS setting by default; the sun/moon button in the header
  overrides it and the choice is remembered via `localStorage`.
- **Colours** (`:root` in `styles.css`): accent `#2669EC`, tinted surface `#EBF0F9`.
  Change `--accent` / `--bg` there and everything follows. The dark theme derives a
  navy variant of the same palette; `--logo-filter` inverts the black badge so it
  reads on dark.
- **Type**: Futura, with a geometric-sans fallback stack (`Futura PT`, `Century
  Gothic`, `Avenir Next`, `URW Gothic`) and Inter as a final web-loaded fallback for
  machines without Futura installed.
- **Logo**: `logo.png` is the original badge pulled from the current site. Swap the
  file (keep the name) to update it everywhere.
- **Accessibility**: semantic landmarks, skip link, visible focus rings, keyboard-
  operable dialog, and `prefers-reduced-motion` support.
- **Images**: the project tiles use generated gradient + monogram placeholders.
  Drop real screenshots into a project tile by replacing `.work-thumb` markup, or
  extend `projects.js` with image URLs.
- Content (roles, dates, case studies) is lifted from the current site's CV and
  project pages — review and adjust wording as needed.
