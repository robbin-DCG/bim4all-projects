/* BIM4ALL Projects — personalisatie (CBJ)
   Fase 1: expliciet onthouden (routewijzer-keuze, leesstand)
   Fase 2: impliciet profiel via puntenmodel (zie CBJ-strategiedocument, sectie 4b)

   Profiel first-party in localStorage ('b4a-profiel'):
   { who, stand, scores: { rol:{klant,kandidaat,kennis,verantwoorder}, dg:{bouw,install,vastgoed} },
     dgAuto, rolAuto, lastTs }

   Spelregels: nooit content verbergen; drempel = >=6 punten EN >=3 voorsprong;
   expliciet (10) wint altijd van impliciet; verval: impliciete punten halveren na 30 dagen.
*/
(function () {
  if (window.__b4aPers) return;
  window.__b4aPers = true;

  var KEY = 'b4a-profiel';
  var SESS = 'b4a-sess-scored';
  var FONT = "'Facit','Montserrat',system-ui,sans-serif";
  var DAG30 = 30 * 24 * 60 * 60 * 1000;

  function getProfile() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function saveProfile(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
    return p;
  }
  function setProfile(patch) {
    var p = getProfile();
    for (var k in patch) p[k] = patch[k];
    return saveProfile(p);
  }

  /* ---------- puntenmodel ---------- */
  var PAGE_POINTS = {
    'aannemers.html':      { dg: { bouw: 3 }, rol: { klant: 2 } },
    'installateurs.html':  { dg: { install: 3 }, rol: { klant: 2 } },
    'gebouweigenaren.html':{ dg: { vastgoed: 3 }, rol: { klant: 2 } },
    'engineering.html':    { rol: { klant: 2 } },
    'projectregie.html':   { rol: { klant: 2 } },
    'digital-twin.html':   { rol: { klant: 2 } },
    'diensten.html':       { rol: { klant: 2 } },
    'woningbouw.html':     { dg: { bouw: 2 } },
    'utiliteit.html':      { dg: { bouw: 1, install: 1 } },
    'zorg.html':           { dg: { vastgoed: 2 } },
    'publiek-vastgoed.html': { dg: { vastgoed: 2 } },
    'duurzaamheid.html':   { dg: { vastgoed: 2 } },
    'vacatures.html':      { rol: { kandidaat: 3 } },
    'actueel.html':        { rol: { kennis: 1 } },
    'organisatie.html':    { rol: { verantwoorder: 2 } },
    'werkwijze.html':      { rol: { verantwoorder: 2 } },
    'projecten.html':      { rol: { verantwoorder: 1, klant: 1 } },
    'case-robin-wood.html':{ rol: { klant: 1, verantwoorder: 1 } }
  };

  var ZOEKTERM_DG = [
    { re: /ziekenhuis|zorg|museum|monument|school|gemeente/i, dg: 'vastgoed' },
    { re: /houtbouw|woning|nieuwbouw|aannemer|ruwbouw/i, dg: 'bouw' },
    { re: /prefab|installatie|werktuigbouw|elektro|w\/e/i, dg: 'install' }
  ];

  function actiefVan(scores) {
    var beste = null, top = 0, tweede = 0;
    for (var k in scores) {
      var v = scores[k] || 0;
      if (v > top) { tweede = top; top = v; beste = k; }
      else if (v > tweede) { tweede = v; }
    }
    return (top >= 6 && top - tweede >= 3) ? beste : null;
  }

  function herbereken(p) {
    p.scores = p.scores || { rol: {}, dg: {} };
    p.rolAuto = actiefVan(p.scores.rol);
    p.dgAuto = p.who ? null : actiefVan(p.scores.dg);
    return p;
  }

  function telPunten(current) {
    var p = getProfile();
    p.scores = p.scores || { rol: {}, dg: {} };

    /* verval: impliciete punten halveren na 30 dagen zonder bezoek */
    var nu = Date.now();
    if (p.lastTs && nu - p.lastTs > DAG30) {
      ['rol', 'dg'].forEach(function (as) {
        for (var k in p.scores[as]) p.scores[as][k] = Math.floor((p.scores[as][k] || 0) / 2);
      });
    }
    p.lastTs = nu;

    /* punten voor deze pagina, max 1x per sessie per pagina */
    var pts = PAGE_POINTS[current];
    if (pts) {
      var scored = [];
      try { scored = JSON.parse(sessionStorage.getItem(SESS) || '[]'); } catch (e) {}
      if (scored.indexOf(current) < 0) {
        ['rol', 'dg'].forEach(function (as) {
          if (!pts[as]) return;
          for (var k in pts[as]) p.scores[as][k] = (p.scores[as][k] || 0) + pts[as][k];
        });
        scored.push(current);
        try { sessionStorage.setItem(SESS, JSON.stringify(scored)); } catch (e) {}
      }
    }
    return saveProfile(herbereken(p));
  }

  function zoektermScore(term) {
    for (var i = 0; i < ZOEKTERM_DG.length; i++) {
      if (ZOEKTERM_DG[i].re.test(term)) {
        var dg = ZOEKTERM_DG[i].dg;
        var sleutel = 'zoek-' + dg;
        var scored = [];
        try { scored = JSON.parse(sessionStorage.getItem(SESS) || '[]'); } catch (e) {}
        if (scored.indexOf(sleutel) >= 0) return;
        scored.push(sleutel);
        try { sessionStorage.setItem(SESS, JSON.stringify(scored)); } catch (e) {}
        var p = getProfile();
        p.scores = p.scores || { rol: {}, dg: {} };
        p.scores.dg[dg] = (p.scores.dg[dg] || 0) + 2;
        saveProfile(herbereken(p));
        return;
      }
    }
  }

  window.B4A = {
    getProfile: getProfile,
    setProfile: function (patch) { return saveProfile(herbereken(setProfile(patch))); },
    reset: function () { try { localStorage.removeItem(KEY); sessionStorage.removeItem(SESS); } catch (e) {} }
  };

  var current = (location.pathname.split('/').pop() || 'index.html');
  var profiel = telPunten(current);

  /* ---------- effecten (subtiel: accenten, nooit verbergen) ---------- */

  /* kandidaat actief -> header-CTA wordt "Bekijk vacatures" */
  function effectKandidaat() {
    if (profiel.rolAuto !== 'kandidaat') return;
    if (current === 'vacatures.html' || current === 'contact.html') return;
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (tries > 60) { clearInterval(t); return; }
      var links = document.querySelectorAll('header a[href="contact.html"]');
      for (var i = 0; i < links.length; i++) {
        if (/Plan een gesprek/.test(links[i].textContent)) {
          links[i].textContent = 'Bekijk vacatures';
          links[i].setAttribute('href', 'vacatures.html');
          clearInterval(t);
          return;
        }
      }
    }, 200);
  }

  /* kenniszoeker actief -> accentpunt bij Actueel in de nav */
  function effectKennis() {
    if (profiel.rolAuto !== 'kennis') return;
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (tries > 60) { clearInterval(t); return; }
      var links = document.querySelectorAll('header nav a[href="actueel.html"]');
      if (!links.length) return;
      clearInterval(t);
      if (links[0].querySelector('.b4a-dot')) return;
      var dot = document.createElement('span');
      dot.className = 'b4a-dot';
      dot.textContent = ' \u25cf';
      dot.style.cssText = 'color:#b4d232;font-size:9px;vertical-align:2px';
      links[0].appendChild(dot);
    }, 200);
  }

  /* zoekveld op projecten.html -> sector-signaal */
  function effectZoekterm() {
    if (current !== 'projecten.html') return;
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (tries > 60) { clearInterval(t); return; }
      var inp = document.querySelector('#top input');
      if (!inp) return;
      clearInterval(t);
      var deb = null;
      inp.addEventListener('input', function () {
        if (deb) clearTimeout(deb);
        deb = setTimeout(function () {
          if ((inp.value || '').length >= 4) zoektermScore(inp.value);
        }, 800);
      });
    }, 200);
  }

  /* ---------- leesstand (productpagina's) ---------- */
  var PRODUCT_PAGES = ['engineering.html', 'projectregie.html', 'digital-twin.html'];
  var clamped = [];

  function clampParagraph(p) {
    if (p.__b4aClamped) return;
    p.__b4aClamped = true;
    p.style.display = '-webkit-box';
    p.style.webkitLineClamp = '2';
    p.style.webkitBoxOrient = 'vertical';
    p.style.overflow = 'hidden';
    var btn = document.createElement('button');
    btn.textContent = 'meer';
    btn.setAttribute('aria-expanded', 'false');
    btn.style.cssText = 'font-family:' + FONT + ';font-size:12.5px;font-weight:700;color:#c1188d;background:none;border:none;padding:2px 0 0;cursor:pointer;text-decoration:underline;align-self:flex-start';
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      if (open) {
        p.style.display = '-webkit-box'; p.style.overflow = 'hidden';
        btn.textContent = 'meer'; btn.setAttribute('aria-expanded', 'false');
      } else {
        p.style.display = 'block'; p.style.overflow = 'visible';
        btn.textContent = 'minder'; btn.setAttribute('aria-expanded', 'true');
      }
    });
    p.parentNode.insertBefore(btn, p.nextSibling);
    clamped.push({ p: p, btn: btn });
  }

  function unclampAll() {
    clamped.forEach(function (c) {
      c.p.style.display = 'block'; c.p.style.overflow = 'visible';
      c.p.__b4aClamped = false;
      if (c.btn.parentNode) c.btn.parentNode.removeChild(c.btn);
    });
    clamped = [];
  }

  function applyStand(stand) {
    if (stand === 'kort') {
      var main = document.querySelector('#top') || document.body;
      var ps = main.querySelectorAll('p');
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        if (p.closest('footer') || p.closest('header')) continue;
        if ((p.textContent || '').length > 220) clampParagraph(p);
      }
    } else {
      unclampAll();
    }
  }

  function buildToggle() {
    var h1 = document.querySelector('h1');
    if (!h1) return false;
    var host = h1.parentElement;
    if (!host || document.querySelector('.b4a-stand')) return true;

    var wrap = document.createElement('div');
    wrap.className = 'b4a-stand';
    wrap.style.cssText = 'display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);border-radius:99px;padding:5px;font-family:' + FONT;
    function mk(label, val) {
      var b = document.createElement('button');
      b.textContent = label;
      b.setAttribute('data-stand', val);
      b.style.cssText = 'font-family:' + FONT + ';font-size:12.5px;font-weight:700;cursor:pointer;border:none;border-radius:99px;padding:8px 18px;transition:all .15s;background:transparent;color:rgba(255,255,255,.75)';
      b.addEventListener('click', function () {
        window.B4A.setProfile({ stand: val });
        paint(val);
        applyStand(val);
      });
      return b;
    }
    var bKort = mk('In het kort', 'kort');
    var bDetail = mk('In detail', 'detail');
    wrap.appendChild(bKort); wrap.appendChild(bDetail);
    function paint(stand) {
      [bKort, bDetail].forEach(function (b) {
        var on = b.getAttribute('data-stand') === stand;
        b.style.background = on ? '#b4d232' : 'transparent';
        b.style.color = on ? '#14123a' : 'rgba(255,255,255,.75)';
      });
    }
    var stand = getProfile().stand || 'detail';
    paint(stand);
    host.appendChild(wrap);
    applyStand(stand);
    return true;
  }

  function initLeesstand() {
    if (PRODUCT_PAGES.indexOf(current) < 0) return;
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (tries > 100) { clearInterval(t); return; }
      if (document.querySelector('footer') && buildToggle()) clearInterval(t);
    }, 150);
  }

  function init() {
    initLeesstand();
    effectKandidaat();
    effectKennis();
    effectZoekterm();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
