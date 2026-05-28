/**
 * Breeze Blog — Home Page
 * Greeting, featured post, latest posts, quote, clock, stats.
 */
(function () {
  'use strict';

  var featuredEl = document.getElementById('homeFeatured');
  var latestList = document.getElementById('homeLatestList');
  var quoteText = document.getElementById('homeQuoteText');
  var quoteBtn = document.getElementById('homeQuoteBtn');
  var clockEl = document.getElementById('homeClock');
  var daysEl = document.getElementById('homeDays');
  var countEl = document.getElementById('homePostCount');

  if (!featuredEl && !latestList && !quoteText) return; // not on home page

  /* ──────────────────────────────────────────────
     Quotes
     ────────────────────────────────────────────── */
  var quotes = [
    '大道至简。 — 列奥纳多·达·芬奇',
    '空谈无用，代码为证。 — Linus Torvalds',
    '种一棵树最好的时间是十年前，其次是现在。',
    '写作不是为了传播思想，而是为了澄清思想。',
    '先解决问题，再写代码。 — John Johnson',
    '保持好奇，保持谦逊。',
    '代码就像幽默，需要解释就不好笑了。 — Cory House',
    '知道该加什么是技能，知道该删什么是智慧。',
    '成就伟大的唯一方式是热爱你所做的事。 — Steve Jobs',
    '任何足够先进的技术都 indistinguishable from magic。 — Arthur C. Clarke',
    '在碎片化的时代，经营好自己的一隅。',
    '完美不是无可添加，而是无可删减。 — Antoine de Saint-Exupéry',
    '每一天都是新的开始。',
  ];

  function showRandomQuote() {
    var idx = Math.floor(Math.random() * quotes.length);
    if (quoteText) quoteText.textContent = quotes[idx];
  }

  if (quoteBtn) {
    quoteBtn.addEventListener('click', showRandomQuote);
  }
  showRandomQuote();

  /* ──────────────────────────────────────────────
     Featured Post
     ────────────────────────────────────────────── */
  function renderFeatured() {
    var posts = BlogStore.getPublishedPosts();
    if (posts.length === 0) {
      if (featuredEl) featuredEl.style.display = 'none';
      return;
    }
    var post = posts[0];
    var link = document.getElementById('featuredLink');
    var date = document.getElementById('featuredDate');
    var tag = document.getElementById('featuredTag');
    var excerpt = document.getElementById('featuredExcerpt');
    if (link) { link.textContent = post.title; link.href = 'post.html?slug=' + encodeURIComponent(post.slug); }
    if (date) date.textContent = BlogUtils.formatDate(post.date);
    if (tag) tag.textContent = post.category || '';
    if (excerpt) excerpt.textContent = post.excerpt || '';
  }

  /* ──────────────────────────────────────────────
     Latest Posts List
     ────────────────────────────────────────────── */
  function renderLatest() {
    if (!latestList) return;
    var posts = BlogStore.getPublishedPosts().slice(0, 5);
    if (posts.length === 0) {
      latestList.innerHTML = '<li class="home-post-card"><span class="date" style="color:var(--color-text-muted)">还没有文章</span></li>';
      return;
    }
    var html = '';
    posts.forEach(function (p) {
      html += '<li class="home-post-card">'
        + '<span class="tag">' + BlogUtils.esc(p.category || '') + '</span>'
        + '<h3><a href="post.html?slug=' + encodeURIComponent(p.slug) + '">' + BlogUtils.esc(p.title) + '</a></h3>'
        + '<span class="date">' + BlogUtils.esc(p.date) + '</span>'
        + '<div class="excerpt">' + BlogUtils.esc(p.excerpt || '') + '</div>'
        + '</li>';
    });
    latestList.innerHTML = html;
  }

  /* ──────────────────────────────────────────────
     Stats
     ────────────────────────────────────────────── */
  function updateClock() {
    if (!clockEl) return;
    var now = new Date();
    var h = now.getHours().toString().padStart(2, '0');
    var m = now.getMinutes().toString().padStart(2, '0');
    var s = now.getSeconds().toString().padStart(2, '0');
    clockEl.textContent = h + ':' + m + ':' + s;
  }

  function updateDays() {
    if (!daysEl) return;
    var launch = new Date(2026, 0, 1);
    var now = new Date();
    var diff = Math.floor((now - launch) / (1000 * 60 * 60 * 24));
    daysEl.textContent = diff;
  }

  function updatePostCount() {
    if (!countEl) return;
    countEl.textContent = BlogStore.getPublishedPosts().length;
  }

  /* ──────────────────────────────────────────────
     Init
     ────────────────────────────────────────────── */
  function init() {
    renderFeatured();
    renderLatest();
    updateClock();
    updateDays();
    updatePostCount();
    setInterval(updateClock, 1000);
  }

  BlogUtils.onReady(init);
})();
