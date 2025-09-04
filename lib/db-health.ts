export async function testDatabaseConnection(): Promise<{ success: boolean; error?: string; details?: any }> {
  try {
    // Debug: Log all environment variables related to database
    console.log('🔍 Environment Debug:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('VERCEL:', process.env.VERCEL);
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length || 0);
    
    // Check if DATABASE_URL exists with more thorough validation
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;
    
    if (!databaseUrl || databaseUrl.trim() === '') {
      console.log('❌ No valid database URL found in any expected environment variable');
      return { 
        success: false, 
        error: 'DATABASE_URL environment variable is not set or is empty',
        details: {
          suggestion: 'Add DATABASE_URL to your Vercel environment variables',
          checked_variables: ['DATABASE_URL', 'POSTGRES_URL', 'POSTGRES_PRISMA_URL'],
          environment: process.env.NODE_ENV,
          vercel_env: process.env.VERCEL_ENV,
          all_env_keys_count: Object.keys(process.env).length
        }
      };
    }

    // Temporarily set DATABASE_URL if found under different name
    if (!process.env.DATABASE_URL && databaseUrl) {
      process.env.DATABASE_URL = databaseUrl;
      console.log('✅ Found database URL under alternative name, setting DATABASE_URL');
    }

    // Import db here to avoid initialization errors
    const { db } = await import('./db');
    
    // Simple database connectivity test
    console.log('🔄 Testing database connection...');
    await db.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection test successful');
    
    return { 
      success: true,
      details: {
        message: 'Database connection is working properly',
        databaseUrl: databaseUrl.split('@')[1]?.split('/')[0] || 'hidden', // Show only host part for security
        environment: process.env.NODE_ENV,
        vercel_env: process.env.VERCEL_ENV
      }
    };
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    
    let errorMessage = 'Unknown database error';
    let details: any = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Provide helpful error context
      if (errorMessage.includes('Environment variable not found: DATABASE_URL')) {
        details = {
          issue: 'DATABASE_URL not found in environment',
          solution: 'Add DATABASE_URL to your Vercel environment variables',
          vercelLink: 'https://vercel.com/dashboard/settings/environment-variables',
          current_env: process.env.NODE_ENV,
          vercel_env: process.env.VERCEL_ENV,
          total_env_vars: Object.keys(process.env).length
        };
      } else if (errorMessage.includes('connect ECONNREFUSED')) {
        details = {
          issue: 'Cannot connect to database server',
          solution: 'Check your database host and port in DATABASE_URL'
        };
      } else if (errorMessage.includes('password authentication failed')) {
        details = {
          issue: 'Database authentication failed',
          solution: 'Check your username and password in DATABASE_URL'
        };
      } else if (errorMessage.includes('database') && errorMessage.includes('does not exist')) {
        details = {
          issue: 'Database does not exist',
          solution: 'Create the database or check the database name in DATABASE_URL'
        };
      }
    }
    
    return { 
      success: false, 
      error: errorMessage,
      details
    };
  }
}
