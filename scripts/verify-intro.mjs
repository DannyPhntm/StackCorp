import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:4173'
const widths = [375, 390, 430, 1440]

const browser = await chromium.launch({ args: ['--use-gl=angle', '--ignore-gpu-blocklist'] })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))

// Fresh session: veil should be present shortly after first paint.
await page.goto(BASE, { waitUntil: 'load' })
await page.addStyleTag({ content: 'html,*{scroll-behavior:auto!important}' })
const veilAtStart = await page.locator('.intro-veil').count()
console.log('veil present fresh session:', veilAtStart === 1 ? 'PASS' : 'FAIL')

// Wait out the intro; veil should be gone and navbar visible.
await page.waitForTimeout(8000)
const veilGone = await page.locator('.intro-veil').count()
console.log('veil cleared after intro:', veilGone === 0 ? 'PASS' : `FAIL (still ${veilGone})`)
const navVisible = await page.locator('nav').first().isVisible().catch(() => false)
console.log('navbar visible after intro:', navVisible ? 'PASS' : 'FAIL')

// Scroll works after intro (camera story reads scroll — just assert page scrolls).
await page.evaluate(() => window.scrollTo(0, 1200))
await page.waitForTimeout(400)
const scrolled = await page.evaluate(() => window.scrollY)
console.log('page scrolls after intro:', scrolled > 400 ? 'PASS' : `FAIL (${scrolled})`)

// Second load in same session: no intro.
await page.goto(BASE, { waitUntil: 'load' })
await page.waitForTimeout(600)
const veilSecond = await page.locator('.intro-veil').count()
console.log('no intro second load:', veilSecond === 0 ? 'PASS' : 'FAIL')

// Overflow check across widths.
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 })
  await page.waitForTimeout(300)
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  console.log(`overflow @${w}:`, overflow <= 0 ? 'PASS' : `FAIL (${overflow}px)`)
}

// Reduced-motion: no intro.
const rmCtx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } })
const rmPage = await rmCtx.newPage()
await rmPage.goto(BASE, { waitUntil: 'load' })
await rmPage.waitForTimeout(600)
console.log(
  'reduced-motion no intro:',
  (await rmPage.locator('.intro-veil').count()) === 0 ? 'PASS' : 'FAIL',
)

// /founders: no veil.
const fCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const fPage = await fCtx.newPage()
await fPage.goto(BASE + '/founders', { waitUntil: 'load' })
await fPage.waitForTimeout(600)
console.log('/founders no veil:', (await fPage.locator('.intro-veil').count()) === 0 ? 'PASS' : 'FAIL')

console.log('console errors:', errors.length === 0 ? 'PASS (none)' : `FAIL: ${errors.join(' | ')}`)
await browser.close()
