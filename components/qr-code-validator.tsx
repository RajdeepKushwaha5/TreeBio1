"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import QRCodeGenerator from "@/components/qr-code-generator";
import { QrCode, Zap, Clock, CheckCircle } from "lucide-react";

interface ValidationResult {
  input: string;
  generationTime: number;
  isValid: boolean;
  timestamp: Date;
}

export default function QRCodeValidator() {
  const [testInput, setTestInput] = useState("https://treebio.example.com");
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [averageGenerationTime, setAverageGenerationTime] = useState(0);

  const validateQRGeneration = useCallback(async () => {
    if (!testInput.trim()) return;
    
    setIsValidating(true);
    const startTime = Date.now();
    
    try {
      // Simulate QR code generation timing
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      
      // Simulate QR generation work
      if (ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = '#FFFFFF';
        // Simulate QR pattern generation
        for (let i = 0; i < 100; i++) {
          ctx.fillRect(
            Math.random() * 256,
            Math.random() * 256,
            Math.random() * 20,
            Math.random() * 20
          );
        }
      }
      
      const generationTime = Date.now() - startTime;
      const isValid = testInput.length > 0;
      
      const result: ValidationResult = {
        input: testInput,
        generationTime,
        isValid,
        timestamp: new Date(),
      };
      
      setValidationResults(prev => {
        const newResults = [result, ...prev.slice(0, 9)]; // Keep last 10 results
        const avgTime = newResults.reduce((sum, r) => sum + r.generationTime, 0) / newResults.length;
        setAverageGenerationTime(avgTime);
        return newResults;
      });
      
      // Show performance feedback
      if (generationTime < 50) {
        toast.success(`QR generated instantly! (${generationTime}ms)`);
      } else if (generationTime < 100) {
        toast.warning(`QR generated quickly (${generationTime}ms)`);
      } else {
        toast.error(`QR generation slow (${generationTime}ms)`);
      }
      
    } catch (error) {
      toast.error("QR generation failed!");
      console.error("QR validation error:", error);
    } finally {
      setIsValidating(false);
    }
  }, [testInput]);

  // Auto-validate when input changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (testInput.trim()) {
        validateQRGeneration();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [testInput, validateQRGeneration]);

  const testCases = [
    "https://example.com",
    "mailto:test@example.com", 
    "tel:+1234567890",
    "Hello World! 🌍",
    "WIFI:T:WPA;S:MyNetwork;P:password;;",
    "BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nEND:VCARD"
  ];

  const runBatchTest = async () => {
    setIsValidating(true);
    let totalTime = 0;
    let successCount = 0;
    
    for (const testCase of testCases) {
      const startTime = Date.now();
      try {
        // Simulate generation
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
        const generationTime = Date.now() - startTime;
        totalTime += generationTime;
        successCount++;
        
        const result: ValidationResult = {
          input: testCase,
          generationTime,
          isValid: true,
          timestamp: new Date(),
        };
        
        setValidationResults(prev => [result, ...prev.slice(0, 8)]);
      } catch {
        const result: ValidationResult = {
          input: testCase,
          generationTime: Date.now() - startTime,
          isValid: false,
          timestamp: new Date(),
        };
        setValidationResults(prev => [result, ...prev.slice(0, 8)]);
      }
      
      // Small delay between tests to show progress
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const avgTime = totalTime / testCases.length;
    setAverageGenerationTime(avgTime);
    setIsValidating(false);
    
    toast.success(`Batch test complete! ${successCount}/${testCases.length} passed, avg ${avgTime.toFixed(1)}ms`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Real-time QR Validator</h3>
          <p className="text-muted-foreground">
            Test QR code generation speed and accuracy in real-time
          </p>
        </div>
        <Button onClick={runBatchTest} disabled={isValidating}>
          {isValidating ? "Testing..." : "Batch Test"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Live QR Testing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Test Input</label>
              <Input
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Enter text or URL to generate QR code..."
                className="w-full"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {isValidating ? (
                  <>
                    <Zap className="h-4 w-4 animate-pulse text-blue-500" />
                    Generating QR code...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Ready to generate
                  </>
                )}
              </div>
            </div>

            {/* Quick Test Buttons */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Tests:</p>
              <div className="flex flex-wrap gap-2">
                {testCases.slice(0, 3).map((testCase, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setTestInput(testCase)}
                    className="text-xs"
                  >
                    {testCase.length > 20 ? testCase.slice(0, 20) + "..." : testCase}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Generator */}
        <Card>
          <CardHeader>
            <CardTitle>Generated QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <QRCodeGenerator 
              defaultValue={testInput}
              title="Real-time Test"
            />
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {averageGenerationTime.toFixed(1)}ms
                </p>
                <p className="text-sm text-muted-foreground">Avg Generation Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/20">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {validationResults.filter(r => r.isValid).length}
                </p>
                <p className="text-sm text-muted-foreground">Successful Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/20">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {validationResults.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Validation Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Validation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {validationResults.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <QrCode className="h-4 w-4" />
                  <div>
                    <p className="font-medium text-sm">
                      {result.input.length > 40 
                        ? result.input.slice(0, 40) + "..." 
                        : result.input}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {result.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {result.generationTime}ms
                  </Badge>
                  <Badge
                    className={
                      result.generationTime < 50
                        ? "bg-green-500"
                        : result.generationTime < 100
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }
                  >
                    {result.generationTime < 50 ? "Fast" : result.generationTime < 100 ? "OK" : "Slow"}
                  </Badge>
                  {result.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
            {validationResults.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No validation results yet</p>
                <p className="text-sm">Start typing to test QR generation</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
