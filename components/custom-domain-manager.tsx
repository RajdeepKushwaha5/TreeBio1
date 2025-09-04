'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Globe, 
  Plus, 
  Settings, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  ExternalLink,
  Shield,
  Clock,
  Copy,
  Loader2
} from 'lucide-react';

interface DomainConfig {
  id: string;
  domain: string;
  isVerified: boolean;
  isActive: boolean;
  verificationMethod: 'DNS' | 'FILE';
  verificationToken: string;
  createdAt: Date;
}

interface CustomDomainManagerProps {
  domains?: DomainConfig[];
}

export default function CustomDomainManager({ domains: initialDomains = [] }: CustomDomainManagerProps) {
  const [domains, setDomains] = useState<DomainConfig[]>(initialDomains);
  const [newDomain, setNewDomain] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    try {
      const response = await fetch('/api/domains');
      const result = await response.json();
      
      if (result.success) {
        setDomains(result.data);
      } else {
        toast.error('Failed to load domains');
      }
    } catch (error) {
      console.error('Error loading domains:', error);
      toast.error('Failed to load domains');
    } finally {
      setIsLoading(false);
    }
  };

  const setDomainLoading = (domainId: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [domainId]: loading }));
  };

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return;
    
    setIsAdding(true);
    try {
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: newDomain.trim() }),
      });

      const result = await response.json();
      
      if (result.success) {
        setDomains(prev => [result.data, ...prev]);
        setNewDomain('');
        toast.success(result.message || 'Domain added successfully');
      } else {
        toast.error(result.error || 'Failed to add domain');
      }
    } catch (error) {
      console.error('Error adding domain:', error);
      toast.error('Failed to add domain');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveDomain = async (domainId: string) => {
    if (!confirm('Are you sure you want to remove this domain? This action cannot be undone.')) {
      return;
    }

    setDomainLoading(domainId, true);
    try {
      const response = await fetch(`/api/domains/${domainId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        setDomains(prev => prev.filter(d => d.id !== domainId));
        toast.success(result.message || 'Domain removed successfully');
      } else {
        toast.error(result.error || 'Failed to remove domain');
      }
    } catch (error) {
      console.error('Error removing domain:', error);
      toast.error('Failed to remove domain');
    } finally {
      setDomainLoading(domainId, false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    setDomainLoading(domainId, true);
    try {
      const response = await fetch(`/api/domains/${domainId}`, {
        method: 'POST',
      });

      const result = await response.json();
      
      if (result.success && result.data.isVerified) {
        setDomains(prev => prev.map(d => 
          d.id === domainId 
            ? { ...d, isVerified: true, isActive: true }
            : d
        ));
        toast.success('Domain verified successfully!');
      } else {
        toast.error(result.message || 'Domain verification failed');
      }
    } catch (error) {
      console.error('Error verifying domain:', error);
      toast.error('Failed to verify domain');
    } finally {
      setDomainLoading(domainId, false);
    }
  };

  const handleToggleDomain = async (domainId: string) => {
    setDomainLoading(domainId, true);
    try {
      const response = await fetch(`/api/domains/${domainId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'toggle' }),
      });

      const result = await response.json();
      
      if (result.success) {
        setDomains(prev => prev.map(d => 
          d.id === domainId 
            ? { ...d, isActive: result.data.isActive }
            : d
        ));
        toast.success(result.message || 'Domain status updated');
      } else {
        toast.error(result.error || 'Failed to update domain');
      }
    } catch (error) {
      console.error('Error toggling domain:', error);
      toast.error('Failed to update domain');
    } finally {
      setDomainLoading(domainId, false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const getStatusBadge = (domain: DomainConfig) => {
    if (domain.isVerified && domain.isActive) {
      return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" />Active</Badge>;
    } else if (domain.isVerified && !domain.isActive) {
      return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Inactive</Badge>;
    } else {
      return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading domains...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Domain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Custom Domain
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newDomain">Domain Name</Label>
            <div className="flex gap-2">
              <Input
                id="newDomain"
                placeholder="yourdomain.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
              />
              <Button 
                onClick={handleAddDomain}
                disabled={!newDomain.trim() || isAdding}
              >
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {isAdding ? "Adding..." : "Add Domain"}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter your domain without "https://" or "www" (e.g., mydomain.com)
          </p>
        </CardContent>
      </Card>

      {/* Existing Domains */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Your Domains ({domains.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {domains.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No Custom Domains</h3>
              <p className="text-sm text-muted-foreground">
                Add your first custom domain to get started with branded links
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {domains.map((domain) => (
                <div key={domain.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{domain.domain}</h3>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => window.open(`https://${domain.domain}`, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Added on {new Date(domain.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(domain)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      {domain.isVerified ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">DNS Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-sm">SSL Certificate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{domain.verificationMethod}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">~50ms</span>
                    </div>
                  </div>

                  {!domain.isVerified && (
                    <div className="bg-muted p-3 rounded-lg mb-3">
                      <h4 className="font-medium text-sm mb-2">Verification Required</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Add this CNAME record to your domain's DNS settings:
                      </p>
                      <div className="bg-background p-2 rounded font-mono text-xs flex items-center justify-between">
                        <div>
                          <div>Type: CNAME</div>
                          <div>Name: @</div>
                          <div>Value: treebio.vercel.app</div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard('treebio.vercel.app')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <Separator className="my-3" />

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {!domain.isVerified && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleVerifyDomain(domain.id)}
                          disabled={loadingStates[domain.id]}
                        >
                          {loadingStates[domain.id] ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3 mr-1" />
                          )}
                          Verify Domain
                        </Button>
                      )}
                      {domain.isVerified && (
                        <Button 
                          size="sm" 
                          variant={domain.isActive ? "outline" : "default"}
                          onClick={() => handleToggleDomain(domain.id)}
                          disabled={loadingStates[domain.id]}
                        >
                          {loadingStates[domain.id] ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <Settings className="h-3 w-3 mr-1" />
                          )}
                          {domain.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleRemoveDomain(domain.id)}
                      disabled={loadingStates[domain.id]}
                    >
                      {loadingStates[domain.id] ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3 mr-1" />
                      )}
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Custom Domain Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Benefits</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Professional branded URLs</li>
                <li>• Increased trust and click-through rates</li>
                <li>• Better brand recognition</li>
                <li>• Custom domain analytics</li>
                <li>• SSL certificate included</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Setup Instructions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. Add your domain above</li>
                <li>2. Update your DNS settings</li>
                <li>3. Click "Verify Domain"</li>
                <li>4. Activate when verified</li>
                <li>5. Start using branded links!</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
