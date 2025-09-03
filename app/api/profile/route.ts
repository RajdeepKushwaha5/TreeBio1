import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { triggerRealtimeEvent, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';

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
    const { name, bio, avatar, username, title, location, website } = body;

    // Update user profile
    const updatedUser = await db.user.update({
      where: { clerkId: userId },
      data: {
        displayName: name,
        bio,
        avatar,
        username,
        title,
        location,
        website,
        updatedAt: new Date(),
      },
    });

    // Trigger real-time event
    await triggerRealtimeEvent(
      PUSHER_CHANNELS.USER_CHANNEL(updatedUser.id),
      PUSHER_EVENTS.PROFILE_UPDATED,
      {
        userId: updatedUser.id,
        profile: {
          name: updatedUser.displayName,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar,
          username: updatedUser.username,
          title: updatedUser.title,
          location: updatedUser.location,
          website: updatedUser.website,
        },
        timestamp: new Date().toISOString(),
      }
    );

    // Also trigger public channel if username exists
    if (updatedUser.username) {
      await triggerRealtimeEvent(
        PUSHER_CHANNELS.PUBLIC_CHANNEL(updatedUser.username),
        PUSHER_EVENTS.PROFILE_UPDATED,
        {
          profile: {
            name: updatedUser.displayName,
            bio: updatedUser.bio,
            avatar: updatedUser.avatar,
            title: updatedUser.title,
            location: updatedUser.location,
            website: updatedUser.website,
          },
          timestamp: new Date().toISOString(),
        }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        links: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        socialLinks: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.displayName || user.firstName + ' ' + user.lastName,
        bio: user.bio,
        avatar: user.avatar || user.imageUrl,
        username: user.username,
        title: user.title,
        location: user.location,
        website: user.website,
        links: user.links,
        socialLinks: user.socialLinks,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
