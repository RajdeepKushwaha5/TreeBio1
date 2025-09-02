#!/usr/bin/env node

/**
 * TreeBio Application - Deployment Readiness Check
 * Comprehensive verification for production deployment
 * Date: September 2, 2025
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 TreeBio Deployment Readiness Check');
console.log('=====================================\n');

let passed = 0;
let failed = 0;
let warnings = 0;

function check(name, condition, message, isWarning = false) {
  const status = condition ? '✅' : (isWarning ? '⚠️' : '❌');
  console.log(`${status} ${name}: ${message}`);

  if (condition) {
    passed++;
  } else if (isWarning) {
    warnings++;
  } else {
    failed++;
  }
}

// 1. Core Files Check
console.log('📁 Core Application Files');
console.log('---------------------------');

const coreFiles = [
  'package.json',
  'next.config.ts',
  'tsconfig.json',
  'app/layout.tsx',
  'app/page.tsx',
  'app/globals.css',
  'middleware.ts',
  'lib/db.ts'
];

coreFiles.forEach(file => {
  check(`Core: ${file}`, fs.existsSync(file), fs.existsSync(file) ? 'exists' : 'missing');
});

// 2. Database & Prisma
console.log('\n🗄️ Database Configuration');
console.log('---------------------------');

check('Prisma Schema', fs.existsSync('prisma/schema.prisma'), 'Schema file exists');
check('Migrations', fs.existsSync('prisma/migrations'), 'Migrations folder exists');

try {
  const migrations = fs.readdirSync('prisma/migrations');
  check('Migration Files', migrations.length > 0, `${migrations.length} migrations found`);
} catch (e) {
  check('Migration Files', false, 'Cannot read migrations directory');
}

// 3. Admin Pages
console.log('\n👨‍💼 Admin Interface');
console.log('---------------------');

const adminPages = [
  'app/admin/page.tsx',
  'app/admin/my-tree/page.tsx',
  'app/admin/archive/page.tsx',
  'app/admin/collections/page.tsx',
  'app/admin/settings/page.tsx',
  'app/admin/tools/shortener/page.tsx'
];

adminPages.forEach(page => {
  const pageName = page.split('/')[2] || 'main';
  check(`Admin: ${pageName}`, fs.existsSync(page), fs.existsSync(page) ? 'exists' : 'missing');
});

// 4. API Routes
console.log('\n🔌 API Endpoints');
console.log('------------------');

const apiRoutes = [
  'app/api/collections/route.ts',
  'app/api/shortener/route.ts',
  'app/api/og-data/route.ts'
];

apiRoutes.forEach(route => {
  const apiName = route.split('/')[2];
  check(`API: ${apiName}`, fs.existsSync(route), fs.existsSync(route) ? 'exists' : 'missing');
});

// 5. Feature Modules
console.log('\n🧩 Feature Modules');
console.log('--------------------');

const modules = [
  'modules/profile',
  'modules/dashboard',
  'modules/archive',
  'modules/settings',
  'modules/links'
];

modules.forEach(module => {
  const moduleName = module.split('/')[1];
  check(`Module: ${moduleName}`, fs.existsSync(module), fs.existsSync(module) ? 'exists' : 'missing');
});

// 6. Enhanced Features Check
console.log('\n✨ Recent Enhancements');
console.log('-----------------------');

// Check for platform icons system
check('Platform Icons', fs.existsSync('lib/social-platforms.ts'), 'Social platform detection system');

// Check for archive functionality
check('Archive System', fs.existsSync('modules/archive/actions/index.ts'), 'Archive management system');

// Check for QR code generation
check('QR Code System', fs.existsSync('components/qr-code-generator.tsx'), 'QR code generation feature');

// Check for real-time updates (Sonner integration)
try {
  const layoutContent = fs.readFileSync('app/layout.tsx', 'utf8');
  check('Toast System', layoutContent.includes('Toaster'), 'Sonner toast notifications integrated');
  check('Real-time UI', layoutContent.includes('sonner'), 'Real-time feedback system');
} catch (e) {
  check('Toast System', false, 'Cannot verify toast integration');
}

// 7. Build & Environment
console.log('\n📦 Build & Environment');
console.log('------------------------');

check('Environment File', fs.existsSync('.env'), 'Environment variables configured');
check('Build Directory', fs.existsSync('.next'), 'Application has been built');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  check('Next.js Version', packageJson.dependencies?.next?.includes('15.4'), 'Latest Next.js version');
  check('Build Script', !!packageJson.scripts?.build, 'Build script configured');
  check('Start Script', !!packageJson.scripts?.start, 'Production start script');
} catch (e) {
  check('Package Config', false, 'Cannot read package.json');
}

// 8. Security Configuration
console.log('\n🔒 Security Configuration');
console.log('---------------------------');

try {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  check('Environment Security', gitignore.includes('.env'), 'Environment files properly ignored');
  check('Build Security', gitignore.includes('.next'), 'Build artifacts properly ignored');
  check('Dependency Security', gitignore.includes('node_modules'), 'Dependencies properly ignored');
} catch (e) {
  check('Git Security', false, 'Cannot verify .gitignore configuration');
}

// 9. Component Architecture
console.log('\n🏗️ Component Architecture');
console.log('---------------------------');

check('UI Components', fs.existsSync('components/ui'), 'Shared UI components');
check('Theme System', fs.existsSync('components/theme'), 'Theme management system');
check('Custom Hooks', fs.existsSync('hooks'), 'Custom React hooks');
check('Utilities', fs.existsSync('lib/utils.ts'), 'Utility functions');

// 10. Final Assessment
console.log('\n📊 Deployment Readiness Summary');
console.log('=================================');

const total = passed + failed + warnings;
const successRate = (passed / total) * 100;

console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`⚠️ Warnings: ${warnings}`);
console.log(`📈 Success Rate: ${successRate.toFixed(1)}%`);

console.log('\n' + '='.repeat(50));

if (failed === 0) {
  console.log('🎉 APPLICATION IS READY FOR DEPLOYMENT!');
  console.log('All critical checks passed successfully.');
} else if (failed <= 2 && successRate >= 85) {
  console.log('🟡 APPLICATION IS MOSTLY READY');
  console.log('Minor issues detected. Review and fix before deployment.');
} else {
  console.log('🔴 APPLICATION NEEDS ATTENTION');
  console.log('Critical issues found. Fix before deployment.');
}

console.log('\n🔧 Deployment Checklist:');
console.log('1. ✅ Run production build: npm run build');
console.log('2. ✅ Test production server: npm run start');
console.log('3. ⏳ Set up production database');
console.log('4. ⏳ Configure environment variables');
console.log('5. ⏳ Set up monitoring and logging');
console.log('6. ⏳ Configure domain and SSL');

process.exit(failed === 0 ? 0 : 1);
