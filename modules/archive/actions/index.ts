"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export interface ArchivedLink {
  id: string;
  title: string;
  url: string;
  archivedAt: Date;
  originalClicks: number;
  reason?: string;
  userId: string;
}

export interface ArchivedCollection {
  id: string;
  name: string;
  linkCount: number;
  archivedAt: Date;
  userId: string;
}

export interface ArchivedAnalytics {
  id: string;
  type: 'profile_view' | 'link_click' | 'share_event';
  data: Record<string, unknown>;
  archivedAt: Date;
  userId: string;
}

// Get archived links for current user
export async function getArchivedLinks() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      throw new Error("Unauthorized");
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get archived links (inactive links)
    const archivedLinks = await prisma.link.findMany({
      where: {
        userId: user.id,
        isActive: false
      },
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        analytics: true
      }
    });

    const totalClicks = archivedLinks.reduce((sum, link) => sum + link.clickCount, 0);

    return {
      links: archivedLinks.map(link => ({
        id: link.id,
        title: link.title,
        url: link.url,
        archivedAt: link.updatedAt,
        originalClicks: link.clickCount,
        reason: link.description || "Archived by user",
        userId: link.userId,
        analytics: link.analytics
      })),
      totalClicks,
      totalCount: archivedLinks.length
    };
  } catch (error) {
    console.error("Error fetching archived links:", error);
    return { links: [], totalClicks: 0, totalCount: 0 };
  }
}

// Restore archived link
export async function restoreArchivedLink(linkId: string) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.link.update({
      where: {
        id: linkId,
        userId: user.id
      },
      data: {
        isActive: true
      }
    });

    revalidatePath("/admin/archive");
    revalidatePath("/admin/my-tree");
    return { success: true, message: "Link restored successfully" };
  } catch (error) {
    console.error("Error restoring link:", error);
    return { success: false, message: "Failed to restore link" };
  }
}

// Permanently delete archived link
export async function deleteArchivedLink(linkId: string) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete analytics first (cascade should handle this, but being explicit)
    await prisma.linkAnalytics.deleteMany({
      where: { linkId }
    });

    // Delete the link
    await prisma.link.delete({
      where: {
        id: linkId,
        userId: user.id
      }
    });

    revalidatePath("/admin/archive");
    return { success: true, message: "Link deleted permanently" };
  } catch (error) {
    console.error("Error deleting link:", error);
    return { success: false, message: "Failed to delete link" };
  }
}

// Archive a currently active link
export async function archiveLink(linkId: string, reason?: string) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.link.update({
      where: {
        id: linkId,
        userId: user.id
      },
      data: {
        isActive: false,
        description: reason || "Archived by user"
      }
    });

    revalidatePath("/admin/archive");
    revalidatePath("/admin/my-tree");
    return { success: true, message: "Link archived successfully" };
  } catch (error) {
    console.error("Error archiving link:", error);
    return { success: false, message: "Failed to archive link" };
  }
}

// Get archive statistics
export async function getArchiveStats() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!user) {
      throw new Error("User not found");
    }

    const [archivedLinksCount, archivedLinksClicks, totalLinksCount, activeLinksCount] = await Promise.all([
      prisma.link.count({
        where: {
          userId: user.id,
          isActive: false
        }
      }),
      prisma.link.aggregate({
        where: {
          userId: user.id,
          isActive: false
        },
        _sum: {
          clickCount: true
        }
      }),
      prisma.link.count({
        where: {
          userId: user.id
        }
      }),
      prisma.link.count({
        where: {
          userId: user.id,
          isActive: true
        }
      })
    ]);

    return {
      archivedLinksCount,
      archivedLinksClicks: archivedLinksClicks._sum.clickCount || 0,
      totalLinksCount,
      activeLinksCount,
      archiveRatio: totalLinksCount > 0 ? (archivedLinksCount / totalLinksCount) * 100 : 0
    };
  } catch (error) {
    console.error("Error fetching archive stats:", error);
    return {
      archivedLinksCount: 0,
      archivedLinksClicks: 0,
      totalLinksCount: 0,
      activeLinksCount: 0,
      archiveRatio: 0
    };
  }
}

// Export archived data
export async function exportArchivedData(format: 'json' | 'csv' = 'json') {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      throw new Error("Unauthorized");
    }

    const { links } = await getArchivedLinks();
    
    if (format === 'csv') {
      const csvHeader = 'Title,URL,Archived Date,Clicks,Reason\n';
      const csvData = links.map(link => 
        `"${link.title}","${link.url}","${link.archivedAt}","${link.originalClicks}","${link.reason || ''}"`
      ).join('\n');
      
      return {
        success: true,
        data: csvHeader + csvData,
        filename: `treebio-archived-links-${new Date().toISOString().split('T')[0]}.csv`,
        contentType: 'text/csv'
      };
    } else {
      return {
        success: true,
        data: JSON.stringify(links, null, 2),
        filename: `treebio-archived-links-${new Date().toISOString().split('T')[0]}.json`,
        contentType: 'application/json'
      };
    }
  } catch (error) {
    console.error("Error exporting archived data:", error);
    return {
      success: false,
      message: "Failed to export data"
    };
  }
}
