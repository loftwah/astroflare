# Using Cloudflare R2 Storage with AstroFlare

This project includes integration with Cloudflare R2 for storing and serving large static assets like images, videos, and files that might exceed the Cloudflare Pages size limits.

## How It Works

1. Static assets are stored in Cloudflare R2 bucket
2. An Astro API route (`src/pages/storage/[...path].ts`) handles requests to `/storage/*` paths
3. The route fetches the requested file from R2 and serves it with proper headers
4. Your Astro site can reference these assets using the `/storage/path/to/file` URL pattern

## Usage

### Referencing R2 Assets in Your Astro Pages

Use the `/storage/` path prefix to reference any asset stored in your R2 bucket:

```astro
<img src="/storage/images/astroflare.jpg" alt="AstroFlare" />
```

### Uploading Files to R2

This project includes a utility script to easily upload files to your R2 bucket:

```bash
# Install dependencies
npm install

# Upload a file
npm run upload-to-r2 path/to/local/file path/in/r2

# Example
npm run upload-to-r2 src/assets/images/astroflare.jpg images/astroflare.jpg
```

Alternatively, you can use Wrangler directly:

```bash
npx wrangler r2 object put astroflare/images/astroflare.jpg --file=src/assets/images/astroflare.jpg
```

### Using the R2 Dashboard

You can also manage your R2 bucket through the Cloudflare dashboard:

1. Log in to your Cloudflare account
2. Navigate to R2 > Buckets
3. Select your "astroflare" bucket
4. Upload, download, or delete files as needed

## Configuration

The R2 bucket configuration is in your `wrangler.toml` file:

```toml
[[r2_buckets]]
binding = "STORAGE"
bucket_name = "astroflare"
```

## Testing

Visit the `/r2-test` page to see a demonstration of R2 storage in action.

## Troubleshooting

If you encounter issues:

1. Make sure your R2 bucket is properly configured in `wrangler.toml`
2. Verify that the file exists in your R2 bucket
3. Check that you're using the correct path format: `/storage/path/to/file`
4. Confirm that you have the proper permissions for your R2 bucket

## Limitations

- All assets in R2 are publicly accessible through your website
- For private/authenticated access, additional configuration would be needed 