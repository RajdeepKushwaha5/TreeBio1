import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { triggerRealtimeEvent, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';

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
    const { title, url, description, isVisible = true } = body;

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the next sort order
    const lastLink = await db.link.findFirst({
      where: { userId: user.id },
      orderBy: { sortOrder: 'desc' },
    });

    const newLink = await db.link.create({
      data: {
        title,
        url,
        description,
        isVisible,
        userId: user.id,
        sortOrder: (lastLink?.sortOrder || 0) + 1,
      },
    });

    // Trigger real-time event
    await triggerRealtimeEvent(
      PUSHER_CHANNELS.USER_CHANNEL(user.id),
      PUSHER_EVENTS.LINK_ADDED,
      {
        userId: user.id,
        link: newLink,
        timestamp: new Date().toISOString(),
      }
    );

    // Also trigger public channel if username exists
    if (user.username) {
      await triggerRealtimeEvent(
        PUSHER_CHANNELS.PUBLIC_CHANNEL(user.username),
        PUSHER_EVENTS.LINK_ADDED,
        {
          link: newLink,
          timestamp: new Date().toISOString(),
        }
      );
    }

    return NextResponse.json({
      success: true,
      link: newLink,
    });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, url, description, isVisible } = body;

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedLink = await db.link.update({
      where: { 
        id,
        userId: user.id, // Ensure user owns this link
      },
      data: {
        title,
        url,
        description,
        isVisible,
        updatedAt: new Date(),
      },
    });

    // Trigger real-time event
    await triggerRealtimeEvent(
      PUSHER_CHANNELS.USER_CHANNEL(user.id),
      PUSHER_EVENTS.LINK_UPDATED,
      {
        userId: user.id,
        link: updatedLink,
        timestamp: new Date().toISOString(),
      }
    );

    // Also trigger public channel if username exists
    if (user.username) {
      await triggerRealtimeEvent(
        PUSHER_CHANNELS.PUBLIC_CHANNEL(user.username),
        PUSHER_EVENTS.LINK_UPDATED,
        {
          link: updatedLink,
          timestamp: new Date().toISOString(),
        }
      );
    }

    return NextResponse.json({
      success: true,
      link: updatedLink,
    });
  } catch (error) {
    console.error('Error updating link:', error);
    return NextResponse.json(
      { error: 'Failed to update link' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const linkId = url.searchParams.get('id');

    if (!linkId) {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the link before deleting
    const linkToDelete = await db.link.findUnique({
      where: { id: linkId, userId: user.id },
    });

    if (!linkToDelete) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    await db.link.delete({
      where: { 
        id: linkId,
        userId: user.id, // Ensure user owns this link
      },
    });

    // Trigger real-time event
    await triggerRealtimeEvent(
      PUSHER_CHANNELS.USER_CHANNEL(user.id),
      PUSHER_EVENTS.LINK_DELETED,
      {
        userId: user.id,
        linkId: linkId,
        timestamp: new Date().toISOString(),
      }
    );

    // Also trigger public channel if username exists
    if (user.username) {
      await triggerRealtimeEvent(
        PUSHER_CHANNELS.PUBLIC_CHANNEL(user.username),
        PUSHER_EVENTS.LINK_DELETED,
        {
          linkId: linkId,
          timestamp: new Date().toISOString(),
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Link deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
