"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Trash2,
  Edit3,
  GripVertical, 
  Link as LinkIcon,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Globe,
  Mail,
  Eye,
  EyeOff,
  Undo2,
  User
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ContentEditorProps {
  userData: UserData;
  onUserDataChange: (data: UserData) => void;
  className?: string;
}

interface UserData {
  name: string;
  bio: string;
  avatar: string;
  links: Array<{
    id: string;
    title: string;
    url: string;
    description?: string;
    isVisible: boolean;
    order: number;
  }>;
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
  }>;
}

interface NewLinkData {
  title: string;
  url: string;
  description: string;
  isVisible: boolean;
}

const socialPlatforms = [
  { name: 'Instagram', icon: Instagram, platform: 'instagram' },
  { name: 'Twitter', icon: Twitter, platform: 'twitter' },
  { name: 'LinkedIn', icon: Linkedin, platform: 'linkedin' },
  { name: 'GitHub', icon: Github, platform: 'github' },
  { name: 'Website', icon: Globe, platform: 'website' },
  { name: 'Email', icon: Mail, platform: 'email' }
];

export function ContentEditor({ userData, onUserDataChange, className }: ContentEditorProps) {
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [newLink, setNewLink] = useState<NewLinkData>({
    title: '',
    url: '',
    description: '',
    isVisible: true
  });
  const [newSocial, setNewSocial] = useState({
    platform: 'instagram',
    url: ''
  });
  const [originalData, setOriginalData] = useState<UserData>(userData);
  
  // Update original data when userData prop changes
  useEffect(() => {
    setOriginalData(userData);
  }, [userData]);

  const updateUserData = (updates: Partial<UserData>) => {
    const updatedData = { ...userData, ...updates };
    onUserDataChange(updatedData);
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const addNewLink = () => {
    if (!newLink.title.trim()) {
      toast.error("Please enter a title for your link");
      return;
    }

    if (!newLink.url.trim()) {
      toast.error("Please enter a URL for your link");
      return;
    }

    if (!validateUrl(newLink.url)) {
      toast.error("Please enter a valid URL (include http:// or https://)");
      return;
    }

    const linkToAdd = {
      id: `link-${Date.now()}`,
      title: newLink.title,
      url: newLink.url,
      description: newLink.description,
      isVisible: newLink.isVisible,
      order: userData.links.length
    };

    updateUserData({
      links: [...userData.links, linkToAdd]
    });

    setNewLink({
      title: '',
      url: '',
      description: '',
      isVisible: true
    });
    setIsAddingLink(false);
    toast.success("Link added successfully!");
  };

  const updateLink = (id: string, updates: Partial<typeof userData.links[0]>) => {
    const updatedLinks = userData.links.map(link =>
      link.id === id ? { ...link, ...updates } : link
    );
    updateUserData({ links: updatedLinks });
  };

  const removeLink = (id: string) => {
    const updatedLinks = userData.links.filter(link => link.id !== id);
    updateUserData({ links: updatedLinks });
    toast.success("Link removed");
  };

  const addSocialLink = () => {
    if (!newSocial.url.trim()) {
      toast.error("Please enter a URL for your social link");
      return;
    }

    if (!validateUrl(newSocial.url)) {
      toast.error("Please enter a valid URL (include http:// or https://)");
      return;
    }

    // If editing existing social link
    if (editingSocialId) {
      updateSocialLink();
      return;
    }

    // Check if platform already exists (only for new links)
    const existingPlatform = userData.socialLinks.find(s => s.platform === newSocial.platform);
    if (existingPlatform) {
      toast.error("You already have a link for this platform");
      return;
    }

    const socialToAdd = {
      id: `social-${Date.now()}`,
      platform: newSocial.platform,
      url: newSocial.url
    };

    updateUserData({
      socialLinks: [...userData.socialLinks, socialToAdd]
    });

    setNewSocial({ platform: 'instagram', url: '' });
    setIsAddingSocial(false);
    toast.success("Social link added successfully!");
  };

  const removeSocialLink = (id: string) => {
    const updatedSocialLinks = userData.socialLinks.filter(social => social.id !== id);
    updateUserData({ socialLinks: updatedSocialLinks });
    toast.success("Social link removed");
  };

  const startEditingSocial = (social: typeof userData.socialLinks[0]) => {
    setEditingSocialId(social.id);
    setNewSocial({
      platform: social.platform,
      url: social.url
    });
    setIsAddingSocial(true);
  };

  const updateSocialLink = () => {
    if (!editingSocialId) {
      return;
    }
    
    if (!newSocial.url.trim()) {
      toast.error("Please enter a URL for your social link");
      return;
    }

    if (!validateUrl(newSocial.url)) {
      toast.error("Please enter a valid URL (include http:// or https://)");
      return;
    }

    const updatedSocialLinks = userData.socialLinks.map(social =>
      social.id === editingSocialId 
        ? { ...social, platform: newSocial.platform, url: newSocial.url }
        : social
    );

    updateUserData({ socialLinks: updatedSocialLinks });
    
    setEditingSocialId(null);
    setNewSocial({ platform: 'instagram', url: '' });
    setIsAddingSocial(false);
    toast.success("Social link updated successfully!");
  };

  const cancelSocialEdit = () => {
    setEditingSocialId(null);
    setNewSocial({ platform: 'instagram', url: '' });
    setIsAddingSocial(false);
  };

  const resetToOriginal = () => {
    onUserDataChange(originalData);
    setIsAddingLink(false);
    setIsAddingSocial(false);
    setEditingSocialId(null);
    toast.success("Changes reset to original");
  };

  const getSocialIcon = (platform: string) => {
    const socialPlatform = socialPlatforms.find(p => p.platform === platform);
    return socialPlatform?.icon || Globe;
  };

  const getSocialName = (platform: string) => {
    const socialPlatform = socialPlatforms.find(p => p.platform === platform);
    return socialPlatform?.name || platform;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500/10 to-blue-500/20 rounded-xl flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-primary/10 to-primary/20 text-primary">
                  {userData.name?.slice(0, 2).toUpperCase() || "UN"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 flex gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 w-7 rounded-full p-0"
                  onClick={() => {
                    const url = prompt("Enter avatar URL:", userData.avatar);
                    if (url !== null) {
                      updateUserData({ avatar: url });
                    }
                  }}
                  title="Add image URL"
                >
                  <LinkIcon className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 w-7 rounded-full p-0"
                  onClick={() => {
                    // For now, just provide some default avatars
                    const defaultAvatars = [
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=" + userData.name,
                      "https://api.dicebear.com/7.x/initials/svg?seed=" + userData.name,
                      "https://api.dicebear.com/7.x/personas/svg?seed=" + userData.name,
                      ""
                    ];
                    const choice = prompt(
                      "Choose avatar:\n1. Generated Avatar\n2. Initials\n3. Abstract\n4. Remove Avatar\n\nEnter number (1-4):"
                    );
                    const index = parseInt(choice || "0") - 1;
                    if (index >= 0 && index < defaultAvatars.length) {
                      updateUserData({ avatar: defaultAvatars[index] });
                      toast.success("Avatar updated!");
                    }
                  }}
                  title="Choose default avatar"
                >
                  <User className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Your Name</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => updateUserData({ name: e.target.value })}
                  placeholder="Enter your name"
                  className="text-lg font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">Bio Description</Label>
                <Textarea
                  id="bio"
                  value={userData.bio}
                  onChange={(e) => updateUserData({ bio: e.target.value })}
                  placeholder="Tell people about yourself..."
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 rounded-xl flex items-center justify-center">
                <LinkIcon className="h-4 w-4 text-emerald-600" />
              </div>
              Your Links ({userData.links.length})
            </div>
            <Button
              onClick={() => setIsAddingLink(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Link
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userData.links.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No links added yet</p>
              <p className="text-sm">Add your first link to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userData.links.map((link, index) => (
                <div key={link.id} className="group p-4 border rounded-xl bg-card hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-muted-foreground">Title</Label>
                          <Input
                            value={link.title}
                            onChange={(e) => updateLink(link.id, { title: e.target.value })}
                            placeholder="Link title"
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-muted-foreground">URL</Label>
                          <Input
                            value={link.url}
                            onChange={(e) => updateLink(link.id, { url: e.target.value })}
                            placeholder="https://example.com"
                            className="h-9"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-muted-foreground">Description (Optional)</Label>
                        <Textarea
                          value={link.description || ''}
                          onChange={(e) => updateLink(link.id, { description: e.target.value })}
                          placeholder="Brief description..."
                          className="min-h-[60px] resize-none"
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={link.isVisible}
                          onCheckedChange={(checked) => updateLink(link.id, { isVisible: checked })}
                        />
                        <Label className="text-xs">{link.isVisible ? 'Visible' : 'Hidden'}</Label>
                      </div>
                      
                      <Button
                        onClick={() => removeLink(link.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Order: {index + 1}
                    </Badge>
                    {link.isVisible ? (
                      <Badge variant="default" className="text-xs bg-green-500/10 text-green-700 hover:bg-green-500/20">
                        <Eye className="h-3 w-3 mr-1" />
                        Visible
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs bg-gray-500/10 text-gray-600">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Hidden
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Link Form */}
          {isAddingLink && (
            <div className="p-4 border-2 border-dashed border-primary/20 rounded-xl bg-primary/5 space-y-4">
              <h4 className="font-semibold text-lg">Add New Link</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="new-title">Title *</Label>
                  <Input
                    id="new-title"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    placeholder="My Portfolio"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-url">URL *</Label>
                  <Input
                    id="new-url"
                    type="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="new-description">Description</Label>
                <Textarea
                  id="new-description"
                  value={newLink.description}
                  onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                  placeholder="Check out my work"
                  className="resize-none"
                  rows={2}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new-visible"
                    checked={newLink.isVisible}
                    onCheckedChange={(checked) => setNewLink({ ...newLink, isVisible: checked })}
                  />
                  <Label htmlFor="new-visible">Visible on profile</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={addNewLink} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Link
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAddingLink(false);
                      setNewLink({ title: '', url: '', description: '', isVisible: true });
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Links Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500/10 to-purple-500/20 rounded-xl flex items-center justify-center">
                <Instagram className="h-4 w-4 text-purple-600" />
              </div>
              Social Links ({userData.socialLinks.length})
            </div>
            <Button
              onClick={() => setIsAddingSocial(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Social
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userData.socialLinks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Instagram className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No social links added yet</p>
              <p className="text-sm">Connect your social media profiles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {userData.socialLinks.map((social) => {
                const Icon = getSocialIcon(social.platform);
                return (
                  <div key={social.id} className="group p-3 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{getSocialName(social.platform)}</p>
                        <p className="text-xs text-muted-foreground truncate">{social.url}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => startEditingSocial(social)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                          title="Edit social link"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => removeSocialLink(social.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Delete social link"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add/Edit Social Form */}
          {isAddingSocial && (
            <div className="p-4 border-2 border-dashed border-primary/20 rounded-xl bg-primary/5 space-y-4">
              <h4 className="font-semibold text-lg">
                {editingSocialId ? 'Edit Social Link' : 'Add Social Link'}
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="social-platform">Platform *</Label>
                  <select
                    id="social-platform"
                    value={newSocial.platform}
                    onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    title="Select social media platform"
                    disabled={!!editingSocialId} // Disable platform change when editing
                  >
                    {socialPlatforms.map(platform => (
                      <option key={platform.platform} value={platform.platform}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                  {editingSocialId && (
                    <p className="text-xs text-muted-foreground">Platform cannot be changed when editing</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="social-url">URL *</Label>
                  <Input
                    id="social-url"
                    type="url"
                    value={newSocial.url}
                    onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addSocialLink} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  {editingSocialId ? 'Update Social Link' : 'Add Social Link'}
                </Button>
                <Button
                  onClick={cancelSocialEdit}
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="border-amber-200 bg-amber-50/30 dark:bg-amber-950/10 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-semibold text-amber-800 dark:text-amber-200">Real-time Preview Active</p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                All changes are instantly reflected in the preview. No need to save manually.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={resetToOriginal}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Undo2 className="h-4 w-4" />
                Reset Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
