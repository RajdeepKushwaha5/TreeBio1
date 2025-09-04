# TreeBio Project Cleanup Script
# This script will remove all unnecessary files and clean up the directory structure

Write-Host "🧹 Starting TreeBio Project Cleanup..." -ForegroundColor Green

# Define files and patterns to remove (keeping only essential files)
$filesToRemove = @(
  # Test files
  "add-rajjo-user.js",
  "advanced-features-test-report.js",
  "buttons-test-report.html",
  "check-db.js",
  "comprehensive-feature-test.js",
  "comprehensive-route-test.js",
  "deployment-check.js",
  "deployment-readiness-check.js",
  "enhanced-features-test.js",
  "generate-prisma.js",
  "hydration-test.js",
  "local-diagnostic.js",
  "manual-testing-helper.js",
  "netlify-readiness-test.js",
  "platform-icon-test-results.js",
  "qa-testing-basic.js",
  "qa-testing-script.js",
  "qr-code-test.js",
  "qr-monitor.js",
  "quick-db-check.js",
  "quick-deployment-test.js",
  "quick-route-test.js",
  "shortener-status.js",
  "simple-qr-test.js",
  "temp-auth-bypass.js",
  "test-*.js",
  "theme-customizer-test.js",
  "validate-database-schema.js",
  "validate-redirects.js",
  "vercel-deployment-readiness.js",
    
  # Documentation files (keeping only essential ones)
  "ADVANCED-FEATURES-COMPLETE-REPORT.md",
  "COMPLETE-VERCEL-DEPLOYMENT-GUIDE.md",
  "COMPREHENSIVE-ERROR-ANALYSIS-REPORT.md",
  "COMPREHENSIVE-QA-REPORT.md",
  "CONTENT-EDITOR-IMPLEMENTATION.md",
  "database-migration-guide.md",
  "DATABASE-STATUS-REPORT.md",
  "database-validation-report.md",
  "deployment-readiness-final-report.md",
  "DEPLOYMENT-ENVIRONMENT-VARIABLES.md",
  "DEPLOYMENT-RISK-ASSESSMENT.md",
  "DEPLOYMENT-SUCCESS-REPORT.md",
  "ENHANCED-FEATURES-COMPLETE-REPORT.md",
  "FINAL-IMPLEMENTATION-COMPLETE.md",
  "FINAL-QA-STATUS-REPORT.md",
  "git-setup-summary.md",
  "local-development-final-status.md",
  "local-development-status.md",
  "NETLIFY-DEPLOYMENT-ASSESSMENT.md",
  "NETLIFY-DEPLOYMENT-FINAL-ASSESSMENT.md",
  "PROFESSIONAL-REALTIME-COMPLETE.md",
  "QR-CODE-FIX-REPORT.md",
  "QR-Code-Monitoring-Report.md",
  "QR-MODAL-RESPONSIVE-FIX-REPORT.md",
  "QR-MODAL-SYSTEMATIC-FIX-REPORT.md",
  "QUALITY-SCORE-100-ACHIEVEMENT-REPORT.md",
  "QUALITY-SCORE-ANALYSIS.md",
  "REALTIME-IMPLEMENTATION-GUIDE.md",
  "RESPONSIVE-DESIGN-REPORT.md",
  "RESPONSIVE-MODAL-STATUS-FINAL.md",
  "SHARE-FEATURES-COMPLETE-REPORT.md",
  "TEMPLATE-SELECTION-RESPONSIVE-FIX-COMPLETE.md",
  "TEMPLATE-SYSTEM-DOCUMENTATION.md",
  "THEME-CUSTOMIZER-FIX-COMPLETE.md",
  "URL-SHORTENER-SUCCESS-REPORT.md",
  "vercel-build-troubleshooting.md",
  "vercel-cli-instructions.md",
  "VERCEL-DEPLOYMENT-READINESS-REPORT.md",
  "VERCEL-DEPLOYMENT-TROUBLESHOOTING.md",
  "VERCEL_ENV_VARS.md",
    
  # Log files
  "build-output-*.log",
  "database-build-test.log",
    
  # Build/runtime files
  ".next",
  "node_modules",
  "tsconfig.tsbuildinfo",
    
  # Batch/shell scripts
  "install-realtime.bat",
  "install-realtime.sh",
  "generate-prisma.ps1",
  "run-prisma-generate.bat",
    
  # HTML test files
  "responsive-test.html",
    
  # Temporary environment files
  ".env.local",
  ".env.production.template"
)

Write-Host "📂 Removing unnecessary files..." -ForegroundColor Yellow

$removedCount = 0
foreach ($file in $filesToRemove) {
  if ($file -like "*-*.log" -or $file -like "test-*.js") {
    # Handle wildcard patterns
    $files = Get-ChildItem -Path $file -ErrorAction SilentlyContinue
    foreach ($f in $files) {
      if (Test-Path $f.FullName) {
        Remove-Item $f.FullName -Force
        Write-Host "   ❌ Removed: $($f.Name)" -ForegroundColor Red
        $removedCount++
      }
    }
  }
  else {
    if (Test-Path $file) {
      Remove-Item $file -Recurse -Force
      Write-Host "   ❌ Removed: $file" -ForegroundColor Red
      $removedCount++
    }
  }
}

Write-Host "🗂️ Creating organized directory structure..." -ForegroundColor Green

# Ensure essential directories exist
$essentialDirs = @("docs", "scripts")
foreach ($dir in $essentialDirs) {
  if (!(Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "   ✅ Created: $dir/" -ForegroundColor Green
  }
}

# Move README_NEW.md to docs if it exists
if (Test-Path "README_NEW.md") {
  Move-Item "README_NEW.md" "docs/" -Force
  Write-Host "   📁 Moved: README_NEW.md -> docs/" -ForegroundColor Blue
}

Write-Host "`n✨ Cleanup Complete!" -ForegroundColor Green
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   • Removed $removedCount unnecessary files" -ForegroundColor White
Write-Host "   • Organized directory structure" -ForegroundColor White
Write-Host "   • Project is now clean and ready for GitHub" -ForegroundColor White

Write-Host "`n🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "1. git add ." -ForegroundColor White
Write-Host "2. git commit -m 'Clean up project structure'" -ForegroundColor White
Write-Host "3. git push origin main" -ForegroundColor White
