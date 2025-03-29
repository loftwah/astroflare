# AstroFlare: Astro + Cloudflare Pages Template

A modern web application template using Astro, Tailwind CSS, Cloudflare Pages, D1 Database, and R2 Storage.

![Astroflare](https://github.com/user-attachments/assets/a7ac3109-f151-45ac-90ea-49e947157c81)

## Features

- ⚡️ **Astro 5** - Fast, modern web framework
- 🎨 **Tailwind CSS 4** - Utility-first CSS framework
- 📊 **Cloudflare D1** - Serverless SQL database
- 📦 **Cloudflare R2** - Object storage for static assets
- 🔒 **Simple Auth** - Basic authentication for demo purposes
- 🚀 **Cloudflare Pages** - Fast global deployments

## Getting Started

### Prerequisites

- Node.js 18+
- Cloudflare account with Pages, D1, and R2 access

### Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Cloudflare bindings in `wrangler.toml`:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "your-d1-database"
   database_id = "your-d1-database-id"

   [[r2_buckets]]
   binding = "STORAGE"
   bucket_name = "your-r2-bucket"
   ```

4. Create D1 database tables:
   ```bash
   wrangler d1 execute your-d1-database --file=schema.sql
   ```

5. Upload test image to R2:
   ```bash
   npm run test-r2
   ```

6. Start development server:
   ```bash
   npm run dev
   ```

## R2 Storage Usage

This template includes R2 storage integration for serving large static assets.

### Uploading Files to R2

Use the built-in upload utility:

```bash
# Upload a file to R2
npm run upload-to-r2 path/to/local/file path/in/r2 -- --remote

# Example
npm run upload-to-r2 src/assets/images/myimage.jpg images/myimage.jpg -- --remote
```

### Referencing R2 Assets

In your Astro components or HTML, reference assets using the `/storage/` path prefix:

```astro
<img src="/storage/images/astroflare.jpg" alt="AstroFlare" />
```

### How R2 Integration Works

1. Static assets are stored in Cloudflare R2 bucket
2. An Astro API route (`src/pages/storage/[...path].ts`) handles requests to `/storage/*` paths
3. The route fetches the requested file from R2 and serves it with proper headers
4. Your Astro site references these assets using the `/storage/path/to/file` URL pattern

## D1 Database Usage

The template includes a simple CRUD application to demonstrate D1 database usage.

### Database Schema

```sql
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Accessing D1 in Astro

In Astro pages and API routes, access D1 via:

```typescript
const db = Astro.locals.runtime.env.DB;
const results = await db.prepare("SELECT * FROM items").all();
```

## Authentication

This template includes a simple authentication mechanism for demonstration purposes.

⚠️ **Security Warning**: The basic password authentication included is NOT SECURE for production applications exposed to the internet. It's suitable only for demos or internal tools protected by other means.

For production applications, consider using:
- Cloudflare Access
- JWT authentication
- Auth providers like Auth0, Clerk, etc.

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run upload-to-r2` - Upload files to R2
- `npm run test-r2` - Upload test image to R2
- `npm run r2-help` - Show R2 commands help

## Deployment

1. Set up a new Cloudflare Pages project
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Add required environment variables
5. Set up D1 and R2 bindings in Cloudflare Pages dashboard

## License

MIT
