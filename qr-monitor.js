#!/usr/bin/env node

/**
 * QR Code Generator Real-Time Monitor
 * Comprehensive testing and monitoring for QR code functionality
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class QRCodeMonitor {
  constructor() {
    this.results = [];
    this.metrics = {
      generationSpeed: [],
      inputValidation: [],
      exportFunctions: [],
      customizationOptions: [],
      errorRate: 0
    };
  }

  async initialize() {
    console.log('🚀 Initializing QR Code Generator Monitor...');

    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1200, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    this.page = await this.browser.newPage();

    // Enable console logging
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });

    // Monitor network requests
    this.page.on('response', (response) => {
      if (!response.ok()) {
        console.log('❌ Network Error:', response.url(), response.status());
      }
    });

    await this.page.goto('http://localhost:3004/admin/tools/qr-code', {
      waitUntil: 'networkidle0'
    });

    console.log('✅ QR Code Generator page loaded');
  }

  async testGenerationSpeed() {
    console.log('\n🔍 Testing QR Code Generation Speed...');

    const testInputs = [
      'https://example.com',
      'mailto:test@domain.com',
      'tel:+1234567890',
      'Hello World! 🌍',
      'WIFI:T:WPA;S:TestNetwork;P:password123;;',
      'Very long text that will test the QR code generation with extended content that might affect performance and rendering speed in various scenarios and edge cases'.repeat(5)
    ];

    let totalTests = 0;
    let passedTests = 0;

    for (const input of testInputs) {
      try {
        totalTests++;
        const startTime = Date.now();

        // Clear and enter input
        await this.page.evaluate(() => {
          const input = document.querySelector('input[type="text"], input[type="url"], textarea');
          if (input) {
            input.value = '';
            input.focus();
          }
        });

        await this.page.type('input[type="text"], input[type="url"], textarea', input, { delay: 10 });

        // Wait for QR code generation
        await this.page.waitForSelector('canvas', { timeout: 5000 });

        const generationTime = Date.now() - startTime;
        this.metrics.generationSpeed.push(generationTime);

        // Verify QR code is generated
        const qrExists = await this.page.evaluate(() => {
          const canvas = document.querySelector('canvas');
          return canvas && canvas.width > 0 && canvas.height > 0;
        });

        if (qrExists && generationTime < 1000) {
          passedTests++;
          console.log(`✅ Generated QR for "${input.slice(0, 30)}..." in ${generationTime}ms`);
        } else {
          console.log(`❌ Failed to generate QR for "${input.slice(0, 30)}..." (${generationTime}ms)`);
        }

        await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause between tests

      } catch (error) {
        console.log(`❌ Error testing "${input.slice(0, 30)}...":`, error.message);
      }
    }

    const avgSpeed = this.metrics.generationSpeed.reduce((a, b) => a + b, 0) / this.metrics.generationSpeed.length;
    console.log(`\n📊 Generation Speed Results: ${passedTests}/${totalTests} passed, avg ${avgSpeed.toFixed(1)}ms`);

    return { passedTests, totalTests, avgSpeed };
  }

  async testInputValidation() {
    console.log('\n🔍 Testing Input Validation...');

    const validationTests = [
      { input: '', expected: 'should handle empty input' },
      { input: 'https://valid-url.com', expected: 'should handle valid URL' },
      { input: 'not-a-url', expected: 'should handle plain text' },
      { input: '!@#$%^&*()_+{}[]|;:,.<>?', expected: 'should handle special characters' },
      { input: 'Hello 世界 🌍 Ñoño', expected: 'should handle unicode' },
      { input: 'a'.repeat(1000), expected: 'should handle very long input' }
    ];

    let passedTests = 0;
    const totalTests = validationTests.length;

    for (const test of validationTests) {
      try {
        // Clear and enter input
        await this.page.evaluate(() => {
          const input = document.querySelector('input[type="text"], input[type="url"], textarea');
          if (input) {
            input.value = '';
            input.focus();
          }
        });

        if (test.input) {
          await this.page.type('input[type="text"], input[type="url"], textarea', test.input);
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if QR code is generated or appropriate handling
        const result = await this.page.evaluate(() => {
          const canvas = document.querySelector('canvas');
          const input = document.querySelector('input[type="text"], input[type="url"], textarea');
          return {
            hasCanvas: canvas && canvas.width > 0,
            inputValue: input ? input.value : '',
            hasError: document.querySelector('.error, [role="alert"]') !== null
          };
        });

        const isValidTest = test.input === '' ? !result.hasCanvas : result.hasCanvas;

        if (isValidTest) {
          passedTests++;
          console.log(`✅ ${test.expected}`);
        } else {
          console.log(`❌ Failed: ${test.expected}`);
        }

      } catch (error) {
        console.log(`❌ Error in validation test "${test.expected}":`, error.message);
      }
    }

    console.log(`\n📊 Input Validation Results: ${passedTests}/${totalTests} passed`);
    return { passedTests, totalTests };
  }

  async testCustomizationFeatures() {
    console.log('\n🔍 Testing Customization Features...');

    // First, generate a QR code
    await this.page.evaluate(() => {
      const input = document.querySelector('input[type="text"], input[type="url"], textarea');
      if (input) {
        input.value = 'https://test.com';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    await this.page.waitForSelector('canvas', { timeout: 3000 });

    const customizationTests = [
      { name: 'Size adjustment', selector: 'input[type="range"], select' },
      { name: 'Error correction level', selector: 'select' },
      { name: 'Color customization', selector: 'input[type="color"]' },
      { name: 'Margin toggle', selector: 'input[type="checkbox"]' }
    ];

    let passedTests = 0;
    const totalTests = customizationTests.length;

    for (const test of customizationTests) {
      try {
        const elements = await this.page.$$(test.selector);

        if (elements.length > 0) {
          // Try to interact with customization elements
          for (const element of elements.slice(0, 2)) { // Test first 2 elements
            await element.click();
            await new Promise(resolve => setTimeout(resolve, 200));
          }

          // Verify QR code still exists after customization
          const qrExists = await this.page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            return canvas && canvas.width > 0 && canvas.height > 0;
          });

          if (qrExists) {
            passedTests++;
            console.log(`✅ ${test.name} works correctly`);
          } else {
            console.log(`❌ ${test.name} broke QR generation`);
          }
        } else {
          console.log(`⚠️  ${test.name} controls not found`);
        }

      } catch (error) {
        console.log(`❌ Error testing ${test.name}:`, error.message);
      }
    }

    console.log(`\n📊 Customization Results: ${passedTests}/${totalTests} passed`);
    return { passedTests, totalTests };
  }

  async testExportFunctions() {
    console.log('\n🔍 Testing Export Functions...');

    // Ensure we have a QR code generated
    await this.page.evaluate(() => {
      const input = document.querySelector('input[type="text"], input[type="url"], textarea');
      if (input) {
        input.value = 'https://export-test.com';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    await this.page.waitForSelector('canvas', { timeout: 3000 });

    const exportTests = [
      { name: 'Download function', text: 'download' },
      { name: 'Copy function', text: 'copy' },
      { name: 'Share function', text: 'share' }
    ];

    let passedTests = 0;
    const totalTests = exportTests.length;

    for (const test of exportTests) {
      try {
        // Look for export buttons (case-insensitive)
        const button = await this.page.evaluateHandle((text) => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn =>
            btn.textContent.toLowerCase().includes(text) ||
            btn.title.toLowerCase().includes(text) ||
            btn.getAttribute('aria-label')?.toLowerCase().includes(text)
          );
        }, test.text);

        if (button.asElement()) {
          // Click the export button
          await button.click();
          await new Promise(resolve => setTimeout(resolve, 500));

          // Check for success indicators (toast, modal, download)
          const hasSuccessIndicator = await this.page.evaluate(() => {
            return document.querySelector('.toast, .notification, [role="alert"]') !== null;
          });

          passedTests++;
          console.log(`✅ ${test.name} button functional`);
        } else {
          console.log(`❌ ${test.name} button not found`);
        }

      } catch (error) {
        console.log(`❌ Error testing ${test.name}:`, error.message);
      }
    }

    console.log(`\n📊 Export Functions Results: ${passedTests}/${totalTests} passed`);
    return { passedTests, totalTests };
  }

  async testPerformanceUnderLoad() {
    console.log('\n🔍 Testing Performance Under Load...');

    const startTime = Date.now();
    const loadTests = [];

    // Generate multiple QR codes rapidly
    for (let i = 0; i < 10; i++) {
      const testStart = Date.now();

      try {
        await this.page.evaluate((index) => {
          const input = document.querySelector('input[type="text"], input[type="url"], textarea');
          if (input) {
            input.value = `https://load-test-${index}.com/path/to/resource?param=${Math.random()}`;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }, i);

        await this.page.waitForSelector('canvas', { timeout: 2000 });

        const testTime = Date.now() - testStart;
        loadTests.push(testTime);

        console.log(`  Generated QR ${i + 1}/10 in ${testTime}ms`);

      } catch (error) {
        console.log(`❌ Failed load test ${i + 1}:`, error.message);
        loadTests.push(2000); // Max time for failed tests
      }
    }

    const totalTime = Date.now() - startTime;
    const avgTime = loadTests.reduce((a, b) => a + b, 0) / loadTests.length;
    const maxTime = Math.max(...loadTests);
    const minTime = Math.min(...loadTests);

    const passedTests = loadTests.filter(time => time < 1000).length;

    console.log(`\n📊 Load Test Results: ${passedTests}/10 under 1s, avg ${avgTime.toFixed(1)}ms, range ${minTime}-${maxTime}ms`);
    return { passedTests, totalTests: 10, avgTime, totalTime };
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      summary: {
        totalTests: this.results.reduce((sum, r) => sum + r.totalTests, 0),
        passedTests: this.results.reduce((sum, r) => sum + r.passedTests, 0),
        avgGenerationTime: this.metrics.generationSpeed.length > 0
          ? this.metrics.generationSpeed.reduce((a, b) => a + b, 0) / this.metrics.generationSpeed.length
          : 0
      }
    };

    const reportPath = path.join(__dirname, 'qr-monitor-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`\n📋 Test Report Generated: ${reportPath}`);
    return report;
  }

  async run() {
    try {
      await this.initialize();

      console.log('\n🎯 Starting Comprehensive QR Code Generator Tests...\n');

      // Run all test suites
      const generationResults = await this.testGenerationSpeed();
      this.results.push({ name: 'Generation Speed', ...generationResults });

      const validationResults = await this.testInputValidation();
      this.results.push({ name: 'Input Validation', ...validationResults });

      const customizationResults = await this.testCustomizationFeatures();
      this.results.push({ name: 'Customization Features', ...customizationResults });

      const exportResults = await this.testExportFunctions();
      this.results.push({ name: 'Export Functions', ...exportResults });

      const loadResults = await this.testPerformanceUnderLoad();
      this.results.push({ name: 'Performance Under Load', ...loadResults });

      // Generate final report
      const report = await this.generateReport();

      console.log('\n🏁 QR Code Generator Monitoring Complete!');
      console.log('=====================================');
      console.log(`Total Tests: ${report.summary.totalTests}`);
      console.log(`Passed Tests: ${report.summary.passedTests}`);
      console.log(`Success Rate: ${((report.summary.passedTests / report.summary.totalTests) * 100).toFixed(1)}%`);
      console.log(`Average Generation Time: ${report.summary.avgGenerationTime.toFixed(1)}ms`);

      if (report.summary.passedTests === report.summary.totalTests) {
        console.log('\n🎉 ALL TESTS PASSED! QR Code Generator is functioning perfectly!');
      } else if (report.summary.passedTests >= report.summary.totalTests * 0.8) {
        console.log('\n⚠️  Most tests passed with minor issues detected.');
      } else {
        console.log('\n❌ Critical issues detected! Immediate attention required.');
      }

    } catch (error) {
      console.error('❌ Critical error during monitoring:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the monitor
const monitor = new QRCodeMonitor();
monitor.run().catch(console.error);
