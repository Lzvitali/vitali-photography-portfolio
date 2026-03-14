# Vitali Layzerman -- Photography Portfolio

A local-first photography portfolio built with **Next.js**. Manage images through a localhost admin panel, deploy as a static site to GitHub Pages.

**Live site:** [lzvitali.github.io/vitali-photography-portfolio](https://lzvitali.github.io/vitali-photography-portfolio/)

---

## Features

- **Category-based galleries** -- organize photos into custom categories (Events, Portraits, Couples, etc.)
- **Justified row layout** -- responsive gallery that preserves original aspect ratios, like Google Photos
- **Responsive image loading** -- 800px thumbnails in the grid, full quality only when viewing in lightbox
- **Progressive lightbox** -- instant open (cached thumbnail), then loads sharp 1920px version; preloads next/prev
- **Dark / Light mode** -- system-aware toggle
- **Image protection** -- transparent overlay prevents right-click saving
- **Cloudinary CDN** -- automatic format/quality optimization, URL-based transforms for thumbnails
- **Focal point control** -- set per-image focal point for smart cropping
- **Custom cover images** -- upload, paste a URL, or pick from gallery photos
- **Configurable card layouts** -- landscape, portrait, square, wide, or auto per category
- **Drag-and-drop admin** -- reorder images, upload, import from URL, manage categories and site settings
- **Static export** -- deploys to GitHub Pages, Cloudflare Pages, or Netlify with zero server cost

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| Image hosting | Cloudinary |
| Drag & drop | dnd-kit |
| Icons | Lucide React |
| Theming | next-themes |
| Deployment | GitHub Actions → GitHub Pages |

## Quick Start

```bash
git clone https://github.com/Lzvitali/vitali-photography-portfolio.git
cd vitali-photography-portfolio
npm install
cp .env.local.example .env.local   # fill in Cloudinary credentials
./start.sh
```

- **Public site:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin (or click the gear icon, bottom-right)

Stop the server: `./stop.sh`

## Admin Workflow

1. Start dev server with `./start.sh`
2. Click the gear icon (bottom-right) to open `/admin`
3. **Site settings** -- name, tagline, bio
4. **Categories** -- add, rename, reorder, delete, set card layout and cover image
5. **Category editor** (click a category):
   - Upload photos or import via URL
   - Drag to reorder
   - Star icon = set cover, crosshair = focal point, trash = delete
6. **Save All** to persist changes
7. `npm run sync` to build, commit, and push

## Scripts

| Command | Description |
|---------|-------------|
| `./start.sh` | Start dev server |
| `./stop.sh` | Stop dev server |
| `npm run dev` | Start dev server (alternative) |
| `npm run build` | Build static export to `/out/` |
| `npm run sync` | Build + commit + push |
| `npm run seed` | Upload images from `/images/` to Cloudinary |
| `node scripts/sync-cloudinary.mjs [categoryId]` | Import existing Cloudinary images into portfolio |

## Deployment

The repo includes a GitHub Actions workflow that builds and deploys on every push to `main`:

1. Repo **Settings → Pages → Source → GitHub Actions**
2. Push to `main`
3. Site goes live at `https://<username>.github.io/vitali-photography-portfolio/`

## Project Structure

```
data/
  portfolio.json       # Categories + image metadata
  site.json            # Site name, tagline, about, contact
src/
  app/
    page.tsx            # Home (hero + category cards + about)
    [category]/         # Gallery pages
    admin/              # Admin dashboard + category editor
    api/                # Upload, save, categories, cloudinary-browse
  components/
    public/             # Header, Footer, CategoryCard, MasonryGrid, Lightbox, etc.
    admin/              # ImageUploader, SortableGallery, FocalPointPicker, CloudinaryPicker
  lib/
    types.ts            # TypeScript interfaces
    data.ts             # JSON read/write utilities
    cloudinary.ts       # Server-side Cloudinary SDK
    image-url.ts        # URL helpers (thumbnailUrl, lightboxUrl, fullUrl)
scripts/
  seed.mjs              # Initial image upload
  sync-cloudinary.mjs   # Batch import from Cloudinary
```

## License

Personal portfolio project. All photographs are copyright of the photographer.
