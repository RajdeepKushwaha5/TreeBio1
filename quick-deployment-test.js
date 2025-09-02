const baseUrl = 'http://localhost:3002';

console.log('🚀 TreeBio Deployment Readiness Check');
console.log('=====================================');

async function testBasicFunctionality() {
  console.log('\n📍 Testing Basic Server Response...');

  try {
    const response = await fetch(baseUrl);
    console.log(`✅ Server responding: ${response.status}`);

    if (response.ok) {
      console.log('✅ Home page loads successfully');
    } else {
      console.log(`❌ Home page error: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Server connection failed: ${error.message}`);
    return false;
  }

  console.log('\n📍 Testing Link Shortener API...');

  try {
    const shortenerResponse = await fetch(`${baseUrl}/api/shortener`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl: 'https://example.com/test' })
    });

    if (shortenerResponse.ok) {
      const data = await shortenerResponse.json();
      if (data.success && data.shortUrl) {
        console.log('✅ Link Shortener API working');
        console.log(`   Generated: ${data.shortUrl}`);

        // Test the redirect
        const redirectTest = await fetch(data.shortUrl, { redirect: 'manual' });
        if (redirectTest.status >= 300 && redirectTest.status < 400) {
          console.log('✅ Short URL redirect working');
        } else {
          console.log('❌ Short URL redirect failed');
        }
      } else {
        console.log('❌ Link Shortener API returned invalid response');
      }
    } else {
      console.log(`❌ Link Shortener API failed: ${shortenerResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Link Shortener test failed: ${error.message}`);
  }

  console.log('\n📍 Testing Admin Pages...');

  const adminPages = [
    '/admin',
    '/admin/overview',
    '/admin/tools/shortener',
    '/admin/settings'
  ];

  for (const page of adminPages) {
    try {
      const response = await fetch(`${baseUrl}${page}`);
      if (response.ok) {
        console.log(`✅ ${page} - loads successfully`);
      } else if (response.status === 404) {
        console.log(`⚠️ ${page} - not found (404)`);
      } else {
        console.log(`❌ ${page} - error ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${page} - connection error: ${error.message}`);
    }
  }

  console.log('\n📍 Testing Authentication Pages...');

  const authPages = ['/sign-in', '/sign-up'];

  for (const page of authPages) {
    try {
      const response = await fetch(`${baseUrl}${page}`);
      if (response.ok || response.status === 302) {
        console.log(`✅ ${page} - accessible`);
      } else {
        console.log(`❌ ${page} - error ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${page} - connection error: ${error.message}`);
    }
  }

  return true;
}

// Wait for server and run tests
setTimeout(() => {
  testBasicFunctionality().then(() => {
    console.log('\n🏁 Basic deployment check complete');
  });
}, 2000);
