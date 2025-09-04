import { nanoid } from 'nanoid';
import { db } from '@/lib/db';
import { validateUrl, sanitizeUrl } from '@/lib/url-validator';

export interface CreateShortUrlParams {
  originalUrl: string;
  linkId?: string;
  userId?: string;
  customCode?: string;
  expiresAt?: Date;
}

export interface ShortUrlStats {
  clicks: number;
  uniqueClicks: number;
  topCountries: Array<{ country: string; clicks: number }>;
  topDevices: Array<{ device: string; clicks: number }>;
  clicksByDate: Array<{ date: string; clicks: number }>;
}

class LinkShortenerService {
  private readonly shortCodeLength = 6;

  /**
   * Get the correct base URL for the application
   */
  private getBaseUrl(): string {
    // Priority 1: Use configured custom domain if available
    if (process.env.NEXT_PUBLIC_APP_URL) {
      console.log('Using NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
      return process.env.NEXT_PUBLIC_APP_URL;
    }
    
    // Priority 2: For TreeBio1 production, always use the main domain
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
      console.log('Using production URL: https://treebio1.vercel.app');
      return 'https://treebio1.vercel.app';
    }
    
    // Priority 3: In development or preview, check Vercel URL carefully
    if (process.env.VERCEL_URL) {
      const vercelUrl = process.env.VERCEL_URL;
      
      // If it's the main production URL, use it
      if (vercelUrl === 'treebio1.vercel.app') {
        console.log('Using main Vercel URL:', `https://${vercelUrl}`);
        return `https://${vercelUrl}`;
      }
      
      // For preview deployments, still use the main production URL for consistency
      if (vercelUrl.includes('treebio1') && vercelUrl.includes('vercel.app')) {
        console.log('Preview deployment detected, using main domain instead of:', vercelUrl);
        return 'https://treebio1.vercel.app';
      }
    }
    
    // Fallback to localhost for local development
    console.log('Using localhost fallback');
    return 'http://localhost:3000';
  }

  /**
   * Generate a unique short code
   */
  private generateShortCode(customCode?: string): string {
    if (customCode) {
      // Validate custom code (alphanumeric, 3-20 characters)
      if (!/^[a-zA-Z0-9]{3,20}$/.test(customCode)) {
        throw new Error('Custom code must be 3-20 alphanumeric characters');
      }
      return customCode;
    }
    return nanoid(this.shortCodeLength);
  }

  /**
   * Create a shortened URL
   */
  async createShortUrl({
    originalUrl,
    linkId,
    userId,
    customCode,
    expiresAt
  }: CreateShortUrlParams) {
    try {
      // Sanitize and validate URL
      const sanitizedUrl = sanitizeUrl(originalUrl);
      const validation = validateUrl(sanitizedUrl);
      
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid URL');
      }

      const validatedUrl = validation.normalizedUrl!;

      // Prevent circular redirects - check if URL points to our own shortener
      try {
        const urlObj = new URL(validatedUrl);
        const baseUrlObj = new URL(this.getBaseUrl());
        if (urlObj.hostname === baseUrlObj.hostname && urlObj.pathname.startsWith('/s/')) {
          throw new Error('Cannot create short URL that points to another short URL');
        }
      } catch (urlError) {
        // If URL parsing fails, let the original validation handle it
      }

      let shortCode = this.generateShortCode(customCode);
      let attempts = 0;
      const maxAttempts = 5;

      // Ensure unique short code
      while (attempts < maxAttempts) {
        const existing = await db.shortUrl.findUnique({
          where: { shortCode }
        });

        if (!existing) break;

        if (customCode) {
          throw new Error('Custom code already exists');
        }

        shortCode = this.generateShortCode();
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique short code');
      }

      console.log('Creating short URL:', { shortCode, originalUrl, userId });

      const shortUrl = await db.shortUrl.create({
        data: {
          shortCode,
          originalUrl: validatedUrl,
          linkId,
          userId,
          expiresAt
        }
      });

      const baseUrl = this.getBaseUrl();
      const fullShortUrl = `${baseUrl}/s/${shortCode}`;
      
      // Debug logging for URL generation
      console.log('Link Shortener URL Generation:', {
        environment: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        vercelUrl: process.env.VERCEL_URL,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
        generatedBaseUrl: baseUrl,
        fullShortUrl,
        shortCode
      });
      
      console.log('Short URL created successfully:', {
        id: shortUrl.id,
        shortCode,
        fullShortUrl,
        originalUrl: validatedUrl
      });

      return {
        success: true,
        shortUrl: fullShortUrl,
        shortCode,
        originalUrl: validatedUrl,
        id: shortUrl.id
      };
    } catch (error) {
      console.error('Error creating short URL:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create short URL'
      };
    }
  }

  /**
   * Get original URL by short code
   */
  async getOriginalUrl(shortCode: string) {
    try {
      const shortUrl = await db.shortUrl.findUnique({
        where: { shortCode, isActive: true }
      });

      if (!shortUrl) {
        return { success: false, error: 'Short URL not found' };
      }

      // Check if expired
      if (shortUrl.expiresAt && new Date() > shortUrl.expiresAt) {
        return { success: false, error: 'Short URL has expired' };
      }

      // Increment click count
      await db.shortUrl.update({
        where: { id: shortUrl.id },
        data: { clicks: { increment: 1 } }
      });

      return {
        success: true,
        originalUrl: shortUrl.originalUrl,
        linkId: shortUrl.linkId
      };
    } catch (error) {
      console.error('Error getting original URL:', error);
      return {
        success: false,
        error: 'Failed to resolve short URL'
      };
    }
  }

  /**
   * Get short URL statistics
   */
  async getShortUrlStats(shortCode: string): Promise<ShortUrlStats | null> {
    try {
      const shortUrl = await db.shortUrl.findUnique({
        where: { shortCode }
      });

      if (!shortUrl || !shortUrl.linkId) return null;

      // Get analytics from LinkAnalytics table
      const analytics = await db.linkAnalytics.findMany({
        where: { linkId: shortUrl.linkId },
        orderBy: { clickedAt: 'desc' },
        take: 1000 // Limit for performance
      });

      // Calculate unique clicks (by IP)
      const uniqueIps = new Set(analytics.map((a: any) => a.clickerIp));
      const uniqueClicks = uniqueIps.size;

      // Top countries
      const countryCount: Record<string, number> = {};
      analytics.forEach((a: any) => {
        if (a.country) {
          countryCount[a.country] = (countryCount[a.country] || 0) + 1;
        }
      });

      const topCountries = Object.entries(countryCount)
        .map(([country, clicks]) => ({ country, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      // Top devices
      const deviceCount: Record<string, number> = {};
      analytics.forEach((a: any) => {
        if (a.device) {
          deviceCount[a.device] = (deviceCount[a.device] || 0) + 1;
        }
      });

      const topDevices = Object.entries(deviceCount)
        .map(([device, clicks]) => ({ device, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      // Clicks by date (last 30 days)
      const dateCount: Record<string, number> = {};
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      analytics
        .filter((a: any) => a.clickedAt >= thirtyDaysAgo)
        .forEach((a: any) => {
          const date = a.clickedAt.toISOString().split('T')[0];
          dateCount[date] = (dateCount[date] || 0) + 1;
        });

      const clicksByDate = Object.entries(dateCount)
        .map(([date, clicks]) => ({ date, clicks }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        clicks: shortUrl.clicks,
        uniqueClicks,
        topCountries,
        topDevices,
        clicksByDate
      };
    } catch (error) {
      console.error('Error getting short URL stats:', error);
      return null;
    }
  }

  /**
   * Get user's shortened URLs
   */
  async getUserShortUrls(userId: string) {
    try {
      const shortUrls = await db.shortUrl.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100
      });

      return shortUrls.map((url: any) => ({
        id: url.id,
        shortCode: url.shortCode,
        shortUrl: `${this.getBaseUrl()}/s/${url.shortCode}`,
        originalUrl: url.originalUrl,
        clicks: url.clicks,
        isActive: url.isActive,
        expiresAt: url.expiresAt,
        createdAt: url.createdAt
      }));
    } catch (error) {
      console.error('Error getting user short URLs:', error);
      return [];
    }
  }

  /**
   * Update short URL status
   */
  async updateShortUrl(id: string, data: { isActive?: boolean; expiresAt?: Date | null }) {
    try {
      const updated = await db.shortUrl.update({
        where: { id },
        data
      });

      return { success: true, shortUrl: updated };
    } catch (error) {
      console.error('Error updating short URL:', error);
      return { success: false, error: 'Failed to update short URL' };
    }
  }

  /**
   * Delete short URL
   */
  async deleteShortUrl(id: string) {
    try {
      await db.shortUrl.delete({
        where: { id }
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting short URL:', error);
      return { success: false, error: 'Failed to delete short URL' };
    }
  }
}

export const linkShortener = new LinkShortenerService();
