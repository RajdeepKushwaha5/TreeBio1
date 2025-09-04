"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Settings, 
  BarChart3,
  Globe,
  Calendar,
  ExternalLink,
  Copy,
  Loader2
} from "lucide-react";

interface ShortUrl {
  id: string;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  isActive: boolean;
  expiresAt?: string;
}

export function ShortUrlManager() {
  const [bulkMode, setBulkMode] = useState(true);
  const [expirationEnabled, setExpirationEnabled] = useState(true);
  const [expiryDate, setExpiryDate] = useState("2025-10-09T13:01");
  const [bulkUrls, setBulkUrls] = useState("https://example.com/page1\nhttps://example.com/page2\nhttps://example.com/page3");
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentShortUrls, setRecentShortUrls] = useState<ShortUrl[]>([]);
  const [stats, setStats] = useState({ total: 127, active: 89 });

  // Initialize with sample data matching the image
  useEffect(() => {
    setRecentShortUrls([
      {
        id: "1",
        shortCode: "abc123",
        originalUrl: "https://example.com/page1",
        shortUrl: "bit.ly/abc123",
        clicks: 45,
        createdAt: "2025-09-01",
        isActive: true
      },
      {
        id: "2", 
        shortCode: "def456",
        originalUrl: "https://example.com/page2",
        shortUrl: "bit.ly/def456",
        clicks: 23,
        createdAt: "2025-09-02",
        isActive: true
      }
    ]);
  }, []);

  const handleProcessBulkUrls = async () => {
    if (!bulkUrls.trim()) {
      toast.error("Please enter URLs to process");
      return;
    }

    setIsProcessing(true);
    const urls = bulkUrls.split('\n').filter(url => url.trim()).map(url => url.trim());
    
    try {
      toast.success(`Processing ${urls.length} URLs...`);
      
      // Call the real API for bulk processing
      const response = await fetch('/api/shortener', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: urls,
          expiresAt: expirationEnabled ? expiryDate : undefined
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Convert API results to our format
        const newShortUrls: ShortUrl[] = result.results.map((item: any) => ({
          id: item.id,
          shortCode: item.shortCode,
          originalUrl: item.originalUrl,
          shortUrl: item.shortUrl,
          clicks: 0,
          createdAt: new Date().toISOString().split('T')[0],
          isActive: true,
          expiresAt: expirationEnabled ? expiryDate : undefined
        }));

        setRecentShortUrls(prev => [...newShortUrls, ...prev]);
        setStats(prev => ({ 
          total: prev.total + result.processed, 
          active: Math.round(((prev.active * prev.total / 100) + result.processed) / (prev.total + result.processed) * 100)
        }));
        
        let message = `Successfully processed ${result.processed} URLs!`;
        if (result.failed > 0) {
          message += ` ${result.failed} URLs failed.`;
        }
        toast.success(message);
        setBulkUrls("");
        
        // Reload the parent component's data if available
        if (window.location.reload) {
          setTimeout(() => window.location.reload(), 1000);
        }
      } else {
        throw new Error(result.error || 'Failed to process URLs');
      }
    } catch (error) {
      toast.error("Error processing bulk URLs: " + (error as Error).message);
      console.error("Bulk processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const openAdvancedSettings = () => {
    // In a real app, this would navigate to settings page
    window.open('/admin/settings', '_blank');
    toast.success("Advanced Settings opened!");
  };

  const viewAnalytics = () => {
    // In a real app, this would navigate to analytics dashboard
    window.open('/admin/tools/analytics', '_blank');
    toast.success("Analytics dashboard opened!");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-4 w-4" />
        <h3 className="font-medium">Advanced Features</h3>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label>Bulk Mode</Label>
            <p className="text-xs text-muted-foreground">
              Process multiple URLs at once
            </p>
          </div>
          <Switch 
            checked={bulkMode} 
            onCheckedChange={setBulkMode}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Link Expiration</Label>
            <p className="text-xs text-muted-foreground">
              Set automatic expiry dates
            </p>
          </div>
          <Switch 
            checked={expirationEnabled} 
            onCheckedChange={setExpirationEnabled}
          />
        </div>
      </div>

      {/* Expiry Date Selector */}
      {expirationEnabled && (
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input 
            id="expiryDate"
            type="datetime-local"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="text-sm bg-gray-800 border-gray-700 text-white"
          />
        </div>
      )}

      {/* Bulk URL Input */}
      {bulkMode && (
        <div className="space-y-2">
          <Label htmlFor="bulkUrls">Bulk URLs (one per line)</Label>
          <Textarea
            id="bulkUrls"
            value={bulkUrls}
            onChange={(e) => setBulkUrls(e.target.value)}
            placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
            className="h-24 text-sm bg-gray-800 border-gray-700 text-white resize-none"
          />
          <Button 
            onClick={handleProcessBulkUrls}
            disabled={isProcessing || !bulkUrls.trim()}
            className="w-full bg-white text-black hover:bg-gray-200"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Process Bulk URLs"
            )}
          </Button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="text-center p-2 bg-gray-800 rounded">
          <div className="font-bold text-white text-lg">{stats.total}</div>
          <div className="text-gray-400">Total</div>
        </div>
        <div className="text-center p-2 bg-gray-800 rounded">
          <div className="font-bold text-white text-lg">{stats.active}%</div>
          <div className="text-gray-400">Active</div>
        </div>
      </div>

      {/* Recent Short URLs */}
      <div className="space-y-2">
        <Label>Recent Short URLs</Label>
        <div className="space-y-1">
          {recentShortUrls.slice(0, 2).map((url) => (
            <div key={url.id} className="flex items-center justify-between p-2 bg-gray-800 rounded text-xs">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="truncate text-white">{url.shortUrl}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(url.shortUrl)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <Badge variant="secondary" className="bg-gray-700 text-white">
                {url.clicks}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button 
          onClick={openAdvancedSettings}
          size="sm" 
          variant="outline" 
          className="w-full border-gray-600 text-white hover:bg-gray-800"
        >
          <Settings className="h-3 w-3 mr-1" />
          Advanced Settings
        </Button>
        <Button 
          onClick={viewAnalytics}
          size="sm" 
          variant="outline" 
          className="w-full border-gray-600 text-white hover:bg-gray-800"
        >
          <BarChart3 className="h-3 w-3 mr-1" />
          View Analytics
        </Button>
      </div>
    </div>
  );
}
