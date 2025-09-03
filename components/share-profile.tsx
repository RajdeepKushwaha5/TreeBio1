"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { 
  Share2, 
  Copy, 
  ExternalLink, 
  QrCode,
  Twitter,
  Facebook,
  Linkedin,
  Check,
  Download
} from "lucide-react";
import { toast } from "sonner";

interface ShareProfileProps {
  username?: string;
  userData: {
    name: string;
    bio: string;
    avatar: string;
  };
  className?: string;
}

export function ShareProfile({ username = "your-username", userData, className }: ShareProfileProps) {
  const [copied, setCopied] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  
  // Generate the profile URL
  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://treebio.com'}/${username}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Profile link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy link");
    }
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector('#qr-code-canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `treebio-${username}-qr.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success("QR Code downloaded successfully!");
    }
  };

  const shareOnSocial = (platform: string) => {
    const text = `Check out ${userData.name}'s TreeBio profile!`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(profileUrl);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const openPreview = () => {
    window.open(profileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500/10 to-green-500/20 rounded-xl flex items-center justify-center">
            <Share2 className="h-4 w-4 text-green-600" />
          </div>
          Share Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile URL */}
        <div className="space-y-2">
          <Label htmlFor="profile-url">Your TreeBio URL</Label>
          <div className="flex gap-2">
            <Input
              id="profile-url"
              value={profileUrl}
              readOnly
              className="flex-1 font-mono text-sm bg-muted/50"
            />
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Share this link with anyone to showcase your profile
          </p>
        </div>

        {/* Preview Button */}
        <div className="flex justify-center">
          <Button
            onClick={openPreview}
            variant="outline"
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Preview Profile
          </Button>
        </div>

        {/* QR Code & Share Options */}
        <div className="text-center space-y-3">
          <Label>Share Your TreeBio</Label>
          <div className="flex gap-3 justify-center">
            <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                >
                  <QrCode className="h-4 w-4" />
                  Share & QR Code
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-w-[95vw] mx-auto">
              <DialogHeader className="text-center pb-4">
                <DialogTitle className="text-xl font-semibold">Share Your TreeBio</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Scan the QR code or share your profile link
                </p>
              </DialogHeader>
              
              <div className="flex flex-col items-center space-y-6 px-2">
                {/* QR Code Section */}
                <div className="relative">
                  <div className="bg-white p-6 rounded-xl border-2 shadow-sm">
                    <QRCodeCanvas 
                      id="qr-code-canvas"
                      value={profileUrl}
                      size={180}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                  {/* Decorative corner elements */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br"></div>
                </div>

                {/* Profile Info */}
                <div className="text-center space-y-2">
                  <h3 className="font-medium text-foreground">{userData.name}&apos;s TreeBio</h3>
                  <div className="bg-muted/50 rounded-lg p-3 max-w-sm">
                    <p className="text-xs text-muted-foreground font-mono break-all">
                      {profileUrl}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="gap-2 h-11"
                      onClick={copyToClipboard}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 h-11"
                      onClick={downloadQRCode}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  
                  {/* Share via Social */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or share via</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                      onClick={() => shareOnSocial('twitter')}
                    >
                      <Twitter className="h-4 w-4" />
                      <span className="hidden sm:inline">Twitter</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600"
                      onClick={() => shareOnSocial('facebook')}
                    >
                      <Facebook className="h-4 w-4" />
                      <span className="hidden sm:inline">Facebook</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                      onClick={() => shareOnSocial('linkedin')}
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="hidden sm:inline">LinkedIn</span>
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Usage Statistics (placeholder) */}
        <div className="p-3 bg-muted/20 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            Your profile has been viewed <span className="font-semibold text-foreground">0</span> times
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            (Analytics coming soon)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
