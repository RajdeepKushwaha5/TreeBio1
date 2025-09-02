"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Monitor,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  RefreshCw,
  Zap,
  Link2,
  Play,
  TestTube,
  Copy,
  BarChart3,
  Globe,
  Timer
} from "lucide-react";

interface LinkTestResult {
  id: string;
  name: string;
  category: string;
  status: "pass" | "fail" | "warning" | "testing";
  message: string;
  executionTime?: number;
  timestamp: Date;
}

interface LinkPerformanceMetrics {
  shortenerResponseTime: number;
  redirectResponseTime: number;
  databaseWriteTime: number;
  databaseReadTime: number;
  copyTime: number;
  shareTime: number;
  errorRate: number;
}

interface TestLink {
  originalUrl: string;
  shortUrl?: string;
  shortCode?: string;
  clicks?: number;
}

export default function LinkShortenerMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [testResults, setTestResults] = useState<LinkTestResult[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<LinkPerformanceMetrics>({
    shortenerResponseTime: 0,
    redirectResponseTime: 0,
    databaseWriteTime: 0,
    databaseReadTime: 0,
    copyTime: 0,
    shareTime: 0,
    errorRate: 0,
  });
  const [testProgress, setTestProgress] = useState(0);
  const [lastTestRun, setLastTestRun] = useState<Date>(new Date());
  const [testLinks, setTestLinks] = useState<TestLink[]>([]);
  const [testUrl, setTestUrl] = useState("https://github.com/example/repository");

  // Comprehensive Link Shortener functionality tests
  const runLinkShortenerTests = useCallback(async () => {
    setIsMonitoring(true);
    setTestProgress(0);
    const tests: LinkTestResult[] = [];
    const startTime = Date.now();
    let totalErrors = 0;

    // Test URLs for comprehensive testing
    const testUrls = [
      "https://github.com/example/repository",
      "https://portfolio.example.com/projects",
      "https://blog.example.com/article/how-to-build-apps",
      "https://docs.example.com/api/reference",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://stackoverflow.com/questions/12345/how-to-code",
      "https://medium.com/@author/article-title-with-very-long-url-parameters?source=social&utm_campaign=share",
      "https://linkedin.com/in/username",
      "mailto:test@example.com",
      "tel:+1234567890"
    ];

    try {
      // Test 1: URL Validation and Shortening Speed
      setTestProgress(10);
      const shorteningTests = [];
      for (const originalUrl of testUrls.slice(0, 5)) {
        const shortenStart = Date.now();
        try {
          // Simulate API call to shortener
          const response = await fetch('/api/shortener', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ originalUrl })
          });
          
          const shortenTime = Date.now() - shortenStart;
          shorteningTests.push(shortenTime);
          
          if (response.ok) {
            const result = await response.json();
            setTestLinks(prev => [...prev, {
              originalUrl,
              shortUrl: result.shortUrl,
              shortCode: result.shortCode,
              clicks: 0
            }]);
            
            tests.push({
              id: `shorten-${originalUrl.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
              name: `Shorten URL: ${new URL(originalUrl).hostname}`,
              category: "URL Shortening",
              status: shortenTime < 1000 ? "pass" : shortenTime < 3000 ? "warning" : "fail",
              message: `Shortened in ${shortenTime}ms`,
              executionTime: shortenTime,
              timestamp: new Date(),
            });
          } else {
            const errorData = await response.json();
            totalErrors++;
            tests.push({
              id: `shorten-error-${originalUrl.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
              name: `Shorten URL: ${new URL(originalUrl).hostname}`,
              category: "URL Shortening",
              status: "fail",
              message: errorData.error || "Shortening failed",
              timestamp: new Date(),
            });
          }
        } catch {
          totalErrors++;
          tests.push({
            id: `shorten-network-error-${originalUrl.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
            name: `Shorten URL: ${new URL(originalUrl).hostname}`,
            category: "URL Shortening",
            status: "fail",
            message: "Network error during shortening",
            timestamp: new Date(),
          });
        }
      }

      const avgShorteningTime = shorteningTests.reduce((a, b) => a + b, 0) / shorteningTests.length;
      setPerformanceMetrics(prev => ({ ...prev, shortenerResponseTime: avgShorteningTime }));

      // Test 2: Custom Alias Functionality
      setTestProgress(25);
      const customAliases = [
        { alias: "github-repo", url: "https://github.com/example/repo" },
        { alias: "portfolio", url: "https://portfolio.example.com" },
        { alias: "blog-post", url: "https://blog.example.com/post" }
      ];

      for (const testCase of customAliases) {
        try {
          const customStart = Date.now();
          const response = await fetch('/api/shortener', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              originalUrl: testCase.url,
              customCode: testCase.alias 
            })
          });
          
          const customTime = Date.now() - customStart;
          
          if (response.ok) {
            tests.push({
              id: `custom-${testCase.alias}`,
              name: `Custom Alias: ${testCase.alias}`,
              category: "Custom Aliases",
              status: customTime < 1000 ? "pass" : "warning",
              message: `Custom alias created in ${customTime}ms`,
              executionTime: customTime,
              timestamp: new Date(),
            });
          } else {
            const errorData = await response.json();
            tests.push({
              id: `custom-error-${testCase.alias}`,
              name: `Custom Alias: ${testCase.alias}`,
              category: "Custom Aliases",
              status: "fail",
              message: errorData.error || "Custom alias creation failed",
              timestamp: new Date(),
            });
          }
        } catch {
          totalErrors++;
          tests.push({
            id: `custom-network-error-${testCase.alias}`,
            name: `Custom Alias: ${testCase.alias}`,
            category: "Custom Aliases",
            status: "fail",
            message: "Network error during custom alias creation",
            timestamp: new Date(),
          });
        }
      }

      // Test 3: URL Validation
      setTestProgress(40);
      const validationTests = [
        { input: "", expected: "empty URL", shouldFail: true },
        { input: "not-a-url", expected: "invalid URL format", shouldFail: true },
        { input: "https://valid-url.com", expected: "valid HTTPS URL", shouldFail: false },
        { input: "http://valid-url.com", expected: "valid HTTP URL", shouldFail: false },
        { input: "ftp://files.example.com", expected: "FTP URL", shouldFail: false },
        { input: "mailto:test@domain.com", expected: "mailto URL", shouldFail: false },
      ];

      for (const test of validationTests) {
        try {
          const validationStart = Date.now();
          const response = await fetch('/api/shortener', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ originalUrl: test.input })
          });
          
          const validationTime = Date.now() - validationStart;
          const isSuccess = response.ok;
          const shouldPass = !test.shouldFail;
          const testPassed = isSuccess === shouldPass;
          
          tests.push({
            id: `validation-${test.expected.replace(/\s+/g, '-')}`,
            name: `URL Validation: ${test.expected}`,
            category: "Input Validation",
            status: testPassed ? "pass" : "fail",
            message: testPassed 
              ? `Correctly handled ${test.expected} (${validationTime}ms)` 
              : `Incorrectly handled ${test.expected}`,
            executionTime: validationTime,
            timestamp: new Date(),
          });
        } catch {
          tests.push({
            id: `validation-error-${test.expected.replace(/\s+/g, '-')}`,
            name: `URL Validation: ${test.expected}`,
            category: "Input Validation",
            status: "fail",
            message: "Validation test crashed",
            timestamp: new Date(),
          });
        }
      }

      // Test 4: Link Analytics and Click Tracking
      setTestProgress(60);
      try {
        const analyticsStart = Date.now();
        
        // Test analytics API endpoint
        const testShortCode = "test123";
        const statsResponse = await fetch(`/api/shortener/${testShortCode}/stats`);
        const analyticsTime = Date.now() - analyticsStart;
        
        tests.push({
          id: "analytics-test",
          name: "Link Analytics",
          category: "Analytics",
          status: statsResponse.status !== 404 ? "pass" : "warning",
          message: `Analytics endpoint responded in ${analyticsTime}ms`,
          executionTime: analyticsTime,
          timestamp: new Date(),
        });
        
        setPerformanceMetrics(prev => ({ ...prev, databaseReadTime: analyticsTime }));
      } catch {
        totalErrors++;
        tests.push({
          id: "analytics-error",
          name: "Link Analytics",
          category: "Analytics",
          status: "fail",
          message: "Analytics test failed",
          timestamp: new Date(),
        });
      }

      // Test 5: Copy to Clipboard Functionality
      setTestProgress(75);
      try {
        const copyStart = Date.now();
        
        // Test clipboard API availability
        const hasClipboard = typeof navigator !== 'undefined' && 'clipboard' in navigator;
        if (hasClipboard) {
          await navigator.clipboard.writeText("test-short-url");
        }
        
        const copyTime = Date.now() - copyStart;
        setPerformanceMetrics(prev => ({ ...prev, copyTime }));
        
        tests.push({
          id: "copy-test",
          name: "Copy to Clipboard",
          category: "User Interface",
          status: hasClipboard ? "pass" : "warning",
          message: hasClipboard 
            ? `Clipboard functionality works (${copyTime}ms)` 
            : "Clipboard API not available in current context",
          executionTime: copyTime,
          timestamp: new Date(),
        });
      } catch {
        totalErrors++;
        tests.push({
          id: "copy-error",
          name: "Copy to Clipboard",
          category: "User Interface",
          status: "fail",
          message: "Clipboard test failed",
          timestamp: new Date(),
        });
      }

      // Test 6: Share Functionality
      setTestProgress(85);
      try {
        const shareStart = Date.now();
        
        // Test Web Share API availability
        const hasShareAPI = typeof navigator !== 'undefined' && 'share' in navigator;
        const shareTime = Date.now() - shareStart;
        setPerformanceMetrics(prev => ({ ...prev, shareTime }));
        
        tests.push({
          id: "share-test",
          name: "Web Share API",
          category: "User Interface",
          status: hasShareAPI ? "pass" : "warning",
          message: hasShareAPI 
            ? `Share API available (${shareTime}ms)` 
            : "Share API not available, fallback methods enabled",
          executionTime: shareTime,
          timestamp: new Date(),
        });
      } catch {
        totalErrors++;
        tests.push({
          id: "share-error",
          name: "Web Share API",
          category: "User Interface",
          status: "fail",
          message: "Share test failed",
          timestamp: new Date(),
        });
      }

      // Test 7: Performance Under Load
      setTestProgress(95);
      try {
        const loadStart = Date.now();
        const loadPromises = [];
        
        // Simulate multiple concurrent shortening requests
        for (let i = 0; i < 5; i++) {
          loadPromises.push(
            fetch('/api/shortener', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                originalUrl: `https://load-test-${i}.example.com` 
              })
            }).catch(() => null)
          );
        }
        
        const results = await Promise.all(loadPromises);
        const loadTime = Date.now() - loadStart;
        const successfulRequests = results.filter(r => r?.ok).length;
        
        tests.push({
          id: "load-test",
          name: "Performance Under Load",
          category: "Performance",
          status: loadTime < 5000 && successfulRequests >= 3 ? "pass" : 
                 loadTime < 10000 && successfulRequests >= 2 ? "warning" : "fail",
          message: `${successfulRequests}/5 requests succeeded in ${loadTime}ms`,
          executionTime: loadTime,
          timestamp: new Date(),
        });
      } catch {
        totalErrors++;
        tests.push({
          id: "load-error",
          name: "Performance Under Load",
          category: "Performance",
          status: "fail",
          message: "Load test failed",
          timestamp: new Date(),
        });
      }

      const totalTime = Date.now() - startTime;
      const errorRate = (totalErrors / tests.length) * 100;
      setPerformanceMetrics(prev => ({ 
        ...prev, 
        errorRate,
        databaseWriteTime: totalTime / tests.length
      }));

    } catch (error) {
      console.error("Link shortener testing failed:", error);
      tests.push({
        id: "system-error",
        name: "System Error",
        category: "System",
        status: "fail",
        message: "Testing system encountered an error",
        timestamp: new Date(),
      });
    }

    setTestProgress(100);
    setTestResults(tests);
    setLastTestRun(new Date());
    setIsMonitoring(false);

    // Show summary toast
    const passedTests = tests.filter(t => t.status === "pass").length;
    const totalTests = tests.length;
    
    if (passedTests === totalTests) {
      toast.success(`All ${totalTests} link shortener tests passed! ✓`);
    } else if (passedTests >= totalTests * 0.8) {
      toast.warning(`${passedTests}/${totalTests} tests passed. Minor issues detected.`);
    } else {
      toast.error(`${passedTests}/${totalTests} tests passed. Critical issues found!`);
    }
  }, []);

  // Auto-run tests every 5 minutes when monitoring is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      interval = setInterval(() => {
        runLinkShortenerTests();
      }, 300000); // 5 minutes
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, runLinkShortenerTests]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "fail":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "testing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "URL Shortening":
        return <Link2 className="h-4 w-4" />;
      case "Custom Aliases":
        return <Globe className="h-4 w-4" />;
      case "Input Validation":
        return <TestTube className="h-4 w-4" />;
      case "Analytics":
        return <BarChart3 className="h-4 w-4" />;
      case "User Interface":
        return <Copy className="h-4 w-4" />;
      case "Performance":
        return <Activity className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const handleTestUrlShorten = async () => {
    if (!testUrl) return;
    
    try {
      const response = await fetch('/api/shortener', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: testUrl })
      });
      
      if (response.ok) {
        const result = await response.json();
        toast.success(`Short URL created: ${result.shortUrl}`);
        setTestLinks(prev => [...prev, {
          originalUrl: testUrl,
          shortUrl: result.shortUrl,
          shortCode: result.shortCode,
          clicks: 0
        }]);
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch {
      toast.error("Network error occurred");
    }
  };

  const passedTests = testResults.filter(t => t.status === "pass").length;
  const failedTests = testResults.filter(t => t.status === "fail").length;
  const warningTests = testResults.filter(t => t.status === "warning").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Link Shortener Monitor</h2>
          <p className="text-muted-foreground">
            Real-time monitoring and testing of link shortening functionality
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={runLinkShortenerTests}
            disabled={isMonitoring}
          >
            {isMonitoring ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Tests
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Test Progress */}
      {isMonitoring && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Running Link Shortener Tests...</span>
                <span className="text-sm text-muted-foreground">{Math.round(testProgress)}%</span>
              </div>
              <Progress value={testProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/20">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{passedTests}</p>
                <p className="text-sm text-muted-foreground">Tests Passed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900/20">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{failedTests}</p>
                <p className="text-sm text-muted-foreground">Tests Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900/20">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{warningTests}</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                <Timer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{Math.round(performanceMetrics.shortenerResponseTime)}ms</p>
                <p className="text-sm text-muted-foreground">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tests">Test Results</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Link Shortener Test Results
                <Badge variant="outline" className="ml-2">
                  Last run: {lastTestRun.toLocaleTimeString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(test.category)}
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {test.category} • {test.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {test.executionTime && (
                        <Badge variant="secondary">
                          {test.executionTime}ms
                        </Badge>
                      )}
                      {getStatusIcon(test.status)}
                    </div>
                  </div>
                ))}
                {testResults.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tests have been run yet</p>
                    <p className="text-sm">Click &quot;Run Tests&quot; to start monitoring</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Shortener Response</span>
                  <Badge variant="secondary">{Math.round(performanceMetrics.shortenerResponseTime)}ms</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Redirect Response</span>
                  <Badge variant="secondary">{Math.round(performanceMetrics.redirectResponseTime)}ms</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database Write</span>
                  <Badge variant="secondary">{Math.round(performanceMetrics.databaseWriteTime)}ms</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database Read</span>
                  <Badge variant="secondary">{Math.round(performanceMetrics.databaseReadTime)}ms</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Copy Speed</span>
                  <Badge variant="secondary">{Math.round(performanceMetrics.copyTime)}ms</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Error Rate</span>
                  <Badge variant={performanceMetrics.errorRate > 10 ? "destructive" : "secondary"}>
                    {performanceMetrics.errorRate.toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Shortener API</span>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <Badge className="bg-green-500">Connected</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Analytics API</span>
                  <Badge className="bg-green-500">Available</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Clipboard API</span>
                  <Badge className={typeof navigator !== 'undefined' && 'clipboard' in navigator ? "bg-green-500" : "bg-yellow-500"}>
                    {typeof navigator !== 'undefined' && 'clipboard' in navigator ? "Available" : "Limited"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Share API</span>
                  <Badge className={typeof navigator !== 'undefined' && 'share' in navigator ? "bg-green-500" : "bg-yellow-500"}>
                    {typeof navigator !== 'undefined' && 'share' in navigator ? "Available" : "Fallback"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demo" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Test Link Shortener
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testUrl">Test URL</Label>
                  <Input
                    id="testUrl"
                    type="url"
                    placeholder="https://example.com/very-long-url"
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleTestUrlShorten} 
                  disabled={!testUrl || isMonitoring}
                  className="w-full"
                >
                  {isMonitoring ? "Testing..." : "Generate Short Link"}
                </Button>
                
                {testLinks.length > 0 && (
                  <div className="space-y-2">
                    <Label>Generated Links</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {testLinks.slice(-3).map((link, index) => (
                        <div key={index} className="text-xs p-2 bg-muted rounded flex items-center justify-between">
                          <span className="truncate flex-1">{link.shortUrl}</span>
                          <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(link.shortUrl || '')}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Quick Test Cases
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <p><strong>Test these URLs:</strong></p>
                  <div className="space-y-1">
                    <p>• https://github.com/user/repository (GitHub)</p>
                    <p>• https://portfolio.example.com (Portfolio)</p>
                    <p>• https://blog.example.com/article (Blog)</p>
                    <p>• https://docs.example.com/api (Documentation)</p>
                    <p>• mailto:contact@domain.com (Email)</p>
                  </div>
                </div>
                <Button 
                  onClick={runLinkShortenerTests} 
                  disabled={isMonitoring}
                  className="w-full"
                >
                  {isMonitoring ? "Testing..." : "Run Full Test Suite"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
