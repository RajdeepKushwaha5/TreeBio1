import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

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
    const { linkId, title, url, description, isVisible, sortOrder } = body;

    if (!linkId) {
      return NextResponse.json(
        { error: 'Link ID is required' },
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

    // Check if link belongs to user
    const existingLink = await db.link.findFirst({
      where: {
        id: linkId,
        userId: user.id
      }
    });

    if (!existingLink) {
      return NextResponse.json(
        { error: 'Link not found or access denied' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (url !== undefined) updateData.url = url;
    if (description !== undefined) updateData.description = description;
    if (isVisible !== undefined) updateData.isVisible = isVisible;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    updateData.updatedAt = new Date();

    // Update the link
    const updatedLink = await db.link.update({
      where: { id: linkId },
      data: updateData
    });

    // Revalidate relevant paths
    revalidatePath('/admin/my-tree');
    revalidatePath('/admin');

    return NextResponse.json({
      success: true,
      data: updatedLink,
      message: 'Link updated successfully'
    });

  } catch (error) {
    console.error('Link update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, linkIds, data } = body;

    if (!action || !linkIds || !Array.isArray(linkIds)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
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

    let result;

    switch (action) {
      case 'bulk_update_visibility':
        result = await db.link.updateMany({
          where: {
            id: { in: linkIds },
            userId: user.id
          },
          data: {
            isVisible: data.isVisible,
            updatedAt: new Date()
          }
        });
        break;

      case 'bulk_update_order':
        // Update multiple links with new sort orders
        const updatePromises = linkIds.map((linkId: string, index: number) =>
          db.link.update({
            where: {
              id: linkId,
              userId: user.id
            },
            data: {
              sortOrder: data.startOrder + index,
              updatedAt: new Date()
            }
          })
        );
        result = await Promise.all(updatePromises);
        break;

      case 'archive':
        result = await db.link.updateMany({
          where: {
            id: { in: linkIds },
            userId: user.id
          },
          data: {
            isActive: false,
            updatedAt: new Date()
          }
        });
        break;

      case 'restore':
        result = await db.link.updateMany({
          where: {
            id: { in: linkIds },
            userId: user.id
          },
          data: {
            isActive: true,
            updatedAt: new Date()
          }
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Revalidate relevant paths
    revalidatePath('/admin/my-tree');
    revalidatePath('/admin');
    revalidatePath('/admin/archive');

    return NextResponse.json({
      success: true,
      data: result,
      message: `Bulk ${action} completed successfully`
    });

  } catch (error) {
    console.error('Bulk update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
