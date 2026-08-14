/*
 * StackCorp carousel brand engine
 * -------------------------------------------------------------------------
 * The reusable design system behind the LinkedIn carousels. It owns the brand
 * tokens, the self-hosted fonts + logo, the shared "chrome" (background, grid,
 * glow, top lockup, eyebrow, heading, footer) and a renderer for each slide
 * TYPE. Author a carousel as plain data (see decks/*.mjs) and render it with
 * `node scripts/carousel/render.mjs <deck.mjs>`.
 *
 * Design language (matches slide-01, approved):
 *   • Background  #080B13 (near-black navy)   • Accent  #2563EB (deep blue)
 *   • Display / headings  Supreme (heavy)     • Body / labels  Satoshi
 *   • Real StackCorp cube logo, framed in a subtle chip — never recreated
 *   • Subtle single corner glow + faint masked grid (no harsh gradients)
 *   • 1080×1080, generous spacing, ~84–96px safe margins for LinkedIn
 *
 * Rule: never fabricate third-party brand logos. Use monogram tiles + the
 * hand-drawn line-icon set below for tech/architecture slides.
 */
import fs from 'fs'
import { fileURLToPath } from 'url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url)) // repo root
const b64 = (p) => fs.readFileSync(ROOT + p).toString('base64')

export const tokens = {
  bg: '#080B13',
  accent: '#2563EB',
  accentSoft: 'rgba(37,99,235,.14)',
  fontDisplay: "'Supreme'",
  fontBody: "'Satoshi'",
}

const supreme = b64('src/assets/fonts/supreme/Supreme-Variable.woff2')
const satoshi = b64('src/assets/fonts/satoshi/Satoshi-Variable.woff2')
const logo = b64('public/assets/logo/stackcorp-icon.png')

/* ---- line-icon set (generic UI only; never brand marks) ---- */
export const ICONS = {
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
  users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.5 21v-1a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1"/><path d="M16 4.2a3.4 3.4 0 0 1 0 6.6"/><path d="M17 14.5a5 5 0 0 1 4 4.9V21"/>',
  lock: '<rect x="4" y="10.5" width="16" height="10" rx="2.5"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
  shield: '<path d="M12 21c5-2 8-5 8-9.5V5.2l-8-3-8 3v6.3C4 16 7 19 12 21z"/>',
  shieldCheck: '<path d="M12 21c5-2 8-5 8-9.5V5.2l-8-3-8 3v6.3C4 16 7 19 12 21z"/><path d="M8.8 11.6l2.2 2.2 4.2-4.4"/>',
  store: '<path d="M4 9.5 5.2 4.5h13.6L20 9.5"/><path d="M4 9.5a2.4 2.4 0 0 0 4 1.6 2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 0 4-1.6"/><path d="M5.2 11v9.5h13.6V11"/><path d="M9.5 20.5V15h5v5.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
  building: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
  image: '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><circle cx="9" cy="9.5" r="1.8"/><path d="m5 19 5-5 4 3.5 3-3 3 3.5"/>',
  dashboard: '<rect x="3.5" y="3.5" width="7.5" height="9.5" rx="1.4"/><rect x="13" y="3.5" width="7.5" height="5.5" rx="1.4"/><rect x="13" y="11" width="7.5" height="9.5" rx="1.4"/><rect x="3.5" y="15" width="7.5" height="5.5" rx="1.4"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 17.5h.01"/>',
  check: '<path d="M20 6.5 9.5 17.5l-5-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.2 2.4 2.4 4.6-4.9"/>',
  rocket: '<path d="M6 15c-1.6.7-2.4 2.3-2.5 4.5C5.7 19.4 7.3 18.6 8 17"/><path d="M9 14c-1.5-1.5-1-4 1-6.5C12.5 4 16 3.5 19 4c.5 3-0 6.5-3.5 9C13 15 10.5 15.5 9 14z"/><circle cx="14.5" cy="8.5" r="1.4"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/>',
  tag: '<path d="M11 3.5H5.5A2 2 0 0 0 3.5 5.5V11a2 2 0 0 0 .6 1.4l7.5 7.5a2 2 0 0 0 2.8 0l5.5-5.5a2 2 0 0 0 0-2.8l-7.5-7.5A2 2 0 0 0 11 3.5z"/><circle cx="8" cy="8" r="1.3"/>',
  sliders: '<path d="M4 8h10M18 8h2M4 16h2M10 16h10"/><circle cx="16" cy="8" r="2.3"/><circle cx="8" cy="16" r="2.3"/>',
  zap: '<path d="M13 2 4 13h6l-1 9 9-11h-6l1-8z"/>',
  database: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.6 3.6 3 8 3s8-1.4 8-3v-13"/><path d="M4 12c0 1.6 3.6 3 8 3s8-1.4 8-3"/>',
  cloud: '<path d="M7 19a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 11a4 4 0 0 1-1 8H7z"/>',
  send: '<path d="m21 3-9.5 9.5"/><path d="M21 3 14.5 21l-3-7.5-7.5-3L21 3z"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.4 2.3 3.7 5.3 3.7 8.5S14.4 18.2 12 20.5C9.6 18.2 8.3 15.2 8.3 12S9.6 5.8 12 3.5z"/>',
  arrow: '<path d="M5 12h13"/><path d="m12 5.5 6.5 6.5-6.5 6.5"/>',
}
export const ic = (n, s = 26, color = 'currentColor', sw = 1.7) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ICONS.check}</svg>`
const greenCheck = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#16a34a" opacity="0.18"/><circle cx="12" cy="12" r="9" stroke="#22c55e" stroke-width="1.6"/><path d="m8.4 12.2 2.4 2.4 4.7-5" stroke="#22c55e" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`

const A = tokens.accent
export const css = `
@font-face{font-family:'Supreme';src:url(data:font/woff2;base64,${supreme}) format('woff2');font-weight:100 800;font-display:block}
@font-face{font-family:'Satoshi';src:url(data:font/woff2;base64,${satoshi}) format('woff2');font-weight:300 700;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px}
.slide{position:relative;width:1080px;height:1080px;overflow:hidden;background:${tokens.bg};padding:84px 96px;display:flex;flex-direction:column;font-family:'Satoshi',sans-serif;-webkit-font-smoothing:antialiased;color:#fff}
.glow{position:absolute;width:900px;height:900px;right:-320px;bottom:-360px;background:radial-gradient(circle, rgba(37,99,235,.16), rgba(37,99,235,.05) 42%, transparent 66%);filter:blur(20px);pointer-events:none}
.grid{position:absolute;inset:0;opacity:.5;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px);background-size:90px 90px;-webkit-mask-image:radial-gradient(ellipse 80% 70% at 30% 35%,#000 20%,transparent 80%)}
.top{display:flex;justify-content:space-between;align-items:center;position:relative;z-index:2}
.idx{font-family:'Satoshi';font-weight:600;font-size:26px;letter-spacing:.06em;color:rgba(255,255,255,.42)}
.lock{display:flex;align-items:center;gap:14px}
.chip{width:52px;height:52px;border-radius:13px;overflow:hidden;border:1px solid rgba(255,255,255,.10);box-shadow:0 0 0 1px rgba(37,99,235,.10),0 10px 30px rgba(0,0,0,.4);background:#0A0E1A}
.chip img{width:100%;height:100%;object-fit:cover;display:block}
.wm{font-family:'Supreme';font-weight:700;font-size:23px;letter-spacing:.14em;line-height:1}
.wm b{color:#fff}.wm span{color:rgba(255,255,255,.4)}
.mid{flex:1;display:flex;flex-direction:column;position:relative;z-index:2;padding-top:46px}
.eyebrow{font-family:'Satoshi';font-weight:600;font-size:19px;letter-spacing:.22em;text-transform:uppercase;color:${A};margin-bottom:22px}
h1{font-family:'Supreme';font-weight:800;letter-spacing:-.025em;line-height:.98;color:#fff}
h1 .b{color:${A}}
.subh{font-family:'Satoshi';font-weight:500;color:rgba(255,255,255,.62);margin-top:18px;line-height:1.4}
.para{font-family:'Satoshi';font-weight:450;font-size:26px;line-height:1.5;color:rgba(255,255,255,.62);margin-top:22px;max-width:660px}
.para.lede{color:rgba(255,255,255,.92);font-weight:600}
.para b{color:#fff;font-weight:600}
.accent{font-family:'Satoshi';font-weight:600;font-size:29px;letter-spacing:.005em;color:${A};margin-top:40px;display:flex;align-items:center;gap:14px}
.footwrap{position:relative;z-index:2;padding-top:26px;margin-top:26px;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center}
.foot{font-family:'Satoshi';font-weight:500;font-size:22px;line-height:1.45;color:rgba(255,255,255,.55);max-width:760px}
.foot b{color:rgba(255,255,255,.85);font-weight:600}
.foottag{font-family:'Satoshi';font-weight:600;font-size:18px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.32);white-space:nowrap}
.section-label{font-family:'Satoshi';font-weight:600;font-size:20px;color:${A};margin:0 0 18px}
.cards2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:8px}
.card{display:flex;align-items:center;gap:16px;padding:22px 24px;border-radius:16px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.025)}
.card .ci{width:44px;height:44px;flex:0 0 44px;border-radius:11px;display:grid;place-items:center;background:${tokens.accentSoft};color:#7aa2ff;border:1px solid rgba(37,99,235,.22)}
.card .ct{font-family:'Satoshi';font-weight:600;font-size:22px;line-height:1.2;color:#fff}
.card .cs{font-family:'Satoshi';font-weight:450;font-size:18px;color:rgba(255,255,255,.55);margin-top:2px}
.chks{display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;margin-top:6px}
.chk{display:flex;align-items:center;gap:14px;padding:15px 20px;border-radius:13px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02)}
.chk .cc{color:${A};flex:0 0 auto}
.chk span{font-family:'Satoshi';font-weight:550;font-size:21px;color:#fff}
.flow{display:flex;flex-direction:column;gap:0;margin-top:6px}
.frow{display:flex;align-items:center;gap:18px}
.fnode{flex:0 0 470px;display:flex;align-items:center;gap:16px;padding:16px 20px;border-radius:14px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03)}
.fnode.hl{border-color:rgba(37,99,235,.5);background:rgba(37,99,235,.14);box-shadow:0 0 0 1px rgba(37,99,235,.18),0 12px 30px rgba(37,99,235,.12)}
.fnode .fi{width:40px;height:40px;flex:0 0 40px;border-radius:10px;display:grid;place-items:center;background:rgba(255,255,255,.06);color:#cfe0ff}
.fnode.hl .fi{background:rgba(37,99,235,.28);color:#bcd0ff}
.fnode .fl{font-family:'Satoshi';font-weight:600;font-size:22px;color:#fff}
.fnode .fsub{font-family:'Satoshi';font-weight:450;font-size:16px;color:rgba(255,255,255,.5)}
.fconn{height:20px;width:2px;margin-left:243px;background:linear-gradient(rgba(255,255,255,.28),rgba(255,255,255,.12))}
.f4 .fnode{width:100%;flex:none}
.f4 .fconn{margin-left:calc(50% - 1px)}
.fann{display:flex;align-items:center;gap:10px;font-family:'Satoshi';font-weight:500;font-size:19px;color:rgba(255,255,255,.66)}
.fdots{width:44px;height:1px;border-top:1.5px dashed rgba(255,255,255,.22)}
.flabel{font-family:'Satoshi';font-weight:600;font-size:17px;letter-spacing:.1em;text-transform:uppercase;color:${A};white-space:nowrap}
.tgrid{display:grid;gap:16px;margin-top:8px}
.tcell{aspect-ratio:1.15;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;border-radius:16px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.025)}
.tmono{width:56px;height:56px;border-radius:14px;display:grid;place-items:center;font-family:'Supreme';font-weight:700;font-size:24px;letter-spacing:-.02em;color:#cfe0ff;background:${tokens.accentSoft};border:1px solid rgba(37,99,235,.22)}
.tname{font-family:'Satoshi';font-weight:600;font-size:19px;color:rgba(255,255,255,.9)}
.seccard{display:flex;gap:20px;padding:24px 26px;border-radius:18px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.025);margin-top:16px}
.seccard .si{width:52px;height:52px;flex:0 0 52px;border-radius:13px;display:grid;place-items:center;background:${tokens.accentSoft};color:#7aa2ff;border:1px solid rgba(37,99,235,.22)}
.seccard h3{font-family:'Supreme';font-weight:700;font-size:26px;color:#fff;margin-bottom:10px;letter-spacing:-.01em}
.seccard ul{display:flex;flex-wrap:wrap;gap:8px 28px;list-style:none}
.seccard li{font-family:'Satoshi';font-weight:450;font-size:20px;color:rgba(255,255,255,.66);position:relative;padding-left:18px}
.seccard li::before{content:'';position:absolute;left:0;top:11px;width:6px;height:6px;border-radius:50%;background:${A}}
.pills{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:8px}
.pill{display:flex;flex-direction:column;align-items:flex-start;gap:16px;padding:24px;border-radius:16px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.025)}
.pill .pi{width:48px;height:48px;border-radius:12px;display:grid;place-items:center;background:${tokens.accentSoft};color:#7aa2ff;border:1px solid rgba(37,99,235,.22)}
.pill .pt{font-family:'Satoshi';font-weight:600;font-size:20px;color:#fff;line-height:1.25}
.cta{margin-top:26px;display:flex;justify-content:space-between;align-items:center;padding:28px 34px;border-radius:18px;border:1px solid rgba(37,99,235,.4);background:linear-gradient(90deg,rgba(37,99,235,.14),rgba(37,99,235,.04))}
.cta .ch{font-family:'Supreme';font-weight:700;font-size:30px;color:#fff}
.cta .cu{font-family:'Satoshi';font-weight:600;font-size:24px;color:${A};margin-top:4px}
.cta .carw{color:${A}}
.cover-mid{justify-content:center}
.cover-mid h1 .b{display:block}
.cover-mid.upper h1{text-transform:uppercase}
.close{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;text-align:center;position:relative;z-index:2;padding-bottom:20px}
.close .clock{display:flex;align-items:center;gap:22px;margin-bottom:34px}
.close .cchip{width:96px;height:96px;border-radius:22px;overflow:hidden;border:1px solid rgba(255,255,255,.12);box-shadow:0 0 0 1px rgba(37,99,235,.14),0 18px 50px rgba(0,0,0,.5)}
.close .cchip img{width:100%;height:100%;object-fit:cover}
.close .cwm{font-family:'Supreme';font-weight:700;font-size:56px;letter-spacing:.06em}
.close .cwm b{color:#fff}.close .cwm span{color:${A}}
.close .ctag{font-family:'Satoshi';font-weight:500;font-size:28px;color:rgba(255,255,255,.66);margin-bottom:30px}
.close .curl{font-family:'Satoshi';font-weight:600;font-size:26px;color:${A};letter-spacing:.02em}
`

const lockup = `<div class="lock"><div class="chip"><img src="data:image/png;base64,${logo}"></div><div class="wm"><b>STACK</b><span>CORP</span></div></div>`

/* the StackCorp "STACKCORP" wordmark, blue split — usable inline */
const wordmark = (cls = 'wm') => `<div class="${cls}"><b>STACK</b><span>CORP</span></div>`

function chrome({ num, eyebrow, h1, h1size, midClass = '', inner = '', foot = '', foottag = '' }) {
  return `<div class="slide"><div class="glow"></div><div class="grid"></div>
  <div class="top"><div class="idx">${num}</div>${lockup}</div>
  <div class="mid ${midClass}">
    ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}
    ${h1 ? `<h1 style="font-size:${h1size}px">${h1}</h1>` : ''}
    ${inner}
  </div>
  ${foot ? `<div class="footwrap"><div class="foot">${foot}</div>${foottag ? `<div class="foottag">${foottag}</div>` : ''}</div>` : ''}
  </div>`
}

/* ---------- per-type renderers ---------- */
const titleHtml = (title) =>
  Array.isArray(title)
    ? title.map((t) => (t.blue ? `<span class="b">${t.text}</span>` : t.text)).join('')
    : title

const card = (c) => `<div class="card"><div class="ci">${ic(c.icon, 24)}</div><div><div class="ct">${c.title}</div>${c.sub ? `<div class="cs">${c.sub}</div>` : ''}</div></div>`

const renderers = {
  cover(s) {
    const inner = `
      ${s.subtitle ? `<div class="para" style="margin-top:44px">${s.subtitle}</div>` : ''}
      ${s.accent ? `<div class="accent">${s.accent.replace('->', `<span style="font-weight:500">&#8594;</span>`)}</div>` : ''}`
    return chrome({ num: s.num, eyebrow: s.eyebrow, h1: titleHtml(s.title), h1size: s.titleSize || 120, midClass: `cover-mid${s.upper ? ' upper' : ''}`, inner, foot: s.foot, foottag: s.foottag })
  },
  statement(s) {
    const paras = (s.paras || []).map((p) => `<div class="para${p.lede ? ' lede' : ''}">${p.text}</div>`).join('')
    const cards = s.cards
      ? `<div style="margin-top:40px"><div class="section-label">${s.cardsLabel || ''}</div><div class="cards2">${s.cards.map(card).join('')}</div></div>`
      : ''
    const inner = `${s.subtitle ? `<div class="subh" style="font-size:30px">${s.subtitle}</div>` : ''}${paras}${cards}`
    return chrome({ num: s.num, eyebrow: s.eyebrow, h1: titleHtml(s.title), h1size: s.titleSize || 66, inner, foot: s.foot, foottag: s.foottag })
  },
  flow(s) {
    const wide = s.wide // full-width nodes + inline layer tag
    const node = (n) =>
      `<div class="fnode${n.hl ? ' hl' : ''}"><div class="fi">${ic(n.icon, 22)}</div><div style="flex:1"><div class="fl">${n.label}</div>${n.sub ? `<div class="fsub">${n.sub}</div>` : ''}</div>${n.tag ? `<div class="flabel" style="font-size:15px">${n.tag}</div>` : ''}</div>`
    let flow = `<div class="flow${wide ? ' f4' : ''}" style="margin-top:${s.subtitle ? 30 : 8}px">`
    s.steps.forEach((n, i) => {
      if (wide) flow += node(n)
      else flow += `<div class="frow">${node(n)}${n.annot ? `<div class="fdots"></div><div class="fann">${greenCheck}<span>${n.annot}</span></div>` : ''}</div>`
      if (i < s.steps.length - 1) flow += '<div class="fconn"></div>'
    })
    flow += '</div>'
    const inner = `${s.subtitle ? `<div class="subh" style="font-size:30px;margin-top:8px">${s.subtitle}</div>` : ''}${flow}`
    return chrome({ num: s.num, eyebrow: s.eyebrow, h1: titleHtml(s.title), h1size: s.titleSize || 66, inner, foot: s.foot, foottag: s.foottag })
  },
  checklist(s) {
    const cols = s.cols || 2
    const chks = s.items.map((t) => `<div class="chk"><span class="cc">${ic('checkCircle', 24, A)}</span><span>${t}</span></div>`).join('')
    const inner = `<div class="chks" style="grid-template-columns:repeat(${cols},1fr);margin-top:22px">${chks}</div>`
    return chrome({ num: s.num, eyebrow: s.eyebrow, h1: titleHtml(s.title), h1size: s.titleSize || 76, inner, foot: s.foot, foottag: s.foottag })
  },
  featureCards(s) {
    const sec = (c) => `<div class="seccard"><div class="si">${ic(c.icon, 26)}</div><div><h3>${c.title}</h3><ul>${c.items.map((i) => `<li>${i}</li>`).join('')}</ul></div></div>`
    const inner = `${s.subtitle ? `<div class="subh" style="font-size:27px">${s.subtitle}</div>` : ''}${s.cards.map(sec).join('')}`
    return chrome({ num: s.num, eyebrow: s.eyebrow, h1: titleHtml(s.title), h1size: s.titleSize || 70, inner, foot: s.foot, foottag: s.foottag })
  },
  grid(s) {
    const cols = s.cols || 4
    const cells = s.cells.map((c) => `<div class="tcell"><div class="tmono">${c.mono}</div><div class="tname">${c.name}</div></div>`).join('')
    const inner = `<div class="tgrid" style="grid-template-columns:repeat(${cols},1fr);margin-top:26px">${cells}</div>`
    return chrome({ num: s.num, eyebrow: s.eyebrow, h1: titleHtml(s.title), h1size: s.titleSize || 76, inner, foot: s.foot, foottag: s.foottag })
  },
  results(s) {
    const pill = (p) => `<div class="pill"><div class="pi">${ic(p.icon, 24)}</div><div class="pt">${p.title}</div></div>`
    const paras = (s.paras || []).map((p) => `<div class="para">${p.text}</div>`).join('')
    const cta = s.cta ? `<div class="cta"><div><div class="ch">${s.cta.title}</div><div class="cu">${s.cta.url}</div></div><div class="carw">${ic('arrow', 34, A)}</div></div>` : ''
    const inner = `${paras}<div class="pills" style="grid-template-columns:repeat(${s.pills.length},1fr);margin-top:34px">${s.pills.map(pill).join('')}</div>${cta}`
    return chrome({ num: s.num, eyebrow: s.eyebrow, h1: titleHtml(s.title), h1size: s.titleSize || 62, inner, foot: s.foot, foottag: s.foottag })
  },
  closing(s) {
    const paras = (s.paras || []).map((p) => `<div class="para" style="margin-top:${p.first ? 8 : 22}px">${p.text}</div>`).join('')
    const inner = `${paras}<div class="close"><div class="clock"><div class="cchip"><img src="data:image/png;base64,${logo}"></div>${wordmark('cwm')}</div>${s.tagline ? `<div class="ctag">${s.tagline}</div>` : ''}${s.url ? `<div class="curl">${s.url}</div>` : ''}</div>`
    return chrome({ num: s.num, eyebrow: s.eyebrow, h1: titleHtml(s.title), h1size: s.titleSize || 66, inner })
  },
}

/* Build a single slide's full HTML document. `num` is auto-filled from index. */
export function slideHtml(slide) {
  const fn = renderers[slide.type]
  if (!fn) throw new Error(`Unknown slide type: ${slide.type}`)
  const body = fn(slide)
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`
}

export const util = { titleHtml, card }
