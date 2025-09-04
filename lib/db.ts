import { PrismaClient } from "@prisma/client"

// Declare global prisma for hot reloading
declare global {
  var __prisma: PrismaClient | undefined
}

// Lazy database connection - only initialize when actually used
let _db: PrismaClient | null = null;

function createPrismaClient(): PrismaClient {
  // Check for DATABASE_URL in multiple possible environment variable names
  const databaseUrl = process.env.DATABASE_URL || 
                     process.env.POSTGRES_URL || 
                     process.env.POSTGRES_PRISMA_URL ||
                     process.env.NEON_DATABASE_URL;

  if (!databaseUrl || databaseUrl.trim() === '') {
    const errorMsg = `
❌ DATABASE_URL environment variable is not set!

Checked these environment variables:
- DATABASE_URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}
- POSTGRES_URL: ${process.env.POSTGRES_URL ? 'SET' : 'NOT SET'} 
- POSTGRES_PRISMA_URL: ${process.env.POSTGRES_PRISMA_URL ? 'SET' : 'NOT SET'}
- NEON_DATABASE_URL: ${process.env.NEON_DATABASE_URL ? 'SET' : 'NOT SET'}

Environment: ${process.env.NODE_ENV}
Vercel Environment: ${process.env.VERCEL_ENV}
Total Environment Variables: ${Object.keys(process.env).length}

Please add your PostgreSQL connection string to your environment:

1. For Vercel deployment, add the environment variable in your Vercel dashboard:
   https://vercel.com/your-username/your-project/settings/environment-variables

Your DATABASE_URL should look like:
postgresql://username:password@host.region.provider.com:5432/database
`;
    console.error(errorMsg);
    throw new Error("DATABASE_URL environment variable is required");
  }

  // Use the found database URL
  const actualDatabaseUrl = databaseUrl;
  console.log(`✅ Using database URL from environment (${actualDatabaseUrl.substring(0, 20)}...)`);

  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error', 'warn'],
    datasources: {
      db: {
        url: actualDatabaseUrl
      }
    }
  });

  console.log("✅ Prisma client initialized successfully");
  return client;
}

// Lazy getter for database connection
export const db = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!_db) {
      if (process.env.NODE_ENV === "production") {
        _db = createPrismaClient();
      } else {
        // In development, use global instance for hot reloading
        if (!global.__prisma) {
          global.__prisma = createPrismaClient();
        }
        _db = global.__prisma;
      }
    }
    return _db[prop as keyof PrismaClient];
  }
});