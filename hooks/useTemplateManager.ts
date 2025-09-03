"use client";

import { useState, useCallback, useEffect } from "react";
import { TemplateConfig, getTemplateById } from "@/lib/bio-templates";
import { toast } from "sonner";

interface TemplateSettings {
  templateId: string;
  customizations?: {
    primaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
    [key: string]: any;
  };
  appliedAt: Date;
}

export function useTemplateManager(initialTemplate?: string) {
  const [currentTemplate, setCurrentTemplate] = useState<TemplateConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [templateSettings, setTemplateSettings] = useState<TemplateSettings | null>(null);

  // Load saved template from localStorage on mount
  useEffect(() => {
    const savedTemplate = localStorage.getItem('treebio-template');
    if (savedTemplate) {
      try {
        const settings: TemplateSettings = JSON.parse(savedTemplate);
        const template = getTemplateById(settings.templateId);
        if (template) {
          setCurrentTemplate(template);
          setTemplateSettings(settings);
        }
      } catch (error) {
        console.error('Error loading saved template:', error);
      }
    } else if (initialTemplate) {
      const template = getTemplateById(initialTemplate);
      if (template) {
        setCurrentTemplate(template);
      }
    }
  }, [initialTemplate]);

  // Apply template styles to the document
  const applyTemplateStyles = useCallback((template: TemplateConfig, customizations?: any) => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const styles = { ...template.styles, ...customizations };

    // Apply CSS custom properties
    root.style.setProperty('--template-primary', styles.primaryColor);
    root.style.setProperty('--template-accent', styles.accentColor);
    root.style.setProperty('--template-bg', styles.backgroundColor);
    root.style.setProperty('--template-text', styles.textColor);
    root.style.setProperty('--template-card-bg', styles.cardBackground);
    root.style.setProperty('--template-button', styles.buttonColor);
    root.style.setProperty('--template-button-text', styles.buttonTextColor);
    root.style.setProperty('--template-border-radius', styles.borderRadius);
    root.style.setProperty('--template-font-family', styles.fontFamily);
    root.style.setProperty('--template-font-size', styles.fontSize);
    root.style.setProperty('--template-shadow', 
      styles.shadowStyle === 'none' ? 'none' :
      styles.shadowStyle === 'soft' ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' :
      styles.shadowStyle === 'medium' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' :
      '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    );

    // Apply custom CSS if provided
    if (template.customCSS) {
      let styleElement = document.getElementById('template-custom-styles');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'template-custom-styles';
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = template.customCSS;
    }
  }, []);

  // Select and apply a new template
  const selectTemplate = useCallback(async (template: TemplateConfig): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Apply the template styles
      applyTemplateStyles(template);

      // Save template settings
      const settings: TemplateSettings = {
        templateId: template.id,
        appliedAt: new Date()
      };

      localStorage.setItem('treebio-template', JSON.stringify(settings));
      
      setCurrentTemplate(template);
      setTemplateSettings(settings);
      
      toast.success(`${template.name} template applied successfully!`);
    } catch (error) {
      console.error('Error applying template:', error);
      toast.error('Failed to apply template');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [applyTemplateStyles]);

  // Customize current template
  const customizeTemplate = useCallback((customizations: Partial<TemplateConfig['styles']>) => {
    if (!currentTemplate) return;

    const updatedSettings: TemplateSettings = {
      ...templateSettings!,
      customizations: {
        ...templateSettings?.customizations,
        ...customizations
      }
    };

    applyTemplateStyles(currentTemplate, customizations);
    setTemplateSettings(updatedSettings);
    localStorage.setItem('treebio-template', JSON.stringify(updatedSettings));
    
    toast.success('Template customization applied!');
  }, [currentTemplate, templateSettings, applyTemplateStyles]);

  // Reset to default template
  const resetTemplate = useCallback(() => {
    localStorage.removeItem('treebio-template');
    setCurrentTemplate(null);
    setTemplateSettings(null);
    
    // Reset CSS custom properties
    const root = document.documentElement;
    const propertiesToReset = [
      '--template-primary',
      '--template-accent', 
      '--template-bg',
      '--template-text',
      '--template-card-bg',
      '--template-button',
      '--template-button-text',
      '--template-border-radius',
      '--template-font-family',
      '--template-font-size',
      '--template-shadow'
    ];
    
    propertiesToReset.forEach(prop => {
      root.style.removeProperty(prop);
    });

    // Remove custom styles
    const styleElement = document.getElementById('template-custom-styles');
    if (styleElement) {
      styleElement.remove();
    }

    toast.success('Template reset to default!');
  }, []);

  // Preview a template without applying it permanently
  const previewTemplate = useCallback((template: TemplateConfig) => {
    applyTemplateStyles(template);
    
    // Auto-revert after 3 seconds
    setTimeout(() => {
      if (currentTemplate) {
        applyTemplateStyles(currentTemplate, templateSettings?.customizations);
      }
    }, 3000);
  }, [currentTemplate, templateSettings, applyTemplateStyles]);

  // Get current template CSS variables for components
  const getTemplateVars = useCallback(() => {
    if (!currentTemplate) return {};

    const styles = currentTemplate.styles;
    const customizations = templateSettings?.customizations || {};

    return {
      '--template-primary': customizations.primaryColor || styles.primaryColor,
      '--template-accent': customizations.accentColor || styles.accentColor,
      '--template-bg': customizations.backgroundColor || styles.backgroundColor,
      '--template-text': customizations.textColor || styles.textColor,
      '--template-card-bg': styles.cardBackground,
      '--template-button': styles.buttonColor,
      '--template-button-text': styles.buttonTextColor,
      '--template-border-radius': styles.borderRadius,
      '--template-font-family': customizations.fontFamily || styles.fontFamily,
    };
  }, [currentTemplate, templateSettings]);

  return {
    currentTemplate,
    templateSettings,
    isLoading,
    selectTemplate,
    customizeTemplate,
    resetTemplate,
    previewTemplate,
    getTemplateVars,
    isTemplateApplied: !!currentTemplate
  };
}
