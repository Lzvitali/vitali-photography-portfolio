# Vitali Layzerman -- Photography Portfolio

A local-first photography portfolio built with **Next.js**. Manage images through a localhost admin panel, deploy as a static site to GitHub Pages.

**Live site:** [lzvitali.github.io/vitali-photography-portfolio](https://lzvitali.github.io/vitali-photography-portfolio/)

---

## Features

- **Category-based galleries** -- organise photos into Events, Views & Nature, Animals, Couples, Street Photography, or any custom categories
- **Masonry grid layout** -- responsive columns that adapt to portrait and landscape images
- **Lightbox viewer** -- full-screen image browsing with keyboard navigation
- **Dark / Light mode** -- system-aware toggle with smooth transitions
- **Image protection** -- transparent overlay prevents casual right-click saving
- **Cloudinary CDN** -- automatic `f_auto,q_auto:best` optimization for fast loading
- **Focal point control** -- set a focal point per image so thumbnails crop around the subject
- **Configurable card layouts** -- choose landscape, portrait, square, wide, or auto for each category card on the home page
- **Drag-and-drop admin** -- reorder images, upload new ones, manage categories, edit site settings -- all from localhost
- **Static export** -- deploys anywhere (GitHub Pages, Cloudflare Pages, Netlify) with zero server cost

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| Image hosting | Cloudinary |
| Drag & drop | dnd-kit |
| Icons | Lucide React |
| Theming | next-themes |
| Deployment | GitHub Actions + GitHub Pages |

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Lzvitali/vitali-photography-portfolio.git
cd vitali-photography-portfolio

# 2. Install dependencies
npm install

# 3. Create your env file
cp .env.local.example .env.local
# Fill in your Cloudinary credentials

# 4. Start the dev server
./start.sh
```

- **Public site:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin (or click the gear icon in the bottom-right)

To stop the server: `./stop.sh`

## Admin Workflow

1. Start the dev server with `./start.sh`
2. Open http://localhost:3000 -- you'll see a floating gear icon (bottom-right) on localhost
3. Click it to open the admin panel at `/admin`
4. **Edit site settings** -- change name, tagline, bio text
5. **Manage categories** -- add, rename, reorder, delete, and choose card layout (landscape/portrait/square/wide/auto)
6. **Click a category** to open its editor:
   - Drag & drop images to upload them to Cloudinary
   - Drag to reorder photos
   - Click the crosshair icon to set a focal point
   - Click the star icon to set a category cover image
   - Click the trash icon to delete an image
7. Click **"Save All"** to write changes to the local JSON files
8. Run `npm run sync` to build the static site, commit, and push to GitHub

## First-Time Setup with Your Own Images

1. Copy `.env.local.example` to `.env.local` and fill in your Cloudinary credentials
2. Run `npm install`
3. Place your cover photos in the `/images/` folder
4. Run `npm run seed` to upload initial images to Cloudinary and populate the data files
5. Start the dev server and use the admin panel to add more images

## Scripts

| Command | Description |
|---------|-------------|
| `./start.sh` | Start the dev server |
| `./stop.sh` | Stop the dev server |
| `npm run dev` | Start dev server (alternative) |
| `npm run seed` | Upload images from `/images/` to Cloudinary |
| `npm run build` | Build static export to `/out/` |
| `npm run sync` | Build + git commit + push |

## Deployment

The repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys on every push to `main`. To enable it:

1. Go to your repo's **Settings > Pages**
2. Set **Source** to **GitHub Actions**
3. Push to `main` -- the site will be live at `https://<username>.github.io/vitali-photography-portfolio/`

## Project Structure

```
data/
  portfolio.json     # Categories + image metadata
  site.json          # Site name, tagline, about, contact info
src/
  app/
    page.tsx          # Home page (hero + category cards + about)
    [category]/       # Dynamic category gallery pages
    admin/            # Admin dashboard + category editor
    api/              # Upload, save, categories, data endpoints
  components/
    public/           # Header, Footer, CategoryCard, MasonryGrid, Lightbox, etc.
    admin/            # ImageUploader, SortableGallery, FocalPointPicker, etc.
  lib/
    types.ts          # TypeScript interfaces
    data.ts           # Read/write JSON utilities
    cloudinary.ts     # Server-side Cloudinary SDK
    image-url.ts      # Client-safe Cloudinary URL helpers
```

## License

Personal portfolio project. All photographs are copyright of the photographer.
