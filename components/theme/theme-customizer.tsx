"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Palette, Paintbrush, Monitor, Sun, Moon, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  }, [previewTheme, mounted, applyThemeVariables]);

  const hexToHsl = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '214 100% 59%'; // fallback
    
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
  };

  const handleDisplayModeChange = (mode: string) => {
    setTheme(mode);
    toast.success(`Display mode changed to ${mode}`);
  };

  const handleApplyTheme = async () => {
    try {
      // Save custom theme to localStorage
      localStorage.setItem('custom-theme', JSON.stringify(customTheme));
      
      // Apply the theme variables
      applyThemeVariables(customTheme);
      
      // Here you would typically save to your backend/database
      // await saveUserTheme(customTheme);
      
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
    <div className="space-y-6">
      {/* Preset Theme Colors */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Preset Themes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {presetThemes.map((preset) => (
            <div
              key={preset.name}
              className={cn(
                "p-3 border rounded-lg cursor-pointer transition-all hover:border-primary/50",
                customTheme.primaryColor === preset.primaryColor && 
                customTheme.accentColor === preset.accentColor
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border"
              )}
              onClick={() => handlePresetThemeSelect(preset)}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div 
                    className={`w-6 h-6 rounded-full theme-color-swatch`}
                    style={{ backgroundColor: preset.primaryColor }}
                  ></div>
                  <div 
                    className={`w-6 h-6 rounded-full theme-color-swatch -ml-2`}
                    style={{ backgroundColor: preset.accentColor }}
                  ></div>
                </div>
                <span className="font-medium">{preset.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Custom Colors */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Paintbrush className="h-5 w-5" />
          Custom Colors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Primary Color</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={customTheme.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="w-12 h-10 border border-border rounded cursor-pointer bg-background"
                title="Select primary color"
              />
              <input 
                type="text" 
                value={customTheme.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded bg-background text-foreground"
                placeholder="Enter hex color"
                title="Primary color hex value"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Accent Color</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={customTheme.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="w-12 h-10 border border-border rounded cursor-pointer bg-background"
                title="Select accent color"
              />
              <input 
                type="text" 
                value={customTheme.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded bg-background text-foreground"
                placeholder="Enter hex color"
                title="Accent color hex value"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Display Mode */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Display Mode
        </h3>
        <div className="flex gap-2 flex-wrap">
          {displayModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Button
                key={mode.value}
                variant={theme === mode.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleDisplayModeChange(mode.value)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {mode.name}
              </Button>
            );
          })}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Current mode: <span className="font-medium">{theme}</span>
          {theme === 'system' && (
            <span className="ml-1">
              (using {resolvedTheme === 'dark' ? 'dark' : 'light'})
            </span>
          )}
        </p>
      </div>

      <Separator />

      {/* Preview */}
      <div>
        <h3 className="text-lg font-medium mb-4">Preview</h3>
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-center">Sample Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 justify-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium theme-preview-avatar"
              >
                UN
              </div>
              <div className="text-center">
                <h4 className="font-medium text-foreground">Your Name</h4>
                <p className="text-sm text-muted-foreground">Bio text here</p>
              </div>
            </div>
            <div className="space-y-2">
              <Button 
                className="w-full font-medium theme-preview-primary-btn"
                size="sm"
              >
                Sample Link
              </Button>
              <Button 
                variant="outline" 
                className="w-full font-medium theme-preview-accent-btn" 
                size="sm"
              >
                Another Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          onClick={handleApplyTheme}
          className="flex items-center gap-2"
          disabled={!previewTheme}
        >
          <Wand2 className="h-4 w-4" />
          Apply Theme
        </Button>
        <Button 
          variant="outline" 
          onClick={handleResetToDefault}
          className="flex items-center gap-2"
        >
          Reset to Default
        </Button>
      </div>

      {previewTheme && (
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-primary font-medium flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Preview mode active - Click &ldquo;Apply Theme&rdquo; to save changes
          </p>
        </div>
      )}
    </div>
  );
}
