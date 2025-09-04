import { PrismaClient } from "@prisma/client"

// Declare global prisma for hot reloading
declare global {
  var __prisma: PrismaClient | undefined
}

// Lazy database connection - only initialize when actually used
let _db: PrismaClient | null = null;

function createPrismaClient(): PrismaClient {
  // Validate environment first
  if (!process.env.DATABASE_URL) {
    const errorMsg = `
❌ DATABASE_URL environment variable is not set!

Please add your PostgreSQL connection string to your environment:

1. For local development, create a .env.local file with:
   DATABASE_URL="postgresql://username:password@host:port/database"

2. For Vercel deployment, add the environment variable in your Vercel dashboard:
   https://vercel.com/your-username/your-project/settings/environment-variables

Your DATABASE_URL should look like:
postgresql://username:password@host.region.provider.com:5432/database
`;
    console.error(errorMsg);
    throw new Error("DATABASE_URL environment variable is required");
  }

  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
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