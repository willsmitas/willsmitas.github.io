# Personal Website

Static site — plain HTML, CSS, and JavaScript. No build step, no dependencies.
Open `index.html` in a browser, or serve the folder:

    py -m http.server 5173

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Home page. Spots needing your input are marked `TODO`. |
| `cv.html` | CV as HTML, with icon links to the PDF and LinkedIn. |
| `resume.pdf` | The CV as a PDF, linked from the cv page. |
| `styles.css` | Two palettes as custom properties, then layout and carousel. |
| `script.js` | Carousel behavior and the theme toggle. |
| `images/` | Placeholder slides — replace with your own photos. |

## Layout

Modeled on a plain personal-site format: a big bold name, a small `home / cv`
nav under it, a few short paragraphs, a hairline rule, and a contact sentence
with inline links — with a polaroid-framed photo to the right of the text.

Two columns above 50rem, anchored to the top of the viewport, and the whole
page still fits on one screen without scrolling. Top-anchored rather than
vertically centered so the name and nav sit at the same coordinates on the home
and cv pages — `scrollbar-gutter: stable` on `html` keeps the horizontal
position steady too, since the short home page would otherwise center about 8px
differently from the scrolling cv page. `.slide img` carries `max-height: min(56vh, 24rem)` to
hold that promise on short windows; the image crops rather than growing. Below
50rem the grid collapses to a single stacked column and the page scrolls.

If your bio runs long enough to overflow a short window, trim it or narrow the
first track in `.page`'s `grid-template-columns`.

## Pages

`index.html` is the one-screen home page; `cv.html` is the CV rendered as HTML.
The `home` / `cv` nav appears on both, with `aria-current="page"` marking the
one you are on. `<main>` carries the layout variant as a class — `page home`
for the two-column home layout, `page cv` for the single-column document — so
the two share `styles.css` without fighting each other.

The CV page's two icon links sit top right: a document badge pointing at
`resume.pdf`, and the LinkedIn mark. Both are inline SVG using `currentColor`,
so they follow the theme.

Keeping the CV in sync is manual — `cv.html` and `resume.pdf` are separate
files. When you update the PDF, update the matching entries in `cv.html`.

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
`data-caption`. The caption is the handwriting on the polaroid. Add or delete
`<li class="slide">` items freely — the rail under the frame is built from
whatever is in the markup.

Slides are cropped square (`object-fit: cover`), so any aspect ratio works;
the current set mixes portrait and landscape. Change `aspect-ratio` on
`.slide img` in `styles.css` for a different shape.

Source photos were resized to a 1100px short edge, saved at JPEG quality 82,
and stripped of EXIF — which also drops the GPS coordinates phones embed. If
you add more, do the same rather than committing camera originals; the ten
here went from 40MB to 3MB.

`data-shuffle` on the carousel element randomises the slide order on every
page load. Remove the attribute to keep the markup order.
Export at roughly 1600px wide; keep the first slide eager and leave
`loading="lazy"` on the rest — the script drops lazy loading from the slides
on either side of the current one as you move.

## Carousel controls

- The rail under the frame: each segment is a button, current one in clay red
- Order is reshuffled on each load (`data-shuffle`)
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
