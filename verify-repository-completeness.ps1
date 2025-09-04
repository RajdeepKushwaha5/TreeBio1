# TreeBio Repository Completeness Verification Script
# This script verifies that all essential files are present in the TreeBio1 repository

Write-Host "🔍 TREEBIO REPOSITORY COMPLETENESS CHECK" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

$essentialFiles = @{
    "Core Configuration" = @(
        "package.json",
        "next.config.ts",
        "tsconfig.json",
        "tailwind.config.js",
        "postcss.config.mjs",
        "eslint.config.mjs",
        "components.json",
        ".gitignore",
        "middleware.ts"
    )
    "App Structure" = @(
        "app/layout.tsx",
        "app/globals.css",
        "app/page.tsx",
        "app/not-found.tsx"
    )
    "Authentication" = @(
        "app/(auth)/layout.tsx",
        "app/(auth)/sign-in/[[...sign-in]]/page.tsx",
        "app/(auth)/sign-up/[[...sign-up]]/page.tsx"
    )
    "Admin Dashboard" = @(
        "app/admin/layout.tsx",
        "app/admin/page.tsx",
        "app/admin/overview/page.tsx",
        "app/admin/my-tree/page.tsx",
        "app/admin/settings/page.tsx",
        "app/admin/collections/page.tsx",
        "app/admin/collections/add/page.tsx"
    )
    "Tools & Features" = @(
        "app/admin/tools/shortener/page.tsx",
        "app/admin/tools/qr-code/page.tsx",
        "app/admin/tools/analytics/page.tsx"
    )
    "API Routes" = @(
        "app/api/links/route.ts",
        "app/api/profile/route.ts",
        "app/api/settings/route.ts",
        "app/api/shortener/route.ts",
        "app/api/shortener/[shortCode]/route.ts",
        "app/api/collections/route.ts",
        "app/api/og-data/route.ts"
    )
    "Database" = @(
        "prisma/schema.prisma",
        "prisma/migrations/migration_lock.toml"
    )
    "Components" = @(
        "components/ui/button.tsx",
        "components/ui/input.tsx",
        "components/ui/card.tsx",
        "components/ui/dialog.tsx",
        "components/providers.tsx",
        "components/theme-provider.tsx"
    )
    "Advanced Features" = @(
        "components/link-shortener/short-url-manager.tsx",
        "components/qr-code-generator.tsx",
        "components/enhanced-analytics.tsx",
        "components/template-selector.tsx",
        "components/theme-customizer.tsx"
    )
    "Libraries" = @(
        "lib/db.ts",
        "lib/utils.ts",
        "lib/link-shortener.ts",
        "lib/bio-templates.ts",
        "lib/theme-system.ts"
    )
    "Modules" = @(
        "modules/dashboard/components/app-sidebar.tsx",
        "modules/profile/components/treebio-profile.tsx",
        "modules/links/components/link-card.tsx",
        "modules/analytics/components/analytics-client.tsx"
    )
    "Hooks" = @(
        "hooks/use-toast.ts",
        "hooks/useRealtime.ts",
        "hooks/useTemplateManager.ts"
    )
}

$totalFiles = 0
$presentFiles = 0
$missingFiles = @()

Write-Host "`n📊 Checking essential files..." -ForegroundColor Yellow

foreach ($category in $essentialFiles.Keys) {
    Write-Host "`n📁 $category" -ForegroundColor Cyan
    
    foreach ($file in $essentialFiles[$category]) {
        $totalFiles++
        if (Test-Path $file) {
            Write-Host "   ✅ $file" -ForegroundColor Green
            $presentFiles++
        } else {
            Write-Host "   ❌ $file" -ForegroundColor Red
            $missingFiles += $file
        }
    }
}

# Check for additional important directories
Write-Host "`n📁 Directory Structure" -ForegroundColor Cyan
$importantDirs = @("app", "components", "lib", "prisma", "public", "modules", "hooks")
foreach ($dir in $importantDirs) {
    if (Test-Path $dir) {
        $fileCount = (Get-ChildItem -Path $dir -Recurse -File).Count
        Write-Host "   ✅ $dir/ ($fileCount files)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $dir/ (missing)" -ForegroundColor Red
    }
}

# Check git remote
Write-Host "`n🔗 Git Remote Configuration" -ForegroundColor Cyan
try {
    $remote = git remote -v | Select-String "origin.*fetch"
    if ($remote -like "*TreeBio1*") {
        Write-Host "   ✅ Correctly linked to TreeBio1 repository" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Remote: $remote" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Error checking git remote" -ForegroundColor Red
}

# Check recent commits
Write-Host "`n📝 Recent Commits" -ForegroundColor Cyan
try {
    $commits = git log --oneline -3
    $commits | ForEach-Object { Write-Host "   • $_" -ForegroundColor White }
} catch {
    Write-Host "   ❌ Error checking git log" -ForegroundColor Red
}

# Summary
Write-Host "`n📊 COMPLETENESS SUMMARY" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host "Total Essential Files: $totalFiles" -ForegroundColor White
Write-Host "Present Files: $presentFiles" -ForegroundColor Green
Write-Host "Missing Files: $($missingFiles.Count)" -ForegroundColor $(if ($missingFiles.Count -eq 0) { "Green" } else { "Red" })

$completeness = [math]::Round(($presentFiles / $totalFiles) * 100, 1)
Write-Host "Completeness: $completeness%" -ForegroundColor $(if ($completeness -ge 95) { "Green" } elseif ($completeness -ge 85) { "Yellow" } else { "Red" })

if ($missingFiles.Count -gt 0) {
    Write-Host "`n❌ Missing Essential Files:" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "   • $_" -ForegroundColor Red }
}

# Final Status
Write-Host "`n🎯 REPOSITORY STATUS" -ForegroundColor Yellow
if ($completeness -ge 95) {
    Write-Host "✅ EXCELLENT: Repository contains all essential files!" -ForegroundColor Green
    Write-Host "🚀 Ready for production deployment!" -ForegroundColor Green
} elseif ($completeness -ge 85) {
    Write-Host "⚠️  GOOD: Repository is mostly complete with minor gaps" -ForegroundColor Yellow
    Write-Host "🔧 Consider adding missing files for completeness" -ForegroundColor Yellow
} else {
    Write-Host "❌ INCOMPLETE: Repository is missing critical files" -ForegroundColor Red
    Write-Host "🛠️  Action required: Add missing essential files" -ForegroundColor Red
}

Write-Host "`n🔗 Repository URL: https://github.com/RajdeepKushwaha5/TreeBio1" -ForegroundColor Cyan
Write-Host "📈 Last Updated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
