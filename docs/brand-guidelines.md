# StackCorp Brand Guidelines

## Brand

- **Name:** StackCorp
- **Domain:** [stackcorp.org](https://stackcorp.org)
- **Brand idea:** "Stack" refers both to a technology stack (the tools/systems we build with) and to stacking business value/growth for clients. The name should read as technical competence plus practical, compounding results — not a gimmick.

## Tone

- Human and founder-led — real people building real systems, not a faceless vendor.
- Professional and practical — no fluff, no overpromising.
- Direct and grounded — speak plainly about what we build and why it works.

## Avoid

- Crypto/Web3 visual language (gradients-on-black, neon, coin/token imagery).
- Fake or exaggerated AI hype ("revolutionary," "game-changing," unverified claims).
- Fake corporate polish — stock-photo boardrooms, invented client logos, invented metrics.
- Visual clutter — excess gradients, shadows, competing accents, dense unstructured layouts.

## Approved Color Palette

| Variable      | Hex       | Intended use                                            |
|---------------|-----------|-----------------------------------------------------------|
| `--sc-blue`   | `#416D8A` | Primary accent — links, buttons, interactive highlights   |
| `--sc-ice`    | `#F1F4FF` | Light background — page backgrounds, light-mode sections  |
| `--sc-mist`   | `#F0F1ED` | Light background alt — subtle dividers, secondary bg      |
| `--sc-navy`   | `#153243` | Dark background — dark-mode sections, header/footer       |
| `--sc-stone`  | `#D8D9D3` | Neutral — cards, borders, dividers, muted UI elements      |
| `--sc-black`  | `#20211C` | Primary text — body copy, headings on light backgrounds   |

Defined as CSS variables in [`src/styles/brand.css`](../src/styles/brand.css). Reference the variables — do not hardcode hex values in components.

## Asset Naming Rules

- Use lowercase, kebab-case filenames (`stackcorp-logo.png`, not `StackCorp_Logo.PNG`).
- Prefix by category where useful (e.g. `mcb-` for Malir Cantt Bazaar case study images).
- Name variants explicitly: `-dark`, `-light`, `-icon`, `-wordmark`.
- No spaces, no ambiguous names like `final2-USE-THIS.png`.

## Font Usage

- Only use fonts with confirmed licensing for website/public embedding.
- No font has been chosen/confirmed yet — do not assume a typeface.
- Do not add paid or proprietary font files to the repo until licensing is confirmed with Daniyal.
- Self-hosted fonts belong in `src/assets/fonts/` as `.woff2` (see that folder's README).

## Logo Usage

- No approved logo exists in this repo yet.
- Use only official, approved logo files from `public/assets/logo/` — do not generate, invent, or approximate a logo.
- Maintain clear space around the logo; do not stretch, recolor, or add effects unless a variant is explicitly provided.

## Founder Photo Usage

- No founder photos exist in this repo yet.
- Use only real, approved photos from `public/assets/founders/` — do not generate or invent founder imagery.
- Keep consistent framing/treatment across founder photos when displayed together.
