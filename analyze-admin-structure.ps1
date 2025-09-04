# Further simplify admin directory
Write-Host "🔧 SIMPLIFYING ADMIN DIRECTORY STRUCTURE..." -ForegroundColor Green

$adminPath = "d:\treebio-master\app\admin"

# Check if enhanced directory only has one page
$enhancedPath = Join-Path $adminPath "enhanced"
if (Test-Path $enhancedPath) {
  $enhancedFiles = Get-ChildItem $enhancedPath
  if ($enhancedFiles.Count -eq 1 -and $enhancedFiles[0].Name -eq "page.tsx") {
    Write-Host "   📋 Enhanced directory only contains page.tsx"
    Write-Host "   💡 Consider merging with main admin or overview"
    Write-Host "   ⚠️  Manual review recommended before removal"
  }
}

# Check archive directory
$archivePath = Join-Path $adminPath "archive"
if (Test-Path $archivePath) {
  Write-Host "   📋 Archive directory exists"
  Write-Host "   💡 Review if still needed for the application"
}

Write-Host ""
Write-Host "📁 CURRENT ADMIN STRUCTURE:" -ForegroundColor Cyan
Get-ChildItem $adminPath | Sort-Object Name | ForEach-Object {
  if ($_.PSIsContainer) {
    $itemCount = (Get-ChildItem $_.FullName).Count
    Write-Host "   📂 $($_.Name)/ ($itemCount items)" -ForegroundColor Blue
  }
  else {
    Write-Host "   📄 $($_.Name)" -ForegroundColor White
  }
}

Write-Host ""
Write-Host "✅ ADMIN DIRECTORY ANALYSIS COMPLETE!" -ForegroundColor Green
