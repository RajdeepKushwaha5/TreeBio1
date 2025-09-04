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

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        bio: true,
        displayName: true,
        title: true,
        location: true,
        website: true,
        avatar: true,
        imageUrl: true,
        isVerified: true,
        isPublic: true,
        themeId: true,
        customTheme: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
      },
    });

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
