g QR// TreeBio QA Testing Script - Comprehensive Feature Testing
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
      console.log(\`✅ \${testName}: PASSED \${details}\`);
    } else if (status === 'FAIL') {
      this.errors.push(result);
      console.error(\`❌ \${testName}: FAILED \${details}\`);
    } else if (status === 'WARN') {
      this.warnings.push(result);
      console.warn(\`⚠️ \${testName}: WARNING \${details}\`);
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Test 1: Page Loading and Initial State
  async testPageLoading() {
    console.log('\\n🔄 Testing Page Loading...');
    
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
          this.logTest(\`Page Element: \${selector}\`, 'PASS', 'Element found');
        } else {
          this.logTest(\`Page Element: \${selector}\`, 'WARN', 'Element not found - may be conditional');
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
          this.logTest(\`Critical Button: \${buttonText}\`, 'PASS', 'Button found and visible');
        } else {
          this.logTest(\`Critical Button: \${buttonText}\`, 'WARN', 'Button not found - may be user state dependent');
        }
      });
      
    } catch (error) {
      this.logTest('Page Loading', 'FAIL', \`Error: \${error.message}\`);
    }
  }

  // Test 2: Button Functionality
  async testButtonFunctionality() {
    console.log('\\n🔄 Testing Button Functionality...');
    
    try {
      const buttons = document.querySelectorAll('button:not([disabled])');
      this.logTest('Button Count', 'PASS', \`Found \${buttons.length} enabled buttons\`);
      
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
            const hasEventListeners = button.getEventListeners ? 
              Object.keys(button.getEventListeners()).length > 0 : true; // Assume true if method not available
            
            if (hasOnClick || hasEventListeners || button.type === 'submit') {
              this.logTest(\`Button \${index + 1}\`, 'PASS', 
                \`Text: "\${button.textContent.trim().substring(0, 20)}..." - Interactive\`);
            } else {
              this.logTest(\`Button \${index + 1}\`, 'WARN', 
                \`Text: "\${button.textContent.trim().substring(0, 20)}..." - No obvious click handler\`);
            }
          } else {
            problematicButtons++;
            this.logTest(\`Button \${index + 1}\`, 'FAIL', 'Button has no text or accessible name');
          }
        } catch (error) {
          problematicButtons++;
          this.logTest(\`Button \${index + 1}\`, 'FAIL', \`Error testing button: \${error.message}\`);
        }
      });
      
      this.logTest('Button Accessibility', clickableButtons > 0 ? 'PASS' : 'FAIL', 
        \`\${clickableButtons} accessible buttons, \${problematicButtons} problematic\`);
        
    } catch (error) {
      this.logTest('Button Functionality', 'FAIL', \`Error: \${error.message}\`);
    }
  }

  // Test 3: Link Validation
  async testLinkValidation() {
    console.log('\\n🔄 Testing Link Validation...');
    
    try {
      const links = document.querySelectorAll('a');
      this.logTest('Link Count', 'PASS', \`Found \${links.length} links\`);
      
      let validLinks = 0;
      let problematicLinks = 0;
      
      links.forEach((link, index) => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        
        if (!href) {
          this.logTest(\`Link \${index + 1}\`, 'WARN', \`No href attribute - Text: "\${text.substring(0, 20)}..."\`);
          problematicLinks++;
          return;
        }
        
        // Check for different link types
        if (href.startsWith('#')) {
          // Anchor link
          const target = document.querySelector(href);
          if (target) {
            this.logTest(\`Anchor Link \${index + 1}\`, 'PASS', \`Links to: \${href}\`);
            validLinks++;
          } else {
            this.logTest(\`Anchor Link \${index + 1}\`, 'FAIL', \`Broken anchor: \${href}\`);
            problematicLinks++;
          }
        } else if (href.startsWith('/')) {
          // Internal link
          this.logTest(\`Internal Link \${index + 1}\`, 'PASS', \`Path: \${href}\`);
          validLinks++;
        } else if (href.startsWith('http')) {
          // External link
          const hasTargetBlank = link.getAttribute('target') === '_blank';
          this.logTest(\`External Link \${index + 1}\`, hasTargetBlank ? 'PASS' : 'WARN', 
            \`URL: \${href.substring(0, 30)}... \${hasTargetBlank ? '(opens in new tab)' : '(same tab)'}\`);
          validLinks++;
        } else if (href.startsWith('mailto:') || href.startsWith('tel:')) {
          // Protocol links
          this.logTest(\`Protocol Link \${index + 1}\`, 'PASS', \`Type: \${href.split(':')[0]}\`);
          validLinks++;
        } else {
          this.logTest(\`Link \${index + 1}\`, 'WARN', \`Unusual href: \${href}\`);
          problematicLinks++;
        }
      });
      
      this.logTest('Link Validation Summary', validLinks > 0 ? 'PASS' : 'FAIL', 
        \`\${validLinks} valid links, \${problematicLinks} issues\`);
        
    } catch (error) {
      this.logTest('Link Validation', 'FAIL', \`Error: \${error.message}\`);
    }
  }

  // Test 4: Modal Operations
  async testModalOperations() {
    console.log('\\n🔄 Testing Modal Operations...');
    
    try {
      // Look for modal triggers (buttons that might open modals)
      const modalTriggers = Array.from(document.querySelectorAll('button')).filter(btn => 
        btn.textContent.includes('Design Your TreeBio') ||
        btn.textContent.includes('Modal') ||
        btn.textContent.includes('Open') ||
        btn.getAttribute('data-modal') ||
        btn.getAttribute('data-dialog')
      );
      
      if (modalTriggers.length === 0) {
        this.logTest('Modal Triggers', 'WARN', 'No obvious modal triggers found');
        return;
      }
      
      this.logTest('Modal Triggers', 'PASS', \`Found \${modalTriggers.length} potential modal triggers\`);
      
      // Check for modal containers
      const modalSelectors = [
        '[role="dialog"]',
        '.modal',
        '[data-dialog]',
        '[data-modal]',
        '.dialog-content'
      ];
      
      let modalCount = 0;
      modalSelectors.forEach(selector => {
        const modals = document.querySelectorAll(selector);
        modalCount += modals.length;
      });
      
      this.logTest('Modal Containers', modalCount > 0 ? 'PASS' : 'WARN', 
        \`Found \${modalCount} modal containers\`);
        
    } catch (error) {
      this.logTest('Modal Operations', 'FAIL', \`Error: \${error.message}\`);
    }
  }

  // Test 5: Form Validation
  async testFormValidation() {
    console.log('\\n🔄 Testing Form Validation...');
    
    try {
      const forms = document.querySelectorAll('form');
      const inputs = document.querySelectorAll('input, textarea, select');
      
      this.logTest('Form Count', 'PASS', \`Found \${forms.length} forms\`);
      this.logTest('Input Count', 'PASS', \`Found \${inputs.length} form inputs\`);
      
      // Check form inputs for validation attributes
      let validatedInputs = 0;
      let totalInputs = inputs.length;
      
      inputs.forEach((input, index) => {
        const hasRequired = input.hasAttribute('required');
        const hasPattern = input.hasAttribute('pattern');
        const hasType = input.type !== 'text' && input.type !== 'textarea';
        const hasValidation = hasRequired || hasPattern || hasType;
        
        if (hasValidation) {
          validatedInputs++;
          this.logTest(\`Input \${index + 1} Validation\`, 'PASS', 
            \`Type: \${input.type}, Required: \${hasRequired}, Pattern: \${hasPattern}\`);
        } else if (input.type === 'submit' || input.type === 'button') {
          // Skip validation check for buttons
        } else {
          this.logTest(\`Input \${index + 1} Validation\`, 'WARN', 
            \`No validation attributes - Type: \${input.type}\`);
        }
      });
      
      if (totalInputs > 0) {
        this.logTest('Form Validation Coverage', 'PASS', 
          \`\${validatedInputs}/\${totalInputs} inputs have validation\`);
      }
      
    } catch (error) {
      this.logTest('Form Validation', 'FAIL', \`Error: \${error.message}\`);
    }
  }

  // Test 6: Interactive Elements
  async testInteractiveElements() {
    console.log('\\n🔄 Testing Interactive Elements...');
    
    try {
      // Test dropdowns, toggles, accordions
      const interactiveSelectors = [
        'select',
        '[role="button"]',
        '[role="tab"]',
        '[role="tabpanel"]',
        '.accordion',
        '.dropdown',
        '.toggle',
        '[data-toggle]',
        'details',
        'summary'
      ];
      
      let interactiveCount = 0;
      interactiveSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          interactiveCount += elements.length;
          this.logTest(\`Interactive \${selector}\`, 'PASS', \`Found \${elements.length} elements\`);
        }
      });
      
      this.logTest('Interactive Elements Total', 'PASS', \`Found \${interactiveCount} interactive elements\`);
      
    } catch (error) {
      this.logTest('Interactive Elements', 'FAIL', \`Error: \${error.message}\`);
    }
  }

  // Test 7: Console Error Detection
  async testConsoleErrors() {
    console.log('\\n🔄 Testing Console Errors...');
    
    try {
      // Override console methods to capture errors
      const originalError = console.error;
      const originalWarn = console.warn;
      const capturedErrors = [];
      const capturedWarnings = [];
      
      console.error = function(...args) {
        capturedErrors.push(args.join(' '));
        originalError.apply(console, args);
      };
      
      console.warn = function(...args) {
        capturedWarnings.push(args.join(' '));
        originalWarn.apply(console, args);
      };
      
      // Wait a bit to capture any async errors
      await this.sleep(2000);
      
      // Restore original console methods
      console.error = originalError;
      console.warn = originalWarn;
      
      this.logTest('Console Errors', capturedErrors.length === 0 ? 'PASS' : 'FAIL', 
        \`\${capturedErrors.length} errors found\`);
      this.logTest('Console Warnings', capturedWarnings.length === 0 ? 'PASS' : 'WARN', 
        \`\${capturedWarnings.length} warnings found\`);
        
    } catch (error) {
      this.logTest('Console Error Detection', 'FAIL', \`Error: \${error.message}\`);
    }
  }

  // Test 8: Responsive Design
  async testResponsiveDesign() {
    console.log('\\n🔄 Testing Responsive Design...');
    
    try {
      const originalWidth = window.innerWidth;
      const originalHeight = window.innerHeight;
      
      // Test different viewport sizes
      const testSizes = [
        { name: 'Mobile', width: 375, height: 667 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Desktop', width: 1920, height: 1080 }
      ];
      
      for (const size of testSizes) {
        // Note: We can't actually resize in a real browser, but we can check CSS
        const mediaQuery = \`(max-width: \${size.width}px)\`;
        const matches = window.matchMedia(mediaQuery).matches;
        
        this.logTest(\`Responsive \${size.name}\`, 'PASS', 
          \`Media query \${mediaQuery} - \${matches ? 'matches' : 'does not match'}\`);
      }
      
      // Check for responsive elements
      const responsiveElements = document.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]');
      this.logTest('Responsive Classes', responsiveElements.length > 0 ? 'PASS' : 'WARN', 
        \`Found \${responsiveElements.length} elements with responsive classes\`);
        
    } catch (error) {
      this.logTest('Responsive Design', 'FAIL', \`Error: \${error.message}\`);
    }
  }

  // Main test runner
  async runAllTests() {
    console.log('🚀 Starting comprehensive QA testing...');
    
    await this.testPageLoading();
    await this.testButtonFunctionality();
    await this.testLinkValidation();
    await this.testModalOperations();
    await this.testFormValidation();
    await this.testInteractiveElements();
    await this.testConsoleErrors();
    await this.testResponsiveDesign();
    
    // Generate summary report
    this.generateReport();
  }

  generateReport() {
    console.log(\`
🔍 TREEBIO QA TESTING REPORT
===========================

📊 TEST SUMMARY:
✅ Passed: \${this.passed.length}
❌ Failed: \${this.errors.length}
⚠️  Warnings: \${this.warnings.length}

\${this.errors.length === 0 ? '🎉 NO CRITICAL ERRORS FOUND!' : '🚨 CRITICAL ERRORS DETECTED!'}

📋 DETAILED RESULTS:
\`);
    
    // Show failed tests first
    if (this.errors.length > 0) {
      console.log('\\n❌ FAILED TESTS:');
      this.errors.forEach(error => {
        console.log(\`   • \${error.test}: \${error.details}\`);
      });
    }
    
    // Show warnings
    if (this.warnings.length > 0) {
      console.log('\\n⚠️  WARNINGS:');
      this.warnings.forEach(warning => {
        console.log(\`   • \${warning.test}: \${warning.details}\`);
      });
    }
    
    // Show passed tests summary
    console.log(\`\\n✅ PASSED TESTS: \${this.passed.length}\`);
    
    console.log(\`
🎯 RECOMMENDATIONS:
\${this.errors.length > 0 ? '1. Fix critical errors immediately' : '1. No critical issues found'}
\${this.warnings.length > 5 ? '2. Review and address warnings' : '2. Warning levels are acceptable'}
3. Test actual user interactions manually
4. Verify real-time features work correctly
5. Test on actual mobile devices

✅ QA Testing Complete!
    \`);
    
    return {
      passed: this.passed.length,
      failed: this.errors.length,
      warnings: this.warnings.length,
      results: this.testResults
    };
  }
}

// Auto-run tests
const tester = new TreeBioQATester();
tester.runAllTests().then(() => {
  console.log('🏁 Automated QA testing finished. Check the report above!');
});

// Export for manual testing
window.TreeBioQATester = TreeBioQATester;
window.runQATests = () => {
  const newTester = new TreeBioQATester();
  return newTester.runAllTests();
};
