/* =========================================================
   SHALOM H&L — Sistema funcional de inventario
   Persistencia: LocalStorage
   ========================================================= */

(() => {
  "use strict";

  const KEY = "shalom_hl_inventory_v1";
  const money = new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0
  });
  const dateFmt = new Intl.DateTimeFormat("es-CO", {
    year: "numeric", month: "2-digit", day: "2-digit"
  });

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const today = () => new Date().toISOString().slice(0, 10);
  const uid = (p) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const seed = {
    products: [
      {id:"p1",code:"SHL-001",name:"Vestido floral",category:"Vestidos",subcategory:"Floral",brand:"Shalom",color:"Rosado",size:"M",material:"Poliéster",purchasePrice:60000,salePrice:110000,stock:8,minStock:3,supplier:"Textiles Andinos",entryDate:"2026-09-01",status:"Activo",image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80"},
      {id:"p2",code:"SHL-002",name:"Blusa satinada",category:"Blusas",subcategory:"Satinada",brand:"Shalom",color:"Negro",size:"S",material:"Satén",purchasePrice:35000,salePrice:70000,stock:4,minStock:5,supplier:"Moda Colombia",entryDate:"2026-09-01",status:"Activo",image:"https://images.unsplash.com/photo-1564257577054-9e4d7c6c5e9a?auto=format&fit=crop&w=300&q=80"},
      {id:"p3",code:"SHL-003",name:"Jean clásico",category:"Jeans",subcategory:"Clásico",brand:"Shalom",color:"Azul",size:"10",material:"Denim",purchasePrice:70000,salePrice:130000,stock:0,minStock:3,supplier:"Denim House",entryDate:"2026-08-28",status:"Activo",image:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=300&q=80"},
      {id:"p4",code:"SHL-004",name:"Saco tejido",category:"Sacos",subcategory:"Tejido",brand:"Shalom",color:"Beige",size:"L",material:"Acrílico",purchasePrice:55000,salePrice:95000,stock:12,minStock:4,supplier:"Textiles Andinos",entryDate:"2026-09-02",status:"Activo",image:"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=300&q=80"},
      {id:"p5",code:"SHL-005",name:"Falda plisada",category:"Faldas",subcategory:"Plisada",brand:"Shalom",color:"Vino",size:"M",material:"Poliéster",purchasePrice:42000,salePrice:85000,stock:2,minStock:3,supplier:"Moda Colombia",entryDate:"2026-09-03",status:"Activo",image:"https://images.unsplash.com/photo-1583496661160-fb5886a13d27?auto=format&fit=crop&w=300&q=80"}
    ],
    sales: [],
    entries: [],
    users: [{id:"u1",name:"Leidy Maldonado",role:"Administradora"}]
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(seed);
      const data = JSON.parse(raw);
      return {
        products: Array.isArray(data.products) ? data.products : [],
        sales: Array.isArray(data.sales) ? data.sales : [],
        entries: Array.isArray(data.entries) ? data.entries : [],
        users: Array.isArray(data.users) ? data.users : seed.users
      };
    } catch { return structuredClone(seed); }
  }

  let db = load();
  let state = { page:"dashboard", invQuery:"", invCategory:"", invSize:"", invColor:"",
                invAvailability:"", invSort:"", salesFrom:"", salesTo:"", salesQuery:"",
                salesPayment:"", salesSeller:"", reportRange:"month" };

  function save() { localStorage.setItem(KEY, JSON.stringify(db)); updateBadges(); }
  function fmt(n) { return money.format(Number(n) || 0); }
  function niceDate(d) { return d ? dateFmt.format(new Date(`${d}T00:00:00`)) : "—"; }
  function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
  function productById(id) { return db.products.find(p => p.id === id); }
  function status(p) {
    if (p.stock <= 0) return ["Agotado","danger"];
    if (p.stock <= p.minStock) return ["Stock bajo","warn"];
    return ["Disponible","ok"];
  }
  function totalSoldUnits() { return db.sales.reduce((a,s)=>a+s.quantity,0); }
  function totalRevenue() { return db.sales.reduce((a,s)=>a+s.total,0); }
  function totalProfit() { return db.sales.reduce((a,s)=>a+s.profit,0); }
  function lowStock() { return db.products.filter(p => p.stock > 0 && p.stock <= p.minStock); }
  function outStock() { return db.products.filter(p => p.stock <= 0); }

  function toast(msg, type="success") {
    const box = $("#toastStack");
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  function updateBadges() {
    const r = $("#badgeReponer"), a = $("#badgeAgotados");
    const lr = lowStock().length, la = outStock().length;
    r.textContent = lr; r.hidden = lr === 0;
    a.textContent = la; a.hidden = la === 0;
    $("#bellDot").hidden = lr + la === 0;
  }

  function layout(title, subtitle, actions="") {
    return `<div class="page-head"><div><h1>${title}</h1><p class="sub">${subtitle}</p></div><div class="page-actions">${actions}</div></div>`;
  }

  function renderDashboard() {
    const low = lowStock(), out = outStock();
    const recent = [...db.sales].sort((a,b)=>b.timestamp.localeCompare(a.timestamp)).slice(0,6);
    return layout("Panel general","Resumen de inventario, ventas y alertas.",
      `<button class="btn btn-primary" data-action="new-product">＋ Agregar producto</button><button class="btn btn-outline" data-action="new-sale">＋ Registrar venta</button>`) +
      `<div class="stat-grid">
        <div class="stat-card"><div class="label">📦 Productos</div><div class="value">${db.products.length}</div></div>
        <div class="stat-card"><div class="label">Unidades en stock</div><div class="value">${db.products.reduce((a,p)=>a+p.stock,0)}</div></div>
        <div class="stat-card"><div class="label">Ventas acumuladas</div><div class="value wine">${fmt(totalRevenue())}</div></div>
        <div class="stat-card"><div class="label">Ganancia estimada</div><div class="value ok">${fmt(totalProfit())}</div></div>
        <div class="stat-card"><div class="label">Stock bajo</div><div class="value warn">${low.length}</div></div>
        <div class="stat-card"><div class="label">Agotados</div><div class="value danger">${out.length}</div></div>
      </div>
      <div class="two-col">
        <section class="panel"><h2>Alertas de inventario</h2>
          ${low.length ? low.map(p=>`<div class="bell-row"><span class="dot">⚠️</span><div><strong>Stock bajo</strong><span>${esc(p.name)} necesita reposición (${p.stock}/${p.minStock}).</span></div></div>`).join("") : `<div class="empty-state"><span class="emoji">✓</span>No hay productos con stock bajo.</div>`}
          ${out.length ? out.map(p=>`<div class="bell-row"><span class="dot">❌</span><div><strong>Producto agotado</strong><span>${esc(p.name)} está agotado.</span></div></div>`).join("") : ""}
        </section>
        <section class="panel"><h2>Últimas ventas</h2>
          ${recent.length ? `<div class="table-wrap"><table><thead><tr><th>Venta</th><th>Producto</th><th>Total</th></tr></thead><tbody>${recent.map(s=>`<tr><td>${esc(s.number)}</td><td>${esc(s.productName)}</td><td>${fmt(s.total)}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-state"><span class="emoji">🛍️</span>Aún no hay ventas.</div>`}
        </section>
      </div>`;
  }

  function productRows(products) {
    if (!products.length) return `<tr><td colspan="10"><div class="empty-state"><span class="emoji">📦</span>No se encontraron productos.</div></td></tr>`;
    return products.map(p=>{
      const [st,cl] = status(p);
      return `<tr>
        <td>${esc(p.code)}</td><td><div class="cell-product"><img class="thumb" src="${esc(p.image)}" onerror="this.style.visibility='hidden'"><div><strong>${esc(p.name)}</strong><small>${esc(p.brand || "Sin marca")}</small></div></div></td>
        <td>${esc(p.category)}</td><td>${esc(p.size)}</td><td>${esc(p.color)}</td><td>${fmt(p.salePrice)}</td><td>${p.stock}</td><td><span class="badge ${cl}">${st}</span></td>
        <td>${niceDate(p.entryDate)}</td><td><div class="row-actions"><button class="icon-action" title="Ver detalles" data-action="details-product" data-id="${p.id}">👁</button><button class="icon-action" title="Editar" data-action="edit-product" data-id="${p.id}">✎</button><button class="icon-action danger" title="Eliminar" data-action="delete-product" data-id="${p.id}">🗑</button></div></td>
      </tr>`;
    }).join("");
  }

  function renderInventory() {
    let arr = [...db.products];
    const q = state.invQuery.toLowerCase();
    if(q) arr = arr.filter(p => [p.code,p.name,p.category,p.subcategory,p.brand,p.color,p.size,p.supplier].join(" ").toLowerCase().includes(q));
    if(state.invCategory) arr = arr.filter(p=>p.category===state.invCategory);
    if(state.invSize) arr = arr.filter(p=>p.size===state.invSize);
    if(state.invColor) arr = arr.filter(p=>p.color.toLowerCase()===state.invColor.toLowerCase());
    if(state.invAvailability==="available") arr = arr.filter(p=>p.stock>p.minStock);
    if(state.invAvailability==="low") arr = arr.filter(p=>p.stock>0&&p.stock<=p.minStock);
    if(state.invAvailability==="out") arr = arr.filter(p=>p.stock===0);
    if(state.invSort==="priceAsc") arr.sort((a,b)=>a.salePrice-b.salePrice);
    if(state.invSort==="priceDesc") arr.sort((a,b)=>b.salePrice-a.salePrice);
    if(state.invSort==="stockAsc") arr.sort((a,b)=>a.stock-b.stock);
    if(state.invSort==="stockDesc") arr.sort((a,b)=>b.stock-a.stock);
    const cats=[...new Set(db.products.map(p=>p.category))].sort(), sizes=[...new Set(db.products.map(p=>p.size))].sort(), colors=[...new Set(db.products.map(p=>p.color))].sort();
    return layout("Inventario","Administra prendas, precios, stock y proveedores.",
      `<button class="btn btn-primary" data-action="new-product">＋ Agregar producto</button>`) +
      `<section class="panel">
        <div class="filter-bar">
          <input type="text" id="invSearch" value="${esc(state.invQuery)}" placeholder="Buscar por nombre, código, categoría…">
          <select id="invCategory"><option value="">Todas las categorías</option>${cats.map(x=>`<option ${x===state.invCategory?"selected":""}>${esc(x)}</option>`).join("")}</select>
          <select id="invSize"><option value="">Todas las tallas</option>${sizes.map(x=>`<option ${x===state.invSize?"selected":""}>${esc(x)}</option>`).join("")}</select>
          <select id="invColor"><option value="">Todos los colores</option>${colors.map(x=>`<option ${x===state.invColor?"selected":""}>${esc(x)}</option>`).join("")}</select>
          <select id="invAvailability"><option value="">Toda disponibilidad</option><option value="available" ${state.invAvailability==="available"?"selected":""}>Disponible</option><option value="low" ${state.invAvailability==="low"?"selected":""}>Stock bajo</option><option value="out" ${state.invAvailability==="out"?"selected":""}>Agotado</option></select>
          <select id="invSort"><option value="">Ordenar…</option><option value="priceAsc">Precio ↑</option><option value="priceDesc">Precio ↓</option><option value="stockAsc">Stock ↑</option><option value="stockDesc">Stock ↓</option></select>
          <span class="spacer"></span><span>${arr.length} productos</span>
        </div>
        <div class="table-wrap"><table><thead><tr><th>Código</th><th>Prenda</th><th>Categoría</th><th>Talla</th><th>Color</th><th>Precio venta</th><th>Stock</th><th>Estado</th><th>Ingreso</th><th>Acciones</th></tr></thead><tbody>${productRows(arr)}</tbody></table></div>
      </section>`;
  }

  function renderSales() {
    let arr=[...db.sales].sort((a,b)=>b.timestamp.localeCompare(a.timestamp));
    if(state.salesQuery){ const q=state.salesQuery.toLowerCase(); arr=arr.filter(s=>[s.number,s.productName,s.code,s.seller].join(" ").toLowerCase().includes(q)); }
    if(state.salesFrom) arr=arr.filter(s=>s.date>=state.salesFrom);
    if(state.salesTo) arr=arr.filter(s=>s.date<=state.salesTo);
    if(state.salesPayment) arr=arr.filter(s=>s.payment===state.salesPayment);
    if(state.salesSeller) arr=arr.filter(s=>s.seller===state.salesSeller);
    const units=arr.reduce((a,s)=>a+s.quantity,0), total=arr.reduce((a,s)=>a+s.total,0);
    const counts={}; arr.forEach(s=>counts[s.productName]=(counts[s.productName]||0)+s.quantity);
    const top=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0] || "—";
    const cat={}; arr.forEach(s=>cat[s.category]=(cat[s.category]||0)+s.quantity);
    const topCat=Object.entries(cat).sort((a,b)=>b[1]-a[1])[0]?.[0] || "—";
    const sellers=[...new Set(db.sales.map(s=>s.seller))].sort();
    return layout("Ventas","Registra ventas y consulta el historial.",
      `<button class="btn btn-primary" data-action="new-sale">＋ Registrar venta</button>`) +
      `<section class="panel">
        <div class="filter-bar">
          <input type="text" id="salesSearch" value="${esc(state.salesQuery)}" placeholder="Buscar venta, producto o código…">
          <label class="inline">Desde <input type="date" id="salesFrom" value="${state.salesFrom}"></label>
          <label class="inline">Hasta <input type="date" id="salesTo" value="${state.salesTo}"></label>
          <select id="salesPayment"><option value="">Todos los pagos</option>${["Efectivo","Tarjeta","Transferencia","Otro"].map(x=>`<option ${x===state.salesPayment?"selected":""}>${x}</option>`).join("")}</select>
          <select id="salesSeller"><option value="">Todos los vendedores</option>${sellers.map(x=>`<option ${x===state.salesSeller?"selected":""}>${esc(x)}</option>`).join("")}</select>
        </div>
        <div class="kpi-row"><div class="kpi"><div class="k-label">Número de ventas</div><div class="k-value">${arr.length}</div></div><div class="kpi"><div class="k-label">Unidades vendidas</div><div class="k-value">${units}</div></div><div class="kpi"><div class="k-label">Total vendido</div><div class="k-value">${fmt(total)}</div></div><div class="kpi"><div class="k-label">Producto más vendido</div><div class="k-value">${esc(top)}</div></div><div class="kpi"><div class="k-label">Categoría más vendida</div><div class="k-value">${esc(topCat)}</div></div></div>
        <div class="table-wrap"><table><thead><tr><th>N.º venta</th><th>Fecha / hora</th><th>Producto</th><th>Cantidad</th><th>Unitario</th><th>Descuento</th><th>Total</th><th>Pago</th><th>Vendedor</th><th>Acciones</th></tr></thead><tbody>
        ${arr.length ? arr.map(s=>`<tr><td>${esc(s.number)}</td><td>${niceDate(s.date)}<br><small>${esc(s.time)}</small></td><td>${esc(s.productName)}<br><small>${esc(s.code)}</small></td><td>${s.quantity}</td><td>${fmt(s.unitPrice)}</td><td>${fmt(s.discount)}</td><td><strong>${fmt(s.total)}</strong></td><td>${esc(s.payment)}</td><td>${esc(s.seller)}</td><td><button class="icon-action" data-action="details-sale" data-id="${s.id}">👁</button></td></tr>`).join("") : `<tr><td colspan="10"><div class="empty-state">No hay ventas para los filtros seleccionados.</div></td></tr>`}
        </tbody></table></div>
      </section>`;
  }

  function renderEntries() {
    const arr=[...db.entries].sort((a,b)=>b.timestamp.localeCompare(a.timestamp));
    return layout("Entradas","Registra la mercancía recibida y aumenta el stock automáticamente.",
      `<button class="btn btn-primary" data-action="new-entry">＋ Registrar entrada</button>`) +
      `<section class="panel"><div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Proveedor</th><th>Producto</th><th>Cantidad</th><th>Compra</th><th>Factura / referencia</th><th>Observaciones</th></tr></thead><tbody>
      ${arr.length ? arr.map(e=>`<tr><td>${niceDate(e.date)}</td><td>${esc(e.supplier)}</td><td>${esc(e.productName)}<br><small>${esc(e.code)}</small></td><td>${e.quantity}</td><td>${fmt(e.purchasePrice)}</td><td>${esc(e.invoice||"—")}</td><td>${esc(e.notes||"—")}</td></tr>`).join("") : `<tr><td colspan="7"><div class="empty-state"><span class="emoji">📥</span>No hay entradas registradas.</div></td></tr>`}
      </tbody></table></div></section>`;
  }

  function renderReponer() {
    return layout("Productos por reponer","Prendas cuyo stock actual es igual o inferior al mínimo.",
      `<button class="btn btn-outline" data-action="new-entry">＋ Registrar entrada</button>`) +
      `<section class="panel"><div class="table-wrap"><table><thead><tr><th>Producto</th><th>Categoría</th><th>Talla</th><th>Stock</th><th>Mínimo</th><th>Proveedor</th><th>Acción</th></tr></thead><tbody>
      ${lowStock().length ? lowStock().map(p=>`<tr><td><div class="cell-product"><img class="thumb" src="${esc(p.image)}"><div><strong>${esc(p.name)}</strong><small>${esc(p.code)}</small></div></div></td><td>${esc(p.category)}</td><td>${esc(p.size)}</td><td><span class="badge warn">${p.stock}</span></td><td>${p.minStock}</td><td>${esc(p.supplier||"—")}</td><td><button class="btn btn-sm btn-primary" data-action="new-entry" data-product="${p.id}">Registrar reposición</button></td></tr>`).join("") : `<tr><td colspan="7"><div class="empty-state"><span class="emoji">✓</span>No hay productos por reponer.</div></td></tr>`}
      </tbody></table></div></section>`;
  }

  function renderOut() {
    return layout("Productos agotados","Productos cuyo stock actual es 0.",
      `<button class="btn btn-outline" data-action="new-entry">＋ Registrar reposición</button>`) +
      `<section class="panel"><div class="table-wrap"><table><thead><tr><th>Producto</th><th>Categoría</th><th>Talla</th><th>Color</th><th>Último precio</th><th>Agotamiento</th><th>Proveedor</th><th>Acción</th></tr></thead><tbody>
      ${outStock().length ? outStock().map(p=>`<tr><td><div class="cell-product"><img class="thumb" src="${esc(p.image)}"><div><strong>${esc(p.name)}</strong><small>${esc(p.code)}</small></div></div></td><td>${esc(p.category)}</td><td>${esc(p.size)}</td><td>${esc(p.color)}</td><td>${fmt(p.salePrice)}</td><td>${niceDate(p.lastOutDate || p.entryDate)}</td><td>${esc(p.supplier||"—")}</td><td><button class="btn btn-sm btn-primary" data-action="new-entry" data-product="${p.id}">Registrar reposición</button></td></tr>`).join("") : `<tr><td colspan="8"><div class="empty-state"><span class="emoji">✓</span>No hay productos agotados.</div></td></tr>`}
      </tbody></table></div></section>`;
  }

  function renderReports() {
    const invValue=db.products.reduce((a,p)=>a+p.stock*p.purchasePrice,0);
    const cards=[
      ["Inventario actual","Existencias y valor de inventario.","inventory"],
      ["Productos agotados","Listado de prendas sin existencias.","out"],
      ["Stock bajo","Productos que necesitan reposición.","low"],
      ["Ventas diarias","Resumen de ventas del día.","day"],
      ["Ventas semanales","Resumen de los últimos 7 días.","week"],
      ["Ventas mensuales","Resumen del mes actual.","month"],
      ["Productos más vendidos","Ranking por unidades vendidas.","top"],
      ["Productos menos vendidos","Productos con menor rotación.","bottom"],
      ["Ganancias estimadas","Utilidad aproximada de las ventas.","profit"],
      ["Compras realizadas","Entradas de mercancía registradas.","purchases"]
    ];
    return layout("Reportes","Consulta indicadores y genera reportes descargables.",
      `<button class="btn btn-primary" data-action="export-report">⇩ Exportar reporte</button>`) +
      `<div class="stat-grid"><div class="stat-card"><div class="label">Valor del inventario</div><div class="value">${fmt(invValue)}</div></div><div class="stat-card"><div class="label">Ventas</div><div class="value wine">${fmt(totalRevenue())}</div></div><div class="stat-card"><div class="label">Ganancia estimada</div><div class="value ok">${fmt(totalProfit())}</div></div></div>
      <section class="panel"><h2>Reportes disponibles</h2><div class="report-grid">${cards.map(c=>`<div class="report-card"><h4>${c[0]}</h4><p>${c[1]}</p><button class="btn btn-sm btn-outline" data-action="report" data-report="${c[2]}">Ver / exportar</button></div>`).join("")}</div></section>`;
  }

  function renderConfig() {
    return layout("Configuración","Opciones básicas del sistema.",
      `<button class="btn btn-danger" data-action="reset-data">Restablecer datos</button>`) +
      `<section class="panel"><h2>Preferencias</h2><div class="form-grid">
        <label class="field"><span>Nombre de tienda</span><input id="cfgStore" value="Shalom H&L"></label>
        <label class="field"><span>Moneda</span><input value="Peso colombiano (COP)" disabled></label>
        <label class="field"><span>Administrador</span><input value="Leidy Maldonado"></label>
        <label class="field"><span>Persistencia</span><input value="LocalStorage del navegador" disabled></label>
      </div><p class="field-hint">Los cambios de inventario, ventas y entradas quedan guardados en este navegador.</p></section>`;
  }

  function render() {
    const content=$("#content");
    const pages={dashboard:renderDashboard,inventario:renderInventory,ventas:renderSales,entradas:renderEntries,reponer:renderReponer,agotados:renderOut,reportes:renderReports,configuracion:renderConfig};
    content.innerHTML=(pages[state.page]||renderDashboard)();
    $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===state.page));
    updateBadges();
  }

  function fillProductSelect(id, selected="") {
    const sel=$(id);
    sel.innerHTML=`<option value="">Selecciona…</option>`+db.products.map(p=>`<option value="${p.id}" ${p.id===selected?"selected":""}>${esc(p.code)} · ${esc(p.name)} · stock ${p.stock}</option>`).join("");
  }

  function openModal(id) { $(id).hidden=false; }
  function closeModal(id) { $(id).hidden=true; }

  function openProduct(product=null) {
    $("#productForm").reset();
    $("#p_id").value=product?.id||"";
    $("#productModalTitle").textContent=product?"Editar prenda":"Agregar prenda";
    ["code","name","category","subcategory","brand","color","size","material","purchasePrice","salePrice","stock","minStock","supplier","entryDate","status","image"].forEach(k=>{
      const el=$("#p_"+k); if(product) el.value=product[k] ?? ""; else if(k==="entryDate") el.value=today(); else if(k==="status") el.value="Activo";
    });
    openModal("#productModalOverlay");
  }

  function openSale() {
    $("#saleForm").reset(); fillProductSelect("#s_product"); $("#s_quantity").value=1; $("#s_discount").value=0;
    $("#s_seller").value=db.users[0]?.name||"";
    updateSalePreview(); openModal("#saleModalOverlay");
  }

  function openEntry(productId="") {
    $("#entryForm").reset(); $("#e_date").value=today(); fillProductSelect("#e_product",productId);
    const p=productById(productId); if(p){$("#e_supplier").value=p.supplier||"";$("#e_purchasePrice").value=p.purchasePrice||0;}
    openModal("#entryModalOverlay");
  }

  function updateSalePreview() {
    const p=productById($("#s_product").value), q=Number($("#s_quantity").value)||0, d=Number($("#s_discount").value)||0;
    $("#s_stockInfo").value=p?`${p.stock} unidades`:"—";
    $("#s_unitPrice").value=p?p.salePrice:"";
    $("#s_totalPreview").textContent=fmt(Math.max(0,q*(p?.salePrice||Number($("#s_unitPrice").value)||0)-d));
  }

  function detailsProduct(p) {
    $("#detailsTitle").textContent=p.name;
    $("#detailsBody").innerHTML=`${p.image?`<img class="detail-image" src="${esc(p.image)}">`:""}<dl class="detail-grid">
      ${Object.entries({Código:p.code,Categoría:p.category,Subcategoría:p.subcategory,Marca:p.brand,Color:p.color,Talla:p.size,Material:p.material,"Precio compra":fmt(p.purchasePrice),"Precio venta":fmt(p.salePrice),Stock:p.stock,"Stock mínimo":p.minStock,Proveedor:p.supplier,"Fecha ingreso":niceDate(p.entryDate),Estado:p.status}).map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;
    openModal("#detailsModalOverlay");
  }

  function detailsSale(s) {
    $("#detailsTitle").textContent=`Venta ${s.number}`;
    $("#detailsBody").innerHTML=`<dl class="detail-grid">${Object.entries({Fecha:niceDate(s.date),Hora:s.time,Producto:s.productName,Código:s.code,Cantidad:s.quantity,"Precio unitario":fmt(s.unitPrice),Descuento:fmt(s.discount),Subtotal:fmt(s.subtotal),Total:fmt(s.total),"Método de pago":s.payment,Vendedor:s.seller,"Ganancia estimada":fmt(s.profit)}).map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;
    openModal("#detailsModalOverlay");
  }

  let pendingConfirm=null;
  function confirmAction(message, action) {
    $("#confirmMessage").textContent=message; pendingConfirm=action; openModal("#confirmModalOverlay");
  }

  function saveProduct() {
    const required=["p_code","p_name","p_category","p_color","p_size","p_purchasePrice","p_salePrice","p_stock","p_minStock"];
    if(required.some(id=>!$( "#"+id).value.trim())) { toast("Completa todos los campos obligatorios.","danger"); return; }
    const id=$("#p_id").value || uid("p");
    const existing=productById(id);
    const p={id,code:$("#p_code").value.trim(),name:$("#p_name").value.trim(),category:$("#p_category").value,subcategory:$("#p_subcategory").value.trim(),brand:$("#p_brand").value.trim(),color:$("#p_color").value.trim(),size:$("#p_size").value.trim(),material:$("#p_material").value.trim(),purchasePrice:Number($("#p_purchasePrice").value),salePrice:Number($("#p_salePrice").value),stock:Number($("#p_stock").value),minStock:Number($("#p_minStock").value),supplier:$("#p_supplier").value.trim(),entryDate:$("#p_entryDate").value||today(),status:$("#p_status").value,image:$("#p_image").value.trim()||"https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=300&q=80"};
    if(existing){ Object.assign(existing,p); toast("Prenda actualizada."); } else { db.products.push(p); toast("Prenda agregada."); }
    save(); closeModal("#productModalOverlay"); render();
  }

  function saveSale() {
    const pid=$("#s_product").value,p=productById(pid),q=Number($("#s_quantity").value),d=Number($("#s_discount").value)||0,unit=Number($("#s_unitPrice").value),payment=$("#s_payment").value,seller=$("#s_seller").value.trim();
    if(!p||!q||q<1||!unit||!seller){toast("Completa los campos obligatorios.","danger");return;}
    if(q>p.stock){toast(`Stock insuficiente. Disponible: ${p.stock}.`,"danger");return;}
    const subtotal=q*unit,total=Math.max(0,subtotal-d);
    const sale={id:uid("s"),number:`V-${String(db.sales.length+1).padStart(5,"0")}`,date:today(),time:new Date().toLocaleTimeString("es-CO",{hour:"2-digit",minute:"2-digit"}),timestamp:new Date().toISOString(),productId:pid,productName:p.name,code:p.code,category:p.category,quantity:q,unitPrice:unit,discount:d,subtotal,total,payment,seller,profit:(unit-p.purchasePrice)*q-d};
    p.stock-=q;if(p.stock===0)p.lastOutDate=today();db.sales.push(sale);save();closeModal("#saleModalOverlay");render();toast(`Venta registrada. Stock actual: ${p.stock}.`);
  }

  function saveEntry() {
    const pid=$("#e_product").value,p=productById(pid),q=Number($("#e_quantity").value),price=Number($("#e_purchasePrice").value);
    if(!p||!$("#e_date").value||!$("#e_supplier").value.trim()||!q||!price){toast("Completa los campos obligatorios.","danger");return;}
    p.stock+=q;p.purchasePrice=price;p.supplier=$("#e_supplier").value.trim();p.lastOutDate=null;
    db.entries.push({id:uid("e"),date:$("#e_date").value,supplier:$("#e_supplier").value.trim(),productId:pid,productName:p.name,code:p.code,quantity:q,purchasePrice:price,invoice:$("#e_invoice").value.trim(),notes:$("#e_notes").value.trim(),timestamp:new Date().toISOString()});
    save();closeModal("#entryModalOverlay");render();toast(`Entrada registrada. Stock actual: ${p.stock}.`);
  }

  function exportCSV(rows, filename) {
    const csv=rows.map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();URL.revokeObjectURL(a.href);
  }

  function report(type) {
    if(type==="inventory") return exportCSV([["Código","Producto","Categoría","Talla","Color","Compra","Venta","Stock","Mínimo","Proveedor"],...db.products.map(p=>[p.code,p.name,p.category,p.size,p.color,p.purchasePrice,p.salePrice,p.stock,p.minStock,p.supplier])],"inventario.csv");
    if(type==="out"||type==="low"){const ps=type==="out"?outStock():lowStock();return exportCSV([["Código","Producto","Categoría","Stock","Mínimo"],...ps.map(p=>[p.code,p.name,p.category,p.stock,p.minStock])],`${type==="out"?"agotados":"stock_bajo"}.csv`);}
    if(type==="purchases") return exportCSV([["Fecha","Proveedor","Producto","Cantidad","Precio compra","Factura","Observaciones"],...db.entries.map(e=>[e.date,e.supplier,e.productName,e.quantity,e.purchasePrice,e.invoice,e.notes])],"compras.csv");
    if(type==="profit") return exportCSV([["Venta","Fecha","Producto","Ganancia"],...db.sales.map(s=>[s.number,s.date,s.productName,s.profit])],"ganancias.csv");
    let days=type==="day"?1:type==="week"?7:30;const since=new Date();since.setDate(since.getDate()-days+1);const ss=db.sales.filter(s=>new Date(s.date)>=since);
    if(["day","week","month"].includes(type)) return exportCSV([["Venta","Fecha","Producto","Cantidad","Total","Ganancia"],...ss.map(s=>[s.number,s.date,s.productName,s.quantity,s.total,s.profit])],`ventas_${type}.csv`);
    const counts={};db.sales.forEach(s=>counts[s.productName]=(counts[s.productName]||0)+s.quantity);
    const rows=Object.entries(counts).sort((a,b)=>type==="top"?b[1]-a[1]:a[1]-b[1]);
    exportCSV([["Producto","Unidades"],...rows],`${type==="top"?"mas":"menos"}_vendidos.csv`);
  }

  function globalSearch(q) {
    const box=$("#searchResults"); q=q.trim().toLowerCase();
    if(!q){box.hidden=true;return;}
    const ps=db.products.filter(p=>[p.code,p.name,p.category].join(" ").toLowerCase().includes(q)).slice(0,5);
    const ss=db.sales.filter(s=>[s.number,s.productName,s.code].join(" ").toLowerCase().includes(q)).slice(0,5);
    if(!ps.length&&!ss.length){box.innerHTML=`<div class="sr-empty">Sin resultados.</div>`;box.hidden=false;return;}
    box.innerHTML=(ps.length?`<div class="sr-group-label">Productos</div>`+ps.map(p=>`<div class="sr-item" data-action="go-product" data-id="${p.id}"><span><strong>${esc(p.name)}</strong><br><small>${esc(p.code)} · ${esc(p.category)}</small></span><span>${p.stock}</span></div>`).join(""):"")+
      (ss.length?`<div class="sr-group-label">Ventas</div>`+ss.map(s=>`<div class="sr-item" data-action="go-sale" data-id="${s.id}"><span><strong>${esc(s.number)}</strong><br><small>${esc(s.productName)}</small></span><span>${fmt(s.total)}</span></div>`).join(""):"");
    box.hidden=false;
  }

  document.addEventListener("click", e=>{
    const nav=e.target.closest(".nav-item"); if(nav){state.page=nav.dataset.page;render();return;}
    const a=e.target.closest("[data-action]"); if(!a)return;
    const act=a.dataset.action,id=a.dataset.id;
    if(act==="new-product")openProduct();
    else if(act==="edit-product")openProduct(productById(id));
    else if(act==="details-product")detailsProduct(productById(id));
    else if(act==="delete-product")confirmAction(`¿Seguro que deseas eliminar "${productById(id)?.name}"?`,()=>{db.products=db.products.filter(p=>p.id!==id);save();render();toast("Producto eliminado.","warn");});
    else if(act==="new-sale")openSale();
    else if(act==="details-sale")detailsSale(db.sales.find(s=>s.id===id));
    else if(act==="new-entry")openEntry(a.dataset.product||"");
    else if(act==="report")report(a.dataset.report);
    else if(act==="export-report")report("inventory");
    else if(act==="reset-data")confirmAction("Esto borrará los datos guardados y restaurará los datos de ejemplo.",()=>{db=structuredClone(seed);save();render();toast("Datos restaurados.","warn");});
    else if(act==="go-product"){state.page="inventario";state.invQuery=productById(id)?.code||"";render();$("#searchResults").hidden=true;}
    else if(act==="go-sale"){state.page="ventas";state.salesQuery=db.sales.find(s=>s.id===id)?.number||"";render();$("#searchResults").hidden=true;}
  });

  document.addEventListener("input",e=>{
    if(e.target.id==="globalSearch")globalSearch(e.target.value);
    if(e.target.id==="invSearch"){state.invQuery=e.target.value;renderInventoryLive();}
    if(e.target.id==="salesSearch"){state.salesQuery=e.target.value;renderSalesLive();}
    if(["s_quantity","s_discount","s_unitPrice"].includes(e.target.id))updateSalePreview();
  });
  document.addEventListener("change",e=>{
    const map={invCategory:"invCategory",invSize:"invSize",invColor:"invColor",invAvailability:"invAvailability",invSort:"invSort",salesFrom:"salesFrom",salesTo:"salesTo",salesPayment:"salesPayment",salesSeller:"salesSeller"};
    if(map[e.target.id]){state[map[e.target.id]]=e.target.value;render();}
    if(e.target.id==="s_product"){const p=productById(e.target.value);$("#s_unitPrice").value=p?.salePrice||"";updateSalePreview();}
  });

  function renderInventoryLive(){ const y=window.scrollY; const c=$("#content"); c.innerHTML=renderInventory(); window.scrollTo(0,y); }
  function renderSalesLive(){ const y=window.scrollY; $("#content").innerHTML=renderSales(); window.scrollTo(0,y); }

  $("#saveProductBtn").addEventListener("click",saveProduct);
  $("#saveSaleBtn").addEventListener("click",saveSale);
  $("#saveEntryBtn").addEventListener("click",saveEntry);
  $("#confirmActionBtn").addEventListener("click",()=>{const fn=pendingConfirm;pendingConfirm=null;closeModal("#confirmModalOverlay");if(fn)fn();});
  $$(".modal-close,[data-close]").forEach(el=>el.addEventListener("click",()=>closeModal("#"+el.dataset.close)));
  ["productModalOverlay","saleModalOverlay","entryModalOverlay","detailsModalOverlay","confirmModalOverlay"].forEach(id=>$( "#"+id).addEventListener("click",e=>{if(e.target.id===id)closeModal("#"+id);}));

  $("#bellBtn").addEventListener("click",()=>{$("#bellPanel").hidden=!$("#bellPanel").hidden;});
  document.addEventListener("click",e=>{if(!e.target.closest(".bell-wrap"))$("#bellPanel").hidden=true;});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")$$(".modal-overlay").forEach(m=>m.hidden=true);});

  render();
})();
