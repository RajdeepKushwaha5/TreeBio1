import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? `SET (${process.env.DATABASE_URL.length} chars)` : 'NOT SET',
      POSTGRES_URL: process.env.POSTGRES_URL ? `SET (${process.env.POSTGRES_URL.length} chars)` : 'NOT SET',
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? `SET (${process.env.POSTGRES_PRISMA_URL.length} chars)` : 'NOT SET',
      NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ? `SET (${process.env.NEON_DATABASE_URL.length} chars)` : 'NOT SET',
      totalEnvVars: Object.keys(process.env).length
    };

    // Try to get URL preview
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.NEON_DATABASE_URL;
    const urlPreview = url ? `${url.substring(0, 50)}...` : 'NO URL FOUND';

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envCheck,
      urlPreview,
      message: url ? '✅ Database URL found' : '❌ No database URL found'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
