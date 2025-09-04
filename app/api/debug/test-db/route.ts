import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing database connection...');
    
    // Try to connect and run a simple query
    const result = await db.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful:', result);

    // Test user table access
    const userCount = await db.user.count();
    console.log('✅ User table accessible, count:', userCount);

    return NextResponse.json({
      success: true,
      message: '✅ Database connection successful',
      testQuery: result,
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Database connection failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      troubleshooting: {
        step1: 'Check Vercel Dashboard → Project → Settings → Environment Variables',
        step2: 'Ensure DATABASE_URL is set for ALL environments',
        step3: 'Redeploy after adding environment variables',
        step4: 'Check that URL includes ?sslmode=require',
        expectedUrl: 'postgresql://neondb_owner:npg_hq2jkuxTiWJ7@ep-billowing-bush-adw0rphi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
      }
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
