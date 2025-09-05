"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, LineChart, Line, BarChart, Bar } from "recharts";
import { BarChart3, TrendingUp, Users, MousePointer, Eye, Clock, Globe, Calendar } from "lucide-react";

interface AnalyticsData {
  totalVisits: number;
  visitsLast24Hours: number;
  visitsLast7Days: number;
  visitsLast30Days: number;
  dailyVisits: Array<{ date: string; visits: number }>;
  recentVisitors: Array<{ 
    id: string;
    visitorIp: string;
    visitedAt: string;
  }>;
}

interface AnalyticsClientProps {
  userId: string;
}

export function AnalyticsClient({ userId }: AnalyticsClientProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/analytics?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAnalytics();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="w-16 h-4 bg-muted rounded animate-pulse" />
                  <div className="w-20 h-8 bg-muted rounded animate-pulse" />
                  <div className="w-24 h-3 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="h-[400px] bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Analytics Data</h2>
        <p className="text-muted-foreground mb-6">Unable to load analytics data at this time.</p>
        <Button onClick={fetchAnalytics}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Analytics Data</h2>
        <p className="text-muted-foreground mb-6">No analytics data available yet.</p>
        <Button onClick={fetchAnalytics}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time profile visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 24 Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.visitsLast24Hours.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Visits in the last day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.visitsLast7Days.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Visits this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 30 Days</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.visitsLast30Days.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Visits this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Visits Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Visits Over Time</CardTitle>
            <CardDescription>Daily profile visits for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {data.dailyVisits && data.dailyVisits.length > 0 ? (
              <ChartContainer
                config={{
                  visits: {
                    label: "Visits",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.dailyVisits}>
                    <defs>
                      <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      className="text-xs"
                    />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="visits"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#visitGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No visit data available for the chart
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Visitors */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Visitors</CardTitle>
            <CardDescription>Latest profile visits</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentVisitors && data.recentVisitors.length > 0 ? (
              <div className="space-y-3">
                {data.recentVisitors.slice(0, 10).map((visitor) => (
                  <div key={visitor.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{visitor.visitorIp}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(visitor.visitedAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent visitors to display
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}