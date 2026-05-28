# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Breeze Blog — a pure static personal blog. No build tools, no frameworks, no server. HTML/CSS/JS with localStorage persistence. Compatible with `file://` protocol (no HTTP server required). Full-width layout with card grid design.

## Architecture

```
grbk/
├── *.html              # Pages (index, blog, post, archive, about, admin)
├── css/style.css       # Single stylesheet (all styles in one file)
├── js/
│   ├── utils.js        # Utilities (esc, slug, date, toast, i18n)
│   ├── store.js        # BlogStore CRUD + localStorage persistence + seed data
│   ├── main.js         # Global features (nav, lightbox, back-to-top)
│   ├── home.js         # Home page (featured, latest, quote, clock, stats)
│   ├── blog.js         # Blog listing (search, category filter, card grid)
│   ├── post.js         # Post view (article render, TOC, progress, related)
│   ├── archive.js      # Archive (year/month grouping)
│   ├── about.js        # About page (visit tracking)
│   ├── admin.js        # Admin panel (login, CRUD, editor)
│ ├── images/             # Static images (required: 海边动漫少女.png)
```

## Critical Constraints

- **Must work with `file://` protocol** — no fetch() for local data
- **No build tools** — no npm, webpack, etc. Plain HTML/CSS/JS only
- **Script load order**: `utils.js → store.js → main.js → page.js`
- **images/ must be used** — the seaside anime girl image must be visibly featured

## Key Technical Decisions

- `BlogStore` (IIFE) stores posts in localStorage under `breeze_posts`, schema version in `breeze_schema`
- `BlogUtils` (IIFE) provides shared utilities consumed by all page scripts
- i18n via `data-i18n` attributes + `BlogUtils.t()` — language stored in `breeze_lang`
- Admin password: `breeze2026` (hardcoded, client-side only)
- Admin mode toggled by 5 clicks on logo

## Page Data Flow

Each page script checks for its container element ID (e.g., `#postsGrid` for blog.js). If absent, the script returns early — this allows all pages to load the same scripts without errors.
