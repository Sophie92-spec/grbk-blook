/**
 * Breeze Blog — Data Store
 * localStorage persistence layer with CRUD operations.
 */
var BlogStore = (function () {
  'use strict';

  const STORAGE_KEY = 'breeze_posts';
  const SEEDED_KEY = 'breeze_seeded';
  const SCHEMA_KEY = 'breeze_schema';
  const SCHEMA_VER = 3; // invalidate old English seed data, re-seed with Chinese

  /* ──────────────────────────────────────────────
     Seed Data
     ────────────────────────────────────────────── */
  const seedPosts = [
    {
      id: 'p_hello_world',
      title: '重新开始写博客',
      slug: 'starting-over-with-blogging',
      date: '2026.05.19',
      category: '生活',
      excerpt: '在碎片化的时代，为什么还要经营一个自己的角落？',
      content: '<p>距离上一次认真写东西，已经过去很久了。</p><p>上次写博客还是大学时候 —— WordPress，主题，插件，各种花哨功能。后来工作了，渐渐就停了。不是因为忙，而是不知道写什么了。</p><p>社交媒体让表达变得很容易 —— 140 字、一张照片、一段短视频。但也让表达变得廉价。习惯了碎片化的输出，追逐点赞和转发，真正的思考和沉淀反而少了。</p><h2>为什么重新开始写？</h2><p>今年初整理笔记时，发现过去几年留下的记录少得可怜。很多有价值的想法，因为没有及时记录而流失了。</p><blockquote>写作不是为了传播思想，而是为了澄清思想。</blockquote><p>写博客对我来说有三个意义：</p><h3>1. 更深入的思考</h3><p>当你试图把一个想法写清楚时，不得不从各个角度审视它。很多我以为懂了的事情，在试图说清楚时发现其实并没有那么清晰。</p><h3>2. 构建知识体系</h3><p>碎片化阅读让知识点散落四处。写作迫使我把它们串联起来，用自己的语言重新组织——这才是构建知识体系的本质。</p><h3>3. 记录成长轨迹</h3><p>几年前写的代码，现在看来很幼稚。这种「过去的自己真菜」的感觉，恰恰是成长的标志。博客就是这条轨迹的记录。</p><h2>关于这个博客</h2><p>没有复杂的架构，没有花哨的功能，甚至没有后端。只有最简单的静态 HTML 和 CSS。</p><ul><li>纯静态页面，不需要数据库</li><li>只有必要的样式和内容</li><li>任何设备都能流畅阅读</li></ul><hr><p>种一棵树最好的时间是十年前，其次是现在。写一篇文章也是。</p>',
      tags: ['生活', '写作', '思考'],
      published: true,
      createdAt: 1747641600000,
      updatedAt: 1747641600000
    },
    {
      id: 'p_post_1',
      title: 'CSS Container Queries 实战指南',
      slug: 'css-container-queries-practical-guide',
      date: '2026.05.18',
      category: '技术',
      excerpt: '超越 Media Queries，用 Container Queries 构建真正自适应的组件。',
      content: '<p>多年来，我们一直依赖 Media Queries 做响应式布局。但 Media Queries 只能检查视口大小，无法知道组件所在容器的大小。</p><p>一个在侧边栏中看起来很完美的组件，放到主内容区域时可能格格不入。</p><h2>基本用法</h2><pre><code>.card-container {\n  container-type: inline-size;\n  container-name: card;\n}\n\n@container card (min-width: 400px) {\n  .card {\n    display: grid;\n    grid-template-columns: 1fr 2fr;\n  }\n}</code></pre><p>Container Queries 让组件真正做到「一次编写，到处运行」。</p>',
      tags: ['技术', 'CSS'],
      published: true,
      createdAt: 1747555200000,
      updatedAt: 1747555200000
    },
    {
      id: 'p_post_2',
      title: '极简设计的本质',
      slug: 'essence-of-minimal-design',
      date: '2026.05.15',
      category: '设计',
      excerpt: '好的设计不是没有装饰，而是每个元素都有其存在的理由。',
      content: '<p>很多人以为极简设计就是「少」—— 更多的留白，更克制的装饰。但真正的极简设计从来不是数量的多少，而是意图的明确。</p><p>每当你想要添加一个元素时，问自己三个问题：</p><ul><li>这能帮助用户理解内容吗？</li><li>它让界面更直观了吗？</li><li>去掉它会让体验变差吗？</li></ul><blockquote>设计不仅是它看起来怎样、感觉怎样，设计是它如何运作。— Steve Jobs</blockquote><p>知道该加什么是技能，知道该删什么是智慧。</p>',
      tags: ['设计', '极简'],
      published: true,
      createdAt: 1747296000000,
      updatedAt: 1747296000000
    },
    {
      id: 'p_post_3',
      title: '三个月晨间写作的收获',
      slug: 'three-months-of-morning-writing',
      date: '2026.05.12',
      category: '生活',
      excerpt: '连续 90 天每天早上写作，我学到了什么。',
      content: '<p>三个月前，我做了一个小决定：每天早上醒来后，打开任何社交媒体之前，先写 30 分钟。</p><p>不是什么宏大的项目，也不是工作计划 —— 只是自由书写。记录昨天的想法，整理今天的计划，或者只是让思绪自由流淌。</p><h2>发生了什么变化</h2><ul><li><strong>思维更清晰</strong> — 写作迫使模糊的想法成形</li><li><strong>焦虑更少</strong> — 把事情写下来，它们就没那么可怕了</li><li><strong>更有创造力</strong> — 不加评判地写，意外的连接会自然浮现</li></ul><p>三个月过去，这已经不再是「习惯」，而是需求。有人需要咖啡因，我需要那 30 分钟和自我的对话。</p>',
      tags: ['生活', '写作'],
      published: true,
      createdAt: 1747036800000,
      updatedAt: 1747036800000
    },
    {
      id: 'p_post_4',
      title: '现代 CSS 主题系统',
      slug: 'modern-css-theme-systems',
      date: '2026.05.08',
      category: '技术',
      excerpt: '用 CSS 自定义属性和层叠规则构建优雅、可维护的主题系统。',
      content: '<p>CSS 自定义属性已经广泛支持，但很多人仍然把它们当简单的变量替换来用。</p><p>结合 CSS 层叠规则和 @layer，可以构建出非常优雅的主题系统。</p><h2>核心思路</h2><pre><code>:root {\n  --color-bg: #ffffff;\n  --color-text: #1d1d1f;\n}\n\n[data-theme="dark"] {\n  --color-bg: #000000;\n  --color-text: #f5f5f7;\n}\n\nbody {\n  background: var(--color-bg);\n  color: var(--color-text);\n}</code></pre><p>利用层叠本身的优先级，无需 JavaScript 即可切换主题。配合 @layer 管理优先级，代码更加可维护。</p>',
      tags: ['技术', 'CSS', '主题'],
      published: true,
      createdAt: 1746691200000,
      updatedAt: 1746691200000
    }
  ];

  /* ──────────────────────────────────────────────
     Private Helpers
     ────────────────────────────────────────────── */
  function loadPosts() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through */ }
    }
    return null;
  }

  function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  function ensureSeeded() {
    // Check schema version — clear old data if stale
    if (localStorage.getItem(SCHEMA_KEY) !== String(SCHEMA_VER)) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SEEDED_KEY);
      localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VER));
    }
    if (localStorage.getItem(SEEDED_KEY) === 'true') return;
    const existing = loadPosts();
    if (!existing || existing.length === 0) {
      savePosts(seedPosts);
    }
    localStorage.setItem(SEEDED_KEY, 'true');
  }

  /* ──────────────────────────────────────────────
     Public API
     ────────────────────────────────────────────── */
  function getPosts() {
    ensureSeeded();
    return loadPosts() || [];
  }

  function getPublishedPosts() {
    return getPosts()
      .filter(function (p) { return p.published; })
      .sort(function (a, b) { return b.createdAt - a.createdAt; });
  }

  function getPost(id) {
    return getPosts().find(function (p) { return p.id === id; }) || null;
  }

  function getPostBySlug(slug) {
    return getPosts().find(function (p) { return p.slug === slug; }) || null;
  }

  function getCategories() {
    const cats = {};
    getPosts().forEach(function (p) {
      if (p.category) cats[p.category] = true;
    });
    return Object.keys(cats).sort();
  }

  function createPost(data) {
    const posts = getPosts();
    const slug = ensureUniqueSlug(BlogUtils.generateSlug(data.title || ''));
    const now = Date.now();
    const post = {
      id: BlogUtils.createId(),
      title: data.title || '',
      slug: slug,
      date: data.date || '',
      category: data.category || '',
      excerpt: data.excerpt || '',
      content: data.content || '',
      tags: data.tags || [],
      published: data.published !== false,
      createdAt: now,
      updatedAt: now
    };
    posts.push(post);
    savePosts(posts);
    return post;
  }

  function updatePost(id, data) {
    const posts = getPosts();
    const idx = posts.findIndex(function (p) { return p.id === id; });
    if (idx === -1) return null;
    const post = posts[idx];
    if (data.title !== undefined) post.title = data.title;
    if (data.slug !== undefined) post.slug = ensureUniqueSlug(data.slug, id);
    if (data.date !== undefined) post.date = data.date;
    if (data.category !== undefined) post.category = data.category;
    if (data.excerpt !== undefined) post.excerpt = data.excerpt;
    if (data.content !== undefined) post.content = data.content;
    if (data.tags !== undefined) post.tags = data.tags;
    if (data.published !== undefined) post.published = data.published;
    post.updatedAt = Date.now();
    posts[idx] = post;
    savePosts(posts);
    return post;
  }

  function deletePost(id) {
    const posts = getPosts();
    const filtered = posts.filter(function (p) { return p.id !== id; });
    if (filtered.length === posts.length) return false;
    savePosts(filtered);
    return true;
  }

  function ensureUniqueSlug(slug, excludeId) {
    const posts = getPosts();
    let candidate = slug;
    let counter = 1;
    while (posts.some(function (p) { return p.slug === candidate && p.id !== excludeId; })) {
      candidate = slug + '-' + (++counter);
    }
    return candidate;
  }

  /* ──────────────────────────────────────────────
     Init
     ────────────────────────────────────────────── */
  ensureSeeded();

  return {
    getPosts: getPosts,
    getPublishedPosts: getPublishedPosts,
    getPost: getPost,
    getPostBySlug: getPostBySlug,
    getCategories: getCategories,
    createPost: createPost,
    updatePost: updatePost,
    deletePost: deletePost
  };
})();
