/* ============================================================
   Flavours Pan Asian Food – main.js
   ============================================================ */

/* ── MENU DATA ── */
const MENU = {
  appetisers: {
    label: 'Appetisers',
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&q=80',
    items: [
      { name: 'Prawn Crackers', desc: 'Thai Prawn Crackers served with sweet chilli sauce.', price: 3.95, emoji: '🦐' },
      { name: 'Veg Spring Roll', desc: 'Crispy spring rolls with vegetable filling. Sweet chilli sauce.', price: 5.50, emoji: '🥟', tags: ['veg'] },
      { name: 'Chicken Spring Roll', desc: 'Crispy spring rolls packed with chicken and seasonal vegetables.', price: 6.50, emoji: '🥟' },
      { name: 'Edamame (Salt & Pepper)', desc: 'Warm green soya bean pods seasoned with salt & pepper.', price: 3.95, emoji: '🫘', tags: ['veg'] },
      { name: 'Edamame (Spicy)', desc: 'Warm green soya bean pods seasoned with garlic & chilli.', price: 3.95, emoji: '🫘', tags: ['hot'] },
      { name: 'Calamari (5 pcs)', desc: 'Deep fried squid tossed in salt, paper, chilli, garlic, spring onions. House spicy mayo & togarashi.', price: 6.95, emoji: '🦑' },
      { name: 'Tofu Mari (5 pcs)', desc: 'Deep fried tofu tossed in salt, paper, chilli, garlic, spring onions.', price: 5.95, emoji: '🟡', tags: ['veg'] },
      { name: 'Gyoza – Chicken/Fish', desc: 'Homemade marinated Chicken or Fish dumplings, wrapped in thin dough. Soya sauce.', price: 6.95, emoji: '🥟' },
      { name: 'Gyoza – Veg', desc: 'Homemade marinated vegetable dumplings, soya sauce.', price: 5.95, emoji: '🥟', tags: ['veg'] },
      { name: 'Satay Chicken (4 pcs)', desc: 'Mildly spicy marinated chicken on skewers, creamy peanut sauce.', price: 6.95, emoji: '🍢' },
      { name: 'Korean BBQ Chicken Wings (5pcs)', desc: 'Crispy fried wings with sweet Korean BBQ sauce, sesame & spring onions.', price: 6.95, emoji: '🍗' },
      { name: 'Thai Sticky Chilli Wings (5pcs)', desc: 'Deep fried marinated chicken coated with house special spicy sweet & sour sauce.', price: 6.95, emoji: '🍗', tags: ['hot'] },
      { name: 'Bao Buns – Katsu Chicken', desc: 'Steamed Japanese buns with homemade coleslaw & chilli mayo.', price: 6.95, emoji: '🥙' },
      { name: 'Bao Buns – Pulled BBQ Beef/Prawn', desc: 'Steamed Japanese buns with homemade coleslaw & chilli mayo.', price: 7.95, emoji: '🥙' },
      { name: 'Bao Buns – Aubergine', desc: 'Steamed Japanese buns with homemade coleslaw & chilli mayo.', price: 5.95, emoji: '🥙', tags: ['veg'] },
      { name: 'Bao Buns – Sweet Potato Croquette', desc: 'Steamed Japanese buns with homemade coleslaw & chilli mayo.', price: 5.95, emoji: '🥙', tags: ['veg'] },
      { name: 'Tempura Tiger Prawn', desc: 'Best crispy tiger prawn deep-fried in breadcrumbs. House creamy spicy mayo.', price: 7.95, emoji: '🦐' },
      { name: 'Tempura Soft Shell Crab', desc: 'Crispy soft shell crab deep-fried in breadcrumbs. House creamy spicy mayo.', price: 7.95, emoji: '🦀' },
      { name: 'Tempura Zucchini', desc: 'Crispy zucchini deep-fried in breadcrumbs. House creamy spicy mayo.', price: 6.95, emoji: '🥒', tags: ['veg'] },
      { name: 'Thai Fish Cakes', desc: 'Fish patties with kaffir limes, lemongrass and red curry paste. Sweet chilli sauce.', price: 6.95, emoji: '🐟' },
      { name: 'Dim Sum (4 pcs)', desc: 'Steamed minced prawn and chicken in wonton pastry with garlic flakes.', price: 6.95, emoji: '🥟' },
      { name: 'Sesame Prawn Toast', desc: 'Minced prawn with spices on toast. Sweet chilli sauce.', price: 6.95, emoji: '🍞' },
      { name: 'Sweet Chilli Chicken Bites', desc: 'Crispy chicken tossed in a tangy sweet chilli sauce.', price: 5.95, emoji: '🌶️', tags: ['hot'] },
    ]
  },
  soup: {
    label: 'Soup',
    img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80',
    items: [
      { name: 'Tom Yum Soup – Chicken', desc: 'Thailand\'s iconic hot & sour soup, vibrant balance of spicy, sour, salty & savoury. Lemongrass, mushrooms, fresh herbs.', price: 5.95, emoji: '🍲', tags: ['hot'] },
      { name: 'Tom Yum Soup – Prawn', desc: 'Hot & sour prawn soup. Lemongrass, mushrooms, fresh herbs.', price: 6.95, emoji: '🍲', tags: ['hot'] },
      { name: 'Tom Yum Soup – Veg', desc: 'Hot & sour vegetable soup. Lemongrass, mushrooms, fresh herbs.', price: 4.95, emoji: '🍲', tags: ['veg', 'hot'] },
      { name: 'Tom Kha Soup', desc: 'Delightful chicken, prawn or mushroom soup rich with coconut milk, fragrant galangal.', price: 6.95, emoji: '🥥' },
    ]
  },
  salad: {
    label: 'Salad',
    img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80',
    items: [
      { name: 'Papaya Salad – Prawn', desc: 'Shredded green papaya, chilli, cherry tomatoes, cucumber, carrots, fine beans. Fresh, spicy, tangy, lime. Roasted peanuts.', price: 10.95, emoji: '🥗', tags: ['hot'] },
      { name: 'Papaya Salad – Veg', desc: 'Shredded green papaya, chilli, cherry tomatoes, cucumber, carrots, fine beans. Garlic dressing. Roasted peanuts.', price: 8.95, emoji: '🥗', tags: ['veg'] },
      { name: 'Thai Waterfall Beef Salad', desc: 'Grilled sirloin/rump, sliced. Peas, shoots, rocket, spinach, coriander, mint, red onions, chillies, sawtooth leaves, spring onions. Toasted rice powder.', price: 11.95, emoji: '🥩', tags: ['hot'] },
    ]
  },
  noodles: {
    label: 'Noodles',
    img: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=1200&q=80',
    pricingTable: [
      { protein: 'Chicken', price: '£10.95' }, { protein: 'Beef', price: '£12.95' },
      { protein: 'Prawn', price: '£12.95' }, { protein: 'Veg', price: '£9.95' },
      { protein: 'Tofu', price: '£8.95' },
    ],
    items: [
      { name: 'Pad Thai', desc: 'Thai favourite. Medium spicy wok fried flat rice noodles, egg, onion, garlic, bean sprouts, tamarind, lime, spring onions. Crushed peanuts.', price: 10.95, emoji: '🍜' },
      { name: 'Pad Kee Mao', desc: 'Very Hot. Super spicy wok fried flat rice noodles, garlic, chillies, long beans, mix peppers, sweet basil (egg optional).', price: 10.95, emoji: '🌶️', tags: ['hot'] },
      { name: 'Pad Se Ew', desc: 'Stir fried flat rice noodles in soya sauce with egg and vegetables.', price: 10.95, emoji: '🍜' },
      { name: 'Chow Mein', desc: 'Egg noodles, onions, carrot, cabbage, peppers, bean sprouts, spring onion stir fried in light soya, oyster sauce, sesame oil. Garnished with egg.', price: 10.95, emoji: '🍜' },
      { name: 'Mee Goreng', desc: 'Malaysia\'s favourite street food. Spicy, tangy & delicious. Stir fried egg noodles with egg, shrimps powder, carrots, spring onions, chilli & veg.', price: 10.95, emoji: '🍜', tags: ['hot'] },
      { name: 'Singapore Noodles', desc: 'Stir-fried vermicelli noodles (mildly spicy), egg, chilli, vegetables, curry powder, Worcestershire sauce, Siracha & soya sauce, dried shrimps powder.', price: 10.95, emoji: '🍜' },
      { name: 'Yaki Suba', desc: 'Thick wheat flour noodles, bean sprouts, tofu, onions, cabbage, peppers, garlic, carrots & special tangy sauce. Spring onion & sesame seeds.', price: 10.95, emoji: '🍜' },
      { name: 'Yaki Udon', desc: 'Thick wheat flour noodles, bean sprouts, tofu, onions, cabbage, peppers, garlic, carrots & special tangy sauce. Spring onion & sesame seeds.', price: 10.95, emoji: '🍜' },
    ]
  },
  curries: {
    label: 'Curries',
    img: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=1200&q=80',
    pricingTable: [
      { protein: 'Chicken', price: '£10.95' }, { protein: 'Beef', price: '£12.95' },
      { protein: 'Prawn', price: '£12.95' }, { protein: 'Veg', price: '£9.95' },
      { protein: 'Tofu', price: '£8.95' },
    ],
    items: [
      { name: 'Thai Green Curry', desc: 'Spicy green curry, mixed peppers, aubergine, sweet basil, lime leaves & bamboo shoots simmered in green curry paste, coconut milk & fish sauce.', price: 10.95, emoji: '🌿', tags: ['hot'] },
      { name: 'Thai Red Curry', desc: 'Spicy red curry, mixed peppers, aubergine, sweet basil, lime leaves & bamboo shoots simmered in red curry paste, coconut milk & fish sauce.', price: 10.95, emoji: '🌶️', tags: ['hot'] },
      { name: 'Panang Curry', desc: 'Medium hot curry with sweet basil, green beans, peppers, lemongrass, kaffir lime leaves in coconut milk.', price: 10.95, emoji: '🍛' },
      { name: 'Massaman Curry', desc: 'Rich coconut curry with tamarind, turmeric, crispy shallots, potato & fresh basil.', price: 10.95, emoji: '🍛' },
      { name: 'Rendang Curry', desc: 'Popular spicy dry & fragrant curry dish, rich & nutty with a roasted coconut lime leaf, chilli, palm sugar & fish sauce.', price: 10.95, emoji: '🥘', tags: ['hot'] },
    ]
  },
  rice: {
    label: 'Rice',
    img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=1200&q=80',
    pricingTable: [
      { protein: 'Chicken', price: '£10.95' }, { protein: 'Beef', price: '£12.95' },
      { protein: 'Prawn', price: '£12.95' }, { protein: 'Veg', price: '£9.95' },
      { protein: 'Tofu', price: '£8.95' },
    ],
    items: [
      { name: 'Katsu Curry', desc: 'Panko breaded & fried crispy chicken or prawn served with a mildly spicy vegetable curry sauce with rice. Contains nuts & lactose.', price: 10.95, emoji: '🍛' },
      { name: 'Nasi Goreng', desc: 'Spicy Malaysian/Indonesian fried rice with chilli paste, carrots, onions, coriander, sesame oil, crispy shallots with a fried egg on top.', price: 10.95, emoji: '🍳', tags: ['hot'] },
      { name: 'Pad Krapow', desc: 'Very Hot. Thai comfort food. Spicy stir fried minced chicken, beef, prawn or tofu with Thai basil, chillies, onions, fine beans & mix papers. Served with rice and crispy fried egg on top.', price: 10.95, emoji: '🌿', tags: ['hot'] },
      { name: 'The Himmaparn', desc: 'Wok tossed stir fry of golden cashew nuts, red onions and mix papers, in house charred aromatic sauce.', price: 10.95, emoji: '🥜' },
      { name: 'Pineapple Fried Rice', desc: 'Medium spice fried rice cooked with pineapple, chopped mix papers, onions, and shrimp paste, crispy shallots with a fried egg on the side.', price: 10.95, emoji: '🍍' },
      { name: 'Nam Prik Pao', desc: 'Homemade Thai chilli paste of roasted chillies and tamarind, smoky rice and sweet with Thai basil and long beans.', price: 10.95, emoji: '🌶️', tags: ['hot'] },
    ]
  },
  sides: {
    label: 'Side Dishes',
    img: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=1200&q=80',
    items: [
      { name: 'Chips', desc: 'Classic crispy chips.', price: 2.50, emoji: '🍟', tags: ['veg'] },
      { name: 'Spicy Chilli Chips', desc: 'Chips tossed in sweet and spicy sauce.', price: 3.95, emoji: '🍟', tags: ['hot'] },
      { name: 'Cheesy Chips', desc: 'Fries with mozzarella cheese on top.', price: 3.95, emoji: '🧀' },
      { name: 'Togarashi Sweet Potato Fries', desc: 'Served with spicy mayo sauce.', price: 3.95, emoji: '🍠', tags: ['hot'] },
      { name: 'Plain Rice', desc: 'Steamed plain white rice.', price: 2.50, emoji: '🍚', tags: ['veg'] },
      { name: 'Jasmin Fried Rice', desc: 'Aromatic jasmine fried rice. Vegan.', price: 2.95, emoji: '🍚', tags: ['veg'] },
      { name: 'Egg Fried Rice', desc: 'Stir fried with eggs & spring onions.', price: 3.95, emoji: '🍳' },
      { name: 'Garlic Rice', desc: 'Stir fried rice with garlic & coriander.', price: 3.95, emoji: '🧄', tags: ['veg'] },
      { name: 'Lemon Rice', desc: 'Stir fried rice with lemon & garlic.', price: 3.95, emoji: '🍋', tags: ['veg'] },
      { name: 'Stir Fried Water Spinach', desc: 'Spicy water spinach with garlic, shallots, shrimp paste, chillies & fish sauce. Vegan version available.', price: 4.95, emoji: '🥬', tags: ['hot'] },
      { name: 'Stir Fried Broccoli', desc: 'Stir fried broccoli with onions, garlic, oyster sauce, soya sauce & spring onion.', price: 4.95, emoji: '🥦', tags: ['veg'] },
      { name: 'Stir Fried Mix Vegetable', desc: 'Seasonal mix vegetable fries with onions, garlic, oyster sauce, soya sauce & spring onion.', price: 4.50, emoji: '🥗', tags: ['veg'] },
      { name: 'Katsu Curry Sauce', desc: 'Good for vegetarian. Mildly spicy vegetable curry sauce.', price: 3.95, emoji: '🍛', tags: ['veg'] },
    ]
  },
  specials: {
    label: 'Flavours Specials',
    img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80',
    items: [
      { name: 'Crispy Chilli Chicken', desc: 'Crispy stir fry chicken seasoned with mix papers, chilli sauce and onions.', price: 10.95, emoji: '🌶️', tags: ['hot', 'new'] },
      { name: 'Szechuan Beef', desc: 'Stir fry spicy chilli, mix papers, garlic, leeks and basil with beef. Sweet spicy and complicated taste.', price: 12.95, emoji: '🥩', tags: ['hot'] },
      { name: 'Crispy Salt & Pepper Chicken', desc: 'Seasoned chicken, fried up with crunchy onions and spicy chillies.', price: 10.95, emoji: '🍗', tags: ['hot'] },
      { name: 'Chilli Prawns', desc: 'Golden crispy prawns with salt and pepper seasoning.', price: 12.95, emoji: '🦐', tags: ['hot'] },
      { name: 'Flavours Special Fried Rice', desc: 'Signature fried rice with beef, prawn, calamari, mix papers, and spring onion. Served with chilli oil and coriander.', price: 13.95, emoji: '🍳', tags: ['new'] },
    ]
  },
  desserts: {
    label: 'Desserts',
    img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&q=80',
    items: [
      { name: 'Banana Fritters (Vegan)', desc: 'Four coated deep-fried bananas served with syrup & a scoop of vegan coconut sorbet.', price: 5.95, emoji: '🍌', tags: ['veg'] },
      { name: 'Black Sesame Ice Cream', desc: 'Nutty, toasted sesame Japanese style handcrafted ice cream made London.', price: 5.95, emoji: '🍦' },
      { name: 'Honeycomb Ice Cream', desc: 'Delicious, creamy, caramel. Japanese style handcrafted ice cream made London.', price: 5.95, emoji: '🍯' },
      { name: 'Green Tea Ice Cream', desc: 'Classic Japanese favourite, strong matcha green tea flavoured ice cream.', price: 5.95, emoji: '🍵' },
      { name: 'Ice Cream Mochi (6)', desc: 'Chocolate/coconut/mango.', price: 5.95, emoji: '🍡' },
      { name: "Ben & Jerry's (465ml)", desc: 'Chocolate Fudge Brownie or Cookie Dough.', price: 5.95, emoji: '🍨' },
    ]
  },
  drinks: {
    label: 'Drinks',
    img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=1200&q=80',
    items: [
      { name: 'Still Water', price: 1.95 },
      { name: 'Sparkling Water', price: 2.50 },
      { name: 'Coke / Diet Coke', price: 1.95 },
      { name: 'Sprite', price: 1.95 },
      { name: 'Fanta', price: 1.95 },
      { name: '7 UP', price: 1.95 },
      { name: 'Rubicon Mango', price: 1.95 },
      { name: 'Dr Pepper', price: 1.95 },
      { name: 'J20 Apple & Mango / Orange & Passion', price: 2.95 },
      { name: 'Pepsi / Diet Pepsi', price: 1.95 },
      { name: 'Capri Sun', price: 1.95 },
      { name: 'Red Bull', price: 2.95 },
    ]
  },
  kids: {
    label: "Kids' Menu",
    img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80',
    items: [
      { name: 'Fish Fingers & Chips', desc: 'Crispy fish fingers served with chips.', price: 5.95, emoji: '🐟' },
      { name: 'Chicken Nuggets & Chips', desc: 'Crispy chicken nuggets served with chips.', price: 5.95, emoji: '🍗' },
      { name: 'Bao Buns & Chips', desc: 'Soft bao buns served with chips.', price: 5.95, emoji: '🥙' },
      { name: 'Plain Noodles with Chicken', desc: 'Plain noodles served with chicken.', price: 5.95, emoji: '🍜' },
      { name: 'Plain Noodles with Veg', desc: 'Plain noodles served with vegetables.', price: 5.95, emoji: '🍜', tags: ['veg'] },
    ]
  }
};

/* ── CART ── */
let cart = [];

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) { existing.qty++; } else { cart.push({ name, price, qty: 1 }); }
  renderCart();
  showToast(`Added: ${name}`);
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  renderCart();
}

function renderCart() {
  const el = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!el) return;
  if (cart.length === 0) {
    el.innerHTML = '<p class="cart-empty">Your cart is empty. Browse the menu above!</p>';
    totalEl.textContent = '£0.00';
    return;
  }
  el.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <span>${item.qty}× ${item.name}</span>
      <span style="display:flex;gap:10px;align-items:center;">
        <strong>£${(item.price * item.qty).toFixed(2)}</strong>
        <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
      </span>
    </div>
  `).join('');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  totalEl.textContent = `£${total.toFixed(2)}`;
}

function getCartTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

/* ── TOAST ── */
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = `
      position:fixed;bottom:90px;right:28px;z-index:9999;
      background:linear-gradient(135deg,#E8400C,#FF6B35);
      color:#fff;padding:12px 22px;border-radius:50px;
      font-weight:600;font-size:0.88rem;
      box-shadow:0 8px 24px rgba(232,64,12,0.4);
      transition:opacity 0.3s ease;pointer-events:none;
    `;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = '0'; }, 2500);
}

/* ── BUILD MENU HTML ── */
function buildMenu() {
  const panels = document.getElementById('menuPanels');
  if (!panels) return;

  Object.entries(MENU).forEach(([cat, data]) => {
    const panel = document.createElement('div');
    panel.className = 'menu-panel' + (cat === 'appetisers' ? ' active' : '');
    panel.id = `panel-${cat}`;

    let html = `<img class="panel-hero-img" src="${data.img}" alt="${data.label}" loading="lazy" />`;

    // Pricing table if present
    if (data.pricingTable) {
      html += `<div style="overflow-x:auto;margin-bottom:32px;">
        <table class="price-table">
          <thead><tr><th>Protein</th><th>Price</th></tr></thead>
          <tbody>
            ${data.pricingTable.map(r => `<tr><td>${r.protein}</td><td style="color:var(--gold);font-weight:700;">${r.price}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>`;
    }

    if (cat === 'drinks') {
      // Simple drinks grid
      html += `<div class="drinks-list">
        ${data.items.map(item => `
          <div class="drink-item"
               role="button"
               tabindex="0"
               aria-label="Add ${item.name} to cart for £${item.price.toFixed(2)}"
               onclick="addToCart('${item.name.replace(/'/g,"\\'")}', ${item.price})"
               onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();addToCart('${item.name.replace(/'/g,"\\'")}', ${item.price})}">
            <span>🥤 ${item.name}</span>
            <span class="drink-price">£${item.price.toFixed(2)}</span>
          </div>
        `).join('')}
      </div>`;
    } else {
      html += `<div class="menu-grid">
        ${data.items.map(item => {
          const tags = (item.tags || []).map(t => {
            if (t === 'hot') return '<span class="tag-hot">🌶 Spicy</span>';
            if (t === 'veg') return '<span class="tag-veg">🌱 Veg</span>';
            if (t === 'new') return '<span class="tag-new">✨ Special</span>';
            return '';
          }).join(' ');
          return `
            <div class="menu-card tilt-card"
                 role="button"
                 tabindex="0"
                 aria-label="Add ${item.name} to cart for £${item.price.toFixed(2)}"
                 onclick="addToCart('${item.name.replace(/'/g,"\\'")}', ${item.price})"
                 onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();addToCart('${item.name.replace(/'/g,"\\'")}', ${item.price})}">
              <div class="card-emoji">${item.emoji || '🍽'}</div>
              <div class="card-body">
                <h4>${item.name} ${tags}</h4>
                ${item.desc ? `<p>${item.desc}</p>` : ''}
                <div class="card-footer">
                  <span class="card-price">£${item.price.toFixed(2)}</span>
                  <button class="add-to-cart" onclick="event.stopPropagation();addToCart('${item.name.replace(/'/g,"\\'")}', ${item.price})" aria-label="Add ${item.name} to cart">+ Add</button>
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>`;
    }

    panel.innerHTML = html;
    panels.appendChild(panel);
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`panel-${btn.dataset.cat}`).classList.add('active');
    });
  });
}

/* ── HERO SLIDER ── */
let currentSlide = 0;
let slideTimer;

function initSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('slideDots');
  if (!slides.length || !dotsContainer) return;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.slide-dot')[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.slide-dot')[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  document.querySelector('.slide-next')?.addEventListener('click', () => { clearInterval(slideTimer); nextSlide(); slideTimer = setInterval(nextSlide, 5500); });
  document.querySelector('.slide-prev')?.addEventListener('click', () => { clearInterval(slideTimer); prevSlide(); slideTimer = setInterval(nextSlide, 5500); });
  slideTimer = setInterval(nextSlide, 5500);
}

/* ── NAVBAR ── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    const fab = document.getElementById('fabOrder');
    if (fab) fab.classList.toggle('visible', window.scrollY > 400);
  });

  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks?.classList.remove('open'));
  });
}

/* ── REVEAL ON SCROLL ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

/* ── 3D TILT ── */
function initTilt() {
  document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.tilt-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 0.8) {
        card.style.transform = `perspective(600px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateY(-4px)`;
      } else {
        card.style.transform = '';
      }
    });
  });
  document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.tilt-card').forEach(c => c.style.transform = '');
  });
}

/* ── PARTICLES ── */
function initParticles() {
  if (typeof particlesJS === 'undefined') return;
  particlesJS('particles-js', {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 900 } },
      color: { value: ['#E8400C', '#D4A017', '#FF6B35'] },
      shape: { type: 'circle' },
      opacity: { value: 0.25, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 130, color: '#E8400C', opacity: 0.1, width: 1 },
      move: { enable: true, speed: 1.2, direction: 'none', random: true, out_mode: 'out' }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
      modes: { repulse: { distance: 80 }, push: { particles_nb: 3 } }
    },
    retina_detect: true
  });
}

/* ── GSAP ANIMATIONS ── */
function initGSAP() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero title entrance
  gsap.from('.hero-title', { duration: 1.2, y: 60, opacity: 0, ease: 'power3.out', delay: 0.3 });
  gsap.from('.slide-tag', { duration: 0.8, y: 30, opacity: 0, ease: 'power2.out', delay: 0.1 });
  gsap.from('.hero-btns', { duration: 1, y: 40, opacity: 0, ease: 'power2.out', delay: 0.6 });

  // Stats counter
  document.querySelectorAll('.stat strong').forEach(el => {
    const raw = el.textContent.replace(/[^0-9]/g, '');
    const suffix = el.textContent.replace(/[0-9]/g, '');
    if (!raw) return;
    const target = parseInt(raw);
    ScrollTrigger.create({
      trigger: el,
      onEnter: () => gsap.to({ val: 0 }, {
        val: target, duration: 1.5, ease: 'power2.out',
        onUpdate: function () { el.textContent = Math.round(this.targets()[0].val) + suffix; }
      })
    });
  });
}

/* ── STRIPE PAYMENT ──
   IMPORTANT: Replace the key below with your live publishable key in production.
   Never commit secret keys. For deployment, load this via an environment variable
   rendered server-side into a <meta> tag or equivalent mechanism.
   The key below is a Stripe test publishable key for development only.           */
const STRIPE_PK = 'pk_test_51000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

let stripe, cardElement, cardMounted = false;

function initStripe() {
  const stripeBtn = document.getElementById('stripePayBtn');
  const cashBtn = document.getElementById('cashPayBtn');
  const confirmBtn = document.getElementById('confirmPayBtn');
  const cardEl = document.getElementById('stripe-card-element');
  const msg = document.getElementById('paymentMessage');

  if (!stripeBtn) return;

  stripeBtn.addEventListener('click', () => {
    if (cart.length === 0) { showMsg('Please add items to your cart first.', 'error'); return; }
    if (!stripe) {
      stripe = Stripe(STRIPE_PK);
      const elements = stripe.elements({ appearance: { theme: 'night' } });
      cardElement = elements.create('card', { style: { base: { color: '#F5F0E8', fontSize: '16px', '::placeholder': { color: '#9A9080' } } } });
    }
    if (!cardMounted) {
      cardElement.mount('#stripe-card-element');
      cardMounted = true;
    }
    cardEl.style.display = 'block';
    confirmBtn.style.display = 'block';
    stripeBtn.style.display = 'none';
  });

  confirmBtn?.addEventListener('click', async () => {
    if (!validateOrder()) return;
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Processing…';
    try {
      // Create payment intent via a backend is required for real payments.
      // For demo: show a success simulation. In production, POST to your server.
      const total = Math.round(getCartTotal() * 100);
      showMsg(`✅ Order placed! Total: £${(total / 100).toFixed(2)}. We'll call you to confirm payment. ☎ 020 3883 9233`, 'success');
      cart = []; renderCart();
      cardEl.style.display = 'none';
      confirmBtn.style.display = 'none';
      stripeBtn.style.display = 'block';
      stripeBtn.textContent = '💳 Pay by Card (Stripe)';
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Confirm & Pay';
    } catch (err) {
      showMsg('Payment error: ' + err.message, 'error');
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Confirm & Pay';
    }
  });

  cashBtn?.addEventListener('click', () => {
    if (cart.length === 0) { showMsg('Please add items to your cart first.', 'error'); return; }
    if (!validateOrder()) return;
    const type = document.getElementById('orderType').value;
    showMsg(`✅ ${type === 'collection' ? 'Collection' : 'Delivery'} order received! Total: £${getCartTotal().toFixed(2)}. We'll call you to confirm. ☎ 020 3883 9233`, 'success');
    cart = []; renderCart();
  });

  function showMsg(text, type) {
    msg.textContent = text;
    msg.className = type;
  }
}

function validateOrder() {
  const name = document.getElementById('custName')?.value.trim();
  const phone = document.getElementById('custPhone')?.value.trim();
  const email = document.getElementById('custEmail')?.value.trim();
  const orderType = document.getElementById('orderType')?.value;
  const address = document.getElementById('custAddress')?.value.trim();
  const msg = document.getElementById('paymentMessage');

  if (!name || !phone || !email) {
    msg.textContent = 'Please fill in your name, phone and email.';
    msg.className = 'error';
    return false;
  }

  // Basic email format check
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    msg.textContent = 'Please enter a valid email address.';
    msg.className = 'error';
    return false;
  }

  // Require address for delivery orders
  if (orderType === 'delivery' && !address) {
    msg.textContent = 'Please enter your delivery address.';
    msg.className = 'error';
    return false;
  }

  return true;
}

/* ── ORDER TYPE TOGGLE ── */
function initOrderType() {
  const sel = document.getElementById('orderType');
  const addrLabel = document.getElementById('addressLabel');
  sel?.addEventListener('change', () => {
    if (addrLabel) addrLabel.style.display = sel.value === 'collection' ? 'none' : 'block';
  });
}

/* ── TABLE BOOKING ── */
function submitBooking(e) {
  e.preventDefault();
  const msg = document.getElementById('bookingMsg');
  const name = document.getElementById('bName')?.value;
  const date = document.getElementById('bDate')?.value;
  const time = document.getElementById('bTime')?.value;
  const guests = document.getElementById('bGuests')?.value;
  msg.innerHTML = `<div style="color:var(--green);margin-top:16px;font-weight:600;">
    ✅ Booking request received for ${name}!<br>
    ${guests} guests · ${date} at ${time}<br>
    We'll call you on <a href="tel:02038839233" style="color:var(--fire);">020 3883 9233</a> to confirm.
  </div>`;
  e.target.reset();
}

/* ── LOADER ── */
function initLoader() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader')?.classList.add('hidden');
    }, 1600);
  });
}

/* ── SCROLL TO TOP ── */
function initScrollTop() {
  const btn = document.createElement('button');
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Back to top');
  btn.style.cssText = `
    position:fixed;bottom:28px;left:28px;z-index:500;
    background:var(--surface);border:1px solid #333;
    color:var(--text);width:44px;height:44px;border-radius:50%;
    font-size:1.2rem;cursor:pointer;opacity:0;transition:opacity 0.3s;
    display:flex;align-items:center;justify-content:center;
  `;
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.style.opacity = window.scrollY > 600 ? '1' : '0';
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  buildMenu();
  initSlider();
  initReveal();
  initTilt();
  initParticles();
  initGSAP();
  initStripe();
  initOrderType();
  initScrollTop();
  renderCart();

  // Set min booking date to today
  const bDate = document.getElementById('bDate');
  if (bDate) bDate.min = new Date().toISOString().split('T')[0];
});
