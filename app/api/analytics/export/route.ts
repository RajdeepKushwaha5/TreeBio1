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
    const format = searchParams.get('format') || 'csv';
    const timeRange = searchParams.get('timeRange') || '30d';

    // Get user
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, firstName: true, lastName: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate date range
    const timeRangeMap = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    
    const days = timeRangeMap[timeRange as keyof typeof timeRangeMap] || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get analytics data
    const [profileViews, linkClicks, links] = await Promise.all([
      db.profileAnalytics.findMany({
        where: {
          userId: user.id,
          visitedAt: { gte: startDate }
        },
        orderBy: { visitedAt: 'desc' }
      }),
      db.linkAnalytics.findMany({
        where: {
          link: { userId: user.id },
          clickedAt: { gte: startDate }
        },
        include: {
          link: {
            select: { title: true, url: true }
          }
        },
        orderBy: { clickedAt: 'desc' }
      }),
      db.link.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          title: true,
          url: true,
          clickCount: true,
          createdAt: true
        }
      })
    ]);

    if (format === 'csv') {
      // Generate CSV content
      const csvSections = [];

      // Profile Views Section
      csvSections.push('PROFILE VIEWS');
      csvSections.push('Date,Time,Visitor IP');
      profileViews.forEach(view => {
        const date = view.visitedAt.toISOString().split('T')[0];
        const time = view.visitedAt.toISOString().split('T')[1].split('.')[0];
        csvSections.push(`${date},${time},${view.visitorIp}`);
      });

      csvSections.push(''); // Empty line

      // Link Clicks Section
      csvSections.push('LINK CLICKS');
      csvSections.push('Date,Time,Link Title,Link URL,Visitor IP');
      linkClicks.forEach(click => {
        const date = click.clickedAt.toISOString().split('T')[0];
        const time = click.clickedAt.toISOString().split('T')[1].split('.')[0];
        csvSections.push(`${date},${time},"${click.link.title}","${click.link.url}",${click.clickerIp}`);
      });

      csvSections.push(''); // Empty line

      // Links Summary Section
      csvSections.push('LINKS SUMMARY');
      csvSections.push('Title,URL,Total Clicks,Created Date');
      links.forEach(link => {
        const createdDate = link.createdAt.toISOString().split('T')[0];
        csvSections.push(`"${link.title}","${link.url}",${link.clickCount},${createdDate}`);
      });

      const csvContent = csvSections.join('\n');
      
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });

    } else if (format === 'pdf') {
      // For PDF, we'll return a simple text version
      // In a real implementation, you'd use a PDF library like puppeteer or jsPDF
      const summary = {
        reportGenerated: new Date().toISOString(),
        timeRange: timeRange,
        userName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        totalProfileViews: profileViews.length,
        totalLinkClicks: linkClicks.length,
        totalLinks: links.length,
        topLinks: links
          .sort((a, b) => b.clickCount - a.clickCount)
          .slice(0, 5)
          .map(link => ({
            title: link.title,
            clicks: link.clickCount
          }))
      };

      const pdfContent = `
ANALYTICS REPORT
================

Generated: ${summary.reportGenerated}
Time Range: ${summary.timeRange}
User: ${summary.userName}

SUMMARY
-------
Total Profile Views: ${summary.totalProfileViews}
Total Link Clicks: ${summary.totalLinkClicks}
Total Links: ${summary.totalLinks}

TOP PERFORMING LINKS
-------------------
${summary.topLinks.map((link, index) => 
  `${index + 1}. ${link.title} - ${link.clicks} clicks`
).join('\n')}

DETAILED DATA
-------------
This report contains ${summary.totalProfileViews} profile views and ${summary.totalLinkClicks} link clicks.
For detailed data, please export as CSV format.
      `.trim();

      return new NextResponse(pdfContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.txt"`
        }
      });
    }

    return NextResponse.json(
      { error: 'Unsupported format' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Analytics export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
