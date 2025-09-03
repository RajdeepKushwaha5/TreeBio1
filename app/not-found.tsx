"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-8">
          <div className="text-9xl font-bold text-muted-foreground/30 mb-4">404</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full" size="lg">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Need help? <Link href="/admin" className="text-primary hover:underline">Visit your dashboard</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
