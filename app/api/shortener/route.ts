import { NextRequest, NextResponse } from 'next/server';
import { linkShortener } from '@/lib/link-shortener';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    const body = await request.json();
    const { originalUrl, customCode, expiresAt, linkId, urls } = body;

    // Handle bulk URL creation
    if (urls && Array.isArray(urls)) {
      const results = [];
      const errors = [];

      for (const url of urls) {
        try {
          // Validate URL format
          new URL(url);
          
          const result = await linkShortener.createShortUrl({
            originalUrl: url,
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
            userId: user?.id
          });

          if (result.success) {
            results.push(result);
          } else {
            errors.push({ url, error: result.error });
          }
        } catch {
          errors.push({ url, error: 'Invalid URL format' });
        }
      }

      return NextResponse.json({
        success: true,
        results,
        errors,
        processed: results.length,
        failed: errors.length
      });
    }

    // Handle single URL creation
    if (!originalUrl) {
      return NextResponse.json(
        { error: 'Original URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const result = await linkShortener.createShortUrl({
      originalUrl,
      customCode,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      linkId,
      userId: user?.id
    });

    if (!result.success) {
      console.error('Shortener creation failed:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log('Short URL created successfully:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in shortener API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const shortUrls = await linkShortener.getUserShortUrls(user.id);
    return NextResponse.json({ shortUrls });
  } catch (error) {
    console.error('Error fetching short URLs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
