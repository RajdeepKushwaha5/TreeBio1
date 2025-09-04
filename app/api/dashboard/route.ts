import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDashboardData } from '@/modules/dashboard/actions';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await getDashboardData();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch dashboard data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
