/**
 * Breeze Blog — Blog Listing
 * Minimal list style with bold titles.
 */
(function () {
  'use strict';

  var grid = document.getElementById('postsGrid');
  var search = document.getElementById('blogSearch');
  var filterBar = document.getElementById('filterBar');
  var empty = document.getElementById('emptyState');

  if (!grid) return;

  var currentCategory = '';

  var CAT_COLORS = {
    '生活': '#e88ca5',
    '技术': '#7ec8e0',
    '设计': '#d4a76a',
  };

  function getCatColor(cat) {
    return CAT_COLORS[cat] || 'var(--color-accent)';
  }

  function renderPosts() {
    var posts = BlogStore.getPublishedPosts();
    var query = (search ? search.value.trim() : '').toLowerCase();

    if (currentCategory) {
      posts = posts.filter(function (p) { return p.category === currentCategory; });
    }

    if (query) {
      posts = posts.filter(function (p) {
        return p.title.toLowerCase().indexOf(query) !== -1
          || (p.excerpt && p.excerpt.toLowerCase().indexOf(query) !== -1);
      });
    }

    if (posts.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.style.display = '';
      return;
    }

    if (empty) empty.style.display = 'none';

    var html = '';
    posts.forEach(function (p) {
      var color = getCatColor(p.category);
      html += '<article class="blist" style="--c:' + color + '">'
        + '<div class="blist-bar"></div>'
        + '<div class="blist-body">'
        + '<div class="blist-meta">'
        + '<span class="blist-cat">' + BlogUtils.esc(p.category || '') + '</span>'
        + '<span class="blist-date">' + BlogUtils.esc(p.date) + '</span>'
        + '</div>'
        + '<h2 class="blist-title"><a href="post.html?slug=' + encodeURIComponent(p.slug) + '">' + BlogUtils.esc(p.title) + '</a></h2>'
        + '<p class="blist-excerpt">' + BlogUtils.esc(p.excerpt || '') + '</p>'
        + '</div>'
        + '</article>';
    });
    grid.innerHTML = html;
  }

  function buildFilters() {
    if (!filterBar) return;
    var cats = BlogStore.getCategories();
    var html = '<button type="button" class="filter-btn active" data-category="">' + BlogUtils.t('allCategories') + '</button>';
    cats.forEach(function (c) {
      html += '<button type="button" class="filter-btn" data-category="' + BlogUtils.escAttr(c) + '">' + BlogUtils.esc(c) + '</button>';
    });
    filterBar.innerHTML = html;

    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterBar.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category') || '';
      renderPosts();
    });
  }

  function init() {
    if (search) { search.placeholder = BlogUtils.t('search'); }
    buildFilters();
    renderPosts();
    if (search) {
      search.addEventListener('input', renderPosts);
    }
  }

  BlogUtils.onReady(init);
})();
