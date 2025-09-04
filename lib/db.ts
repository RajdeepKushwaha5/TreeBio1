import { PrismaClient } from "@prisma/client"

// Declare global prisma for hot reloading
declare global {
  var __prisma: PrismaClient | undefined
}

// Get DATABASE_URL with comprehensive checking
function getDatabaseUrl(): string {
  // Check all possible environment variable names
  const url = process.env.DATABASE_URL || 
              process.env.POSTGRES_URL || 
              process.env.POSTGRES_PRISMA_URL ||
              process.env.NEON_DATABASE_URL ||
              process.env.DATABASE_CONNECTION_STRING;

  console.log('🔍 Environment Variables Check:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- VERCEL:', process.env.VERCEL);
  console.log('- VERCEL_ENV:', process.env.VERCEL_ENV);
  console.log('- DATABASE_URL:', process.env.DATABASE_URL ? `✅ SET (${process.env.DATABASE_URL.length} chars)` : '❌ NOT SET');
  console.log('- POSTGRES_URL:', process.env.POSTGRES_URL ? `✅ SET (${process.env.POSTGRES_URL.length} chars)` : '❌ NOT SET');
  console.log('- POSTGRES_PRISMA_URL:', process.env.POSTGRES_PRISMA_URL ? `✅ SET (${process.env.POSTGRES_PRISMA_URL.length} chars)` : '❌ NOT SET');
  
  // Log first 50 characters of the URL if found (for debugging)
  if (url) {
    console.log('- Found URL Preview:', url.substring(0, 50) + '...');
  }

  return url || '';
}

// Create Prisma client with proper error handling
function createPrismaClient(): PrismaClient {
  const databaseUrl = getDatabaseUrl();

  // If no DATABASE_URL found, provide detailed error
  if (!databaseUrl || databaseUrl.trim() === '') {
    const errorMessage = `
❌ DATABASE_URL ENVIRONMENT VARIABLE NOT FOUND!

🔍 CHECKED THESE VARIABLES:
- DATABASE_URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}
- POSTGRES_URL: ${process.env.POSTGRES_URL ? 'SET' : 'NOT SET'}
- POSTGRES_PRISMA_URL: ${process.env.POSTGRES_PRISMA_URL ? 'SET' : 'NOT SET'}
- NEON_DATABASE_URL: ${process.env.NEON_DATABASE_URL ? 'SET' : 'NOT SET'}

📊 ENVIRONMENT INFO:
- NODE_ENV: ${process.env.NODE_ENV}
- VERCEL: ${process.env.VERCEL}
- VERCEL_ENV: ${process.env.VERCEL_ENV}
- Total Env Vars: ${Object.keys(process.env).length}

🔧 TO FIX THIS IMMEDIATELY:

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your TreeBio1 project
3. Settings → Environment Variables
4. Click "Add New"
5. Set:
   Name: DATABASE_URL
   Value: postgresql://neondb_owner:npg_hq2jkuxTiWJ7@ep-billowing-bush-adw0rphi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   Environments: Production, Preview, Development (ALL)

6. Click SAVE
7. Go to Deployments tab → Click latest deployment → Click "Redeploy"

⚠️ MAKE SURE:
- No extra spaces in the URL
- Include ?sslmode=require&channel_binding=require
- Set for ALL environments
- Click Save after adding
`;

    console.error(errorMessage);
    throw new Error('DATABASE_URL environment variable is required');
  }

  // Validate URL format
  if (!databaseUrl.startsWith('postgresql://')) {
    console.error('❌ Invalid DATABASE_URL format. Must start with postgresql://');
    throw new Error('Invalid DATABASE_URL format');
  }

  console.log('✅ Creating Prisma client with valid DATABASE_URL');

  try {
    const client = new PrismaClient({
      log: ['error', 'warn'],
      datasources: {
        db: {
          url: databaseUrl
        }
      }
    });

    console.log('✅ Prisma client created successfully');
    return client;
  } catch (error) {
    console.error('❌ Failed to create Prisma client:', error);
    throw error;
  }
}

// Initialize database connection with proper singleton pattern
let db: PrismaClient;

try {
  if (process.env.NODE_ENV === 'production') {
    // In production, create a new instance
    db = createPrismaClient();
  } else {
    // In development, use global instance for hot reloading
    if (!global.__prisma) {
      global.__prisma = createPrismaClient();
    }
    db = global.__prisma;
  }
} catch (error) {
  console.error('❌ Database initialization failed:', error);
  // Re-throw the error so it's visible in the application
  throw error;
}

export { db };