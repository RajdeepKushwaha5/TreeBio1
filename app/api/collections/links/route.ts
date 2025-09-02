import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { collectionsService } from '@/lib/collections';

// GET /api/collections/links - Get user's links for collection creation
export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await collectionsService.getUserLinks(user.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      links: result.links,
    });
  } catch (error) {
    console.error('Error fetching user links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}
