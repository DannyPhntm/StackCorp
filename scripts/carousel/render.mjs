/*
 * StackCorp carousel renderer
 * -------------------------------------------------------------------------
 * Usage:
 *   node scripts/carousel/render.mjs <deck.mjs> [outDir] [scale]
 *
 *   deck.mjs  a deck data file (default export {name, slug, slides:[...]})
 *   outDir    where PNGs are written              (default: ~/Downloads)
 *   scale     device pixel ratio, 1 = 1080², 2 = 2160² (default: 1)
 *
 * Example:
 *   node scripts/carousel/render.mjs scripts/carousel/decks/malir-cantt-bazaar.mjs
 *   node scripts/carousel/render.mjs scripts/carousel/decks/my-deck.mjs ~/Desktop 2
 *
 * Each slide's `num` is auto-filled from its position (01, 02, …) unless the
 * slide sets its own. Output files: <slug>-<NN>.png.
 */
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { chromium } from 'playwright'
import { slideHtml } from './brand.mjs'

const [, , deckArg, outArg, scaleArg] = process.argv
if (!deckArg) {
  console.error('Usage: node scripts/carousel/render.mjs <deck.mjs> [outDir] [scale]')
  process.exit(1)
}
const deckPath = path.resolve(deckArg)
const outDir = outArg || `${process.env.HOME}/Downloads`
const dsf = Number(scaleArg || 1)

const deck = (await import(pathToFileURL(deckPath).href)).default
if (!deck?.slides?.length) throw new Error('Deck has no slides.')
const slug = deck.slug || 'carousel'
fs.mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const tmp = path.join(process.cwd(), '.carousel-tmp.html')
let i = 0
for (const slide of deck.slides) {
  i++
  const num = slide.num || String(i).padStart(2, '0')
  const html = slideHtml({ ...slide, num })
  fs.writeFileSync(tmp, html)
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: dsf })
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(200)
  const out = path.join(outDir, `${slug}-${num}.png`)
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1080, height: 1080 } })
  await page.close()
  console.log(`✓ ${num}  ${slide.type.padEnd(12)} -> ${out}`)
}
fs.existsSync(tmp) && fs.unlinkSync(tmp)
await browser.close()
console.log(`\nDone — ${i} slides (${dsf * 1080}×${dsf * 1080}) in ${outDir}`)
