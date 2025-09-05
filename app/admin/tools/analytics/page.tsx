"use client";

import { useUser } from "@clerk/nextjs";
import { AnalyticsClient } from "@/modules/analytics/components/analytics-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, MousePointer } from "lucide-react";

export default function AnalyticsPage() {
  const { user, isLoaded } = useUser();

  // Show loading state while user data is loading
  if (!isLoaded) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="h-8 w-8" />
              Analytics
            </h1>
          </div>
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
        </div>
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Analytics</h1>
          <p className="text-lg text-muted-foreground mb-6">Please sign in to view your analytics data.</p>
          <Button onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="h-8 w-8" />
          Analytics Dashboard
        </h1>
      </div>
      <AnalyticsClient userId={user.id} />
    </div>
  );
}
