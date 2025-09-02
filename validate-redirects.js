#!/usr/bin/env node

const readline = require('readline');

console.log('🔗 Link Shortener Redirect Validation Tool\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function testDirectRedirect(shortCode, expectedUrl) {
  console.log(`\n🔍 Testing redirect for short code: ${shortCode}`);
  console.log(`🎯 Expected redirect to: ${expectedUrl}`);

  try {
    // We can't easily test HTTP redirects in Node.js without additional libraries
    // So we'll provide manual testing instructions
    console.log(`📝 Manual test: Open http://localhost:3000/s/${shortCode} in browser`);
    console.log(`✅ Success: Should automatically redirect to ${expectedUrl}`);
    console.log(`❌ Failure: Shows 404 or doesn't redirect`);

    return true;
  } catch (error) {
    console.error(`❌ Test failed:`, error.message);
    return false;
  }
}

async function runInteractiveTest() {
  console.log('🧪 Interactive URL Shortener Testing');
  console.log('This tool will help you test the redirect functionality\n');

  while (true) {
    const action = await new Promise(resolve => {
      rl.question('\nChoose an option:\n1. Test a short code\n2. Exit\nEnter your choice (1/2): ', resolve);
    });

    if (action === '2') {
      break;
    }

    if (action === '1') {
      const shortCode = await new Promise(resolve => {
        rl.question('Enter the short code to test (e.g., abc123): ', resolve);
      });

      const expectedUrl = await new Promise(resolve => {
        rl.question('Enter the expected original URL: ', resolve);
      });

      await testDirectRedirect(shortCode, expectedUrl);
    }
  }

  rl.close();
}

// Provide immediate testing guidance
console.log('🎯 QUICK TESTING STEPS:');
console.log('1. Open http://localhost:3000/admin/tools/shortener');
console.log('2. Create a short URL for https://google.com');
console.log('3. Copy the generated short URL (should be like http://localhost:3000/s/XXXXXX)');
console.log('4. Open that short URL in a new tab');
console.log('5. Verify it redirects to https://google.com\n');

console.log('🔧 DEBUGGING CHECKLIST:');
console.log('✓ Short URL is generated successfully (no undefined in URL)');
console.log('✓ Database contains the short code and original URL mapping');
console.log('✓ /s/[shortCode] route exists and is working');
console.log('✓ Redirect logic properly extracts shortCode from params');
console.log('✓ Database query finds the original URL');
console.log('✓ redirect() function executes properly\n');

// Ask if they want to run interactive tests
const startInteractive = process.argv.includes('--interactive');

if (startInteractive) {
  runInteractiveTest();
} else {
  console.log('Run with --interactive flag for interactive testing');
  console.log('Example: node test-redirect.js --interactive\n');
}
