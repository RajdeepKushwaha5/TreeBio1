import { redirect, notFound } from 'next/navigation';
import { linkShortener } from '@/lib/link-shortener';

interface RedirectPageProps {
  params: Promise<{
    shortCode: string;
  }>;
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  try {
    const { shortCode } = await params;
    
    console.log('Redirect page accessed with shortCode:', shortCode);
    
    if (!shortCode || shortCode.trim() === '') {
      console.log('No shortCode provided');
      notFound();
      return;
    }

    // Get the original URL from the short code (this also increments clicks)
    const result = await linkShortener.getOriginalUrl(shortCode);
    console.log('Link shortener result:', result);

    if (!result.success || !result.originalUrl) {
      console.log('Failed to resolve short URL:', result.error);
      notFound();
      return;
    }

    console.log('Redirecting to:', result.originalUrl);

    // Redirect to the original URL
    redirect(result.originalUrl);
  } catch (error) {
    console.error('Error in redirect page:', error);
    notFound();
  }
}