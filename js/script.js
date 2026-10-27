/* ============================================================
   Flavours Pan Asian Food – script.js

   Page behaviour: menu loading, cart, order form, booking form,
   hero slideshow, navigation and animations.

   Loaded after (see bottom of index.html):
     js/menu-fallback.js  → MENU_FALLBACK (offline copy of menu.json)
     js/order-rules.js    → calculateOrderTotals(), formatPounds()
     js/form-rules.js     → validateBooking(), validateOrderDetails(),
                            toLocalDateString(), BOOKING_RULES

   IMPORTANT: ordering, payment and booking are SIMULATED.
   Nothing is sent to the restaurant and no card is charged.
   Every confirmation message says so (tutor feedback, Oct 2026).
   ============================================================ */

/* global MENU_FALLBACK, calculateOrderTotals, formatPounds,
   validateBooking, validateOrderDetails, toLocalDateString, BOOKING_RULES,
   validateTestCard, gsap, ScrollTrigger, particlesJS */
/* jshint strict: global */
"use strict";

/* ── MODULE-SCOPED STATE ── */

/* cart holds the current order items for the session.
   Each entry: { name: string, price: number (pounds), qty: number } */
let cart = [];

/* fetchedMenuData is populated after a successful fetch of menu.json.
   Event handlers that need pricing data (e.g. protein selects) read
   from this rather than a static constant. */
let fetchedMenuData = null;

/* isFetching prevents a second buildMenu() call starting before the
   first resolves — guards against rapid Retry button clicks. (Bug Log #4) */
let isFetching = false;

/* True when the user's system asks for reduced motion. */
const prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const DEMO_SUFFIX = " This is a demo – nothing has been sent to the restaurant.";

/* ── UTILITY: escape text for safe insertion into HTML ── */

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/* ── UTILITY: parse price string ("£10.95") to float ── */

function parsePrice(str) {
    return parseFloat(String(str).replace(/[^0-9.]/g, "")) || 0;
}

/* ── UTILITY: look up protein price from fetched category data ── */

function getProteinPrice(cat, protein) {
    const catData = fetchedMenuData && fetchedMenuData[cat];
    const table = catData && catData.pricingTable;
    if (!table) { return 0; }
    const entry = table.find(function (row) {
        return row.protein === protein;
    }) || table[0];
    return parsePrice(entry.price);
}

/* ── FORM ERRORS: shared inline-error helpers ──
   Each invalid field gets aria-invalid="true" and an error message
   linked with aria-describedby, so screen readers read the error
   when the field receives focus. */

function getErrorElement(input) {
    const id = input.id + "-error";
    let el = document.getElementById(id);
    if (!el) {
        el = document.createElement("p");
        el.id = id;
        el.className = "field-error";
        el.hidden = true;
        const anchor = input.closest("label") || input;
        anchor.insertAdjacentElement("afterend", el);
    }
    return el;
}

function setFieldError(input, message) {
    if (!input) { return; }
    const el = getErrorElement(input);
    if (message) {
        el.textContent = message;
        el.hidden = false;
        input.setAttribute("aria-invalid", "true");
        input.setAttribute("aria-describedby", el.id);
    } else {
        el.textContent = "";
        el.hidden = true;
        input.removeAttribute("aria-invalid");
        input.removeAttribute("aria-describedby");
    }
}

/* Apply an errors object to a set of fields.
   fieldMap: { errorKey: inputElement }
   Returns the first invalid input (for focusing), or null. */
function applyFieldErrors(fieldMap, errors) {
    let firstInvalid = null;
    Object.keys(fieldMap).forEach(function (key) {
        const input = fieldMap[key];
        setFieldError(input, errors[key] || "");
        if (errors[key] && !firstInvalid) { firstInvalid = input; }
    });
    return firstInvalid;
}

/* ── CART: add or increment an item ── */

function addToCart(name, price) {
    const existing = cart.find(function (item) {
        return item.name === name;
    });
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name: name, price: price, qty: 1 });
    }
    renderCart();
    showToast("Added: " + name);
}

/* ── CART: remove item by index ── */

function removeFromCart(idx) {
    const removed = cart.splice(idx, 1)[0];
    renderCart();
    if (removed) { showToast("Removed: " + removed.name); }
}

function getOrderType() {
    const sel = document.getElementById("orderType");
    return sel && sel.value === "collection" ? "collection" : "delivery";
}

/* ── CART: current totals using the advertised rules ── */

function getOrderTotals() {
    return calculateOrderTotals(cart, getOrderType());
}

/* ── CART: re-render the cart panel and price breakdown ── */

function renderCart() {
    const el = document.getElementById("cartItems");
    if (!el) { return; }

    if (cart.length === 0) {
        el.innerHTML = "<p class=\"cart-empty\">Your cart is empty. Browse the menu above!</p>";
    } else {
        el.innerHTML = cart.map(function (item, i) {
            const lineTotal = formatPounds(Math.round(item.price * 100) * item.qty);
            const removeLabel = "Remove " + escapeHtml(item.name) + " from cart";
            return "<div class=\"cart-item\">" +
                "<span>" + item.qty + "× " + escapeHtml(item.name) + "</span>" +
                "<span class=\"cart-item-controls\">" +
                "<strong>" + lineTotal + "</strong>" +
                "<button type=\"button\" class=\"cart-item-remove\" data-idx=\"" + i + "\"" +
                " aria-label=\"" + removeLabel + "\">✕</button>" +
                "</span></div>";
        }).join("");
    }

    renderTotals();
}

function renderTotals() {
    const totals = getOrderTotals();
    const isCollection = getOrderType() === "collection";

    const subtotalEl = document.getElementById("cartSubtotal");
    const discountRow = document.getElementById("discountRow");
    const discountEl = document.getElementById("cartDiscount");
    const deliveryRow = document.getElementById("deliveryRow");
    const deliveryEl = document.getElementById("cartDelivery");
    const totalEl = document.getElementById("cartTotal");
    const notesEl = document.getElementById("cartNotes");

    if (subtotalEl) { subtotalEl.textContent = formatPounds(totals.subtotal); }

    if (discountRow && discountEl) {
        discountRow.hidden = totals.discount === 0;
        discountEl.textContent = formatPounds(-totals.discount);
    }

    if (deliveryRow && deliveryEl) {
        deliveryRow.hidden = isCollection;
        if (totals.subtotal === 0) {
            deliveryEl.textContent = "—";
        } else if (!totals.canCheckout) {
            deliveryEl.textContent = "Not available";
        } else {
            deliveryEl.textContent = totals.deliveryCharge === 0 ?
                "Free" :
                formatPounds(totals.deliveryCharge);
        }
    }

    if (totalEl) { totalEl.textContent = formatPounds(totals.total); }
    if (notesEl) { notesEl.textContent = totals.notes.join(" "); }
}

/* ── CART: delegated event handler for remove buttons ── */

function initCartEvents() {
    const cartItems = document.getElementById("cartItems");
    if (!cartItems) { return; }

    cartItems.addEventListener("click", function (event) {
        const btn = event.target.closest(".cart-item-remove");
        if (!btn) { return; }
        const idx = parseInt(btn.dataset.idx, 10);
        if (!isNaN(idx)) {
            removeFromCart(idx);
        }
    });
}

/* ── TOAST NOTIFICATION (styles in css/style.css → .toast) ── */

function showToast(msg) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("visible");
    clearTimeout(toast.hideTimer);
    toast.hideTimer = setTimeout(function () {
        toast.classList.remove("visible");
    }, 2500);
}

/* ── MENU: show loading skeleton while fetch is in progress ── */

function showMenuLoading(container) {
    const skeletonCards = Array.from({ length: 6 }, function () {
        return "<div class=\"skeleton-card\" aria-hidden=\"true\"></div>";
    }).join("");

    container.innerHTML = "<div class=\"menu-loading\" role=\"status\"" +
        " aria-busy=\"true\" aria-label=\"Loading menu, please wait\">" +
        "<p class=\"loading-text\">Loading menu…</p>" +
        "<div class=\"skeleton-grid\">" + skeletonCards + "</div>" +
        "</div>";
}

/* ── MENU: show user-facing error with retry button ── */

function showMenuError(container, err) {
    const errorMsg = err && err.message ? err.message : "Unknown error";
    container.innerHTML = "<div class=\"menu-error\" role=\"alert\">" +
        "<p class=\"menu-error-heading\">" +
        "⚠️ Sorry, the menu could not be loaded.</p>" +
        "<p class=\"menu-error-body\">Please check your connection and try again.</p>" +
        "<button type=\"button\" class=\"btn-primary\" id=\"retryMenuBtn\">↺ Retry</button>" +
        "<p class=\"menu-error-detail\">Technical detail: " + escapeHtml(errorMsg) + "</p>" +
        "</div>";

    const retryBtn = document.getElementById("retryMenuBtn");
    if (retryBtn) {
        retryBtn.addEventListener("click", buildMenu);
    }
}

/* ── MENU: build tag badges HTML ── */

function buildTagHtml(tags) {
    if (!tags || tags.length === 0) { return ""; }
    return tags.map(function (tag) {
        if (tag === "hot") { return "<span class=\"tag-hot\">🌶 Spicy</span>"; }
        if (tag === "veg") { return "<span class=\"tag-veg\">🌱 Veg</span>"; }
        if (tag === "new") { return "<span class=\"tag-new\">✨ Special</span>"; }
        return "";
    }).join(" ");
}

/* ── MENU: render a dish card ──
   Accessibility fix (tutor feedback): cards used to be role="button"
   with a real <button> inside — nested interactive controls, which
   screen readers and keyboard users cannot operate reliably.
   Now the card is a plain <article> and the "+ Add" <button> is the
   ONLY control. CSS (.add-to-cart::after) stretches the button's
   click area over the whole card, so mouse users can still click
   anywhere on the card. */

function renderDishCard(item, options) {
    const tags = buildTagHtml(item.tags);
    const desc = item.desc ? "<p>" + escapeHtml(item.desc) + "</p>" : "";
    const nameSafe = escapeHtml(item.name);
    const emoji = item.emoji || "🍽";
    const priceStr = formatPounds(Math.round(options.price * 100));

    let dataAttrs = " data-name=\"" + nameSafe + "\"";
    let priceAttr = "";
    let label;

    if (options.cat) {
        dataAttrs += " data-protein-item=\"true\" data-cat=\"" + options.cat + "\"";
        priceAttr = " data-protein-price=\"" + options.cat + "\"";
        label = "Add " + nameSafe + " (" + escapeHtml(options.protein) + ") to cart, " + priceStr;
    } else {
        dataAttrs += " data-price=\"" + item.price + "\"";
        label = "Add " + nameSafe + " to cart, " + priceStr;
    }

    return "<article class=\"menu-card tilt-card\">" +
        "<div class=\"card-emoji\" aria-hidden=\"true\">" + emoji + "</div>" +
        "<div class=\"card-body\">" +
        "<h3>" + nameSafe + " " + tags + "</h3>" +
        desc +
        "<div class=\"card-footer\">" +
        "<span class=\"card-price\"" + priceAttr + ">" + priceStr + "</span>" +
        "<button type=\"button\" class=\"add-to-cart\"" + dataAttrs +
        " aria-label=\"" + label + "\">+ Add</button>" +
        "</div></div></article>";
}

/* ── MENU: render a drink item (a single native button) ── */

function renderDrinkItem(item) {
    const nameSafe = escapeHtml(item.name);
    const priceStr = formatPounds(Math.round(item.price * 100));

    return "<button type=\"button\" class=\"drink-item\"" +
        " data-name=\"" + nameSafe + "\"" +
        " data-price=\"" + item.price + "\"" +
        " aria-label=\"Add " + nameSafe + " to cart, " + priceStr + "\">" +
        "<span>🥤 " + nameSafe + "</span>" +
        "<span class=\"drink-price\">" + priceStr + "</span>" +
        "</button>";
}

/* ── MENU: render the protein selector dropdown ── */

function renderProteinSelector(cat, pricingTable) {
    const options = pricingTable.map(function (row, i) {
        const selected = i === 0 ? " selected" : "";
        return "<option value=\"" + escapeHtml(row.protein) + "\"" +
            selected + ">" +
            escapeHtml(row.protein) + " — " + escapeHtml(row.price) + "</option>";
    }).join("");

    return "<div class=\"protein-selector\">" +
        "<label for=\"protein-" + cat + "\">" +
        "🍽 Choose your protein</label>" +
        "<select id=\"protein-" + cat + "\"" +
        " class=\"protein-select\"" +
        " data-cat=\"" + cat + "\"" +
        " aria-describedby=\"protein-price-" + cat + "\">" +
        options +
        "</select>" +
        "<span class=\"protein-current-price\">" +
        "Price: <strong id=\"protein-price-" + cat + "\"" +
        " aria-live=\"polite\">" +
        escapeHtml(pricingTable[0].price) + "</strong></span>" +
        "</div>";
}

/* ── MENU: update all displayed prices when protein changes ── */

function updateProteinPricing(cat, protein) {
    const price = getProteinPrice(cat, protein);
    const priceStr = formatPounds(Math.round(price * 100));
    const catLabel = fetchedMenuData && fetchedMenuData[cat] ?
        fetchedMenuData[cat].label :
        cat;

    const priceLabel = document.getElementById("protein-price-" + cat);
    if (priceLabel) { priceLabel.textContent = priceStr; }

    document.querySelectorAll(
        "#panel-" + cat + " [data-protein-price=\"" + cat + "\"]"
    ).forEach(function (el) {
        el.textContent = priceStr;
    });

    document.querySelectorAll(
        "#panel-" + cat + " .add-to-cart[data-protein-item=\"true\"]"
    ).forEach(function (btn) {
        btn.setAttribute(
            "aria-label",
            "Add " + (btn.dataset.name || "") + " (" + protein + ") to cart, " + priceStr
        );
    });

    showToast(catLabel + " now priced for " + protein + " — " + priceStr);
}

/* ── MENU: handle a click on an "+ Add" button or drink button ── */

function handleAddButton(btn) {
    const name = btn.dataset.name || "";

    if (btn.dataset.proteinItem === "true") {
        const cat = btn.dataset.cat || "";
        const select = document.getElementById("protein-" + cat);
        const catData = fetchedMenuData && fetchedMenuData[cat];
        const defaultProtein = catData && catData.pricingTable ?
            catData.pricingTable[0].protein :
            "";
        const protein = select ? select.value : defaultProtein;
        addToCart(name + " (" + protein + ")", getProteinPrice(cat, protein));
    } else {
        addToCart(name, parseFloat(btn.dataset.price) || 0);
    }
}

/* ── MENU: delegated event listeners on #menuPanels ──
   Attached ONCE at start-up (previously re-attached on every render,
   which would have added items twice after a successful Retry).
   Native <button>s handle Enter and Space automatically, so no
   custom keydown handler is needed. */

function initMenuEvents() {
    const container = document.getElementById("menuPanels");
    if (!container) { return; }

    container.addEventListener("click", function (event) {
        const btn = event.target.closest(".add-to-cart, .drink-item");
        if (btn) { handleAddButton(btn); }
    });

    container.addEventListener("change", function (event) {
        const select = event.target.closest(".protein-select");
        if (!select) { return; }
        updateProteinPricing(select.dataset.cat || "", select.value);
    });
}

/* ── MENU: category tabs (delegated, attached once) ── */

function showMenuCategory(cat) {
    document.querySelectorAll(".tab-btn").forEach(function (b) {
        const isActive = b.dataset.cat === cat;
        b.classList.toggle("active", isActive);
        b.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    document.querySelectorAll(".menu-panel").forEach(function (p) {
        p.classList.toggle("active", p.id === "panel-" + cat);
    });
}

function initMenuTabs() {
    const tabs = document.querySelector(".menu-tabs");
    if (!tabs) { return; }

    tabs.addEventListener("click", function (event) {
        const btn = event.target.closest(".tab-btn");
        if (!btn) { return; }
        showMenuCategory(btn.dataset.cat);
    });
}

/* ── MENU: build and insert all category panels from fetched data ── */

function renderMenuPanels(container, data) {
    container.innerHTML = "";

    Object.keys(data).forEach(function (cat) {
        const catData = data[cat];
        const panel = document.createElement("div");
        panel.className = "menu-panel";
        panel.id = "panel-" + cat;
        panel.setAttribute("role", "region");
        panel.setAttribute("aria-label", catData.label);

        let html = "<img class=\"panel-hero-img\"" +
            " src=\"" + escapeHtml(catData.img) + "\"" +
            " alt=\"" + escapeHtml(catData.label) + " dishes\"" +
            " loading=\"lazy\">";

        if (catData.pricingTable) {
            html += renderProteinSelector(cat, catData.pricingTable);
        }

        if (cat === "drinks") {
            html += "<div class=\"drinks-list\">" +
                catData.items.map(renderDrinkItem).join("") +
                "</div>";
        } else if (catData.pricingTable) {
            const defaultProtein = catData.pricingTable[0].protein;
            const defaultPrice = parsePrice(catData.pricingTable[0].price);
            html += "<div class=\"menu-grid\">" +
                catData.items.map(function (item) {
                    return renderDishCard(item, {
                        cat: cat, protein: defaultProtein, price: defaultPrice
                    });
                }).join("") +
                "</div>";
        } else {
            html += "<div class=\"menu-grid\">" +
                catData.items.map(function (item) {
                    return renderDishCard(item, { price: item.price });
                }).join("") +
                "</div>";
        }

        panel.innerHTML = html;
        container.appendChild(panel);
    });

    const activeTab = document.querySelector(".tab-btn.active");
    showMenuCategory(activeTab ? activeTab.dataset.cat : "appetisers");
}

/* ── MENU: async entry point ──
   1. Shows a skeleton loading state immediately.
   2. Fetches assets/data/menu.json and checks the HTTP status.
   3. On success: parses JSON, stores in fetchedMenuData, renders panels.
   4. On a network error (e.g. file://): uses MENU_FALLBACK.
   5. On an HTTP error: shows an error message with a Retry button. */

async function buildMenu() {
    if (isFetching) { return; }
    isFetching = true;

    const container = document.getElementById("menuPanels");
    if (!container) { isFetching = false; return; }

    showMenuLoading(container);

    let data;
    try {
        const response = await fetch("assets/data/menu.json");
        if (!response.ok) {
            throw new Error("Server returned " + response.status +
                " " + response.statusText);
        }
        data = await response.json();
    } catch (fetchError) {
        if (fetchError instanceof TypeError && typeof MENU_FALLBACK !== "undefined") {
            console.warn(
                "fetch() unavailable — using inline menu data. " +
                "(" + fetchError.message + ")"
            );
            data = MENU_FALLBACK;
        } else {
            isFetching = false;
            showMenuError(container, fetchError);
            return;
        }
    }

    fetchedMenuData = data;
    renderMenuPanels(container, fetchedMenuData);
    isFetching = false;
}

/* ── HERO SLIDESHOW ──
   Accessibility fixes (tutor feedback):
   • Pause/Play button (WCAG 2.2.2) — also pauses the scrolling banner.
   • Starts paused if the user's system asks for reduced motion.
   • Auto-rotation pauses while the pointer or keyboard focus is in
     the hero, so content never moves while someone is reading it.
   • Hidden slides are made inert so Tab never lands on invisible links.
   • aria-live is "off" while playing, "polite" when paused. */

const SLIDE_INTERVAL_MS = 5500;

function initSlider() {
    const hero = document.getElementById("hero");
    const slidesWrap = document.getElementById("heroSlides");
    const slides = document.querySelectorAll(".hero-slide");
    const dotsContainer = document.getElementById("slideDots");
    const pauseBtn = document.getElementById("slidePause");
    const marquee = document.getElementById("marquee");
    if (!hero || !slides.length || !dotsContainer) { return; }

    let current = 0;
    let timer = null;
    let userPaused = prefersReducedMotion;   /* set by the Pause button */
    let hoverOrFocus = false;                /* temporary pause */

    slides.forEach(function (slide, i) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "slide-dot";
        dot.setAttribute("aria-label", "Show slide " + (i + 1) + " of " + slides.length);
        dot.addEventListener("click", function () { goToSlide(i); });
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll(".slide-dot");

    function goToSlide(n) {
        current = (n + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            const isActive = i === current;
            slide.classList.toggle("active", isActive);
            slide.inert = !isActive;
            slide.setAttribute("aria-hidden", isActive ? "false" : "true");
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === current);
            if (i === current) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    }

    function stop() {
        clearInterval(timer);
        timer = null;
    }

    function start() {
        stop();
        if (!userPaused && !hoverOrFocus) {
            timer = setInterval(function () { goToSlide(current + 1); }, SLIDE_INTERVAL_MS);
        }
    }

    function updatePauseState() {
        if (pauseBtn) {
            pauseBtn.setAttribute("aria-pressed", userPaused ? "true" : "false");
            pauseBtn.querySelector(".slide-pause-icon").textContent = userPaused ? "▶" : "❚❚";
            pauseBtn.querySelector(".slide-pause-text").textContent = userPaused ? "Play" : "Pause";
        }
        if (slidesWrap) {
            slidesWrap.setAttribute("aria-live", userPaused ? "polite" : "off");
        }
        if (marquee) { marquee.classList.toggle("paused", userPaused); }
        start();
    }

    if (pauseBtn) {
        pauseBtn.addEventListener("click", function () {
            userPaused = !userPaused;
            updatePauseState();
        });
    }

    const nextBtn = document.querySelector(".slide-next");
    const prevBtn = document.querySelector(".slide-prev");
    if (nextBtn) {
        nextBtn.addEventListener("click", function () { goToSlide(current + 1); start(); });
    }
    if (prevBtn) {
        prevBtn.addEventListener("click", function () { goToSlide(current - 1); start(); });
    }

    /* Temporary pause while the user is pointing at or tabbing through the hero */
    hero.addEventListener("mouseenter", function () { hoverOrFocus = true; stop(); });
    hero.addEventListener("mouseleave", function () { hoverOrFocus = false; start(); });
    hero.addEventListener("focusin", function () { hoverOrFocus = true; stop(); });
    hero.addEventListener("focusout", function (event) {
        if (!hero.contains(event.relatedTarget)) {
            hoverOrFocus = false;
            start();
        }
    });

    goToSlide(0);
    updatePauseState();
}

/* ── NAVBAR ── */

function initNavbar() {
    const navbar = document.getElementById("navbar");
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    const fab = document.getElementById("fabOrder");

    function setMenuOpen(open) {
        if (!navLinks || !hamburger) { return; }
        navLinks.classList.toggle("open", open);
        hamburger.setAttribute("aria-expanded", open ? "true" : "false");
        hamburger.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    }

    window.addEventListener("scroll", function () {
        if (navbar) { navbar.classList.toggle("scrolled", window.scrollY > 60); }
        if (fab) { fab.classList.toggle("visible", window.scrollY > 400); }
    });

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", function () {
            setMenuOpen(!navLinks.classList.contains("open"));
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && navLinks && navLinks.classList.contains("open")) {
            setMenuOpen(false);
            hamburger.focus();
        }
    });

    document.querySelectorAll(".nav-links a").forEach(function (anchor) {
        anchor.addEventListener("click", function () { setMenuOpen(false); });
    });
}

/* ── REVEAL ON SCROLL ── */

function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
        els.forEach(function (el) { el.classList.add("visible"); });
        return;
    }
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    els.forEach(function (el) { observer.observe(el); });
}

/* ── 3D TILT (mouse-proximity effect on menu cards) ──
   Skipped when the user prefers reduced motion. */

function initTilt() {
    if (prefersReducedMotion) { return; }

    document.addEventListener("mousemove", function (event) {
        document.querySelectorAll(".menu-panel.active .tilt-card").forEach(function (card) {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (event.clientX - cx) / rect.width;
            const dy = (event.clientY - cy) / rect.height;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.8) {
                card.style.transform = "perspective(600px)" +
                    " rotateY(" + (dx * 8) + "deg)" +
                    " rotateX(" + (-dy * 8) + "deg)" +
                    " translateY(-4px)";
            } else {
                card.style.transform = "";
            }
        });
    });

    document.addEventListener("mouseleave", function () {
        document.querySelectorAll(".tilt-card").forEach(function (card) {
            card.style.transform = "";
        });
    });
}

/* ── PARTICLES.JS (skipped for reduced motion) ── */

function initParticles() {
    if (typeof particlesJS === "undefined" || prefersReducedMotion) { return; }
    particlesJS("particles-js", {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 900 } },
            color: { value: ["#E8400C", "#D4A017", "#FF6B35"] },
            shape: { type: "circle" },
            opacity: { value: 0.25, random: true },
            size: { value: 3, random: true },
            line_linked: {
                enable: true, distance: 130,
                color: "#E8400C", opacity: 0.1, width: 1
            },
            move: {
                enable: true, speed: 1.2,
                direction: "none", random: true, out_mode: "out"
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            },
            modes: {
                repulse: { distance: 80 },
                push: { particles_nb: 3 }
            }
        },
        retina_detect: true
    });
}

/* ── GSAP ANIMATIONS (skipped for reduced motion) ── */

function initGSAP() {
    if (typeof gsap === "undefined" || prefersReducedMotion) { return; }
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero-slide.active .hero-title", {
        duration: 1.2, y: 60, opacity: 0, ease: "power3.out", delay: 0.3
    });
    gsap.from(".hero-slide.active .slide-tag", {
        duration: 0.8, y: 30, opacity: 0, ease: "power2.out", delay: 0.1
    });
    gsap.from(".hero-slide.active .hero-btns", {
        duration: 1, y: 40, opacity: 0, ease: "power2.out", delay: 0.6
    });

    document.querySelectorAll(".stat strong").forEach(function (el) {
        const raw = el.textContent.replace(/[^0-9]/g, "");
        const suffix = el.textContent.replace(/[0-9]/g, "");
        if (!raw) { return; }
        const target = parseInt(raw, 10);
        ScrollTrigger.create({
            trigger: el,
            once: true,
            onEnter: function () {
                gsap.to({ val: 0 }, {
                    val: target,
                    duration: 1.5,
                    ease: "power2.out",
                    onUpdate: function () {
                        el.textContent = Math.round(this.targets()[0].val) + suffix;
                    }
                });
            }
        });
    });
}

/* ── ORDER FORM ── */

function getOrderFields() {
    return {
        name: document.getElementById("custName"),
        phone: document.getElementById("custPhone"),
        email: document.getElementById("custEmail"),
        address: document.getElementById("custAddress"),
        postcode: document.getElementById("custPostcode"),
        withinArea: document.getElementById("custWithinArea")
    };
}

function readOrderValues() {
    const f = getOrderFields();
    return {
        name: f.name ? f.name.value : "",
        phone: f.phone ? f.phone.value : "",
        email: f.email ? f.email.value : "",
        orderType: getOrderType(),
        address: f.address ? f.address.value : "",
        postcode: f.postcode ? f.postcode.value : "",
        withinArea: f.withinArea ? f.withinArea.checked : false
    };
}

function showPaymentMessage(text, type) {
    const msg = document.getElementById("paymentMessage");
    if (!msg) { return; }
    msg.textContent = text;
    msg.className = type;
}

/* Remove a red payment message once the problem it describes is fixed
   (never removes the green order confirmation). */
function clearPaymentError() {
    const msg = document.getElementById("paymentMessage");
    if (msg && msg.className === "error") { showPaymentMessage("", ""); }
}

/* Show the demo order confirmation and bring it into view.
   On a phone the message sits below the payment buttons, so it is
   scrolled into view and focused (screen readers then read it). */
function showOrderConfirmation(text) {
    const msg = document.getElementById("paymentMessage");
    showPaymentMessage(text, "success");
    if (!msg) { return; }
    msg.setAttribute("tabindex", "-1");
    msg.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
    msg.focus({ preventScroll: true });
}

/* Checks the cart AND the customer details before any (simulated)
   payment. Returns true only when the order can be placed. */
function validateOrder() {
    const totals = getOrderTotals();

    if (cart.length === 0) {
        showPaymentMessage("Please add items to your cart first.", "error");
        return false;
    }
    if (!totals.canCheckout) {
        showPaymentMessage(totals.notes.join(" "), "error");
        return false;
    }

    const errors = validateOrderDetails(readOrderValues());
    const firstInvalid = applyFieldErrors(getOrderFields(), errors);
    if (firstInvalid) {
        showPaymentMessage("Please correct the highlighted details.", "error");
        firstInvalid.focus();
        return false;
    }
    return true;
}

/* Build the demo confirmation text from the calculated totals. */
function buildOrderConfirmation(paymentLabel) {
    const totals = getOrderTotals();
    const isCollection = getOrderType() === "collection";
    let breakdown = "subtotal " + formatPounds(totals.subtotal);
    if (totals.discount > 0) {
        breakdown += ", collection discount " + formatPounds(-totals.discount);
    }
    if (!isCollection) {
        breakdown += ", delivery " + (totals.deliveryCharge === 0 ?
            "free" :
            formatPounds(totals.deliveryCharge));
    }
    return "✅ DEMO " + (isCollection ? "collection" : "delivery") +
        " order (" + paymentLabel + ") – total " + formatPounds(totals.total) +
        " (" + breakdown + ")." + DEMO_SUFFIX +
        " No payment has been taken. To order for real, call 020 3883 9233.";
}

function resetOrder() {
    cart = [];
    const form = document.getElementById("orderForm");
    if (form) { form.reset(); }
    applyFieldErrors(getOrderFields(), {});
    renderCart();
}

/* Show/hide the delivery fields and re-price the cart when the
   order type changes between delivery and collection. */
function initOrderType() {
    const sel = document.getElementById("orderType");
    const deliveryFields = document.getElementById("deliveryFields");
    if (!sel) { return; }

    function update() {
        const isCollection = sel.value === "collection";
        if (deliveryFields) {
            deliveryFields.hidden = isCollection;
            if (isCollection) {
                const f = getOrderFields();
                [f.address, f.postcode, f.withinArea].forEach(function (input) {
                    setFieldError(input, "");
                });
            }
        }
        renderTotals();
    }

    sel.addEventListener("change", update);
    update();
}

/* Re-check a flagged field while the user corrects it.
   Uses "input" (while typing) rather than "blur": clearing an error on
   blur moved the buttons below mid-click, so the user's click on
   "Pay" / "Send" could miss (found during the browser retest).
   onAllFixed (optional) runs once no flagged field is left, so the red
   summary message ("Please correct 5 fields above") disappears too. */
function initLiveFieldChecks(fieldMap, validateFn, onAllFixed) {
    Object.keys(fieldMap).forEach(function (key) {
        const input = fieldMap[key];
        if (!input) { return; }
        const eventName = input.type === "checkbox" || input.tagName === "SELECT" ?
            "change" :
            "input";
        input.addEventListener(eventName, function () {
            if (input.getAttribute("aria-invalid") !== "true") { return; }
            const errors = validateFn();
            setFieldError(input, errors[key] || "");
            const stillFlagged = Object.keys(fieldMap).some(function (k) {
                return fieldMap[k] && fieldMap[k].getAttribute("aria-invalid") === "true";
            });
            if (!stillFlagged && onAllFixed) { onAllFixed(); }
        });
    });
}

/* ── SIMULATED CARD PAYMENT ──
   This is a static front-end project with no server, so no real payment
   can be taken. The card form is a demonstration: it is validated by
   validateTestCard() (js/form-rules.js), which accepts ONLY published
   test card numbers such as 4242 4242 4242 4242, so a real card can never
   be "accepted". Nothing typed into it is stored or sent anywhere.
   (The first submission used Stripe Elements with a placeholder key; it
   could fail silently, so it was replaced — see README Bug Log #23.) */

function getCardFields() {
    return {
        number: document.getElementById("cardNumber"),
        expiry: document.getElementById("cardExpiry"),
        cvc: document.getElementById("cardCvc")
    };
}

function readCardValues() {
    const f = getCardFields();
    return {
        number: f.number ? f.number.value : "",
        expiry: f.expiry ? f.expiry.value : "",
        cvc: f.cvc ? f.cvc.value : ""
    };
}

/* Tidy card input as the user types: "4242424242424242" → "4242 4242 4242 4242",
   "1230" → "12/30", digits only in the security code. */
function initCardFormatting() {
    const f = getCardFields();
    if (f.number) {
        f.number.addEventListener("input", function () {
            const digits = f.number.value.replace(/\D/g, "").slice(0, 16);
            f.number.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
        });
    }
    if (f.expiry) {
        f.expiry.addEventListener("input", function (event) {
            const digits = f.expiry.value.replace(/\D/g, "").slice(0, 4);
            const deleting = event.inputType && event.inputType.indexOf("delete") === 0;
            f.expiry.value = digits.length > 2 || (digits.length === 2 && !deleting) ?
                digits.slice(0, 2) + "/" + digits.slice(2) :
                digits;
        });
    }
    if (f.cvc) {
        f.cvc.addEventListener("input", function () {
            f.cvc.value = f.cvc.value.replace(/\D/g, "").slice(0, 3);
        });
    }
}

function initPayments() {
    const cardBtn = document.getElementById("cardPayBtn");
    const cashBtn = document.getElementById("cashPayBtn");
    const cardForm = document.getElementById("cardForm");
    if (!cardBtn || !cashBtn || !cardForm) { return; }

    function setCardFormOpen(open) {
        cardForm.hidden = !open;
        cardBtn.setAttribute("aria-expanded", open ? "true" : "false");
        if (!open) {
            cardForm.reset();
            applyFieldErrors(getCardFields(), {});
        }
    }

    cardBtn.addEventListener("click", function () {
        if (!validateOrder()) { return; }
        showPaymentMessage("", "");
        setCardFormOpen(true);
        const f = getCardFields();
        cardForm.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
        if (f.number) { f.number.focus({ preventScroll: true }); }
    });

    cardForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!validateOrder()) { return; }

        const errors = validateTestCard(readCardValues(), new Date());
        const firstInvalid = applyFieldErrors(getCardFields(), errors);
        if (firstInvalid) {
            showPaymentMessage("Payment not taken. Please correct the card details above.", "error");
            firstInvalid.focus();
            return;
        }

        /* Simulated: nothing is charged. Build the message BEFORE the cart is
           reset, reset everything, then show it last so nothing overwrites it. */
        const confirmation = buildOrderConfirmation("simulated card payment");
        setCardFormOpen(false);
        resetOrder();
        showOrderConfirmation(confirmation);
    });

    cashBtn.addEventListener("click", function () {
        if (!validateOrder()) { return; }
        const confirmation = buildOrderConfirmation("pay cash on " +
            (getOrderType() === "collection" ? "collection" : "delivery"));
        setCardFormOpen(false);
        resetOrder();
        showOrderConfirmation(confirmation);
    });

    initCardFormatting();
    initLiveFieldChecks(getCardFields(), function () {
        return validateTestCard(readCardValues(), new Date());
    }, clearPaymentError);
}

/* ── TABLE BOOKING ──
   Fix (tutor feedback): the form previously showed a success message
   even when every field was empty. It now validates every field with
   validateBooking() (js/form-rules.js) and only confirms when all
   checks pass:
     • name and phone required; phone must be a valid UK number
     • date required, not in the past, at most 90 days ahead
     • time required, within opening hours (4:30pm – 10:30pm last table),
       and at least 30 minutes from now for same-day bookings
     • number of guests must be chosen */

function getBookingFields() {
    return {
        name: document.getElementById("bName"),
        phone: document.getElementById("bPhone"),
        date: document.getElementById("bDate"),
        time: document.getElementById("bTime"),
        guests: document.getElementById("bGuests"),
        notes: document.getElementById("bNotes")
    };
}

function readBookingValues() {
    const f = getBookingFields();
    return {
        name: f.name ? f.name.value : "",
        phone: f.phone ? f.phone.value : "",
        date: f.date ? f.date.value : "",
        time: f.time ? f.time.value : "",
        guests: f.guests ? f.guests.value : "",
        notes: f.notes ? f.notes.value : ""
    };
}

/* "2026-10-24", "19:30" → "Saturday 24 October 2026 at 7:30pm" */
function formatBookingDateTime(dateStr, timeStr) {
    const parts = dateStr.split("-").map(Number);
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    const dateText = date.toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
    const t = timeStr.split(":").map(Number);
    const hour12 = t[0] % 12 === 0 ? 12 : t[0] % 12;
    const timeText = hour12 + ":" + String(t[1]).padStart(2, "0") + (t[0] < 12 ? "am" : "pm");
    return dateText + " at " + timeText;
}

function submitBooking(event) {
    event.preventDefault();
    const msg = document.getElementById("bookingMsg");
    const values = readBookingValues();
    const errors = validateBooking(values, new Date());
    const firstInvalid = applyFieldErrors(getBookingFields(), errors);
    const errorCount = Object.keys(errors).length;

    if (firstInvalid) {
        if (msg) {
            msg.innerHTML = "<p class=\"booking-error\">Your booking has not been sent. Please correct " +
                errorCount + (errorCount === 1 ? " field" : " fields") + " above.</p>";
        }
        firstInvalid.focus();
        return;
    }

    const guestsText = values.guests === "1" ? "1 guest" : values.guests + " guests";
    if (msg) {
        msg.innerHTML = "<div class=\"booking-success\">" +
            "✅ DEMO booking request for " + escapeHtml(values.name.trim()) + ": " +
            guestsText + ", " + escapeHtml(formatBookingDateTime(values.date, values.time)) + ".<br>" +
            "<strong>This is a simulation – no table has been reserved and nothing has been sent to the restaurant.</strong><br>" +
            "To book for real, call " +
            "<a href=\"tel:02038839233\" class=\"booking-phone\">020 3883 9233</a>." +
            "</div>";
    }
    event.target.reset();
    applyFieldErrors(getBookingFields(), {});
}

function initBookingForm() {
    const form = document.getElementById("bookingForm");
    if (!form) { return; }
    form.addEventListener("submit", submitBooking);
    initLiveFieldChecks(getBookingFields(), function () {
        return validateBooking(readBookingValues(), new Date());
    }, function () {
        const msg = document.getElementById("bookingMsg");
        if (msg && msg.querySelector(".booking-error")) { msg.innerHTML = ""; }
    });

    /* Limit the date picker to today … today + 90 days (local time). */
    const dateInput = document.getElementById("bDate");
    if (dateInput) {
        const today = new Date();
        const last = new Date(today);
        last.setDate(last.getDate() + BOOKING_RULES.MAX_DAYS_AHEAD);
        dateInput.min = toLocalDateString(today);
        dateInput.max = toLocalDateString(last);
    }
}

/* ── PAGE LOADER ── */

/* Hide the brand loader shortly after the page is ready. It used to wait
   for every image, font and the map to finish downloading ("load") plus
   1.6 s, which kept phones on a blank screen for several seconds
   (Lighthouse performance fix). This runs from DOMContentLoaded. */
function initLoader() {
    setTimeout(function () {
        const loader = document.getElementById("loader");
        if (loader) { loader.classList.add("hidden"); }
    }, prefersReducedMotion ? 0 : 400);
}

/* ── SCROLL-TO-TOP BUTTON (styles in css/style.css → .scroll-top) ── */

function initScrollTop() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "scroll-top";
    btn.textContent = "↑";
    btn.setAttribute("aria-label", "Back to top");
    document.body.appendChild(btn);

    window.addEventListener("scroll", function () {
        btn.classList.toggle("visible", window.scrollY > 600);
    });
    btn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
}

/* ── INIT: wire everything up on DOMContentLoaded ── */

document.addEventListener("DOMContentLoaded", function () {
    initLoader();
    initNavbar();

    initMenuTabs();
    initMenuEvents();
    buildMenu();   /* async: skeleton shows while fetch runs */

    initSlider();
    initReveal();
    initTilt();
    initParticles();
    initGSAP();
    initOrderType();
    initPayments();
    initCartEvents();
    initLiveFieldChecks(getOrderFields(), function () {
        return validateOrderDetails(readOrderValues());
    }, clearPaymentError);
    initBookingForm();
    initScrollTop();
    renderCart();
});
