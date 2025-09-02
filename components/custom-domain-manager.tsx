'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Globe, Plus, Settings } from 'lucide-react';

interface CustomDomainManagerProps {
  domains?: Array<{
    id: string;
    domain: string;
    verified: boolean;
    active: boolean;
  }>;
}

export default function CustomDomainManager({ domains = [] }: CustomDomainManagerProps) {
  const [newDomain, setNewDomain] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return;
    
    setIsAdding(true);
    try {
      // TODO: Implement domain addition logic
      console.log('Adding domain:', newDomain);
      setNewDomain('');
    } catch {
      console.error('Failed to add domain');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveDomain = async (domainId: string) => {
    try {
      // TODO: Implement domain removal logic
      console.log('Removing domain:', domainId);
    } catch {
      console.error('Failed to remove domain');
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    try {
      // TODO: Implement domain verification logic
      console.log('Verifying domain:', domainId);
    } catch {
      console.error('Failed to verify domain');
    }
  };

  const handleToggleDomain = async (domainId: string) => {
    try {
      // TODO: Implement domain toggle logic
      console.log('Toggling domain:', domainId);
    } catch {
      console.error('Failed to toggle domain');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Custom Domains
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="domain">Add Custom Domain</Label>
              <Input
                id="domain"
                placeholder="your-domain.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
              />
            </div>
            <Button
              onClick={handleAddDomain}
              disabled={isAdding || !newDomain.trim()}
              className="mt-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Domain
            </Button>
          </div>

          <div className="space-y-2">
            {domains.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No custom domains configured
              </p>
            ) : (
              domains.map((domain) => (
                <div
                  key={domain.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4" />
                    <span className="font-medium">{domain.domain}</span>
                    <div className="flex space-x-2">
                      <Badge
                        variant={domain.verified ? "default" : "secondary"}
                      >
                        {domain.verified ? "Verified" : "Pending"}
                      </Badge>
                      <Badge
                        variant={domain.active ? "default" : "outline"}
                      >
                        {domain.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVerifyDomain(domain.id)}
                    >
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleDomain(domain.id)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveDomain(domain.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
