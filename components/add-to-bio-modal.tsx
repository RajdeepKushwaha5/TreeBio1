"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Link as LinkIcon,
  Eye,
  EyeOff,
  Trash2,
  GripVertical,
  ExternalLink,
  Check,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface AddToBioModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  currentLinks?: BioLink[];
}

interface BioLink {
  id?: string;
  title: string;
  url: string;
  description?: string;
  isVisible: boolean;
  order: number;
  isNew?: boolean;
}

export function AddToBioModal({ isOpen, onClose, username, currentLinks = [] }: AddToBioModalProps) {
  const [links, setLinks] = useState<BioLink[]>(currentLinks);
  const [newLink, setNewLink] = useState<Omit<BioLink, 'id' | 'order'>>({
    title: '',
    url: '',
    description: '',
    isVisible: true,
    isNew: true
  });
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

    const linkToAdd: BioLink = {
      ...newLink,
      id: `temp-${Date.now()}`,
      order: links.length,
      isNew: true
    };

    setLinks([...links, linkToAdd]);
    setNewLink({
      title: '',
      url: '',
      description: '',
      isVisible: true,
      isNew: true
    });
    setIsAddingLink(false);
    toast.success("Link added! Don't forget to save your changes.");
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
    toast.success("Link removed");
  };

  const updateLink = (id: string, updates: Partial<BioLink>) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, ...updates } : link
    ));
  };

  const toggleLinkVisibility = (id: string) => {
    updateLink(id, { isVisible: !links.find(l => l.id === id)?.isVisible });
  };

  const saveBioLinks = async () => {
    setIsSaving(true);
    try {
      // Simulate API call - in real implementation, this would save to database
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically make an API call to save the links
      // const response = await fetch('/api/bio-links', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, links })
      // });
      
      toast.success("Bio links saved successfully!");
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      toast.error("Failed to save bio links. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const previewBio = () => {
    const previewUrl = `${window.location.origin}/${username}`;
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  const hasChanges = links.some(link => link.isNew) || links.length !== currentLinks.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Manage Your Bio Links
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Bio Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Your TreeBio Profile</span>
                <Button onClick={previewBio} variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-mono text-sm text-blue-600 mb-2">
                  {typeof window !== 'undefined' ? `${window.location.origin}/${username}` : `https://yoursite.com/${username}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {links.filter(l => l.isVisible).length} visible links
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Existing Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Links ({links.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {links.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No links added yet</p>
                  <p className="text-sm">Add your first link below to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {links.map((link) => (
                    <div key={link.id} className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Title</Label>
                            <Input
                              value={link.title}
                              onChange={(e) => updateLink(link.id!, { title: e.target.value })}
                              placeholder="Link title"
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">URL</Label>
                            <Input
                              value={link.url}
                              onChange={(e) => updateLink(link.id!, { url: e.target.value })}
                              placeholder="https://..."
                              className="h-8"
                            />
                          </div>
                        </div>
                        
                        {link.description !== undefined && (
                          <div>
                            <Label className="text-xs">Description (Optional)</Label>
                            <Textarea
                              value={link.description}
                              onChange={(e) => updateLink(link.id!, { description: e.target.value })}
                              placeholder="Brief description..."
                              className="min-h-[60px] text-sm"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => toggleLinkVisibility(link.id!)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          {link.isVisible ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        
                        <Button
                          onClick={() => removeLink(link.id!)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add New Link */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add New Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isAddingLink ? (
                <Button
                  onClick={() => setIsAddingLink(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Link
                </Button>
              ) : (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="new-title">Title *</Label>
                      <Input
                        id="new-title"
                        value={newLink.title}
                        onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                        placeholder="My Awesome Link"
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-url">URL *</Label>
                      <Input
                        id="new-url"
                        type="url"
                        value={newLink.url}
                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        placeholder="https://example.com"
                        className="h-8"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="new-description">Description (Optional)</Label>
                    <Textarea
                      id="new-description"
                      value={newLink.description}
                      onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                      placeholder="Brief description of this link..."
                      className="min-h-[60px] text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="new-visible"
                        checked={newLink.isVisible}
                        onCheckedChange={(checked) => setNewLink({ ...newLink, isVisible: checked })}
                      />
                      <Label htmlFor="new-visible" className="text-sm">
                        Visible on profile
                      </Label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={addNewLink} size="sm">
                      <Check className="mr-2 h-4 w-4" />
                      Add Link
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingLink(false);
                        setNewLink({
                          title: '',
                          url: '',
                          description: '',
                          isVisible: true,
                          isNew: true
                        });
                      }}
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

          {/* Save Changes */}
          {hasChanges && (
            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-800">You have unsaved changes</p>
                    <p className="text-xs text-orange-700">Save your changes to update your bio profile</p>
                  </div>
                  <Button
                    onClick={saveBioLinks}
                    disabled={isSaving}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
