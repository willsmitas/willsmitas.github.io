/* ---------------------------------------------------------------
   Carousel (arrows, rail, keyboard, drag/swipe) and theme toggle.
   No dependencies.
   --------------------------------------------------------------- */

(function () {
  'use strict';

  /* ------------------------------------------------------ carousel */

  function initCarousel(root) {
    var viewport = root.querySelector('[data-viewport]');
    var track    = root.querySelector('[data-track]');
    var rail     = root.querySelector('[data-rail]');
    var caption  = root.querySelector('[data-caption-out]');
    var prevBtn  = root.querySelector('[data-prev]');
    var nextBtn  = root.querySelector('[data-next]');
    var slides   = Array.prototype.slice.call(track.children);

    if (!slides.length) return;

    // data-shuffle: a different order on every load.
    if (root.hasAttribute('data-shuffle')) {
      for (var i = slides.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var swap = slides[i]; slides[i] = slides[j]; slides[j] = swap;
      }
      slides.forEach(function (slide) { track.appendChild(slide); });
    }

    var index = 0;
    var segments = [];

    slides.forEach(function (slide, i) {
      var id = 'slide-' + (i + 1);
      slide.id = id;
      slide.setAttribute('role', 'tabpanel');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', (i + 1) + ' of ' + slides.length);

      var seg = document.createElement('button');
      seg.type = 'button';
      seg.setAttribute('role', 'tab');
      seg.setAttribute('aria-controls', id);
      seg.setAttribute('aria-label', 'Image ' + (i + 1));
      seg.addEventListener('click', function () { goTo(i); });
      rail.appendChild(seg);
      segments.push(seg);
    });

    function wrap(n) {
      var count = slides.length;
      return ((n % count) + count) % count;
    }

    // Drop lazy loading one slide either side of the current one, so a fast
    // swipe never lands on a blank frame.
    function preload(i) {
      [i - 1, i, i + 1].forEach(function (n) {
        var img = slides[wrap(n)].querySelector('img[loading="lazy"]');
        if (img) img.removeAttribute('loading');
      });
    }

    function render(offset) {
      var pct = -index * 100;
      track.style.transform = offset
        ? 'translate3d(calc(' + pct + '% + ' + offset + 'px), 0, 0)'
        : 'translate3d(' + pct + '%, 0, 0)';

      segments.forEach(function (seg, i) {
        seg.setAttribute('aria-selected', i === index ? 'true' : 'false');
        seg.tabIndex = i === index ? 0 : -1;
      });

      slides.forEach(function (slide, i) {
        slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      });

      if (caption) caption.textContent = slides[index].dataset.caption || '';
      preload(index);
    }

    function goTo(next) {
      index = wrap(next);
      render(0);
    }

    function step(delta) { goTo(index + delta); }

    prevBtn.addEventListener('click', function () { step(-1); });
    nextBtn.addEventListener('click', function () { step(1); });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')       { step(-1); }
      else if (e.key === 'ArrowRight') { step(1); }
      else if (e.key === 'Home')       { goTo(0); }
      else if (e.key === 'End')        { goTo(slides.length - 1); }
      else { return; }
      e.preventDefault();
    });

    /* --- pointer drag / swipe --- */
    var dragging   = false;
    var pointerId  = null;
    var startX     = 0;
    var startY     = 0;
    var deltaX     = 0;
    var horizontal = null; // null until the gesture's axis is known

    viewport.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging   = true;
      pointerId  = e.pointerId;
      startX     = e.clientX;
      startY     = e.clientY;
      deltaX     = 0;
      horizontal = e.pointerType === 'mouse' ? true : null;
      root.classList.add('is-dragging');
    });

    viewport.addEventListener('pointermove', function (e) {
      if (!dragging || e.pointerId !== pointerId) return;

      var dx = e.clientX - startX;
      var dy = e.clientY - startY;

      // On touch, a vertical swipe should scroll the page instead.
      if (horizontal === null) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        horizontal = Math.abs(dx) > Math.abs(dy);
        if (!horizontal) { endDrag(); return; }
        viewport.setPointerCapture(pointerId);
      }

      deltaX = dx;

      var atEdge = (index === 0 && dx > 0) ||
                   (index === slides.length - 1 && dx < 0);
      render(atEdge ? dx * 0.35 : dx); // resist dragging past the ends
      e.preventDefault();
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      root.classList.remove('is-dragging');
      if (pointerId !== null && viewport.hasPointerCapture(pointerId)) {
        viewport.releasePointerCapture(pointerId);
      }
      pointerId = null;

      var threshold = Math.min(90, viewport.clientWidth * 0.15);
      if (deltaX <= -threshold)     { step(1); }
      else if (deltaX >= threshold) { step(-1); }
      else                          { render(0); }
      deltaX = 0;
    }

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('lostpointercapture', endDrag);

    // A drag that ends on an image shouldn't also fire a click.
    viewport.addEventListener('click', function (e) {
      if (Math.abs(deltaX) > 4) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    render(0);
  }

  document.querySelectorAll('[data-carousel]').forEach(initCarousel);

  /* -------------------------------------------------------- theme */

  var toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    var root = document.documentElement;
    var media = window.matchMedia('(prefers-color-scheme: dark)');

    function current() {
      return root.dataset.theme || (media.matches ? 'dark' : 'light');
    }

    function label() {
      var next = current() === 'dark' ? 'light' : 'dark';
      toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    }

    toggle.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      label();
    });

    // Follow the OS until the visitor has made a choice of their own.
    media.addEventListener('change', function () {
      if (!root.dataset.theme) label();
    });

    label();
  }

  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
