import { NextRequest, NextResponse } from 'next/server';
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

    // Get archived links (assuming isActive: false means archived)
    const archivedLinks = await db.link.findMany({
      where: { 
        userId: user.id,
        isActive: false
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Get active links count for statistics
    const activeLinksCount = await db.link.count({
      where: { 
        userId: user.id,
        isActive: true
      }
    });

    const totalLinksCount = await db.link.count({
      where: { userId: user.id }
    });

    return NextResponse.json({
      success: true,
      data: {
        archivedLinks,
        stats: {
          archivedLinksCount: archivedLinks.length,
          activeLinksCount,
          totalLinksCount
        }
      }
    });
  } catch (error) {
    console.error('Archive API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const { linkId, action } = body; // action: 'archive' | 'restore' | 'delete'

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

    switch (action) {
      case 'archive':
        await db.link.update({
          where: { 
            id: linkId,
            userId: user.id
          },
          data: { 
            isActive: false,
            updatedAt: new Date()
          }
        });
        break;

      case 'restore':
        await db.link.update({
          where: { 
            id: linkId,
            userId: user.id
          },
          data: { 
            isActive: true,
            updatedAt: new Date()
          }
        });
        break;

      case 'delete':
        await db.link.delete({
          where: { 
            id: linkId,
            userId: user.id
          }
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Link ${action}d successfully`
    });
  } catch (error) {
    console.error('Archive action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform archive action' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
