# Database Migration for Production

## After deployment, run these commands locally with production DATABASE_URL:

# Generate Prisma client
npx prisma generate

# Deploy database schema to production
npx prisma db push

# Or run migrations
npx prisma migrate deploy

# Optional: Seed database with initial data
npx prisma db seed

## Alternative: Use Vercel CLI to run migrations
vercel env pull .env.production
npx prisma migrate deploy
