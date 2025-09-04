#!/bin/bash
# Vercel Build Script to ensure environment variables are available

# Run environment verification first
./verify-env.sh

echo ""
echo "🔍 Detailed environment check..."
echo "NODE_ENV: $NODE_ENV"
echo "VERCEL: $VERCEL" 
echo "VERCEL_ENV: $VERCEL_ENV"

if [ -z "$DATABASE_URL" ]; then
    echo "❌ CRITICAL ERROR: DATABASE_URL is not set!"
    echo ""
    echo "🔧 TO FIX THIS:"
    echo "1. Go to: https://vercel.com/dashboard"
    echo "2. Select your project"  
    echo "3. Settings → Environment Variables"
    echo "4. Add: DATABASE_URL = postgresql://neondb_owner:npg_hq2jkuxTiWJ7@ep-billowing-bush-adw0rphi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    echo "5. Redeploy"
    echo ""
    exit 1
fi

echo "✅ DATABASE_URL is set (length: ${#DATABASE_URL})"
echo "🔄 Generating Prisma client (non-interactive)..."
npx prisma generate --no-hints

if [ $? -ne 0 ]; then
    echo "❌ Prisma generation failed!"
    exit 1
fi

echo "🏗️ Building Next.js application..."
npm run build
