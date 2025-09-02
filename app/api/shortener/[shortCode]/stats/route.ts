import { NextRequest, NextResponse } from 'next/server';
import { linkShortener } from '@/lib/link-shortener';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;
    const stats = await linkShortener.getShortUrlStats(shortCode);

    if (!stats) {
      return NextResponse.json(
        { error: 'Statistics not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching short URL stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
