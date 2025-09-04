# Database Setup Guide for TreeBio1

## 🔗 Setting up Your Database Connection

### 1. Get Your Database URL

#### Option A: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy your connection string (looks like):
   ```
   postgresql://username:password@ep-xxx.region.neon.tech/neondb?sslmode=require
   ```

#### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

#### Option C: Railway
1. Go to [railway.app](https://railway.app)
2. Create a PostgreSQL database
3. Copy the connection URL

### 2. Add Environment Variables to Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variables:

**Required:**
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_SECRET_KEY`: Your Clerk secret key

**Optional (if using Clerk):**
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: `/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: `/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`: `/admin`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: `/admin`

### 3. Deploy Database Schema

After adding environment variables to Vercel, you have two options:

#### Option A: Auto-migration (Recommended)
The app will automatically create tables when first accessed.

#### Option B: Manual migration
```bash
# If you want to run migrations manually
npx prisma migrate deploy
```

### 4. Verify Setup

After deployment, visit your Vercel URL. If you see the app loading without database errors, you're all set!

## 🚨 Troubleshooting

**Error: "Environment variable not found: DATABASE_URL"**
- Make sure you've added DATABASE_URL to Vercel environment variables
- Redeploy your application after adding environment variables

**Error: "Database connection failed"**
- Check that your DATABASE_URL is correct
- Ensure your database is accessible from Vercel (most cloud databases work by default)
- Check if your database requires SSL connections (add `?sslmode=require`)

**Error: "Table doesn't exist"**
- Run database migrations: `npx prisma migrate deploy`
- Or use Prisma Studio to check your database schema
