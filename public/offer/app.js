/*
 * Offer personalization. Reads ?shop=<name> from the URL and drops it into every
 * .js-shop slot. Uses textContent (never innerHTML) so a shop name can't inject
 * markup. If no ?shop is present the page keeps its graceful default ("your
 * studio"), so the link is never broken or empty.
 *
 * Usage in outreach:  https://stackcorp.org/offer?shop=Elite%20Wraps
 */
(function () {
  try {
    var raw = new URLSearchParams(window.location.search).get('shop')
    if (!raw) return
    var shop = raw.trim().slice(0, 60) // guard against absurdly long values
    if (!shop) return
    var slots = document.querySelectorAll('.js-shop')
    for (var i = 0; i < slots.length; i++) slots[i].textContent = shop
    // Also personalise the tab + share title, harmless if it fails.
    document.title = shop + ' — a website that books your jobs · StackCorp'
  } catch (e) {
    /* any failure just leaves the default copy in place */
  }
})()
