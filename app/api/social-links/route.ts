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
    const { platform, url, username, isVisible = true } = body;

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
    const lastSocialLink = await db.socialLink.findFirst({
      where: { userId: user.id },
      orderBy: { sortOrder: 'desc' },
    });

    const newSocialLink = await db.socialLink.create({
      data: {
        platform,
        url,
        username,
        isVisible,
        userId: user.id,
        sortOrder: (lastSocialLink?.sortOrder || 0) + 1,
      },
    });

    // Trigger real-time event
    await triggerRealtimeEvent(
      PUSHER_CHANNELS.USER_CHANNEL(user.id),
      PUSHER_EVENTS.SOCIAL_LINK_ADDED,
      {
        userId: user.id,
        socialLink: newSocialLink,
        timestamp: new Date().toISOString(),
      }
    );

    // Also trigger public channel if username exists
    if (user.username) {
      await triggerRealtimeEvent(
        PUSHER_CHANNELS.PUBLIC_CHANNEL(user.username),
        PUSHER_EVENTS.SOCIAL_LINK_ADDED,
        {
          socialLink: newSocialLink,
          timestamp: new Date().toISOString(),
        }
      );
    }

    return NextResponse.json({
      success: true,
      socialLink: newSocialLink,
    });
  } catch (error) {
    console.error('Error creating social link:', error);
    return NextResponse.json(
      { error: 'Failed to create social link' },
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
    const { id, platform, url, username, isVisible } = body;

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedSocialLink = await db.socialLink.update({
      where: { 
        id,
        userId: user.id, // Ensure user owns this social link
      },
      data: {
        platform,
        url,
        username,
        isVisible,
        updatedAt: new Date(),
      },
    });

    // Trigger real-time event
    await triggerRealtimeEvent(
      PUSHER_CHANNELS.USER_CHANNEL(user.id),
      PUSHER_EVENTS.SOCIAL_LINK_UPDATED,
      {
        userId: user.id,
        socialLink: updatedSocialLink,
        timestamp: new Date().toISOString(),
      }
    );

    // Also trigger public channel if username exists
    if (user.username) {
      await triggerRealtimeEvent(
        PUSHER_CHANNELS.PUBLIC_CHANNEL(user.username),
        PUSHER_EVENTS.SOCIAL_LINK_UPDATED,
        {
          socialLink: updatedSocialLink,
          timestamp: new Date().toISOString(),
        }
      );
    }

    return NextResponse.json({
      success: true,
      socialLink: updatedSocialLink,
    });
  } catch (error) {
    console.error('Error updating social link:', error);
    return NextResponse.json(
      { error: 'Failed to update social link' },
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
    const socialLinkId = url.searchParams.get('id');

    if (!socialLinkId) {
      return NextResponse.json(
        { error: 'Social link ID is required' },
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

    await db.socialLink.delete({
      where: { 
        id: socialLinkId,
        userId: user.id, // Ensure user owns this social link
      },
    });

    // Trigger real-time event
    await triggerRealtimeEvent(
      PUSHER_CHANNELS.USER_CHANNEL(user.id),
      PUSHER_EVENTS.SOCIAL_LINK_DELETED,
      {
        userId: user.id,
        socialLinkId: socialLinkId,
        timestamp: new Date().toISOString(),
      }
    );

    // Also trigger public channel if username exists
    if (user.username) {
      await triggerRealtimeEvent(
        PUSHER_CHANNELS.PUBLIC_CHANNEL(user.username),
        PUSHER_EVENTS.SOCIAL_LINK_DELETED,
        {
          socialLinkId: socialLinkId,
          timestamp: new Date().toISOString(),
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Social link deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting social link:', error);
    return NextResponse.json(
      { error: 'Failed to delete social link' },
      { status: 500 }
    );
  }
}
