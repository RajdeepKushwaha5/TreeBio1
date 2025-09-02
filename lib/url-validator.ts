/**
 * URL validation utilities for the Link Shortener
 */

export function validateUrl(url: string): { isValid: boolean; error?: string; normalizedUrl?: string } {
  try {
    // Remove whitespace
    const trimmedUrl = url.trim();
    
    if (!trimmedUrl) {
      return { isValid: false, error: 'URL is required' };
    }

    // Add protocol if missing
    let normalizedUrl = trimmedUrl;
    if (!trimmedUrl.match(/^https?:\/\//)) {
      normalizedUrl = `https://${trimmedUrl}`;
    }

    // Validate URL structure
    const parsedUrl = new URL(normalizedUrl);

    // Check for valid protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { isValid: false, error: 'URL must use http or https protocol' };
    }

    // Check for localhost in production
    if (process.env.NODE_ENV === 'production' && 
        (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1')) {
      return { isValid: false, error: 'Localhost URLs are not allowed in production' };
    }

    // Check for minimum hostname length
    if (parsedUrl.hostname.length < 3) {
      return { isValid: false, error: 'Invalid hostname' };
    }

    return { isValid: true, normalizedUrl };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

export function isShortUrl(url: string, baseUrl: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const parsedBaseUrl = new URL(baseUrl);
    
    return parsedUrl.hostname === parsedBaseUrl.hostname && 
           parsedUrl.pathname.startsWith('/s/');
  } catch {
    return false;
  }
}

export function sanitizeUrl(url: string): string {
  return url.trim().replace(/[<>]/g, '');
}
