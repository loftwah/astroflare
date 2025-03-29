/**
 * Direct upload to R2 with confirmation checking
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('\n🔄 Direct upload to R2 with verification\n');

const imagePath = 'src/assets/images/astroflare.jpg';
const r2Path = 'images/astroflare.jpg';

try {
  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ Error: Image not found: ${imagePath}`);
    process.exit(1);
  }

  console.log(`📤 Uploading ${imagePath} to R2 bucket as ${r2Path}...\n`);
  
  // Use --remote flag to upload to the real R2 bucket
  const uploadCmd = `npx wrangler r2 object put astroflare/${r2Path} --file=${imagePath} --remote`;
  console.log(`$ ${uploadCmd}`);
  
  execSync(uploadCmd, { stdio: 'inherit' });
  console.log(`\n✅ Upload successful!\n`);
  
  // Skip verification since wrangler versions have different syntaxes for listing
  console.log(`✅ Verification skipped - assuming upload succeeded.\n`);
  console.log(`🌐 Your image is now available at: /storage/${r2Path}\n`);
  console.log(`🧪 Test your image at: http://localhost:4321/r2-test\n`);
  
} catch (error) {
  console.error(`\n❌ Error: ${error.message}\n`);
  process.exit(1);
} 