/**
 * Bio Page Template System
 * Defines templates inspired by professional bio page designs
 */

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'minimalist' | 'vibrant' | 'professional' | 'creative';
  preview: string;
  styles: {
    // Layout configuration
    layout: 'vertical' | 'grid' | 'card';
    spacing: 'compact' | 'normal' | 'spacious';
    
    // Color scheme
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    cardBackground: string;
    
    // Typography
    fontFamily: string;
    headingWeight: string;
    bodyWeight: string;
    fontSize: 'small' | 'medium' | 'large';
    
    // Button styling
    buttonStyle: 'rounded' | 'sharp' | 'pill' | 'gradient';
    buttonColor: string;
    buttonTextColor: string;
    
    // Visual elements
    borderRadius: string;
    shadowStyle: 'none' | 'soft' | 'medium' | 'strong';
    backgroundPattern: 'none' | 'dots' | 'waves' | 'gradient' | 'image';
    
    // Avatar styling
    avatarStyle: 'circle' | 'rounded' | 'square';
    avatarSize: 'small' | 'medium' | 'large';
    
    // Social icons
    socialStyle: 'filled' | 'outlined' | 'minimal';
    socialSize: 'small' | 'medium' | 'large';
  };
  customCSS?: string;
}

// Template definitions inspired by the attached images
export const BUILT_IN_TEMPLATES: TemplateConfig[] = [
  // Minimalist Template (inspired by clean, typography-focused designs)
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean lines, monochrome palette, focus on typography',
    category: 'minimalist',
    preview: '/templates/minimalist-preview.png',
    styles: {
      layout: 'vertical',
      spacing: 'spacious',
      primaryColor: '#000000',
      accentColor: '#666666',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      cardBackground: '#f8f9fa',
      fontFamily: 'Inter, system-ui, sans-serif',
      headingWeight: '400',
      bodyWeight: '300',
      fontSize: 'medium',
      buttonStyle: 'sharp',
      buttonColor: '#000000',
      buttonTextColor: '#ffffff',
      borderRadius: '4px',
      shadowStyle: 'soft',
      backgroundPattern: 'none',
      avatarStyle: 'circle',
      avatarSize: 'large',
      socialStyle: 'minimal',
      socialSize: 'medium'
    }
  },

  // Vibrant Template (inspired by colorful, playful designs)
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bright colors, rounded buttons, playful fonts',
    category: 'vibrant',
    preview: '/templates/vibrant-preview.png',
    styles: {
      layout: 'card',
      spacing: 'normal',
      primaryColor: '#ff6b6b',
      accentColor: '#4ecdc4',
      backgroundColor: '#fff3e0',
      textColor: '#2c3e50',
      cardBackground: '#ffffff',
      fontFamily: 'Poppins, system-ui, sans-serif',
      headingWeight: '600',
      bodyWeight: '400',
      fontSize: 'medium',
      buttonStyle: 'pill',
      buttonColor: '#ff6b6b',
      buttonTextColor: '#ffffff',
      borderRadius: '16px',
      shadowStyle: 'medium',
      backgroundPattern: 'gradient',
      avatarStyle: 'rounded',
      avatarSize: 'large',
      socialStyle: 'filled',
      socialSize: 'large'
    },
    customCSS: `
      .vibrant-gradient {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .vibrant-card:hover {
        transform: translateY(-2px);
        transition: transform 0.2s ease;
      }
    `
  },

  // Professional Template (inspired by corporate, clean designs)
  {
    id: 'professional',
    name: 'Professional',
    description: 'Neutral tones, sharp edges, formal layout',
    category: 'professional',
    preview: '/templates/professional-preview.png',
    styles: {
      layout: 'grid',
      spacing: 'compact',
      primaryColor: '#2563eb',
      accentColor: '#1e40af',
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      cardBackground: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      headingWeight: '600',
      bodyWeight: '400',
      fontSize: 'medium',
      buttonStyle: 'sharp',
      buttonColor: '#2563eb',
      buttonTextColor: '#ffffff',
      borderRadius: '6px',
      shadowStyle: 'soft',
      backgroundPattern: 'none',
      avatarStyle: 'rounded',
      avatarSize: 'medium',
      socialStyle: 'outlined',
      socialSize: 'medium'
    }
  },

  // Hydra-inspired Template (green, natural theme)
  {
    id: 'nature',
    name: 'Nature',
    description: 'Natural green tones, organic feeling, wellness-focused',
    category: 'creative',
    preview: '/templates/nature-preview.png',
    styles: {
      layout: 'vertical',
      spacing: 'normal',
      primaryColor: '#16a085',
      accentColor: '#27ae60',
      backgroundColor: '#f8fffe',
      textColor: '#2c3e50',
      cardBackground: 'rgba(255, 255, 255, 0.9)',
      fontFamily: 'Roboto, system-ui, sans-serif',
      headingWeight: '500',
      bodyWeight: '400',
      fontSize: 'medium',
      buttonStyle: 'rounded',
      buttonColor: '#16a085',
      buttonTextColor: '#ffffff',
      borderRadius: '12px',
      shadowStyle: 'soft',
      backgroundPattern: 'gradient',
      avatarStyle: 'circle',
      avatarSize: 'large',
      socialStyle: 'filled',
      socialSize: 'medium'
    },
    customCSS: `
      .nature-bg {
        background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
      }
      .nature-card {
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    `
  },

  // Modern Dark Template (inspired by dark themes)
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    description: 'Dark theme, neon accents, tech-focused design',
    category: 'professional',
    preview: '/templates/modern-dark-preview.png',
    styles: {
      layout: 'card',
      spacing: 'normal',
      primaryColor: '#8b5cf6',
      accentColor: '#a855f7',
      backgroundColor: '#0f0f23',
      textColor: '#e2e8f0',
      cardBackground: '#1e293b',
      fontFamily: 'JetBrains Mono, monospace',
      headingWeight: '500',
      bodyWeight: '400',
      fontSize: 'medium',
      buttonStyle: 'rounded',
      buttonColor: '#8b5cf6',
      buttonTextColor: '#ffffff',
      borderRadius: '8px',
      shadowStyle: 'strong',
      backgroundPattern: 'dots',
      avatarStyle: 'rounded',
      avatarSize: 'medium',
      socialStyle: 'filled',
      socialSize: 'medium'
    },
    customCSS: `
      .dark-glow {
        box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
      }
      .dark-dots {
        background-image: radial-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
      }
    `
  },

  // Warm Coffee Template (inspired by warm, cozy designs)
  {
    id: 'warm-coffee',
    name: 'Warm Coffee',
    description: 'Warm browns, cozy feeling, café-inspired design',
    category: 'creative',
    preview: '/templates/warm-coffee-preview.png',
    styles: {
      layout: 'vertical',
      spacing: 'spacious',
      primaryColor: '#8b4513',
      accentColor: '#cd853f',
      backgroundColor: '#faf7f2',
      textColor: '#3e2723',
      cardBackground: '#ffffff',
      fontFamily: 'Merriweather, serif',
      headingWeight: '700',
      bodyWeight: '400',
      fontSize: 'large',
      buttonStyle: 'rounded',
      buttonColor: '#8b4513',
      buttonTextColor: '#ffffff',
      borderRadius: '12px',
      shadowStyle: 'medium',
      backgroundPattern: 'image',
      avatarStyle: 'circle',
      avatarSize: 'large',
      socialStyle: 'filled',
      socialSize: 'medium'
    }
  }
];

// Helper functions for template management
export const getTemplateById = (id: string): TemplateConfig | undefined => {
  return BUILT_IN_TEMPLATES.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: TemplateConfig['category']): TemplateConfig[] => {
  return BUILT_IN_TEMPLATES.filter(template => template.category === category);
};

export const getAllTemplateCategories = (): string[] => {
  const categories = BUILT_IN_TEMPLATES.map(template => template.category);
  return [...new Set(categories)];
};
