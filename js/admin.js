/**
 * Breeze Blog — Admin Panel
 * Login, dashboard, editor (create/edit), delete modal.
 */
var BlogAdmin = (function () {
  'use strict';

  var ADMIN_PASSWORD = localStorage.getItem('breeze_admin_pwd') || 'breeze2026';
  var container = document.getElementById('adminApp');
  if (!container) return {};

  var editingId = null;

  /* ──────────────────────────────────────────────
     Login View
     ────────────────────────────────────────────── */
  function showLogin() {
    var html = '<div class="admin-login">'
      + '<div class="admin-login-icon"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg></div>'
      + '<h1>' + BlogUtils.t('loginTitle') + '</h1>'
      + '<input type="password" id="adminPassword" placeholder="' + BlogUtils.t('loginPassword') + '">'
      + '<div class="admin-login-error" id="adminLoginError"></div>'
      + '<button type="button" id="adminLoginBtn">' + BlogUtils.t('login') + '</button>'
      + '</div>';

    container.innerHTML = html;

    var pwd = document.getElementById('adminPassword');
    var btn = document.getElementById('adminLoginBtn');
    var err = document.getElementById('adminLoginError');

    function attemptLogin() {
      if (pwd.value === ADMIN_PASSWORD) {
        localStorage.setItem('breeze_admin', 'true');
        document.body.classList.add('admin-mode');
        showDashboard();
      } else {
        err.textContent = BlogUtils.t('loginError');
      }
    }

    btn.addEventListener('click', attemptLogin);
    pwd.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') attemptLogin();
    });
    pwd.focus();
  }

  /* ──────────────────────────────────────────────
     Dashboard View
     ────────────────────────────────────────────── */
  function showDashboard() {
    var posts = BlogStore.getPosts();
    var published = posts.filter(function (p) { return p.published; });
    var drafts = posts.filter(function (p) { return !p.published; });
    var cats = BlogStore.getCategories();

    var html = '<div class="admin-header">'
      + '<h1>' + BlogUtils.t('dashboard') + '</h1>'
      + '<div class="admin-header-actions">'
      + '<a href="index.html" class="admin-btn">' + BlogUtils.t('navHome') + '</a>'
      + '<button type="button" class="admin-btn admin-btn-primary" id="adminNewBtn">+ ' + BlogUtils.t('newPost') + '</button>'
      + '<button type="button" class="admin-btn" id="adminSettingsBtn">⚙ ' + BlogUtils.t('settings') + '</button>'
      + '<button type="button" class="admin-btn" id="adminLogoutBtn">' + BlogUtils.t('logout') + '</button>'
      + '</div>'
      + '</div>';

    // Stats
    html += '<div class="admin-stats">'
      + '<div class="admin-stat-card"><div class="icon"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg></div><div><div class="value">' + posts.length + '</div><div class="label">' + BlogUtils.t('totalPosts') + '</div></div></div>'
      + '<div class="admin-stat-card"><div class="icon"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div><div><div class="value">' + published.length + '</div><div class="label">' + BlogUtils.t('publishedCount') + '</div></div></div>'
      + '<div class="admin-stat-card"><div class="icon"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div><div><div class="value">' + drafts.length + '</div><div class="label">' + BlogUtils.t('draftCount') + '</div></div></div>'
      + '<div class="admin-stat-card"><div class="icon"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg></div><div><div class="value">' + cats.length + '</div><div class="label">' + BlogUtils.t('categoryCount') + '</div></div></div>'
      + '</div>';

    // Table
    html += '<div class="admin-table-wrap"><table class="admin-table">'
      + '<thead><tr><th>' + BlogUtils.t('postTitle') + '</th><th>' + BlogUtils.t('postCategory') + '</th><th>' + BlogUtils.t('postDate') + '</th><th>' + BlogUtils.t('postPublished') + '</th><th>Actions</th></tr></thead>'
      + '<tbody>';

    posts.sort(function (a, b) { return b.createdAt - a.createdAt; });
    posts.forEach(function (p) {
      html += '<tr>'
        + '<td><a href="post.html?slug=' + encodeURIComponent(p.slug) + '" style="font-weight:500;color:var(--color-text)">' + BlogUtils.esc(p.title) + '</a></td>'
        + '<td>' + BlogUtils.esc(p.category || '-') + '</td>'
        + '<td>' + BlogUtils.esc(p.date) + '</td>'
        + '<td><span class="status-dot status-dot--' + (p.published ? 'published' : 'draft') + '"></span>' + (p.published ? BlogUtils.t('postPublished') : BlogUtils.t('draft')) + '</td>'
        + '<td style="white-space:nowrap">'
        + '<button type="button" class="admin-btn-danger" data-edit="' + p.id + '">' + BlogUtils.t('editPost') + '</button>'
        + '<button type="button" class="admin-btn-danger" data-delete="' + p.id + '" style="margin-left:8px">' + BlogUtils.t('deletePost') + '</button>'
        + '</td></tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;

    // Events
    document.getElementById('adminNewBtn').addEventListener('click', function () { showEditor(); });
    document.getElementById('adminLogoutBtn').addEventListener('click', function () {
      localStorage.removeItem('breeze_admin');
      document.body.classList.remove('admin-mode');
      window.location.href = 'index.html';
    });

    document.getElementById('adminSettingsBtn').addEventListener('click', showSettings);

    container.querySelectorAll('[data-edit]').forEach(function (el) {
      el.addEventListener('click', function () { showEditor(el.getAttribute('data-edit')); });
    });

    container.querySelectorAll('[data-delete]').forEach(function (el) {
      el.addEventListener('click', function () { showDeleteModal(el.getAttribute('data-delete')); });
    });
  }

  /* ──────────────────────────────────────────────
     Settings View
     ────────────────────────────────────────────── */
  function showSettings() {
    var html = '<div class="admin-editor">'
      + '<div class="admin-editor-header">'
      + '<h1>' + BlogUtils.t('settings') + '</h1>'
      + '<button type="button" class="admin-btn" id="settingsBack">← ' + BlogUtils.t('dashboard') + '</button>'
      + '</div>'
      + '<div class="editor-form">'
      + '<div class="field"><label for="settingsPassword">' + BlogUtils.t('adminPassword') + '</label>'
      + '<input type="text" id="settingsPassword" value="' + BlogUtils.escAttr(ADMIN_PASSWORD) + '"></div>'
      + '<p style="font-size:13px;color:var(--color-text-muted);margin-bottom:16px">' + BlogUtils.t('passwordHint') + '</p>'
      + '<div class="editor-actions">'
      + '<button type="button" class="admin-btn admin-btn-primary" id="settingsSave">' + BlogUtils.t('save') + '</button>'
      + '</div></div></div>';

    container.innerHTML = html;

    document.getElementById('settingsBack').addEventListener('click', showDashboard);

    document.getElementById('settingsSave').addEventListener('click', function () {
      var newPwd = document.getElementById('settingsPassword').value.trim();
      if (!newPwd) {
        BlogUtils.showToast('密码不能为空', 'error');
        return;
      }
      localStorage.setItem('breeze_admin_pwd', newPwd);
      ADMIN_PASSWORD = newPwd;
      BlogUtils.showToast('密码已更新');
    });
  }

  /* ──────────────────────────────────────────────
     Editor View — completely redesigned
     ────────────────────────────────────────────── */
  function showEditor(postId) {
    editingId = postId || null;
    var post = editingId ? BlogStore.getPost(editingId) : null;

    var title = post ? post.title : '';
    var slug = post ? post.slug : '';
    var date = post ? BlogUtils.dateToInput(post.date) : BlogUtils.dateToInput(BlogUtils.todayStr());
    var category = post ? post.category : '';
    var excerpt = post ? post.excerpt : '';
    var content = post ? post.content : '';
    var tags = post ? (post.tags || []).join(', ') : '';
    var published = post ? post.published : true;
    var cats = BlogStore.getCategories();

    var html = '<div class="write-wrap">'

      // Top bar
      + '<div class="write-bar">'
      + '<button type="button" class="write-bar-btn" id="editorBack">← ' + BlogUtils.t('dashboard') + '</button>'
      + '<span class="write-bar-title">' + (editingId ? BlogUtils.t('editPostTitle') : BlogUtils.t('newPost')) + '</span>'
      + '<div class="write-bar-actions">'
      + '<button type="button" class="write-btn write-btn-primary" id="editorSave">' + BlogUtils.t('save') + '</button>'
      + '</div>'
      + '</div>'

      // Title
      + '<div class="write-title-wrap">'
      + '<input type="text" id="editTitle" class="write-title-input" placeholder="输入文章标题..." value="' + BlogUtils.escAttr(title) + '">'
      + '</div>'

      // Toolbar
      + '<div class="write-toolbar" id="editorToolbar">'
      + '<button type="button" data-cmd="h2" title="二级标题"><span style="font-weight:700;font-size:13px">H2</span></button>'
      + '<button type="button" data-cmd="h3" title="三级标题"><span style="font-weight:600;font-size:12px">H3</span></button>'
      + '<span class="write-toolbar-sep"></span>'
      + '<button type="button" data-cmd="bold" title="粗体"><b>B</b></button>'
      + '<button type="button" data-cmd="italic" title="斜体"><i>I</i></button>'
      + '<span class="write-toolbar-sep"></span>'
      + '<button type="button" data-cmd="blockquote" title="引用">❝</button>'
      + '<button type="button" data-cmd="link" title="链接">🔗</button>'
      + '<span class="write-toolbar-sep"></span>'
      + '<button type="button" data-cmd="code" title="行内代码">&lt;/&gt;</button>'
      + '<button type="button" data-cmd="pre" title="代码块">◧</button>'
      + '<span class="write-toolbar-sep"></span>'
      + '<button type="button" data-cmd="ul" title="无序列表">•</button>'
      + '<button type="button" data-cmd="ol" title="有序列表">1.</button>'
      + '<span class="write-toolbar-sep"></span>'
      + '<button type="button" data-cmd="img" title="插入图片">🖼</button>'
      + '<button type="button" data-cmd="preview" title="预览">👁</button>'
      + '</div>'

      // Content
      + '<div class="write-content-wrap">'
      + '<textarea id="editContent" class="write-content-input" placeholder="开始写作..." rows="18">' + BlogUtils.esc(content) + '</textarea>'
      + '</div>'

      // Meta toggle
      + '<div class="write-meta-toggle" id="metaToggle">'
      + '<span>▼ ' + BlogUtils.t('postCategory') + ' · ' + BlogUtils.t('postDate') + ' · ' + BlogUtils.t('postTags') + '</span>'
      + '</div>'

      // Meta panel (collapsible)
      + '<div class="write-meta" id="writeMeta" style="display:none">'
      + '<div class="write-meta-grid">'

      // Left column
      + '<div class="write-meta-col">'
      + '<div class="write-meta-field"><label>' + BlogUtils.t('postCategory') + '</label><div class="cat-chips" id="catChips">';
    cats.forEach(function (c) {
      var active = c === category ? ' active' : '';
      html += '<button type="button" class="cat-chip' + active + '" data-cat="' + BlogUtils.escAttr(c) + '">' + BlogUtils.esc(c) + '</button>';
    });
    html += '<span class="cat-add-wrap" id="catAddWrap">'
      + '<button type="button" class="cat-chip-add" id="catChipAdd">+ 新建</button>'
      + '<span class="cat-add-input" id="catAddInput" style="display:none">'
      + '<input type="text" id="editNewCategory" placeholder="新分类名称" value="' + (cats.indexOf(category) === -1 && category ? BlogUtils.escAttr(category) : '') + '">'
      + '<button type="button" id="catConfirmBtn">✓</button>'
      + '</span>'
      + '</span></div>'
      + '</div>'

      + '<div class="write-meta-field"><label>' + BlogUtils.t('postTags') + '</label><input type="text" id="editTags" class="write-meta-input" placeholder="标签1, 标签2, ..." value="' + BlogUtils.escAttr(tags) + '"></div>'

      + '<div class="write-meta-field"><label for="editExcerpt">' + BlogUtils.t('postExcerpt') + '</label><textarea id="editExcerpt" class="write-meta-input write-meta-textarea" rows="2" placeholder="简短的文章摘要...">' + BlogUtils.esc(excerpt) + '</textarea></div>'
      + '</div>'

      // Right column
      + '<div class="write-meta-col">'
      + '<div class="write-meta-field"><label for="editSlug">Slug</label><div class="write-slug"><input type="text" id="editSlug" class="write-meta-input" placeholder="文章链接标识，如 my-post-title" value="' + BlogUtils.escAttr(slug) + '"><button type="button" class="write-slug-btn" id="slugRefresh" title="从标题生成">↻</button></div></div>'
      + '<div class="write-meta-field"><label for="editDate">' + BlogUtils.t('postDate') + '</label><input type="date" id="editDate" class="write-meta-input" value="' + BlogUtils.escAttr(date) + '"></div>'
      + '<div class="write-meta-field">'
      + '<label class="write-toggle-label"><input type="checkbox" id="editPublished"' + (published ? ' checked' : '') + '><span class="write-toggle-track"></span>' + BlogUtils.t('postPublished') + '</label>'
      + '</div>'
      + '</div>'

      + '</div></div>'  // close meta-grid, meta

      + '</div>';  // close write-wrap

    container.innerHTML = html;

    // ── Events ──

    // Meta toggle
    var metaToggle = document.getElementById('metaToggle');
    var writeMeta = document.getElementById('writeMeta');
    if (metaToggle && writeMeta) {
      metaToggle.addEventListener('click', function () {
        var isOpen = writeMeta.style.display !== 'none';
        writeMeta.style.display = isOpen ? 'none' : 'block';
        metaToggle.innerHTML = isOpen
          ? '<span>▶ ' + BlogUtils.t('postCategory') + ' · ' + BlogUtils.t('postDate') + ' · ' + BlogUtils.t('postTags') + '</span>'
          : '<span>▼ ' + BlogUtils.t('postCategory') + ' · ' + BlogUtils.t('postDate') + ' · ' + BlogUtils.t('postTags') + '</span>';
      });
    }

    // Form dirty tracking
    var formDirty = false;
    var formInputs = container.querySelectorAll('input, textarea, select');
    function markDirty() { formDirty = true; }
    formInputs.forEach(function (el) { el.addEventListener('input', markDirty); });
    window.addEventListener('beforeunload', function (e) {
      if (formDirty) { e.preventDefault(); e.returnValue = BlogUtils.t('unsavedWarning'); }
    });

    // Category chips
    var catChips = document.getElementById('catChips');
    var catAddWrap = document.getElementById('catAddWrap');
    var catAddBtn = document.getElementById('catChipAdd');
    var catAddInput = document.getElementById('catAddInput');
    var catInput = document.getElementById('editNewCategory');
    var catConfirmBtn = document.getElementById('catConfirmBtn');
    var selectedCat = category;

    // Show the input if there's a custom category not in the list
    if (category && cats.indexOf(category) === -1) {
      catAddBtn.style.display = 'none';
      catAddInput.style.display = '';
      catInput.value = category;
      catInput.focus();
    }

    function addCategoryChip(name) {
      name = name.trim();
      if (!name) return;
      var existing = catChips.querySelector('.cat-chip[data-cat="' + BlogUtils.escAttr(name) + '"]');
      if (existing) {
        catChips.querySelectorAll('.cat-chip').forEach(function (c) { c.classList.remove('active'); });
        existing.classList.add('active');
        selectedCat = name;
        catInput.value = '';
        catAddBtn.style.display = '';
        catAddInput.style.display = 'none';
        return;
      }
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'cat-chip active';
      chip.setAttribute('data-cat', name);
      chip.textContent = name;
      catChips.insertBefore(chip, catAddWrap);
      catChips.querySelectorAll('.cat-chip.active').forEach(function (c) {
        if (c !== chip) c.classList.remove('active');
      });
      selectedCat = name;
      catInput.value = '';
      catAddBtn.style.display = '';
      catAddInput.style.display = 'none';
    }

    if (catChips) {
      catChips.addEventListener('click', function (e) {
        var chip = e.target.closest('.cat-chip');
        if (!chip) return;
        catChips.querySelectorAll('.cat-chip').forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        selectedCat = chip.getAttribute('data-cat');
        catAddBtn.style.display = '';
        catAddInput.style.display = 'none';
      });

      catAddBtn.addEventListener('click', function () {
        catAddBtn.style.display = 'none';
        catAddInput.style.display = '';
        catInput.focus();
      });

      catConfirmBtn.addEventListener('click', function () {
        addCategoryChip(catInput.value);
      });

      catInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          addCategoryChip(catInput.value);
        }
        if (e.key === 'Escape') {
          catAddBtn.style.display = '';
          catAddInput.style.display = 'none';
          catInput.value = '';
        }
      });
    }

    // Slug auto-generate
    var slugBtn = document.getElementById('slugRefresh');
    var titleInput = document.getElementById('editTitle');
    var slugInput = document.getElementById('editSlug');
    if (slugBtn && titleInput && slugInput) {
      slugBtn.addEventListener('click', function () {
        slugInput.value = BlogUtils.generateSlug(titleInput.value);
        markDirty();
      });
    }

    // Hidden file input for image insertion
    var imgInput = document.getElementById('editorImageInput');
    if (!imgInput) {
      imgInput = document.createElement('input');
      imgInput.type = 'file';
      imgInput.accept = 'image/*';
      imgInput.id = 'editorImageInput';
      imgInput.style.display = 'none';
      document.body.appendChild(imgInput);
      imgInput.addEventListener('change', function () {
        var file = imgInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
          var img = new Image();
          img.onload = function () {
            var maxW = 800;
            var w = img.width, h = img.height;
            if (w > maxW) { h = h * maxW / w; w = maxW; }
            var c = document.createElement('canvas');
            c.width = w; c.height = h;
            var ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            var compressed = c.toDataURL('image/jpeg', 0.7);
            insertTag('img', '<img src="' + compressed + '" alt="">');
            imgInput.value = '';
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    // Toolbar
    var textarea = document.getElementById('editContent');
    var toolbar = document.getElementById('editorToolbar');
    if (toolbar && textarea) {
      toolbar.addEventListener('click', function (e) {
        var btn = e.target.closest('button');
        if (!btn) return;
        var cmd = btn.getAttribute('data-cmd');

        if (cmd === 'preview') {
          var previewing = btn.classList.toggle('active');
          if (previewing) {
            textarea.style.display = 'none';
            btn.textContent = '✎';
            var previewDiv = document.createElement('div');
            previewDiv.className = 'write-preview';
            previewDiv.id = 'editorPreview';
            previewDiv.innerHTML = textarea.value;
            textarea.parentNode.appendChild(previewDiv);
          } else {
            btn.textContent = '👁';
            textarea.style.display = '';
            var preview = document.getElementById('editorPreview');
            if (preview) preview.remove();
          }
          return;
        }

        if (cmd === 'link') {
          var url = prompt('Enter link URL:', 'https://');
          if (url) insertTag(cmd, url); return;
        }
        if (cmd === 'img') {
          var fi = document.getElementById('editorImageInput');
          if (fi) fi.click(); return;
        }
        insertTag(cmd);
      });

      // Keyboard shortcuts
      textarea.addEventListener('keydown', function (e) {
        var isCtrl = e.ctrlKey || e.metaKey;
        if (!isCtrl) return;
        var cmd = null;
        if (e.key === 'b') cmd = 'bold';
        else if (e.key === 'i') cmd = 'italic';
        else if (e.key === 'k') cmd = 'link';
        else if (e.key === 'H' || e.key === 'h') {
          if (e.shiftKey) cmd = 'h2';
        }
        if (cmd) {
          e.preventDefault();
          if (cmd === 'link') {
            var url = prompt('Enter link URL:', 'https://');
            if (url) insertTag(cmd, url);
          } else {
            insertTag(cmd);
          }
        }
      });

      // Auto-replace Markdown on input
      var mdTimer = null;
      textarea.addEventListener('input', function () {
        clearTimeout(mdTimer);
        mdTimer = setTimeout(function () {
          var val = textarea.value;
          var pos = textarea.selectionStart;
          var lineStart = val.lastIndexOf('\n', pos - 1) + 1;
          var line = val.substring(lineStart, pos);

          var patterns = { '# ': 'h2', '## ': 'h3', '> ': 'blockquote', '* ': 'ul', '- ': 'ul', '1. ': 'ol' };
          var tagMap = {
            h2: '<h2></h2>', h3: '<h3></h3>', blockquote: '<blockquote></blockquote>',
            ul: '\n<ul>\n  <li></li>\n</ul>\n', ol: '\n<ol>\n  <li></li>\n</ol>\n'
          };

          for (var prefix in patterns) {
            if (line === prefix) {
              var tag = tagMap[patterns[prefix]];
              var before = val.substring(0, lineStart);
              var after = val.substring(pos);
              textarea.value = before + tag + after;
              var cursor = before.length + tag.length;
              textarea.setSelectionRange(cursor, cursor);
              break;
            }
          }
        }, 50);
      });
    }

    function insertTag(cmd, extra) {
      var ta = document.getElementById('editContent');
      if (!ta) return;
      var start = ta.selectionStart;
      var end = ta.selectionEnd;
      var sel = ta.value.substring(start, end);
      var before = ta.value.substring(0, start);
      var after = ta.value.substring(end);
      var insertion = '';

      var tags = {
        h2: '<h2>' + (sel || 'Heading') + '</h2>',
        h3: '<h3>' + (sel || 'Heading') + '</h3>',
        bold: '<strong>' + (sel || 'Bold') + '</strong>',
        italic: '<em>' + (sel || 'Italic') + '</em>',
        blockquote: '<blockquote>' + (sel || 'Quote') + '</blockquote>',
        code: '<code>' + (sel || 'code') + '</code>',
        pre: '<pre><code>' + (sel || 'code') + '</code></pre>',
        ul: '\n<ul>\n  <li>' + (sel || 'Item') + '</li>\n</ul>\n',
        ol: '\n<ol>\n  <li>' + (sel || 'Item') + '</li>\n</ol>\n',
        link: '<a href="' + (extra || '') + '">' + (sel || 'Link') + '</a>',
        img: extra || '<img src="" alt="">'
      };

      insertion = tags[cmd] || '';
      ta.value = before + insertion + after;
      markDirty();
      ta.focus();
      var pos = before.length + insertion.length;
      ta.setSelectionRange(pos, pos);
    }

    // Back
    document.getElementById('editorBack').addEventListener('click', function () {
      if (formDirty && !confirm(BlogUtils.t('unsavedWarning') + BlogUtils.t('cancel'))) return;
      showDashboard();
    });

    // Save
    document.getElementById('editorSave').addEventListener('click', function () {
      var catVal = selectedCat || '';

      var tagStr = document.getElementById('editTags').value.trim();
      var tagArr = tagStr ? tagStr.split(',').map(function (s) { return s.trim(); }).filter(Boolean) : [];

      var data = {
        title: document.getElementById('editTitle').value.trim(),
        slug: document.getElementById('editSlug').value.trim() || BlogUtils.generateSlug(document.getElementById('editTitle').value.trim()),
        date: BlogUtils.inputToDate(document.getElementById('editDate').value),
        category: catVal,
        excerpt: document.getElementById('editExcerpt').value.trim(),
        content: document.getElementById('editContent').value,
        tags: tagArr,
        published: document.getElementById('editPublished').checked
      };

      try {
        if (editingId) {
          BlogStore.updatePost(editingId, data);
          BlogUtils.showToast(BlogUtils.t('saveSuccess'));
        } else {
          BlogStore.createPost(data);
          BlogUtils.showToast(BlogUtils.t('createSuccess'));
        }
        formDirty = false;
        showDashboard();
      } catch (e) {
        BlogUtils.showToast('Save failed: ' + e.message, 'error');
      }
    });
  }

  /* ──────────────────────────────────────────────
     Delete Modal
     ────────────────────────────────────────────── */
  var deleteTargetId = null;

  function showDeleteModal(postId) {
    deleteTargetId = postId;
    var modal = document.getElementById('deleteModal');
    if (!modal) return;
    modal.classList.add('open');
  }

  function hideDeleteModal() {
    var modal = document.getElementById('deleteModal');
    if (!modal) return;
    modal.classList.remove('open');
    deleteTargetId = null;
  }

  // Global modal events (set up once)
  function initModalEvents() {
    var cancel = document.getElementById('deleteCancel');
    var confirm = document.getElementById('deleteConfirm');
    var modal = document.getElementById('deleteModal');
    if (!modal) return;

    if (cancel) cancel.addEventListener('click', hideDeleteModal);
    if (confirm) {
      confirm.addEventListener('click', function () {
        if (deleteTargetId) {
          BlogStore.deletePost(deleteTargetId);
          BlogUtils.showToast(BlogUtils.t('deleteSuccess'));
          hideDeleteModal();
          showDashboard();
        }
      });
    }
    modal.addEventListener('click', function (e) {
      if (e.target === modal) hideDeleteModal();
    });
  }

  /* ──────────────────────────────────────────────
     Init
     ────────────────────────────────────────────── */
  function init() {
    initModalEvents();
    if (localStorage.getItem('breeze_admin') === 'true') {
      showDashboard();
    } else {
      window.location.href = 'index.html';
    }
  }

  BlogUtils.onReady(init);
})();
