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

  console.log('🔍 Database URL Check:');
  console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '✅ SET' : '❌ NOT SET');
  console.log('- POSTGRES_URL:', process.env.POSTGRES_URL ? '✅ SET' : '❌ NOT SET');
  console.log('- POSTGRES_PRISMA_URL:', process.env.POSTGRES_PRISMA_URL ? '✅ SET' : '❌ NOT SET');
  console.log('- NEON_DATABASE_URL:', process.env.NEON_DATABASE_URL ? '✅ SET' : '❌ NOT SET');
  console.log('- Environment:', process.env.NODE_ENV);
  console.log('- Vercel Env:', process.env.VERCEL_ENV);
  console.log('- Total ENV vars:', Object.keys(process.env).length);

  if (!databaseUrl || databaseUrl.trim() === '') {
    console.error('❌ CRITICAL: No database URL found in any environment variable!');
    
    // List all environment variables for debugging (only keys, not values)
    const allEnvKeys = Object.keys(process.env).sort();
    console.log('📋 All available environment variables:', allEnvKeys);
    
    // Look for any environment variable that might contain a database URL
    const possibleDbVars = allEnvKeys.filter(key => 
      key.toLowerCase().includes('database') || 
      key.toLowerCase().includes('postgres') || 
      key.toLowerCase().includes('neon') ||
      key.toLowerCase().includes('db')
    );
    
    if (possibleDbVars.length > 0) {
      console.log('🔍 Possible database-related env vars found:', possibleDbVars);
    }

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

Possible database-related variables found: ${possibleDbVars.join(', ') || 'NONE'}

🔧 SOLUTION:
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables  
4. Add: DATABASE_URL = postgresql://neondb_owner:npg_hq2jkuxTiWJ7@ep-billowing-bush-adw0rphi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
5. Redeploy your application

If the variable is already set, try redeploying the application.
`;
    console.error(errorMsg);
    throw new Error("DATABASE_URL environment variable is required");
  }

  // Use the found database URL
  const actualDatabaseUrl = databaseUrl;
  console.log(`✅ Using database URL: ${actualDatabaseUrl.substring(0, 30)}...`);

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