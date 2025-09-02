"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  BarChart3
} from "lucide-react";

export function ShortUrlManager() {
  const [bulkMode, setBulkMode] = useState(false);
  const [expirationEnabled, setExpirationEnabled] = useState(false);

  return (
    <div className="space-y-4">
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

      {expirationEnabled && (
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input 
            id="expiryDate"
            type="datetime-local"
            className="text-sm"
          />
        </div>
      )}

      {/* Bulk Input */}
      {bulkMode && (
        <div className="space-y-2">
          <Label htmlFor="bulkUrls">Bulk URLs (one per line)</Label>
          <textarea
            id="bulkUrls"
            placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
            className="w-full h-24 px-3 py-2 border rounded text-sm"
          />
          <Button size="sm" className="w-full">
            Process Bulk URLs
          </Button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="text-center p-2 bg-muted rounded">
          <div className="font-bold">127</div>
          <div className="text-muted-foreground">Total</div>
        </div>
        <div className="text-center p-2 bg-muted rounded">
          <div className="font-bold">89%</div>
          <div className="text-muted-foreground">Active</div>
        </div>
      </div>

      {/* Recent Short URLs */}
      <div className="space-y-2">
        <Label>Recent Short URLs</Label>
        <div className="space-y-1">
          <div className="flex items-center justify-between p-2 border rounded text-xs">
            <span className="truncate">bit.ly/abc123</span>
            <Badge variant="secondary">45</Badge>
          </div>
          <div className="flex items-center justify-between p-2 border rounded text-xs">
            <span className="truncate">bit.ly/def456</span>
            <Badge variant="secondary">23</Badge>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button size="sm" variant="outline" className="w-full">
          <Settings className="h-3 w-3 mr-1" />
          Advanced Settings
        </Button>
        <Button size="sm" variant="outline" className="w-full">
          <BarChart3 className="h-3 w-3 mr-1" />
          View Analytics
        </Button>
      </div>
    </div>
  );
}
