/**
 * Breeze Blog — Dynamic Post Viewer
 * Reads slug from URL, populates article from BlogStore.
 * Also handles TOC, progress bar, related posts.
 */
(function () {
  'use strict';

  var article = document.getElementById('postArticle');
  var notFound = document.getElementById('postNotFound');
  var footer = document.getElementById('postFooter');
  var relatedSection = document.getElementById('relatedSection');
  var relatedGrid = document.getElementById('relatedPosts');

  if (!article) return;

  /* ──────────────────────────────────────────────
     Populate Article
     ────────────────────────────────────────────── */
  function loadPost() {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get('slug');
    if (!slug) { show404(); return; }

    var post = BlogStore.getPostBySlug(slug);
    if (!post) { show404(); return; }

    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postDate').textContent = BlogUtils.formatDate(post.date);
    document.getElementById('postCategory').textContent = post.category || '';

    var rt = BlogUtils.readingTime(post.content);
    var rtEl = document.getElementById('postReadingTime');
    var wcEl = document.getElementById('postWordCount');
    var rtDot = document.getElementById('readingTimeDot');
    if (rtEl) rtEl.textContent = rt.minutes + BlogUtils.t('readingTime');
    if (wcEl) wcEl.textContent = rt.wordCount + BlogUtils.t('words');
    if (rtDot) rtDot.style.display = '';

    document.getElementById('postExcerpt').textContent = post.excerpt || '';
    document.getElementById('postContent').innerHTML = post.content;

    document.title = post.title + ' — Breeze';
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', post.excerpt || '');

    // Tags
    var tagsEl = document.getElementById('postTags');
    if (tagsEl && post.tags && post.tags.length > 0) {
      tagsEl.innerHTML = post.tags.map(function (t) {
        return '<span class="tag">' + BlogUtils.esc(t) + '</span>';
      }).join('');
    }

    // Show footer
    if (footer) footer.style.display = '';
    if (article) article.style.display = '';

    // Add IDs to headings for TOC
    addHeadingIds();

    // Build TOC
    buildTOC();

    // Related posts
    renderRelated(post);

    // Init progress bar
    initProgressBar();
  }

  function show404() {
    if (article) article.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (relatedSection) relatedSection.style.display = 'none';
    if (notFound) notFound.style.display = '';
  }

  /* ──────────────────────────────────────────────
     Heading IDs
     ────────────────────────────────────────────── */
  function addHeadingIds() {
    var content = document.getElementById('postContent');
    if (!content) return;
    var headings = content.querySelectorAll('h2, h3');
    var used = {};
    headings.forEach(function (h) {
      var text = h.textContent.trim();
      var id = text.replace(/\s+/g, '-').replace(/[^\w\-]/g, '') || 'heading';
      while (used[id]) id += '-';
      used[id] = true;
      h.id = id;
    });
  }

  /* ──────────────────────────────────────────────
     Table of Contents
     ────────────────────────────────────────────── */
  function buildTOC() {
    var content = document.getElementById('postContent');
    var tocInner = document.getElementById('tocInner');
    var tocMobileInner = document.getElementById('tocMobileInner');
    var tocWrapper = document.getElementById('tocWrapper');
    var tocToggle = document.getElementById('tocMobileToggle');
    var tocPanel = document.getElementById('tocMobilePanel');

    if (!content || !tocInner) return;

    var headings = content.querySelectorAll('h2, h3');
    if (headings.length < 2) {
      if (tocWrapper) tocWrapper.style.display = 'none';
      if (tocToggle) tocToggle.style.display = 'none';
      if (tocPanel) tocPanel.style.display = 'none';
      return;
    }

    var html = '<div class="toc-label">' + BlogUtils.t('toc') + '</div>';
    headings.forEach(function (h) {
      var indent = h.tagName === 'H3' ? ' style="padding-left:16px"' : '';
      html += '<a href="#' + h.id + '" class="toc-link"' + indent + '>' + BlogUtils.esc(h.textContent) + '</a>';
    });

    if (tocInner) { tocInner.innerHTML = html; tocWrapper.style.display = 'block'; }
    if (tocMobileInner) tocMobileInner.innerHTML = html;

    // Mobile toggle
    if (tocToggle && tocPanel) {
      tocToggle.style.display = 'flex';
      tocToggle.addEventListener('click', function () {
        tocPanel.classList.toggle('open');
      });
      document.addEventListener('click', function (e) {
        if (tocPanel.classList.contains('open') && !tocPanel.contains(e.target) && e.target !== tocToggle) {
          tocPanel.classList.remove('open');
        }
      });
    }

    // Scroll-based highlighting
    var tocLinks = (tocInner || document).querySelectorAll('.toc-link');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function (l) { l.classList.remove('active'); });
          var activeLink = tocInner.querySelector('a[href="#' + entry.target.id + '"]');
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px' });

    headings.forEach(function (h) { observer.observe(h); });
  }

  /* ──────────────────────────────────────────────
     Progress Bar
     ────────────────────────────────────────────── */
  function initProgressBar() {
    var bar = document.getElementById('progressBar');
    if (!bar) return;

    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────
     Related Posts
     ────────────────────────────────────────────── */
  function renderRelated(post) {
    if (!relatedGrid || !relatedSection) return;

    var posts = BlogStore.getPublishedPosts().filter(function (p) { return p.id !== post.id; });
    if (posts.length === 0) { relatedSection.style.display = 'none'; return; }

    // Score by tag overlap
    var scored = posts.map(function (p) {
      var overlap = 0;
      if (p.tags && post.tags) {
        p.tags.forEach(function (t) {
          if (post.tags.indexOf(t) !== -1) overlap++;
        });
      }
      return { post: p, score: overlap };
    });

    // Sort by score desc, then date desc
    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return b.post.createdAt - a.post.createdAt;
    });

    var top = scored.slice(0, 3);
    var html = '';
    top.forEach(function (item) {
      var p = item.post;
      html += '<div class="related-card">'
        + '<div class="meta">' + BlogUtils.esc(p.date) + '</div>'
        + '<h3><a href="post.html?slug=' + encodeURIComponent(p.slug) + '">' + BlogUtils.esc(p.title) + '</a></h3>'
        + '</div>';
    });

    relatedGrid.innerHTML = html;
    relatedSection.style.display = '';
  }

  /* ──────────────────────────────────────────────
     Init
     ────────────────────────────────────────────── */
  BlogUtils.onReady(loadPost);
})();
