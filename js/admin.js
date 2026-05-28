/**
 * Breeze Blog — Admin Panel
 * Login, dashboard, editor (create/edit), delete modal.
 */
var BlogAdmin = (function () {
  'use strict';

  var ADMIN_PASSWORD = 'breeze2026';
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
      showLogin();
    });

    container.querySelectorAll('[data-edit]').forEach(function (el) {
      el.addEventListener('click', function () { showEditor(el.getAttribute('data-edit')); });
    });

    container.querySelectorAll('[data-delete]').forEach(function (el) {
      el.addEventListener('click', function () { showDeleteModal(el.getAttribute('data-delete')); });
    });
  }

  /* ──────────────────────────────────────────────
     Editor View
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

    var html = '<div class="admin-editor">'
      + '<div class="admin-editor-header">'
      + '<h1>' + (editingId ? BlogUtils.t('editPostTitle') : BlogUtils.t('newPost')) + '</h1>'
      + '<button type="button" class="admin-btn" id="editorBack">← ' + BlogUtils.t('dashboard') + '</button>'
      + '</div>'
      + '<div class="editor-form">';

    // Title
    html += '<div class="field"><label for="editTitle">' + BlogUtils.t('postTitle') + '</label><input type="text" id="editTitle" value="' + BlogUtils.escAttr(title) + '"></div>';

    // Row: slug, date, published toggle
    html += '<div class="field-row-3">'
      + '<div class="field"><label for="editSlug">Slug</label><div class="slug-wrap"><input type="text" id="editSlug" value="' + BlogUtils.escAttr(slug) + '"><button type="button" class="slug-btn" id="slugRefresh" title="从标题生成">↻</button></div></div>'
      + '<div class="field"><label for="editDate">' + BlogUtils.t('postDate') + '</label><input type="date" id="editDate" value="' + BlogUtils.escAttr(date) + '"></div>'
      + '<div class="field field-check" style="padding-top:22px">'
      + '<input type="checkbox" id="editPublished"' + (published ? ' checked' : '') + '>'
      + '<label for="editPublished">' + BlogUtils.t('postPublished') + '</label>'
      + '</div>'
      + '</div>';

    // Category as chips
    html += '<div class="field"><label>' + BlogUtils.t('postCategory') + '</label><div class="cat-chips" id="catChips">';
    cats.forEach(function (c) {
      var active = c === category ? ' active' : '';
      html += '<button type="button" class="cat-chip' + active + '" data-cat="' + BlogUtils.escAttr(c) + '">' + BlogUtils.esc(c) + '</button>';
    });
    html += '<button type="button" class="cat-chip cat-chip-add" id="catChipAdd">+</button></div>';
    html += '<div class="cat-new" id="catNewWrap" style="display:none"><input type="text" id="editNewCategory" placeholder="新分类名称" value="' + (cats.indexOf(category) === -1 && category ? BlogUtils.escAttr(category) : '') + '"></div></div>';

    // Excerpt
    html += '<div class="field"><label for="editExcerpt">' + BlogUtils.t('postExcerpt') + '</label><textarea id="editExcerpt" rows="3">' + BlogUtils.esc(excerpt) + '</textarea></div>';

    // Tags
    html += '<div class="field"><label for="editTags">' + BlogUtils.t('postTags') + ' (comma separated)</label><input type="text" id="editTags" value="' + BlogUtils.escAttr(tags) + '"></div>';

    // Content toolbar
    html += '<div class="field"><label>' + BlogUtils.t('postContent') + '</label>'
      + '<div class="editor-toolbar" id="editorToolbar">'
      + '<button type="button" data-cmd="h2" title="二级标题">H2</button>'
      + '<button type="button" data-cmd="h3" title="三级标题">H3</button>'
      + '<div class="sep"></div>'
      + '<button type="button" data-cmd="bold" title="粗体"><b>B</b></button>'
      + '<button type="button" data-cmd="italic" title="斜体"><i>I</i></button>'
      + '<button type="button" data-cmd="blockquote" title="引用">"</button>'
      + '<div class="sep"></div>'
      + '<button type="button" data-cmd="code" title="行内代码">&lt;/&gt;</button>'
      + '<button type="button" data-cmd="pre" title="代码块">#</button>'
      + '<div class="sep"></div>'
      + '<button type="button" data-cmd="ul" title="无序列表">•</button>'
      + '<button type="button" data-cmd="ol" title="有序列表">1.</button>'
      + '<div class="sep"></div>'
      + '<button type="button" data-cmd="link" title="插入链接">🔗</button>'
      + '<button type="button" data-cmd="img" title="插入图片">🖼</button>'
      + '<div class="sep"></div>'
      + '<button type="button" data-cmd="preview" title="预览">👁</button>'
      + '</div>';

    html += '<div class="editor-content"><textarea id="editContent" rows="15">' + BlogUtils.esc(content) + '</textarea></div></div>';

    // Actions
    html += '<div class="editor-actions">'
      + '<button type="button" class="admin-btn" id="editorCancel">' + BlogUtils.t('cancel') + '</button>'
      + '<button type="button" class="admin-btn admin-btn-primary" id="editorSave">' + BlogUtils.t('save') + '</button>'
      + '</div>';

    html += '</div></div>';
    container.innerHTML = html;

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
    var catNewWrap = document.getElementById('catNewWrap');
    var selectedCat = category;

    if (catChips) {
      catChips.addEventListener('click', function (e) {
        var chip = e.target.closest('.cat-chip');
        if (!chip) return;

        if (chip.classList.contains('cat-chip-add')) {
          catNewWrap.style.display = catNewWrap.style.display === 'none' ? '' : 'none';
          if (catNewWrap.style.display !== 'none') {
            document.getElementById('editNewCategory').focus();
          }
          return;
        }

        catChips.querySelectorAll('.cat-chip').forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        selectedCat = chip.getAttribute('data-cat');
        catNewWrap.style.display = 'none';
      });
    }

    // Slug auto-generate from title
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
        // Compress image before inserting
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
            var previewDiv = document.createElement('div');
            previewDiv.className = 'article-content';
            previewDiv.id = 'editorPreview';
            previewDiv.innerHTML = textarea.value;
            textarea.parentNode.appendChild(previewDiv);
          } else {
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

	    // Keyboard shortcuts: Ctrl+B (bold), Ctrl+I (italic), Ctrl+K (link), Ctrl+Shift+H (h2)
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

	    // Auto-replace Markdown on input (#, ##, >, *, -, 1.)
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

    // Back / Cancel
    document.getElementById('editorBack').addEventListener('click', function () {
      if (formDirty && !confirm(BlogUtils.t('unsavedWarning') + BlogUtils.t('cancel'))) return;
      showDashboard();
    });
    document.getElementById('editorCancel').addEventListener('click', function () {
      if (formDirty && !confirm(BlogUtils.t('unsavedWarning') + BlogUtils.t('cancel'))) return;
      showDashboard();
    });

    // Save
    document.getElementById('editorSave').addEventListener('click', function () {
      var catVal = selectedCat || '';
      if (catNewWrap && catNewWrap.style.display !== 'none' && catNewWrap.style.display !== '') {
        var newCat = document.getElementById('editNewCategory');
        catVal = newCat ? newCat.value.trim() : '';
      }

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
      showLogin();
    }
  }

  BlogUtils.onReady(init);
})();
