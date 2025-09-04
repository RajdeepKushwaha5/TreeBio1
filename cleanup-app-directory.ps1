# App Directory Cleanup Script
Write-Host "🧹 CLEANING UP APP DIRECTORY STRUCTURE..." -ForegroundColor Green
Write-Host ""

# Set the app directory path
$appPath = "d:\treebio-master\app"

# Test directories to remove (these are definitely safe to delete)
$testDirectories = @(
  "form-action-test",
  "responsive-test", 
  "simple-native-test",
  "simple-settings-test",
  "test-button"
)

Write-Host "📋 REMOVING TEST DIRECTORIES..." -ForegroundColor Yellow

foreach ($testDir in $testDirectories) {
  $fullPath = Join-Path $appPath $testDir
  if (Test-Path $fullPath) {
    Write-Host "   🗑️  Removing: $testDir" -ForegroundColor Red
    Remove-Item $fullPath -Recurse -Force
    Write-Host "   ✅ Deleted: $testDir" -ForegroundColor Green
  }
  else {
    Write-Host "   ⚠️  Not found: $testDir" -ForegroundColor Gray
  }
}

Write-Host ""
Write-Host "📁 CURRENT APP DIRECTORY STRUCTURE:" -ForegroundColor Cyan
Get-ChildItem $appPath | Sort-Object Name | ForEach-Object {
  if ($_.PSIsContainer) {
    Write-Host "   📂 $($_.Name)/" -ForegroundColor Blue
  }
  else {
    Write-Host "   📄 $($_.Name)" -ForegroundColor White
  }
}

Write-Host ""
Write-Host "✅ APP DIRECTORY CLEANUP COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 BENEFITS:" -ForegroundColor Cyan
Write-Host "   • Removed unnecessary test directories"
Write-Host "   • Simplified structure for easier navigation"
Write-Host "   • Reduced complexity for GitHub pushing"
Write-Host "   • Cleaner codebase for deployment"

Write-Host ""
Write-Host "🚀 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "   1. Review the cleaned structure above"
Write-Host "   2. Test your app to ensure nothing is broken"
Write-Host "   3. Commit and push to GitHub"
