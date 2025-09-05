import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { linkIds } = await request.json();

    if (!linkIds || !Array.isArray(linkIds)) {
      return NextResponse.json(
        { error: 'Link IDs array is required' },
        { status: 400 }
      );
    }

    // Get user from database
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

    // Update sort order for each link
    const updatePromises = linkIds.map((linkId: string, index: number) => 
      db.link.update({
        where: {
          id: linkId,
          userId: user.id // Ensure user owns the link
        },
        data: {
          sortOrder: index
        }
      })
    );

    await Promise.all(updatePromises);

    // Get updated links
    const updatedLinks = await db.link.findMany({
      where: {
        userId: user.id,
        isActive: true
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      links: updatedLinks
    });

  } catch (error) {
    console.error('Error reordering links:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
