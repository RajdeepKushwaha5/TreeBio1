"use client";

import React, { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Copy, 
  Share2, 
  MessageCircle,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Check,
  Smartphone
} from "lucide-react";
import { toast } from "sonner";

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  description?: string;
  hashtags?: string[];
}

interface SocialPlatform {
  name: string;
  icon: React.ReactNode;
  color: string;
  shareUrl: (url: string, text: string, hashtags?: string[]) => string;
  description: string;
}

export function SocialShareModal({ 
  isOpen, 
  onClose, 
  url, 
  title = "Check out my TreeBio profile!",
  description = "Discover all my links and social media in one place.",
  hashtags = ["TreeBio", "LinkInBio", "SocialMedia"]
}: SocialShareModalProps) {
  const [customMessage, setCustomMessage] = useState(title);
  const [isCopied, setIsCopied] = useState(false);

  const socialPlatforms: SocialPlatform[] = [
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      color: "#1877F2",
      shareUrl: (url, text) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      description: "Share on Facebook"
    },
    {
      name: "Twitter/X",
      icon: <Twitter className="h-5 w-5" />,
      color: "#000000",
      shareUrl: (url, text, hashtags) => {
        const hashtagsText = hashtags ? hashtags.map(tag => `#${tag}`).join(' ') : '';
        return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtagsText.replace(/# /g, ''))}`;
      },
      description: "Share on Twitter/X"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      color: "#0077B5",
      shareUrl: (url, text) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
      description: "Share on LinkedIn"
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "#25D366",
      shareUrl: (url, text) => `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      description: "Share via WhatsApp"
    },
    {
      name: "Email",
      icon: <Mail className="h-5 w-5" />,
      color: "#EA4335",
      shareUrl: (url, text) => `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(description + "\n\n" + url)}`,
      description: "Share via Email"
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      color: "#E4405F",
      shareUrl: () => `https://www.instagram.com/`,
      description: "Copy link for Instagram story"
    }
  ];

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error("Failed to copy link");
    }
  }, []);

  const isNativeShareAvailable = typeof navigator !== 'undefined' && 'share' in navigator;

  const shareNatively = useCallback(async () => {
    if (isNativeShareAvailable) {
      try {
        await navigator.share({
          title: title,
          text: customMessage,
          url: url
        });
        toast.success("Shared successfully!");
      } catch (error) {
        const err = error as Error;
        if (err.name !== 'AbortError') {
          console.error('Native share failed:', error);
          toast.error("Failed to share");
        }
      }
    } else {
      toast.error("Native sharing not supported on this device");
    }
  }, [url, title, customMessage, isNativeShareAvailable]);

  const shareOnPlatform = useCallback((platform: SocialPlatform) => {
    const shareUrl = platform.shareUrl(url, customMessage, hashtags);
    
    if (platform.name === 'Instagram') {
      // Instagram doesn't support direct sharing, so copy link
      copyToClipboard(url);
      toast.info("Link copied! Paste it in your Instagram story or bio");
      return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    toast.success(`Opening ${platform.name}...`);
  }, [url, customMessage, hashtags, copyToClipboard]);

  const generateHashtagsText = () => {
    return hashtags.map(tag => `#${tag}`).join(' ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your TreeBio
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="social" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="native">
              <Smartphone className="mr-2 h-4 w-4" />
              Native Share
            </TabsTrigger>
            <TabsTrigger value="custom">Customize</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Choose Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {socialPlatforms.map((platform) => (
                    <Button
                      key={platform.name}
                      onClick={() => shareOnPlatform(platform)}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-20 hover:bg-opacity-10 transition-colors"
                      style={{ 
                        borderColor: platform.color + '40',
                        color: platform.color
                      }}
                    >
                      {platform.icon}
                      <span className="text-xs font-medium">{platform.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Copy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex w-full items-center space-x-2">
                  <Input 
                    type="text" 
                    value={url} 
                    readOnly 
                    className="flex-1 font-mono text-sm"
                  />
                  <Button 
                    onClick={() => copyToClipboard(url)}
                    size="sm"
                    variant={isCopied ? "default" : "outline"}
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="native" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Native Device Sharing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use your device&apos;s built-in sharing options to share across all your apps.
                </p>
                
                <div className="space-y-3">
                  <Button
                    onClick={shareNatively}
                    className="w-full"
                    disabled={!isNativeShareAvailable}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    {isNativeShareAvailable ? "Open Share Menu" : "Native Share Not Available"}
                  </Button>
                  
                  {!isNativeShareAvailable && (
                    <p className="text-xs text-muted-foreground text-center">
                      Native sharing is not supported on this device. Use the social media options above.
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">What will be shared:</h4>
                    <div className="bg-muted p-3 rounded-md text-sm">
                      <p className="font-medium">{title}</p>
                      <p className="text-muted-foreground">{customMessage}</p>
                      <p className="font-mono text-xs text-blue-600 mt-2">{url}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customize Your Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Share Message</label>
                  <Textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter your custom message..."
                    className="min-h-[100px]"
                    maxLength={280}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {customMessage.length}/280 characters
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Hashtags</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-md">
                    {hashtags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {generateHashtagsText()}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={() => copyToClipboard(customMessage + " " + url + " " + generateHashtagsText())}
                    className="w-full"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Custom Message & Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
