"use client";

import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

interface QRCodeGeneratorProps {
  defaultValue?: string;
  title?: string;
  className?: string;
}

export default function QRCodeGenerator({ 
  defaultValue = "", 
  title = "QR Code Generator",
  className = "" 
}: QRCodeGeneratorProps) {
  const [url, setUrl] = useState(defaultValue);
  const [size, setSize] = useState(256);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [includeMargin, setIncludeMargin] = useState(true);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [fgColor, setFgColor] = useState('#000000');
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    if (!url.trim()) {
      toast.error("Please enter a URL to generate QR code");
      return;
    }

    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success("QR Code downloaded successfully!");
    }
  };

  const copyQRCode = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL to generate QR code");
      return;
    }

    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          const item = new ClipboardItem({ "image/png": blob });
          navigator.clipboard.write([item]).then(() => {
            toast.success("QR Code copied to clipboard!");
          }).catch(() => {
            toast.error("Failed to copy QR Code");
          });
        }
      });
    }
  };

  const shareQRCode = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL to generate QR code");
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TreeBio QR Code',
          text: `Check out this QR code for: ${url}`,
          url: url
        });
        toast.success("QR Code shared successfully!");
      } catch (error) {
        toast.error("Failed to share QR Code");
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!");
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <Label htmlFor="qr-url">URL or Text</Label>
          <Input
            id="qr-url"
            type="text"
            placeholder="Enter URL or text to generate QR code"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
          />
        </div>

        {/* QR Code Display */}
        {url.trim() && (
          <div className="flex flex-col items-center space-y-4">
            <div 
              ref={qrRef}
              className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-200"
            >
              <QRCodeCanvas
                value={url}
                size={size}
                level={errorCorrectionLevel}
                includeMargin={includeMargin}
                bgColor={bgColor}
                fgColor={fgColor}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap justify-center">
              <Button onClick={downloadQRCode} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={copyQRCode} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button onClick={shareQRCode} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        )}

        {/* Customization Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="size">Size (px)</Label>
            <Select value={size.toString()} onValueChange={(value) => setSize(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="128">128px</SelectItem>
                <SelectItem value="256">256px</SelectItem>
                <SelectItem value="512">512px</SelectItem>
                <SelectItem value="1024">1024px</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="error-correction">Error Correction</Label>
            <Select 
              value={errorCorrectionLevel} 
              onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => setErrorCorrectionLevel(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Low (7%)</SelectItem>
                <SelectItem value="M">Medium (15%)</SelectItem>
                <SelectItem value="Q">Quartile (25%)</SelectItem>
                <SelectItem value="H">High (30%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bg-color">Background Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fg-color">Foreground Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                type="text"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="include-margin"
            checked={includeMargin}
            onChange={(e) => setIncludeMargin(e.target.checked)}
            className="rounded"
            aria-label="Include margin around QR code"
          />
          <Label htmlFor="include-margin" className="text-sm">
            Include margin around QR code
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
