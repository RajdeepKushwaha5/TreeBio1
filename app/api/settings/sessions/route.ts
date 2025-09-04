import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user info for session data
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        lastActive: true,
        createdAt: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return session information
    const sessionData = {
      currentSession: {
        id: `session_${Date.now()}`,
        device: 'Web Browser',
        location: 'Unknown', // Would need IP geolocation in real app
        lastActive: user.lastActive,
        isActive: true
      },
      sessions: [
        {
          id: `session_${Date.now() - 1000}`,
          device: 'Web Browser',
          location: 'Unknown',
          lastActive: user.lastActive,
          isActive: true
        }
      ],
      accountCreated: user.createdAt
    };

    return NextResponse.json({
      success: true,
      data: sessionData
    });
  } catch (error) {
    console.error('Sessions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
