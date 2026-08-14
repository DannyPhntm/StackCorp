# StackCorp Carousel Template

A reusable, data-driven system for producing premium 1080×1080 LinkedIn carousel
slides in the StackCorp brand — the design approved in the Malir Cantt Bazaar deck.

You write a **deck** as a plain data file and render it with one command. The
brand engine handles all the styling, fonts, logo, layout and slide components.

```
scripts/carousel/
├── brand.mjs                    # the engine: tokens, fonts, logo, CSS, slide-type renderers
├── render.mjs                   # CLI: turns a deck file into PNGs
├── decks/
│   └── malir-cantt-bazaar.mjs   # example deck (the 9-slide case study) + schema reference
└── README.md
```

## Quick start

```bash
# render a deck to ~/Downloads at 1080×1080
node scripts/carousel/render.mjs scripts/carousel/decks/malir-cantt-bazaar.mjs

# custom output dir + 2× scale (2160×2160, sharper)
node scripts/carousel/render.mjs scripts/carousel/decks/my-deck.mjs ~/Desktop 2
```

Output files are named `<slug>-<NN>.png` (e.g. `stackcorp-slide-01.png`). Slide
numbers auto-increment; the top-left index and file name follow the order in the
deck.

## Make a new carousel

1. Copy `decks/malir-cantt-bazaar.mjs` to `decks/<your-topic>.mjs`.
2. Set `name`, `slug`, and the `slides` array.
3. Render it.

That's it — no styling needed. Just choose a **type** per slide and fill fields.

## Brand tokens (in `brand.mjs`)

| Token | Value | Use |
|-------|-------|-----|
| Background | `#080B13` | slide base |
| Accent | `#2563EB` | eyebrows, highlights, blue title parts, CTAs |
| Display / headings | **Supreme** (heavy) | `h1`, wordmark, card/section titles |
| Body / labels | **Satoshi** | paragraphs, labels, footers, stats |
| Logo | real StackCorp cube (`public/assets/logo/stackcorp-icon.png`) | top lockup, never recreated |

Every slide gets the shared chrome automatically: near-black background, faint
masked grid, one soft corner glow, `NN` index top-left, StackCorp lockup
top-right, and (optional) hairline footer. 84–96px safe margins.

## Slide types & fields

Every slide shares: `type` (required), `eyebrow`, `title`, `titleSize?`,
`foot?` (footer caption, supports `<b>`), `foottag?` (small uppercase tag right
of the footer). `title` is either a string (may contain `<br>`) or, for the
cover, an array of `{ text, blue? }` parts.

| `type` | Purpose | Extra fields |
|--------|---------|--------------|
| `cover` | Title/hero slide (slide 01) | `upper?` (uppercase), `subtitle?`, `accent?` (use `->` for the arrow) |
| `statement` | Big claim + paragraphs (+ optional card grid) | `subtitle?`, `paras:[{text, lede?}]`, `cardsLabel?`, `cards:[{icon,title,sub?}]` |
| `flow` | Vertical step flow | `subtitle?`, `wide?` (full-width nodes + `tag`), `steps:[{icon,label,sub?,annot?,tag?,hl?}]` |
| `checklist` | Grid of ticked items | `items:[string]`, `cols?` (default 2) |
| `featureCards` | Cards with a bulleted list each | `subtitle?`, `cards:[{icon,title,items:[string]}]` |
| `grid` | Monogram tile grid (tech stacks) | `cells:[{mono,name}]`, `cols?` (default 4) |
| `results` | Paragraphs + icon pills + CTA box | `paras:[{text}]`, `pills:[{icon,title}]`, `cta:{title,url}` |
| `closing` | Paragraphs + centered StackCorp lockup | `paras:[{text, first?}]`, `tagline?`, `url?` |

Text fields accept `<b>…</b>` (white/bold) and `<br>`. `annot` on a flow step
adds a green-check annotation to the right; `hl:true` highlights a node in blue.

## Icons

Use icon **names** (not brand logos). Available in `brand.mjs` → `ICONS`:

`user, users, lock, shield, shieldCheck, store, search, building, mail, image,
dashboard, server, check, checkCircle, rocket, grid, tag, sliders, zap,
database, cloud, send, globe, arrow`

Need another? Add a Lucide-style path to `ICONS` in `brand.mjs`.

## Rules (keep it on-brand)

- **Never fabricate third-party brand logos.** For tech stacks / architecture,
  use `grid` monogram tiles or the line-icon set. Drop in official brand SVGs
  only if you have the real assets.
- Real StackCorp logo only — it's embedded from the repo, not redrawn.
- No harsh gradients; the one subtle corner glow is built in.
- Keep headings short (1–2 lines). If a heading is long, lower `titleSize`.
- LinkedIn documents are 1080×1080; that's the default. Use scale `2` if you
  want extra sharpness (LinkedIn will downscale).
