export async function testDatabaseConnection(): Promise<{ success: boolean; error?: string; details?: any }> {
  try {
    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      return { 
        success: false, 
        error: 'DATABASE_URL environment variable is not set',
        details: {
          suggestion: 'Add DATABASE_URL to your environment variables',
          example: 'postgresql://username:password@host:port/database'
        }
      };
    }

    // Import db here to avoid initialization errors
    const { db } = await import('./db');
    
    // Simple database connectivity test
    await db.$queryRaw`SELECT 1 as test`;
    console.log("✅ Database connection test successful");
    
    return { 
      success: true,
      details: {
        message: 'Database connection is working properly',
        databaseUrl: process.env.DATABASE_URL.split('@')[1] || 'hidden' // Show only host part for security
      }
    };
  } catch (error) {
    console.error("❌ Database connection test failed:", error);
    
    let errorMessage = 'Unknown database error';
    let details: any = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Provide helpful error context
      if (errorMessage.includes('Environment variable not found: DATABASE_URL')) {
        details = {
          issue: 'DATABASE_URL not found in environment',
          solution: 'Add DATABASE_URL to your Vercel environment variables',
          vercelLink: 'https://vercel.com/dashboard/settings/environment-variables'
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
