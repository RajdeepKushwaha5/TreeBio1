"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Plus,
  FolderPlus,
  Tag,
  Eye,
  EyeOff,
  Save,
  X,
  Link2,
  Palette,
  Loader2
} from "lucide-react";

interface Link {
  id: string;
  title: string;
  url: string;
  clickCount: number;
}

interface CustomTheme {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  borderRadius?: string;
  layout?: 'grid' | 'list' | 'card';
}

export default function AddCollectionPage() {
  const router = useRouter();
  const [collectionName, setCollectionName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [availableLinks, setAvailableLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customTheme, setCustomTheme] = useState<CustomTheme>({
    layout: 'list'
  });
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);

  // Fetch user's links
  useEffect(() => {
    fetchUserLinks();
  }, []);

  const fetchUserLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/collections/links');
      const data = await response.json();

      if (data.success) {
        setAvailableLinks(data.links || []);
      } else {
        toast.error('Failed to fetch links');
      }
    } catch (error) {
      console.error('Error fetching links:', error);
      toast.error('Failed to fetch links');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkToggle = (linkId: string) => {
    setSelectedLinks(prev => 
      prev.includes(linkId) 
        ? prev.filter(id => id !== linkId)
        : [...prev, linkId]
    );
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSaveCollection = async () => {
    if (!collectionName.trim()) {
      toast.error('Collection name is required');
      return;
    }

    if (selectedLinks.length === 0) {
      toast.error('Please select at least one link');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: collectionName,
          description: description || undefined,
          isPublic,
          tags,
          linkIds: selectedLinks,
          customTheme: customTheme
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Collection created successfully!');
        router.push('/admin/collections');
      } else {
        toast.error(data.error || 'Failed to create collection');
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (key: keyof CustomTheme, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading your links...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <FolderPlus className="h-8 w-8" />
          Add Collection
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create a new collection to organize your links
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="collectionName">Collection Name</Label>
                <Input
                  id="collectionName"
                  placeholder="e.g., Social Media Links, Work Projects"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this collection is about..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this collection visible on your public profile
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                  <Switch 
                    checked={isPublic} 
                    onCheckedChange={setIsPublic}
                  />
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1"
                />
                <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                        title="Remove tag"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Link Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Select Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableLinks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No links found. Create some links first.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => router.push('/admin')}
                  >
                    Add Links
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableLinks.map((link) => (
                    <div
                      key={link.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedLinks.includes(link.id)
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => handleLinkToggle(link.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded border-2 ${
                            selectedLinks.includes(link.id)
                              ? "bg-primary border-primary"
                              : "border-gray-300"
                          }`}>
                            {selectedLinks.includes(link.id) && (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-sm"></div>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{link.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {link.url}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">{link.clickCount} clicks</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Theme Customization */}
          {showThemeCustomizer && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme Customization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Layout</Label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={customTheme.layout}
                      onChange={(e) => handleThemeChange('layout', e.target.value)}
                      aria-label="Select layout style"
                      title="Choose layout style for the collection"
                    >
                      <option value="list">List</option>
                      <option value="grid">Grid</option>
                      <option value="card">Cards</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <Input
                      type="color"
                      value={customTheme.backgroundColor || "#ffffff"}
                      onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <Input
                      type="color"
                      value={customTheme.textColor || "#000000"}
                      onChange={(e) => handleThemeChange('textColor', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <Input
                      type="color"
                      value={customTheme.accentColor || "#3b82f6"}
                      onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">
                    {collectionName || "Collection Name"}
                  </h3>
                  {description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={isPublic ? "default" : "secondary"}>
                      {isPublic ? "Public" : "Private"}
                    </Badge>
                    <Badge variant="outline">
                      {selectedLinks.length} links
                    </Badge>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleSaveCollection}
                disabled={!collectionName.trim() || selectedLinks.length === 0 || saving}
                className="w-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Collection
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowThemeCustomizer(!showThemeCustomizer)}
              >
                <Palette className="h-4 w-4 mr-2" />
                Customize Appearance
              </Button>
              
              <Separator />
              
              <p className="text-xs text-muted-foreground text-center">
                Collections help organize your links into themed groups
              </p>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use descriptive names for easy identification</li>
                <li>• Group related links together (e.g., &ldquo;Social Media&rdquo;)</li>
                <li>• Public collections appear on your profile</li>
                <li>• Tags help with organization and search</li>
                <li>• You can reorder links within collections</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
