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
  private readonly baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  private readonly shortCodeLength = 6;

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

      const fullShortUrl = `${this.baseUrl}/s/${shortCode}`;
      
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
        shortUrl: `${this.baseUrl}/s/${url.shortCode}`,
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
