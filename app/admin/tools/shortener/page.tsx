"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Link2, 
  Copy, 
  BarChart3,
  Calendar,
  Globe,
  TrendingUp,
  Eye,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { ShortUrlManager } from "@/components/link-shortener/short-url-manager";

interface ShortUrl {
  id: string;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  isActive: boolean;
}

interface ApiShortUrl {
  id: string;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string | Date;
  isActive: boolean;
}

export default function LinkShortenerPage() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<ShortUrl | null>(null);
  const [recentShortUrls, setRecentShortUrls] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hostUrl, setHostUrl] = useState("yourdomain.com");

  // Set host URL on client side to avoid hydration errors
  useEffect(() => {
    setHostUrl(window.location.host);
  }, []);

  // Fetch existing short URLs on component mount
  const fetchShortUrls = async () => {
    try {
      const response = await fetch('/api/shortener');
      if (response.ok) {
        const data = await response.json();
        const formattedUrls = (data.shortUrls || []).map((url: ApiShortUrl) => ({
          ...url,
          createdAt: new Date(url.createdAt).toISOString().split('T')[0]
        }));
        setRecentShortUrls(formattedUrls);
      }
    } catch {
      console.error('Error fetching short URLs');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and set up real-time updates
  useEffect(() => {
    fetchShortUrls();
    
    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(fetchShortUrls, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Manual refresh with loading indicator
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchShortUrls();
      toast.success("Short URLs refreshed");
    } catch {
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGenerate = async () => {
    if (!originalUrl) {
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/shortener', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl,
          customCode: customAlias || undefined,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          const newShortUrl: ShortUrl = {
            id: result.id,
            shortCode: result.shortCode,
            originalUrl: result.originalUrl,
            shortUrl: result.shortUrl, // Use the URL from API response
            clicks: 0,
            createdAt: new Date().toISOString().split('T')[0],
            isActive: true
          };
          
          setGeneratedUrl(newShortUrl);
          setRecentShortUrls(prev => [newShortUrl, ...prev]);
          setOriginalUrl("");
          setCustomAlias("");
        } else {
          toast.error('Error: ' + result.error);
        }
      } else {
        const error = await response.json();
        toast.error('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error generating short URL:', error);
      toast.error('Error generating short URL. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Link2 className="h-8 w-8" />
            Link Shortener
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create short, trackable links with detailed analytics
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* URL Shortening Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Short Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="originalUrl">Original URL</Label>
                <Input
                  id="originalUrl"
                  type="url"
                  placeholder="https://example.com/very-long-url"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customAlias">Custom Alias (Optional)</Label>
                <div className="flex gap-2">
                  <div className="flex items-center bg-muted px-3 py-2 rounded-l-md border border-r-0">
                    <span className="text-sm text-muted-foreground">
                      {hostUrl}/s/
                    </span>
                  </div>
                  <Input
                    id="customAlias"
                    placeholder="custom-alias"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave empty for auto-generated alias
                </p>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={!originalUrl || isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Short Link"}
              </Button>
            </CardContent>
          </Card>

          {/* Generated URL Display */}
          {generatedUrl && (
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                  ✓ Short Link Generated Successfully!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-green-700 dark:text-green-300">Your Short URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedUrl.shortUrl}
                      readOnly
                      className="font-mono bg-white dark:bg-gray-900"
                    />
                    <Button
                      onClick={() => copyToClipboard(generatedUrl.shortUrl)}
                      variant="outline"
                      size="icon"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => window.open(generatedUrl.shortUrl, '_blank')}
                      variant="outline"
                      size="icon"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-green-700 dark:text-green-300">Original URL</Label>
                  <div className="text-sm text-green-600 dark:text-green-400 break-all">
                    {generatedUrl.originalUrl}
                  </div>
                </div>

                <div className="flex gap-4 text-sm text-green-600 dark:text-green-400">
                  <span>Short Code: {generatedUrl.shortCode}</span>
                  <span>Created: {generatedUrl.createdAt}</span>
                  <span>Clicks: {generatedUrl.clicks}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Short URLs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Short Links</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : recentShortUrls.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No short links created yet</p>
                  <p className="text-sm">Create your first short link above</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentShortUrls.map((url) => (
                  <div key={url.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-primary">
                            {url.shortUrl}
                          </h3>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(url.shortUrl)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {url.originalUrl}
                        </p>
                      </div>
                      <Badge variant={url.isActive ? "default" : "secondary"}>
                        {url.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          {url.clicks} clicks
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {url.createdAt}
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{recentShortUrls.length}</div>
                <p className="text-sm text-muted-foreground">Total Short Links</p>
              </div>
              <Separator />
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {recentShortUrls.reduce((sum, url) => sum + url.clicks, 0)}
                </div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
              </div>
              <Separator />
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {recentShortUrls.length ? Math.round((recentShortUrls.filter(url => url.isActive).length / recentShortUrls.length) * 100) : 0}%
                </div>
                <p className="text-sm text-muted-foreground">Active Links</p>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Top Performing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentShortUrls
                  .filter(url => url.clicks > 0)
                  .sort((a, b) => b.clicks - a.clicks)
                  .slice(0, 3)
                  .map((url) => (
                    <div key={url.id} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{new URL(url.originalUrl).hostname}</p>
                        <p className="text-xs text-muted-foreground">
                          {hostUrl}/s/{url.shortCode}
                        </p>
                      </div>
                      <Badge variant="secondary">{url.clicks} clicks</Badge>
                    </div>
                  ))}
                {recentShortUrls.filter(url => url.clicks > 0).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">No click data yet</p>
                    <p className="text-xs">Share your links to see performance</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Link Shortener Manager */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Advanced Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ShortUrlManager />
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Custom aliases
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Click tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Link expiration
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Bulk operations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  API access
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
