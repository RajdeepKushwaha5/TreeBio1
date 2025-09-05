import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername } from '@/modules/profile/actions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    
    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    const user = await getUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Transform dates to strings for JSON serialization
    const transformedUser = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      links: user.links.map((link) => ({
        ...link,
        description: link.description === null ? undefined : link.description,
        createdAt: link.createdAt.toISOString(),
        updatedAt: link.updatedAt.toISOString(),
        startDate: link.startDate?.toISOString(),
        endDate: link.endDate?.toISOString()
      })),
      socialLinks: user.socialLinks.map((social) => ({
        ...social,
        createdAt: social.createdAt.toISOString(),
        updatedAt: social.updatedAt.toISOString()
      }))
    };

    return NextResponse.json({
      success: true,
      user: transformedUser
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
