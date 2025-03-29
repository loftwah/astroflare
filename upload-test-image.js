/**
 * Simple script to upload the test image to R2
 */

import { execSync } from 'child_process';

console.log('Uploading test image to R2...');

// Check if the --remote flag was passed or if --local is NOT passed
// Default to remote if not specified
const forceLocal = process.argv.includes('--local');
const forceRemote = process.argv.includes('--remote');
const useRemote = forceRemote || (!forceLocal && true); // Default to remote
const remoteFlag = useRemote ? ' --remote' : '';

try {
  // Upload the astroflare.jpg image to R2
  const command = `npx wrangler r2 object put astroflare/images/astroflare.jpg --file=src/assets/images/astroflare.jpg${remoteFlag}`;
  
  console.log(`Running: ${command}`);
  const output = execSync(command, { encoding: 'utf-8' });
  console.log(output);
  
  console.log('\n✅ Test image uploaded successfully!');
  console.log('Your image is now available at: /storage/images/astroflare.jpg');
  console.log('Visit /r2-test to see it in action.');
  
  if (!useRemote) {
    console.log('\n⚠️ NOTE: This was uploaded to the local R2 simulator.');
    console.log('To upload to your real R2 bucket, run: npm run test-r2 -- --remote');
  } else {
    console.log('\n✅ Image was uploaded to your REAL R2 bucket in Cloudflare.');
    console.log('It will be available in both development and production.');
  }
} catch (error) {
  console.error('Error uploading image to R2:', error);
  process.exit(1);
} 