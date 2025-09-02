/**
 * TreeBio Application - Comprehensive Deployment Readiness Check
 * This script performs a complete validation of all features, pages, and modules
 * Updated: September 2, 2025 - Enhanced for Real-time Features
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 TreeBio Deployment Readiness Check');
console.log('=====================================\n');

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

function checkResult(name, condition, message, isWarning = false) {
  const status = condition ? '✅' : (isWarning ? '⚠️' : '❌');
  const type = condition ? 'PASS' : (isWarning ? 'WARN' : 'FAIL');

  console.log(`${status} ${name}: ${message}`);

  results.details.push({ name, status: type, message });

  if (condition) {
    results.passed++;
  } else if (isWarning) {
    results.warnings++;
  } else {
    results.failed++;
  }
}
const timestamp = new Date().toISOString().substring(11, 19);
const prefix = {
  'info': '🔍',
  'success': '✅',
  'error': '❌',
  'warning': '⚠️',
  'section': '📋'
}[type] || '📍';

console.log(`[${timestamp}] ${prefix} ${message}`);
  }

addResult(test, status, details = '', category = 'General') {
  this.totalTests++;
  if (status === 'PASS') this.passedTests++;

  this.results.push({
    category,
    test,
    status,
    details,
    timestamp: new Date().toISOString()
  });

  if (status === 'FAIL') {
    this.errors.push(`${category}: ${test} - ${details}`);
  } else if (status === 'WARN') {
    this.warnings.push(`${category}: ${test} - ${details}`);
  }
}

  async checkFileStructure() {
  this.log('Checking file structure and dependencies...', 'section');

  const requiredFiles = [
    'package.json',
    'next.config.ts',
    'tsconfig.json',
    'prisma/schema.prisma',
    '.env',
    'app/layout.tsx',
    'app/page.tsx',
    'components/ui',
    'lib/db.ts',
    'middleware.ts'
  ];

  for (const file of requiredFiles) {
    const filePath = path.join('d:', 'treebio-master', file);
    try {
      if (fs.existsSync(filePath)) {
        this.addResult(`File exists: ${file}`, 'PASS', '', 'File Structure');
        this.log(`Found: ${file}`, 'success');
      } else {
        this.addResult(`File missing: ${file}`, 'FAIL', 'Required file not found', 'File Structure');
        this.log(`Missing: ${file}`, 'error');
      }
    } catch (error) {
      this.addResult(`File check error: ${file}`, 'FAIL', error.message, 'File Structure');
    }
  }

  // Check package.json dependencies
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join('d:', 'treebio-master', 'package.json'), 'utf8'));
    const criticalDeps = ['next', 'react', 'prisma', '@clerk/nextjs', 'tailwindcss'];

    for (const dep of criticalDeps) {
      if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
        this.addResult(`Dependency: ${dep}`, 'PASS', packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep], 'Dependencies');
      } else {
        this.addResult(`Dependency: ${dep}`, 'FAIL', 'Missing critical dependency', 'Dependencies');
      }
    }
  } catch (error) {
    this.addResult('Package.json validation', 'FAIL', error.message, 'Dependencies');
  }
}

  async testHttpRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      timeout: 10000,
      ...options
    });
    return {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      text: await response.text().catch(() => ''),
      json: async () => {
        try {
          return JSON.parse(await response.text());
        } catch {
          return null;
        }
      }
    };
  } catch (error) {
    return { error: error.message };
  }
}

  async checkPageAvailability() {
  this.log('Testing page availability and routing...', 'section');

  const pages = [
    { path: '/', name: 'Home Page', critical: true },
    { path: '/sign-in', name: 'Sign In Page', critical: true },
    { path: '/sign-up', name: 'Sign Up Page', critical: true },
    { path: '/admin', name: 'Admin Dashboard', critical: true },
    { path: '/admin/tools/shortener', name: 'Link Shortener', critical: true },
    { path: '/admin/overview', name: 'Admin Overview', critical: false },
    { path: '/admin/settings', name: 'Admin Settings', critical: false },
    { path: '/api/shortener', name: 'Shortener API', critical: true },
    { path: '/api/og-data', name: 'OG Data API', critical: false }
  ];

  for (const page of pages) {
    const url = `${this.baseUrl}${page.path}`;
    this.log(`Testing: ${page.name} (${url})`);

    const response = await this.testHttpRequest(url);

    if (response.error) {
      this.addResult(`Page Load: ${page.name}`, page.critical ? 'FAIL' : 'WARN',
        `Network error: ${response.error}`, 'Page Availability');
      this.log(`Failed to load: ${page.name} - ${response.error}`, 'error');
    } else if (response.status === 200) {
      this.addResult(`Page Load: ${page.name}`, 'PASS', `HTTP ${response.status}`, 'Page Availability');
      this.log(`Loaded successfully: ${page.name}`, 'success');

      // Check for React hydration errors or console errors
      if (response.text && response.text.includes('error')) {
        this.addResult(`Page Quality: ${page.name}`, 'WARN', 'Potential errors in page content', 'Page Quality');
      }
    } else if (response.status === 404) {
      this.addResult(`Page Load: ${page.name}`, page.critical ? 'FAIL' : 'WARN',
        `Page not found (404)`, 'Page Availability');
      this.log(`Page not found: ${page.name}`, page.critical ? 'error' : 'warning');
    } else if (response.status >= 300 && response.status < 400) {
      this.addResult(`Page Load: ${page.name}`, 'PASS', `Redirect (${response.status})`, 'Page Availability');
      this.log(`Redirect detected: ${page.name}`, 'success');
    } else {
      this.addResult(`Page Load: ${page.name}`, page.critical ? 'FAIL' : 'WARN',
        `HTTP ${response.status}`, 'Page Availability');
      this.log(`Unexpected status: ${page.name} - ${response.status}`, 'warning');
    }
  }
}

  async testApiEndpoints() {
  this.log('Testing API endpoints functionality...', 'section');

  // Test Shortener API
  this.log('Testing Link Shortener API...');
  const shortenerTest = await this.testHttpRequest(`${this.baseUrl}/api/shortener`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalUrl: 'https://example.com/test-deployment' })
  });

  if (shortenerTest.error) {
    this.addResult('Link Shortener API', 'FAIL', shortenerTest.error, 'API Endpoints');
  } else if (shortenerTest.status === 200) {
    try {
      const data = JSON.parse(shortenerTest.text);
      if (data.success && data.shortUrl && data.shortCode) {
        this.addResult('Link Shortener API', 'PASS', 'Successfully created short URL', 'API Endpoints');

        // Test the generated short URL redirect
        const redirectTest = await this.testHttpRequest(data.shortUrl, { redirect: 'manual' });
        if (redirectTest.status >= 300 && redirectTest.status < 400) {
          this.addResult('Short URL Redirect', 'PASS', 'Redirect working correctly', 'API Endpoints');
        } else {
          this.addResult('Short URL Redirect', 'FAIL', 'Redirect not working', 'API Endpoints');
        }
      } else {
        this.addResult('Link Shortener API', 'FAIL', 'Invalid API response format', 'API Endpoints');
      }
    } catch (error) {
      this.addResult('Link Shortener API', 'FAIL', 'Invalid JSON response', 'API Endpoints');
    }
  } else {
    this.addResult('Link Shortener API', 'FAIL', `HTTP ${shortenerTest.status}`, 'API Endpoints');
  }

  // Test OG Data API
  this.log('Testing OG Data API...');
  const ogDataTest = await this.testHttpRequest(`${this.baseUrl}/api/og-data?url=https://github.com`);

  if (ogDataTest.error) {
    this.addResult('OG Data API', 'WARN', ogDataTest.error, 'API Endpoints');
  } else if (ogDataTest.status === 200) {
    this.addResult('OG Data API', 'PASS', 'OG data fetching working', 'API Endpoints');
  } else {
    this.addResult('OG Data API', 'WARN', `HTTP ${ogDataTest.status}`, 'API Endpoints');
  }
}

  async checkDatabaseConnectivity() {
  this.log('Testing database connectivity...', 'section');

  // Test database through API calls
  const dbTest = await this.testHttpRequest(`${this.baseUrl}/api/shortener`, {
    method: 'GET'
  });

  if (dbTest.error) {
    this.addResult('Database Connectivity', 'FAIL', 'Cannot reach database endpoints', 'Database');
  } else if (dbTest.status === 200 || dbTest.status === 405) {
    this.addResult('Database Connectivity', 'PASS', 'Database endpoints accessible', 'Database');
  } else {
    this.addResult('Database Connectivity', 'WARN', `Unexpected response: ${dbTest.status}`, 'Database');
  }
}

  async checkEnvironmentVariables() {
  this.log('Checking environment variables...', 'section');

  try {
    const envPath = path.join('d:', 'treebio-master', '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const requiredEnvVars = [
        'DATABASE_URL',
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        'CLERK_SECRET_KEY'
      ];

      for (const envVar of requiredEnvVars) {
        if (envContent.includes(envVar)) {
          this.addResult(`Environment Variable: ${envVar}`, 'PASS', 'Present in .env file', 'Environment');
        } else {
          this.addResult(`Environment Variable: ${envVar}`, 'FAIL', 'Missing from .env file', 'Environment');
        }
      }
    } else {
      this.addResult('Environment File', 'FAIL', '.env file not found', 'Environment');
    }
  } catch (error) {
    this.addResult('Environment Check', 'FAIL', error.message, 'Environment');
  }
}

  async checkSecurity() {
  this.log('Running security checks...', 'section');

  // Check for common security headers
  const securityTest = await this.testHttpRequest(this.baseUrl);

  if (securityTest.headers) {
    const securityHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'referrer-policy'
    ];

    for (const header of securityHeaders) {
      if (securityTest.headers[header]) {
        this.addResult(`Security Header: ${header}`, 'PASS', securityTest.headers[header], 'Security');
      } else {
        this.addResult(`Security Header: ${header}`, 'WARN', 'Missing security header', 'Security');
      }
    }
  }

  // Check for exposed sensitive files
  const sensitiveFiles = ['.env', 'package.json', 'prisma/schema.prisma'];
  for (const file of sensitiveFiles) {
    const fileTest = await this.testHttpRequest(`${this.baseUrl}/${file}`);
    if (fileTest.status === 200) {
      this.addResult(`Sensitive File Exposure: ${file}`, 'FAIL', 'File accessible via HTTP', 'Security');
    } else {
      this.addResult(`Sensitive File Protection: ${file}`, 'PASS', 'File properly protected', 'Security');
    }
  }
}

  async checkPerformance() {
  this.log('Testing performance metrics...', 'section');

  const performanceTest = async (url, pageName) => {
    const startTime = Date.now();
    const response = await this.testHttpRequest(url);
    const loadTime = Date.now() - startTime;

    if (response.error) {
      this.addResult(`Page Load Time: ${pageName}`, 'FAIL', response.error, 'Performance');
      return;
    }

    if (loadTime < 2000) {
      this.addResult(`Page Load Time: ${pageName}`, 'PASS', `${loadTime}ms`, 'Performance');
    } else if (loadTime < 5000) {
      this.addResult(`Page Load Time: ${pageName}`, 'WARN', `${loadTime}ms (slow)`, 'Performance');
    } else {
      this.addResult(`Page Load Time: ${pageName}`, 'FAIL', `${loadTime}ms (too slow)`, 'Performance');
    }

    // Check response size
    const responseSize = response.text ? response.text.length : 0;
    if (responseSize > 1024 * 1024) { // 1MB
      this.addResult(`Page Size: ${pageName}`, 'WARN', `${Math.round(responseSize / 1024)}KB (large)`, 'Performance');
    } else {
      this.addResult(`Page Size: ${pageName}`, 'PASS', `${Math.round(responseSize / 1024)}KB`, 'Performance');
    }
  };

  await performanceTest(this.baseUrl, 'Home Page');
  await performanceTest(`${this.baseUrl}/admin`, 'Admin Dashboard');
}

generateReport() {
  this.log('Generating deployment readiness report...', 'section');

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: this.totalTests,
      passedTests: this.passedTests,
      failedTests: this.totalTests - this.passedTests,
      successRate: Math.round((this.passedTests / this.totalTests) * 100),
      deploymentReady: this.errors.length === 0
    },
    categories: {},
    errors: this.errors,
    warnings: this.warnings,
    recommendations: []
  };

  // Group results by category
  for (const result of this.results) {
    if (!report.categories[result.category]) {
      report.categories[result.category] = {
        passed: 0,
        failed: 0,
        warned: 0,
        tests: []
      };
    }

    const category = report.categories[result.category];
    category.tests.push(result);

    if (result.status === 'PASS') category.passed++;
    else if (result.status === 'FAIL') category.failed++;
    else if (result.status === 'WARN') category.warned++;
  }

  // Generate recommendations
  if (this.errors.length > 0) {
    report.recommendations.push('🔴 CRITICAL: Fix all failed tests before deployment');
  }
  if (this.warnings.length > 5) {
    report.recommendations.push('🟡 Review and address warning items for optimal performance');
  }
  if (report.summary.successRate < 80) {
    report.recommendations.push('🔴 Success rate below 80% - extensive fixes needed');
  } else if (report.summary.successRate < 95) {
    report.recommendations.push('🟡 Good success rate but some improvements recommended');
  } else {
    report.recommendations.push('🟢 Excellent test results - ready for deployment');
  }

  return report;
}

  async runFullCheck() {
  this.log('🚀 Starting TreeBio Deployment Readiness Check', 'section');
  this.log('='.repeat(60));

  // Wait for server to be ready
  await new Promise(resolve => setTimeout(resolve, 3000));

  try {
    await this.checkFileStructure();
    await this.checkEnvironmentVariables();
    await this.checkPageAvailability();
    await this.testApiEndpoints();
    await this.checkDatabaseConnectivity();
    await this.checkSecurity();
    await this.checkPerformance();
  } catch (error) {
    this.log(`Critical error during testing: ${error.message}`, 'error');
    this.addResult('Test Suite Execution', 'FAIL', error.message, 'System');
  }

  const report = this.generateReport();

  // Display results
  console.log('\n' + '='.repeat(60));
  this.log('📊 DEPLOYMENT READINESS REPORT', 'section');
  console.log('='.repeat(60));

  console.log(`\n📈 SUMMARY:`);
  console.log(`   Total Tests: ${report.summary.totalTests}`);
  console.log(`   Passed: ${report.summary.passedTests}`);
  console.log(`   Failed: ${report.summary.failedTests}`);
  console.log(`   Success Rate: ${report.summary.successRate}%`);

  if (report.summary.deploymentReady) {
    console.log('\n🎉 DEPLOYMENT STATUS: ✅ READY FOR DEPLOYMENT!');
  } else {
    console.log('\n⚠️ DEPLOYMENT STATUS: ❌ NOT READY - Issues need fixing');
  }

  // Display by category
  console.log('\n📋 RESULTS BY CATEGORY:');
  for (const [categoryName, category] of Object.entries(report.categories)) {
    console.log(`\n   ${categoryName}:`);
    console.log(`     ✅ Passed: ${category.passed}`);
    console.log(`     ❌ Failed: ${category.failed}`);
    console.log(`     ⚠️ Warnings: ${category.warned}`);
  }

  // Display critical errors
  if (report.errors.length > 0) {
    console.log('\n🔴 CRITICAL ISSUES TO FIX:');
    report.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  }

  // Display warnings
  if (report.warnings.length > 0) {
    console.log('\n🟡 WARNINGS TO REVIEW:');
    report.warnings.slice(0, 10).forEach((warning, index) => {
      console.log(`   ${index + 1}. ${warning}`);
    });
    if (report.warnings.length > 10) {
      console.log(`   ... and ${report.warnings.length - 10} more warnings`);
    }
  }

  // Display recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  report.recommendations.forEach((rec, index) => {
    console.log(`   ${index + 1}. ${rec}`);
  });

  // Save detailed report
  try {
    fs.writeFileSync(
      path.join('d:', 'treebio-master', 'deployment-readiness-report.json'),
      JSON.stringify(report, null, 2)
    );
    console.log('\n📄 Detailed report saved to: deployment-readiness-report.json');
  } catch (error) {
    console.log(`\n⚠️ Could not save report file: ${error.message}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🏁 Deployment Readiness Check Complete');
  console.log('='.repeat(60));

  return report;
}
}

// Initialize and run the checker
const checker = new DeploymentReadinessChecker();
checker.runFullCheck().then(report => {
  process.exit(report.summary.deploymentReady ? 0 : 1);
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
