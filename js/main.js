/**
 * Breeze Blog — Global Features
 */
var BlogMain = (function () {
  'use strict';

  /* ──────────────────────────────────────────────
     i18n
     ────────────────────────────────────────────── */
  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var text = BlogUtils.t(key);
      if (text !== key) el.textContent = text;
    });
  }

  function initI18n() {
    applyI18n();
  }

  /* ──────────────────────────────────────────────
     Mobile Nav Toggle
     ────────────────────────────────────────────── */
  function initMobileNav() {
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (!links.contains(e.target) && !toggle.contains(e.target)) {
        links.classList.remove('open');
      }
    });
  }

  /* ──────────────────────────────────────────────
     Image Lightbox
     ────────────────────────────────────────────── */
  function initLightbox() {
    var content = document.querySelector('.article-content');
    if (!content) return;

    content.addEventListener('click', function (e) {
      var img = e.target.closest('img');
      if (!img || img.closest('a')) return;

      var overlay = document.createElement('div');
      overlay.className = 'lightbox';
      overlay.innerHTML = '<img src="' + BlogUtils.escAttr(img.src) + '" alt="' + BlogUtils.escAttr(img.alt) + '">';
      document.body.appendChild(overlay);

      requestAnimationFrame(function () { overlay.classList.add('open'); });

      overlay.addEventListener('click', function () {
        overlay.classList.remove('open');
        setTimeout(function () { overlay.remove(); }, 300);
      });

      document.addEventListener('keydown', function handler(ev) {
        if (ev.key === 'Escape') {
          overlay.classList.remove('open');
          setTimeout(function () { overlay.remove(); }, 300);
          document.removeEventListener('keydown', handler);
        }
      });
    });
  }

  /* ──────────────────────────────────────────────
     Admin Toggle (5-click logo)
     ────────────────────────────────────────────── */
  function initAdminToggle() {
    var logo = document.querySelector('.nav-logo');
    if (!logo) return;

    var clickCount = 0;
    var timer = null;

    logo.addEventListener('click', function (e) {
      e.preventDefault();
      clickCount++;
      if (clickCount === 5) {
        clickCount = 0;
        var isAdmin = localStorage.getItem('breeze_admin') === 'true';
        if (isAdmin) {
          localStorage.removeItem('breeze_admin');
          document.body.classList.remove('admin-mode');
          BlogUtils.showToast('Admin mode off');
        } else {
          localStorage.setItem('breeze_admin', 'true');
          document.body.classList.add('admin-mode');
          BlogUtils.showToast('Admin mode on');
        }
        return;
      }
      clearTimeout(timer);
      timer = setTimeout(function () { clickCount = 0; }, 1000);
    });
  }

  /* ──────────────────────────────────────────────
     Back to Top
     ────────────────────────────────────────────── */
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.id = 'backToTop';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 4l-8 8 1.41 1.41L12 6.83l6.59 6.58L20 12l-8-8z"/></svg>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ──────────────────────────────────────────────
     Init
     ────────────────────────────────────────────── */
  function init() {
    initI18n();
    initMobileNav();
    initLightbox();
    initAdminToggle();
    initBackToTop();
    if (localStorage.getItem('breeze_admin') === 'true') {
      document.body.classList.add('admin-mode');
    }
  }

  BlogUtils.onReady(init);
})();
