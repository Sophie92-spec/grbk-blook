/**
 * Breeze Blog — Shared Utilities
 * Must be loaded before all other scripts.
 */
var BlogUtils = (function () {
  'use strict';

  /* ──────────────────────────────────────────────
     HTML Escaping
     ────────────────────────────────────────────── */
  function esc(str) {
    if (typeof str !== 'string') return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function escAttr(str) {
    return esc(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ──────────────────────────────────────────────
     Slug
     ────────────────────────────────────────────── */
  function generateSlug(title) {
    return title.trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .replace(/\-+/g, '-')
      .replace(/^\-|\-$/g, '') || 'untitled';
  }

  /* ──────────────────────────────────────────────
     Date Helpers
     ────────────────────────────────────────────── */
  function formatDate(dateStr) {
    if (!dateStr) return '';
    var parts = dateStr.split('.');
    if (parts.length === 3) {
      return parts[0] + ' / ' + parts[1] + ' / ' + parts[2];
    }
    return dateStr;
  }

  function todayStr() {
    var d = new Date();
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return d.getFullYear() + '.' + pad(d.getMonth() + 1) + '.' + pad(d.getDate());
  }

  function dateToInput(dateStr) {
    if (!dateStr) return '';
    return dateStr.replace(/\./g, '-');
  }

  function inputToDate(inputStr) {
    if (!inputStr) return '';
    return inputStr.replace(/-/g, '.');
  }

  /* ──────────────────────────────────────────────
     ID
     ────────────────────────────────────────────── */
  function createId() {
    return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
  }

  /* ──────────────────────────────────────────────
     Reading Time
     ────────────────────────────────────────────── */
  function readingTime(html) {
    var text = html.replace(/<[^>]*>/g, '');
    var cjkChars = (text.match(/[一-鿿㐀-䶿豈-﫿]/g) || []).length;
    var words = text.replace(/[一-鿿㐀-䶿豈-﫿]/g, ' ')
      .split(/\s+/).filter(Boolean).length;
    var total = cjkChars + words;
    var minutes = Math.max(1, Math.round(total / 300));
    return { minutes: minutes, wordCount: total };
  }

  /* ──────────────────────────────────────────────
     Toast Notifications
     ────────────────────────────────────────────── */
  function showToast(msg, type) {
    type = type || 'success';
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    toast.textContent = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('toast--visible');
    });

    setTimeout(function () {
      toast.classList.remove('toast--visible');
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }

  /* ──────────────────────────────────────────────
     i18n
     ────────────────────────────────────────────── */
  var LANG_KEY = 'breeze_lang';
  localStorage.setItem(LANG_KEY, 'zh-CN');
  var currentLang = 'zh-CN';

  var strings = {
    'zh-CN': {
      navHome: '首页',
      navBlog: '文章',
      navArchive: '归档',
      navAbout: '关于',
      navAdmin: '管理',
      footerCopyright: '© 2026 Breeze. All rights reserved.',
      backToBlog: '返回文章列表',
      editPost: '编辑',
      deletePost: '删除',
      confirmDelete: '确认删除',
      cancel: '取消',
      save: '保存',
      login: '登录',
      logout: '退出登录',
      search: '搜索文章...',
      noPosts: '还没有文章',
      noMatch: '没有匹配的文章',
      siteLaunch: '天前上线',
      posts: '篇文章',
      newPost: '新建文章',
      editPostTitle: '编辑文章',
      postTitle: '标题',
      postCategory: '分类',
      postDate: '日期',
      postExcerpt: '摘要',
      postContent: '内容',
      postTags: '标签',
      postPublished: '发布',
      draft: '草稿',
      allCategories: '全部',
      toc: '目录',
      relatedPosts: '相关文章',
      tags: '标签',
      readingTime: '分钟阅读',
      words: '字',
      skipToMain: '跳到主要内容',
      featuredPost: '精选文章',
      recentPosts: '最新文章',
      viewAll: '查看全部文章',
      deleteConfirmMsg: '确定要删除这篇文章吗？此操作不可撤销。',
      unsavedWarning: '你有未保存的更改！',
      loginTitle: '管理员登录',
      loginPassword: '密码',
      loginError: '密码错误',
      dashboard: '仪表盘',
      totalPosts: '文章总数',
      publishedCount: '已发布',
      draftCount: '草稿',
      categoryCount: '分类数',
      saveSuccess: '保存成功',
      deleteSuccess: '删除成功',
      createSuccess: '创建成功',
    },
    'en': {
      navHome: 'Home',
      navBlog: 'Blog',
      navArchive: 'Archive',
      navAbout: 'About',
      navAdmin: 'Admin',
      footerCopyright: '© 2026 Breeze. All rights reserved.',
      backToBlog: 'Back to articles',
      editPost: 'Edit',
      deletePost: 'Delete',
      confirmDelete: 'Confirm Delete',
      cancel: 'Cancel',
      save: 'Save',
      login: 'Log in',
      logout: 'Log out',
      search: 'Search articles...',
      noPosts: 'No posts yet',
      noMatch: 'No matching posts',
      siteLaunch: 'days since launch',
      posts: 'posts',
      newPost: 'New Post',
      editPostTitle: 'Edit Post',
      postTitle: 'Title',
      postCategory: 'Category',
      postDate: 'Date',
      postExcerpt: 'Excerpt',
      postContent: 'Content',
      postTags: 'Tags',
      postPublished: 'Published',
      draft: 'Draft',
      allCategories: 'All',
      toc: 'Table of Contents',
      relatedPosts: 'Related Posts',
      tags: 'Tags',
      readingTime: 'min read',
      words: 'words',
      skipToMain: 'Skip to main content',
      featuredPost: 'Featured',
      recentPosts: 'Latest',
      viewAll: 'View all articles',
      deleteConfirmMsg: 'Are you sure you want to delete this post? This action cannot be undone.',
      unsavedWarning: 'You have unsaved changes!',
      loginTitle: 'Admin Login',
      loginPassword: 'Password',
      loginError: 'Incorrect password',
      dashboard: 'Dashboard',
      totalPosts: 'Total Posts',
      publishedCount: 'Published',
      draftCount: 'Drafts',
      categoryCount: 'Categories',
      saveSuccess: 'Saved successfully',
      deleteSuccess: 'Deleted successfully',
      createSuccess: 'Created successfully',
    }
  };

  function t(key) {
    return (strings[currentLang] && strings[currentLang][key]) || key;
  }

  /* ──────────────────────────────────────────────
     Event helper
     ────────────────────────────────────────────── */
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* ──────────────────────────────────────────────
     Public API
     ────────────────────────────────────────────── */
  return {
    esc: esc,
    escAttr: escAttr,
    generateSlug: generateSlug,
    formatDate: formatDate,
    todayStr: todayStr,
    dateToInput: dateToInput,
    inputToDate: inputToDate,
    createId: createId,
    readingTime: readingTime,
    showToast: showToast,
    t: t,
    onReady: onReady,
  };
})();
