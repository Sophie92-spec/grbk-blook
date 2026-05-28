/**
 * Breeze Blog — Archive Page
 * Block list with year stripes.
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
    var yearKeys = Object.keys(years).sort().reverse();

    yearKeys.forEach(function (year) {
      var months = Object.keys(years[year]).sort().reverse();

      html += '<div class="barch"><div class="barch-strip"></div><div class="barch-body">'
        + '<div class="barch-year">' + year + '</div>';

      months.forEach(function (month) {
        var postsInMonth = years[year][month];
        postsInMonth.forEach(function (p) {
          var day = p.date ? p.date.split('.')[2] : '';
          var dateStr = monthNames[parseInt(month) - 1] + ' ' + day;
          html += '<div class="barch-post"><span class="barch-d">' + dateStr + '</span><a href="post.html?slug=' + encodeURIComponent(p.slug) + '" class="barch-t">' + BlogUtils.esc(p.title) + '</a></div>';
        });
      });

      html += '</div></div>';
    });

    container.innerHTML = html;
  }

  BlogUtils.onReady(renderArchive);
})();
