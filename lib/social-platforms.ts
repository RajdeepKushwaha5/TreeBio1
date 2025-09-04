import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Github, 
  Linkedin, 
  Mail, 
  Globe,
  Facebook,
  MessageSquare,
  Music,
  Video,
  Code2,
  Briefcase,
  Camera,
  Phone,
  BookOpen,
  User,
  Heart
} from "lucide-react";

export interface SocialPlatform {
  id: string;
  name: string;
  displayName: string;
  category: 'social' | 'professional' | 'creative' | 'coding' | 'music' | 'business' | 'other';
  icon: React.ComponentType<any>; // Simplified to accept Lucide React components
  brandIcon: React.ComponentType<any>; // Simplified to accept Lucide React components
  color: string;
  urlPattern: RegExp;
  placeholderUrl: string;
  description: string;
}

export const socialPlatforms: SocialPlatform[] = [
  // Social Media
  {
    id: 'instagram',
    name: 'instagram',
    displayName: 'Instagram',
    category: 'social',
    icon: Instagram,
    brandIcon: Instagram,
    color: '#E4405F',
    urlPattern: /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_\.]+\/?$/,
    placeholderUrl: 'https://instagram.com/username',
    description: 'Share your photos and stories'
  },
  {
    id: 'twitter',
    name: 'twitter',
    displayName: 'Twitter / X',
    category: 'social',
    icon: Twitter,
    brandIcon: Twitter,
    color: '#1DA1F2',
    urlPattern: /^https?:\/\/(www\.)?(twitter|x)\.com\/[A-Za-z0-9_]+\/?$/,
    placeholderUrl: 'https://twitter.com/username',
    description: 'Share your thoughts and updates'
  },
  {
    id: 'tiktok',
    name: 'tiktok',
    displayName: 'TikTok',
    category: 'social',
    icon: Video,
    brandIcon: Video,
    color: '#FF0050',
    urlPattern: /^https?:\/\/(www\.)?tiktok\.com\/@[A-Za-z0-9_\.]+\/?$/,
    placeholderUrl: 'https://tiktok.com/@username',
    description: 'Share your short videos'
  },
  {
    id: 'facebook',
    name: 'facebook',
    displayName: 'Facebook',
    category: 'social',
    icon: Facebook,
    brandIcon: Facebook,
    color: '#1877F2',
    urlPattern: /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9\.]+\/?$/,
    placeholderUrl: 'https://facebook.com/username',
    description: 'Connect with friends and family'
  },
  {
    id: 'snapchat',
    name: 'snapchat',
    displayName: 'Snapchat',
    category: 'social',
    icon: Camera,
    brandIcon: Camera,
    color: '#FFFC00',
    urlPattern: /^https?:\/\/(www\.)?snapchat\.com\/add\/[A-Za-z0-9_\.]+\/?$/,
    placeholderUrl: 'https://snapchat.com/add/username',
    description: 'Share moments that disappear'
  },

  // Professional
  {
    id: 'linkedin',
    name: 'linkedin',
    displayName: 'LinkedIn',
    category: 'professional',
    icon: Linkedin,
    brandIcon: Linkedin,
    color: '#0A66C2',
    urlPattern: /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9-]+\/?$/,
    placeholderUrl: 'https://linkedin.com/in/username',
    description: 'Professional networking'
  },
  {
    id: 'github',
    name: 'github',
    displayName: 'GitHub',
    category: 'professional',
    icon: Github,
    brandIcon: Github,
    color: '#181717',
    urlPattern: /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9-]+\/?$/,
    placeholderUrl: 'https://github.com/username',
    description: 'Code repositories and projects'
  },

  // Creative
  {
    id: 'behance',
    name: 'behance',
    displayName: 'Behance',
    category: 'creative',
    icon: Briefcase,
    brandIcon: Briefcase,
    color: '#1769FF',
    urlPattern: /^https?:\/\/(www\.)?behance\.net\/[A-Za-z0-9_]+\/?$/,
    placeholderUrl: 'https://behance.net/username',
    description: 'Showcase your creative work'
  },
  {
    id: 'dribbble',
    name: 'dribbble',
    displayName: 'Dribbble',
    category: 'creative',
    icon: Heart,
    brandIcon: Heart,
    color: '#EA4C89',
    urlPattern: /^https?:\/\/(www\.)?dribbble\.com\/[A-Za-z0-9_]+\/?$/,
    placeholderUrl: 'https://dribbble.com/username',
    description: 'Design community and portfolio'
  },
  {
    id: 'figma',
    name: 'figma',
    displayName: 'Figma',
    category: 'creative',
    icon: User,
    brandIcon: User,
    color: '#F24E1E',
    urlPattern: /^https?:\/\/(www\.)?figma\.com\/@[A-Za-z0-9_]+\/?$/,
    placeholderUrl: 'https://figma.com/@username',
    description: 'Design files and prototypes'
  },

  // Coding Platforms
  {
    id: 'leetcode',
    name: 'leetcode',
    displayName: 'LeetCode',
    category: 'coding',
    icon: Code2,
    brandIcon: Code2,
    color: '#FFA116',
    urlPattern: /^https?:\/\/(www\.)?leetcode\.com\/[A-Za-z0-9_-]+\/?$/,
    placeholderUrl: 'https://leetcode.com/username',
    description: 'Coding practice and interviews'
  },
  {
    id: 'codeforces',
    name: 'codeforces',
    displayName: 'Codeforces',
    category: 'coding',
    icon: Code2,
    brandIcon: Code2,
    color: '#1F8ACB',
    urlPattern: /^https?:\/\/(www\.)?codeforces\.com\/profile\/[A-Za-z0-9_]+\/?$/,
    placeholderUrl: 'https://codeforces.com/profile/username',
    description: 'Competitive programming'
  },
  {
    id: 'hackerrank',
    name: 'hackerrank',
    displayName: 'HackerRank',
    category: 'coding',
    icon: Code2,
    brandIcon: Code2,
    color: '#00EA64',
    urlPattern: /^https?:\/\/(www\.)?hackerrank\.com\/[A-Za-z0-9_]+\/?$/,
    placeholderUrl: 'https://hackerrank.com/username',
    description: 'Coding challenges and skills'
  },
  {
    id: 'hackerearth',
    name: 'hackerearth',
    displayName: 'HackerEarth',
    category: 'coding',
    icon: Code2,
    brandIcon: Code2,
    color: '#2C3E50',
    urlPattern: /^https?:\/\/(www\.)?hackerearth\.com\/@[A-Za-z0-9_]+\/?$/,
    placeholderUrl: 'https://hackerearth.com/@username',
    description: 'Programming challenges and hackathons'
  },
  {
    id: 'codepen',
    name: 'codepen',
    displayName: 'CodePen',
    category: 'coding',
    icon: Code2,
    brandIcon: Code2,
    color: '#000000',
    urlPattern: /^https?:\/\/(www\.)?codepen\.io\/[A-Za-z0-9_-]+\/?$/,
    placeholderUrl: 'https://codepen.io/username',
    description: 'Frontend code playground'
  },
  {
    id: 'stackoverflow',
    name: 'stackoverflow',
    displayName: 'Stack Overflow',
    category: 'coding',
    icon: Code2,
    brandIcon: Code2,
    color: '#F48024',
    urlPattern: /^https?:\/\/(www\.)?stackoverflow\.com\/users\/\d+\/[A-Za-z0-9_-]+\/?$/,
    placeholderUrl: 'https://stackoverflow.com/users/123456/username',
    description: 'Programming Q&A community'
  },

  // Music & Audio
  {
    id: 'youtube',
    name: 'youtube',
    displayName: 'YouTube',
    category: 'music',
    icon: Youtube,
    brandIcon: Youtube,
    color: '#FF0000',
    urlPattern: /^https?:\/\/(www\.)?youtube\.com\/(c\/|channel\/|user\/|@)?[A-Za-z0-9_-]+\/?$/,
    placeholderUrl: 'https://youtube.com/@username',
    description: 'Video content and music'
  },
  {
    id: 'spotify',
    name: 'spotify',
    displayName: 'Spotify',
    category: 'music',
    icon: Music,
    brandIcon: Music,
    color: '#1DB954',
    urlPattern: /^https?:\/\/(www\.)?open\.spotify\.com\/(user|artist)\/[A-Za-z0-9_]+\/?$/,
    placeholderUrl: 'https://open.spotify.com/user/username',
    description: 'Music streaming and playlists'
  },
  {
    id: 'soundcloud',
    name: 'soundcloud',
    displayName: 'SoundCloud',
    category: 'music',
    icon: Music,
    brandIcon: Music,
    color: '#FF5500',
    urlPattern: /^https?:\/\/(www\.)?soundcloud\.com\/[A-Za-z0-9_-]+\/?$/,
    placeholderUrl: 'https://soundcloud.com/username',
    description: 'Audio sharing platform'
  },
  {
    id: 'twitch',
    name: 'twitch',
    displayName: 'Twitch',
    category: 'music',
    icon: Video,
    brandIcon: Video,
    color: '#9146FF',
    urlPattern: /^https?:\/\/(www\.)?twitch\.tv\/[A-Za-z0-9_]+\/?$/,
    placeholderUrl: 'https://twitch.tv/username',
    description: 'Live streaming platform'
  },

  // Business & Finance
  {
    id: 'paypal',
    name: 'paypal',
    displayName: 'PayPal',
    category: 'business',
    icon: Briefcase,
    brandIcon: Briefcase,
    color: '#00457C',
    urlPattern: /^https?:\/\/(www\.)?paypal\.me\/[A-Za-z0-9_]+\/?$/,
    placeholderUrl: 'https://paypal.me/username',
    description: 'Payment and donations'
  },

  // Communication
  {
    id: 'discord',
    name: 'discord',
    displayName: 'Discord',
    category: 'social',
    icon: MessageSquare,
    brandIcon: MessageSquare,
    color: '#5865F2',
    urlPattern: /^https?:\/\/(www\.)?discord\.(gg|com)\/[A-Za-z0-9_]+\/?$/,
    placeholderUrl: 'https://discord.gg/username',
    description: 'Gaming and community chat'
  },
  {
    id: 'telegram',
    name: 'telegram',
    displayName: 'Telegram',
    category: 'social',
    icon: MessageSquare,
    brandIcon: MessageSquare,
    color: '#26A5E4',
    urlPattern: /^https?:\/\/(www\.)?(t\.me|telegram\.me)\/[A-Za-z0-9_]+\/?$/,
    placeholderUrl: 'https://t.me/username',
    description: 'Secure messaging platform'
  },
  {
    id: 'whatsapp',
    name: 'whatsapp',
    displayName: 'WhatsApp',
    category: 'social',
    icon: Phone,
    brandIcon: Phone,
    color: '#25D366',
    urlPattern: /^https?:\/\/(www\.)?wa\.me\/[0-9]+\/?$/,
    placeholderUrl: 'https://wa.me/1234567890',
    description: 'Direct messaging'
  },

  // Other
  {
    id: 'email',
    name: 'email',
    displayName: 'Email',
    category: 'other',
    icon: Mail,
    brandIcon: Mail,
    color: '#666666',
    urlPattern: /^mailto:[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
    placeholderUrl: 'mailto:your@email.com',
    description: 'Direct email contact'
  },
  {
    id: 'website',
    name: 'website',
    displayName: 'Website',
    category: 'other',
    icon: Globe,
    brandIcon: Globe,
    color: '#666666',
    urlPattern: /^https?:\/\/.+$/,
    placeholderUrl: 'https://yourwebsite.com',
    description: 'Personal or portfolio website'
  },
  {
    id: 'portfolio',
    name: 'portfolio',
    displayName: 'Portfolio',
    category: 'professional',
    icon: Briefcase,
    brandIcon: Briefcase,
    color: '#666666',
    urlPattern: /^https?:\/\/.+$/,
    placeholderUrl: 'https://yourportfolio.com',
    description: 'Professional portfolio website'
  },
  {
    id: 'blog',
    name: 'blog',
    displayName: 'Blog',
    category: 'creative',
    icon: BookOpen,
    brandIcon: BookOpen,
    color: '#666666',
    urlPattern: /^https?:\/\/.+$/,
    placeholderUrl: 'https://yourblog.com',
    description: 'Personal or professional blog'
  },
  {
    id: 'medium',
    name: 'medium',
    displayName: 'Medium',
    category: 'creative',
    icon: BookOpen,
    brandIcon: BookOpen,
    color: '#000000',
    urlPattern: /^https?:\/\/(www\.)?medium\.com\/@?[A-Za-z0-9_.-]+\/?$/,
    placeholderUrl: 'https://medium.com/@username',
    description: 'Writing and publishing platform'
  },
  {
    id: 'notion',
    name: 'notion',
    displayName: 'Notion',
    category: 'professional',
    icon: BookOpen,
    brandIcon: BookOpen,
    color: '#000000',
    urlPattern: /^https?:\/\/(www\.)?notion\.so\/[A-Za-z0-9_-]+\/?$/,
    placeholderUrl: 'https://notion.so/username',
    description: 'Notes and productivity workspace'
  }
];

export class SocialPlatformService {
  /**
   * Get all platforms
   */
  static getAllPlatforms(): SocialPlatform[] {
    return socialPlatforms;
  }

  /**
   * Get platforms by category
   */
  static getPlatformsByCategory(category: SocialPlatform['category']): SocialPlatform[] {
    return socialPlatforms.filter(platform => platform.category === category);
  }

  /**
   * Get platform by ID
   */
  static getPlatform(id: string): SocialPlatform | undefined {
    return socialPlatforms.find(platform => platform.id === id);
  }

  /**
   * Validate URL for platform
   */
  static validateUrl(platformId: string, url: string): boolean {
    const platform = this.getPlatform(platformId);
    if (!platform) return false;
    return platform.urlPattern.test(url);
  }

  /**
   * Get platform by URL
   */
  static getPlatformByUrl(url: string): SocialPlatform | undefined {
    return socialPlatforms.find(platform => platform.urlPattern.test(url));
  }

  /**
   * Get platform icon component
   */
  static getPlatformIcon(platformId: string, branded = false): React.ComponentType<any> {
    const platform = this.getPlatform(platformId);
    if (!platform) return Globe;
    return branded ? platform.brandIcon : platform.icon;
  }

  /**
   * Get platform color
   */
  static getPlatformColor(platformId: string): string {
    const platform = this.getPlatform(platformId);
    return platform?.color || '#666666';
  }

  /**
   * Search platforms
   */
  static searchPlatforms(query: string): SocialPlatform[] {
    const lowerQuery = query.toLowerCase();
    return socialPlatforms.filter(platform => 
      platform.name.toLowerCase().includes(lowerQuery) ||
      platform.displayName.toLowerCase().includes(lowerQuery) ||
      platform.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get popular platforms
   */
  static getPopularPlatforms(): SocialPlatform[] {
    const popularIds = [
      'instagram', 'twitter', 'youtube', 'linkedin', 'github', 
      'tiktok', 'email', 'website', 'discord', 'spotify'
    ];
    return popularIds.map(id => this.getPlatform(id)).filter(Boolean) as SocialPlatform[];
  }

  /**
   * Format URL for display
   */
  static formatUrlForDisplay(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  }

  /**
   * Detect platform from URL
   */
  static detectPlatformFromUrl(url: string): SocialPlatform | null {
    if (!url) return null;
    
    try {
      // Handle email URLs
      if (url.toLowerCase().startsWith('mailto:')) {
        return this.getPlatform('email') || null;
      }
      
      // For other URLs, check against all platform patterns
      for (const platform of socialPlatforms) {
        if (platform.urlPattern.test(url)) {
          return platform;
        }
      }
      
      // If no specific platform matches, return website/globe
      return this.getPlatform('website') || null;
    } catch {
      return this.getPlatform('website') || null;
    }
  }

  /**
   * Get platform icon from URL
   */
  static getPlatformIconFromUrl(url: string, branded = false): React.ComponentType<any> {
    const platform = this.detectPlatformFromUrl(url);
    if (!platform) return Globe;
    return branded ? platform.brandIcon : platform.icon;
  }

  /**
   * Get platform color from URL
   */
  static getPlatformColorFromUrl(url: string): string {
    const platform = this.detectPlatformFromUrl(url);
    return platform?.color || '#666666';
  }

  /**
   * Get platform categories
   */
  static getCategories(): Array<{ id: SocialPlatform['category']; name: string; count: number }> {
    const categories = Array.from(new Set(socialPlatforms.map(p => p.category)));
    return categories.map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: socialPlatforms.filter(p => p.category === cat).length
    }));
  }
}
