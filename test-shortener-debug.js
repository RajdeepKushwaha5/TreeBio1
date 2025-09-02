const testShortener = async () => {
  console.log('🔗 LINK SHORTENER DEBUG TEST');
  console.log('='.repeat(50));

  const baseUrl = 'http://127.0.0.1:3000';
  const testUrls = [
    'https://example.com/test-page-1',
    'https://github.com/test-repo',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ];

  for (let i = 0; i < testUrls.length; i++) {
    const testUrl = testUrls[i];
    console.log(`\n📝 Test ${i + 1}: ${testUrl}`);
    console.log('-'.repeat(40));

    try {
      // Step 1: Create short URL
      console.log('1. Creating short URL...');
      const createResponse = await fetch(`${baseUrl}/api/shortener`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: testUrl })
      });

      const createData = await createResponse.json();
      console.log('   Response status:', createResponse.status);
      console.log('   Response data:', JSON.stringify(createData, null, 2));

      if (!createResponse.ok || !createData.success) {
        console.log('❌ Failed to create short URL');
        continue;
      }

      const { shortUrl, shortCode } = createData;
      console.log('✅ Short URL created:', shortUrl);

      // Step 2: Test redirect (manual follow)
      console.log('\n2. Testing redirect...');
      const redirectResponse = await fetch(shortUrl, {
        redirect: 'manual',
        headers: { 'User-Agent': 'Mozilla/5.0 Test Browser' }
      });

      console.log('   Redirect status:', redirectResponse.status);
      console.log('   Location header:', redirectResponse.headers.get('location'));

      if (redirectResponse.status >= 300 && redirectResponse.status < 400) {
        const redirectLocation = redirectResponse.headers.get('location');
        if (redirectLocation === testUrl) {
          console.log('✅ Redirect working correctly');
        } else {
          console.log('❌ Redirect URL mismatch');
          console.log('   Expected:', testUrl);
          console.log('   Got:', redirectLocation);
        }
      } else {
        console.log('❌ No redirect detected');
      }

      // Step 3: Test direct API call to getOriginalUrl
      console.log('\n3. Testing direct API resolution...');
      const { linkShortener } = require('./lib/link-shortener.ts');
      const resolveResult = await linkShortener.getOriginalUrl(shortCode);
      console.log('   Resolve result:', JSON.stringify(resolveResult, null, 2));

      // Step 4: Check database entry
      console.log('\n4. Checking database...');
      const { db } = require('./lib/db.ts');
      const dbEntry = await db.shortUrl.findUnique({
        where: { shortCode }
      });
      console.log('   Database entry:', JSON.stringify(dbEntry, null, 2));

    } catch (error) {
      console.log('❌ Test failed:', error.message);
      console.log('   Full error:', error);
    }
  }

  // Step 5: List all short URLs
  console.log('\n📊 FETCHING ALL SHORT URLS');
  console.log('-'.repeat(40));
  try {
    const listResponse = await fetch(`${baseUrl}/api/shortener`);
    const listData = await listResponse.json();
    console.log('List response:', JSON.stringify(listData, null, 2));
  } catch (error) {
    console.log('❌ Failed to fetch short URLs:', error.message);
  }

  console.log('\n🏁 Test completed!');
};

// Add delay to allow server to start
setTimeout(testShortener, 3000);
