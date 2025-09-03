"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Share,
  Copy,
  ListFilter,
  QrCode,
  ChevronRight,
  Check,
  Globe,
} from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";
import { EnhancedQRModal } from "@/components/enhanced-qr-modal";
import { SocialShareModal } from "@/components/social-share-modal";
import { AddToBioModal } from "@/components/add-to-bio-modal";

const ShareMenu = ({ username }: { username: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const fullLink = `${origin}/${username}`;

  const handleCopy = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(fullLink)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast.error("Failed to copy link");
      });
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleAddToBio = () => {
    setShowBioModal(true);
  };

  const handleQRCode = () => {
    setShowQRModal(true);
  };

  const handleShareTo = () => {
    setShowShareModal(true);
  };

  const handleOpen = () => {
    window.open(fullLink, '_blank');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" size="default">
            <Share className="h-4 w-4" /> Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-4">
          <div className="flex items-center justify-between mb-4">
            <DropdownMenuLabel className="text-lg font-semibold">
              Share your TreeBio
            </DropdownMenuLabel>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Get more visitors by sharing your TreeBio everywhere.
          </p>
          <div className="flex w-full items-center space-x-2 mb-4">
            <Input type="text" value={fullLink} readOnly className="flex-1" />
            <Button type="button" onClick={handleCopy}>
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <Button
              variant="ghost"
              className="w-full justify-start px-2 py-1.5 h-auto"
              onClick={handleAddToBio}
            >
              <ListFilter className="mr-2 h-4 w-4" />
              Add to bio
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <Button
              variant="ghost"
              className="w-full justify-start px-2 py-1.5 h-auto"
              onClick={handleQRCode}
            >
              <QrCode className="mr-2 h-4 w-4" />
              QR code
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <Button
              variant="ghost"
              className="w-full justify-start px-2 py-1.5 h-auto"
              onClick={handleShareTo}
            >
              <Share className="mr-2 h-4 w-4" />
              Share to...
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <Button
              variant="ghost"
              className="w-full justify-start px-2 py-1.5 h-auto"
              onClick={handleOpen}
            >
              <Globe className="mr-2 h-4 w-4" />
              Open
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Enhanced QR Code Modal */}
      <EnhancedQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        url={fullLink}
        title={`${username}'s TreeBio`}
      />

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={fullLink}
        title={`Check out ${username}'s TreeBio!`}
        description="Discover all their links and social media in one place."
        hashtags={["TreeBio", "LinkInBio", username]}
      />

      {/* Add to Bio Modal */}
      <AddToBioModal
        isOpen={showBioModal}
        onClose={() => setShowBioModal(false)}
        username={username}
        currentLinks={[]}
      />
    </>
  );
};

export default ShareMenu;
