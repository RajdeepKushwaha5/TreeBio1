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
    const timeRange = searchParams.get('timeRange') || '30d';

    // Get user
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

    // Calculate time ranges
    const now = new Date();
    const timeRangeMap = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    
    const days = timeRangeMap[timeRange as keyof typeof timeRangeMap] || 30;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const previousStartDate = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000);

    // Current period analytics
    const [
      currentViews,
      currentClicks,
      currentUniqueVisitors,
      dailyViews,
      topLinks,
      hourlyActivity
    ] = await Promise.all([
      // Total profile views
      db.profileAnalytics.count({
        where: {
          userId: user.id,
          visitedAt: { gte: startDate }
        }
      }),

      // Total link clicks
      db.linkAnalytics.count({
        where: {
          link: { userId: user.id },
          clickedAt: { gte: startDate }
        }
      }),

      // Unique visitors
      db.profileAnalytics.groupBy({
        by: ['visitorIp'],
        where: {
          userId: user.id,
          visitedAt: { gte: startDate }
        },
        _count: { id: true }
      }),

      // Daily views and clicks
      db.$queryRaw`
        SELECT 
          DATE(visited_at) as date,
          COUNT(*) as views,
          COALESCE(clicks.click_count, 0) as clicks
        FROM "ProfileAnalytics" pa
        LEFT JOIN (
          SELECT 
            DATE(clicked_at) as date,
            COUNT(*) as click_count
          FROM "LinkAnalytics" la
          JOIN "Link" l ON la.link_id = l.id
          WHERE l.user_id = ${user.id} AND la.clicked_at >= ${startDate}
          GROUP BY DATE(clicked_at)
        ) clicks ON DATE(pa.visited_at) = clicks.date
        WHERE pa.user_id = ${user.id} AND pa.visited_at >= ${startDate}
        GROUP BY DATE(pa.visited_at)
        ORDER BY date
      `,

      // Top performing links
      db.link.findMany({
        where: {
          userId: user.id,
          analytics: {
            some: {
              clickedAt: { gte: startDate }
            }
          }
        },
        select: {
          id: true,
          title: true,
          clickCount: true,
          _count: {
            select: {
              analytics: {
                where: { clickedAt: { gte: startDate } }
              }
            }
          }
        },
        orderBy: {
          analytics: {
            _count: 'desc'
          }
        },
        take: 10
      }),

      // Hourly activity pattern
      db.$queryRaw`
        SELECT 
          EXTRACT(HOUR FROM visited_at) as hour,
          COUNT(*) as activity
        FROM "ProfileAnalytics"
        WHERE user_id = ${user.id} AND visited_at >= ${startDate}
        GROUP BY EXTRACT(HOUR FROM visited_at)
        ORDER BY hour
      `
    ]);

    // Previous period analytics for growth calculation
    const [previousViews, previousClicks, previousUniqueVisitors] = await Promise.all([
      db.profileAnalytics.count({
        where: {
          userId: user.id,
          visitedAt: { gte: previousStartDate, lt: startDate }
        }
      }),
      db.linkAnalytics.count({
        where: {
          link: { userId: user.id },
          clickedAt: { gte: previousStartDate, lt: startDate }
        }
      }),
      db.profileAnalytics.groupBy({
        by: ['visitorIp'],
        where: {
          userId: user.id,
          visitedAt: { gte: previousStartDate, lt: startDate }
        },
        _count: { id: true }
      })
    ]);

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const viewsGrowth = calculateGrowth(currentViews, previousViews);
    const clicksGrowth = calculateGrowth(currentClicks, previousClicks);
    const visitorsGrowth = calculateGrowth(currentUniqueVisitors.length, previousUniqueVisitors.length);
    const conversionRate = currentViews > 0 ? (currentClicks / currentViews) * 100 : 0;
    const previousConversionRate = previousViews > 0 ? (previousClicks / previousViews) * 100 : 0;
    const conversionGrowth = calculateGrowth(conversionRate, previousConversionRate);

    // Format data for charts
    const formattedDailyViews = (dailyViews as any[]).map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: parseInt(item.views),
      clicks: parseInt(item.clicks)
    }));

    const formattedTopLinks = topLinks.map(link => ({
      name: link.title.length > 20 ? link.title.substring(0, 20) + '...' : link.title,
      clicks: link._count.analytics,
      views: Math.floor(link._count.analytics * 1.5) // Estimated views
    }));

    const formattedHourlyActivity = Array.from({ length: 24 }, (_, hour) => {
      const data = (hourlyActivity as any[]).find(item => parseInt(item.hour) === hour);
      return {
        hour,
        activity: data ? parseInt(data.activity) : 0
      };
    });

    // Generate insights
    const peakHour = formattedHourlyActivity.reduce((max, curr) => 
      curr.activity > max.activity ? curr : max
    );
    
    const topPerformer = formattedTopLinks[0]?.name || 'No data';
    
    const growthTrend = viewsGrowth > 5 ? 'up' : viewsGrowth < -5 ? 'down' : 'stable';

    const recommendations = [
      'Post new content during peak hours for maximum engagement',
      'Focus on promoting your top-performing links',
      'Consider creating similar content to your best performers',
      'Engage with your audience during high-activity periods'
    ];

    // Mock traffic sources and device data (in a real app, you'd collect this)
    const trafficSources = [
      { source: 'Direct', visitors: Math.floor(currentUniqueVisitors.length * 0.4), percentage: 40 },
      { source: 'Social Media', visitors: Math.floor(currentUniqueVisitors.length * 0.3), percentage: 30 },
      { source: 'Search', visitors: Math.floor(currentUniqueVisitors.length * 0.2), percentage: 20 },
      { source: 'Referral', visitors: Math.floor(currentUniqueVisitors.length * 0.1), percentage: 10 }
    ];

    const deviceTypes = [
      { device: 'Mobile', count: Math.floor(currentUniqueVisitors.length * 0.6), percentage: 60 },
      { device: 'Desktop', count: Math.floor(currentUniqueVisitors.length * 0.3), percentage: 30 },
      { device: 'Tablet', count: Math.floor(currentUniqueVisitors.length * 0.1), percentage: 10 }
    ];

    const analyticsData = {
      overview: {
        totalViews: currentViews,
        totalClicks: currentClicks,
        uniqueVisitors: currentUniqueVisitors.length,
        conversionRate,
        viewsGrowth,
        clicksGrowth,
        visitorsGrowth,
        conversionGrowth
      },
      charts: {
        dailyViews: formattedDailyViews,
        topLinks: formattedTopLinks,
        trafficSources,
        deviceTypes,
        hourlyActivity: formattedHourlyActivity
      },
      insights: {
        peakTime: `${peakHour.hour}:00`,
        topPerformer,
        growthTrend,
        recommendations
      }
    };

    return NextResponse.json({
      success: true,
      data: analyticsData
    });

  } catch (error) {
    console.error('Enhanced analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
