# Essential Files Preparation for TreeBio1
# This script ensures only necessary files are staged for commit

Write-Host "📋 Preparing essential files for TreeBio1 commit..." -ForegroundColor Green

# Step 1: Clean up unnecessary files first
Write-Host "`n🧹 Cleaning unnecessary files..." -ForegroundColor Yellow

# Remove temporary and test files
$filesToRemove = @(
    "test-*.js",
    "*-test.js", 
    "*.log",
    "build-output*.log",
    "*-REPORT.md",
    "*-STATUS.md",
    "*-GUIDE.md",
    "quick-*.js",
    "validate-*.js",
    "check-*.js",
    "temp-*.js",
    "hydration-test.js",
    "netlify-readiness-test.js",
    "*.tsbuildinfo"
)

foreach ($pattern in $filesToRemove) {
    $files = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        if (Test-Path $file) {
            Remove-Item $file -Force
            Write-Host "   ❌ Removed: $($file.Name)" -ForegroundColor Red
        }
    }
}

# Step 2: Verify essential directories exist
Write-Host "`n📁 Verifying essential directories..." -ForegroundColor Cyan

$essentialDirs = @(
    "app",
    "components", 
    "lib",
    "prisma",
    "public",
    "styles"
)

foreach ($dir in $essentialDirs) {
    if (Test-Path $dir) {
        Write-Host "   ✅ $dir/ directory exists" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  $dir/ directory missing" -ForegroundColor Yellow
    }
}

# Step 3: List app directory structure to verify organization
Write-Host "`n📂 App directory structure:" -ForegroundColor Cyan
if (Test-Path "app") {
    Get-ChildItem -Path "app" -Directory | ForEach-Object {
        Write-Host "   📁 app/$($_.Name)/" -ForegroundColor White
        
        # Show subdirectories for important sections
        if ($_.Name -eq "admin" -or $_.Name -eq "api") {
            Get-ChildItem -Path $_.FullName -Directory | ForEach-Object {
                Write-Host "     📁 app/$($_.Parent.Name)/$($_.Name)/" -ForegroundColor Gray
            }
        }
    }
    
    # Show important files in app root
    Get-ChildItem -Path "app" -File | ForEach-Object {
        Write-Host "   📄 app/$($_.Name)" -ForegroundColor White
    }
}

# Step 4: Verify essential files exist
Write-Host "`n📄 Verifying essential files..." -ForegroundColor Cyan

$essentialFiles = @(
    "package.json",
    "next.config.ts",
    "tsconfig.json", 
    "tailwind.config.js",
    "middleware.ts",
    "README.md",
    ".gitignore",
    "prisma/schema.prisma"
)

foreach ($file in $essentialFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file missing" -ForegroundColor Red
    }
}

Write-Host "`n✨ File preparation completed!" -ForegroundColor Green
Write-Host "📊 Ready to commit to TreeBio1 with clean, organized structure" -ForegroundColor Cyan
