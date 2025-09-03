"use client";

import React, { useRef, useCallback } from "react";
import QRCode from "react-qr-code";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Copy, 
  Twitter,
  Facebook,
  Linkedin,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface EnhancedQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}

export function EnhancedQRModal({ isOpen, onClose, url }: EnhancedQRModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const downloadQRCode = useCallback(() => {
    if (!qrRef.current) {
      return;
    }

    // Create a canvas from the SVG
    const svg = qrRef.current.querySelector('svg');
    if (!svg) {
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const data = new XMLSerializer().serializeToString(svg);
    const DOMURL = window.URL || window.webkitURL;
    const img = new Image();
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const url_obj = DOMURL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 400, 400);
      ctx.drawImage(img, 0, 0, 400, 400);
      DOMURL.revokeObjectURL(url_obj);

      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.download = `treebio-qr-${Date.now()}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          toast.success("QR Code downloaded successfully!");
        }
      });
    };

    img.src = url_obj;
  }, []);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }, [url]);

  const shareToSocial = useCallback((platform: 'twitter' | 'facebook' | 'linkedin') => {
    const text = `Check out my TreeBio profile!`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
    toast.success(`Opening ${platform}...`);
  }, [url]);

  const extractUsername = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 1] || 'profile';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-w-[95vw] mx-auto">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-xl font-semibold">Share Your TreeBio</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Scan the QR code or share your profile link
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Info */}
          <div className="text-center">
            <h3 className="font-medium text-lg">{extractUsername(url)}&apos;s TreeBio</h3>
            <div className="bg-muted rounded-md p-2 mt-2">
              <p className="text-sm text-muted-foreground break-all">{url}</p>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="relative bg-white p-4 rounded-lg shadow-sm border">
              {/* Decorative corner brackets */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br"></div>
              
              <div ref={qrRef}>
                <QRCode
                  value={url}
                  size={180}
                  level="M"
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
              </div>
            </div>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={copyToClipboard} variant="outline" className="w-full">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
            <Button onClick={downloadQRCode} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download QR
            </Button>
          </div>

          {/* Divider */}
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or share via</span>
          </div>

          {/* Social Sharing */}
          <div className="grid grid-cols-3 gap-3">
            <Button 
              onClick={() => shareToSocial('twitter')} 
              variant="outline" 
              className="w-full p-3 hover:bg-blue-50 hover:border-blue-200"
            >
              <Twitter className="h-5 w-5 text-blue-500" />
            </Button>
            <Button 
              onClick={() => shareToSocial('facebook')} 
              variant="outline" 
              className="w-full p-3 hover:bg-blue-50 hover:border-blue-200"
            >
              <Facebook className="h-5 w-5 text-blue-600" />
            </Button>
            <Button 
              onClick={() => shareToSocial('linkedin')} 
              variant="outline" 
              className="w-full p-3 hover:bg-blue-50 hover:border-blue-200"
            >
              <Linkedin className="h-5 w-5 text-blue-700" />
            </Button>
          </div>

          {/* Footer Instructions */}
          <div className="text-center pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Point your camera at the QR code to open the profile
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
