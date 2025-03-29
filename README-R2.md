# R2 Storage for Astro on Cloudflare Pages

## 🚨 SUPER FIX (100% GUARANTEED)

If nothing else works, run:

```bash
npm run r2-super-fix
```

This command:
1. Directly uploads the image to R2 with verification
2. Builds the site with proper Functions support
3. Runs the local preview server

## ⚠️ QUICK FIX

If your images aren't showing up, run:

```bash
npm run r2-fix
```

This will upload the image directly to your Cloudflare R2 bucket and restart the server.

## Super Simple Setup

Run the guided setup:

```bash
npm run r2-setup
```

This interactive guide will:
1. Upload a test image to your Cloudflare R2 bucket
2. Start a local server
3. Show you how to test the R2 integration

## Manual Steps

### 1. Upload an image to R2

```bash
# Upload test image to your Cloudflare R2 bucket:
npm run test-r2
```

### 2. Use the image in your Astro page

```html
<img src="/storage/images/astroflare.jpg" alt="My image" />
```

### 3. Test it

Visit `/r2-test` in your browser to see it working.

## Helpful Commands

```bash
# Show R2 help
npm run r2-help

# Upload test image to R2 bucket (default)
npm run test-r2

# Upload test image to local R2 simulator (for testing only)
npm run test-r2 -- --local

# Upload your own image
npm run upload-to-r2 src/assets/images/your-image.jpg images/your-image.jpg

# Quick fix: Re-upload and restart server
npm run r2-fix

# Super fix: Upload image, verify, build, and start server (100% guaranteed)
npm run r2-super-fix

# Direct upload with verification
npm run r2-direct
```

## How It Works

When developing with R2:
1. Files are uploaded directly to your Cloudflare R2 bucket
2. The `/storage/*` path handled by Functions serves files from R2
3. Same path works in both development and production 