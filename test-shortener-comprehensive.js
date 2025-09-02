#!/usr/bin/env node

/**
 * Comprehensive Link Shortener Testing Script
 * 
 * This script tests all aspects of the Link Shortener functionality:
 * 1. Database connectivity
 * 2. URL creation via API
 * 3. URL resolution and redirection
 * 4. Error handling
 * 5. Edge cases
 */

const testCases = [
  {
    name: 'Valid HTTPS URL',
    url: 'https://www.example.com/test-page',
    shouldSucceed: true
  },
  {
    name: 'Valid HTTP URL',
    url: 'http://example.com/test',
    shouldSucceed: true
  },
  {
    name: 'URL without protocol',
    url: 'github.com/user/repo',
    shouldSucceed: true
  },
  {
    name: 'URL with query params',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    shouldSucceed: true
  },
  {
    name: 'Empty URL',
    url: '',
    shouldSucceed: false
  },
  {
    name: 'Invalid URL format',
    url: 'not-a-url',
    shouldSucceed: false
  },
  {
    name: 'Very long URL',
    url: 'https://example.com/' + 'a'.repeat(1000),
    shouldSucceed: true
  }
];

async function runTests() {
  console.log('🧪 LINK SHORTENER COMPREHENSIVE TEST SUITE');
  console.log('='.repeat(60));

  const baseUrl = 'http://localhost:3000';
  let passedTests = 0;
  let totalTests = 0;
  const createdShortUrls = [];

  console.log(`📡 Testing API endpoint: ${baseUrl}/api/shortener`);
  console.log('');

  // Test each case
  for (const testCase of testCases) {
    totalTests++;
    console.log(`\n🧪 Test ${totalTests}: ${testCase.name}`);
    console.log('─'.repeat(40));
    console.log(`URL: ${testCase.url || '(empty)'}`);

    try {
      const response = await fetch(`${baseUrl}/api/shortener`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Test-Suite/1.0'
        },
        body: JSON.stringify({ originalUrl: testCase.url })
      });

      const result = await response.json();

      console.log(`Response Status: ${response.status}`);
      console.log(`Response Body:`, JSON.stringify(result, null, 2));

      if (testCase.shouldSucceed) {
        if (response.ok && result.success) {
          console.log('✅ PASS - URL shortened successfully');
          createdShortUrls.push(result);
          passedTests++;

          // Test the redirect
          await testRedirect(result.shortUrl, result.originalUrl);
        } else {
          console.log('❌ FAIL - Expected success but got error');
        }
      } else {
        if (!response.ok || !result.success) {
          console.log('✅ PASS - Correctly rejected invalid URL');
          passedTests++;
        } else {
          console.log('❌ FAIL - Should have rejected invalid URL');
        }
      }
    } catch (error) {
      if (testCase.shouldSucceed) {
        console.log('❌ FAIL - Unexpected error:', error.message);
      } else {
        console.log('✅ PASS - Correctly failed for invalid input');
        passedTests++;
      }
    }
  }

  // Test retrieving all short URLs
  console.log('\n📊 Testing GET /api/shortener');
  console.log('─'.repeat(40));

  try {
    const response = await fetch(`${baseUrl}/api/shortener`);
    const result = await response.json();

    if (response.ok) {
      console.log(`✅ Retrieved ${result.shortUrls?.length || 0} short URLs`);
      totalTests++;
      passedTests++;
    } else {
      console.log('❌ Failed to retrieve short URLs');
      totalTests++;
    }
  } catch (error) {
    console.log('❌ Error retrieving short URLs:', error.message);
    totalTests++;
  }

  // Test custom codes
  console.log('\n🎯 Testing Custom Short Codes');
  console.log('─'.repeat(40));

  const customTests = [
    { customCode: 'mycustom', shouldWork: true },
    { customCode: 'ab', shouldWork: false }, // too short
    { customCode: 'valid123', shouldWork: true },
    { customCode: 'with-dash', shouldWork: false }, // contains dash
  ];

  for (const test of customTests) {
    totalTests++;
    try {
      const response = await fetch(`${baseUrl}/api/shortener`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalUrl: 'https://example.com/custom-test',
          customCode: test.customCode
        })
      });

      const result = await response.json();

      if (test.shouldWork) {
        if (response.ok && result.success) {
          console.log(`✅ Custom code '${test.customCode}' worked correctly`);
          passedTests++;
        } else {
          console.log(`❌ Custom code '${test.customCode}' should have worked`);
        }
      } else {
        if (!response.ok || !result.success) {
          console.log(`✅ Custom code '${test.customCode}' correctly rejected`);
          passedTests++;
        } else {
          console.log(`❌ Custom code '${test.customCode}' should have been rejected`);
        }
      }
    } catch (error) {
      console.log(`❌ Error testing custom code '${test.customCode}':`, error.message);
    }
  }

  // Final results
  console.log('\n🏁 TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Link Shortener is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the issues above.');
  }

  console.log(`\n📝 Created ${createdShortUrls.length} test short URLs`);
  createdShortUrls.forEach(url => {
    console.log(`   ${url.shortUrl} → ${url.originalUrl}`);
  });
}

async function testRedirect(shortUrl, expectedUrl) {
  try {
    console.log(`   🔄 Testing redirect: ${shortUrl}`);

    const response = await fetch(shortUrl, {
      redirect: 'manual',
      headers: { 'User-Agent': 'Test-Suite/1.0' }
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location === expectedUrl) {
        console.log('   ✅ Redirect working correctly');
      } else {
        console.log(`   ❌ Redirect mismatch - Expected: ${expectedUrl}, Got: ${location}`);
      }
    } else {
      console.log(`   ❌ Expected redirect but got status ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Redirect test failed: ${error.message}`);
  }
}

// Wait for server to be ready, then run tests
console.log('⏳ Waiting for server to be ready...');
setTimeout(runTests, 2000);
