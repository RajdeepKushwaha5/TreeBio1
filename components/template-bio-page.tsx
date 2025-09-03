"use client";

import { useTemplateManager } from "@/hooks/useTemplateManager";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram,
  Globe,
  Mail,
  ExternalLink
} from "lucide-react";

interface TemplateBioPageProps {
  userData: {
    name: string;
    bio: string;
    avatar: string;
    links: Array<{
      id: string;
      title: string;
      url: string;
      description?: string;
      icon?: string;
    }>;
    socialLinks: Array<{
      platform: string;
      url: string;
    }>;
  };
  className?: string;
  isPreview?: boolean;
}

const socialIcons = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  website: Globe,
  email: Mail
};

export function TemplateBioPage({ userData, className, isPreview = false }: TemplateBioPageProps) {
  const { currentTemplate, getTemplateVars } = useTemplateManager();
  
  if (!currentTemplate) {
    return (
      <div className={cn("w-full max-w-md mx-auto p-6 space-y-6", className)}>
        <DefaultBioLayout userData={userData} />
      </div>
    );
  }

  const templateVars = getTemplateVars();
  const styles = currentTemplate.styles;

  const containerClasses = cn(
    "w-full max-w-md mx-auto p-6 template-container",
    styles.layout === 'card' && "template-layout-card",
    styles.layout === 'vertical' && "template-layout-vertical", 
    styles.layout === 'grid' && "template-layout-grid",
    styles.spacing === 'compact' && "template-spacing-compact",
    styles.spacing === 'spacious' && "template-spacing-spacious",
    "template-spacing-normal",
    isPreview && "template-preview-container",
    className
  );

  const cardClasses = cn(
    "template-card p-6",
    styles.shadowStyle === 'soft' && "template-shadow-soft",
    styles.shadowStyle === 'medium' && "template-shadow-medium",
    styles.shadowStyle === 'strong' && "template-shadow-strong",
    styles.shadowStyle === 'none' && "template-shadow-none"
  );

  const buttonClasses = cn(
    "template-button w-full mb-3 transition-all duration-200 hover:template-hover",
    styles.buttonStyle === 'pill' && "template-button-pill",
    styles.buttonStyle === 'rounded' && "template-button-rounded", 
    styles.buttonStyle === 'sharp' && "template-button-sharp",
    styles.buttonStyle === 'gradient' && "template-button-gradient",
    "text-sm font-medium"
  );

  const avatarClasses = cn(
    styles.avatarStyle === 'circle' && "template-avatar-circle",
    styles.avatarStyle === 'rounded' && "template-avatar-rounded",
    styles.avatarStyle === 'square' && "template-avatar-square",
    styles.avatarSize === 'small' && "template-avatar-small",
    styles.avatarSize === 'medium' && "template-avatar-medium",
    styles.avatarSize === 'large' && "template-avatar-large"
  );

  return (
    <div className={containerClasses} style={templateVars}>
      {/* Background pattern overlay */}
      {styles.backgroundPattern === 'dots' && (
        <div className="absolute inset-0 template-bg-dots template-preview-overlay" />
      )}
      {styles.backgroundPattern === 'waves' && (
        <div className="absolute inset-0 template-bg-waves template-preview-overlay" />
      )}
      {styles.backgroundPattern === 'gradient' && (
        <div className="absolute inset-0 template-bg-gradient-primary template-preview-overlay" />
      )}

      <Card className={cardClasses}>
        {/* Profile Header */}
        <div className="text-center mb-6">
          <Avatar className={cn(avatarClasses, "mx-auto mb-4")}>
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback className="template-bg-accent template-text-white">
              {userData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h1 className={cn(
            "template-heading mb-2",
            styles.fontSize === 'small' && "template-font-small",
            styles.fontSize === 'medium' && "template-font-medium",
            styles.fontSize === 'large' && "template-font-large"
          )}>
            {userData.name}
          </h1>
          
          <p className={cn(
            "template-body opacity-80",
            styles.fontSize === 'small' && "text-xs",
            styles.fontSize === 'medium' && "text-sm",
            styles.fontSize === 'large' && "text-base"
          )}>
            {userData.bio}
          </p>
        </div>

        {/* Links */}
        <div className={cn(
          "space-y-3",
          styles.layout === 'grid' && "grid grid-cols-1 gap-3 space-y-0"
        )}>
          {userData.links.map((link) => (
            <Button
              key={link.id}
              variant="outline"
              className={buttonClasses}
              asChild
            >
              <a 
                href={isPreview ? undefined : link.url}
                onClick={isPreview ? (e) => e.preventDefault() : undefined}
                className="flex flex-col relative"
              >
                <span className="font-medium">{link.title}</span>
                {link.description && (
                  <span className="text-xs opacity-80">{link.description}</span>
                )}
                {!isPreview && (
                  <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
                )}
              </a>
            </Button>
          ))}
        </div>

        {/* Social Links */}
        {userData.socialLinks.length > 0 && (
          <div className="flex justify-center gap-3 mt-6 pt-4 border-t template-border-accent border-opacity-20">
            {userData.socialLinks.map((social) => {
              const Icon = socialIcons[social.platform as keyof typeof socialIcons];
              return Icon ? (
                <Button
                  key={social.platform}
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "p-2 template-text-accent hover:template-bg-accent hover:text-white",
                    styles.socialStyle === 'filled' && "template-social-filled",
                    styles.socialStyle === 'outlined' && "template-social-outlined",
                    styles.socialStyle === 'minimal' && "template-social-minimal",
                    styles.socialSize === 'small' && "template-social-small",
                    styles.socialSize === 'medium' && "template-social-medium", 
                    styles.socialSize === 'large' && "template-social-large"
                  )}
                  asChild
                >
                  <a 
                    href={isPreview ? undefined : social.url}
                    onClick={isPreview ? (e) => e.preventDefault() : undefined}
                    target={isPreview ? undefined : "_blank"}
                    rel={isPreview ? undefined : "noopener noreferrer"}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                </Button>
              ) : null;
            })}
          </div>
        )}
      </Card>

      {/* Template attribution (only in preview) */}
      {isPreview && (
        <div className="text-center mt-4">
          <span className="text-xs text-muted-foreground px-3 py-1 bg-background/80 rounded-full border">
            {currentTemplate.name} Template
          </span>
        </div>
      )}
    </div>
  );
}

// Default layout for when no template is selected
function DefaultBioLayout({ userData }: { userData: TemplateBioPageProps['userData'] }) {
  return (
    <Card className="p-6 space-y-6">
      <div className="text-center">
        <Avatar className="w-20 h-20 mx-auto mb-4">
          <AvatarImage src={userData.avatar} alt={userData.name} />
          <AvatarFallback>
            {userData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-semibold mb-2">{userData.name}</h1>
        <p className="text-muted-foreground text-sm">{userData.bio}</p>
      </div>

      <div className="space-y-3">
        {userData.links.map((link) => (
          <Button key={link.id} variant="outline" className="w-full" asChild>
            <a href={link.url} className="flex flex-col">
              <span className="font-medium">{link.title}</span>
              {link.description && (
                <span className="text-xs text-muted-foreground">{link.description}</span>
              )}
            </a>
          </Button>
        ))}
      </div>

      {userData.socialLinks.length > 0 && (
        <div className="flex justify-center gap-3 pt-4 border-t">
          {userData.socialLinks.map((social) => {
            const Icon = socialIcons[social.platform as keyof typeof socialIcons];
            return Icon ? (
              <Button key={social.platform} size="sm" variant="ghost" asChild>
                <a href={social.url} target="_blank" rel="noopener noreferrer">
                  <Icon className="w-4 h-4" />
                </a>
              </Button>
            ) : null;
          })}
        </div>
      )}
    </Card>
  );
}
