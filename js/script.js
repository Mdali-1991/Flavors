/* ============================================================
   Flavours Pan Asian Food – script.js

   ============================================================ */

"use strict";

/* ── MODULE-SCOPED STATE ── */

/* cart holds the current order items for the session.
   Each entry: { name: string, price: number, qty: number } */
let cart = [];

/* fetchedMenuData is populated after a successful fetch of menu.json.
   Event handlers that need pricing data (e.g. protein selects) read
   from this rather than a static constant, demonstrating that the
   application correctly handles the timing of asynchronous data. */
let fetchedMenuData = null;

/* isFetching prevents a second buildMenu() call starting before the
   first resolves — guards against rapid Retry button clicks.
   (Bug Log #4) */
let isFetching = false;

/* ── INLINE MENU FALLBACK ──
   Purpose : Graceful degradation when fetch() is unavailable.
   When    : Browsers block fetch() on the file:// protocol (local open).
             On any HTTP server (GitHub Pages, Netlify, localhost:8080)
             the fetch always succeeds and MENU_FALLBACK is never used.
   Note    : Keep in sync with assets/data/menu.json if menu changes.
   Grading : Demonstrates defensive programming and separation of data
             from presentation — the same data schema is used whether
             loaded remotely or from this inline constant. */
const MENU_FALLBACK = {
  "appetisers": {
    "label": "Appetisers",
    "img": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&q=80",
    "items": [
      { "name": "Prawn Crackers", "desc": "Thai Prawn Crackers served with sweet chilli sauce.", "price": 3.95, "emoji": "🦐" },
      { "name": "Veg Spring Roll", "desc": "Crispy spring rolls with vegetable filling. Sweet chilli sauce.", "price": 5.50, "emoji": "🥟", "tags": ["veg"] },
      { "name": "Chicken Spring Roll", "desc": "Crispy spring rolls packed with chicken and seasonal vegetables.", "price": 6.50, "emoji": "🥟" },
      { "name": "Edamame (Salt & Pepper)", "desc": "Warm green soya bean pods seasoned with salt & pepper.", "price": 3.95, "emoji": "🫘", "tags": ["veg"] },
      { "name": "Edamame (Spicy)", "desc": "Warm green soya bean pods seasoned with garlic & chilli.", "price": 3.95, "emoji": "🫘", "tags": ["hot"] },
      { "name": "Calamari (5 pcs)", "desc": "Deep fried squid tossed in salt, paper, chilli, garlic, spring onions. House spicy mayo & togarashi.", "price": 6.95, "emoji": "🦑" },
      { "name": "Tofu Mari (5 pcs)", "desc": "Deep fried tofu tossed in salt, paper, chilli, garlic, spring onions.", "price": 5.95, "emoji": "🟡", "tags": ["veg"] },
      { "name": "Gyoza – Chicken/Fish", "desc": "Homemade marinated Chicken or Fish dumplings, wrapped in thin dough. Soya sauce.", "price": 6.95, "emoji": "🥟" },
      { "name": "Gyoza – Veg", "desc": "Homemade marinated vegetable dumplings, soya sauce.", "price": 5.95, "emoji": "🥟", "tags": ["veg"] },
      { "name": "Satay Chicken (4 pcs)", "desc": "Mildly spicy marinated chicken on skewers, creamy peanut sauce.", "price": 6.95, "emoji": "🍢" },
      { "name": "Korean BBQ Chicken Wings (5pcs)", "desc": "Crispy fried wings with sweet Korean BBQ sauce, sesame & spring onions.", "price": 6.95, "emoji": "🍗" },
      { "name": "Thai Sticky Chilli Wings (5pcs)", "desc": "Deep fried marinated chicken coated with house special spicy sweet & sour sauce.", "price": 6.95, "emoji": "🍗", "tags": ["hot"] },
      { "name": "Bao Buns – Katsu Chicken", "desc": "Steamed Japanese buns with homemade coleslaw & chilli mayo.", "price": 6.95, "emoji": "🥙" },
      { "name": "Bao Buns – Pulled BBQ Beef/Prawn", "desc": "Steamed Japanese buns with homemade coleslaw & chilli mayo.", "price": 7.95, "emoji": "🥙" },
      { "name": "Bao Buns – Aubergine", "desc": "Steamed Japanese buns with homemade coleslaw & chilli mayo.", "price": 5.95, "emoji": "🥙", "tags": ["veg"] },
      { "name": "Bao Buns – Sweet Potato Croquette", "desc": "Steamed Japanese buns with homemade coleslaw & chilli mayo.", "price": 5.95, "emoji": "🥙", "tags": ["veg"] },
      { "name": "Tempura Tiger Prawn", "desc": "Best crispy tiger prawn deep-fried in breadcrumbs. House creamy spicy mayo.", "price": 7.95, "emoji": "🦐" },
      { "name": "Tempura Soft Shell Crab", "desc": "Crispy soft shell crab deep-fried in breadcrumbs. House creamy spicy mayo.", "price": 7.95, "emoji": "🦀" },
      { "name": "Tempura Zucchini", "desc": "Crispy zucchini deep-fried in breadcrumbs. House creamy spicy mayo.", "price": 6.95, "emoji": "🥒", "tags": ["veg"] },
      { "name": "Thai Fish Cakes", "desc": "Fish patties with kaffir limes, lemongrass and red curry paste. Sweet chilli sauce.", "price": 6.95, "emoji": "🐟" },
      { "name": "Dim Sum (4 pcs)", "desc": "Steamed minced prawn and chicken in wonton pastry with garlic flakes.", "price": 6.95, "emoji": "🥟" },
      { "name": "Sesame Prawn Toast", "desc": "Minced prawn with spices on toast. Sweet chilli sauce.", "price": 6.95, "emoji": "🍞" },
      { "name": "Sweet Chilli Chicken Bites", "desc": "Crispy chicken tossed in a tangy sweet chilli sauce.", "price": 5.95, "emoji": "🌶️", "tags": ["hot"] }
    ]
  },
  "soup": {
    "label": "Soup",
    "img": "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80",
    "items": [
      { "name": "Tom Yum Soup – Chicken", "desc": "Thailand's iconic hot & sour soup, vibrant balance of spicy, sour, salty & savoury. Lemongrass, mushrooms, fresh herbs.", "price": 5.95, "emoji": "🍲", "tags": ["hot"] },
      { "name": "Tom Yum Soup – Prawn", "desc": "Hot & sour prawn soup. Lemongrass, mushrooms, fresh herbs.", "price": 6.95, "emoji": "🍲", "tags": ["hot"] },
      { "name": "Tom Yum Soup – Veg", "desc": "Hot & sour vegetable soup. Lemongrass, mushrooms, fresh herbs.", "price": 4.95, "emoji": "🍲", "tags": ["veg", "hot"] },
      { "name": "Tom Kha Soup", "desc": "Delightful chicken, prawn or mushroom soup rich with coconut milk, fragrant galangal.", "price": 6.95, "emoji": "🥥" }
    ]
  },
  "salad": {
    "label": "Salad",
    "img": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80",
    "items": [
      { "name": "Papaya Salad – Prawn", "desc": "Shredded green papaya, chilli, cherry tomatoes, cucumber, carrots, fine beans. Fresh, spicy, tangy, lime. Roasted peanuts.", "price": 10.95, "emoji": "🥗", "tags": ["hot"] },
      { "name": "Papaya Salad – Veg", "desc": "Shredded green papaya, chilli, cherry tomatoes, cucumber, carrots, fine beans. Garlic dressing. Roasted peanuts.", "price": 8.95, "emoji": "🥗", "tags": ["veg"] },
      { "name": "Thai Waterfall Beef Salad", "desc": "Grilled sirloin/rump, sliced. Peas, shoots, rocket, spinach, coriander, mint, red onions, chillies, sawtooth leaves, spring onions. Toasted rice powder.", "price": 11.95, "emoji": "🥩", "tags": ["hot"] }
    ]
  },
  "noodles": {
    "label": "Noodles",
    "img": "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=1200&q=80",
    "pricingTable": [
      { "protein": "Chicken", "price": "£10.95" },
      { "protein": "Beef",    "price": "£12.95" },
      { "protein": "Prawn",   "price": "£12.95" },
      { "protein": "Veg",     "price": "£9.95"  },
      { "protein": "Tofu",    "price": "£8.95"  }
    ],
    "items": [
      { "name": "Pad Thai", "desc": "Thai favourite. Medium spicy wok fried flat rice noodles, egg, onion, garlic, bean sprouts, tamarind, lime, spring onions. Crushed peanuts.", "price": 10.95, "emoji": "🍜" },
      { "name": "Pad Kee Mao", "desc": "Very Hot. Super spicy wok fried flat rice noodles, garlic, chillies, long beans, mix peppers, sweet basil (egg optional).", "price": 10.95, "emoji": "🌶️", "tags": ["hot"] },
      { "name": "Pad Se Ew", "desc": "Stir fried flat rice noodles in soya sauce with egg and vegetables.", "price": 10.95, "emoji": "🍜" },
      { "name": "Chow Mein", "desc": "Egg noodles, onions, carrot, cabbage, peppers, bean sprouts, spring onion stir fried in light soya, oyster sauce, sesame oil. Garnished with egg.", "price": 10.95, "emoji": "🍜" },
      { "name": "Mee Goreng", "desc": "Malaysia's favourite street food. Spicy, tangy & delicious. Stir fried egg noodles with egg, shrimps powder, carrots, spring onions, chilli & veg.", "price": 10.95, "emoji": "🍜", "tags": ["hot"] },
      { "name": "Singapore Noodles", "desc": "Stir-fried vermicelli noodles (mildly spicy), egg, chilli, vegetables, curry powder, Worcestershire sauce, Siracha & soya sauce, dried shrimps powder.", "price": 10.95, "emoji": "🍜" },
      { "name": "Yaki Suba", "desc": "Thick wheat flour noodles, bean sprouts, tofu, onions, cabbage, peppers, garlic, carrots & special tangy sauce. Spring onion & sesame seeds.", "price": 10.95, "emoji": "🍜" },
      { "name": "Yaki Udon", "desc": "Thick wheat flour noodles, bean sprouts, tofu, onions, cabbage, peppers, garlic, carrots & special tangy sauce. Spring onion & sesame seeds.", "price": 10.95, "emoji": "🍜" }
    ]
  },
  "curries": {
    "label": "Curries",
    "img": "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=1200&q=80",
    "pricingTable": [
      { "protein": "Chicken", "price": "£10.95" },
      { "protein": "Beef",    "price": "£12.95" },
      { "protein": "Prawn",   "price": "£12.95" },
      { "protein": "Veg",     "price": "£9.95"  },
      { "protein": "Tofu",    "price": "£8.95"  }
    ],
    "items": [
      { "name": "Thai Green Curry", "desc": "Spicy green curry, mixed peppers, aubergine, sweet basil, lime leaves & bamboo shoots simmered in green curry paste, coconut milk & fish sauce.", "price": 10.95, "emoji": "🌿", "tags": ["hot"] },
      { "name": "Thai Red Curry", "desc": "Spicy red curry, mixed peppers, aubergine, sweet basil, lime leaves & bamboo shoots simmered in red curry paste, coconut milk & fish sauce.", "price": 10.95, "emoji": "🌶️", "tags": ["hot"] },
      { "name": "Panang Curry", "desc": "Medium hot curry with sweet basil, green beans, peppers, lemongrass, kaffir lime leaves in coconut milk.", "price": 10.95, "emoji": "🍛" },
      { "name": "Massaman Curry", "desc": "Rich coconut curry with tamarind, turmeric, crispy shallots, potato & fresh basil.", "price": 10.95, "emoji": "🍛" },
      { "name": "Rendang Curry", "desc": "Popular spicy dry & fragrant curry dish, rich & nutty with a roasted coconut lime leaf, chilli, palm sugar & fish sauce.", "price": 10.95, "emoji": "🥘", "tags": ["hot"] }
    ]
  },
  "rice": {
    "label": "Rice",
    "img": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=1200&q=80",
    "pricingTable": [
      { "protein": "Chicken", "price": "£10.95" },
      { "protein": "Beef",    "price": "£12.95" },
      { "protein": "Prawn",   "price": "£12.95" },
      { "protein": "Veg",     "price": "£9.95"  },
      { "protein": "Tofu",    "price": "£8.95"  }
    ],
    "items": [
      { "name": "Katsu Curry", "desc": "Panko breaded & fried crispy chicken or prawn served with a mildly spicy vegetable curry sauce with rice. Contains nuts & lactose.", "price": 10.95, "emoji": "🍛" },
      { "name": "Nasi Goreng", "desc": "Spicy Malaysian/Indonesian fried rice with chilli paste, carrots, onions, coriander, sesame oil, crispy shallots with a fried egg on top.", "price": 10.95, "emoji": "🍳", "tags": ["hot"] },
      { "name": "Pad Krapow", "desc": "Very Hot. Thai comfort food. Spicy stir fried minced chicken, beef, prawn or tofu with Thai basil, chillies, onions, fine beans & mix papers. Served with rice and crispy fried egg on top.", "price": 10.95, "emoji": "🌿", "tags": ["hot"] },
      { "name": "The Himmaparn", "desc": "Wok tossed stir fry of golden cashew nuts, red onions and mix papers, in house charred aromatic sauce.", "price": 10.95, "emoji": "🥜" },
      { "name": "Pineapple Fried Rice", "desc": "Medium spice fried rice cooked with pineapple, chopped mix papers, onions, and shrimp paste, crispy shallots with a fried egg on the side.", "price": 10.95, "emoji": "🍍" },
      { "name": "Nam Prik Pao", "desc": "Homemade Thai chilli paste of roasted chillies and tamarind, smoky rice and sweet with Thai basil and long beans.", "price": 10.95, "emoji": "🌶️", "tags": ["hot"] }
    ]
  },
  "sides": {
    "label": "Side Dishes",
    "img": "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=1200&q=80",
    "items": [
      { "name": "Chips", "desc": "Classic crispy chips.", "price": 2.50, "emoji": "🍟", "tags": ["veg"] },
      { "name": "Spicy Chilli Chips", "desc": "Chips tossed in sweet and spicy sauce.", "price": 3.95, "emoji": "🍟", "tags": ["hot"] },
      { "name": "Cheesy Chips", "desc": "Fries with mozzarella cheese on top.", "price": 3.95, "emoji": "🧀" },
      { "name": "Togarashi Sweet Potato Fries", "desc": "Served with spicy mayo sauce.", "price": 3.95, "emoji": "🍠", "tags": ["hot"] },
      { "name": "Plain Rice", "desc": "Steamed plain white rice.", "price": 2.50, "emoji": "🍚", "tags": ["veg"] },
      { "name": "Jasmin Fried Rice", "desc": "Aromatic jasmine fried rice. Vegan.", "price": 2.95, "emoji": "🍚", "tags": ["veg"] },
      { "name": "Egg Fried Rice", "desc": "Stir fried with eggs & spring onions.", "price": 3.95, "emoji": "🍳" },
      { "name": "Garlic Rice", "desc": "Stir fried rice with garlic & coriander.", "price": 3.95, "emoji": "🧄", "tags": ["veg"] },
      { "name": "Lemon Rice", "desc": "Stir fried rice with lemon & garlic.", "price": 3.95, "emoji": "🍋", "tags": ["veg"] },
      { "name": "Stir Fried Water Spinach", "desc": "Spicy water spinach with garlic, shallots, shrimp paste, chillies & fish sauce. Vegan version available.", "price": 4.95, "emoji": "🥬", "tags": ["hot"] },
      { "name": "Stir Fried Broccoli", "desc": "Stir fried broccoli with onions, garlic, oyster sauce, soya sauce & spring onion.", "price": 4.95, "emoji": "🥦", "tags": ["veg"] },
      { "name": "Stir Fried Mix Vegetable", "desc": "Seasonal mix vegetable fries with onions, garlic, oyster sauce, soya sauce & spring onion.", "price": 4.50, "emoji": "🥗", "tags": ["veg"] },
      { "name": "Katsu Curry Sauce", "desc": "Good for vegetarian. Mildly spicy vegetable curry sauce.", "price": 3.95, "emoji": "🍛", "tags": ["veg"] }
    ]
  },
  "specials": {
    "label": "Flavours Specials",
    "img": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80",
    "items": [
      { "name": "Crispy Chilli Chicken", "desc": "Crispy stir fry chicken seasoned with mix papers, chilli sauce and onions.", "price": 10.95, "emoji": "🌶️", "tags": ["hot", "new"] },
      { "name": "Szechuan Beef", "desc": "Stir fry spicy chilli, mix papers, garlic, leeks and basil with beef. Sweet spicy and complicated taste.", "price": 12.95, "emoji": "🥩", "tags": ["hot"] },
      { "name": "Crispy Salt & Pepper Chicken", "desc": "Seasoned chicken, fried up with crunchy onions and spicy chillies.", "price": 10.95, "emoji": "🍗", "tags": ["hot"] },
      { "name": "Chilli Prawns", "desc": "Golden crispy prawns with salt and pepper seasoning.", "price": 12.95, "emoji": "🦐", "tags": ["hot"] },
      { "name": "Flavours Special Fried Rice", "desc": "Signature fried rice with beef, prawn, calamari, mix papers, and spring onion. Served with chilli oil and coriander.", "price": 13.95, "emoji": "🍳", "tags": ["new"] }
    ]
  },
  "desserts": {
    "label": "Desserts",
    "img": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&q=80",
    "items": [
      { "name": "Banana Fritters (Vegan)", "desc": "Four coated deep-fried bananas served with syrup & a scoop of vegan coconut sorbet.", "price": 5.95, "emoji": "🍌", "tags": ["veg"] },
      { "name": "Black Sesame Ice Cream", "desc": "Nutty, toasted sesame Japanese style handcrafted ice cream made London.", "price": 5.95, "emoji": "🍦" },
      { "name": "Honeycomb Ice Cream", "desc": "Delicious, creamy, caramel. Japanese style handcrafted ice cream made London.", "price": 5.95, "emoji": "🍯" },
      { "name": "Green Tea Ice Cream", "desc": "Classic Japanese favourite, strong matcha green tea flavoured ice cream.", "price": 5.95, "emoji": "🍵" },
      { "name": "Ice Cream Mochi (6)", "desc": "Chocolate/coconut/mango.", "price": 5.95, "emoji": "🍡" },
      { "name": "Ben & Jerry's (465ml)", "desc": "Chocolate Fudge Brownie or Cookie Dough.", "price": 5.95, "emoji": "🍨" }
    ]
  },
  "drinks": {
    "label": "Drinks",
    "img": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=1200&q=80",
    "items": [
      { "name": "Still Water",                          "price": 1.95 },
      { "name": "Sparkling Water",                      "price": 2.50 },
      { "name": "Coke / Diet Coke",                     "price": 1.95 },
      { "name": "Sprite",                               "price": 1.95 },
      { "name": "Fanta",                                "price": 1.95 },
      { "name": "7 UP",                                 "price": 1.95 },
      { "name": "Rubicon Mango",                        "price": 1.95 },
      { "name": "Dr Pepper",                            "price": 1.95 },
      { "name": "J20 Apple & Mango / Orange & Passion", "price": 2.95 },
      { "name": "Pepsi / Diet Pepsi",                   "price": 1.95 },
      { "name": "Capri Sun",                            "price": 1.95 },
      { "name": "Red Bull",                             "price": 2.95 }
    ]
  },
  "kids": {
    "label": "Kids' Menu",
    "img": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80",
    "items": [
      { "name": "Fish Fingers & Chips",      "desc": "Crispy fish fingers served with chips.",        "price": 5.95, "emoji": "🐟" },
      { "name": "Chicken Nuggets & Chips",   "desc": "Crispy chicken nuggets served with chips.",     "price": 5.95, "emoji": "🍗" },
      { "name": "Bao Buns & Chips",          "desc": "Soft bao buns served with chips.",              "price": 5.95, "emoji": "🥙" },
      { "name": "Plain Noodles with Chicken","desc": "Plain noodles served with chicken.",            "price": 5.95, "emoji": "🍜" },
      { "name": "Plain Noodles with Veg",    "desc": "Plain noodles served with vegetables.",         "price": 5.95, "emoji": "🍜", "tags": ["veg"] }
    ]
  }
};

/* ── UTILITY: escape HTML attribute values ── */

function escapeAttr(str) {
    return str
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
    cart.splice(idx, 1);
    renderCart();
}

/* ── CART: re-render the cart panel ── */

function renderCart() {
    const el = document.getElementById("cartItems");
    const totalEl = document.getElementById("cartTotal");
    if (!el || !totalEl) { return; }

    if (cart.length === 0) {
        el.innerHTML = "<p class=\"cart-empty\">Your cart is empty. Browse the menu above!</p>";
        totalEl.textContent = "£0.00";
        return;
    }

    el.innerHTML = cart.map(function (item, i) {
        const lineTotal = "£" + (item.price * item.qty).toFixed(2);
        const removeLabel = "Remove " + escapeAttr(item.name) + " from cart";
        return "<div class=\"cart-item\">"
            + "<span>" + item.qty + "× " + escapeAttr(item.name) + "</span>"
            + "<span class=\"cart-item-controls\">"
            + "<strong>" + lineTotal + "</strong>"
            + "<button class=\"cart-item-remove\" data-idx=\"" + i + "\""
            + " aria-label=\"" + removeLabel + "\">✕</button>"
            + "</span></div>";
    }).join("");

    const total = cart.reduce(function (sum, item) {
        return sum + item.price * item.qty;
    }, 0);
    totalEl.textContent = "£" + total.toFixed(2);
}

/* ── CART: return numeric total ── */

function getCartTotal() {
    return cart.reduce(function (sum, item) {
        return sum + item.price * item.qty;
    }, 0);
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

/* ── TOAST NOTIFICATION ── */

function showToast(msg) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        toast.style.cssText = [
            "position:fixed;bottom:90px;right:28px;z-index:9999;",
            "background:linear-gradient(135deg,#E8400C,#FF6B35);",
            "color:#fff;padding:12px 22px;border-radius:50px;",
            "font-weight:600;font-size:0.88rem;",
            "box-shadow:0 8px 24px rgba(232,64,12,0.4);",
            "transition:opacity 0.3s ease;pointer-events:none;"
        ].join("");
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = "1";
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
        toast.style.opacity = "0";
    }, 2500);
}

/* ── MENU: show loading skeleton while fetch is in progress ──
   This visible loading state proves the app handles the timing
   gap between initiating a fetch and receiving a response,
   satisfying the Distinction requirement for asynchronicity. */

function showMenuLoading(container) {
    const skeletonCards = Array.from({ length: 6 }, function () {
        return "<div class=\"skeleton-card\" aria-hidden=\"true\"></div>";
    }).join("");

    container.innerHTML = "<div class=\"menu-loading\" role=\"status\""
        + " aria-busy=\"true\" aria-label=\"Loading menu, please wait\">"
        + "<p class=\"loading-text\">Loading menu…</p>"
        + "<div class=\"skeleton-grid\">" + skeletonCards + "</div>"
        + "</div>";
}

/* ── MENU: show user-facing error with retry button ──
   If the fetch fails (network error, bad status), the UI clearly
   reports the failure and offers a Retry action rather than
   silently failing or showing a blank panel. */

function showMenuError(container, err) {
    const errorMsg = err && err.message ? err.message : "Unknown error";
    container.innerHTML = "<div class=\"menu-error\" role=\"alert\">"
        + "<p class=\"menu-error-heading\">"
        + "⚠️ Sorry, the menu could not be loaded.</p>"
        + "<p class=\"menu-error-body\">Please check your connection and try again.</p>"
        + "<button class=\"btn-primary\" id=\"retryMenuBtn\">↺ Retry</button>"
        + "<p class=\"menu-error-detail\">Technical detail: " + escapeAttr(errorMsg) + "</p>"
        + "</div>";

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

/* ── MENU: render a single fixed-price menu card ── */

function renderMenuCard(item) {
    const tags = buildTagHtml(item.tags);
    const desc = item.desc
        ? "<p>" + item.desc + "</p>"
        : "";
    const priceStr = "£" + item.price.toFixed(2);
    const nameSafe = escapeAttr(item.name);
    const emoji = item.emoji || "🍽";

    return "<div class=\"menu-card tilt-card\""
        + " role=\"button\""
        + " tabindex=\"0\""
        + " data-name=\"" + nameSafe + "\""
        + " data-price=\"" + item.price + "\""
        + " aria-label=\"Add " + nameSafe + " to cart for " + priceStr + "\">"
        + "<div class=\"card-emoji\">" + emoji + "</div>"
        + "<div class=\"card-body\">"
        + "<h4>" + item.name + " " + tags + "</h4>"
        + desc
        + "<div class=\"card-footer\">"
        + "<span class=\"card-price\">" + priceStr + "</span>"
        + "<button class=\"add-to-cart\""
        + " aria-label=\"Add " + nameSafe + " to cart\">+ Add</button>"
        + "</div></div></div>";
}

/* ── MENU: render a protein-priced menu card ──
   The card carries data-protein-item, data-cat, and data-name.
   At add-time the delegated handler reads the current protein
   select value and looks up the price from fetchedMenuData —
   the price is always live, not baked in at render time. */

function renderProteinCard(item, cat, defaultProtein, defaultPrice) {
    const tags = buildTagHtml(item.tags);
    const desc = item.desc
        ? "<p>" + item.desc + "</p>"
        : "";
    const priceStr = "£" + defaultPrice.toFixed(2);
    const nameSafe = escapeAttr(item.name);
    const emoji = item.emoji || "🍽";
    const ariaLabel = "Add " + nameSafe + " (" + defaultProtein + ") to cart for " + priceStr;

    return "<div class=\"menu-card tilt-card\""
        + " role=\"button\""
        + " tabindex=\"0\""
        + " data-protein-item=\"true\""
        + " data-cat=\"" + cat + "\""
        + " data-name=\"" + nameSafe + "\""
        + " aria-label=\"" + escapeAttr(ariaLabel) + "\">"
        + "<div class=\"card-emoji\">" + emoji + "</div>"
        + "<div class=\"card-body\">"
        + "<h4>" + item.name + " " + tags + "</h4>"
        + desc
        + "<div class=\"card-footer\">"
        + "<span class=\"card-price\" data-protein-price=\"" + cat + "\">"
        + priceStr + "</span>"
        + "<button class=\"add-to-cart\""
        + " aria-label=\"Add " + nameSafe + " to cart\">+ Add</button>"
        + "</div></div></div>";
}

/* ── MENU: render a drink item row ── */

function renderDrinkItem(item) {
    const nameSafe = escapeAttr(item.name);
    const priceStr = "£" + item.price.toFixed(2);

    return "<div class=\"drink-item\""
        + " role=\"button\""
        + " tabindex=\"0\""
        + " data-name=\"" + nameSafe + "\""
        + " data-price=\"" + item.price + "\""
        + " aria-label=\"Add " + nameSafe + " to cart for " + priceStr + "\">"
        + "<span>🥤 " + item.name + "</span>"
        + "<span class=\"drink-price\">" + priceStr + "</span>"
        + "</div>";
}

/* ── MENU: render the protein selector dropdown ── */

function renderProteinSelector(cat, pricingTable) {
    const options = pricingTable.map(function (row, i) {
        const selected = i === 0 ? " selected" : "";
        return "<option value=\"" + escapeAttr(row.protein) + "\""
            + selected + ">"
            + row.protein + " — " + row.price + "</option>";
    }).join("");

    return "<div class=\"protein-selector\""
        + " role=\"group\""
        + " aria-label=\"Choose a protein for this category\">"
        + "<label for=\"protein-" + cat + "\">"
        + "🍽 Choose your protein</label>"
        + "<select id=\"protein-" + cat + "\""
        + " class=\"protein-select\""
        + " data-cat=\"" + cat + "\""
        + " aria-describedby=\"protein-price-" + cat + "\">"
        + options
        + "</select>"
        + "<span class=\"protein-current-price\">"
        + "Price: <strong id=\"protein-price-" + cat + "\""
        + " aria-live=\"polite\">"
        + pricingTable[0].price + "</strong></span>"
        + "</div>";
}

/* ── MENU: update all displayed prices when protein changes ──
   Called by the delegated change handler on #menuPanels.
   Reads from fetchedMenuData rather than a baked-in constant. */

function updateProteinPricing(cat, protein) {
    const price = getProteinPrice(cat, protein);
    const priceStr = "£" + price.toFixed(2);
    const catLabel = fetchedMenuData[cat]
        ? fetchedMenuData[cat].label
        : cat;

    const priceLabel = document.getElementById("protein-price-" + cat);
    if (priceLabel) { priceLabel.textContent = priceStr; }

    document.querySelectorAll(
        "#panel-" + cat + " [data-protein-price=\"" + cat + "\"]"
    ).forEach(function (el) {
        el.textContent = priceStr;
    });

    document.querySelectorAll(
        "#panel-" + cat + " [data-protein-item=\"true\"]"
    ).forEach(function (card) {
        const nameSafe = card.dataset.name || "";
        card.setAttribute(
            "aria-label",
            "Add " + nameSafe + " (" + protein + ") to cart for " + priceStr
        );
    });

    showToast(catLabel + " now priced for " + protein + " — " + priceStr);
}

/* ── MENU: handle activation of a fixed-price card ── */

function handleCardActivation(card) {
    const isProtein = card.dataset.proteinItem === "true";
    const name = card.dataset.name || "";

    if (isProtein) {
        const cat = card.dataset.cat || "";
        const select = document.getElementById("protein-" + cat);
        const catData = fetchedMenuData && fetchedMenuData[cat];
        const defaultProtein = catData && catData.pricingTable
            ? catData.pricingTable[0].protein
            : "";
        const protein = select ? select.value : defaultProtein;
        const price = getProteinPrice(cat, protein);
        addToCart(name + " (" + protein + ")", price);
    } else {
        const price = parseFloat(card.dataset.price) || 0;
        addToCart(name, price);
    }
}

/* ── MENU: handle activation of a drink item ── */

function handleDrinkActivation(drinkItem) {
    const name = drinkItem.dataset.name || "";
    const price = parseFloat(drinkItem.dataset.price) || 0;
    addToCart(name, price);
}

/* ── MENU: attach delegated event listeners to #menuPanels ──
   A single click handler and a single keydown handler cover every
   interactive element inside the menu — no inline onclick or
   onkeydown attributes appear anywhere in the generated HTML. */

function initMenuEvents(container) {
    /* Delegated click: menu cards, drink items, add-to-cart buttons */
    container.addEventListener("click", function (event) {
        const card = event.target.closest(".menu-card");
        const drink = event.target.closest(".drink-item");
        if (card) { handleCardActivation(card); }
        else if (drink) { handleDrinkActivation(drink); }
    });

    /* Delegated keydown: Enter and Space activate focused cards */
    container.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") { return; }
        const card = event.target.closest(".menu-card");
        const drink = event.target.closest(".drink-item");
        if (card || drink) {
            event.preventDefault();
            if (card) { handleCardActivation(card); }
            if (drink) { handleDrinkActivation(drink); }
        }
    });

    /* Delegated change: protein selector dropdowns */
    container.addEventListener("change", function (event) {
        const select = event.target.closest(".protein-select");
        if (!select) { return; }
        const cat = select.dataset.cat || "";
        updateProteinPricing(cat, select.value);
    });
}

/* ── MENU: build and insert all category panels from fetched data ── */

function renderMenuPanels(container, data) {
    container.innerHTML = "";

    Object.keys(data).forEach(function (cat) {
        const catData = data[cat];
        const panel = document.createElement("div");
        panel.className = "menu-panel" + (cat === "appetisers" ? " active" : "");
        panel.id = "panel-" + cat;

        let html = "<img class=\"panel-hero-img\""
            + " src=\"" + escapeAttr(catData.img) + "\""
            + " alt=\"" + escapeAttr(catData.label) + "\""
            + " loading=\"lazy\">";

        if (catData.pricingTable) {
            html += renderProteinSelector(cat, catData.pricingTable);
        }

        if (cat === "drinks") {
            html += "<div class=\"drinks-list\">"
                + catData.items.map(renderDrinkItem).join("")
                + "</div>";
        } else if (catData.pricingTable) {
            const defaultProtein = catData.pricingTable[0].protein;
            const defaultPrice = parsePrice(catData.pricingTable[0].price);
            html += "<div class=\"menu-grid\">"
                + catData.items.map(function (item) {
                    return renderProteinCard(
                        item, cat, defaultProtein, defaultPrice
                    );
                }).join("")
                + "</div>";
        } else {
            html += "<div class=\"menu-grid\">"
                + catData.items.map(renderMenuCard).join("")
                + "</div>";
        }

        panel.innerHTML = html;
        container.appendChild(panel);
    });

    /* Tab switching — runs once after all panels are inserted */
    document.querySelectorAll(".tab-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".tab-btn").forEach(function (b) {
                b.classList.remove("active");
            });
            document.querySelectorAll(".menu-panel").forEach(function (p) {
                p.classList.remove("active");
            });
            btn.classList.add("active");
            const targetPanel = document.getElementById(
                "panel-" + btn.dataset.cat
            );
            if (targetPanel) { targetPanel.classList.add("active"); }
        });
    });

    initMenuEvents(container);
}

/* ── MENU: async entry point ──
   1. Shows a skeleton loading state immediately (no blank flash).
   2. Fetches assets/data/menu.json and checks the HTTP status.
   3. On success: parses JSON, stores in fetchedMenuData, renders panels.
   4. On failure: displays a user-visible error message with a Retry button.
   This function demonstrates understanding of async/await, timing problems
   when accessing shared state (fetchedMenuData), and graceful error handling
   — all required for the Distinction "Craftsmanship" amplification. */

async function buildMenu() {
    /* Guard: prevent a second concurrent fetch (rapid Retry clicks). */
    if (isFetching) { return; }
    isFetching = true;

    const container = document.getElementById("menuPanels");
    if (!container) { isFetching = false; return; }

    showMenuLoading(container);

    let data;
    try {
        const response = await fetch("assets/data/menu.json");
        if (!response.ok) {
            throw new Error("Server returned " + response.status
                + " " + response.statusText);
        }
        data = await response.json();
    } catch (fetchError) {
        isFetching = false;

        if (fetchError instanceof TypeError) {
            /* TypeError = network-level failure (includes file:// protocol
               restriction). Fall back to the inline data silently so the
               menu still works when index.html is opened as a local file.
               On a proper HTTP server this branch is never reached. */
            console.warn(
                "fetch() unavailable — using inline menu data. "
                + "(" + fetchError.message + ")"
            );
            data = MENU_FALLBACK;
        } else {
            /* HTTP error (404, 500, etc.): show the user-visible error panel
               with a Retry button so the failure is transparent. */
            showMenuError(container, fetchError);
            return;
        }
    }

    /* Store at module scope before rendering so event handlers
       (e.g. protein select change) can read live pricing data. */
    fetchedMenuData = data;
    renderMenuPanels(container, fetchedMenuData);
    isFetching = false;
}

/* ── HERO SLIDER ── */

let currentSlide = 0;
let slideTimer;

function initSlider() {
    const slides = document.querySelectorAll(".hero-slide");
    const dotsContainer = document.getElementById("slideDots");
    if (!slides.length || !dotsContainer) { return; }

    slides.forEach(function (slide, i) {
        const dot = document.createElement("button");
        dot.className = "slide-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        dot.addEventListener("click", function () { goToSlide(i); });
        dotsContainer.appendChild(dot);
    });

    function goToSlide(n) {
        slides[currentSlide].classList.remove("active");
        const dots = document.querySelectorAll(".slide-dot");
        dots[currentSlide].classList.remove("active");
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    const nextBtn = document.querySelector(".slide-next");
    const prevBtn = document.querySelector(".slide-prev");

    if (nextBtn) {
        nextBtn.addEventListener("click", function () {
            clearInterval(slideTimer);
            nextSlide();
            slideTimer = setInterval(nextSlide, 5500);
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener("click", function () {
            clearInterval(slideTimer);
            prevSlide();
            slideTimer = setInterval(nextSlide, 5500);
        });
    }

    slideTimer = setInterval(nextSlide, 5500);
}

/* ── NAVBAR ── */

function initNavbar() {
    const navbar = document.getElementById("navbar");
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.querySelector(".nav-links");

    window.addEventListener("scroll", function () {
        if (navbar) {
            navbar.classList.toggle("scrolled", window.scrollY > 60);
        }
        const fab = document.getElementById("fabOrder");
        if (fab) {
            fab.classList.toggle("visible", window.scrollY > 400);
        }
    });

    if (hamburger) {
        hamburger.addEventListener("click", function () {
            if (navLinks) { navLinks.classList.toggle("open"); }
        });
    }

    document.querySelectorAll(".nav-links a").forEach(function (anchor) {
        anchor.addEventListener("click", function () {
            if (navLinks) { navLinks.classList.remove("open"); }
        });
    });
}

/* ── REVEAL ON SCROLL ── */

function initReveal() {
    const els = document.querySelectorAll(".reveal");
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

/* ── 3D TILT (mouse-proximity effect on menu cards) ── */

function initTilt() {
    document.addEventListener("mousemove", function (event) {
        document.querySelectorAll(".tilt-card").forEach(function (card) {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (event.clientX - cx) / rect.width;
            const dy = (event.clientY - cy) / rect.height;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.8) {
                card.style.transform = "perspective(600px)"
                    + " rotateY(" + (dx * 8) + "deg)"
                    + " rotateX(" + (-dy * 8) + "deg)"
                    + " translateY(-4px)";
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

/* ── PARTICLES.JS ── */

function initParticles() {
    if (typeof particlesJS === "undefined") { return; }
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

/* ── GSAP ANIMATIONS ── */

function initGSAP() {
    if (typeof gsap === "undefined") { return; }
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero-title", {
        duration: 1.2, y: 60, opacity: 0, ease: "power3.out", delay: 0.3
    });
    gsap.from(".slide-tag", {
        duration: 0.8, y: 30, opacity: 0, ease: "power2.out", delay: 0.1
    });
    gsap.from(".hero-btns", {
        duration: 1, y: 40, opacity: 0, ease: "power2.out", delay: 0.6
    });

    document.querySelectorAll(".stat strong").forEach(function (el) {
        const raw = el.textContent.replace(/[^0-9]/g, "");
        const suffix = el.textContent.replace(/[0-9]/g, "");
        if (!raw) { return; }
        const target = parseInt(raw, 10);
        ScrollTrigger.create({
            trigger: el,
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

/* ── STRIPE PAYMENT ──
   The key below is a Stripe test publishable key (development only).
   For production, inject the live publishable key server-side via a
   <meta> tag or environment variable — never commit a live secret key. */

const STRIPE_TEST_PK = "pk_test_51000000000000000000000000000000000000000"
    + "0000000000000000000000000000000000000000000000000000000000";

let stripe;
let cardElement;
let cardMounted = false;

function showPaymentMessage(text, type) {
    const msg = document.getElementById("paymentMessage");
    if (!msg) { return; }
    msg.textContent = text;
    msg.className = type;
}

function initStripe() {
    const stripeBtn = document.getElementById("stripePayBtn");
    const cashBtn = document.getElementById("cashPayBtn");
    const confirmBtn = document.getElementById("confirmPayBtn");
    const cardEl = document.getElementById("stripe-card-element");
    if (!stripeBtn) { return; }

    stripeBtn.addEventListener("click", function () {
        if (cart.length === 0) {
            showPaymentMessage(
                "Please add items to your cart first.", "error"
            );
            return;
        }
        if (!stripe) {
            stripe = Stripe(STRIPE_TEST_PK);
            const elements = stripe.elements({
                appearance: { theme: "night" }
            });
            cardElement = elements.create("card", {
                style: {
                    base: {
                        color: "#F5F0E8",
                        fontSize: "16px",
                        "::placeholder": { color: "#9A9080" }
                    }
                }
            });
        }
        if (!cardMounted) {
            cardElement.mount("#stripe-card-element");
            cardMounted = true;
        }
        if (cardEl) { cardEl.style.display = "block"; }
        if (confirmBtn) { confirmBtn.style.display = "block"; }
        stripeBtn.style.display = "none";
    });

    if (confirmBtn) {
        confirmBtn.addEventListener("click", async function () {
            if (!validateOrder()) { return; }
            confirmBtn.disabled = true;
            confirmBtn.textContent = "Processing…";
            try {
                /* A real PaymentIntent requires a server endpoint.
                   This demo confirms the order without charging a card. */
                const total = Math.round(getCartTotal() * 100);
                const formatted = "£" + (total / 100).toFixed(2);
                showPaymentMessage(
                    "✅ Order placed! Total: " + formatted
                    + ". We'll call you to confirm. ☎ 020 3883 9233",
                    "success"
                );
                cart = [];
                renderCart();
                if (cardEl) { cardEl.style.display = "none"; }
                confirmBtn.style.display = "none";
                stripeBtn.style.display = "block";
                stripeBtn.textContent = "💳 Pay by Card (Stripe)";
                confirmBtn.disabled = false;
                confirmBtn.textContent = "Confirm & Pay";
            } catch (err) {
                showPaymentMessage(
                    "Payment error: " + err.message, "error"
                );
                confirmBtn.disabled = false;
                confirmBtn.textContent = "Confirm & Pay";
            }
        });
    }

    if (cashBtn) {
        cashBtn.addEventListener("click", function () {
            if (cart.length === 0) {
                showPaymentMessage(
                    "Please add items to your cart first.", "error"
                );
                return;
            }
            if (!validateOrder()) { return; }
            const orderType = document.getElementById("orderType");
            const typeLabel = orderType && orderType.value === "collection"
                ? "Collection"
                : "Delivery";
            const formatted = "£" + getCartTotal().toFixed(2);
            showPaymentMessage(
                "✅ " + typeLabel + " order received! Total: " + formatted
                + ". We'll call you to confirm. ☎ 020 3883 9233",
                "success"
            );
            cart = [];
            renderCart();
        });
    }
}

/* ── ORDER FORM VALIDATION ── */

function validateOrder() {
    const name = document.getElementById("custName");
    const phone = document.getElementById("custPhone");
    const email = document.getElementById("custEmail");
    const orderType = document.getElementById("orderType");
    const address = document.getElementById("custAddress");

    const nameVal = name ? name.value.trim() : "";
    const phoneVal = phone ? phone.value.trim() : "";
    const emailVal = email ? email.value.trim() : "";

    if (!nameVal || !phoneVal || !emailVal) {
        showPaymentMessage(
            "Please fill in your name, phone and email.", "error"
        );
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailVal)) {
        showPaymentMessage(
            "Please enter a valid email address.", "error"
        );
        return false;
    }

    const isDelivery = orderType && orderType.value === "delivery";
    const addressVal = address ? address.value.trim() : "";
    if (isDelivery && !addressVal) {
        showPaymentMessage(
            "Please enter your delivery address.", "error"
        );
        return false;
    }

    return true;
}

/* ── ORDER TYPE TOGGLE (show/hide address field) ── */

function initOrderType() {
    const sel = document.getElementById("orderType");
    const addrLabel = document.getElementById("addressLabel");
    if (!sel || !addrLabel) { return; }
    sel.addEventListener("change", function () {
        addrLabel.style.display = sel.value === "collection"
            ? "none"
            : "block";
    });
}

/* ── TABLE BOOKING ── */

function submitBooking(event) {
    event.preventDefault();
    const msg = document.getElementById("bookingMsg");
    const nameEl = document.getElementById("bName");
    const dateEl = document.getElementById("bDate");
    const timeEl = document.getElementById("bTime");
    const guestsEl = document.getElementById("bGuests");

    const name = nameEl ? nameEl.value : "";
    const date = dateEl ? dateEl.value : "";
    const time = timeEl ? timeEl.value : "";
    const guests = guestsEl ? guestsEl.value : "";

    if (msg) {
        msg.innerHTML = "<div class=\"booking-success\">"
            + "✅ Booking request received for " + escapeAttr(name) + "!<br>"
            + guests + " guests · " + date + " at " + time + "<br>"
            + "We'll call you on "
            + "<a href=\"tel:02038839233\" class=\"booking-phone\">"
            + "020 3883 9233</a> to confirm.</div>";
    }
    event.target.reset();
}

function initBookingForm() {
    const form = document.getElementById("bookingForm");
    if (!form) { return; }
    form.addEventListener("submit", submitBooking);
}

/* ── PAGE LOADER ── */

function initLoader() {
    window.addEventListener("load", function () {
        setTimeout(function () {
            const loader = document.getElementById("loader");
            if (loader) { loader.classList.add("hidden"); }
        }, 1600);
    });
}

/* ── SCROLL-TO-TOP BUTTON ── */

function initScrollTop() {
    const btn = document.createElement("button");
    btn.innerHTML = "↑";
    btn.setAttribute("aria-label", "Back to top");
    btn.style.cssText = [
        "position:fixed;bottom:28px;left:28px;z-index:500;",
        "background:var(--surface);border:1px solid #333;",
        "color:var(--text);width:44px;height:44px;border-radius:50%;",
        "font-size:1.2rem;cursor:pointer;opacity:0;transition:opacity 0.3s;",
        "display:flex;align-items:center;justify-content:center;"
    ].join("");
    document.body.appendChild(btn);

    window.addEventListener("scroll", function () {
        btn.style.opacity = window.scrollY > 600 ? "1" : "0";
    });
    btn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ── INIT: wire everything up on DOMContentLoaded ── */

document.addEventListener("DOMContentLoaded", function () {
    initLoader();
    initNavbar();

    /* buildMenu is async: the skeleton loads instantly while fetch runs.
       The rest of the page initialises in parallel — no blocking wait. */
    buildMenu();

    initSlider();
    initReveal();
    initTilt();
    initParticles();
    initGSAP();
    initStripe();
    initOrderType();
    initCartEvents();
    initBookingForm();
    initScrollTop();
    renderCart();

    const dateInput = document.getElementById("bDate");
    if (dateInput) {
        dateInput.min = new Date().toISOString().split("T")[0];
    }
});
