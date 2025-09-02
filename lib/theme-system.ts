export interface ThemeConfig {
  id: string;
  name: string;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  styles: {
    borderRadius: string;
    buttonStyle: 'rounded' | 'square' | 'pill';
    shadowStyle: 'none' | 'soft' | 'hard';
    animationStyle: 'none' | 'subtle' | 'bouncy';
  };
  typography: {
    fontFamily: string;
    headingWeight: number;
    bodyWeight: number;
  };
  layout: {
    maxWidth: string;
    spacing: string;
    cardStyle: 'flat' | 'elevated' | 'outlined';
  };
}

export const defaultThemes: ThemeConfig[] = [
  {
    id: 'default',
    name: 'default',
    displayName: 'Default',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#10B981',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
    },
    styles: {
      borderRadius: '0.5rem',
      buttonStyle: 'rounded',
      shadowStyle: 'soft',
      animationStyle: 'subtle',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      headingWeight: 600,
      bodyWeight: 400,
    },
    layout: {
      maxWidth: '28rem',
      spacing: '1rem',
      cardStyle: 'elevated',
    },
  },
  {
    id: 'dark',
    name: 'dark',
    displayName: 'Dark Mode',
    colors: {
      primary: '#60A5FA',
      secondary: '#A78BFA',
      accent: '#34D399',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#9CA3AF',
      border: '#374151',
    },
    styles: {
      borderRadius: '0.5rem',
      buttonStyle: 'rounded',
      shadowStyle: 'hard',
      animationStyle: 'subtle',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      headingWeight: 600,
      bodyWeight: 400,
    },
    layout: {
      maxWidth: '28rem',
      spacing: '1rem',
      cardStyle: 'elevated',
    },
  },
  {
    id: 'gradient',
    name: 'gradient',
    displayName: 'Gradient',
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: 'rgba(255, 255, 255, 0.1)',
      text: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      border: 'rgba(255, 255, 255, 0.2)',
    },
    styles: {
      borderRadius: '1rem',
      buttonStyle: 'pill',
      shadowStyle: 'soft',
      animationStyle: 'bouncy',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      headingWeight: 700,
      bodyWeight: 400,
    },
    layout: {
      maxWidth: '28rem',
      spacing: '1.5rem',
      cardStyle: 'elevated',
    },
  },
  {
    id: 'minimal',
    name: 'minimal',
    displayName: 'Minimal',
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#000000',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      text: '#000000',
      textSecondary: '#666666',
      border: '#E5E5E5',
    },
    styles: {
      borderRadius: '0.25rem',
      buttonStyle: 'square',
      shadowStyle: 'none',
      animationStyle: 'none',
    },
    typography: {
      fontFamily: 'Monaco, Consolas, monospace',
      headingWeight: 400,
      bodyWeight: 400,
    },
    layout: {
      maxWidth: '24rem',
      spacing: '0.75rem',
      cardStyle: 'outlined',
    },
  },
  {
    id: 'neon',
    name: 'neon',
    displayName: 'Neon',
    colors: {
      primary: '#00FF88',
      secondary: '#FF0080',
      accent: '#00D4FF',
      background: '#0A0A0A',
      surface: '#1A1A1A',
      text: '#00FF88',
      textSecondary: '#888888',
      border: '#00FF88',
    },
    styles: {
      borderRadius: '0rem',
      buttonStyle: 'square',
      shadowStyle: 'hard',
      animationStyle: 'bouncy',
    },
    typography: {
      fontFamily: 'JetBrains Mono, monospace',
      headingWeight: 700,
      bodyWeight: 400,
    },
    layout: {
      maxWidth: '30rem',
      spacing: '1.25rem',
      cardStyle: 'outlined',
    },
  },
  {
    id: 'nature',
    name: 'nature',
    displayName: 'Nature',
    colors: {
      primary: '#059669',
      secondary: '#0D9488',
      accent: '#65A30D',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      text: '#064E3B',
      textSecondary: '#047857',
      border: '#BBF7D0',
    },
    styles: {
      borderRadius: '1.5rem',
      buttonStyle: 'pill',
      shadowStyle: 'soft',
      animationStyle: 'subtle',
    },
    typography: {
      fontFamily: 'Georgia, serif',
      headingWeight: 500,
      bodyWeight: 400,
    },
    layout: {
      maxWidth: '26rem',
      spacing: '1.25rem',
      cardStyle: 'elevated',
    },
  },
];

export class ThemeManager {
  static getTheme(themeId: string): ThemeConfig {
    return defaultThemes.find(theme => theme.id === themeId) || defaultThemes[0];
  }

  static getAllThemes(): ThemeConfig[] {
    return defaultThemes;
  }

  static generateCSS(theme: ThemeConfig): string {
    return `
      :root {
        --theme-primary: ${theme.colors.primary};
        --theme-secondary: ${theme.colors.secondary};
        --theme-accent: ${theme.colors.accent};
        --theme-background: ${theme.colors.background};
        --theme-surface: ${theme.colors.surface};
        --theme-text: ${theme.colors.text};
        --theme-text-secondary: ${theme.colors.textSecondary};
        --theme-border: ${theme.colors.border};
        --theme-radius: ${theme.styles.borderRadius};
        --theme-font-family: ${theme.typography.fontFamily};
        --theme-heading-weight: ${theme.typography.headingWeight};
        --theme-body-weight: ${theme.typography.bodyWeight};
        --theme-max-width: ${theme.layout.maxWidth};
        --theme-spacing: ${theme.layout.spacing};
      }

      .theme-container {
        font-family: var(--theme-font-family);
        background: var(--theme-background);
        color: var(--theme-text);
        border-radius: var(--theme-radius);
        max-width: var(--theme-max-width);
        margin: 0 auto;
      }

      .theme-button {
        background: var(--theme-primary);
        color: var(--theme-background);
        border: 1px solid var(--theme-border);
        border-radius: ${theme.styles.buttonStyle === 'pill' ? '2rem' : 
                        theme.styles.buttonStyle === 'square' ? '0.25rem' : 
                        'var(--theme-radius)'};
        padding: var(--theme-spacing);
        font-weight: var(--theme-body-weight);
        transition: all 0.2s ease;
        ${theme.styles.shadowStyle === 'soft' ? 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);' :
          theme.styles.shadowStyle === 'hard' ? 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);' :
          'box-shadow: none;'}
      }

      .theme-button:hover {
        background: var(--theme-secondary);
        transform: ${theme.styles.animationStyle === 'bouncy' ? 'scale(1.05)' :
                    theme.styles.animationStyle === 'subtle' ? 'translateY(-1px)' :
                    'none'};
      }

      .theme-card {
        background: var(--theme-surface);
        border: 1px solid var(--theme-border);
        border-radius: var(--theme-radius);
        padding: var(--theme-spacing);
        ${theme.layout.cardStyle === 'elevated' ? 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);' :
          theme.layout.cardStyle === 'outlined' ? 'border-width: 2px;' :
          'border: none;'}
      }

      .theme-text {
        color: var(--theme-text);
        font-weight: var(--theme-body-weight);
      }

      .theme-text-secondary {
        color: var(--theme-text-secondary);
        font-weight: var(--theme-body-weight);
      }

      .theme-heading {
        color: var(--theme-text);
        font-weight: var(--theme-heading-weight);
      }
    `;
  }

  static mergeCustomTheme(baseTheme: ThemeConfig, customizations: Partial<ThemeConfig>): ThemeConfig {
    return {
      ...baseTheme,
      ...customizations,
      colors: { ...baseTheme.colors, ...customizations.colors },
      styles: { ...baseTheme.styles, ...customizations.styles },
      typography: { ...baseTheme.typography, ...customizations.typography },
      layout: { ...baseTheme.layout, ...customizations.layout },
    };
  }
}
