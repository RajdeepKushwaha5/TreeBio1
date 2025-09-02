#!/usr/bin/env node

/**
 * Complete Link Shortener Test Suite
 * Tests URL shortening and redirect functionality
 */

const http = require('http');
const https = require('https');

console.log('🔗 Complete Link Shortener Test Suite');
console.log('=====================================\n');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_URL = 'https://www.google.com';

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;

    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

async function testShortenerAPI() {
  console.log('📡 Testing Shortener API...');

  try {
    // Test GET /api/shortener (fetch existing URLs)
    const getOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/shortener',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    console.log('   → GET /api/shortener');
    const getResult = await makeRequest(getOptions);
    console.log(`   ✓ Status: ${getResult.statusCode}`);

    if (getResult.statusCode === 401) {
      console.log('   ⚠️  Authentication required (expected for protected endpoint)');
      return null;
    }

    // Test POST /api/shortener (create short URL)
    const postData = JSON.stringify({
      originalUrl: TEST_URL
    });

    const postOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/shortener',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log('   → POST /api/shortener');
    console.log(`   → Payload: ${postData}`);

    const postResult = await makeRequest(postOptions, postData);
    console.log(`   ✓ Status: ${postResult.statusCode}`);

    if (postResult.statusCode === 200) {
      const response = JSON.parse(postResult.body);
      console.log('   ✓ Short URL created successfully');
      console.log(`   ✓ Short Code: ${response.shortCode}`);
      return response.shortCode;
    } else {
      console.log('   ❌ Failed to create short URL');
      console.log(`   📝 Response: ${postResult.body}`);
      return null;
    }

  } catch (error) {
    console.log(`   ❌ API Test Error: ${error.message}`);
    return null;
  }
}

async function testRedirect(shortCode) {
  console.log('\n🔄 Testing Redirect Functionality...');

  if (!shortCode) {
    console.log('   ❌ No short code to test');
    return false;
  }

  try {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/s/${shortCode}`,
      method: 'GET'
    };

    console.log(`   → GET /s/${shortCode}`);

    const result = await makeRequest(options);
    console.log(`   ✓ Status: ${result.statusCode}`);

    if (result.statusCode === 302 || result.statusCode === 301) {
      const location = result.headers.location;
      console.log(`   ✓ Redirect Location: ${location}`);

      if (location === TEST_URL) {
        console.log('   ✅ Redirect URL matches original URL!');
        return true;
      } else {
        console.log('   ❌ Redirect URL does not match original URL');
        console.log(`   Expected: ${TEST_URL}`);
        console.log(`   Got: ${location}`);
        return false;
      }
    } else if (result.statusCode === 404) {
      console.log('   ❌ Short URL not found');
      return false;
    } else {
      console.log(`   ❌ Unexpected status code: ${result.statusCode}`);
      console.log(`   📝 Response: ${result.body}`);
      return false;
    }

  } catch (error) {
    console.log(`   ❌ Redirect Test Error: ${error.message}`);
    return false;
  }
}

async function runCompleteTest() {
  console.log('🚀 Starting Complete Test Suite...\n');

  // Test 1: API Functionality
  const shortCode = await testShortenerAPI();

  // Test 2: Redirect Functionality
  const redirectWorking = await testRedirect(shortCode);

  // Results
  console.log('\n📊 Test Results:');
  console.log('================');

  if (shortCode) {
    console.log('✅ URL Shortening: WORKING');
    console.log(`   Generated Short Code: ${shortCode}`);
    console.log(`   Short URL: ${BASE_URL}/s/${shortCode}`);
  } else {
    console.log('❌ URL Shortening: FAILED');
  }

  if (redirectWorking) {
    console.log('✅ URL Redirect: WORKING');
    console.log(`   ${BASE_URL}/s/${shortCode} → ${TEST_URL}`);
  } else {
    console.log('❌ URL Redirect: FAILED');
  }

  if (shortCode && redirectWorking) {
    console.log('\n🎉 ALL TESTS PASSED! Link Shortener is working correctly.');
    console.log('\n🔗 Manual Test Instructions:');
    console.log(`1. Visit: ${BASE_URL}/admin/tools/shortener`);
    console.log(`2. Enter URL: ${TEST_URL}`);
    console.log('3. Click "Generate Short Link"');
    console.log('4. Copy the generated short URL');
    console.log('5. Visit the short URL in a new tab');
    console.log(`6. Verify it redirects to: ${TEST_URL}`);
  } else {
    console.log('\n⚠️  SOME TESTS FAILED. Please check the issues above.');
  }
}

// Run the complete test
runCompleteTest().catch((error) => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
