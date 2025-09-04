import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { triggerRealtimeEvent, PUSHER_CHANNELS, PUSHER_EVENTS } from '@/lib/pusher';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { linkIds, action } = body; // action: 'restore' | 'delete' | 'archive'

    // Get user
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let affectedCount = 0;

    switch (action) {
      case 'restore':
        const restoreResult = await db.link.updateMany({
          where: { 
            id: { in: linkIds },
            userId: user.id
          },
          data: { 
            isActive: true,
            updatedAt: new Date()
          }
        });
        affectedCount = restoreResult.count;
        break;

      case 'archive':
        const archiveResult = await db.link.updateMany({
          where: { 
            id: { in: linkIds },
            userId: user.id
          },
          data: { 
            isActive: false,
            updatedAt: new Date()
          }
        });
        affectedCount = archiveResult.count;
        break;

      case 'delete':
        const deleteResult = await db.link.deleteMany({
          where: { 
            id: { in: linkIds },
            userId: user.id
          }
        });
        affectedCount = deleteResult.count;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Trigger real-time event for archive updates
    await triggerRealtimeEvent(
      PUSHER_CHANNELS.USER_CHANNEL(user.id),
      'archive-updated',
      {
        userId: user.id,
        action,
        linkIds,
        timestamp: new Date().toISOString(),
      }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}d ${affectedCount} link(s)`,
      affectedCount
    });
  } catch (error) {
    console.error('Archive bulk update error:', error);
    return NextResponse.json(
      { error: 'Failed to update archive' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
