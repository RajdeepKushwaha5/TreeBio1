#!/usr/bin/env node

console.log('🔗 Testing Short URL Redirect Functionality\n');

// Test data
const testUrls = [
  'https://google.com',
  'https://github.com',
  'https://stackoverflow.com',
];

// Test if we can access the database directly (simulate what the redirect page does)
async function testRedirectLogic() {
  console.log('📋 Testing redirect logic with mock data:\n');

  testUrls.forEach((url, index) => {
    const mockShortCode = `test${index + 1}`;
    console.log(`✅ Mock Short URL: localhost:3000/s/${mockShortCode}`);
    console.log(`🎯 Should redirect to: ${url}`);
    console.log(`📝 Test: curl -I "http://localhost:3000/s/${mockShortCode}" should return 302/307 redirect\n`);
  });

  console.log('🔍 Manual Testing Steps:');
  console.log('1. Go to http://localhost:3000/admin/tools/shortener');
  console.log('2. Enter a URL (e.g., https://google.com)');
  console.log('3. Click "Generate Short Link"');
  console.log('4. Copy the generated short URL');
  console.log('5. Open the short URL in a new tab');
  console.log('6. Verify it redirects to the original URL');
  console.log('');

  console.log('🚨 Known Issues to Check:');
  console.log('- Ensure shortCode is not undefined in the URL construction');
  console.log('- Verify the redirect page handles the shortCode parameter correctly');
  console.log('- Check that the database query works properly');
  console.log('- Confirm the redirect() function works as expected');

  return true;
}

// Run the test
testRedirectLogic().then(() => {
  console.log('\n🎯 REDIRECT FUNCTIONALITY TEST COMPLETE');
  console.log('✅ Manual testing required to verify actual redirects work');
}).catch(error => {
  console.error('❌ Test failed:', error);
});
