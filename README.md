# Personal Website

Static site — plain HTML, CSS, and JavaScript. No build step, no dependencies.
Open `index.html` in a browser, or serve the folder:

    py -m http.server 5173

## Files

| File | Purpose |
| --- | --- |
| `index.html` | All page content. Every spot needing your input is marked `TODO`. |
| `styles.css` | Two palettes as custom properties, then layout and carousel. |
| `script.js` | Carousel behavior and the theme toggle. |
| `images/` | Placeholder slides — replace with your own photos. |

## Layout

Modeled on a plain personal-site format: a big bold name, a small `home / cv`
nav under it, a few short paragraphs, a hairline rule, and a contact sentence
with inline links — with a polaroid-framed photo to the right of the text.

Two columns above 50rem, centered in the viewport so the whole page fits on one
screen without scrolling. `.slide img` carries `max-height: min(56vh, 24rem)` to
hold that promise on short windows; the image crops rather than growing. Below
50rem the grid collapses to a single stacked column and the page scrolls.

If your bio runs long enough to overflow a short window, trim it or narrow the
first track in `.page`'s `grid-template-columns`.

## What to fill in

1. **Bio** — the greeting and lorem ipsum paragraphs in `.bio`, and the
   contact sentence below the rule.
2. **Name** — the `<h1>`.
3. **Résumé** — drop `resume.pdf` next to `index.html`, or repoint the `cv` link.
4. **LinkedIn** — replace `https://www.linkedin.com/in/your-profile` in the
   contact line.
5. **Photos** — see below.

## Adding your photos

Put your images in `images/` and update each slide's `src`, `alt`, and
`data-caption`. The caption is the handwriting on the polaroid, so keep it
short and lowercase. Add or delete `<li class="slide">` items freely — the rail
under the frame is built from whatever is in the markup.

Slides are cropped to 4:5 portrait (`object-fit: cover`), so any aspect ratio
works. Change `aspect-ratio` on `.slide img` in `styles.css` for a different
shape.
Export at roughly 1600px wide; keep the first slide eager and leave
`loading="lazy"` on the rest — the script drops lazy loading from the slides
on either side of the current one as you move.

## Carousel controls

- The rail under the frame: each segment is a button, current one in clay red
- Chevrons flanking the rail
- Left/Right arrow keys, Home, End (click or tab to the image first)
- Click-drag with a mouse, swipe on touch; vertical swipes still scroll the page
- Wraps around at both ends

## Theme

Defaults to the visitor's OS setting. The toggle in the top right overrides it
and remembers the choice in `localStorage` under `theme`; the small script in
`<head>` applies the saved value before first paint so there's no flash. To
force one theme permanently, hardcode `data-theme="light"` (or `"dark"`) on the
`<html>` element and delete the toggle.

## Color scheme

Ten custom properties per palette in `styles.css` — warm white, a pastel
yellow image well, tan hairlines, brown text in three weights of emphasis, a
muted brick red accent, and the polaroid stock plus its handwriting and shadow.
The dark palette redefines the same ten; the frame dims to a warm off-white
there rather than glaring pure white. Nothing else in the file names a color.
