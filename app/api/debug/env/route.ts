import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get all environment variable information
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      
      // Database
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
      DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 20) + '...' || 'Not set',
      
      // All environment variables that start with DATABASE
      DATABASE_VARS: Object.keys(process.env)
        .filter(key => key.includes('DATABASE'))
        .reduce((obj, key) => {
          obj[key] = process.env[key] ? `Set (${process.env[key]?.length} chars)` : 'Not set';
          return obj;
        }, {} as Record<string, string>),
        
      // Clerk variables
      CLERK_VARS: Object.keys(process.env)
        .filter(key => key.includes('CLERK'))
        .reduce((obj, key) => {
          obj[key] = process.env[key] ? `Set (${process.env[key]?.length} chars)` : 'Not set';
          return obj;
        }, {} as Record<string, string>),
        
      // All environment variables (keys only for security)
      ALL_ENV_KEYS: Object.keys(process.env).sort()
    };

    return NextResponse.json({
      status: 'debug',
      timestamp: new Date().toISOString(),
      environment: envInfo
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
