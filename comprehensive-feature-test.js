/**
 * TreeBio Feature Analysis - Comprehensive Issue Detection
 * Run this in browser console to identify broken features
 */

(async function analyzeTreeBioFeatures() {
  console.log(`
🔍 TREEBIO COMPREHENSIVE FEATURE ANALYSIS
========================================
Checking all major features for potential issues...
`);

  const issues = [];
  const warnings = [];
  const working = [];

  // Helper function to test API endpoints
  async function testEndpoint(url, method = 'GET', body = null) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (body) options.body = JSON.stringify(body);

      const response = await fetch(url, options);
      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        data,
        error: response.ok ? null : data.error || 'Unknown error'
      };
    } catch (error) {
      return {
        success: false,
        status: 0,
        data: null,
        error: error.message
      };
    }
  }

  // 1. Test API Health
  console.log('🔄 Testing API Health...');
  const healthTest = await testEndpoint('/api/health');
  if (healthTest.success) {
    working.push('API Health endpoint working');
    console.log('✅ API Health: Working');
    
    // Check specific health details
    const health = healthTest.data;
    if (!health.database?.success) {
      issues.push(`Database connection: ${health.database?.error || 'Failed'}`);
    }
    if (!health.environmentVariables?.DATABASE_URL) {
      issues.push('DATABASE_URL environment variable not set');
    }
    if (!health.environmentVariables?.CLERK_SECRET_KEY) {
      issues.push('CLERK_SECRET_KEY environment variable not set');
    }
  } else {
    issues.push(`API Health endpoint: ${healthTest.error}`);
  }

  // 2. Test Authentication Status
  console.log('🔄 Testing Authentication...');
  const profileTest = await testEndpoint('/api/profile');
  if (profileTest.success) {
    working.push('User authentication working');
    console.log('✅ Authentication: Working (User logged in)');
  } else if (profileTest.status === 401) {
    warnings.push('User not authenticated (expected for public pages)');
    console.log('⚠️ Authentication: User not logged in');
  } else {
    issues.push(`Authentication system: ${profileTest.error}`);
  }

  // 3. Test Link Management
  console.log('🔄 Testing Link Management...');
  const linksTest = await testEndpoint('/api/links');
  if (linksTest.success) {
    working.push('Link management API working');
  } else if (linksTest.status === 401) {
    warnings.push('Link management requires authentication');
  } else {
    issues.push(`Link management: ${linksTest.error}`);
  }

  // 4. Test Link Shortener
  console.log('🔄 Testing Link Shortener...');
  const shortenerTest = await testEndpoint('/api/shortener', 'POST', {
    originalUrl: 'https://example.com'
  });
  if (shortenerTest.success) {
    working.push('Link shortener working');
    console.log('✅ Link Shortener: Working');
    
    // Test redirect functionality
    if (shortenerTest.data.shortCode) {
      const redirectTest = await testEndpoint(`/s/${shortenerTest.data.shortCode}`, 'HEAD');
      if (redirectTest.status === 302 || redirectTest.status === 301) {
        working.push('Link shortener redirects working');
      } else {
        issues.push('Link shortener redirects not working properly');
      }
    }
  } else if (shortenerTest.status === 401) {
    warnings.push('Link shortener requires authentication');
  } else {
    issues.push(`Link shortener: ${shortenerTest.error}`);
  }

  // 5. Test QR Code Generation (check if component exists)
  console.log('🔄 Testing QR Code Features...');
  const qrCodeElements = document.querySelectorAll('[data-testid*="qr"], [class*="qr"], canvas');
  if (qrCodeElements.length > 0) {
    working.push('QR Code components present');
  } else {
    warnings.push('QR Code components not found on current page');
  }

  // 6. Test Analytics
  console.log('🔄 Testing Analytics...');
  const dashboardTest = await testEndpoint('/api/dashboard');
  if (dashboardTest.success) {
    working.push('Dashboard/Analytics API working');
  } else if (dashboardTest.status === 401) {
    warnings.push('Dashboard requires authentication');
  } else {
    issues.push(`Dashboard/Analytics: ${dashboardTest.error}`);
  }

  // 7. Test Social Links
  console.log('🔄 Testing Social Links...');
  const socialTest = await testEndpoint('/api/social-links');
  if (socialTest.success) {
    working.push('Social links API working');
  } else if (socialTest.status === 401) {
    warnings.push('Social links require authentication');
  } else {
    issues.push(`Social links: ${socialTest.error}`);
  }

  // 8. Check Frontend Components
  console.log('🔄 Checking Frontend Components...');
  
  // Check for forms
  const forms = document.querySelectorAll('form');
  if (forms.length === 0) {
    warnings.push('No forms found on current page');
  } else {
    working.push(`${forms.length} forms found`);
  }

  // Check for modals
  const modals = document.querySelectorAll('[role="dialog"], .modal, [data-modal]');
  if (modals.length > 0) {
    working.push('Modal components present');
  }

  // Check for buttons
  const buttons = document.querySelectorAll('button');
  const workingButtons = Array.from(buttons).filter(btn => 
    !btn.disabled && (btn.onclick || btn.getAttribute('data-action'))
  );
  if (workingButtons.length === 0 && buttons.length > 0) {
    warnings.push('Buttons found but may lack click handlers');
  } else if (buttons.length > 0) {
    working.push(`${buttons.length} buttons found, ${workingButtons.length} appear functional`);
  }

  // 9. Check for JavaScript Errors
  console.log('🔄 Monitoring JavaScript Errors...');
  const originalError = console.error;
  const jsErrors = [];
  
  console.error = function(...args) {
    jsErrors.push(args.join(' '));
    originalError.apply(console, args);
  };

  // Wait for any async errors
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.error = originalError;

  if (jsErrors.length > 0) {
    issues.push(`JavaScript errors detected: ${jsErrors.length}`);
    jsErrors.forEach(error => console.error('JS Error:', error));
  } else {
    working.push('No JavaScript errors detected');
  }

  // 10. Check Real-time Features (Pusher)
  console.log('🔄 Testing Real-time Features...');
  if (window.Pusher || window.pusher) {
    working.push('Pusher/Real-time client loaded');
  } else {
    warnings.push('Pusher/Real-time features not detected (may be optional)');
  }

  // Generate Report
  console.log(`
📊 TREEBIO FEATURE ANALYSIS REPORT
=================================

✅ WORKING FEATURES (${working.length}):
${working.map(item => `   • ${item}`).join('\n')}

❌ CRITICAL ISSUES (${issues.length}):
${issues.map(item => `   • ${item}`).join('\n')}

⚠️  WARNINGS (${warnings.length}):
${warnings.map(item => `   • ${item}`).join('\n')}

🎯 SUMMARY:
${issues.length === 0 ? '🎉 No critical issues found!' : `🚨 ${issues.length} critical issues need attention`}
${warnings.length > 5 ? `⚠️ ${warnings.length} warnings to review` : `✅ Warning levels acceptable`}

🔧 NEXT STEPS:
${issues.length > 0 ? '1. Fix critical issues immediately' : '1. No critical fixes needed'}
2. Review warnings for potential improvements
3. Test user flows manually
4. Verify on different devices/browsers
5. Check production environment settings

📋 DETAILED RECOMMENDATIONS:
`);

  // Specific recommendations based on issues found
  if (issues.some(issue => issue.includes('DATABASE_URL'))) {
    console.log('🔧 DATABASE_URL: Set up environment variable in Vercel/deployment platform');
  }
  
  if (issues.some(issue => issue.includes('CLERK'))) {
    console.log('🔧 CLERK: Configure authentication keys in environment variables');
  }
  
  if (issues.some(issue => issue.includes('shortener'))) {
    console.log('🔧 SHORTENER: Check middleware and route configuration');
  }

  if (issues.some(issue => issue.includes('JavaScript'))) {
    console.log('🔧 JAVASCRIPT: Check browser console for specific error details');
  }

  console.log('\n✨ Analysis complete! Use this information to prioritize fixes.');

  return {
    working: working.length,
    issues: issues.length,
    warnings: warnings.length,
    details: { working, issues, warnings }
  };
})();
