"use client";

// QR Code Generator Admin Page
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  Download, 
  Share2, 
  Copy,
  Settings2
} from "lucide-react";
import QRCodeGenerator from "@/components/qr-code-generator";

export default function QRCodeGeneratorPage() {
  const [selectedLink, setSelectedLink] = useState("");
  const [customData, setCustomData] = useState("");
  const [qrType, setQrType] = useState<"link" | "custom">("link");

  // Mock data - replace with real data from your links
  const userLinks = [
    { id: "1", title: "GitHub Profile", url: "https://github.com/username", clicks: 245 },
    { id: "2", title: "Portfolio Website", url: "https://portfolio.com", clicks: 189 },
    { id: "3", title: "LinkedIn", url: "https://linkedin.com/in/username", clicks: 156 },
    { id: "4", title: "Blog", url: "https://blog.example.com", clicks: 98 }
  ];

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <QrCode className="h-8 w-8" />
          QR Code Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Generate QR codes for your links with customizable styling options
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Configuration */}
        <div className="space-y-6">
          {/* Data Source Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Data Source
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={qrType === "link" ? "default" : "outline"}
                  onClick={() => setQrType("link")}
                  className="flex-1"
                >
                  Your Links
                </Button>
                <Button
                  variant={qrType === "custom" ? "default" : "outline"}
                  onClick={() => setQrType("custom")}
                  className="flex-1"
                >
                  Custom Data
                </Button>
              </div>

              {qrType === "link" && (
                <div className="space-y-3">
                  <Label>Select a Link</Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {userLinks.map((link) => (
                      <div
                        key={link.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedLink === link.url
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedLink(link.url)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{link.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {link.url}
                            </p>
                          </div>
                          <Badge variant="secondary">{link.clicks} clicks</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {qrType === "custom" && (
                <div className="space-y-3">
                  <Label htmlFor="customData">Custom Data</Label>
                  <Textarea
                    id="customData"
                    placeholder="Enter any text, URL, or data you want to encode..."
                    value={customData}
                    onChange={(e) => setCustomData(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    You can encode URLs, text, contact information, WiFi credentials, and more.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download PNG
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download SVG
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Copy to Clipboard
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share QR Code
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* QR Code History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent QR Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">GitHub Profile</p>
                    <p className="text-sm text-muted-foreground">Generated 2 hours ago</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Portfolio Website</p>
                    <p className="text-sm text-muted-foreground">Generated yesterday</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Contact Card</p>
                    <p className="text-sm text-muted-foreground">Generated 3 days ago</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Generator Component */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Generated QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QRCodeGenerator 
                defaultValue={qrType === "link" ? selectedLink : customData}
                title="QR Code Preview"
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* QR Code Info */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Type:</span>
                <span className="font-medium">
                  {qrType === "link" ? "URL" : "Custom Text"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium">200x200 px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Error Correction:</span>
                <span className="font-medium">Medium (15%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Length:</span>
                <span className="font-medium">
                  {(qrType === "link" ? selectedLink : customData).length} characters
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Higher error correction helps if QR code gets damaged</li>
                <li>• Darker colors provide better scanning reliability</li>
                <li>• Test your QR code with multiple devices before printing</li>
                <li>• Include a call-to-action near your QR code</li>
                <li>• SVG format is better for print materials</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
