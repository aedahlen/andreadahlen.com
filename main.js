/* Andrea Dahlén — andreadahlen.com */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- year ---------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- theme ---------- */
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function paintToggle() {
    var dark = currentTheme() === 'dark';
    var sun = document.querySelector('.sun'), moon = document.querySelector('.moon');
    if (sun) sun.style.display = dark ? 'none' : 'block';
    if (moon) moon.style.display = dark ? 'block' : 'none';
  }
  paintToggle();
  var themeBtn = document.getElementById('theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ad-theme', next); } catch (e) {}
      paintToggle();
    });
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paintToggle);

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) { /* nothing to do */ }
  else if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  counters.forEach(function (el) {
    el.textContent = (+el.dataset.count).toLocaleString('en-GB') + (el.dataset.suffix || '');
  });
  if (counters.length && !reduce && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target,
            target = +el.dataset.count,
            suffix = el.dataset.suffix || '';
        cio.unobserve(el);
        el.textContent = '0' + suffix;
        var start = null;
        function tick(now) {
          if (!start) start = now;
          var p = Math.min((now - start) / 900, 1),
              eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString('en-GB') + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- hero greeting cycle ---------- */
  var greet = document.querySelector('.hero-greeting');
  if (greet) {
    var words = Array.prototype.slice.call(greet.querySelectorAll('.greeting-word'));
    if (words.length > 1 && !reduce) {
      var gi = 0;
      words[0].classList.add('is-active');
      setInterval(function () {
        var prev = words[gi];
        prev.classList.remove('is-active');
        prev.classList.add('is-leaving');
        gi = (gi + 1) % words.length;
        words[gi].classList.remove('is-leaving');
        words[gi].classList.add('is-active');
        setTimeout(function () { prev.classList.remove('is-leaving'); }, 500);
      }, 2400);
    } else if (words.length) {
      words.forEach(function (w) { w.classList.add('is-active'); });
    }
  }

  /* ---------- case study process rail ---------- */
  var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var detail = document.getElementById('stepDetail');
  if (steps.length && detail) {
    var copy = steps.map(function (s) {
      return {
        label: s.querySelector('.node').textContent.trim() + ' · ' + s.querySelector('.nm').textContent.trim(),
        body: s.dataset.detail || ''
      };
    });
    function select(i) {
      steps.forEach(function (x, n) {
        var on = n === i;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
      });
      detail.setAttribute('aria-labelledby', steps[i].id);
      detail.innerHTML = '<h3>' + copy[i].label + '</h3><p>' + copy[i].body + '</p>';
    }
    steps.forEach(function (s, i) {
      s.addEventListener('click', function () { select(i); });
      s.addEventListener('keydown', function (e) {
        var next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? i + 1
                 : e.key === 'ArrowLeft'  || e.key === 'ArrowUp'   ? i - 1 : null;
        if (next === null) return;
        e.preventDefault();
        next = (next + steps.length) % steps.length;
        steps[next].focus();
        select(next);
      });
    });
  }

  /* ---------- images that haven't been added yet degrade to a plate ---------- */
  document.querySelectorAll('.fig-plate img').forEach(function (img) {
    img.addEventListener('error', function () {
      var plate = img.parentNode;
      plate.classList.remove('img');
      plate.classList.add('ph');
      plate.innerHTML = '<span class="fig-tag">Add image</span>' +
        '<span class="ph-mark"><i></i><b>' + (img.dataset.mark || 'Image') + '</b></span>';
    });
  });
})();
