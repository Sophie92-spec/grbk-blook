/**
 * Breeze Blog — About Page
 * Visitor tracking with localStorage.
 */
(function () {
  'use strict';

  var infoEl = document.getElementById('aboutVisitInfo');
  if (!infoEl) return; // not on about page

  var VISIT_KEY = 'breeze_about_visits';

  function trackVisit() {
    var data;
    try {
      data = JSON.parse(localStorage.getItem(VISIT_KEY)) || { count: 0, lastVisit: null };
    } catch (e) {
      data = { count: 0, lastVisit: null };
    }

    var now = new Date();
    var nowStr = now.getFullYear() + '.' +
      String(now.getMonth() + 1).padStart(2, '0') + '.' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0');

    data.count++;
    var prevVisit = data.lastVisit;
    data.lastVisit = nowStr;

    try {
      localStorage.setItem(VISIT_KEY, JSON.stringify(data));
    } catch (e) {}

    // Render
    var html = '<div style="text-align:center;color:var(--color-text-muted);font-size:14px;padding:16px 0;border-top:1px solid var(--color-line)">';
    html += '你已访问 <strong style="color:var(--color-accent)">' + data.count + '</strong> 次';
    if (prevVisit) {
      html += ' · 上次访问: ' + prevVisit;
    }
    html += '</div>';
    infoEl.innerHTML = html;
  }

  BlogUtils.onReady(trackVisit);
})();
