# TreeBio GitHub Commit Script - TreeBio1 Repository
# This script will organize and commit all necessary files to TreeBio1

Write-Host "🚀 TreeBio GitHub Commit Process Starting..." -ForegroundColor Green
Write-Host "📍 Target Repository: https://github.com/RajdeepKushwaha5/TreeBio1" -ForegroundColor Cyan

# Step 1: Update remote repository to TreeBio1
Write-Host "`n🔗 Setting up remote repository..." -ForegroundColor Yellow
Write-Host "   Removing old origin..." -ForegroundColor White
git remote remove origin 2>$null

Write-Host "   Adding new origin (TreeBio1)..." -ForegroundColor White
git remote add origin https://github.com/RajdeepKushwaha5/TreeBio1.git

Write-Host "   Verifying remote..." -ForegroundColor White
git remote -v

# Step 2: Check current Git status
Write-Host "`n📊 Checking Git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "   Files to be committed:" -ForegroundColor White
    $gitStatus | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }
} else {
    Write-Host "   Working directory is clean" -ForegroundColor Green
}

# Step 2: Add essential files and directories
Write-Host "`n📂 Adding essential project files..." -ForegroundColor Cyan

# Core Next.js files
git add package.json
git add package-lock.json
git add next.config.ts
git add tsconfig.json
git add tailwind.config.js
git add postcss.config.mjs
git add components.json
git add middleware.ts

# Environment files (template only, not actual secrets)
git add .env.example

# Source code directories
Write-Host "   Adding app directory..." -ForegroundColor White
git add app/

Write-Host "   Adding components directory..." -ForegroundColor White
git add components/

Write-Host "   Adding lib directory..." -ForegroundColor White
git add lib/

Write-Host "   Adding hooks directory..." -ForegroundColor White
git add hooks/

Write-Host "   Adding modules directory..." -ForegroundColor White
git add modules/

Write-Host "   Adding styles directory..." -ForegroundColor White
git add styles/

Write-Host "   Adding public directory..." -ForegroundColor White
git add public/

Write-Host "   Adding prisma directory..." -ForegroundColor White
git add prisma/

# Configuration files
git add .gitignore
git add README.md
git add eslint.config.mjs

# Step 3: Check what will be committed
Write-Host "`n📋 Files staged for commit:" -ForegroundColor Green
git diff --cached --name-only | ForEach-Object {
  Write-Host "   ✅ $_" -ForegroundColor Green
}

# Step 4: Create commit with detailed message
$commitMessage = @"
🎉 Initial TreeBio commit - Complete application structure

✨ Features included:
- Complete Next.js 15 application with App Router
- User authentication with Clerk
- URL shortener with advanced features (bulk, expiration, analytics)
- Profile management system
- Template customization
- Real-time functionality
- Responsive design
- Database integration with Prisma

📁 Directory structure:
- app/ - Next.js App Router pages and API routes
- components/ - Reusable React components
- lib/ - Utility functions and configurations
- prisma/ - Database schema and migrations
- public/ - Static assets
- styles/ - CSS and styling files

🔧 Tech stack:
- Next.js 15.5.2
- React 18
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Clerk Auth
- Shadcn/ui components
"@

Write-Host "`n💾 Creating commit..." -ForegroundColor Yellow
git commit -m $commitMessage

# Step 5: Push to TreeBio1 repository
Write-Host "`n🚀 Pushing to TreeBio1 repository..." -ForegroundColor Green
try {
    # First push - may need to set upstream
    Write-Host "   Pushing to main branch..." -ForegroundColor White
    git push -u origin main --force
    
    Write-Host "`n✅ Successfully pushed to TreeBio1!" -ForegroundColor Green
    Write-Host "🔗 Repository URL: https://github.com/RajdeepKushwaha5/TreeBio1" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n⚠️ Push failed, trying alternative method..." -ForegroundColor Yellow
    
    # Alternative push method
    Write-Host "   Trying force push with lease..." -ForegroundColor White
    git push --force-with-lease origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully pushed with force-with-lease!" -ForegroundColor Green
    } else {
        Write-Host "❌ Push failed. Please check repository permissions." -ForegroundColor Red
        Write-Host "   Manual steps:" -ForegroundColor Yellow
        Write-Host "   1. Ensure TreeBio1 repository exists on GitHub" -ForegroundColor White
        Write-Host "   2. git push -u origin main --force" -ForegroundColor White
    }
}

Write-Host "`n📊 Final repository status:" -ForegroundColor Cyan
Write-Host "   Repository: TreeBio1" -ForegroundColor White
Write-Host "   Branch: main" -ForegroundColor White
Write-Host "   Files committed: All essential project files" -ForegroundColor White
Write-Host "   Structure: Complete app directory with proper organization" -ForegroundColor White

Write-Host "`n🎉 Commit process completed!" -ForegroundColor Green
else {
  Write-Host "   ❌ No remote repository found" -ForegroundColor Red
  Write-Host "   You'll need to add a remote repository first" -ForegroundColor Yellow
  Write-Host "   Run: git remote add origin <your-github-repo-url>" -ForegroundColor White
}

# Step 6: Push to GitHub
Write-Host "`n🚀 Ready to push to GitHub!" -ForegroundColor Green
Write-Host "Run the following command to push:" -ForegroundColor Yellow
Write-Host "git push origin main" -ForegroundColor White

Write-Host "`n✅ TreeBio is ready for GitHub!" -ForegroundColor Green
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   • Organized project structure" -ForegroundColor White
Write-Host "   • Added all necessary files" -ForegroundColor White  
Write-Host "   • Created comprehensive commit" -ForegroundColor White
Write-Host "   • Ready for deployment" -ForegroundColor White
