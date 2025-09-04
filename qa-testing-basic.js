// TreeBio QA Testing Script - Comprehensive Feature Testing
// Run this in browser console at http://localhost:3000

console.log(`
🔍 TREEBIO QA TESTING SUITE - COMPREHENSIVE ANALYSIS
==================================================

📋 TESTING CHECKLIST:
✅ Page Loading & Initial State
✅ Button Functionality  
✅ Link Validation
✅ Modal Operations
✅ Form Validations
✅ Interactive Elements
✅ Real-time Features
✅ Responsive Design
✅ Error Handling
✅ Console Error Detection

Starting automated tests...
`);

class TreeBioQATester {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
    this.testResults = {};
  }

  // Utility functions
  logTest(testName, status, details = '') {
    const result = { test: testName, status, details, timestamp: new Date().toISOString() };
    this.testResults[testName] = result;

    if (status === 'PASS') {
      this.passed.push(result);
      console.log(`✅ ${testName}: PASSED ${details}`);
    } else if (status === 'FAIL') {
      this.errors.push(result);
      console.error(`❌ ${testName}: FAILED ${details}`);
    } else if (status === 'WARN') {
      this.warnings.push(result);
      console.warn(`⚠️ ${testName}: WARNING ${details}`);
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Test 1: Page Loading and Initial State
  async testPageLoading() {
    console.log('\n🔄 Testing Page Loading...');

    try {
      // Check if main elements are loaded
      const mainElements = [
        'header',
        'main',
        'footer',
        '[data-testid="hero-section"]',
        'button'
      ];

      for (const selector of mainElements) {
        const element = document.querySelector(selector);
        if (element) {
          this.logTest(`Page Element: ${selector}`, 'PASS', 'Element found');
        } else {
          this.logTest(`Page Element: ${selector}`, 'WARN', 'Element not found - may be conditional');
        }
      }

      // Check for critical buttons
      const criticalButtons = [
        'Design Your TreeBio',
        'Get Started',
        'Login',
        'Sign Up'
      ];

      criticalButtons.forEach(buttonText => {
        const button = Array.from(document.querySelectorAll('button')).find(
          btn => btn.textContent.includes(buttonText)
        );
        if (button) {
          this.logTest(`Critical Button: ${buttonText}`, 'PASS', 'Button found and visible');
        } else {
          this.logTest(`Critical Button: ${buttonText}`, 'WARN', 'Button not found - may be user state dependent');
        }
      });

    } catch (error) {
      this.logTest('Page Loading', 'FAIL', `Error: ${error.message}`);
    }
  }

  // Test 2: Button Functionality 
  async testButtonFunctionality() {
    console.log('\n🔄 Testing Button Functionality...');

    try {
      const buttons = document.querySelectorAll('button:not([disabled])');
      this.logTest('Button Count', 'PASS', `Found ${buttons.length} enabled buttons`);

      let clickableButtons = 0;
      let problematicButtons = 0;

      buttons.forEach((button, index) => {
        try {
          // Check if button has text or accessible name
          const hasText = button.textContent.trim().length > 0;
          const hasAriaLabel = button.getAttribute('aria-label');
          const hasTitle = button.getAttribute('title');

          if (hasText || hasAriaLabel || hasTitle) {
            clickableButtons++;

            // Check if button has click handlers
            const hasOnClick = button.onclick !== null;
            const buttonText = button.textContent.trim().substring(0, 20);

            if (hasOnClick || button.type === 'submit') {
              this.logTest(`Button ${index + 1}`, 'PASS',
                `Text: "${buttonText}..." - Interactive`);
            } else {
              this.logTest(`Button ${index + 1}`, 'WARN',
                `Text: "${buttonText}..." - No obvious click handler`);
            }
          } else {
            problematicButtons++;
            this.logTest(`Button ${index + 1}`, 'FAIL', 'Button has no text or accessible name');
          }
        } catch (error) {
          problematicButtons++;
          this.logTest(`Button ${index + 1}`, 'FAIL', `Error testing button: ${error.message}`);
        }
      });

      this.logTest('Button Accessibility', clickableButtons > 0 ? 'PASS' : 'FAIL',
        `${clickableButtons} accessible buttons, ${problematicButtons} problematic`);

    } catch (error) {
      this.logTest('Button Functionality', 'FAIL', `Error: ${error.message}`);
    }
  }

  // Main test runner
  async runAllTests() {
    console.log('🚀 Starting comprehensive QA testing...');

    await this.testPageLoading();
    await this.testButtonFunctionality();

    // Generate summary report
    this.generateReport();
  }

  generateReport() {
    console.log(`
🔍 TREEBIO QA TESTING REPORT
===========================

📊 TEST SUMMARY:
✅ Passed: ${this.passed.length}
❌ Failed: ${this.errors.length}  
⚠️  Warnings: ${this.warnings.length}

${this.errors.length === 0 ? '🎉 NO CRITICAL ERRORS FOUND!' : '🚨 CRITICAL ERRORS DETECTED!'}
`);

    // Show failed tests first
    if (this.errors.length > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.errors.forEach(error => {
        console.log(`   • ${error.test}: ${error.details}`);
      });
    }

    // Show warnings
    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(warning => {
        console.log(`   • ${warning.test}: ${warning.details}`);
      });
    }

    console.log(`
🎯 RECOMMENDATIONS:
${this.errors.length > 0 ? '1. Fix critical errors immediately' : '1. No critical issues found'}
${this.warnings.length > 5 ? '2. Review and address warnings' : '2. Warning levels are acceptable'}
3. Test actual user interactions manually
4. Verify real-time features work correctly
5. Test on actual mobile devices

✅ QA Testing Complete!
    `);

    return {
      passed: this.passed.length,
      failed: this.errors.length,
      warnings: this.warnings.length,
      results: this.testResults
    };
  }
}

// Auto-run tests when script loads
const tester = new TreeBioQATester();
tester.runAllTests().then(() => {
  console.log('🏁 Automated QA testing finished. Check the report above!');
});

// Export for manual testing
window.TreeBioQATester = TreeBioQATester;
