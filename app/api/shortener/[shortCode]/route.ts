import { NextRequest, NextResponse } from 'next/server';
import { linkShortener } from '@/lib/link-shortener';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;
    const result = await linkShortener.getOriginalUrl(shortCode);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }

    // Redirect to original URL
    return NextResponse.redirect(result.originalUrl!, 302);
  } catch (error) {
    console.error('Error in redirect API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
