# andreadahlen.com — v2

Static site. No build step, no dependencies. Drop these files at the web root and it runs.

```
index.html                     home (hero, three featured case studies, more case studies, about, contact)
cv.html                        CV
work/shelter-scotland.html     ┐
work/tabatwo.html              │
work/famly.html                │ six case studies, same template
work/nudging.html              │
work/business-gateway.html     │
work/tours-management-system.html ┘
styles.css                     the whole design system
main.js                        theme toggle, scroll reveals, counters, process rail
images/motifs/*.png            the botanical masks (tinted by CSS, so they work in both themes)
images/logos/*.webp            client logos for the homepage cards
sitemap.xml, robots.txt
```

## Before you deploy

Nothing outstanding. All ten font files are in `fonts/` and self-hosted — Inter 300/400/500
and Instrument Serif roman + italic, each in `latin` and `latin-ext`. No external font
requests, no CDN dependency.

## What must already be on the server

These are all files you already have — keep them where they are:

```
images/shelter-logo.webp                images/tabatwo-screens.png
images/shelter-billboard.webp           images/tours-prototype.jpg
images/shelter-colours.webp             images/tours-prototype-tour-page.jpg
images/shelter-patterns.webp
images/shelter-storybook.webp           Andrea-Dahlen-CV.pdf
images/shelter-brand-accessibility.webp og-image.jpg
                                        favicon.svg, favicon-96.png, apple-touch-icon.png
fonts/inter-{300,400,500}-normal-{latin,latin-ext}.woff2
fonts/instrument-serif-400-italic-{latin,latin-ext}.woff2
```

Any image that doesn't resolve degrades to a labelled plate rather than a broken
icon, so a wrong path is visible but never ugly.

## Still to add

Two images, both on the Tabatwo page, currently showing as "Add image" plates:

- an annotated booking flow
- the ranked backlog as the team received it

Everything else on all eight pages is a real image, a live embed, or a built diagram.

## URLs

All six case study paths match your existing ones, so nothing needs redirecting and
no inbound links break.

## Notes

- **No framework, no bundler.** Edit the HTML directly.
- **Dark mode** follows the OS by default; the header toggle overrides it and the
  choice persists in `localStorage` under `ad-theme`.
- **Reduced motion** is respected — reveals and counters resolve instantly.
- **Contrast** is WCAG AA against every surface, in both themes. If you change
  `--faint`, re-check it: at the old value it failed at 3.07:1.
- **The botanicals** are CSS masks, not images, so they take their colour from
  `--accent` and adapt to the theme. To dial them back site-wide, change one
  number: `--motif` in `:root`.
- **Print styles** are included; the CV prints cleanly.
