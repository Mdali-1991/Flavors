# Flavours Pan Asian Food 🔥

**A dynamic, interactive front-end web application** for Flavours Pan Asian Food, a real Pan Asian restaurant at 9 Pier Road, London E16 2JJ. Built as the assessed project for **Unit 2: Interactive Front End Development** of the Gateway Qualifications Level 5 Diploma in Web Application Development.

![Status](https://img.shields.io/badge/status-complete-brightgreen) ![HTML5](https://img.shields.io/badge/HTML5-validated-orange) ![CSS3](https://img.shields.io/badge/CSS3-validated-blue) ![Responsive](https://img.shields.io/badge/design-responsive-purple) ![Accessibility](https://img.shields.io/badge/a11y-WCAG%20AA-success)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Purpose & Value](#purpose--value)
3. [User Stories](#user-stories)
4. [UX Design](#ux-design)
5. [Features](#features)
6. [Technologies Used](#technologies-used)
7. [File Structure](#file-structure)
8. [Validation & Testing](#validation--testing)
9. [Bugs Found & Fixed](#bugs-found--fixed)
10. [Known Limitations & Future Improvements](#known-limitations--future-improvements)
11. [Deployment](#deployment)
12. [Mapping to Unit 2: Interactive Front End Development](#mapping-to-unit-2-interactive-front-end-development)
13. [Use of AI Assistance](#use-of-ai-assistance)
14. [Credits & Attribution](#credits--attribution)

---

## Project Overview

Flavours Pan Asian Food is a single-page, mobile-first web application that brings a real East London restaurant's full menu, ordering system and table-booking service online. It is built entirely with HTML5, CSS3 and vanilla JavaScript (ES6+), with no build tools or backend server required, so it can be hosted directly on a static platform such as GitHub Pages.

The project demonstrates the skills required for Unit 2 of the Gateway Qualifications Level 5 Diploma in Web Application Development: a dynamic, accessible, fully tested and documented interactive front end, deployed to a cloud platform and developed under version control.

---

## Purpose & Value

Flavours Pan Asian Food is a real restaurant in East London offering halal-certified Thai, Malaysian, Indonesian, and wider Pan Asian cuisine. The site provides:

- A fully interactive digital menu with 11 categories and 60+ items
- A protein-based pricing system for Noodles, Curries and Rice, letting customers pick a protein from a dropdown and see live, accurate pricing before they order
- An online ordering system with cart management, order-type selection, and Stripe card payment integration
- A table booking form
- Location, contact, and opening-hours information
- A polished, accessible, mobile-first user interface

**Target audience:** Existing and potential customers of Flavours Pan Asian Food in the London E16 area, as well as anyone exploring Pan Asian dining options in London.

**Value to the business:** the site reduces phone-order friction, lets customers self-serve a fully priced order at any time of day, and presents the restaurant's brand and menu professionally to first-time visitors who arrive via search or social media.

---

## User Stories

| As a… | I want to… | So that… |
|--------|-----------|----------|
| customer | browse the full menu by category | I can plan what to order |
| customer | choose a protein (chicken, beef, prawn, veg, tofu) for noodle, curry and rice dishes and see the correct price update instantly | I always know exactly what I will be charged before I add an item to my cart |
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

CSS media queries at `480px`, `600px`, `768px`, and `900px` breakpoints ensure the layout adapts across all device sizes. The navigation collapses to a hamburger menu on mobile, and the protein dropdown (described below) stacks vertically below 600px so it remains fully usable on small screens.

### Accessibility

- All interactive elements have `aria-label` attributes, and these labels update dynamically (e.g. when a protein is reselected) so assistive technology always announces the current price.
- Menu cards rendered via JavaScript include `role="button"` and `tabindex="0"` so keyboard users can add items to the cart with Enter or Space.
- The protein dropdown is a native `<select>` element with an associated `<label for>`, so it is fully operable by keyboard and screen reader without any custom scripting.
- A live price indicator next to the dropdown uses `aria-live="polite"` so screen reader users are told when the price changes, without the announcement being disruptive.
- The `<nav>` hamburger button has `aria-label="Toggle menu"`.
- The embedded map `<iframe>` has a descriptive `title` attribute.
- Image `alt` attributes are present on all images.
- Colour contrast between `--text` (`#F5F0E8`) and `--dark` (`#0D0D0D`) exceeds the WCAG AA ratio.
- Focus styles are applied to all interactive elements via CSS `:focus` rules.

### Interaction Feedback

- A toast notification confirms each item added to the cart, and a separate toast confirms whenever the protein dropdown changes the price for a category.
- The cart total updates in real time.
- Form validation messages appear inline in the payment area and booking form.
- The floating "Order Now" button appears after the user scrolls 400px down the page.
- A page loader runs on initial load.

### User Control

- The hero slider can be navigated manually via previous/next buttons and dot indicators.
- The automatic slider timer resets when the user interacts.
- The protein dropdown gives the customer full control over how noodle, curry and rice dishes are priced, rather than forcing them to read a static reference table and do the maths themselves.
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

### Protein Selector Dropdown (Noodles, Curries & Rice)

Earlier versions of the site displayed protein pricing as a static, read-only table beside the menu (Protein / Price columns). This has been replaced with an interactive **dropdown selector**:

- A `<select>` control sits above each priced category, listing every protein option (Chicken, Beef, Prawn, Veg, Tofu) together with its price.
- Choosing a protein instantly updates the price shown on every dish card in that category, the "current price" indicator next to the dropdown, and the accessible label read out to screen readers.
- Clicking "+ Add" (or pressing Enter/Space on a focused card) adds the dish to the cart at the price for the protein currently selected, with the protein recorded in the cart line item (e.g. *"Pad Thai (Beef)"*).
- This turns a passive reference table into a genuine piece of interactivity that lets the user initiate and control an action and receive immediate feedback, directly addressing AC1.2 and Merit criterion M(i) of Unit 2 (see the [mapping table](#mapping-to-unit-2-interactive-front-end-development) below).

### Cart & Ordering

- Items added via any menu card update the cart in the `#order` section instantly.
- Duplicate items (including the same dish with the same protein) increment quantity rather than creating new rows.
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

`404.html` provides a branded not-found page that automatically redirects to `index.html` using `window.location.replace()` after a 5-second countdown. `replace()` overwrites the history entry so the user cannot press Back to return to the 404 page. The manual "Back to Flavours" button also uses `replace()`. This satisfies Merit criterion M(ii) of Unit 2.

### Animations & Polish

- GSAP `ScrollTrigger` animates the stats counters on scroll.
- `.reveal` elements use `IntersectionObserver` to fade/slide in when they enter the viewport.
- 3D tilt effect on menu cards (mouse proximity).
- Scroll-to-top button (bottom-left, appears after 600px).

---

## Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 (semantic markup) | Structure |
| CSS3 (custom properties, grid, flexbox, media queries) | Styling & layout |
| JavaScript (ES6+) | Interactivity, DOM manipulation, validation, live pricing |
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
├── 404.html           # Not-found page with auto-redirect
├── style.css          # All custom styles (external, linked in <head>)
├── script.js           # All custom JavaScript (external, linked before </body>)
└── README.md          # This file
```

- CSS is placed in an external file linked in the `<head>` element (Unit 2, AC2.5).
- Non-trivial JavaScript is placed in an external file linked at the bottom of `<body>` (Unit 2, AC2.5).
- Files are named in lower-case with no spaces (cross-platform compatibility).

---

## Validation & Testing

### Explanation of Testing Approach (Unit 2, AC3.1)

Two complementary testing approaches were considered for this project:

- **Manual testing** — a person works through each feature by hand against an expected outcome, checking the actual result. This was chosen as the primary method here because the application is a relatively small, DOM-driven single page with no build pipeline; manual testing gives fast, direct feedback on visual and interactive behaviour (such as whether a dropdown correctly re-prices a menu card) without the overhead of setting up a JavaScript test runner.
- **Automated testing** — code-driven test scripts (e.g. with Jest or Cypress) repeatedly execute the same checks. This is generally preferred for larger codebases or where regressions need to be caught continuously, but was judged disproportionate for a static front-end project of this size and was not implemented; this trade-off is recorded as a known limitation below.

### HTML Validation

Validated using the [W3C Markup Validation Service](https://validator.w3.org/). No errors or warnings in the final deployed version.

### CSS Validation

Validated using the [W3C CSS Validation Service (Jigsaw)](https://jigsaw.w3.org/css-validator/). No errors. Vendor-prefixed properties (`-webkit-background-clip`) produce expected informational notices only.

### JavaScript Linting

Checked with [JSHint](https://jshint.com/). No major issues. Optional chaining (`?.`) requires `esversion: 11` to be set in JSHint options (`/* jshint esversion: 11 */`).

### Manual Testing Procedure

| Test | Steps | Expected | Result |
|------|-------|----------|--------|
| Navigation links | Click each nav link | Smooth-scroll to section | ✅ Pass |
| Hamburger menu | Resize to < 768px, click hamburger | Menu opens/closes | ✅ Pass |
| Hero slider auto | Wait 5.5s | Slide advances | ✅ Pass |
| Hero slider manual | Click ← / → buttons and dots | Slide changes, timer resets | ✅ Pass |
| Menu tabs | Click each category tab | Correct panel shows, others hidden | ✅ Pass |
| Protein dropdown — price update | Open Noodles tab, change dropdown to each protein in turn | Every dish card price and the "current price" label update to the matching amount immediately | ✅ Pass |
| Protein dropdown — add to cart | Select "Beef" on Noodles, click "+ Add" on Pad Thai | Cart shows "Pad Thai (Beef)" at £12.95 | ✅ Pass |
| Protein dropdown — repeat for Curries and Rice | Repeat the two tests above on the Curries and Rice tabs | Same correct behaviour in both categories | ✅ Pass |
| Protein dropdown — keyboard access | Tab to the dropdown, use arrow keys/Enter to change selection | Selection changes and prices update without a mouse | ✅ Pass |
| Add to cart | Click "+ Add" on a menu item | Item appears in cart, total updates, toast shown | ✅ Pass |
| Duplicate items | Add same item (and same protein, where applicable) twice | Quantity increments | ✅ Pass |
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
| 404 redirect | Navigate to `/nonexistent.html` | 404 page shown, auto-redirects in 5s | ✅ Pass |
| 404 back-button prevention | After redirect, press Back | Lands on `index.html`, not `404.html` | ✅ Pass |
| Responsiveness – mobile (375px) | Chrome DevTools device toolbar | Layout stacks, text readable, no overflow | ✅ Pass |
| Responsiveness – tablet (768px) | Chrome DevTools device toolbar | Two-column grids collapse appropriately, protein dropdown remains usable | ✅ Pass |
| External links | Click social media links | Open in new tab | ✅ Pass |
| No broken internal links | Click all anchor links | All resolve | ✅ Pass |
| Loader | Hard refresh page | Loader shows then fades after ~1.6s | ✅ Pass |
| Scroll-to-top button | Scroll > 600px, click ↑ button | Page scrolls to top | ✅ Pass |

---

## Bugs Found & Fixed

| # | Bug | Fix | Status |
|---|-----|-----|--------|
| 1 | Live Stripe publishable key was hardcoded in `script.js` | Replaced with a placeholder test key and added an inline comment explaining the secure deployment pattern | ✅ Fixed |
| 2 | Menu card `<div>` elements had `onclick` but were not keyboard-accessible (no `tabindex`, no `role`) | Added `role="button"`, `tabindex="0"`, `aria-label`, and `onkeydown` handler (Enter / Space) to all dynamically generated menu cards and drink items | ✅ Fixed |
| 3 | Order validation did not check email format | Added regex pattern check `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | ✅ Fixed |
| 4 | Delivery address was not required when order type was "delivery" | Added conditional address validation inside `validateOrder()` | ✅ Fixed |
| 5 | No 404 page existed — navigating to a bad URL showed a generic browser error | Created `404.html` with auto-redirect via `window.location.replace()` | ✅ Fixed |
| 6 | The Protein / Price table for Noodles, Curries and Rice was a static, read-only `<table>` — it told the customer the price for each protein but gave them no way to actually act on that information from the menu itself, and the price shown on every dish card was fixed regardless of protein | Replaced the static table with an accessible `<select>` dropdown per category. Selecting a protein now live-updates every dish card's displayed price and `aria-label`, and the price added to the cart is read from the dropdown at the moment "+ Add" is clicked, so the customer always pays the correct, currently-selected price | ✅ Fixed |

---

## Known Limitations & Future Improvements

- **Stripe payments are simulated.** A real Stripe payment requires a server-side backend to create a `PaymentIntent` and return a `client_secret`. The current implementation shows a confirmation message rather than charging a card. Full production integration requires a Node.js / Python / etc. server endpoint.
- **Order data is not persisted.** Orders are held in a JavaScript array for the session only; refreshing the page clears the cart.
- **Booking form does not send emails.** The form simulates a booking confirmation. Production deployment would require a backend (e.g. EmailJS, a serverless function, or a form service).
- **No automated test suite.** Testing is currently manual only (see [Validation & Testing](#validation--testing)); a future iteration could add Jest unit tests for the pricing logic (`getProteinPrice`, `parsePrice`) and Cypress end-to-end tests for the cart flow.
- **Protein pricing is category-wide, not per-dish.** All dishes within Noodles, Curries or Rice currently share one protein price list; a future version could allow individual dishes to override the category price (e.g. a premium noodle dish priced slightly higher) without restructuring the data model.

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

## Mapping to Unit 2: Interactive Front End Development

This project was developed specifically against the assessment criteria for **Unit 2: Interactive Front End Development** of the Gateway Qualifications Level 5 Diploma in Web Application Development (Unit Number A/650/3526). The table below maps each Learning Outcome to where it is evidenced in this project, to make assessment straightforward.

| LO | Assessment Criteria (summary) | Where evidenced in this project |
|----|-------------------------------|----------------------------------|
| LO1 | Design, develop and implement a dynamic front end using HTML, CSS and JavaScript, meeting accessibility guidelines and UX principles (AC1.1–1.5) | Whole site structure, responsive layout, hero/menu/order/booking sections, and the new protein dropdown (AC1.2: lets the user initiate and control an action and receive feedback) |
| LO1 — Merit M(i) | Design following UX principles, accessible, easy to navigate, intuitive | Fixed nav, category tabs, accessible dropdown with `<label for>`, consistent layout |
| LO2 | Implement front end interactivity using JavaScript (AC2.1–2.9) | `buildMenu()`, `addToCart()`, `getProteinPrice()`, `updateProteinPricing()`, `addProteinItemToCart()` in `script.js`; external CSS/JS files; descriptive file names; code organised in commented sections |
| LO2 — Merit M(ii) | Non-existent pages redirect to the main page without the browser back button | `404.html`, using `window.location.replace()` |
| LO3 | Test the application through development, implementation and deployment (AC3.1–3.5) | [Validation & Testing](#validation--testing) section, including the rationale for choosing manual over automated testing, and the manual test table |
| LO4 | Deploy to a cloud platform using Git/GitHub (AC4.1–4.3) | [Deployment](#deployment) section; GitHub Pages hosting; Git used throughout development |
| LO4 — Merit M(iii) | Commit often, in small, well-defined, clearly described commits | Demonstrated in the project's commit history (see the repository's commit log) |
| LO5 | Document the development process through version control and a README (AC5.1–5.4) | This README, written in consistent markdown, separating custom code from third-party libraries (see [Credits & Attribution](#credits--attribution)) |
| LO5 — Merit M(iv)–M(vii) | Clear rationale, UX design documentation, full bug/testing evaluation, deployment documentation | [Purpose & Value](#purpose--value), [UX Design](#ux-design), [Bugs Found & Fixed](#bugs-found--fixed), [Deployment](#deployment) |

---

## Use of AI Assistance

In the interests of academic integrity and transparency, this project discloses its use of AI tools:

- An AI assistant (Claude, by Anthropic) was used to help **review and refactor the protein pricing feature** (replacing the static Protein/Price table with the interactive dropdown selector described above), and to **help restructure and expand this README** — including adding the [Mapping to Unit 2](#mapping-to-unit-2-interactive-front-end-development) table and tidying its formatting.
- AI assistance was used as a development and documentation aid, in the same way a learner might use a linter, a style guide, or a peer review: suggestions were reviewed, tested, and adapted before being accepted into the project. All resulting code was checked for correctness (syntax validation, manual testing per the table above) before being committed.
- No AI tool was used to generate the restaurant's menu data, pricing, branding, or photography, all of which reflect the real Flavours Pan Asian Food business.
- Learners submitting work based on this template should check their own centre's and awarding organisation's policy on disclosing AI assistance, and adjust this section to accurately describe their own use, since requirements vary by qualification and by centre.

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

All HTML, CSS, and JavaScript in `index.html`, `style.css`, `script.js`, and `404.html` was written by the project author, with the AI-assisted refinements disclosed in [Use of AI Assistance](#use-of-ai-assistance) above. No code was copied from tutorials or external sources beyond the documented CDN libraries above.

---

*© 2025 Flavours Pan Asian Food · 9 Pier Road, London E16 2JJ · 020 3883 9233*
