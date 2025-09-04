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
    const { 
      firstName, 
      lastName, 
      username, 
      bio, 
      displayName, 
      title, 
      location, 
      website, 
      avatar,
      isPublic,
      themeId,
      customTheme
    } = body;

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await db.user.findFirst({
        where: { 
          username,
          clerkId: { not: userId }
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 409 }
        );
      }
    }

    const updatedUser = await db.user.update({
      where: { clerkId: userId },
      data: {
        firstName,
        lastName,
        username,
        bio,
        displayName,
        title,
        location,
        website,
        avatar,
        isPublic,
        themeId,
        customTheme,
        updatedAt: new Date(),
        lastActive: new Date(), // Update last active timestamp
      },
    });

    // Trigger real-time event for settings update
    await triggerRealtimeEvent(
      PUSHER_CHANNELS.USER_CHANNEL(updatedUser.id),
      PUSHER_EVENTS.PROFILE_UPDATED,
      {
        userId: updatedUser.id,
        settings: {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          username: updatedUser.username,
          bio: updatedUser.bio,
          displayName: updatedUser.displayName,
          title: updatedUser.title,
          location: updatedUser.location,
          website: updatedUser.website,
          avatar: updatedUser.avatar,
          isPublic: updatedUser.isPublic,
          themeId: updatedUser.themeId,
          customTheme: updatedUser.customTheme,
        },
        timestamp: new Date().toISOString(),
      }
    );

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
