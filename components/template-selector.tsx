"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Palette,
  Eye,
  Check,
  Sparkles,
  Zap,
  Briefcase,
  Heart,
  Monitor,
  Coffee,
  Moon
} from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./template-selector.module.css";
import { TemplateConfig, BUILT_IN_TEMPLATES, getTemplatesByCategory } from "@/lib/bio-templates";
import { toast } from "sonner";

interface TemplateSelectorProps {
  currentTemplate?: string;
  onTemplateSelect: (template: TemplateConfig) => void;
  onPreview?: (template: TemplateConfig) => void;
  className?: string;
}

const categoryIcons = {
  minimalist: Monitor,
  vibrant: Zap,
  professional: Briefcase,
  creative: Heart
};

const categoryColors = {
  minimalist: "bg-slate-100 text-slate-800 border-slate-200",
  vibrant: "bg-pink-100 text-pink-800 border-pink-200",
  professional: "bg-blue-100 text-blue-800 border-blue-200",
  creative: "bg-purple-100 text-purple-800 border-purple-200"
};

export function TemplateSelector({
  currentTemplate,
  onTemplateSelect,
  onPreview,
  className
}: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState<string | null>(null);

  const categories = ['all', 'minimalist', 'vibrant', 'professional', 'creative'];

  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') return BUILT_IN_TEMPLATES;
    return getTemplatesByCategory(selectedCategory as TemplateConfig['category']);
  };

  const handleTemplateSelect = async (template: TemplateConfig) => {
    setIsApplying(template.id);
    try {
      await onTemplateSelect(template);
      toast.success(`Applied ${template.name} template!`);
    } catch (error) {
      toast.error('Failed to apply template');
      console.error('Template selection error:', error);
    } finally {
      setIsApplying(null);
    }
  };

  const handlePreview = (template: TemplateConfig) => {
    if (onPreview) {
      onPreview(template);
      toast.info(`Previewing ${template.name} template`);
    }
  };

  const getTemplateIcon = (template: TemplateConfig) => {
    const icons = {
      minimalist: Monitor,
      vibrant: Sparkles,
      professional: Briefcase,
      'nature': Heart,
      'modern-dark': Moon,
      'warm-coffee': Coffee
    };
    const IconComponent = icons[template.id as keyof typeof icons] || Palette;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header - More prominent */}
      <div className="text-center space-y-4 flex-shrink-0">
        <h2 className="text-2xl lg:text-3xl font-bold flex items-center justify-center gap-3">
          <Palette className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
          Choose Your Template
        </h2>
        <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Select from our professionally designed templates to get started quickly. Each template is fully responsive and customizable with colors, fonts, and layouts.
        </p>
      </div>

      {/* Category Filter - Enhanced */}
      <div className="flex flex-wrap justify-center gap-3 lg:gap-4 flex-shrink-0">
        {categories.map((category) => {
          const Icon = category !== 'all' ? categoryIcons[category as keyof typeof categoryIcons] : Palette;
          return (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="default"
              onClick={() => setSelectedCategory(category)}
              className="capitalize gap-2 text-sm lg:text-base px-4 lg:px-6 py-2 lg:py-3 font-medium transition-all hover:scale-105"
            >
              {Icon && <Icon className="h-4 w-4 lg:h-5 lg:w-5" />}
              <span>
                {category === 'all' ? 'All Templates' : category}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Templates Grid - Improved layout without extra scrolling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 pb-4">
        {getFilteredTemplates().map((template) => (
          <Card
            key={template.id}
            className={cn(
              "group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer border-2 h-auto min-h-[480px] lg:min-h-[520px] flex flex-col",
              currentTemplate === template.id 
                ? "ring-4 ring-primary ring-offset-4 border-primary/50 shadow-xl" 
                : "border-border/50 hover:border-primary/40",
              hoveredTemplate === template.id && "shadow-2xl border-primary/60"
            )}
            onMouseEnter={() => {
              setHoveredTemplate(template.id);
              onPreview?.(template);
            }}
            onMouseLeave={() => setHoveredTemplate(null)}
            onClick={() => handleTemplateSelect(template)}
          >
            {/* Enhanced Template Preview - Optimized for 70% width with proper height */}
            <div
              className="h-40 lg:h-44 xl:h-48 relative overflow-hidden flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${template.styles.backgroundColor} 0%, ${template.styles.primaryColor}20 100%)`
              }}
            >
              {/* Mini preview elements with improved spacing */}
              <div className="absolute inset-0 p-6 lg:p-7 space-y-4">
                <div
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full mx-auto transition-transform group-hover:scale-110 shadow-lg"
                  style={{ backgroundColor: template.styles.accentColor }}
                />
                <div className="space-y-2.5">
                  <div
                    className="h-2 lg:h-2.5 rounded-full mx-auto transition-all group-hover:scale-105"
                    style={{
                      backgroundColor: template.styles.textColor,
                      width: '70%'
                    }}
                  />
                  <div
                    className="h-1.5 lg:h-2 rounded-full mx-auto transition-all group-hover:scale-105"
                    style={{
                      backgroundColor: template.styles.textColor,
                      opacity: 0.6,
                      width: '50%'
                    }}
                  />
                </div>
                <div className="space-y-2.5 mt-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-3 lg:h-3.5 mx-auto transition-all group-hover:scale-105 shadow-sm"
                      style={{
                        backgroundColor: template.styles.buttonColor,
                        width: '75%',
                        borderRadius: template.styles.buttonStyle === 'pill' ? '16px' :
                          template.styles.buttonStyle === 'rounded' ? '8px' : '0px'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Current template indicator - Enhanced */}
              {currentTemplate === template.id && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground text-sm font-bold shadow-xl border-2 border-background">
                    <Check className="h-4 w-4 mr-1" />
                    <span>Active</span>
                  </Badge>
                </div>
              )}

              {/* Preview overlay on hover - Enhanced */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[1px]">
                <div className="bg-background/95 backdrop-blur-sm rounded-xl px-4 py-2 text-sm font-semibold shadow-xl border border-border/50">
                  Click to select template
                </div>
              </div>
            </div>

            <CardHeader className="pb-3 px-5 lg:px-6 pt-4 lg:pt-5 flex-shrink-0">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="flex items-center gap-2.5 text-lg lg:text-xl font-bold group-hover:text-primary transition-colors">
                  <div className="flex-shrink-0">
                    {getTemplateIcon(template)}
                  </div>
                  <span className="truncate">{template.name}</span>
                </CardTitle>
                <Badge 
                  variant="outline"
                  className={cn(
                    categoryColors[template.category], 
                    "text-xs lg:text-sm flex-shrink-0 font-semibold border-2 px-2 py-1"
                  )}
                >
                  {template.category}
                </Badge>
              </div>
              <CardDescription className={cn("text-sm lg:text-base leading-relaxed mt-2", styles["line-clamp-2"])}>
                {template.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 px-5 lg:px-6 pb-5 lg:pb-6 flex-1 flex flex-col justify-between">
              <div className="space-y-3 lg:space-y-4 flex-1">
                {/* Template features - Always visible now with improved spacing */}
                <div className="flex flex-wrap gap-2 lg:gap-2.5">
                  <Badge variant="secondary" className="text-xs lg:text-sm px-2 py-1 font-medium">
                    {template.styles.fontFamily.split(',')[0]}
                  </Badge>
                  <Badge variant="secondary" className="text-xs lg:text-sm px-2 py-1 font-medium">
                    {template.styles.layout}
                  </Badge>
                  <Badge variant="secondary" className="text-xs lg:text-sm px-2 py-1 font-medium">
                    {template.styles.buttonStyle} style
                  </Badge>
                </div>

                {/* Action buttons - Enhanced and always visible */}
                <div className="flex gap-2.5 lg:gap-3 mt-4 pt-2 border-t border-border/30">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(template);
                    }}
                    className="flex-1 gap-1.5 text-xs lg:text-sm h-9 lg:h-10 font-semibold hover:bg-primary/5 hover:border-primary/40 transition-all hover:scale-[1.02]"
                    disabled={!onPreview}
                  >
                    <Eye className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateSelect(template);
                    }}
                    disabled={currentTemplate === template.id || isApplying === template.id}
                    className="flex-1 gap-1.5 text-xs lg:text-sm h-9 lg:h-10 font-semibold transition-all hover:scale-[1.02]"
                  >
                    {isApplying === template.id ? (
                      <>
                        <div className="h-3.5 w-3.5 lg:h-4 lg:w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Applying...</span>
                      </>
                    ) : currentTemplate === template.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <Palette className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                        <span>Select</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {getFilteredTemplates().length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No templates found in this category.</p>
        </div>
      )}

      <Separator />

      {/* Additional info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          All templates are fully responsive and mobile-friendly.
          You can customize colors, fonts, and layouts after selecting a template.
        </p>
      </div>
    </div>
  );
}
