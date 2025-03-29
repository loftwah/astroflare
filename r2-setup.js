/**
 * AstroFlare R2 Storage Setup
 * This script guides you through testing the R2 storage setup
 */

import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🚀 AstroFlare R2 Storage Setup 🚀\n');
console.log('This interactive guide will help you test your R2 storage setup.\n');

console.log('Step 1: First, let\'s upload the test image to R2');
console.log('=================================================\n');

rl.question('Upload test image to your Cloudflare R2 bucket? (Y/n): ', (answer) => {
  if (answer.toLowerCase() !== 'n') {
    try {
      console.log('\nUploading test image to Cloudflare R2 bucket...\n');
      execSync('node upload-test-image.js --remote', { stdio: 'inherit' });
    } catch (error) {
      console.error('\n❌ Error uploading test image:', error.message);
      process.exit(1);
    }
  }

  console.log('\nStep 2: Let\'s start a local development server');
  console.log('============================================\n');
  
  rl.question('Start local development server? (Y/n): ', (answer) => {
    if (answer.toLowerCase() !== 'n') {
      console.log('\n⚠️ Starting local development server...');
      console.log('⚠️ After the server starts, open your browser to:');
      console.log('⚠️ http://localhost:4321/r2-test\n');
      console.log('⚠️ Press Ctrl+C to stop the server when done.\n');
      
      try {
        execSync('npm run preview', { stdio: 'inherit' });
      } catch (error) {
        // Handle Ctrl+C gracefully
        console.log('\nServer stopped.\n');
      }
    }
    
    console.log('\n✅ R2 Setup Complete!');
    console.log('\nUseful commands:');
    console.log('  npm run r2-help                 - Show R2 help');
    console.log('  npm run test-r2                 - Upload test image to R2');
    console.log('  npm run test-r2 -- --local      - Upload test image to local R2 simulator');
    console.log('  npm run upload-to-r2 src/assets/images/astroflare.jpg images/astroflare.jpg - Upload any file\n');
    console.log('  npm run r2-fix                  - Quick fix: Re-upload and restart server\n');
    
    rl.close();
  });
}); 