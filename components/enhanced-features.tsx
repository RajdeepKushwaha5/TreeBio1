"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Zap,
  Globe,
  BarChart3,
  Shield,
  Smartphone,
  Palette,
  Users,
  Bell,
  Settings,
  Crown,
  ChevronRight,
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
  category: 'analytics' | 'customization' | 'domain' | 'automation' | 'premium';
  plan?: 'free' | 'pro' | 'enterprise';
  comingSoon?: boolean;
}

interface EnhancedFeaturesProps {
  userPlan?: 'free' | 'pro' | 'enterprise';
  onFeatureToggle?: (featureId: string, enabled: boolean) => void;
  onUpgrade?: () => void;
}

export default function EnhancedFeatures({ 
  userPlan = 'free', 
  onFeatureToggle,
  onUpgrade 
}: EnhancedFeaturesProps) {
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: 'enhanced-analytics',
      name: 'Enhanced Analytics',
      description: 'Advanced insights with charts, trends, and detailed metrics',
      icon: BarChart3,
      enabled: true,
      category: 'analytics',
      plan: 'free'
    },
    {
      id: 'custom-domains',
      name: 'Custom Domains',
      description: 'Use your own domain for professional branded links',
      icon: Globe,
      enabled: true,
      category: 'domain',
      plan: 'free'
    },
    {
      id: 'real-time-updates',
      name: 'Real-time Updates',
      description: 'Live updates across all devices and sessions',
      icon: Zap,
      enabled: true,
      category: 'automation',
      plan: 'free'
    },
    {
      id: 'archive-management',
      name: 'Archive Management',
      description: 'Organize and manage your archived links and data',
      icon: Shield,
      enabled: true,
      category: 'analytics',
      plan: 'free'
    },
    {
      id: 'mobile-optimization',
      name: 'Mobile Optimization',
      description: 'Optimized mobile experience with responsive design',
      icon: Smartphone,
      enabled: true,
      category: 'customization',
      plan: 'free'
    },
    {
      id: 'custom-themes',
      name: 'Custom Themes',
      description: 'Personalize your link tree with custom colors and layouts',
      icon: Palette,
      enabled: false,
      category: 'customization',
      plan: 'pro',
      comingSoon: true
    },
    {
      id: 'advanced-targeting',
      name: 'Advanced Targeting',
      description: 'Show different content based on visitor location or device',
      icon: Users,
      enabled: false,
      category: 'automation',
      plan: 'pro',
      comingSoon: true
    },
    {
      id: 'email-notifications',
      name: 'Email Notifications',
      description: 'Get notified about clicks, views, and important events',
      icon: Bell,
      enabled: false,
      category: 'automation',
      plan: 'pro',
      comingSoon: true
    },
    {
      id: 'api-access',
      name: 'API Access',
      description: 'Programmatic access to your data and link management',
      icon: Settings,
      enabled: false,
      category: 'premium',
      plan: 'enterprise',
      comingSoon: true
    },
    {
      id: 'white-label',
      name: 'White Label',
      description: 'Remove TreeBio branding and use your own',
      icon: Crown,
      enabled: false,
      category: 'premium',
      plan: 'enterprise',
      comingSoon: true
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleFeatureToggle = async (featureId: string, enabled: boolean) => {
    const feature = features.find(f => f.id === featureId);
    
    if (!feature) return;

    // Check if user has access to this feature
    if (feature.plan === 'pro' && userPlan === 'free') {
      toast.error('This feature requires a Pro plan');
      if (onUpgrade) onUpgrade();
      return;
    }

    if (feature.plan === 'enterprise' && userPlan !== 'enterprise') {
      toast.error('This feature requires an Enterprise plan');
      if (onUpgrade) onUpgrade();
      return;
    }

    if (feature.comingSoon) {
      toast.info('This feature is coming soon!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Update local state
      setFeatures(prev => prev.map(f => 
        f.id === featureId ? { ...f, enabled } : f
      ));

      // Call parent handler if provided
      if (onFeatureToggle) {
        await onFeatureToggle(featureId, enabled);
      }

      toast.success(`${feature.name} ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Feature toggle error:', error);
      toast.error('Failed to update feature setting');
      
      // Revert local state on error
      setFeatures(prev => prev.map(f => 
        f.id === featureId ? { ...f, enabled: !enabled } : f
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'analytics': return 'Analytics & Insights';
      case 'customization': return 'Customization';
      case 'domain': return 'Domain Management';
      case 'automation': return 'Automation';
      case 'premium': return 'Premium Features';
      default: return 'Features';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'analytics': return BarChart3;
      case 'customization': return Palette;
      case 'domain': return Globe;
      case 'automation': return Zap;
      case 'premium': return Crown;
      default: return Settings;
    }
  };

  const getPlanBadge = (plan?: string) => {
    switch (plan) {
      case 'free':
        return <Badge variant="secondary">Free</Badge>;
      case 'pro':
        return <Badge variant="default">Pro</Badge>;
      case 'enterprise':
        return <Badge variant="outline" className="border-purple-500 text-purple-700">Enterprise</Badge>;
      default:
        return null;
    }
  };

  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) acc[feature.category] = [];
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  const getFeatureStats = () => {
    const enabled = features.filter(f => f.enabled).length;
    const available = features.filter(f => !f.comingSoon && (
      f.plan === 'free' || 
      (f.plan === 'pro' && userPlan !== 'free') ||
      (f.plan === 'enterprise' && userPlan === 'enterprise')
    )).length;
    
    return { enabled, available, total: features.length };
  };

  const stats = getFeatureStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Zap className="h-6 w-6" />
            Enhanced Features
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your advanced features and capabilities
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{stats.enabled}/{stats.total}</div>
          <div className="text-sm text-muted-foreground">Features Enabled</div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{stats.enabled}</div>
                <div className="text-sm text-muted-foreground">Active Features</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{stats.available}</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{features.filter(f => f.comingSoon).length}</div>
                <div className="text-sm text-muted-foreground">Coming Soon</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Categories */}
      <div className="space-y-6">
        {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => {
          const CategoryIcon = getCategoryIcon(category);
          
          return (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CategoryIcon className="h-5 w-5" />
                  {getCategoryTitle(category)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryFeatures.map((feature, index) => (
                  <div key={feature.id}>
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3 flex-1">
                        <feature.icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{feature.name}</h4>
                            {getPlanBadge(feature.plan)}
                            {feature.comingSoon && (
                              <Badge variant="outline" className="text-xs">
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {feature.enabled && !feature.comingSoon && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              // Navigate to feature page or open modal
                              toast.info(`Opening ${feature.name} settings`);
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                        
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked)}
                          disabled={isLoading || feature.comingSoon || 
                            (feature.plan === 'pro' && userPlan === 'free') ||
                            (feature.plan === 'enterprise' && userPlan !== 'enterprise')
                          }
                        />
                      </div>
                    </div>
                    
                    {index < categoryFeatures.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upgrade CTA */}
      {userPlan === 'free' && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    Unlock Premium Features
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Upgrade to Pro or Enterprise for advanced customization and automation
                  </p>
                </div>
              </div>
              <Button onClick={onUpgrade} className="bg-blue-600 hover:bg-blue-700">
                Upgrade Now
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}