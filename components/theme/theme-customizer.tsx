"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Palette, Paintbrush, Monitor, Sun, Moon, Wand2, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import "./theme-customizer.css";

interface CustomTheme {
  primaryColor: string;
  accentColor: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  layout?: 'grid' | 'list' | 'card';
}

export function ThemeCustomizer() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [customTheme, setCustomTheme] = useState<CustomTheme>({
    primaryColor: '#3b82f6',
    accentColor: '#10b981'
  });
  const [previewTheme, setPreviewTheme] = useState<CustomTheme | null>(null);

  // Preset theme colors
  const presetThemes = [
    { name: 'Violet', primaryColor: '#8b5cf6', accentColor: '#a855f7' },
    { name: 'Rose', primaryColor: '#f43f5e', accentColor: '#e11d48' },
    { name: 'Orange', primaryColor: '#f97316', accentColor: '#ea580c' },
    { name: 'Emerald', primaryColor: '#10b981', accentColor: '#059669' },
    { name: 'Blue', primaryColor: '#3b82f6', accentColor: '#2563eb' },
    { name: 'Indigo', primaryColor: '#6366f1', accentColor: '#4f46e5' }
  ];

  const displayModes = [
    { name: 'Light', value: 'light', icon: Sun },
    { name: 'Dark', value: 'dark', icon: Moon },
    { name: 'System', value: 'system', icon: Monitor }
  ];

  useEffect(() => {
    setMounted(true);
    // Load saved custom theme from localStorage
    const savedTheme = localStorage.getItem('custom-theme');
    if (savedTheme) {
      try {
        setCustomTheme(JSON.parse(savedTheme));
      } catch (error) {
        console.error('Error parsing saved theme:', error);
      }
    }
  }, []);

  const applyThemeVariables = useCallback((themeConfig: CustomTheme) => {
    const root = document.documentElement;
    
    // Convert hex to HSL for CSS variables
    const primaryHsl = hexToHsl(themeConfig.primaryColor);
    const accentHsl = hexToHsl(themeConfig.accentColor);
    
    root.style.setProperty('--primary', primaryHsl);
    root.style.setProperty('--accent', accentHsl);
    root.style.setProperty('--primary-color', themeConfig.primaryColor);
    root.style.setProperty('--accent-color', themeConfig.accentColor);
    
    if (themeConfig.backgroundColor) {
      root.style.setProperty('--background', hexToHsl(themeConfig.backgroundColor));
    }
    if (themeConfig.textColor) {
      root.style.setProperty('--foreground', hexToHsl(themeConfig.textColor));
    }
    if (themeConfig.borderRadius) {
      root.style.setProperty('--radius', themeConfig.borderRadius);
    }
  }, []);

  useEffect(() => {
    // Apply theme preview in real-time
    if (previewTheme && mounted) {
      applyThemeVariables(previewTheme);
    }
    
    // Set background colors for preset theme swatches
    if (mounted) {
      const presetSwatches = document.querySelectorAll('[data-primary-color], [data-accent-color]');
      presetSwatches.forEach((swatch) => {
        const element = swatch as HTMLElement;
        const primaryColor = element.getAttribute('data-primary-color');
        const accentColor = element.getAttribute('data-accent-color');
        
        if (primaryColor) {
          element.style.backgroundColor = primaryColor;
        }
        if (accentColor) {
          element.style.backgroundColor = accentColor;
        }
      });
    }
  }, [previewTheme, mounted, applyThemeVariables]);

  const hexToHsl = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      return '214 100% 59%'; // fallback
    }
    
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const handlePresetThemeSelect = (preset: { primaryColor: string; accentColor: string }) => {
    const newTheme = {
      ...customTheme,
      primaryColor: preset.primaryColor,
      accentColor: preset.accentColor
    };
    setCustomTheme(newTheme);
    setPreviewTheme(newTheme);
  };

  const handleColorChange = (colorType: 'primaryColor' | 'accentColor', value: string) => {
    const newTheme = {
      ...customTheme,
      [colorType]: value
    };
    setCustomTheme(newTheme);
    setPreviewTheme(newTheme);
    
    // Update CSS custom properties for swatches
    const root = document.documentElement;
    if (colorType === 'primaryColor') {
      root.style.setProperty('--primary-color', value);
    } else {
      root.style.setProperty('--accent-color', value);
    }
  };

  const handleDisplayModeChange = (mode: string) => {
    setTheme(mode);
    toast.success(`Display mode changed to ${mode}`);
  };

  const handleApplyTheme = async () => {
    try {
      // Use preview theme if available, otherwise use current custom theme
      const themeToApply = previewTheme || customTheme;
      
      // Save custom theme to localStorage
      localStorage.setItem('custom-theme', JSON.stringify(themeToApply));
      
      // Apply the theme variables
      applyThemeVariables(themeToApply);
      
      // Here you would typically save to your backend/database
      // await saveUserTheme(themeToApply);
      
      toast.success('Theme applied successfully!');
      setPreviewTheme(null);
    } catch (error) {
      console.error('Error applying theme:', error);
      toast.error('Failed to apply theme');
    }
  };

  const handleResetToDefault = () => {
    const defaultTheme = {
      primaryColor: '#3b82f6',
      accentColor: '#10b981'
    };
    setCustomTheme(defaultTheme);
    setPreviewTheme(defaultTheme);
    localStorage.removeItem('custom-theme');
    
    // Reset CSS variables to default
    const root = document.documentElement;
    root.style.removeProperty('--primary');
    root.style.removeProperty('--primary-rgb');
    root.style.removeProperty('--accent');
    root.style.removeProperty('--accent-rgb');
    
    toast.success('Theme reset to default');
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-10 xl:space-y-12">
      {/* Preset Theme Colors - Enhanced Layout */}
      <div className="space-y-4 lg:space-y-6">
        <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold flex items-center gap-3 lg:gap-4 tracking-tight">
          <div className="w-8 lg:w-10 xl:w-12 h-8 lg:h-10 xl:h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center">
            <Palette className="h-4 lg:h-5 xl:h-6 w-4 lg:w-5 xl:w-6 text-primary" />
          </div>
          Preset Color Themes
        </h3>
        <p className="text-base lg:text-lg text-muted-foreground">Choose from professionally designed color combinations</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {presetThemes.map((preset) => (
            <div
              key={preset.name}
              className={cn(
                "p-4 lg:p-6 border-2 rounded-xl lg:rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md",
                customTheme.primaryColor === preset.primaryColor && 
                customTheme.accentColor === preset.accentColor
                  ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10 ring-2 ring-primary/20 shadow-md"
                  : "border-border hover:border-primary/30 bg-gradient-to-br from-card/50 to-card/80"
              )}
              onClick={() => handlePresetThemeSelect(preset)}
            >
              <div className="flex items-center gap-4 lg:gap-5">
                <div className="flex gap-1 lg:gap-2">
                  <div 
                    className={`w-8 lg:w-10 xl:w-12 h-8 lg:h-10 xl:h-12 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110`}
                    data-primary-color={preset.primaryColor}
                    title={`Primary: ${preset.primaryColor}`}
                  ></div>
                  <div 
                    className={`w-8 lg:w-10 xl:w-12 h-8 lg:h-10 xl:h-12 rounded-full -ml-3 lg:-ml-4 border-2 border-white shadow-lg transition-transform hover:scale-110`}
                    data-accent-color={preset.accentColor}
                    title={`Accent: ${preset.accentColor}`}
                  ></div>
                </div>
                <div>
                  <span className="font-semibold text-base lg:text-lg">{preset.name}</span>
                  <div className="text-xs lg:text-sm text-muted-foreground mt-1">
                    {preset.primaryColor} • {preset.accentColor}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6 lg:my-8" />

      {/* Custom Colors - Enhanced with Better Spacing */}
      <div className="space-y-4 lg:space-y-6">
        <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold flex items-center gap-3 lg:gap-4 tracking-tight">
          <div className="w-8 lg:w-10 xl:w-12 h-8 lg:h-10 xl:h-12 bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 rounded-xl flex items-center justify-center">
            <Paintbrush className="h-4 lg:h-5 xl:h-6 w-4 lg:w-5 xl:w-6 text-emerald-600" />
          </div>
          Custom Colors
        </h3>
        <p className="text-base lg:text-lg text-muted-foreground">Create your own unique color palette with hex values</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
          <div className="space-y-3 lg:space-y-4">
            <label className="text-lg lg:text-xl font-semibold text-foreground flex items-center gap-2">
              Primary Color
              <div className="w-4 h-4 rounded-full border border-border shadow-sm theme-primary-swatch"></div>
            </label>
            <div className="flex gap-3 lg:gap-4">
              <div className="relative">
                <input 
                  type="color" 
                  value={customTheme.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-16 lg:w-20 xl:w-24 h-12 lg:h-14 xl:h-16 border-2 border-border rounded-xl lg:rounded-2xl cursor-pointer bg-background shadow-sm hover:shadow-md transition-all"
                  title="Select primary color"
                />
              </div>
              <input 
                type="text" 
                value={customTheme.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="flex-1 px-4 lg:px-6 py-3 lg:py-4 text-base lg:text-lg border-2 border-border rounded-xl lg:rounded-2xl bg-background text-foreground font-mono hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="#3b82f6"
                title="Primary color hex value"
              />
            </div>
          </div>
          <div className="space-y-3 lg:space-y-4">
            <label className="text-lg lg:text-xl font-semibold text-foreground flex items-center gap-2">
              Accent Color
              <div className="w-4 h-4 rounded-full border border-border shadow-sm theme-accent-swatch"></div>
            </label>
            <div className="flex gap-3 lg:gap-4">
              <div className="relative">
                <input 
                  type="color" 
                  value={customTheme.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  className="w-16 lg:w-20 xl:w-24 h-12 lg:h-14 xl:h-16 border-2 border-border rounded-xl lg:rounded-2xl cursor-pointer bg-background shadow-sm hover:shadow-md transition-all"
                  title="Select accent color"
                />
              </div>
              <input 
                type="text" 
                value={customTheme.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="flex-1 px-4 lg:px-6 py-3 lg:py-4 text-base lg:text-lg border-2 border-border rounded-xl lg:rounded-2xl bg-background text-foreground font-mono hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="#10b981"
                title="Accent color hex value"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6 lg:my-8" />

      {/* Display Mode - Enhanced with Tooltips */}
      <div className="space-y-4 lg:space-y-6">
        <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold flex items-center gap-3 lg:gap-4 tracking-tight">
          <div className="w-8 lg:w-10 xl:w-12 h-8 lg:h-10 xl:h-12 bg-gradient-to-br from-blue-500/10 to-blue-500/20 rounded-xl flex items-center justify-center">
            <Monitor className="h-4 lg:h-5 xl:h-6 w-4 lg:w-5 xl:w-6 text-blue-600" />
          </div>
          Display Mode
        </h3>
        <p className="text-base lg:text-lg text-muted-foreground">Choose how your TreeBio appears to visitors</p>
        <div className="flex gap-3 lg:gap-4 flex-wrap">
          {displayModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Button
                key={mode.value}
                variant={theme === mode.value ? "default" : "outline"}
                size="lg"
                onClick={() => handleDisplayModeChange(mode.value)}
                className={cn(
                  "flex items-center gap-2 lg:gap-3 px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-medium transition-all hover:scale-105",
                  theme === mode.value ? "shadow-md ring-2 ring-primary/20" : "shadow-sm hover:shadow-md"
                )}
                title={`Switch to ${mode.name.toLowerCase()} mode`}
              >
                <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                {mode.name}
              </Button>
            );
          })}
        </div>
        <div className="p-4 lg:p-6 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl lg:rounded-2xl border border-border/50">
          <p className="text-base lg:text-lg text-muted-foreground">
            Current mode: <span className="font-bold text-foreground bg-background px-2 py-1 rounded-md">{theme}</span>
            {theme === 'system' && (
              <span className="ml-2 text-sm lg:text-base">
                (automatically using <span className="font-semibold">{resolvedTheme || 'light'}</span> based on your device settings)
              </span>
            )}
          </p>
        </div>
      </div>

      <Separator className="my-6 lg:my-8" />

      {/* Enhanced Preview Section */}
      <div className="space-y-4 lg:space-y-6">
        <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold flex items-center gap-3 lg:gap-4 tracking-tight">
          <div className="w-8 lg:w-10 xl:w-12 h-8 lg:h-10 xl:h-12 bg-gradient-to-br from-purple-500/10 to-purple-500/20 rounded-xl flex items-center justify-center">
            <Eye className="h-4 lg:h-5 xl:h-6 w-4 lg:w-5 xl:w-6 text-purple-600" />
          </div>
          Live Preview
        </h3>
        <p className="text-base lg:text-lg text-muted-foreground">See how your customizations will look in real-time</p>
        <Card className="overflow-hidden shadow-xl border-2 border-border/50 bg-gradient-to-br from-card via-card/95 to-card/90">
          <CardHeader className="pb-4 lg:pb-6 bg-gradient-to-r from-muted/10 to-muted/5">
            <CardTitle className="text-center text-xl lg:text-2xl xl:text-3xl font-bold">Sample TreeBio Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 lg:space-y-8 p-6 lg:p-8 xl:p-10">
            <div className="flex items-center gap-4 lg:gap-6 justify-center">
              <div className="w-16 lg:w-20 xl:w-24 h-16 lg:h-20 xl:h-24 rounded-full flex items-center justify-center text-white text-xl lg:text-2xl xl:text-3xl font-bold theme-preview-avatar shadow-xl border-4 border-white/20">
                UN
              </div>
              <div className="text-center space-y-1 lg:space-y-2">
                <h4 className="font-bold text-xl lg:text-2xl xl:text-3xl text-foreground">Your Name</h4>
                <p className="text-base lg:text-lg xl:text-xl text-muted-foreground">Your amazing bio description goes here</p>
              </div>
            </div>
            <div className="space-y-3 lg:space-y-4 max-w-md mx-auto">
              <Button 
                className="w-full font-semibold text-base lg:text-lg py-3 lg:py-4 theme-preview-primary-btn shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                size="lg"
              >
                🔗 Sample Primary Link
              </Button>
              <Button 
                variant="outline" 
                className="w-full font-semibold text-base lg:text-lg py-3 lg:py-4 theme-preview-accent-btn shadow-md hover:shadow-lg transition-all hover:scale-[1.02]" 
                size="lg"
              >
                ✨ Sample Secondary Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Action Buttons */}
      <div className="flex gap-4 lg:gap-6 flex-wrap pt-4 lg:pt-6">
        <Button 
          onClick={handleApplyTheme}
          className="flex items-center gap-2 lg:gap-3 px-8 lg:px-10 py-3 lg:py-4 text-base lg:text-lg xl:text-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          size="lg"
        >
          <Wand2 className="h-5 w-5 lg:h-6 lg:w-6" />
          {previewTheme ? 'Apply Theme' : 'Apply Current Theme'}
        </Button>
        <Button 
          variant="outline" 
          onClick={handleResetToDefault}
          className="flex items-center gap-2 lg:gap-3 px-8 lg:px-10 py-3 lg:py-4 text-base lg:text-lg xl:text-xl font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105"
          size="lg"
        >
          <RefreshCw className="h-5 w-5 lg:h-6 lg:w-6" />
          Reset to Default
        </Button>
      </div>

      {/* Enhanced Preview Mode Indicator */}
      {previewTheme && (
        <div className="p-6 lg:p-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl lg:rounded-2xl border-2 border-primary/20 shadow-lg">
          <div className="text-base lg:text-lg xl:text-xl text-primary font-bold flex items-center gap-3 lg:gap-4">
            <div className="w-6 lg:w-8 h-6 lg:h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <Wand2 className="h-4 w-4 lg:h-5 lg:w-5" />
            </div>
            Preview mode is active - Your changes are being shown in real-time
          </div>
          <p className="text-sm lg:text-base text-primary/80 mt-2 lg:mt-3">
            Click &ldquo;Apply Theme&rdquo; to save these customizations permanently to your TreeBio profile
          </p>
        </div>
      )}
    </div>
  );
}
