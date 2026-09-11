/* ==============================================================
   SHALOM HYL — SmartShop
   Prototipo funcional de chatbot (datos y stock 100% locales/mock)
   ============================================================== */

/* ---------------------- 1. DATOS MOCK ------------------------ */

const CATEGORY_META = {
  pantalones:  { label: "Pantalones",         emoji: "👖" },
  camisas:     { label: "Camisas",            emoji: "👚" },
  faldas:      { label: "Faldas",             emoji: "👗" },
  exteriores:  { label: "Prendas exteriores", emoji: "🧥" },
  accesorios:  { label: "Accesorios",         emoji: "👜" },
};

function buildStock(sizes, colors, overrides = {}) {
  const stock = {};
  sizes.forEach((s, si) => {
    colors.forEach((c, ci) => {
      const key = s + "|" + c;
      const base = 4 + ((si * 3 + ci * 2) % 5); // 4-8 pseudo-variado
      stock[key] = overrides.hasOwnProperty(key) ? overrides[key] : base;
    });
  });
  return stock;
}

const SIZES_STD = ["S", "M", "L", "XL"];

const PRODUCTS = [
  {
    id: "pantalon-vena", name: "Pantalón Vena", category: "pantalones", price: 60000,
    desc: "Una opción versátil para crear diferentes looks, de tiro alto y caída recta.",
    sizes: SIZES_STD, colors: ["Negro", "Azul", "Beige"],
    stock: buildStock(SIZES_STD, ["Negro", "Azul", "Beige"], { "M|Negro": 5 }),
    featured: true, tiktok: true,
  },
  {
    id: "pantalon-recto", name: "Pantalón Recto", category: "pantalones", price: 60000,
    desc: "Corte recto clásico, ideal para combinar con blazer o camisa satín.",
    sizes: SIZES_STD, colors: ["Negro", "Vinotinto"],
    stock: buildStock(SIZES_STD, ["Negro", "Vinotinto"], { "S|Negro": 0 }),
    featured: true, tiktok: true,
  },
  {
    id: "pantalon-tubo", name: "Pantalón Tubo", category: "pantalones", price: 50000,
    desc: "Silueta ajustada tipo tubo, tendencia total para looks de calle.",
    sizes: SIZES_STD, colors: ["Negro", "Gris"],
    stock: buildStock(SIZES_STD, ["Negro", "Gris"]),
    featured: false, tiktok: false,
  },
  {
    id: "camisa-satin", name: "Camisa Satin", category: "camisas", price: 50000,
    desc: "Camisa en satín con caída fluida y brillo sutil, perfecta para looks de noche.",
    sizes: SIZES_STD, colors: ["Blanco", "Rosa", "Negro"],
    stock: buildStock(SIZES_STD, ["Blanco", "Rosa", "Negro"]),
    featured: true, tiktok: true,
  },
  {
    id: "camisa-matte", name: "Camisa Matte", category: "camisas", price: 50000,
    desc: "Camisa de tacto mate y suave, comodidad total para el día a día.",
    sizes: SIZES_STD, colors: ["Negro", "Beige"],
    stock: buildStock(SIZES_STD, ["Negro", "Beige"]),
    featured: false, tiktok: false,
  },
  {
    id: "falda-cuerina", name: "Falda en Cuerina", category: "faldas", price: 65000,
    desc: "Falda con acabado tipo cuero, para un look statement y actitud urbana.",
    sizes: SIZES_STD, colors: ["Negro", "Café"],
    stock: buildStock(SIZES_STD, ["Negro", "Café"]),
    featured: false, tiktok: false,
  },
  {
    id: "falda-gamuza", name: "Falda en Gamuza", category: "faldas", price: 65000,
    desc: "Textura suave premium, ideal para looks de temporada.",
    sizes: SIZES_STD, colors: ["Camel", "Negro"],
    stock: buildStock(SIZES_STD, ["Camel", "Negro"]),
    featured: false, tiktok: false,
  },
  {
    id: "falda-acetato", name: "Falda en Acetato", category: "faldas", price: 40000,
    desc: "Falda liviana en acetato, ideal para el clima cálido.",
    sizes: SIZES_STD, colors: ["Negro", "Vinotinto"],
    stock: buildStock(SIZES_STD, ["Negro", "Vinotinto"]),
    featured: false, tiktok: false,
  },
  {
    id: "falda-licra-espejo", name: "Falda en Licra Espejo", category: "faldas", price: 68000,
    desc: "El efecto metálico más pedido en TikTok, silueta ajustada y brillo espejo.",
    sizes: SIZES_STD, colors: ["Plateado", "Negro", "Dorado"],
    stock: buildStock(SIZES_STD, ["Plateado", "Negro", "Dorado"], { "M|Plateado": 2 }),
    featured: true, tiktok: true,
  },
  {
    id: "falda-escuba-crepe", name: "Falda en Escuba Crepe", category: "faldas", price: 60000,
    desc: "Estructura firme en tela escuba crepe, silueta perfecta sin marcar.",
    sizes: SIZES_STD, colors: ["Negro", "Beige"],
    stock: buildStock(SIZES_STD, ["Negro", "Beige"]),
    featured: false, tiktok: false,
  },
  {
    id: "blazer", name: "Blazer", category: "exteriores", price: 60000,
    desc: "Blazer estructurado que eleva cualquier outfit en segundos.",
    sizes: SIZES_STD, colors: ["Negro", "Beige", "Vinotinto"],
    stock: buildStock(SIZES_STD, ["Negro", "Beige", "Vinotinto"]),
    featured: false, tiktok: false,
  },
  {
    id: "gaban", name: "Gabán", category: "exteriores", price: 98000,
    desc: "Gabán oversize para looks de abrigo con mucha actitud.",
    sizes: SIZES_STD, colors: ["Negro", "Camel"],
    stock: buildStock(SIZES_STD, ["Negro", "Camel"]),
    featured: true, tiktok: true,
  },
  {
    id: "correa", name: "Correa", category: "accesorios", price: 20000,
    desc: "Correa que complementa y ajusta cualquier prenda de la colección.",
    sizes: ["Única"], colors: ["Negro", "Café"],
    stock: buildStock(["Única"], ["Negro", "Café"]),
    featured: false, tiktok: false,
  },
];

const EMOJI = { pantalones: "👖", camisas: "👚", faldas: "👗", exteriores: "🧥", accesorios: "👜" };

const DEMO_ORDER = {
  "SH-1024": { estado: "🟢 Pedido confirmado", detalle: "Estamos preparando tu pedido. Te notificaremos cuando sea enviado." },
};
const ORDER_STATUS_OPTIONS = [
  "🟡 Pedido recibido", "🔵 En preparación", "🟣 Enviado", "🟢 Entregado",
];

/* ---------------------- 2. ESTADO GLOBAL ---------------------- */

const state = {
  cart: [],           // {productId, size, color, qty}
  ctx: {},            // contexto del paso actual del flujo
  pendingField: null,  // campo de texto que se está esperando
  checkout: {},        // datos que se van llenando
  orders: [],           // pedidos generados en esta sesión
  dashboard: {
    pedidosHoyBase: 7, ventasHoyBase: 612000, clientesBase: 41,
    conversacionesBase: 58,
  },
};

function loadCart() {
  try {
    const raw = localStorage.getItem("shalom_cart");
    if (raw) state.cart = JSON.parse(raw);
  } catch (e) { state.cart = []; }
}
function saveCart() {
  localStorage.setItem("shalom_cart", JSON.stringify(state.cart));
}

/* ---------------------- 3. UTILIDADES -------------------------- */

function formatCOP(n) {
  return "$" + n.toLocaleString("es-CO") + " COP";
}
function findProduct(id) { return PRODUCTS.find(p => p.id === id); }
function stockKey(size, color) { return size + "|" + color; }
function getStock(product, size, color) {
  return product.stock[stockKey(size, color)] ?? 0;
}
function decrementStock(product, size, color, qty) {
  const k = stockKey(size, color);
  product.stock[k] = Math.max(0, (product.stock[k] || 0) - qty);
}
function availability(qty) {
  if (qty <= 0) return { tag: "out", label: "🔴 Agotado" };
  if (qty <= 3) return { tag: "low", label: "🟡 Pocas unidades" };
  return { tag: "in", label: "🟢 Disponible" };
}
function productMinStock(product) {
  return Math.min(...Object.values(product.stock));
}
function productMaxStock(product) {
  return Math.max(...Object.values(product.stock));
}
function randomOrderId() {
  return "SH-" + Math.floor(1000 + Math.random() * 9000);
}
function isBusinessHours(d = new Date()) {
  const day = d.getDay(); // 0 dom - 6 sab
  const hour = d.getHours() + d.getMinutes() / 60;
  const isMonToSat = day >= 1 && day <= 6;
  return isMonToSat && hour >= 8 && hour < 18;
}
function cartTotal() {
  return state.cart.reduce((sum, item) => sum + findProduct(item.productId).price * item.qty, 0);
}
function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}

/* ---------------------- 4. RENDER DE CHAT ----------------------- */

const messagesEl = document.getElementById("messages");
const quickRepliesEl = document.getElementById("quickReplies");

function timestamp() {
  return new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

function addUserMessage(text) {
  const div = document.createElement("div");
  div.className = "msg user";
  div.innerHTML = `<div class="bubble">${escapeHTML(text)}</div><div class="msg-time">${timestamp()}</div>`;
  messagesEl.appendChild(div);
  scrollBottom();
}

function addBotMessageRaw(html) {
  const div = document.createElement("div");
  div.className = "msg bot";
  div.innerHTML = `<div class="bubble">${html}</div><div class="msg-time">${timestamp()}</div>`;
  messagesEl.appendChild(div);
  scrollBottom();
}

function addBotMessage(text, { buttons = null, delay = 380 } = {}) {
  showTyping();
  return new Promise(resolve => {
    setTimeout(() => {
      hideTyping();
      addBotMessageRaw(nl2br(escapeHTML(text)).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"));
      if (buttons) setQuickReplies(buttons);
      resolve();
    }, delay);
  });
}

function addBotHTML(html, { buttons = null, delay = 380 } = {}) {
  showTyping();
  return new Promise(resolve => {
    setTimeout(() => {
      hideTyping();
      addBotMessageRaw(html);
      if (buttons) setQuickReplies(buttons);
      resolve();
    }, delay);
  });
}

function showTyping() {
  const div = document.createElement("div");
  div.className = "msg bot typing";
  div.id = "typingIndicator";
  div.innerHTML = `<div class="bubble"><span class="dot-t"></span><span class="dot-t"></span><span class="dot-t"></span></div>`;
  messagesEl.appendChild(div);
  scrollBottom();
}
function hideTyping() {
  const t = document.getElementById("typingIndicator");
  if (t) t.remove();
}
function scrollBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight + 200;
}
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}
function nl2br(str) { return str.replace(/\n/g, "<br>"); }

function setQuickReplies(buttons) {
  quickRepliesEl.innerHTML = "";
  buttons.forEach(b => {
    const btn = document.createElement("button");
    btn.className = "qr-btn" + (b.style ? " " + b.style : "");
    btn.textContent = b.label;
    btn.dataset.action = b.action;
    if (b.data) Object.entries(b.data).forEach(([k, v]) => (btn.dataset[k] = v));
    btn.addEventListener("click", () => {
      addUserMessage(b.label);
      quickRepliesEl.innerHTML = "";
      dispatch(b.action, btn.dataset);
    });
    quickRepliesEl.appendChild(btn);
  });
}

/* ---------------------- 5. TARJETAS DE PRODUCTO ------------------ */

function productMiniCard(p) {
  const stockNow = productMaxStock(p);
  const av = availability(stockNow);
  return `
  <div class="product-card">
    <div class="product-swatch">${EMOJI[p.category]}</div>
    <div class="pc-body">
      <h4>${p.name}</h4>
      <div class="product-price">${formatCOP(p.price)}</div>
      <span class="avail-tag ${av.tag}">${av.label}</span>
    </div>
  </div>`;
}

function categoryProductsHTML(catKey) {
  const items = PRODUCTS.filter(p => p.category === catKey);
  const cards = items.map(p => `
    <div>
      ${productMiniCard(p)}
      <button class="qr-btn" style="margin-top:6px;width:100%" data-action="ver-producto" data-id="${p.id}">Ver producto</button>
    </div>`).join("");
  return `<div class="product-grid">${cards}</div>`;
}

/* ---------------------- 6. FLUJO PRINCIPAL ----------------------- */

async function boot() {
  loadCart();
  updateCartPill();
  refreshStatus();
  if (!isBusinessHours()) {
    await offHoursGreeting();
  } else {
    await greeting();
  }
}

async function greeting() {
  await addBotMessage(
    "¡Hola! 💕 Bienvenida/o a Shalom HYL.\nSoy el asistente virtual y estoy aquí para ayudarte a encontrar tu próximo look.\n\n¿Qué quieres hacer?",
    { buttons: mainMenuButtons() }
  );
}

function mainMenuButtons() {
  return [
    { label: "🛍️ Ver catálogo", action: "ver-catalogo" },
    { label: "🔥 Productos destacados", action: "ver-destacados" },
    { label: "📦 Consultar pedido", action: "consultar-pedido" },
    { label: "💬 Hablar con asesor", action: "hablar-asesor" },
  ];
}

async function offHoursGreeting() {
  await addBotMessage(
    "🌙 ¡Hola! En este momento estamos fuera de nuestro horario de atención.\n\nPero no te preocupes 💕 Puedes consultar nuestro catálogo, revisar disponibilidad y dejar tu pedido desde aquí.\n\nNuestro equipo te contactará durante nuestro próximo horario de atención.\n\n¿Qué deseas hacer?",
    {
      buttons: [
        { label: "🛍️ Ver catálogo", action: "ver-catalogo" },
        { label: "🛒 Hacer pedido", action: "ver-catalogo" },
        { label: "📦 Consultar pedido", action: "consultar-pedido" },
      ],
    }
  );
}

async function showCatalog() {
  await addBotMessage("¡Perfecto! 💕 Elige una categoría:", {
    buttons: [
      { label: "👖 Pantalones", action: "ver-categoria", data: { cat: "pantalones" } },
      { label: "👚 Camisas", action: "ver-categoria", data: { cat: "camisas" } },
      { label: "👗 Faldas", action: "ver-categoria", data: { cat: "faldas" } },
      { label: "🧥 Prendas exteriores", action: "ver-categoria", data: { cat: "exteriores" } },
      { label: "👜 Accesorios", action: "ver-categoria", data: { cat: "accesorios" } },
      { label: "🏠 Menú principal", action: "menu-principal", style: "ghost" },
    ],
  });
}

async function showCategory(catKey) {
  const meta = CATEGORY_META[catKey];
  await addBotHTML(
    `<p style="margin-bottom:10px">${meta.emoji} <b>${meta.label}</b> — estas son las opciones disponibles:</p>${categoryProductsHTML(catKey)}`,
    {
      buttons: [
        { label: "⬅️ Volver al catálogo", action: "ver-catalogo", style: "ghost" },
        { label: "🏠 Menú principal", action: "menu-principal", style: "ghost" },
      ],
    }
  );
}

async function showFeatured() {
  const items = PRODUCTS.filter(p => p.featured);
  const cards = items.map(p => `
    <div>
      ${productMiniCard(p)}
      <button class="qr-btn" style="margin-top:6px;width:100%" data-action="ver-producto" data-id="${p.id}">Ver producto</button>
    </div>`).join("");
  await addBotHTML(`<p style="margin-bottom:10px">🔥 <b>Productos destacados</b> — lo más pedido esta semana:</p><div class="product-grid">${cards}</div>`, {
    buttons: [{ label: "🏠 Menú principal", action: "menu-principal", style: "ghost" }],
  });
}

async function tiktokEntry() {
  const items = PRODUCTS.filter(p => p.tiktok);
  const list = items.map(p => `${EMOJI[p.category]} ${p.name} — ${formatCOP(p.price)}`).join("\n");
  await addBotMessage(
    `¡Hola! 💕 Vimos que vienes desde TikTok.\n\nTenemos estos productos disponibles para ti:\n\n🔥 Más vendidos\n${list}\n\n¿Quieres verlos?`,
    {
      buttons: [
        { label: "🔥 Ver productos", action: "ver-destacados" },
        { label: "🛍️ Ver catálogo completo", action: "ver-catalogo" },
      ],
    }
  );
}

async function showProduct(id) {
  const p = findProduct(id);
  state.ctx = { productId: id };
  const sizesLine = p.sizes.join(" | ");
  const colorsLine = p.colors.join(" | ");
  const anyStock = productMaxStock(p) > 0;
  const av = availability(productMaxStock(p));
  await addBotMessage(
    `**${p.name}**\n${formatCOP(p.price)}\n\n${p.desc}\n\nTallas disponibles:\n${sizesLine}\n\nColores disponibles:\n${colorsLine}\n\nDisponibilidad: ${av.label}`,
    {
      buttons: [
        anyStock
          ? { label: "Agregar al carrito", action: "agregar-carrito-inicio", data: { id }, style: "primary" }
          : { label: "🔴 Producto agotado", action: "producto-agotado", data: { id } },
        { label: "⬅️ Volver al catálogo", action: "ver-catalogo", style: "ghost" },
        { label: "🏠 Menú principal", action: "menu-principal", style: "ghost" },
      ],
    }
  );
}

async function productAgotado() {
  await addBotMessage(
    "😔 Lo sentimos, este producto no está disponible en este momento.\n\nTe recomendamos revisar otras opciones de nuestro catálogo o los productos destacados.",
    {
      buttons: [
        { label: "🔥 Ver destacados", action: "ver-destacados" },
        { label: "🛍️ Ver catálogo", action: "ver-catalogo" },
        { label: "🏠 Menú principal", action: "menu-principal", style: "ghost" },
      ],
    }
  );
}

async function askSize(id) {
  const p = findProduct(id);
  state.ctx = { productId: id };
  await addBotMessage("¿Qué talla necesitas?", {
    buttons: p.sizes.map(s => ({ label: s, action: "elegir-talla", data: { id, size: s } })),
  });
}

async function askColor(id, size) {
  const p = findProduct(id);
  state.ctx = { productId: id, size };
  const availableColors = p.colors.filter(c => getStock(p, size, c) > 0);
  if (availableColors.length === 0) {
    await addBotMessage(
      `⚠️ Lo sentimos, no quedan unidades disponibles en la talla ${size} para ningún color.`,
      { buttons: [
        { label: "Elegir otra talla", action: "agregar-carrito-inicio", data: { id } },
        { label: "⬅️ Volver al producto", action: "ver-producto", data: { id }, style: "ghost" },
      ]}
    );
    return;
  }
  await addBotMessage("¡Perfecto! ¿Qué color prefieres?", {
    buttons: p.colors.map(c => {
      const st = getStock(p, size, c);
      return { label: st > 0 ? c : `${c} (agotado)`, action: st > 0 ? "elegir-color" : "color-agotado", data: { id, size, color: c } };
    }),
  });
}

async function colorAgotado(id, size, color) {
  await addBotMessage(`⚠️ Lo sentimos, el color ${color} está agotado en talla ${size}. Elige otro color disponible.`);
  await askColor(id, size);
}

async function askQty(id, size, color) {
  const p = findProduct(id);
  const stockNow = getStock(p, size, color);
  state.ctx = { productId: id, size, color, qty: 1, maxQty: stockNow };
  await renderQtyStep();
}

async function renderQtyStep() {
  const { qty, maxQty } = state.ctx;
  await addBotMessage(`¿Cuántas unidades quieres? (disponibles: ${maxQty})`, {
    buttons: [
      { label: "−", action: "qty-menos", style: "qty" },
      { label: String(qty), action: "qty-noop", style: "qty ghost" },
      { label: "+", action: "qty-mas", style: "qty" },
      { label: "Agregar al carrito", action: "confirmar-agregar", style: "primary" },
    ],
  });
}

function qtyChange(delta) {
  const ctx = state.ctx;
  let newQty = ctx.qty + delta;
  if (newQty < 1) newQty = 1;
  if (newQty > ctx.maxQty) {
    addBotMessage(`⚠️ Lo sentimos, solo tenemos ${ctx.maxQty} unidades disponibles en esta talla y color.`);
    newQty = ctx.maxQty;
  }
  ctx.qty = newQty;
  renderQtyStep();
}

async function confirmAddToCart() {
  const { productId, size, color, qty, maxQty } = state.ctx;
  if (qty > maxQty) {
    await addBotMessage(`⚠️ Lo sentimos, solo tenemos ${maxQty} unidades disponibles en esta talla y color.`);
    return;
  }
  const p = findProduct(productId);
  const existing = state.cart.find(i => i.productId === productId && i.size === size && i.color === color);
  if (existing) existing.qty += qty; else state.cart.push({ productId, size, color, qty });
  saveCart();
  updateCartPill();

  await addBotMessage(
    `✅ Producto agregado al carrito.\n\n**${p.name}**\nTalla: ${size}\nColor: ${color}\nCantidad: ${qty}\nSubtotal: ${formatCOP(p.price * qty)}`,
    {
      buttons: [
        { label: "🛒 Ver carrito", action: "ver-carrito" },
        { label: "🛍️ Seguir comprando", action: "ver-catalogo" },
        { label: "💳 Finalizar compra", action: "finalizar-compra", style: "primary" },
      ],
    }
  );
}

function cartHTML() {
  if (state.cart.length === 0) return "<p>Tu carrito está vacío.</p>";
  const lines = state.cart.map((item, idx) => {
    const p = findProduct(item.productId);
    return `<div class="cart-line"><span>${p.name} · ${item.size} · ${item.color} × ${item.qty}</span><span>${formatCOP(p.price * item.qty)}</span></div>`;
  }).join("");
  return `<div class="cart-box">${lines}<div class="cart-total"><span>Total</span><span>${formatCOP(cartTotal())}</span></div></div>`;
}

async function showCart() {
  if (state.cart.length === 0) {
    await addBotMessage("Tu carrito está vacío. 🛍️ ¡Explora el catálogo y encuentra tu próximo look!", {
      buttons: [{ label: "🛍️ Ver catálogo", action: "ver-catalogo", style: "primary" }],
    });
    return;
  }
  await addBotHTML(`<p style="margin-bottom:8px">🛒 <b>Tu carrito</b></p>${cartHTML()}`, {
    buttons: [
      { label: "➕ Seguir comprando", action: "ver-catalogo" },
      { label: "✏️ Modificar", action: "modificar-carrito" },
      { label: "🗑️ Eliminar", action: "eliminar-carrito" },
      { label: "💳 Finalizar compra", action: "finalizar-compra", style: "primary" },
    ],
  });
}

async function modifyCartMenu() {
  if (state.cart.length === 0) { await showCart(); return; }
  const buttons = state.cart.map((item, idx) => {
    const p = findProduct(item.productId);
    return { label: `${p.name} (${item.size}/${item.color})`, action: "modificar-item", data: { idx } };
  });
  buttons.push({ label: "⬅️ Volver al carrito", action: "ver-carrito", style: "ghost" });
  await addBotMessage("¿Qué producto quieres modificar?", { buttons });
}

async function modifyItem(idx) {
  const item = state.cart[idx];
  const p = findProduct(item.productId);
  const maxQty = getStock(p, item.size, item.color); // el stock no se descuenta hasta confirmar el pedido
  state.ctx = { editIndex: idx, productId: item.productId, size: item.size, color: item.color, qty: item.qty, maxQty };
  await addBotMessage(`Editando: **${p.name}** (${item.size}/${item.color})`, {
    buttons: [
      { label: "−", action: "editqty-menos", style: "qty" },
      { label: String(item.qty), action: "qty-noop", style: "qty ghost" },
      { label: "+", action: "editqty-mas", style: "qty" },
      { label: "Guardar cambios", action: "guardar-edicion", style: "primary" },
    ],
  });
}

function editQtyChange(delta) {
  const ctx = state.ctx;
  let q = ctx.qty + delta;
  if (q < 1) q = 1;
  if (q > ctx.maxQty) { addBotMessage(`⚠️ Solo hay ${ctx.maxQty} unidades disponibles en total para esta combinación.`); q = ctx.maxQty; }
  ctx.qty = q;
  const p = findProduct(ctx.productId);
  quickRepliesEl.innerHTML = "";
  setQuickReplies([
    { label: "−", action: "editqty-menos", style: "qty" },
    { label: String(q), action: "qty-noop", style: "qty ghost" },
    { label: "+", action: "editqty-mas", style: "qty" },
    { label: "Guardar cambios", action: "guardar-edicion", style: "primary" },
  ]);
}

async function saveEdition() {
  const { editIndex, qty } = state.ctx;
  state.cart[editIndex].qty = qty;
  saveCart(); updateCartPill();
  await addBotMessage("✅ Carrito actualizado.");
  await showCart();
}

async function deleteMenu() {
  if (state.cart.length === 0) { await showCart(); return; }
  const buttons = state.cart.map((item, idx) => {
    const p = findProduct(item.productId);
    return { label: `🗑️ ${p.name} (${item.size}/${item.color})`, action: "eliminar-item", data: { idx } };
  });
  buttons.push({ label: "⬅️ Volver al carrito", action: "ver-carrito", style: "ghost" });
  await addBotMessage("¿Qué producto quieres eliminar?", { buttons });
}

async function deleteItem(idx) {
  const [removed] = state.cart.splice(idx, 1);
  saveCart(); updateCartPill();
  const p = findProduct(removed.productId);
  await addBotMessage(`🗑️ Se eliminó **${p.name}** del carrito.`);
  await showCart();
}

/* ---------------------- 7. CHECKOUT ------------------------------ */

const CHECKOUT_FIELDS = [
  { key: "nombre", prompt: "Para tu pedido, dime tu **nombre completo**:" },
  { key: "telefono", prompt: "¿Cuál es tu **número de teléfono**?" },
  { key: "ciudad", prompt: "¿En qué **ciudad** te encuentras?" },
  { key: "direccion", prompt: "Por último, indica tu **dirección de entrega**:" },
];

async function startCheckout() {
  if (state.cart.length === 0) {
    await addBotMessage("Tu carrito está vacío, agrega productos antes de finalizar la compra. 🛍️", {
      buttons: [{ label: "🛍️ Ver catálogo", action: "ver-catalogo", style: "primary" }],
    });
    return;
  }
  state.checkout = {};
  await askNextCheckoutField(0);
}

async function askNextCheckoutField(i) {
  if (i >= CHECKOUT_FIELDS.length) { await askPaymentMethod(); return; }
  state.pendingField = CHECKOUT_FIELDS[i].key;
  state.ctx.fieldIndex = i;
  await addBotMessage(CHECKOUT_FIELDS[i].prompt);
}

async function handleCheckoutTextField(value) {
  state.checkout[state.pendingField] = value;
  const nextIndex = state.ctx.fieldIndex + 1;
  state.pendingField = null;
  await askNextCheckoutField(nextIndex);
}

async function askPaymentMethod() {
  await addBotMessage("¿Cómo prefieres pagar?", {
    buttons: [
      { label: "Nequi", action: "elegir-pago", data: { metodo: "Nequi" } },
      { label: "Daviplata", action: "elegir-pago", data: { metodo: "Daviplata" } },
      { label: "Transferencia bancaria", action: "elegir-pago", data: { metodo: "Transferencia bancaria" } },
      { label: "Pago contra entrega", action: "elegir-pago", data: { metodo: "Pago contra entrega" } },
      { label: "Otro", action: "elegir-pago", data: { metodo: "Otro" } },
    ],
  });
}

async function showOrderSummary(metodo) {
  state.checkout.metodo = metodo;
  const productLines = state.cart.map(item => {
    const p = findProduct(item.productId);
    return `• ${p.name} (${item.size}/${item.color}) × ${item.qty} — ${formatCOP(p.price * item.qty)}`;
  }).join("\n");
  const c = state.checkout;
  await addBotMessage(
    `✨ **RESUMEN DE TU PEDIDO**\n\nCliente: ${c.nombre}\nTeléfono: ${c.telefono}\nCiudad: ${c.ciudad}\nDirección: ${c.direccion}\nMétodo de pago: ${metodo}\n\nProductos:\n${productLines}\n\nTotal: ${formatCOP(cartTotal())}\n\n¿Confirmas tu pedido?`,
    {
      buttons: [
        { label: "✅ Confirmar pedido", action: "confirmar-pedido", style: "primary" },
        { label: "✏️ Modificar pedido", action: "ver-carrito" },
        { label: "❌ Cancelar", action: "cancelar-pedido" },
      ],
    }
  );
}

async function confirmOrder() {
  // descuenta stock real
  state.cart.forEach(item => {
    const p = findProduct(item.productId);
    decrementStock(p, item.size, item.color, item.qty);
  });
  const orderId = randomOrderId();
  const order = {
    id: orderId,
    cliente: state.checkout.nombre,
    total: cartTotal(),
    items: [...state.cart],
    estado: ORDER_STATUS_OPTIONS[0],
    hora: timestamp(),
  };
  state.orders.push(order);
  state.cart = [];
  saveCart();
  updateCartPill();
  renderDashboard();

  await addBotMessage(
    `🎉 ¡Pedido recibido!\n\nTu pedido ha sido registrado correctamente.\n\nNúmero de pedido: #${orderId}\n\nNuestro equipo se pondrá en contacto contigo para confirmar los detalles de entrega y pago.\n\n¡Gracias por comprar en Shalom HYL! 💕`,
    {
      buttons: [
        { label: "🛍️ Seguir comprando", action: "ver-catalogo" },
        { label: "🏠 Volver al inicio", action: "menu-principal" },
      ],
    }
  );
}

async function cancelOrder() {
  await addBotMessage("❌ Tu pedido fue cancelado. Tu carrito sigue disponible por si deseas continuar más tarde.", {
    buttons: [
      { label: "🛒 Ver carrito", action: "ver-carrito" },
      { label: "🏠 Menú principal", action: "menu-principal", style: "ghost" },
    ],
  });
}

/* ---------------------- 8. CONSULTAR PEDIDO / ASESOR --------------- */

async function askOrderNumber() {
  state.pendingField = "orderLookup";
  await addBotMessage("Escribe tu número de pedido.\n\nEjemplo: SH-1024");
}

async function handleOrderLookup(value) {
  state.pendingField = null;
  const idRaw = value.trim().toUpperCase();
  let estado, detalle;
  if (DEMO_ORDER[idRaw]) {
    estado = DEMO_ORDER[idRaw].estado;
    detalle = DEMO_ORDER[idRaw].detalle;
  } else {
    const sessionOrder = state.orders.find(o => o.id === idRaw);
    if (sessionOrder) {
      estado = sessionOrder.estado;
      detalle = "Gracias por tu compra, te mantendremos informada/o del proceso de entrega.";
    } else {
      await addBotMessage(`No encontramos el pedido **${idRaw}**. Verifica el número e inténtalo de nuevo, o contacta a un asesor.`, {
        buttons: [
          { label: "📦 Intentar de nuevo", action: "consultar-pedido" },
          { label: "💬 Hablar con asesor", action: "hablar-asesor" },
          { label: "🏠 Menú principal", action: "menu-principal", style: "ghost" },
        ],
      });
      return;
    }
  }
  await addBotMessage(`📦 Pedido #${idRaw}\n\nEstado:\n${estado}\n\n${detalle}`, {
    buttons: [{ label: "🏠 Menú principal", action: "menu-principal", style: "ghost" }],
  });
}

async function talkToAdvisor() {
  const withinHours = isBusinessHours();
  const extra = withinHours
    ? "\n\n✅ Estamos dentro del horario de atención: te transferimos con una asesora en un momento (simulado)."
    : "";
  await addBotMessage(
    `Claro 💕 Puedes comunicarte con uno de nuestros asesores.\n\nNuestro horario de atención es:\nLunes a sábado\n8:00 a.m. — 6:00 p.m.${extra}\n\nMientras esperas, también puedes consultar el catálogo y verificar la disponibilidad de nuestros productos.`,
    {
      buttons: [
        { label: "🛍️ Ver catálogo", action: "ver-catalogo" },
        { label: "🏠 Menú principal", action: "menu-principal", style: "ghost" },
      ],
    }
  );
}

/* ---------------------- 9. BÚSQUEDA POR TEXTO ---------------------- */

async function searchProducts(query) {
  const q = query.toLowerCase();
  const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q));
  if (matches.length === 0) {
    await addBotMessage(`No encontré productos para "${query}". Prueba con el nombre de una prenda o explora el catálogo. 💕`, {
      buttons: [{ label: "🛍️ Ver catálogo", action: "ver-catalogo", style: "primary" }],
    });
    return;
  }
  const cards = matches.map(p => `
    <div>
      ${productMiniCard(p)}
      <button class="qr-btn" style="margin-top:6px;width:100%" data-action="ver-producto" data-id="${p.id}">Ver producto</button>
    </div>`).join("");
  await addBotHTML(`<p style="margin-bottom:10px">Encontré esto para ti 💕:</p><div class="product-grid">${cards}</div>`, {
    buttons: [{ label: "🏠 Menú principal", action: "menu-principal", style: "ghost" }],
  });
}

/* ---------------------- 10. DISPATCH DE ACCIONES -------------------- */

async function dispatch(action, data = {}) {
  switch (action) {
    case "menu-principal": await greeting(); break;
    case "ver-catalogo": await showCatalog(); break;
    case "ver-categoria": await showCategory(data.cat); break;
    case "ver-destacados": await showFeatured(); break;
    case "entrada-tiktok": await tiktokEntry(); break;
    case "ver-producto": await showProduct(data.id); break;
    case "producto-agotado": await productAgotado(); break;
    case "agregar-carrito-inicio": await askSize(data.id); break;
    case "elegir-talla": await askColor(data.id, data.size); break;
    case "color-agotado": await colorAgotado(data.id, data.size, data.color); break;
    case "elegir-color": await askQty(data.id, data.size, data.color); break;
    case "qty-menos": qtyChange(-1); break;
    case "qty-mas": qtyChange(1); break;
    case "qty-noop": break;
    case "confirmar-agregar": await confirmAddToCart(); break;
    case "ver-carrito": await showCart(); break;
    case "modificar-carrito": await modifyCartMenu(); break;
    case "modificar-item": await modifyItem(Number(data.idx)); break;
    case "editqty-menos": editQtyChange(-1); break;
    case "editqty-mas": editQtyChange(1); break;
    case "guardar-edicion": await saveEdition(); break;
    case "eliminar-carrito": await deleteMenu(); break;
    case "eliminar-item": await deleteItem(Number(data.idx)); break;
    case "finalizar-compra": await startCheckout(); break;
    case "elegir-pago": await showOrderSummary(data.metodo); break;
    case "confirmar-pedido": await confirmOrder(); break;
    case "cancelar-pedido": await cancelOrder(); break;
    case "consultar-pedido": await askOrderNumber(); break;
    case "hablar-asesor": await talkToAdvisor(); break;
    default: break;
  }
}

/* Delegación global de clicks (tarjetas de producto dentro de mensajes, banner TikTok, carrito, tabs) */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;

  // Acciones que ya viven dentro de setQuickReplies tienen su propio listener;
  // esto cubre botones incrustados en tarjetas HTML (ver-producto) y el banner/carrito.
  if (el.classList.contains("qr-btn") && el.parentElement.id === "quickReplies") return;

  if (action === "ver-producto") { addUserMessage(`Ver ${findProduct(el.dataset.id).name}`); dispatch(action, el.dataset); return; }
  if (action === "entrada-tiktok") { addUserMessage("🔥 Llegué desde TikTok"); dispatch(action); return; }
  if (action === "ver-carrito" && el.id === "cartPill") { addUserMessage("🛒 Ver carrito"); dispatch(action); return; }
});

/* ---------------------- 11. CAMPO DE TEXTO (composer) --------------- */

const composer = document.getElementById("composer");
const composerInput = document.getElementById("composerInput");

composer.addEventListener("submit", async (e) => {
  e.preventDefault();
  const value = composerInput.value.trim();
  if (!value) return;
  composerInput.value = "";
  addUserMessage(value);
  quickRepliesEl.innerHTML = "";

  if (state.pendingField === "orderLookup") { await handleOrderLookup(value); return; }
  if (state.pendingField) { await handleCheckoutTextField(value); return; }
  await searchProducts(value);
});

/* ---------------------- 12. CARRITO / STATUS UI --------------------- */

function updateCartPill() {
  document.getElementById("cartCount").textContent = cartCount();
}

function refreshStatus() {
  const within = isBusinessHours();
  const pill = document.getElementById("statusPill");
  const statusText = document.getElementById("statusText");
  const subtitle = document.getElementById("chatSubtitle");
  if (within) {
    pill.classList.remove("offline");
    statusText.textContent = "En línea";
    subtitle.textContent = "Asistente virtual · en línea";
    subtitle.classList.remove("offline");
  } else {
    pill.classList.add("offline");
    statusText.textContent = "Fuera de horario";
    subtitle.textContent = "Asistente virtual · disponible 24/7 · fuera de horario de asesores";
    subtitle.classList.add("offline");
  }
}

/* ---------------------- 13. TABS (rail + mobile) --------------------- */

function switchTab(tab) {
  document.querySelectorAll(".panel").forEach(p => p.classList.add("hidden"));
  document.getElementById("panel-" + tab).classList.remove("hidden");
  document.querySelectorAll(".rail-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.querySelectorAll(".mtab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  if (tab === "dashboard") renderDashboard();
  if (tab === "proyecto") renderProyecto();
}
document.querySelectorAll(".rail-tab, .mtab").forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

document.getElementById("resetBtn").addEventListener("click", () => {
  messagesEl.innerHTML = "";
  quickRepliesEl.innerHTML = "";
  state.ctx = {}; state.pendingField = null; state.checkout = {};
  boot();
});

/* ---------------------- 14. DASHBOARD -------------------------------- */

function renderDashboard() {
  const d = state.dashboard;
  const pedidosHoy = d.pedidosHoyBase + state.orders.length;
  const ventasHoy = d.ventasHoyBase + state.orders.reduce((s, o) => s + o.total, 0);
  const kpis = [
    { label: "Pedidos hoy", value: pedidosHoy },
    { label: "Ventas hoy", value: formatCOP(ventasHoy) },
    { label: "Clientes atendidos por el chatbot", value: d.clientesBase + state.orders.length },
    { label: "Conversaciones automatizadas", value: d.conversacionesBase },
    { label: "Productos con stock bajo", value: PRODUCTS.filter(p => productMinStock(p) > 0 && productMinStock(p) <= 3).length },
    { label: "Productos agotados", value: PRODUCTS.filter(p => productMaxStock(p) === 0 || Object.values(p.stock).some(s => s === 0)).length },
  ];
  document.getElementById("kpiGrid").innerHTML = kpis.map(k => `
    <div class="kpi"><div class="kpi-value">${k.value}</div><div class="kpi-label">${k.label}</div></div>
  `).join("");

  const before = 30, after = 60 + state.orders.length;
  const maxBar = Math.max(before, after);
  document.getElementById("barChart").innerHTML = `
    <div class="bar-group">
      <div class="bar" style="height:${(before / maxBar) * 110}px"><span class="bar-num">${before}</span></div>
      <span class="bar-label">Antes del chatbot</span>
    </div>
    <div class="bar-group">
      <div class="bar after" style="height:${(after / maxBar) * 110}px"><span class="bar-num">${after}</span></div>
      <span class="bar-label">Después del chatbot</span>
    </div>
  `;

  const stockRows = PRODUCTS.map(p => {
    const combos = Object.entries(p.stock);
    const lowest = combos.reduce((min, [, v]) => Math.min(min, v), Infinity);
    const av = availability(lowest);
    return `<div class="st-row">
      <span>${p.name}</span>
      <span>${CATEGORY_META[p.category].label}</span>
      <span>${lowest} u. (mín. talla/color)</span>
      <span class="avail-tag ${av.tag}">${av.label}</span>
    </div>`;
  }).join("");
  document.getElementById("stockTable").innerHTML = `
    <div class="st-row head"><span>Producto</span><span>Categoría</span><span>Stock</span><span>Estado</span></div>
    ${stockRows}`;

  const allOrders = [
    { id: "SH-1024", cliente: "Cliente demo", total: 60000, estado: "🟢 Pedido confirmado" },
    ...state.orders.map(o => ({ id: o.id, cliente: o.cliente, total: o.total, estado: o.estado })),
  ];
  const orderRows = allOrders.map(o => `
    <div class="ot-row">
      <span>#${o.id}</span>
      <span>${o.cliente}</span>
      <span>${formatCOP(o.total)}</span>
      <span>${o.estado}</span>
    </div>`).join("");
  document.getElementById("ordersTable").innerHTML = `
    <div class="ot-row head"><span>Pedido</span><span>Cliente</span><span>Total</span><span>Estado</span></div>
    ${orderRows}`;
}

/* ---------------------- 15. FICHA DEL PROYECTO ------------------------ */

function renderProyecto() {
  document.getElementById("proyectoDoc").innerHTML = `
    <div class="doc-block">
      <h3>A. Nombre de la solución</h3>
      <p><b>Shalom HYL SmartShop</b> — asistente conversacional de catálogo y ventas.</p>
    </div>
    <div class="doc-block">
      <h3>B. Descripción</h3>
      <p>Chatbot de atención y ventas que recibe prospectos desde TikTok, muestra el catálogo con disponibilidad real, guía la selección de talla, color y cantidad, arma el carrito, calcula el total y cierra el pedido, incluso fuera del horario laboral.</p>
    </div>
    <div class="doc-block">
      <h3>C. Problema que soluciona</h3>
      <p>La toma manual de pedidos por WhatsApp, sin sincronización con el stock real y sin respuesta fuera de horario, generaba pérdida de prospectos, saturación del canal y una experiencia de compra lenta.</p>
    </div>
    <div class="doc-block">
      <h3>D. Causas que ataca</h3>
      <ul>
        <li>Proceso manual de toma de pedidos.</li>
        <li>Catálogo desincronizado del stock real.</li>
        <li>Ausencia de respuesta fuera del horario laboral.</li>
      </ul>
    </div>
    <div class="doc-block">
      <h3>E. Consecuencias que busca reducir</h3>
      <ul>
        <li>Pérdida de prospectos de TikTok.</li>
        <li>Saturación del canal de WhatsApp.</li>
        <li>Disminución de ventas mensuales.</li>
        <li>Mala experiencia del usuario.</li>
      </ul>
    </div>
    <div class="doc-block">
      <h3>F. Tecnología utilizada</h3>
      <p>HTML5, CSS3 y JavaScript puro (sin frameworks ni APIs externas). Datos de catálogo, stock y pedidos manejados como objetos JS locales; carrito persistido en <code>localStorage</code>.</p>
    </div>
    <div class="doc-block">
      <h3>G. Beneficios para la empresa</h3>
      <ul>
        <li>Menos mensajes manuales que responder.</li>
        <li>Cero ventas de productos agotados.</li>
        <li>Atención continua, incluso de noche o domingo.</li>
        <li>Visibilidad de ventas e inventario en un dashboard.</li>
      </ul>
    </div>
    <div class="doc-block">
      <h3>H. Beneficios para la clienta</h3>
      <ul>
        <li>Respuesta inmediata, sin esperar a un vendedor.</li>
        <li>Catálogo claro, con precios y tallas visibles.</li>
        <li>Compra en pocos toques, sin escribir de más.</li>
        <li>Puede comprar de día, de noche o fin de semana.</li>
      </ul>
    </div>
    <div class="doc-block">
      <h3>I. Indicadores / KPIs sugeridos</h3>
      <ul>
        <li>Tiempo promedio de respuesta.</li>
        <li>Número de pedidos automatizados por el chatbot.</li>
        <li>Tasa de conversión de TikTok a compra.</li>
        <li>Clientes atendidos fuera de horario.</li>
        <li>Ventas mensuales.</li>
        <li>Carritos abandonados.</li>
        <li>Productos agotados vendidos por error (meta: 0).</li>
        <li>Tiempo promedio para completar un pedido.</li>
      </ul>
    </div>
    <div class="doc-block">
      <h3>Flujo del prototipo (baja fidelidad)</h3>
      <div class="flow-diagram">INICIO
  ↓
SALUDO
  ↓
VER CATÁLOGO ⇄ PRODUCTOS DESTACADOS ⇄ ENTRADA TIKTOK
  ↓
CATEGORÍA
  ↓
PRODUCTO ──→ (agotado) ──→ sugerir otro producto
  ↓
TALLA
  ↓
COLOR ──→ (agotado) ──→ elegir otro color
  ↓
CANTIDAD ──→ (excede stock) ──→ ajustar al máximo disponible
  ↓
CARRITO ⇄ seguir comprando / modificar / eliminar
  ↓
DATOS DEL CLIENTE (nombre, teléfono, ciudad, dirección)
  ↓
MÉTODO DE PAGO
  ↓
RESUMEN ──→ cancelar ──→ vuelve al carrito
  ↓
CONFIRMACIÓN
  ↓
PEDIDO #SH-XXXX

Rutas siempre disponibles: 🏠 Menú principal · 💬 Hablar con asesor · 📦 Consultar pedido · 🌙 Fuera de horario</div>
    </div>
    <div class="doc-block">
      <h3>Mapa problema → solución → resultado</h3>
      <div class="problem-map">
        <div class="pm-item"><div class="pm-k">Problema: proceso manual de pedidos</div><div class="pm-s">Solución: automatización del flujo de compra</div><div class="pm-r">Resultado: menor carga y menos errores</div></div>
        <div class="pm-item"><div class="pm-k">Problema: catálogo desactualizado</div><div class="pm-s">Solución: stock conectado al catálogo</div><div class="pm-r">Resultado: menos pedidos de productos agotados</div></div>
        <div class="pm-item"><div class="pm-k">Problema: sin atención fuera de horario</div><div class="pm-s">Solución: chatbot disponible 24/7</div><div class="pm-r">Resultado: menor pérdida de prospectos</div></div>
        <div class="pm-item"><div class="pm-k">Problema: pérdida de clientes de TikTok</div><div class="pm-s">Solución: entrada directa desde TikTok</div><div class="pm-r">Resultado: mayor conversión de prospectos</div></div>
      </div>
    </div>
  `;
}

/* ---------------------- 16. INICIO ------------------------------------ */

boot();
