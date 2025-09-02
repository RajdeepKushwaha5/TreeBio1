"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, MousePointer, Users, ExternalLink, Share2, Loader2 } from "lucide-react";
import { getDashboardData, getRealtimeStats, type DashboardData } from "@/modules/dashboard/actions";
import { toast } from "sonner";
import DashboardTester from "./dashboard-tester";
import Link from "next/link";

export default function DashboardOverview() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Load initial data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const result = await getDashboardData();
        if (result.success && result.data) {
          setDashboardData(result.data);
        }
      } catch (loadError) {
        console.error("Error loading dashboard data:", loadError);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Set up real-time updates every 30 seconds
  useEffect(() => {
    const updateRealtimeStats = async () => {
      if (!dashboardData) return;

      try {
        const result = await getRealtimeStats();
        if (result.success && result.data) {
          setDashboardData(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              stats: {
                ...prev.stats,
                ...result.data,
              },
            };
          });
          setLastUpdate(new Date());
        }
      } catch (err) {
        console.error("Error updating realtime stats:", err);
      }
    };

    // Update every 30 seconds
    const interval = setInterval(updateRealtimeStats, 30000);

    return () => clearInterval(interval);
  }, [dashboardData]);

  const handleAddNewLink = () => {
    window.location.href = "/admin/my-tree";
  };

  const handlePreviewTree = () => {
    if (dashboardData?.userInfo?.username) {
      window.open(`/${dashboardData.userInfo.username}`, "_blank");
    } else {
      toast.error("Please set up your username first in settings");
    }
  };

  const handleShareTree = async () => {
    if (dashboardData?.userInfo?.username) {
      const url = `${window.location.origin}/${dashboardData.userInfo.username}`;
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Tree URL copied to clipboard!");
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        toast.success("Tree URL copied to clipboard!");
      }
    } else {
      toast.error("Please set up your username first in settings");
    }
  };

  const formatGrowth = (growth: number): string => {
    const sign = growth >= 0 ? "+" : "";
    return `${sign}${growth}%`;
  };

  const getGrowthColor = (growth: number): string => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Unable to load dashboard data</h2>
          <p className="text-muted-foreground">Please try refreshing the page</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {dashboardData.userInfo?.firstName || "User"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Manage your links and track your performance
            <span className="ml-2 text-xs">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </p>
        </div>
        <Button onClick={handleAddNewLink}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Link
        </Button>
      </div>

      {/* Live Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.totalLinks}</div>
            <p className={`text-xs ${getGrowthColor(dashboardData.stats.linksGrowth)}`}>
              {formatGrowth(dashboardData.stats.linksGrowth)} from last month
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.totalViews.toLocaleString()}</div>
            <p className={`text-xs ${getGrowthColor(dashboardData.stats.viewsGrowth)}`}>
              {formatGrowth(dashboardData.stats.viewsGrowth)} from last month
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.totalClicks.toLocaleString()}</div>
            <p className={`text-xs ${getGrowthColor(dashboardData.stats.clicksGrowth)}`}>
              {formatGrowth(dashboardData.stats.clicksGrowth)} from last month
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.uniqueVisitors}</div>
            <p className={`text-xs ${getGrowthColor(dashboardData.stats.visitorsGrowth)}`}>
              {formatGrowth(dashboardData.stats.visitorsGrowth)} from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Links</span>
              <Link href="/admin/my-tree" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </CardTitle>
            <CardDescription>Your most recently added links</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.recentLinks.length === 0 ? (
              <div className="text-center py-8">
                <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No links yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first link to get started
                </p>
                <Button onClick={handleAddNewLink} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Link
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.recentLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{link.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <p className="text-sm font-medium">{link.clickCount} clicks</p>
                        <p className="text-xs text-muted-foreground">
                          {link.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(link.url, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your Linktree efficiently</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start bg-transparent" 
              variant="outline"
              onClick={handleAddNewLink}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Link
            </Button>
            <Button 
              className="w-full justify-start bg-transparent" 
              variant="outline"
              onClick={handlePreviewTree}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview My Tree
            </Button>
            <Button 
              className="w-full justify-start bg-transparent" 
              variant="outline"
              onClick={handleShareTree}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share My Tree
            </Button>
            <Link href="/admin/overview" className="block">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Real-time updates active
              </div>
              <div>Updates every 30 seconds</div>
              <div>Last sync: {lastUpdate.toLocaleTimeString()}</div>
            </div>
          </CardContent>
        </Card>
        
        <DashboardTester />
      </div>
    </div>
  );
}
