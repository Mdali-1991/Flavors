"""
Browser retest for the tutor-feedback fixes (October 2026).

Drives the real page in headless Chromium with Playwright and checks each
corrected behaviour. Results are recorded in README.md → Testing → Retest.

Setup (once):   pip install playwright && python -m playwright install chromium
Run:            python -m http.server 8765        (in the project folder)
                python browser_retest.py     (in a second terminal)

External CDNs (fonts, images, animation libraries) are blocked during the run;
the site is designed to work without them.
"""

import datetime as dt
import sys
from zoneinfo import ZoneInfo

from playwright.sync_api import sync_playwright

BASE = "http://localhost:8765/"
RESULTS = []

def check(test_id, name, condition, detail=""):
    RESULTS.append((test_id, name, bool(condition), detail))


def london_today():
    # Real Europe/London time zone, so BST/GMT changes are handled
    return dt.datetime.now(ZoneInfo("Europe/London")).date()


def fill_booking(page, name="Jane Smith", phone="07700 900123", date=None,
                 time="19:30", guests="2"):
    page.fill("#bName", name)
    page.fill("#bPhone", phone)
    page.fill("#bDate", date or (london_today() + dt.timedelta(days=3)).isoformat())
    page.fill("#bTime", time)
    page.select_option("#bGuests", guests)


def add_item(page, tab, label_contains, times=1):
    page.click(f'.tab-btn[data-cat="{tab}"]')
    for _ in range(times):
        page.click(f'#panel-{tab} .add-to-cart[aria-label*="{label_contains}"]')


def clear_cart(page):
    while page.locator(".cart-item-remove").count():
        page.locator(".cart-item-remove").first.click()


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(timezone_id="Europe/London", viewport={"width": 1280, "height": 900})
        # External CDNs are not needed for these checks
        ctx.route("**/*", lambda r: r.abort() if "localhost" not in r.request.url else r.continue_())
        page = ctx.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(BASE, wait_until="load")
        page.wait_for_selector(".menu-card")
        page.wait_for_timeout(1800)  # loader fades out

        # ── BOOKING ──
        page.click("#bookingForm button[type=submit]")
        msg = page.inner_text("#bookingMsg")
        invalid = page.locator("#bookingForm [aria-invalid=true]").count()
        focused = page.evaluate("document.activeElement.id")
        check("R1", "Empty booking form is rejected",
              "DEMO booking" not in msg and invalid == 5 and focused == "bName",
              f"{invalid} fields flagged, focus on #{focused}, message: {msg!r}")

        fill_booking(page, phone="12345")
        page.click("#bookingForm button[type=submit]")
        check("R2", "Invalid phone rejected",
              page.get_attribute("#bPhone", "aria-invalid") == "true"
              and page.locator("#bookingForm [aria-invalid=true]").count() == 1,
              page.inner_text("#bPhone-error"))

        fill_booking(page, date=(london_today() - dt.timedelta(days=1)).isoformat())
        page.click("#bookingForm button[type=submit]")
        check("R3", "Past date rejected", page.get_attribute("#bDate", "aria-invalid") == "true",
              page.inner_text("#bDate-error"))

        fill_booking(page, date=(london_today() + dt.timedelta(days=120)).isoformat())
        page.click("#bookingForm button[type=submit]")
        check("R4", "Date over 90 days ahead rejected",
              page.get_attribute("#bDate", "aria-invalid") == "true", page.inner_text("#bDate-error"))

        fill_booking(page, time="16:00")
        page.click("#bookingForm button[type=submit]")
        before_open = page.get_attribute("#bTime", "aria-invalid") == "true"
        fill_booking(page, time="23:00")
        page.click("#bookingForm button[type=submit]")
        after_last = page.get_attribute("#bTime", "aria-invalid") == "true"
        check("R5", "Times outside 16:30–22:30 rejected", before_open and after_last,
              page.inner_text("#bTime-error"))

        fill_booking(page, guests="")
        page.click("#bookingForm button[type=submit]")
        check("R6", "Guests must be chosen", page.get_attribute("#bGuests", "aria-invalid") == "true",
              page.inner_text("#bGuests-error"))

        page.select_option("#bGuests", "2")
        page.focus("#bName")
        page.focus("#bGuests")
        page.dispatch_event("#bGuests", "change")
        check("R7", "Error clears once the field is corrected",
              page.get_attribute("#bGuests", "aria-invalid") is None)

        fill_booking(page)
        page.click("#bookingForm button[type=submit]")
        msg = page.inner_text("#bookingMsg")
        check("R8", "Valid booking shows a DEMO confirmation and resets the form",
              "DEMO booking request" in msg and "no table has been reserved" in msg
              and page.input_value("#bName") == "", msg.replace("\n", " "))

        # ── ORDER PRICING ──
        page.select_option("#orderType", "collection")
        add_item(page, "noodles", "Pad Thai (Chicken)", times=2)
        sub = page.inner_text("#cartSubtotal")
        disc = page.inner_text("#cartDiscount")
        total = page.inner_text("#cartTotal")
        check("R9", "Collection £21.90 → £19.71",
              sub == "£21.90" and disc == "-£2.19" and total == "£19.71"
              and page.is_visible("#discountRow"),
              f"subtotal {sub}, discount {disc}, total {total}")

        page.select_option("#orderType", "delivery")
        check("R10", "Delivery £21.90 → free delivery, £21.90",
              page.inner_text("#cartDelivery") == "Free" and page.inner_text("#cartTotal") == "£21.90"
              and not page.is_visible("#discountRow"),
              f"delivery {page.inner_text('#cartDelivery')}, total {page.inner_text('#cartTotal')}")

        clear_cart(page)
        add_item(page, "noodles", "Pad Thai (Chicken)")
        check("R11", "Delivery £10.95 → £2 charge, £12.95",
              page.inner_text("#cartDelivery") == "£2.00" and page.inner_text("#cartTotal") == "£12.95",
              page.inner_text("#cartNotes"))

        clear_cart(page)
        add_item(page, "appetisers", "Tofu Mari")
        page.click("#cashPayBtn")
        check("R12", "Delivery under £10 minimum is blocked",
              "minimum spend" in page.inner_text("#paymentMessage"),
              page.inner_text("#paymentMessage"))

        clear_cart(page)
        add_item(page, "noodles", "Pad Thai (Chicken)")
        page.click("#cashPayBtn")
        flagged = page.locator("#orderForm [aria-invalid=true]").count()
        check("R13", "Delivery order needs name, phone, email, address, postcode, 3-mile tick",
              flagged == 6 and "DEMO" not in page.inner_text("#paymentMessage"), f"{flagged} fields flagged")

        page.select_option("#orderType", "collection")
        clear_cart(page)
        add_item(page, "noodles", "Pad Thai (Chicken)", times=2)
        page.fill("#custName", "Jane Smith")
        page.fill("#custPhone", "07700 900123")
        page.fill("#custEmail", "jane@example.com")
        page.click("#cashPayBtn")
        pm = page.inner_text("#paymentMessage")
        check("R14", "Cash collection confirmation shows £19.71 and says it is a demo",
              "£19.71" in pm and "DEMO" in pm and "No payment has been taken" in pm
              and page.inner_text("#cartTotal") == "£0.00", pm)

        add_item(page, "noodles", "Pad Thai (Chicken)", times=2)
        page.fill("#custName", "Jane Smith")
        page.fill("#custPhone", "07700 900123")
        page.fill("#custEmail", "jane@example.com")
        # Card form: the user's case (partial number, no expiry/CVC) must show errors
        page.set_viewport_size({"width": 390, "height": 760})   # phone-sized
        page.click("#cardPayBtn")
        form_open = page.is_visible("#cardForm") and page.evaluate("document.activeElement.id") == "cardNumber"
        page.fill("#cardNumber", "424242-4242")
        page.click("#confirmPayBtn")
        partial_flagged = page.locator("#cardForm [aria-invalid=true]").count()
        page.fill("#cardNumber", "4111 1111 1111 1111")
        page.fill("#cardExpiry", "12/30")
        page.fill("#cardCvc", "123")
        page.click("#confirmPayBtn")
        real_card_msg = page.inner_text("#cardNumber-error") if page.is_visible("#cardNumber-error") else ""
        page.fill("#cardNumber", "")
        page.type("#cardNumber", "4242424242424242")
        formatted = page.input_value("#cardNumber")
        page.click("#confirmPayBtn")
        page.wait_for_timeout(700)
        pm = page.inner_text("#paymentMessage")
        in_view = page.evaluate("""(() => { const r = document.getElementById('paymentMessage').getBoundingClientRect();
            return r.top >= 0 && r.bottom <= window.innerHeight; })()""")
        check("R15", "Simulated card: errors for incomplete or real cards; test card confirms, message in view on a phone",
              form_open and partial_flagged == 3 and "real cards are not accepted" in real_card_msg
              and formatted == "4242 4242 4242 4242" and "simulated card payment" in pm and "£19.71" in pm
              and in_view and page.is_hidden("#cardForm"),
              f"partial number → {partial_flagged} fields flagged; 4111… → {real_card_msg!r}; then: {pm}")
        page.set_viewport_size({"width": 1280, "height": 900})

        # ── ACCESSIBILITY & CODE ORGANISATION ──
        nested = page.evaluate("""document.querySelectorAll(
            '[role=button] button, button button, a button, button a, [role=button] a, [tabindex] button'
        ).length""")
        card_roles = page.evaluate("document.querySelectorAll('.menu-card[role], .menu-card[tabindex]').length")
        check("R16", "No nested interactive controls", nested == 0 and card_roles == 0,
              f"nested={nested}, cards with role/tabindex={card_roles}")

        page.focus("#cartItems")
        page.click(".tab-btn[data-cat=desserts]")
        page.focus("#panel-desserts .add-to-cart >> nth=0")
        page.keyboard.press("Enter")
        page.keyboard.press("Space")
        check("R17", "Keyboard: Enter and Space on the Add button add items",
              "2×" in page.inner_text("#cartItems"))

        page.mouse.move(5, 5)
        page.evaluate("window.scrollTo(0, 3000)")
        page.click("#slidePause")
        pressed = page.get_attribute("#slidePause", "aria-pressed")
        marquee_paused = "paused" in (page.get_attribute("#marquee", "class") or "")
        start = page.evaluate("[...document.querySelectorAll('.hero-slide')].findIndex(s => s.classList.contains('active'))")
        page.mouse.move(5, 5)
        page.wait_for_timeout(6500)
        later = page.evaluate("[...document.querySelectorAll('.hero-slide')].findIndex(s => s.classList.contains('active'))")
        check("R18", "Pause button stops the slideshow and banner",
              pressed == "true" and marquee_paused and start == later
              and page.inner_text("#slidePause .slide-pause-text") == "Play",
              f"aria-pressed={pressed}, slide {start}→{later}")

        page.click("#slidePause")
        # Move focus and pointer out of the hero: the slideshow intentionally
        # waits while keyboard focus or the mouse is inside it.
        page.evaluate("document.activeElement.blur()")
        page.mouse.move(5, 890)
        page.wait_for_timeout(6200)
        moved = page.evaluate("[...document.querySelectorAll('.hero-slide')].findIndex(s => s.classList.contains('active'))")
        check("R19", "Play resumes auto-advance", moved != later, f"slide {later}→{moved}")

        inert = page.evaluate("[...document.querySelectorAll('.hero-slide:not(.active)')].every(s => s.inert)")
        check("R20", "Hidden slides are inert (not reachable with Tab)", inert)

        rm = browser.new_context(reduced_motion="reduce")
        rm.route("**/*", lambda r: r.abort() if "localhost" not in r.request.url else r.continue_())
        rp = rm.new_page()
        rp.goto(BASE, wait_until="load")
        check("R21", "Reduced-motion users start with the slideshow paused",
              rp.get_attribute("#slidePause", "aria-pressed") == "true")
        rm.close()

        h1 = page.evaluate("document.querySelectorAll('h1').length")
        check("R22", "Exactly one <h1> on the page", h1 == 1, f"{h1} h1 elements")

        demo = page.is_visible("#demoNotice") and page.locator(".demo-note").count() >= 3
        check("R23", "Demo/simulation notices visible (banner, order, card, booking)", demo)

        # Imitate Netlify: serve 404.html (status 404) at a missing nested URL
        p404 = ctx.new_page()
        with open("404.html", encoding="utf-8") as fh:
            body_404 = fh.read()
        p404.route("**/no/such/page.html",
                   lambda r: r.fulfill(status=404, body=body_404, content_type="text/html"))
        p404.goto(BASE + "no/such/page.html")
        status_ok = p404.evaluate("getComputedStyle(document.querySelector('.btn-home')).borderRadius") == "50px"
        check("R24", "404 page styles load from external CSS on a nested URL", status_ok)

        kb = ctx.new_page()
        kb.goto(BASE, wait_until="load")
        kb.wait_for_selector(".menu-card")
        kb.wait_for_timeout(1500)
        first, stops, weak = None, 0, []
        for _ in range(250):
            kb.keyboard.press("Tab")
            kb.wait_for_timeout(400)  # focus rings fade in over 0.35 s
            r = kb.evaluate("""(() => { const e = document.activeElement; const cs = getComputedStyle(e);
                return [e.tagName, e.id || String(e.className).split(' ')[0], cs.outlineStyle, parseFloat(cs.outlineWidth)]; })()""")
            if r[0] == "BODY":
                break
            stops += 1
            first = first or r[1]
            # The Google Maps iframe moves focus into Google's own page, which shows its own focus marker
            if r[1] != "map-frame" and not (r[2] != "none" and r[3] >= 2):
                weak.append(r[1])
        check("R26", "Keyboard: skip link first; every control shows a 2px focus ring",
              first == "skip-link" and not weak, f"{stops} tab stops, without ring: {weak or 'none'}")

        check("R25", "No JavaScript errors during the run", not errors, "; ".join(errors))
        browser.close()

    width = max(len(n) for _, n, _, _ in RESULTS)
    for tid, name, ok, detail in RESULTS:
        print(f"{tid:<4} {'PASS' if ok else 'FAIL'}  {name:<{width}}  {detail}")
    failed = [r for r in RESULTS if not r[2]]
    print(f"\n{len(RESULTS) - len(failed)}/{len(RESULTS)} passed")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(run())
