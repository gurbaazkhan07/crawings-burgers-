(function (root) {
  'use strict';
  var MENU = root.CRAWINGS_MENU, ADDONS = root.CRAWINGS_ADDONS, CFG = root.CRAWINGS_CONFIG;
  var SPICE = root.CRAWINGS_SPICE, ADDON_CATS = root.CRAWINGS_ADDON_CATEGORIES;
  var STORE = 'crawings_cart_v1';

  /* ---------- pure logic (also unit-tested in Node) ---------- */
  var index = {};
  MENU.forEach(function (c) { c.items.forEach(function (i) { index[i.id] = { item: i, cat: c }; }); });
  var addonIndex = {}; ADDONS.forEach(function (a) { addonIndex[a.id] = a; });

  function money(n) { return '₹' + n.toLocaleString('en-IN'); }

  // Builds a trusted cart line from ids only; price always comes from menu data.
  function makeLine(itemId, sizeLabel, spice, addonIds, note, qty) {
    var ref = index[itemId]; if (!ref) return null;
    var size = ref.item.sizes.filter(function (s) { return s.label === sizeLabel; })[0] || ref.item.sizes[0];
    var canAddons = ADDON_CATS.indexOf(ref.cat.id) > -1;
    var addons = canAddons ? (addonIds || []).map(function (id) { return addonIndex[id]; }).filter(Boolean) : [];
    var hasSpice = canAddons;
    var sp = hasSpice && SPICE.indexOf(spice) > -1 ? spice : (hasSpice ? SPICE[0] : '');
    qty = Math.max(1, Math.min(20, parseInt(qty, 10) || 1));
    note = String(note || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 100);
    var key = [itemId, size.label, sp, addons.map(function (a) { return a.id; }).sort().join('+'), note].join('|');
    return { key: key, itemId: itemId, name: ref.item.name, size: size.label, showSize: ref.item.sizes.length > 1,
      mrp: size.price === null, base: size.price || 0, spice: sp, addons: addons, note: note, qty: qty };
  }
  function unit(l) { return l.base + l.addons.reduce(function (s, a) { return s + a.price; }, 0); }
  function lineTotal(l) { return unit(l) * l.qty; }
  function totals(cart) {
    return { sub: cart.reduce(function (s, l) { return s + lineTotal(l); }, 0),
      count: cart.reduce(function (s, l) { return s + l.qty; }, 0),
      hasMrp: cart.some(function (l) { return l.mrp; }) };
  }
  function validate(v) {
    var e = {};
    var name = (v.name || '').trim();
    if (name.length < 2 || name.length > 60 || !/^[\p{L}][\p{L}\s.'-]*$/u.test(name)) e.name = 'Please enter your name (letters only).';
    var ph = String(v.phone || '').replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '');
    if (!/^[6-9]\d{9}$/.test(ph)) e.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (v.type === 'Delivery' && (v.addr || '').trim().length < 10) e.addr = 'Please enter your full delivery address.';
    return { errors: e, phone: ph, ok: Object.keys(e).length === 0 };
  }
  function buildMessage(cart, v, phone) {
    var t = totals(cart), L = [];
    L.push('*New Order – Crawings by Bahar Cafe*', '');
    cart.forEach(function (l, i) {
      var d = [];
      if (l.showSize || l.mrp) d.push(l.size);
      if (l.spice && l.spice !== SPICE[0]) d.push(l.spice);
      if (l.addons.length) d.push('+ ' + l.addons.map(function (a) { return a.name; }).join(', '));
      L.push((i + 1) + '. ' + l.name + (d.length ? ' (' + d.join(' | ') + ')' : '') + ' x' + l.qty + ' – ' +
        (l.mrp && !l.addons.length ? 'MRP' : money(lineTotal(l))));
      if (l.note) L.push('   Note: ' + l.note);
    });
    L.push('', '*Subtotal: ' + money(t.sub) + '*');
    if (t.hasMrp) L.push('(MRP items such as water/cold drink are billed at restaurant price)');
    L.push('*Total: ' + money(t.sub) + (t.hasMrp ? ' + MRP items' : '') + '*', '');
    L.push('Order type: ' + v.type, 'Name: ' + v.name.trim(), 'Phone: +91 ' + phone);
    if (v.type === 'Delivery') L.push('Address: ' + v.addr.trim());
    if (v.notes && v.notes.trim()) L.push('Notes: ' + v.notes.trim());
    return L.join('\n');
  }
  function waUrl(msg) { return 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(msg); }

  root.CrawingsCore = { makeLine: makeLine, totals: totals, validate: validate, buildMessage: buildMessage, waUrl: waUrl, lineTotal: lineTotal, unit: unit };
  if (typeof document === 'undefined') return;

  /* ---------- UI ---------- */
  var $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  var cart = [], activeCat = 'all', query = '';
  var cur = null; // customise state

  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(STORE) || '[]');
      if (!Array.isArray(raw)) return;
      raw.slice(0, 40).forEach(function (r) {
        var l = r && makeLine(r.itemId, r.size, r.spice, r.addonIds, r.note, r.qty);
        if (l) cart.push(l);
      });
    } catch (e) { cart = []; }
  }
  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify(cart.map(function (l) {
        return { itemId: l.itemId, size: l.size, spice: l.spice, addonIds: l.addons.map(function (a) { return a.id; }), note: l.note, qty: l.qty };
      })));
    } catch (e) { /* storage unavailable */ }
  }

  var toastT;
  function toast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2200); }

  /* menu rendering */
  function priceText(item) {
    return item.sizes.map(function (s) { return s.price === null ? 'MRP' : money(s.price); }).join(' / ');
  }
  function renderChips() {
    var box = $('chips'); box.textContent = '';
    [{ id: 'all', name: 'All', icon: '✨' }].concat(MENU).forEach(function (c) {
      var b = el('button', 'chip', c.icon + ' ' + c.name); b.type = 'button'; b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(c.id === activeCat));
      b.addEventListener('click', function () { activeCat = c.id; renderChips(); renderMenu(); });
      box.appendChild(b);
    });
  }
  function renderMenu() {
    var list = $('menuList'); list.textContent = ''; var q = query.trim().toLowerCase(), shown = 0;
    MENU.forEach(function (c) {
      if (activeCat !== 'all' && activeCat !== c.id) return;
      var items = c.items.filter(function (i) { return !q || i.name.toLowerCase().indexOf(q) > -1 || c.name.toLowerCase().indexOf(q) > -1; });
      if (!items.length) return;
      var sec = el('section', 'cat'); sec.appendChild(el('h3', '', c.name));
      var grid = el('div', 'grid');
      items.forEach(function (i, n) {
        shown++;
        var card = el('article', 'card glass'); card.style.animationDelay = (n * 40) + 'ms';
        card.appendChild(el('span', 'ic', c.icon)); card.appendChild(el('h4', '', i.name));
        var row = el('div', 'row'); row.appendChild(el('span', 'price', priceText(i)));
        var b = el('button', 'add', 'Add'); b.type = 'button'; b.setAttribute('aria-label', 'Add ' + i.name);
        b.addEventListener('click', function () { openCustom(i.id); });
        row.appendChild(b); card.appendChild(row); grid.appendChild(card);
      });
      sec.appendChild(grid); list.appendChild(sec);
    });
    $('empty').hidden = shown > 0;
  }

  /* modal helpers */
  var lastFocus = null;
  function openModal(node) {
    lastFocus = document.activeElement; $('overlay').hidden = false; node.hidden = false; document.body.classList.add('lock');
    var f = node.querySelector('button, input'); if (f) setTimeout(function () { f.focus(); }, 50);
  }
  function closeModals() {
    ['overlay', 'custom', 'drawer'].forEach(function (id) { $(id).hidden = true; });
    document.body.classList.remove('lock'); if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* customise sheet */
  function radioGroup(title, name, opts, checkedIdx) {
    var g = el('fieldset', 'group'); g.style.border = '0'; g.style.padding = '0';
    g.appendChild(el('legend', '', title));
    opts.forEach(function (o, i) {
      var lab = el('label', 'opt'), left = el('span');
      var inp = el('input'); inp.type = 'radio'; inp.name = name; inp.value = o.value; inp.checked = i === checkedIdx;
      left.appendChild(inp); left.appendChild(document.createTextNode(o.label)); lab.appendChild(left);
      lab.appendChild(el('span', 'price', o.price)); g.appendChild(lab);
    });
    return g;
  }
  function openCustom(itemId) {
    var ref = index[itemId], item = ref.item, canAddons = ADDON_CATS.indexOf(ref.cat.id) > -1;
    cur = { itemId: itemId, qty: 1 };
    $('cTitle').textContent = item.name;
    var body = $('cBody'); body.textContent = '';
    if (item.sizes.length > 1)
      body.appendChild(radioGroup('Size', 'size', item.sizes.map(function (s) { return { value: s.label, label: s.label, price: s.price === null ? 'MRP' : money(s.price) }; }), 0));
    else { var h = el('input'); h.type = 'hidden'; h.name = 'size'; h.value = item.sizes[0].label; h.checked = true; body.appendChild(h); }
    if (canAddons) {
      body.appendChild(radioGroup('Spice level', 'spice', SPICE.map(function (s) { return { value: s, label: s, price: '' }; }), 0));
      var ag = el('div', 'group'); ag.appendChild(el('b', '', 'Add-ons'));
      ADDONS.forEach(function (a) {
        var lab = el('label', 'opt'), left = el('span'), cb = el('input'); cb.type = 'checkbox'; cb.name = 'addon'; cb.value = a.id;
        left.appendChild(cb); left.appendChild(document.createTextNode(a.name)); lab.appendChild(left); lab.appendChild(el('span', 'price', '+' + money(a.price))); ag.appendChild(lab);
      });
      body.appendChild(ag);
    }
    var ng = el('div', 'group'); ng.appendChild(el('b', '', 'Special request'));
    var ta = el('textarea'); ta.id = 'cNote'; ta.rows = 2; ta.maxLength = 100; ta.placeholder = 'e.g. no onions'; ng.appendChild(ta); body.appendChild(ng);
    $('cQty').textContent = '1'; refreshCustom(); openModal($('custom'));
  }
  function readCustom() {
    var b = $('cBody'), q = function (s) { return b.querySelector(s); };
    var size = q('input[name=size]:checked') || q('input[name=size]');
    var sp = q('input[name=spice]:checked');
    var add = [].slice.call(b.querySelectorAll('input[name=addon]:checked')).map(function (c) { return c.value; });
    var note = $('cNote') ? $('cNote').value : '';
    return makeLine(cur.itemId, size && size.value, sp && sp.value, add, note, cur.qty);
  }
  function refreshCustom() { var l = readCustom(); $('cAdd').textContent = l.mrp && !l.addons.length ? 'Add · MRP' : 'Add · ' + money(lineTotal(l)); }
  $('cMinus').addEventListener('click', function () { cur.qty = Math.max(1, cur.qty - 1); $('cQty').textContent = cur.qty; refreshCustom(); });
  $('cPlus').addEventListener('click', function () { cur.qty = Math.min(20, cur.qty + 1); $('cQty').textContent = cur.qty; refreshCustom(); });
  $('cBody').addEventListener('input', refreshCustom);
  $('cBody').addEventListener('change', refreshCustom);
  $('cAdd').addEventListener('click', function () {
    var l = readCustom(); addLine(l); closeModals(); toast(l.qty + ' × ' + l.name + ' added');
  });

  /* cart */
  function addLine(l) {
    var ex = cart.filter(function (c) { return c.key === l.key; })[0];
    if (ex) ex.qty = Math.min(20, ex.qty + l.qty); else cart.push(l);
    save(); renderCart(true);
  }
  function renderCart(bump) {
    var t = totals(cart), ul = $('cartItems'); ul.textContent = '';
    cart.forEach(function (l) {
      var li = el('li', 'ci'), top = el('div', 'top');
      top.appendChild(el('span', '', l.name)); top.appendChild(el('span', '', l.mrp && !l.addons.length ? 'MRP' : money(lineTotal(l)))); li.appendChild(top);
      var d = []; if (l.showSize || l.mrp) d.push(l.size); if (l.spice && l.spice !== SPICE[0]) d.push(l.spice);
      if (l.addons.length) d.push('+ ' + l.addons.map(function (a) { return a.name; }).join(', ')); if (l.note) d.push('“' + l.note + '”');
      if (d.length) li.appendChild(el('small', '', d.join(' · ')));
      var bot = el('div', 'bot'), qty = el('div', 'qty');
      var m = el('button', '', '−'), o = el('output', '', String(l.qty)), p = el('button', '', '+');
      m.type = p.type = 'button'; m.setAttribute('aria-label', 'Decrease ' + l.name); p.setAttribute('aria-label', 'Increase ' + l.name);
      m.addEventListener('click', function () { l.qty--; if (l.qty < 1) cart.splice(cart.indexOf(l), 1); save(); renderCart(); });
      p.addEventListener('click', function () { l.qty = Math.min(20, l.qty + 1); save(); renderCart(); });
      qty.appendChild(m); qty.appendChild(o); qty.appendChild(p);
      var rm = el('button', 'rm', 'Remove'); rm.type = 'button';
      rm.addEventListener('click', function () { cart.splice(cart.indexOf(l), 1); save(); renderCart(); });
      bot.appendChild(qty); bot.appendChild(rm); li.appendChild(bot); ul.appendChild(li);
    });
    var has = cart.length > 0;
    $('cartEmpty').hidden = has; $('checkout').hidden = !has;
    $('tSub').textContent = money(t.sub); $('tTotal').textContent = money(t.sub) + (t.hasMrp ? ' + MRP items' : ''); $('mrpRow').hidden = !t.hasMrp;
    $('cartCount').textContent = t.count; $('cartBar').hidden = !has;
    $('cartBarCount').textContent = t.count + (t.count === 1 ? ' item' : ' items'); $('cartBarTotal').textContent = money(t.sub);
    if (bump) { var b = $('cartCount'); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
  }
  function openCart() { renderCart(); openModal($('drawer')); }
  $('openCart').addEventListener('click', openCart);
  $('cartBar').addEventListener('click', openCart);
  $('dClose').addEventListener('click', closeModals);
  $('cClose').addEventListener('click', closeModals);
  $('overlay').addEventListener('click', closeModals);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModals(); });
  $('clearCart').addEventListener('click', function () { cart = []; save(); renderCart(); toast('Cart cleared'); });

  /* checkout */
  var form = $('checkout');
  function syncType() { var t = form.querySelector('input[name=type]:checked').value; $('addrWrap').hidden = t !== 'Delivery'; }
  form.addEventListener('change', function (e) { if (e.target.name === 'type') syncType(); });
  function setErr(id, inputId, msg) { $(id).textContent = msg || ''; $(inputId).classList.toggle('bad', !!msg); $(inputId).setAttribute('aria-invalid', msg ? 'true' : 'false'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if ($('fHp').value) return; // bot trap
    if (!cart.length) return;
    var v = { type: form.querySelector('input[name=type]:checked').value, name: $('fName').value, phone: $('fPhone').value, addr: $('fAddr').value, notes: $('fNotes').value };
    var r = validate(v);
    setErr('eName', 'fName', r.errors.name); setErr('ePhone', 'fPhone', r.errors.phone); setErr('eAddr', 'fAddr', r.errors.addr);
    if (!r.ok) { var first = form.querySelector('.bad'); if (first) first.focus(); return; }
    var url = waUrl(buildMessage(cart, v, r.phone));
    var w = window.open(url, '_blank', 'noopener,noreferrer');
    if (!w) window.location.href = url;
    toast('Opening WhatsApp… tap Send to place your order');
  });

  /* search */
  var st; $('search').addEventListener('input', function (e) { clearTimeout(st); var v = e.target.value; st = setTimeout(function () { query = v; renderMenu(); }, 120); });

  $('yr').textContent = new Date().getFullYear();
  load(); renderChips(); renderMenu(); renderCart(); syncType();
})(typeof window !== 'undefined' ? window : globalThis);
