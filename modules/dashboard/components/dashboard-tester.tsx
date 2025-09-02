"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw, AlertCircle, CheckCircle } from "lucide-react";
import { getDashboardData, getRealtimeStats } from "@/modules/dashboard/actions";

export default function DashboardTester() {
  const [testResults, setTestResults] = useState<{
    dataLoad: "pending" | "success" | "error";
    realtimeUpdate: "pending" | "success" | "error";
    buttonFunctions: "pending" | "success" | "error";
    lastTest: Date | null;
  }>({
    dataLoad: "pending",
    realtimeUpdate: "pending", 
    buttonFunctions: "pending",
    lastTest: null,
  });

  const runComprehensiveTest = async () => {
    setTestResults(prev => ({
      ...prev,
      dataLoad: "pending",
      realtimeUpdate: "pending",
      buttonFunctions: "pending",
    }));

    // Test 1: Data Loading
    try {
      const dashboardResult = await getDashboardData();
      setTestResults(prev => ({
        ...prev,
        dataLoad: dashboardResult.success ? "success" : "error",
      }));
    } catch {
      setTestResults(prev => ({
        ...prev,
        dataLoad: "error",
      }));
    }

    // Test 2: Real-time Updates
    try {
      const realtimeResult = await getRealtimeStats();
      setTestResults(prev => ({
        ...prev,
        realtimeUpdate: realtimeResult.success ? "success" : "error",
      }));
    } catch {
      setTestResults(prev => ({
        ...prev,
        realtimeUpdate: "error",
      }));
    }

    // Test 3: Button Functions (simplified test)
    try {
      // Test clipboard API availability
      const clipboardSupported = "clipboard" in navigator;
      // Test window.open availability
      const popupSupported = typeof window.open === "function";
      
      setTestResults(prev => ({
        ...prev,
        buttonFunctions: (clipboardSupported && popupSupported) ? "success" : "error",
        lastTest: new Date(),
      }));
    } catch {
      setTestResults(prev => ({
        ...prev,
        buttonFunctions: "error",
        lastTest: new Date(),
      }));
    }
  };

  const getStatusIcon = (status: "pending" | "success" | "error") => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <RefreshCcw className="h-4 w-4 text-yellow-600 animate-spin" />;
    }
  };

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" />
          Dashboard Testing Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            {getStatusIcon(testResults.dataLoad)}
            <span>Data Load</span>
          </div>
          <div className="flex items-center gap-1">
            {getStatusIcon(testResults.realtimeUpdate)}
            <span>Real-time</span>
          </div>
          <div className="flex items-center gap-1">
            {getStatusIcon(testResults.buttonFunctions)}
            <span>Buttons</span>
          </div>
        </div>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={runComprehensiveTest}
          className="w-full"
        >
          <RefreshCcw className="mr-2 h-3 w-3" />
          Run Test Suite
        </Button>
        
        {testResults.lastTest && (
          <p className="text-xs text-muted-foreground text-center">
            Last tested: {testResults.lastTest.toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
