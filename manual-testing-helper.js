// Manual Testing Script for TreeBio
// Copy and paste this into browser console at http://localhost:3001

console.log('🔍 TreeBio Manual Testing Helper - Starting...');

// Create testing helper functions
window.TreeBioTester = {
  // Test Design Modal Opening
  testDesignModal: function () {
    console.log('🔄 Testing Design Modal...');
    const designButton = Array.from(document.querySelectorAll('button'))
      .find(btn => btn.textContent.includes('Design Your TreeBio') || btn.textContent.includes('Design'));

    if (designButton) {
      console.log('✅ Found Design Button:', designButton.textContent);
      designButton.click();

      setTimeout(() => {
        const modal = document.querySelector('[role="dialog"]') || document.querySelector('.modal');
        if (modal) {
          console.log('✅ Modal opened successfully');

          // Test tabs
          const tabs = document.querySelectorAll('[role="tab"]') || document.querySelectorAll('[data-tab]');
          console.log(`✅ Found ${tabs.length} tabs in modal`);

          return true;
        } else {
          console.log('❌ Modal did not open');
          return false;
        }
      }, 1000);
    } else {
      console.log('❌ Design button not found');
      return false;
    }
  },

  // Test all buttons on page
  testAllButtons: function () {
    console.log('🔄 Testing All Buttons...');
    const buttons = document.querySelectorAll('button');
    console.log(`Found ${buttons.length} buttons`);

    buttons.forEach((button, index) => {
      const text = button.textContent.trim();
      const disabled = button.disabled;
      const hasClick = button.onclick !== null;

      console.log(`Button ${index + 1}: "${text.substring(0, 30)}..." - ${disabled ? 'DISABLED' : 'ENABLED'} - ${hasClick ? 'HAS CLICK' : 'NO CLICK'}`);
    });

    return buttons.length;
  },

  // Test all links on page
  testAllLinks: function () {
    console.log('🔄 Testing All Links...');
    const links = document.querySelectorAll('a');
    console.log(`Found ${links.length} links`);

    links.forEach((link, index) => {
      const href = link.getAttribute('href');
      const text = link.textContent.trim();
      const target = link.getAttribute('target');

      console.log(`Link ${index + 1}: "${text.substring(0, 30)}..." - HREF: "${href}" - ${target === '_blank' ? 'NEW TAB' : 'SAME TAB'}`);
    });

    return links.length;
  },

  // Test form inputs
  testFormInputs: function () {
    console.log('🔄 Testing Form Inputs...');
    const inputs = document.querySelectorAll('input, textarea, select');
    console.log(`Found ${inputs.length} form inputs`);

    inputs.forEach((input, index) => {
      const type = input.type || input.tagName.toLowerCase();
      const required = input.required;
      const placeholder = input.placeholder;

      console.log(`Input ${index + 1}: TYPE "${type}" - ${required ? 'REQUIRED' : 'OPTIONAL'} - PLACEHOLDER: "${placeholder}"`);
    });

    return inputs.length;
  },

  // Test responsive design
  testResponsive: function () {
    console.log('🔄 Testing Responsive Design...');
    const originalWidth = window.innerWidth;

    // Check current viewport
    if (originalWidth < 768) {
      console.log('📱 Current view: MOBILE');
    } else if (originalWidth < 1024) {
      console.log('📱 Current view: TABLET');
    } else {
      console.log('📱 Current view: DESKTOP');
    }

    // Check for responsive classes
    const responsiveElements = document.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]');
    console.log(`✅ Found ${responsiveElements.length} elements with responsive classes`);

    return originalWidth;
  },

  // Check for console errors
  checkConsoleErrors: function () {
    console.log('🔄 Monitoring Console Errors...');

    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;

    let errorCount = 0;
    let warnCount = 0;

    console.error = function (...args) {
      errorCount++;
      originalError.apply(console, ['❌ ERROR DETECTED:', ...args]);
    };

    console.warn = function (...args) {
      warnCount++;
      originalWarn.apply(console, ['⚠️ WARNING DETECTED:', ...args]);
    };

    setTimeout(() => {
      console.log(`📊 Error monitoring results: ${errorCount} errors, ${warnCount} warnings`);
      // Restore original methods
      console.error = originalError;
      console.warn = originalWarn;
    }, 5000);

    return { errorCount, warnCount };
  },

  // Run all tests
  runAllTests: function () {
    console.log(`
🚀 TREEBIO MANUAL TESTING SUITE
==============================
    `);

    const results = {};

    results.buttons = this.testAllButtons();
    results.links = this.testAllLinks();
    results.inputs = this.testFormInputs();
    results.viewport = this.testResponsive();
    results.errors = this.checkConsoleErrors();

    console.log(`
📊 TESTING SUMMARY:
==================
✅ Buttons found: ${results.buttons}
✅ Links found: ${results.links}
✅ Form inputs: ${results.inputs}
✅ Viewport width: ${results.viewport}px

🔍 Next steps:
1. Test the Design Modal: TreeBioTester.testDesignModal()
2. Check for errors in console
3. Test actual user interactions manually
4. Verify on different devices
    `);

    return results;
  }
};

// Auto-run basic tests
TreeBioTester.runAllTests();

console.log(`
🎯 MANUAL TESTING COMMANDS:
===========================
TreeBioTester.testDesignModal() - Test modal opening
TreeBioTester.testAllButtons() - Check all buttons  
TreeBioTester.testAllLinks() - Check all links
TreeBioTester.testFormInputs() - Check form elements
TreeBioTester.testResponsive() - Check responsive design
TreeBioTester.checkConsoleErrors() - Monitor for errors
TreeBioTester.runAllTests() - Run all tests again

✅ Copy any of these commands to run specific tests!
`);
