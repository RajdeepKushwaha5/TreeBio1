"use client";

import { useState, useEffect, memo } from "react";
import { TemplateConfig } from "@/lib/bio-templates";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram,
  Globe,
  Mail
} from "lucide-react";

interface TemplatePreviewProps {
  template: TemplateConfig;
  userData?: {
    name: string;
    bio: string;
    avatar: string;
    links: Array<{
      id: string;
      title: string;
      url: string;
      description?: string;
      isVisible?: boolean;
    }>;
    socialLinks: Array<{
      platform: string;
      url: string;
    }>;
  };
  className?: string;
}

const socialIcons = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  website: Globe,
  email: Mail
};

export function TemplatePreview({ template, userData, className }: TemplatePreviewProps) {
  const [mounted, setMounted] = useState(false);

  // Default data for preview
  const defaultData = {
    name: "Your Name",
    bio: "Your bio description goes here. Share what you do and what you're passionate about.",
    avatar: "",
    links: [
      { id: "1", title: "My Portfolio", url: "#", description: "Check out my work" },
      { id: "2", title: "Blog", url: "#", description: "Latest thoughts and ideas" },
      { id: "3", title: "Contact Me", url: "#", description: "Get in touch" }
    ],
    socialLinks: [
      { platform: "github", url: "#" },
      { platform: "twitter", url: "#" },
      { platform: "linkedin", url: "#" }
    ]
  };

  const data = userData || defaultData;
  const { styles } = template;

  useEffect(() => {
    setMounted(true);
    
    // Apply dynamic theme variables to CSS custom properties  
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--current-template-primary', styles.primaryColor);
      root.style.setProperty('--current-template-accent', styles.accentColor);
      root.style.setProperty('--current-template-bg', styles.backgroundColor);
      root.style.setProperty('--current-template-text', styles.textColor);
      root.style.setProperty('--current-template-card-bg', styles.cardBackground);
      root.style.setProperty('--current-template-button', styles.buttonColor);
      root.style.setProperty('--current-template-button-text', styles.buttonTextColor);
      root.style.setProperty('--current-template-border-radius', styles.borderRadius);
      root.style.setProperty('--current-template-font-family', styles.fontFamily);
      root.style.setProperty('--current-template-heading-weight', styles.headingWeight);
      root.style.setProperty('--current-template-body-weight', styles.bodyWeight);
    }
  }, [styles]);

  if (!mounted) {
    return (
      <div className={cn("w-full h-96 bg-muted animate-pulse rounded-lg", className)} />
    );
  }

  const containerClasses = cn(
    "w-full max-w-md mx-auto p-6 rounded-lg transition-all duration-500",
    "template-preview-container",
    styles.layout === 'card' && "space-y-4",
    styles.layout === 'vertical' && "space-y-6",
    styles.layout === 'grid' && "space-y-4",
    styles.spacing === 'compact' && "space-y-2",
    styles.spacing === 'spacious' && "space-y-8",
    className
  );

  const cardClasses = cn(
    "template-card p-4 transition-all duration-300",
    styles.shadowStyle === 'soft' && "shadow-sm",
    styles.shadowStyle === 'medium' && "shadow-md", 
    styles.shadowStyle === 'strong' && "shadow-lg",
    styles.shadowStyle === 'none' && "shadow-none"
  );

  const buttonClasses = cn(
    "template-button w-full mb-2 transition-all duration-200 hover:scale-[1.02]",
    styles.buttonStyle === 'pill' && "rounded-full",
    styles.buttonStyle === 'rounded' && "rounded-lg",
    styles.buttonStyle === 'sharp' && "rounded-none",
    "text-sm font-medium"
  );

  const avatarClasses = cn(
    styles.avatarStyle === 'circle' && "rounded-full",
    styles.avatarStyle === 'rounded' && "rounded-lg",
    styles.avatarStyle === 'square' && "rounded-none",
    styles.avatarSize === 'small' && "w-16 h-16",
    styles.avatarSize === 'medium' && "w-20 h-20", 
    styles.avatarSize === 'large' && "w-24 h-24"
  );

  return (
    <div className={cn("w-full template-preview-wrapper", className)}>
      <div className={containerClasses}>
      {/* Background pattern overlay */}
      {styles.backgroundPattern === 'dots' && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full template-bg-dots" />
        </div>
      )}

      {styles.backgroundPattern === 'gradient' && (
        <div className="absolute inset-0 opacity-20 pointer-events-none rounded-lg template-bg-gradient" />
      )}

      <Card className={cn(cardClasses, "template-card")}>
        {/* Profile Header */}
        <div className="text-center mb-6">
          <Avatar className={cn(avatarClasses, "mx-auto mb-4")}>
            <AvatarImage src={data.avatar} alt={data.name} />
            <AvatarFallback className="template-avatar-fallback">
              {data.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="template-name mb-2 font-bold text-lg">{data.name}</h1>
          <p className="template-bio text-sm">{data.bio}</p>
        </div>

        {/* Links */}
        <div className={cn(
          "space-y-3",
          styles.layout === 'grid' && "grid grid-cols-1 gap-3 space-y-0"
        )}>
          {data.links.map((link) => (
            <Button
              key={link.id}
              variant="outline"
              className={cn(buttonClasses, "template-button")}
              onClick={() => {
                if (link.url && link.url !== '#') {
                  window.open(link.url, '_blank', 'noopener,noreferrer');
                }
              }}
              disabled={!link.url || link.url === '#'}
              aria-label={`Visit ${link.title}${link.description ? `: ${link.description}` : ''}`}
            >
              <span className="flex flex-col">
                <span className="font-medium template-button-title">{link.title}</span>
                {link.description && (
                  <span className="text-xs template-button-description">{link.description}</span>
                )}
              </span>
            </Button>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-3 mt-6 pt-4 border-t template-social-border">
          {data.socialLinks.map((social) => {
            const Icon = socialIcons[social.platform as keyof typeof socialIcons];
            return Icon ? (
              <Button
                key={social.platform}
                size="sm"
                variant="ghost"
                className={cn(
                  "p-2 hover:scale-110 transition-transform template-social-icon",
                  styles.socialStyle === 'filled' && "bg-opacity-10",
                  styles.socialStyle === 'outlined' && "border",
                  styles.socialSize === 'small' && "w-8 h-8",
                  styles.socialSize === 'medium' && "w-10 h-10",
                  styles.socialSize === 'large' && "w-12 h-12"
                )}
                onClick={() => {
                  if (social.url && social.url !== '#') {
                    window.open(social.url, '_blank', 'noopener,noreferrer');
                  }
                }}
                disabled={!social.url || social.url === '#'}
                aria-label={`Visit ${social.platform} profile`}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ) : null;
          })}
        </div>
      </Card>

        {/* Template badge */}
        <div className="flex justify-center mt-4">
          <Badge variant="secondary" className="text-xs">
            {template.name} Template
          </Badge>
        </div>
      </div>
    </div>
  );
}

// Memoize the component for performance optimization
export default memo(TemplatePreview);
