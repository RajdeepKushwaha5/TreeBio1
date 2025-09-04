"use client";

import { useUser } from "@clerk/nextjs";
import EnhancedAnalytics from "@/components/enhanced-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Analytics</h1>
          <p>Please sign in to view analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <EnhancedAnalytics userId={user.id} />
    </div>
  );
}
