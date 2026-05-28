/**
 * Breeze Blog — Archive Page
 * Dual-column timeline grouped by year then month.
 */
(function () {
  'use strict';

  var container = document.getElementById('archiveContainer');
  var empty = document.getElementById('archiveEmpty');
  if (!container) return;

  function renderArchive() {
    var posts = BlogStore.getPublishedPosts();
    if (posts.length === 0) {
      container.innerHTML = '';
      if (empty) empty.style.display = '';
      return;
    }
    if (empty) empty.style.display = 'none';

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Group by year → month
    var years = {};
    posts.forEach(function (p) {
      var parts = p.date ? p.date.split('.') : [];
      if (parts.length < 2) return;
      var year = parts[0];
      var month = parts.length >= 2 ? parseInt(parts[1]) : 1;
      if (!years[year]) years[year] = {};
      if (!years[year][month]) years[year][month] = [];
      years[year][month].push(p);
    });

    var html = '';
    Object.keys(years).sort().reverse().forEach(function (year) {
      html += '<div class="archive-year">'
        + '<h2 class="archive-year-title">' + year + '</h2>';

      Object.keys(years[year]).sort().reverse().forEach(function (month) {
        var postsInMonth = years[year][month];
        html += '<div class="archive-month">'
          + '<h3 class="archive-month-title">' + monthNames[parseInt(month) - 1] + '</h3>';

        postsInMonth.forEach(function (p) {
          var dateDisplay = p.date;
          if (p.date) {
            var d = p.date.split('.');
            if (d.length === 3) {
              dateDisplay = monthNames[parseInt(d[1]) - 1] + ' ' + parseInt(d[2]);
            }
          }
          html += '<div class="archive-row">'
            + '<div class="archive-row-left">'
            + '<span class="archive-row-date">' + BlogUtils.esc(dateDisplay) + '</span>'
            + '</div>'
            + '<div class="archive-row-right">'
            + '<a href="post.html?slug=' + encodeURIComponent(p.slug) + '" class="archive-row-title">' + BlogUtils.esc(p.title) + '</a>'
            + '<span class="archive-row-cat">' + BlogUtils.esc(p.category || '') + '</span>'
            + '</div>'
            + '</div>';
        });

        html += '</div>';
      });

      html += '</div>';
    });

    container.innerHTML = html;
  }

  BlogUtils.onReady(renderArchive);
})();
