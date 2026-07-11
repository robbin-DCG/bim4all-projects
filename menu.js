/* BIM4ALL Projects — gedeeld menu (mobiel hamburger-overlay + desktop dropdown "Oplossingen") */
(function () {
  if (window.__b4aMenu) return; window.__b4aMenu = true;

  var current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (current === '') current = 'index.html';

  var FONT = "'Facit','Montserrat',system-ui,sans-serif";

  /* ---------- stijlen ---------- */
  var css = [
    '.b4a-burger{display:none;position:fixed;top:11px;right:16px;z-index:220;width:44px;height:44px;border-radius:12px;border:1.5px solid rgba(255,255,255,.35);background:#14123a;cursor:pointer;align-items:center;justify-content:center;flex-direction:column;gap:5px;padding:0}',
    '.b4a-burger span{display:block;width:18px;height:2px;background:#fff;border-radius:2px;transition:transform .25s,opacity .2s}',
    '.b4a-burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}',
    '.b4a-burger.open span:nth-child(2){opacity:0}',
    '.b4a-burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}',
    '@media (max-width:1100px){.b4a-burger{display:flex}}',
    '.b4a-overlay{position:fixed;inset:0;z-index:210;background:#14123a;color:#fff;overflow-y:auto;-webkit-overflow-scrolling:touch;opacity:0;pointer-events:none;transition:opacity .22s;font-family:' + FONT + '}',
    '.b4a-overlay.open{opacity:1;pointer-events:auto}',
    '.b4a-ov-in{max-width:520px;margin:0 auto;padding:20px 24px 48px;display:flex;flex-direction:column;gap:8px}',
    '.b4a-ov-logo{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none;padding:8px 0 22px}',
    '.b4a-ov-logo b{font-size:21px;font-weight:800;letter-spacing:-.01em}',
    '.b4a-ov-logo i{font-style:normal;font-size:10px;font-weight:700;letter-spacing:.12em;color:#14123a;background:#fff;padding:4px 10px;border-radius:99px}',
    '.b4a-ov-in a.b4a-lnk{display:block;color:rgba(255,255,255,.88);text-decoration:none;font-size:21px;font-weight:800;letter-spacing:-.01em;padding:12px 14px;border-radius:14px}',
    '.b4a-ov-in a.b4a-lnk:hover{background:rgba(255,255,255,.07);color:#fff}',
    '.b4a-ov-in a.b4a-lnk.sub{font-size:16.5px;font-weight:700;padding:10px 14px 10px 30px;color:rgba(255,255,255,.75)}',
    '.b4a-ov-in a.b4a-lnk small{display:block;font-size:12.5px;font-weight:600;color:rgba(255,255,255,.45);margin-top:2px}',
    '.b4a-ov-in a.b4a-lnk.active{color:#b4d232}',
    '.b4a-ov-group{font-size:11px;font-weight:700;letter-spacing:.16em;color:rgba(255,255,255,.4);padding:18px 14px 6px}',
    '.b4a-ov-cta{display:block;text-align:center;background:#c1188d;color:#fff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 24px;border-radius:99px;margin-top:22px}',
    '.b4a-ov-cta:hover{background:#9c1372;color:#fff}',
    '.b4a-ov-tel{display:block;text-align:center;color:rgba(255,255,255,.65);text-decoration:none;font-size:15px;font-weight:700;padding:14px 0}',
    '.b4a-ov-tel:hover{color:#fff}',
    '.b4a-drop{position:fixed;left:0;right:0;z-index:230;background:#fff;border-top:1px solid rgba(38,34,98,.08);box-shadow:0 32px 64px rgba(20,18,58,.18);display:none;font-family:' + FONT + '}',
    '.b4a-drop.open{display:block}',
    '.b4a-drop-in{max-width:1380px;margin:0 auto;padding:28px 56px;display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px}',
    '.b4a-drop a{display:block;padding:16px 20px;border-radius:14px;font-size:15px;font-weight:700;color:#262262;text-decoration:none;line-height:1.3}',
    '.b4a-drop a:hover{background:#f5f5f9;color:#262262}',
    '.b4a-drop a small{display:block;font-weight:600;font-size:12.5px;color:rgba(38,34,98,.6);margin-top:4px}',
    '.b4a-drop a.b4a-hi{background:rgba(180,210,50,.12);border:1.5px solid rgba(180,210,50,.7)}',
    '.b4a-drop a.b4a-hi:hover{background:rgba(180,210,50,.22)}',
    '.b4a-badge{display:inline-block;font-size:9.5px;font-weight:800;letter-spacing:.08em;color:#14123a;background:#b4d232;padding:3px 8px;border-radius:99px;margin-left:6px;vertical-align:2px}',
    '.b4a-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:240;background:#14123a;color:#fff;border-radius:18px;box-shadow:0 24px 64px rgba(20,18,58,.4);font-family:' + FONT + '}',
    '.b4a-cookie-in{max-width:1000px;margin:0 auto;padding:18px 24px;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}',
    '.b4a-cookie span{font-size:14px;line-height:1.6;color:rgba(255,255,255,.8)}',
    '.b4a-cookie a{color:#b4d232;text-decoration:underline}',
    '.b4a-cookie-btns{display:flex;gap:10px;flex-shrink:0}',
    '.b4a-cookie button{font-family:' + FONT + ';font-size:13.5px;font-weight:700;cursor:pointer;padding:11px 20px;border-radius:99px;border:1.5px solid rgba(255,255,255,.4);background:transparent;color:#fff}',
    '.b4a-cookie button.pri{background:#c1188d;border-color:#c1188d}'
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.id = 'b4a-menu-css';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------- data ---------- */
  var SOLUTIONS = [
    { href: 'engineering.html', label: 'Engineering', sub: 'Van ontwerp naar maakbaar plan · Maakbaar Plan' },
    { href: 'projectregie.html', label: 'Projectregie', sub: 'Grip tijdens het project · Digitale Bouwplaats' },
    { href: 'digital-twin.html', label: 'Digital Twin', sub: 'Gebouwinformatie na oplevering · Digital Twin & Vastgoeddata' },
    { href: 'diensten.html', label: 'Alle diensten', sub: 'BIM-engineering, coördinatie, scan-to-BIM, as-built' }
  ];

  var DIENSTEN = [
    { href: 'diensten.html#bim-engineering', label: 'BIM-engineering & modelleren', sub: 'Maakbare, uitvoeringsgerede modellen' },
    { href: 'diensten.html#bim-coordinatie', label: 'BIM-coördinatie & BIM-management', sub: 'Regie op de digitale samenwerking' },
    { href: 'diensten.html#scan-to-bim', label: 'Scan-to-BIM & 3D-laserscannen', sub: 'De werkelijkheid betrouwbaar in beeld' },
    { href: 'diensten.html#gebouwinformatie', label: 'Gebouwinformatie & asset management', sub: 'As-built en informatiemanagement' },
    { href: 'diensten.html', label: 'Alle diensten', sub: 'Het volledige overzicht op één pagina' }
  ];

  var OVERONS = [
    { href: 'organisatie.html', label: 'Organisatie', sub: 'Wie we zijn en waar we voor staan' },
    { href: 'werkwijze.html', label: 'Werkwijze', sub: 'Zo werken we samen, van vraag tot resultaat' },
    { href: 'vacatures.html', label: 'Werken bij', sub: 'Vacatures en teamverhalen', hi: true },
    { href: 'https://www.bim4all-academie.com', label: 'BIM4ALL Academy ↗', sub: 'Trainingen, consultancy en opleidingen', ext: true }
  ];

  function isActive(href) { return href.toLowerCase() === current; }

  /* ---------- mobiel: burger + overlay ---------- */
  function buildMobile() {
    var burger = document.createElement('button');
    burger.className = 'b4a-burger';
    burger.setAttribute('aria-label', 'Menu');
    burger.innerHTML = '<span></span><span></span><span></span>';

    var overlay = document.createElement('div');
    overlay.className = 'b4a-overlay';

    function lnk(href, label, opts) {
      opts = opts || {};
      var a = '<a class="b4a-lnk' + (opts.sub ? ' sub' : '') + (isActive(href) ? ' active' : '') + '" href="' + href + '"' + (opts.ext ? ' target="_blank" rel="noopener"' : '') + '>' + label + (opts.subText ? '<small>' + opts.subText + '</small>' : '') + '</a>';
      return a;
    }

    var html = '<div class="b4a-ov-in">';
    html += '<a class="b4a-ov-logo" href="index.html"><b>BIM4ALL</b><i>PROJECTS</i></a>';
    html += lnk('index.html', 'Home');
    html += '<div class="b4a-ov-group">OPLOSSINGEN</div>';
    SOLUTIONS.forEach(function (s) { html += lnk(s.href, s.label, { sub: true }); });
    html += '<div class="b4a-ov-group">DIENSTEN</div>';
    DIENSTEN.forEach(function (s) { html += lnk(s.href, s.label, { sub: true }); });
    html += '<div class="b4a-ov-group">MEER</div>';
    html += lnk('projecten.html', 'Projecten', { sub: true });
    html += lnk('actueel.html', 'Actueel', { sub: true });
    html += lnk('organisatie.html', 'Organisatie', { sub: true });
    html += lnk('werkwijze.html', 'Werkwijze', { sub: true });
    html += '<a class="b4a-lnk sub' + (isActive('vacatures.html') ? ' active' : '') + '" href="vacatures.html">Werken bij <span class="b4a-badge">WE ZOEKEN COLLEGA\u2019S</span></a>';
    html += lnk('contact.html', 'Contact', { sub: true });
    html += lnk('https://www.bim4all-academie.com', 'BIM4ALL Academy ↗', { sub: true, ext: true });
    html += '<a class="b4a-ov-cta" href="contact.html">Plan een kennissessie →</a>';
    html += '<a class="b4a-ov-tel" href="tel:+31548376797">0548 - 37 67 97</a>';
    html += '</div>';
    overlay.innerHTML = html;

    var open = false;
    function setOpen(v) {
      open = v;
      overlay.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      document.documentElement.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () { setOpen(!open); });
    overlay.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (a) setOpen(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) setOpen(false); });

    document.body.appendChild(burger);
    document.body.appendChild(overlay);
  }

  function attachDrop(anchor, items) {
    if (!/▾/.test(anchor.textContent)) {
      var caret = document.createElement('span');
      caret.textContent = ' ▾';
      caret.style.cssText = 'font-size:10px;opacity:.7';
      anchor.appendChild(caret);
    }
    var panel = document.createElement('div');
    panel.className = 'b4a-drop';
    var inner = '<div class="b4a-drop-in">';
    items.forEach(function (s) {
      inner += '<a href="' + s.href + '"' + (s.ext ? ' target="_blank" rel="noopener noreferrer"' : '') + (s.hi ? ' class="b4a-hi"' : '') + '>' + s.label + (s.hi ? ' <span class="b4a-badge">WE ZOEKEN COLLEGA\u2019S</span>' : '') + '<small>' + s.sub + '</small></a>';
    });
    inner += '</div>';
    panel.innerHTML = inner;
    document.body.appendChild(panel);

    var hideT = null;
    function show() {
      if (window.innerWidth <= 1100) return;
      if (hideT) clearTimeout(hideT);
      var header = document.querySelector('header');
      var hr = header ? header.getBoundingClientRect() : { bottom: 70 };
      panel.style.top = hr.bottom + 'px';
      panel.classList.add('open');
    }
    function hide() { hideT = setTimeout(function () { panel.classList.remove('open'); }, 180); }
    anchor.addEventListener('mouseenter', show);
    anchor.addEventListener('mouseleave', hide);
    panel.addEventListener('mouseenter', function () { if (hideT) clearTimeout(hideT); });
    panel.addEventListener('mouseleave', hide);
    window.addEventListener('scroll', function () { panel.classList.remove('open'); }, { passive: true });
  }

  function buildDropdown() {
    if (current === 'index.html') return; /* index heeft eigen megamenu */
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      if (tries > 80) { clearInterval(timer); return; }
      var nav = document.querySelector('header nav');
      if (!nav) return;
      clearInterval(timer);
      var links = nav.querySelectorAll('a');
      var opl = null, dns = null, ovr = null;
      for (var i = 0; i < links.length; i++) {
        var t = links[i].textContent.trim();
        if (/^Oplossingen/.test(t)) opl = links[i];
        else if (/^Diensten/.test(t)) dns = links[i];
        else if (/^Over ons/.test(t)) ovr = links[i];
      }
      if (opl) attachDrop(opl, SOLUTIONS);
      if (dns) attachDrop(dns, DIENSTEN);
      if (ovr) attachDrop(ovr, OVERONS);
    }, 125);
  }

  function buildCookie() {
    try { if (localStorage.getItem('b4a-cookie')) return; } catch (e) {}
    var bar = document.createElement('div');
    bar.className = 'b4a-cookie';
    bar.innerHTML = '<div class="b4a-cookie-in"><span>Wij gebruiken functionele en analytische cookies om deze website te verbeteren. <a href="privacy.html#cookies">Meer informatie</a>.</span><div class="b4a-cookie-btns"><button data-c="no">Alleen noodzakelijk</button><button data-c="yes" class="pri">Accepteren</button></div></div>';
    document.body.appendChild(bar);
    bar.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('button');
      if (!b) return;
      try { localStorage.setItem('b4a-cookie', b.getAttribute('data-c')); } catch (er) {}
      if (bar.parentNode) bar.parentNode.removeChild(bar);
    });
  }

  function init() { buildMobile(); buildDropdown(); buildCookie(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
