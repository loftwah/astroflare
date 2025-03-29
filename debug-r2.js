/**
 * Debug script for R2 setup
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('\n🔍 R2 Debug Tool\n');

// Define paths
const imagePath = 'src/assets/images/astroflare.jpg';
const r2Path = 'images/astroflare.jpg';

try {
  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ Error: Image not found: ${imagePath}`);
    process.exit(1);
  }

  console.log('1️⃣ Uploading test image to R2 bucket...');
  
  // Upload directly to R2
  const uploadCmd = `npx wrangler r2 object put astroflare/${r2Path} --file=${imagePath} --remote`;
  execSync(uploadCmd, { stdio: 'inherit' });
  
  console.log('\n2️⃣ Creating debug HTML page...');
  
  // Create a simple debug HTML page
  const debugHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>R2 Debug Page</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; }
    h1 { color: #333; }
    .debug-section { border: 1px solid #ddd; padding: 1rem; margin-bottom: 1rem; border-radius: 4px; }
    .debug-image { max-width: 100%; height: auto; margin: 1rem 0; border: 1px solid #eee; }
    .code { font-family: monospace; background: #f5f5f5; padding: 0.5rem; overflow: auto; border-radius: 4px; }
    .success { color: green; }
    .error { color: red; }
  </style>
</head>
<body>
  <h1>R2 Debug Page</h1>
  
  <div class="debug-section">
    <h2>Testing Direct URL</h2>
    <div class="code">/storage/${r2Path}</div>
    <img src="/storage/${r2Path}" class="debug-image" onerror="this.parentNode.innerHTML += '<p class=\\"error\\">❌ Error loading image</p>';" onload="this.parentNode.innerHTML += '<p class=\\"success\\">✅ Image loaded successfully</p>';" />
  </div>

  <div class="debug-section">
    <h2>Testing Image Element</h2>
    <div class="code">&lt;img src="/storage/${r2Path}" /&gt;</div>
    <img src="/storage/${r2Path}" class="debug-image" onerror="this.parentNode.innerHTML += '<p class=\\"error\\">❌ Error loading image</p>';" onload="this.parentNode.innerHTML += '<p class=\\"success\\">✅ Image loaded successfully</p>';" />
  </div>

  <div class="debug-section">
    <h2>R2 Information</h2>
    <p>Bucket name: <strong>astroflare</strong></p>
    <p>Image path: <strong>${r2Path}</strong></p>
    <p>Access URL: <strong>/storage/${r2Path}</strong></p>
  </div>
</body>
</html>
  `;
  
  // Write the debug page
  fs.mkdirSync('public/debug', { recursive: true });
  fs.writeFileSync('public/debug/r2.html', debugHtml);
  
  console.log('\n3️⃣ Building and starting preview server...');
  
  // Build the project
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\n✅ Setup complete!\n');
  console.log('Starting preview server...');
  console.log('Once server is running, visit:');
  console.log('- http://localhost:8788/debug/r2.html (Debug Page)');
  console.log('- http://localhost:8788/r2-test');
  console.log('- http://localhost:8788/test-items\n');
  
  // Start the preview server
  execSync('npm run preview', { stdio: 'inherit' });
  
} catch (error) {
  console.error(`\n❌ Error: ${error.message}\n`);
  process.exit(1);
} 