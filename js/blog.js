/**
 * Breeze Blog — Blog Listing
 * Dual-column layout with date/category on left, title/excerpt on right.
 */
(function () {
  'use strict';

  var grid = document.getElementById('postsGrid');
  var search = document.getElementById('blogSearch');
  var filterBar = document.getElementById('filterBar');
  var empty = document.getElementById('emptyState');

  if (!grid) return;

  var currentCategory = '';

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
      html += '<article class="post-card">'
        + '<span class="cat-badge">' + BlogUtils.esc(p.category || '') + '</span>'
        + '<div class="card-date">' + BlogUtils.esc(p.date) + '</div>'
        + '<h2><a href="post.html?slug=' + encodeURIComponent(p.slug) + '">' + BlogUtils.esc(p.title) + '</a></h2>'
        + '<p class="card-excerpt">' + BlogUtils.esc(p.excerpt || '') + '</p>'
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
