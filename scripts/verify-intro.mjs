import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:4173'
const widths = [375, 390, 430, 1440]

const browser = await chromium.launch({ args: ['--use-gl=angle', '--ignore-gpu-blocklist'] })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))

// Fresh session: overlay should be present shortly after first paint.
await page.goto(BASE, { waitUntil: 'load' })
await page.addStyleTag({ content: 'html,*{scroll-behavior:auto!important}' })
const overlayAtStart = await page.locator('.intro-overlay').count()
console.log('overlay present fresh session:', overlayAtStart === 1 ? 'PASS' : 'FAIL')

// Mid-swipe: poll until the logo has travelled left and the wordmark is
// visible (fixed sleeps race the animation on slow browser start-up).
const midSwipe = await page
  .waitForFunction(
    () => {
      const word = document.querySelector('.intro-word')
      const logo = document.querySelector('.intro-logo')
      if (!word || !logo) return false
      const wordOpacity = parseFloat(getComputedStyle(word).opacity)
      const x = new DOMMatrixReadOnly(getComputedStyle(logo).transform).m41
      return wordOpacity > 0.5 && x < -50
    },
    null,
    { timeout: 4000 },
  )
  .then(() => true)
  .catch(() => false)
console.log('swipe + wordmark reveal observed:', midSwipe ? 'PASS' : 'FAIL')

// Wait out the intro; overlay should be gone and navbar visible.
await page.waitForTimeout(8000)
const overlayGone = await page.locator('.intro-overlay').count()
console.log('overlay cleared after intro:', overlayGone === 0 ? 'PASS' : `FAIL (still ${overlayGone})`)
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
const overlaySecond = await page.locator('.intro-overlay').count()
console.log('no intro second load:', overlaySecond === 0 ? 'PASS' : 'FAIL')

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
  (await rmPage.locator('.intro-overlay').count()) === 0 ? 'PASS' : 'FAIL',
)

// /founders: no overlay.
const fCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const fPage = await fCtx.newPage()
await fPage.goto(BASE + '/founders', { waitUntil: 'load' })
await fPage.waitForTimeout(600)
console.log('/founders no overlay:', (await fPage.locator('.intro-overlay').count()) === 0 ? 'PASS' : 'FAIL')

console.log('console errors:', errors.length === 0 ? 'PASS (none)' : `FAIL: ${errors.join(' | ')}`)
await browser.close()
