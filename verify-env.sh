#!/bin/bash
# Vercel Environment Variable Verification Script

echo "=== VERCEL ENVIRONMENT VERIFICATION ==="
echo "Timestamp: $(date)"
echo "Node Environment: $NODE_ENV" 
echo "Vercel Environment: $VERCEL_ENV"
echo ""

echo "=== DATABASE CONFIGURATION ==="
if [ -n "$DATABASE_URL" ]; then
    echo "✅ DATABASE_URL: SET (length: ${#DATABASE_URL})"
    echo "   Preview: ${DATABASE_URL:0:50}..."
else
    echo "❌ DATABASE_URL: NOT SET"
fi

echo ""
echo "=== AUTHENTICATION CONFIGURATION ==="
if [ -n "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" ]; then
    echo "✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: SET"
else
    echo "❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: NOT SET"
fi

if [ -n "$CLERK_SECRET_KEY" ]; then
    echo "✅ CLERK_SECRET_KEY: SET"
else
    echo "❌ CLERK_SECRET_KEY: NOT SET"
fi

echo ""
echo "=== PUSHER CONFIGURATION ==="
if [ -n "$NEXT_PUBLIC_PUSHER_KEY" ]; then
    echo "✅ PUSHER CONFIGURATION: COMPLETE"
else
    echo "⚠️  PUSHER CONFIGURATION: NOT SET (optional)"
fi

echo ""
echo "=== ENVIRONMENT SUMMARY ==="
env_count=$(env | wc -l)
echo "Total environment variables: $env_count"

# Check for any database-related variables
echo ""
echo "=== DATABASE-RELATED VARIABLES ==="
env | grep -i -E "(database|postgres|neon|db)" || echo "None found"

echo ""
echo "=== BUILD PROCEEDING ==="
