/* BIM4ALL — <clash-slider> herbruikbare voor/na-slider (vanilla web component)
   Gebruik (in een DC-template):
   <x-import component-from-global-scope="clash-slider" from="./clash-slider.js"
     data-before-src="assets/foto.png" data-after-src="assets/model.png"
     data-before-id="dt-voor" data-after-id="dt-na"
     data-before-label="FOTO" data-after-label="MODEL"
     data-before-placeholder="..." data-after-placeholder="..."
     data-height="400px" hint-size="100%,400px"></x-import>
   Vereist dat image-slot.js op de pagina geladen is (gebeurt automatisch via een
   bestaande <x-import> van image-slot, of laad het expliciet).
*/
(function () {
  if (customElements.get('clash-slider')) return;

  /* zelfvoorzienend: laad image-slot.js als die nog niet geregistreerd is */
  if (!customElements.get('image-slot') && !document.querySelector('script[data-b4a-imageslot]')) {
    var s = document.createElement('script');
    s.src = './image-slot.js';
    s.setAttribute('data-b4a-imageslot', '1');
    document.head.appendChild(s);
  }

  class ClashSlider extends HTMLElement {
    connectedCallback() {
      if (this.__built) return;
      this.__built = true;
      var g = this.getAttribute.bind(this);
      var h = g('data-height') || '400px';
      var beforeSrc = g('data-before-src') || '';
      var afterSrc = g('data-after-src') || '';
      var beforeId = g('data-before-id') || 'clash-before';
      var afterId = g('data-after-id') || 'clash-after';
      var beforeLabel = g('data-before-label') || 'VOOR';
      var afterLabel = g('data-after-label') || 'NA';
      var beforePh = g('data-before-placeholder') || 'VOOR-beeld';
      var afterPh = g('data-after-placeholder') || 'NA-beeld';

      this.style.cssText = 'display:block;position:relative;height:' + h + ';border-radius:20px;overflow:hidden;cursor:col-resize;touch-action:none;user-select:none;background:#0d0b2a';

      function slot(id, src, ph) {
        return '<image-slot id="' + id + '" shape="rect" src="' + src + '" placeholder="' + ph + '" style="display:block;width:100%;height:100%"></image-slot>';
      }
      this.innerHTML =
        '<div style="position:absolute;inset:0">' + slot(afterId, afterSrc, afterPh) + '</div>' +
        '<div class="cs-voor" style="position:absolute;inset:0;clip-path:inset(0 48% 0 0)">' +
          '<div style="position:absolute;inset:0">' + slot(beforeId, beforeSrc, beforePh) + '</div>' +
          '<div style="position:absolute;inset:0;background:rgba(193,24,141,.14);pointer-events:none"></div>' +
        '</div>' +
        '<div class="cs-line" style="position:absolute;top:0;bottom:0;left:52%;width:0;pointer-events:none">' +
          '<div style="position:absolute;top:0;bottom:0;left:-1px;width:3px;background:#ffffff;box-shadow:0 0 18px rgba(0,0,0,.45)"></div>' +
          '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:50%;background:#ffffff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 28px rgba(0,0,0,.4);font-size:14px;font-weight:800;color:#14123a">\u25c2\u25b8</div>' +
        '</div>' +
        '<span style="position:absolute;top:14px;left:14px;font-size:10.5px;font-weight:800;letter-spacing:.1em;color:#ffffff;background:rgba(20,18,58,.85);padding:7px 14px;border-radius:99px;pointer-events:none;font-family:\'Facit\',\'Montserrat\',system-ui,sans-serif">' + beforeLabel + '</span>' +
        '<span style="position:absolute;top:14px;right:14px;font-size:10.5px;font-weight:800;letter-spacing:.1em;color:#14123a;background:#b4d232;padding:7px 14px;border-radius:99px;pointer-events:none;font-family:\'Facit\',\'Montserrat\',system-ui,sans-serif">' + afterLabel + '</span>';

      var voor = this.querySelector('.cs-voor');
      var line = this.querySelector('.cs-line');
      var self = this;
      var drag = false;
      function pos(e) {
        var r = self.getBoundingClientRect();
        return Math.max(6, Math.min(94, ((e.clientX - r.left) / r.width) * 100));
      }
      function apply(x) {
        voor.style.clipPath = 'inset(0 ' + (100 - x) + '% 0 0)';
        line.style.left = x + '%';
      }
      this.addEventListener('pointerdown', function (e) {
        drag = true;
        if (self.setPointerCapture) self.setPointerCapture(e.pointerId);
        apply(pos(e));
      });
      this.addEventListener('pointermove', function (e) { if (drag) apply(pos(e)); });
      this.addEventListener('pointerup', function () { drag = false; });
      this.addEventListener('pointercancel', function () { drag = false; });
    }
  }
  customElements.define('clash-slider', ClashSlider);
})();
