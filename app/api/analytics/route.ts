import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');

    // Ensure the user can only access their own analytics
    if (userIdParam && userIdParam !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
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

    const dbUserId = user.id;

    // Calculate time ranges
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get analytics data
    const [
      totalVisits,
      visitsLast24Hours,
      visitsLast7Days,
      visitsLast30Days,
      dailyVisitsData,
      recentVisitors
    ] = await Promise.all([
      // Total visits
      db.profileAnalytics.count({
        where: { userId: dbUserId }
      }),
      
      // Last 24 hours
      db.profileAnalytics.count({
        where: {
          userId: dbUserId,
          visitedAt: { gte: oneDayAgo }
        }
      }),
      
      // Last 7 days
      db.profileAnalytics.count({
        where: {
          userId: dbUserId,
          visitedAt: { gte: sevenDaysAgo }
        }
      }),
      
      // Last 30 days
      db.profileAnalytics.count({
        where: {
          userId: dbUserId,
          visitedAt: { gte: thirtyDaysAgo }
        }
      }),
      
      // Daily visits for chart (last 30 days)
      db.profileAnalytics.findMany({
        where: {
          userId: dbUserId,
          visitedAt: { gte: thirtyDaysAgo }
        },
        select: {
          visitedAt: true
        },
        orderBy: {
          visitedAt: 'desc'
        }
      }),
      
      // Recent visitors
      db.profileAnalytics.findMany({
        where: { userId: dbUserId },
        select: {
          id: true,
          visitorIp: true,
          visitedAt: true
        },
        orderBy: {
          visitedAt: 'desc'
        },
        take: 20
      })
    ]);

    // Process daily visits for chart
    const dailyVisits = dailyVisitsData.reduce((acc: Record<string, number>, visit: any) => {
      const date = visit.visitedAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format for charts
    const chartData = Object.entries(dailyVisits)
      .map(([date, visits]): { date: string; visits: number } => ({
        date,
        visits: Number(visits)
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Return analytics data
    return NextResponse.json({
      totalVisits,
      visitsLast24Hours,
      visitsLast7Days,
      visitsLast30Days,
      dailyVisits: chartData,
      recentVisitors: recentVisitors.map(visitor => ({
        id: visitor.id,
        visitorIp: visitor.visitorIp,
        visitedAt: visitor.visitedAt.toISOString()
      }))
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
