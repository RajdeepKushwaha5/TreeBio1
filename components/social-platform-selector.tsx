"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Globe, Check, ExternalLink, AlertCircle } from 'lucide-react';
import { socialPlatforms, SocialPlatform, SocialPlatformService } from '@/lib/social-platforms';
import { cn } from '@/lib/utils';

interface SocialPlatformSelectorProps {
  selectedPlatform?: string;
  url?: string;
  onSelect: (platform: SocialPlatform, url: string) => void;
  onUrlChange: (url: string) => void;
  className?: string;
}

export function SocialPlatformSelector({
  selectedPlatform,
  url = '',
  onSelect,
  onUrlChange,
  className
}: SocialPlatformSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isValid, setIsValid] = useState(true);

  // Get categories
  const categories = useMemo(() => {
    const cats = SocialPlatformService.getCategories();
    return [{ id: 'all', name: 'All', count: socialPlatforms.length }, ...cats];
  }, []);

  // Filter platforms
  const filteredPlatforms = useMemo(() => {
    let platforms = socialPlatforms;

    // Filter by category
    if (selectedCategory !== 'all') {
      platforms = platforms.filter(p => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      platforms = SocialPlatformService.searchPlatforms(searchQuery)
        .filter(p => selectedCategory === 'all' || p.category === selectedCategory);
    }

    return platforms;
  }, [selectedCategory, searchQuery]);

  // Get popular platforms for quick access
  const popularPlatforms = SocialPlatformService.getPopularPlatforms();

  // Current selected platform
  const currentPlatform = selectedPlatform ? SocialPlatformService.getPlatform(selectedPlatform) : null;

  // Validate URL when it changes
  const handleUrlChange = (newUrl: string) => {
    onUrlChange(newUrl);
    
    if (currentPlatform && newUrl) {
      const valid = SocialPlatformService.validateUrl(currentPlatform.id, newUrl);
      setIsValid(valid);
    } else {
      setIsValid(true);
    }
  };

  // Handle platform selection
  const handlePlatformSelect = (platform: SocialPlatform) => {
    onSelect(platform, url);
    if (url) {
      const valid = SocialPlatformService.validateUrl(platform.id, url);
      setIsValid(valid);
    }
  };

  const PlatformCard = ({ platform, isSelected }: { platform: SocialPlatform; isSelected: boolean }) => {
    const IconComponent = platform.brandIcon;
    
    return (
      <Card 
        className={cn(
          "cursor-pointer transition-all hover:shadow-md border-2",
          isSelected 
            ? "border-primary bg-primary/5 shadow-md" 
            : "border-border hover:border-primary/50"
        )}
        onClick={() => handlePlatformSelect(platform)}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: `${platform.color}15`, color: platform.color }}
            >
              <IconComponent size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{platform.displayName}</h3>
              <p className="text-xs text-muted-foreground truncate">{platform.description}</p>
              <Badge variant="outline" className="text-xs mt-1">
                {platform.category}
              </Badge>
            </div>
            {isSelected && (
              <Check size={16} className="text-primary flex-shrink-0" />
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Current Selection */}
      {currentPlatform && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <span style={{ color: currentPlatform.color }}>
                <currentPlatform.brandIcon size={16} className="shrink-0" />
              </span>
              <span>{currentPlatform.displayName}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Label htmlFor="platform-url" className="text-sm">URL</Label>
              <div className="relative">
                <Input
                  id="platform-url"
                  type="url"
                  placeholder={currentPlatform.placeholderUrl}
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className={cn(
                    "pr-10",
                    !isValid && url && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {url && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isValid ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <AlertCircle size={16} className="text-destructive" />
                    )}
                  </div>
                )}
              </div>
              {!isValid && url && (
                <p className="text-xs text-destructive">
                  Please enter a valid {currentPlatform.displayName} URL
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Example: {currentPlatform.placeholderUrl}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentPlatform ? 'Change Platform' : 'Select Platform'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Popular Platforms */}
          {!currentPlatform && (
            <div className="space-y-3 mb-6">
              <Label className="text-sm font-medium">Popular Platforms</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {popularPlatforms.map((platform) => {
                  const IconComponent = platform.brandIcon;
                  return (
                    <Button
                      key={platform.id}
                      variant="outline"
                      size="sm"
                      className="h-auto p-3 flex flex-col items-center space-y-1"
                      onClick={() => handlePlatformSelect(platform)}
                    >
                      <span style={{ color: platform.color }}>
                        <IconComponent size={16} />
                      </span>
                      <span className="text-xs">{platform.displayName}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full Platform Selection */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Search size={16} className="mr-2" />
                Browse All Platforms
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Select Social Platform</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search platforms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Tabs */}
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="w-full">
                    {categories.slice(0, 6).map((category) => (
                      <TabsTrigger key={category.id} value={category.id} className="flex-1">
                        {category.name} ({category.count})
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value={selectedCategory} className="mt-4">
                    <div className="max-h-96 overflow-y-auto">
                      {filteredPlatforms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {filteredPlatforms.map((platform) => (
                            <PlatformCard
                              key={platform.id}
                              platform={platform}
                              isSelected={selectedPlatform === platform.id}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Globe size={48} className="mx-auto mb-2 opacity-50" />
                          <p>No platforms found</p>
                          <p className="text-sm">Try adjusting your search or category filter</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* URL Preview */}
      {url && isValid && (
        <Card className="bg-muted/50">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 text-sm">
              <ExternalLink size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground">Preview:</span>
              <code className="text-xs bg-background px-2 py-1 rounded">
                {SocialPlatformService.formatUrlForDisplay(url)}
              </code>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SocialPlatformSelector;
