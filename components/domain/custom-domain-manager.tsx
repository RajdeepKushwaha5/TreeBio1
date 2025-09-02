"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Globe, 
  Plus, 
  Check, 
  X, 
  AlertCircle, 
  ExternalLink,
  Shield,
  Clock
} from "lucide-react";
import type { DomainConfig } from "@/lib/custom-domain";

interface CustomDomainManagerProps {
  domains?: DomainConfig[];
  onAddDomain?: (domain: string) => void;
  onRemoveDomain?: (domainId: string) => void;
  onVerifyDomain?: (domainId: string) => void;
  onToggleDomain?: (domainId: string) => void;
}

export function CustomDomainManager({
  domains = [],
  onAddDomain,
  onRemoveDomain,
  onVerifyDomain,
  onToggleDomain
}: CustomDomainManagerProps) {
  const [newDomain, setNewDomain] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return;
    
    setIsAdding(true);
    if (onAddDomain) {
      onAddDomain(newDomain.trim());
    }
    setTimeout(() => {
      setIsAdding(false);
      setNewDomain("");
    }, 2000);
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
              />
              <Button 
                onClick={handleAddDomain}
                disabled={!newDomain.trim() || isAdding}
              >
                {isAdding ? "Adding..." : "Add Domain"}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter your domain without &ldquo;https://&rdquo; or &ldquo;www&rdquo;
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
          <div className="space-y-4">
            {domains.map((domain) => (
              <div key={domain.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{domain.domain}</h3>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Added on {domain.createdAt.toLocaleDateString()}
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
                    {domain.sslCertificate ? (
                      <Shield className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
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

                <Separator className="my-3" />

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {!domain.isVerified && (
                      <Button size="sm" variant="outline">
                        Verify Domain
                      </Button>
                    )}
                    {domain.isVerified && !domain.isActive && (
                      <Button size="sm">
                        Activate
                      </Button>
                    )}
                    {domain.isVerified && domain.isActive && (
                      <Button size="sm" variant="outline">
                        Deactivate
                      </Button>
                    )}
                  </div>
                  <Button size="sm" variant="destructive">
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Domain Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">DNS Method (Recommended)</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Add a CNAME record to your domain&apos;s DNS settings:
              </p>
              <div className="bg-muted p-3 rounded font-mono text-sm">
                Type: CNAME<br />
                Name: @<br />
                Value: treebio.vercel.app
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Custom branded URLs for all your links</li>
                <li>• Automatic SSL certificate generation</li>
                <li>• Global CDN for fast loading</li>
                <li>• Analytics tracking maintained</li>
                <li>• Professional appearance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
