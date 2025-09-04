# PowerShell script to generate Prisma client
Write-Host "Starting Prisma client generation..." -ForegroundColor Green

# Navigate to the project directory
Set-Location -Path "D:\treebio-master"

# Check if we're in the right directory
if (Test-Path "prisma\schema.prisma") {
    Write-Host "Found Prisma schema file" -ForegroundColor Green
    
    # Run prisma generate
    Write-Host "Running npx prisma generate..." -ForegroundColor Yellow
    
    try {
        $result = npx prisma generate 2>&1
        Write-Host $result -ForegroundColor Green
        Write-Host "Prisma client generated successfully!" -ForegroundColor Green
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
else {
    Write-Host "Error: Could not find prisma/schema.prisma file" -ForegroundColor Red
}

Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
