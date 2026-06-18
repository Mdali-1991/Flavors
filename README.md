# Flavours Pan Asian Food 🔥

**A dynamic, interactive front-end web application** for Flavours Pan Asian Food, a real Pan Asian restaurant at 9 Pier Road, London E16 2JJ. Built as the assessed project for **Unit 2: Interactive Front End Development** of the Gateway Qualifications Level 5 Diploma in Web Application Development.

---

## Table of Contents

1. [Purpose & Value](#purpose--value)
2. [User Stories](#user-stories)
3. [UX Design](#ux-design)
4. [Features](#features)
5. [Technologies Used](#technologies-used)
6. [File Structure](#file-structure)
7. [Validation & Testing](#validation--testing)
8. [Bugs Found & Fixed](#bugs-found--fixed)
9. [Known Limitations](#known-limitations)
10. [Deployment](#deployment)
11. [Credits & Attribution](#credits--attribution)

---

## Purpose & Value

Flavours Pan Asian Food is a real restaurant in East London offering halal-certified Thai, Malaysian, Indonesian, and wider Pan Asian cuisine. The site provides:

- A fully interactive digital menu with 10+ categories and 50+ items
- An online ordering system with cart management, order-type selection, and Stripe card payment integration
- A table booking form
- Location, contact, and opening-hours information
- A polished, accessible, mobile-first user interface

**Target audience:** Existing and potential customers of Flavours Pan Asian Food in the London E16 area, as well as anyone exploring Pan Asian dining options in London.

---

## User Stories

| As a… | I want to… | So that… |
|--------|-----------|----------|
| customer | browse the full menu by category | I can plan what to order |
| customer | add items to a cart and see a running total | I know how much I will spend |
| customer | choose delivery or collection | I can receive my food the way I prefer |
| customer | pay by card online | I do not need cash |
| customer | book a table | I can guarantee a seat |
| customer | find the restaurant address and phone number | I can contact or visit them |
| mobile user | use the site comfortably on my phone | I can order from anywhere |
| user with a disability | navigate with a keyboard | I do not need a mouse |
| first-time visitor | understand the site's purpose immediately | I know what Flavours offers without reading documentation |

---

## UX Design

### Information Hierarchy

- The hero section leads with a clear brand statement and two prominent calls-to-action (Explore Menu / Order Online).
- Sections are ordered by user journey: hero → about → menu → order → contact → booking.
- Each section has a labelled heading (`section-eyebrow` + `h2`) so structure is immediately clear.

### Responsiveness

CSS media queries at `480px`, `600px`, `768px`, and `900px` breakpoints ensure the layout adapts across all device sizes. The navigation collapses to a hamburger menu on mobile.

### Accessibility

- All interactive elements have `aria-label` attributes.
- Menu cards rendered via JavaScript include `role="button"` and `tabindex="0"` so keyboard users can add items to the cart with Enter or Space.
- The `<nav>` hamburger button has `aria-label="Toggle menu"`.
- The embedded map `<iframe>` has a descriptive `title` attribute.
- Image `alt` attributes are present on all images.
- Colour contrast between `--text` (`#F5F0E8`) and `--dark` (`#0D0D0D`) exceeds WCAG AA ratio.
- Focus styles are applied on all interactive elements via CSS `:focus` rules.

### Interaction Feedback

- A toast notification confirms each item added to the cart.
- The cart total updates in real time.
- Form validation messages appear inline in the payment area and booking form.
- The floating "Order Now" button appears after the user scrolls 400 px down the page.
- A page loader runs on initial load.

### User Control

- The hero slider can be navigated manually via previous/next buttons and dot indicators.
- The automatic slider timer resets when the user interacts.
- Media (particles animation) is subtle and non-intrusive; no audio autoplays.
- Users who navigate to a non-existent URL are served `404.html`, which automatically redirects to the home page using `window.location.replace()` (no browser back-button needed — see [404 page](#404-redirect)).

---

## Features

### Navigation

- Fixed navbar that gains a `scrolled` class (adds background blur/shadow) on scroll.
- Smooth-scroll anchor links to all sections.
- Responsive hamburger menu on mobile; closes on any link click.

### Hero Slider

- Four full-viewport slides with background images from Unsplash.
- Auto-advances every 5.5 seconds; manual control via arrow buttons and dot indicators.
- GSAP entrance animations on the title, tag, and buttons of the active slide.
- `particles.js` ambient particle layer.

### Menu

- All menu data is defined in a JavaScript `MENU` object — no server required.
- 11 categories rendered dynamically by `buildMenu()`.
- Category tabs switch the active panel without page reload.
- Each item card shows an emoji, name, description, dietary tags (🌶 Spicy / 🌱 Veg / ✨ Special), price, and an "+ Add" button.
- Pricing tables for categories with protein options (Noodles, Curries, Rice).

### Cart & Ordering

- Items added via any menu card update the cart in the `#order` section instantly.
- Duplicate items increment quantity rather than creating new rows.
- Individual items can be removed with a ✕ button.
- Running total displayed at all times.
- Order type selector: **Delivery** (shows address field) / **Collection** (hides address field).
- Full input validation: name, phone, email (format-checked), and delivery address (required for delivery orders).
- **Stripe integration:** card payment UI mounts on click via the Stripe.js Elements API.
- **Cash payment:** sends a confirmation message and clears the cart.

> **Note on Stripe keys:** The publishable key in `script.js` is a placeholder test key. For production, inject the real publishable key server-side (e.g. via a `<meta>` tag populated from an environment variable) and never commit live keys to version control.

### Table Booking

- Form fields: name, phone, date (min = today), time (16:30–22:30), guests, special requests.
- On submission, displays a personalised confirmation message with the booking details.
- Form resets after successful submission.

### 404 Redirect

`404.html` provides a branded not-found page that automatically redirects to `index.html` using `window.location.replace()` after a 5-second countdown. `replace()` overwrites the history entry so the user cannot press Back to return to the 404 page. The manual "Back to Flavours" button also uses `replace()`.

### Animations & Polish

- GSAP `ScrollTrigger` animates the stats counters on scroll.
- `.reveal` elements use `IntersectionObserver` to fade/slide in when they enter the viewport.
- 3D tilt effect on menu cards (mouse proximity).
- Scroll-to-top button (bottom-left, appears after 600 px).

---

## Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 (semantic markup) | Structure |
| CSS3 (custom properties, grid, flexbox, media queries) | Styling & layout |
| JavaScript (ES6+) | Interactivity, DOM manipulation, validation |
| [GSAP 3 + ScrollTrigger](https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/) | Animations |
| [particles.js 2](https://cdn.jsdelivr.net/npm/particles.js@2.0.0/) | Hero particle layer |
| [Stripe.js v3](https://js.stripe.com/v3/) | Card payment UI |
| [Google Fonts](https://fonts.google.com) | Playfair Display, Inter, Satisfy |
| [Unsplash](https://unsplash.com) | Royalty-free food photography |

No build tools, frameworks, or npm packages are required. All dependencies are loaded via CDN.

---

## File Structure

```
flavours-pan-asian/
├── index.html        # Main single-page application
├── 404.html          # Not-found page with auto-redirect
├── style.css         # All custom styles (external, linked in <head>)
├── script.js         # All custom JavaScript (external, linked before </body>)
└── README.md         # This file
```

- CSS is placed in an external file linked in the `<head>` element (Unit 2, AC 2.5).
- Non-trivial JavaScript is placed in an external file linked at the bottom of `<body>` (Unit 2, AC 2.5).
- Files are named in lower-case with no spaces (cross-platform compatibility).

---

## Validation & Testing

### HTML Validation

Validated using the [W3C Markup Validation Service](https://validator.w3.org/).  
No errors or warnings in the final deployed version.

### CSS Validation

Validated using the [W3C CSS Validation Service (Jigsaw)](https://jigsaw.w3.org/css-validator/).  
No errors. Vendor-prefixed properties (`-webkit-background-clip`) produce expected informational notices only.

### JavaScript Linting

Checked with [JSHint](https://jshint.com/).  
No major issues. Optional chaining (`?.`) requires `esversion: 11` to be set in JSHint options (`/* jshint esversion: 11 */`).

### Manual Testing Procedure

| Test | Steps | Expected | Result |
|------|-------|----------|--------|
| Navigation links | Click each nav link | Smooth-scroll to section | ✅ Pass |
| Hamburger menu | Resize to < 768 px, click hamburger | Menu opens/closes | ✅ Pass |
| Hero slider auto | Wait 5.5 s | Slide advances | ✅ Pass |
| Hero slider manual | Click ← / → buttons and dots | Slide changes, timer resets | ✅ Pass |
| Menu tabs | Click each category tab | Correct panel shows, others hidden | ✅ Pass |
| Add to cart | Click "+ Add" on a menu item | Item appears in cart, total updates, toast shown | ✅ Pass |
| Duplicate items | Add same item twice | Quantity increments | ✅ Pass |
| Remove from cart | Click ✕ on cart item | Item removed, total recalculates | ✅ Pass |
| Empty cart order | Click "Pay by Card" with empty cart | Error message shown | ✅ Pass |
| Order validation – missing name | Submit order without name | Error message shown | ✅ Pass |
| Order validation – bad email | Enter "notanemail" | Error message shown | ✅ Pass |
| Order validation – delivery, no address | Select delivery, leave address blank | Error message shown | ✅ Pass |
| Delivery / collection toggle | Change order type select | Address field shows/hides | ✅ Pass |
| Cash payment flow | Fill details, click cash pay | Confirmation message, cart clears | ✅ Pass |
| Booking form – past date | Enter date in the past | Browser native validation prevents submit | ✅ Pass |
| Booking form – valid submission | Fill all required fields, submit | Confirmation message with details shown | ✅ Pass |
| Booking form reset | After valid submit | Form clears | ✅ Pass |
| Keyboard navigation – menu cards | Tab to a card, press Enter | Item added to cart | ✅ Pass |
| 404 redirect | Navigate to `/nonexistent.html` | 404 page shown, auto-redirects in 5 s | ✅ Pass |
| 404 back-button prevention | After redirect, press Back | Lands on `index.html`, not `404.html` | ✅ Pass |
| Responsiveness – mobile (375 px) | Chrome DevTools device toolbar | Layout stacks, text readable, no overflow | ✅ Pass |
| Responsiveness – tablet (768 px) | Chrome DevTools device toolbar | Two-column grids collapse appropriately | ✅ Pass |
| External links | Click social media links | Open in new tab | ✅ Pass |
| No broken internal links | Click all anchor links | All resolve | ✅ Pass |
| Loader | Hard refresh page | Loader shows then fades after ~1.6 s | ✅ Pass |
| Scroll-to-top button | Scroll > 600 px, click ↑ button | Page scrolls to top | ✅ Pass |

---

## Bugs Found & Fixed

| # | Bug | Fix | Status |
|---|-----|-----|--------|
| 1 | Live Stripe publishable key was hardcoded in `script.js` | Replaced with a placeholder test key and added an inline comment explaining the secure deployment pattern | ✅ Fixed |
| 2 | Menu card `<div>` elements had `onclick` but were not keyboard-accessible (no `tabindex`, no `role`) | Added `role="button"`, `tabindex="0"`, `aria-label`, and `onkeydown` handler (Enter / Space) to all dynamically generated menu cards and drink items | ✅ Fixed |
| 3 | Order validation did not check email format | Added regex pattern check `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | ✅ Fixed |
| 4 | Delivery address was not required when order type was "delivery" | Added conditional address validation inside `validateOrder()` | ✅ Fixed |
| 5 | No 404 page existed — navigating to a bad URL showed a generic browser error | Created `404.html` with auto-redirect via `window.location.replace()` | ✅ Fixed |

---

## Known Limitations

- **Stripe payments are simulated.** A real Stripe payment requires a server-side backend to create a `PaymentIntent` and return a `client_secret`. The current implementation shows a confirmation message rather than charging a card. Full production integration requires a Node.js / Python / etc. server endpoint.
- **Order data is not persisted.** Orders are held in a JavaScript array for the session only; refreshing the page clears the cart.
- **Booking form does not send emails.** The form simulates a booking confirmation. Production deployment would require a backend (e.g. EmailJS, a serverless function, or a form service).

---

## Deployment

The site is a static front-end application with no build step required.

### GitHub Pages

1. Push all files (`index.html`, `404.html`, `style.css`, `script.js`, `README.md`) to a GitHub repository.
2. In the repository **Settings → Pages**, set the source branch to `main` and folder to `/ (root)`.
3. GitHub Pages will serve `index.html` at `https://<username>.github.io/<repo>/`.
4. GitHub Pages automatically serves `404.html` for unmatched routes.

### Local Preview

Open `index.html` directly in any modern browser. All CDN resources require an internet connection.

---

## Credits & Attribution

### Photography

All images are sourced from [Unsplash](https://unsplash.com) under the free Unsplash licence and are used for educational purposes:

- Hero slide 1: `photo-1569050467447` by Jakub Dziubak
- Hero slide 2: `photo-1455619452474` by Harshil Gudka
- Hero slide 3: `photo-1563245372` by Jakub Kapusnak
- Hero slide 4: `photo-1552566626` by Jay Wennington
- About image: `photo-1567620905732`, `photo-1540189549336`
- Menu category images: various Unsplash contributors

### External Libraries

| Library | Source | Licence |
|---------|--------|---------|
| GSAP 3 + ScrollTrigger | cdnjs.cloudflare.com | Standard GreenSock Licence |
| particles.js 2 | cdn.jsdelivr.net | MIT |
| Stripe.js v3 | js.stripe.com | Stripe Terms of Service |
| Google Fonts (Playfair Display, Inter, Satisfy) | fonts.googleapis.com | SIL Open Font Licence |

### Code

All HTML, CSS, and JavaScript in `index.html`, `style.css`, `script.js`, and `404.html` was written by the project author. No code was copied from tutorials or external sources beyond the documented CDN libraries above.

---

*© 2025 Flavours Pan Asian Food · 9 Pier Road, London E16 2JJ · 020 3883 9233*
