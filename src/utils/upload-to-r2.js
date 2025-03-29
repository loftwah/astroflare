/**
 * Upload asset files to R2 bucket
 * 
 * Usage: 
 * npm run upload-to-r2 path/to/local/file path/in/r2 [--local]
 * 
 * Examples:
 * npm run upload-to-r2 src/assets/images/astroflare.jpg images/astroflare.jpg
 * npm run upload-to-r2 src/assets/images/astroflare.jpg images/astroflare.jpg --local
 */

import fs from 'fs';
import path from 'path';
import { fileTypeFromFile } from 'file-type';
import { execSync } from 'child_process';

// Parse arguments
let localFilePath, r2Path;
const args = process.argv.slice(2);
const useLocal = args.includes('--local');
const useRemote = !useLocal; // Default to remote unless --local is specified

// Remove flags from args
const cleanArgs = args.filter(arg => !arg.startsWith('--'));
[localFilePath, r2Path] = cleanArgs;

// Show help if arguments are missing
if (!localFilePath || !r2Path) {
  console.log('\n📦 Cloudflare R2 File Uploader 📦\n');
  console.log('Usage:');
  console.log('  npm run upload-to-r2 path/to/local/file path/in/r2 [--local]\n');
  console.log('Examples:');
  console.log('  npm run upload-to-r2 src/assets/images/astroflare.jpg images/astroflare.jpg');
  console.log('  npm run upload-to-r2 src/assets/images/astroflare.jpg images/astroflare.jpg --local\n');
  console.log('Options:');
  console.log('  --local     Upload to the local R2 simulator (not the real bucket)\n');
  process.exit(1);
}

async function uploadToR2() {
  try {
    console.log(`\n📦 Uploading file to R2 ${useRemote ? '(REMOTE BUCKET)' : '(LOCAL SIMULATOR)'}\n`);
    
    // Check if file exists
    if (!fs.existsSync(localFilePath)) {
      console.error(`❌ Error: File not found: ${localFilePath}`);
      console.log(`\nMake sure the file exists and the path is correct.`);
      process.exit(1);
    }

    // Get the file type/mime
    const fileType = await fileTypeFromFile(localFilePath);
    const contentType = fileType ? fileType.mime : 'application/octet-stream';
    
    // Add remote flag if needed
    const remoteFlag = useRemote ? ' --remote' : '';
    
    // Use Wrangler to upload the file to R2
    const command = `npx wrangler r2 object put astroflare/${r2Path} --file=${localFilePath} --content-type=${contentType}${remoteFlag}`;
    
    console.log(`📄 Local file: ${localFilePath}`);
    console.log(`🪣 R2 path: ${r2Path}`);
    console.log(`🔤 Content type: ${contentType}\n`);
    
    console.log(`Running command:`);
    console.log(`$ ${command}\n`);
    
    const output = execSync(command, { encoding: 'utf-8' });
    console.log(output);
    
    console.log(`\n✅ File uploaded successfully!`);
    console.log(`💡 Your file is now available at: /storage/${r2Path}\n`);
    
    if (!useRemote) {
      console.log(`⚠️  NOTE: This file was uploaded to the local R2 simulator.`);
      console.log(`⚠️  It will only be available during local development.`);
      console.log(`⚠️  To upload to your real R2 bucket, remove the --local flag:\n`);
      console.log(`   npm run upload-to-r2 ${localFilePath} ${r2Path}\n`);
    } else {
      console.log(`✅ File was uploaded to your REAL R2 bucket in Cloudflare.`);
      console.log(`✅ It will be available in both development and production.\n`);
    }
  } catch (error) {
    console.error('❌ Error uploading file to R2:', error);
    process.exit(1);
  }
}

uploadToR2(); 