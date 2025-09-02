"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export interface DashboardStats {
  totalLinks: number;
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
  linksGrowth: number;
  viewsGrowth: number;
  clicksGrowth: number;
  visitorsGrowth: number;
}

export interface RecentLink {
  id: string;
  title: string;
  url: string;
  clickCount: number;
  createdAt: Date;
}

export interface DashboardData {
  stats: DashboardStats;
  recentLinks: RecentLink[];
  userInfo: {
    firstName: string | null;
    lastName: string | null;
    username: string | null;
  } | null;
}

export const getDashboardData = async (): Promise<{ success: boolean; data?: DashboardData; error?: string }> => {
  try {
    const user = await currentUser();
    
    if (!user) {
      return { success: false, error: "No authenticated user found" };
    }

    // Get user from database
    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
      },
    });

    if (!dbUser) {
      return { success: false, error: "User not found in database" };
    }

    // Get current period stats
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Current period stats
    const totalLinks = await db.link.count({
      where: { userId: dbUser.id },
    });

    const totalClicks = await db.link.aggregate({
      where: { userId: dbUser.id },
      _sum: { clickCount: true },
    });

    const totalViews = await db.profileAnalytics.count({
      where: { userId: dbUser.id },
    });

    const uniqueVisitors = await db.profileAnalytics.groupBy({
      by: ['visitorIp'],
      where: { userId: dbUser.id },
      _count: { id: true },
    });

    // Previous period stats for growth calculation
    const previousLinks = await db.link.count({
      where: {
        userId: dbUser.id,
        createdAt: { lt: oneMonthAgo },
      },
    });

    const previousViews = await db.profileAnalytics.count({
      where: {
        userId: dbUser.id,
        visitedAt: { 
          gte: twoMonthsAgo,
          lt: oneMonthAgo,
        },
      },
    });

    const previousClicks = await db.linkAnalytics.count({
      where: {
        link: { userId: dbUser.id },
        clickedAt: {
          gte: twoMonthsAgo,
          lt: oneMonthAgo,
        },
      },
    });

    const previousUniqueVisitors = await db.profileAnalytics.groupBy({
      by: ['visitorIp'],
      where: {
        userId: dbUser.id,
        visitedAt: {
          gte: twoMonthsAgo,
          lt: oneMonthAgo,
        },
      },
      _count: { id: true },
    });

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const currentViews = await db.profileAnalytics.count({
      where: {
        userId: dbUser.id,
        visitedAt: { gte: oneMonthAgo },
      },
    });

    const currentClicks = await db.linkAnalytics.count({
      where: {
        link: { userId: dbUser.id },
        clickedAt: { gte: oneMonthAgo },
      },
    });

    const currentUniqueVisitors = await db.profileAnalytics.groupBy({
      by: ['visitorIp'],
      where: {
        userId: dbUser.id,
        visitedAt: { gte: oneMonthAgo },
      },
      _count: { id: true },
    });

    // Get recent links
    const recentLinks = await db.link.findMany({
      where: { userId: dbUser.id },
      select: {
        id: true,
        title: true,
        url: true,
        clickCount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const stats: DashboardStats = {
      totalLinks,
      totalViews,
      totalClicks: totalClicks._sum.clickCount || 0,
      uniqueVisitors: uniqueVisitors.length,
      linksGrowth: calculateGrowth(totalLinks, previousLinks),
      viewsGrowth: calculateGrowth(currentViews, previousViews),
      clicksGrowth: calculateGrowth(currentClicks, previousClicks),
      visitorsGrowth: calculateGrowth(currentUniqueVisitors.length, previousUniqueVisitors.length),
    };

    const dashboardData: DashboardData = {
      stats,
      recentLinks,
      userInfo: {
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        username: dbUser.username,
      },
    };

    return { success: true, data: dashboardData };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { success: false, error: "Failed to fetch dashboard data" };
  }
};

export const getRealtimeStats = async (): Promise<{ success: boolean; data?: Partial<DashboardStats>; error?: string }> => {
  try {
    const user = await currentUser();
    
    if (!user) {
      return { success: false, error: "No authenticated user found" };
    }

    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
      select: { id: true },
    });

    if (!dbUser) {
      return { success: false, error: "User not found" };
    }

    // Get stats from last hour for real-time feel
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const recentViews = await db.profileAnalytics.count({
      where: {
        userId: dbUser.id,
        visitedAt: { gte: oneHourAgo },
      },
    });

    const recentClicks = await db.linkAnalytics.count({
      where: {
        link: { userId: dbUser.id },
        clickedAt: { gte: oneHourAgo },
      },
    });

    return {
      success: true,
      data: {
        totalViews: recentViews,
        totalClicks: recentClicks,
      },
    };
  } catch (error) {
    console.error("Error fetching realtime stats:", error);
    return { success: false, error: "Failed to fetch realtime stats" };
  }
};
