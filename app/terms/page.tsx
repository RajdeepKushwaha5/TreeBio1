import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        
        <div className="flex items-center gap-3 mb-4">
          <Scale className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>
        
        <p className="text-muted-foreground text-lg">
          Last updated: September 4, 2025
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using TreeBio, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Use License
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Permission is granted to temporarily use TreeBio for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title, 
              and under this license you may not:
            </p>
            
            <ul className="space-y-2 text-muted-foreground">
              <li>• Modify or copy the materials</li>
              <li>• Use the materials for any commercial purpose or for any public display</li>
              <li>• Attempt to reverse engineer any software contained on the website</li>
              <li>• Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              User Content and Conduct
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Content Guidelines</h4>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for all content you post on TreeBio. You agree not to 
                post content that is illegal, harmful, threatening, abusive, defamatory, 
                vulgar, obscene, or otherwise objectionable.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Prohibited Uses</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Spam, phishing, or malicious content</li>
                <li>• Copyright infringement</li>
                <li>• Impersonation of others</li>
                <li>• Harassment or abuse of other users</li>
                <li>• Any illegal activities</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              We strive to maintain high service availability but cannot guarantee uninterrupted 
              access. We reserve the right to modify or discontinue any part of the service 
              with or without notice. We are not liable for any modification, suspension, 
              or discontinuance of the service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall TreeBio or its suppliers be liable for any damages (including, 
              without limitation, damages for loss of data or profit, or due to business 
              interruption) arising out of the use or inability to use TreeBio, even if 
              TreeBio or a TreeBio authorized representative has been notified orally or 
              in writing of the possibility of such damage.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to terminate accounts that violate these terms of service 
              or engage in behavior that we deem harmful to the platform or other users. 
              You may also terminate your account at any time through your account settings.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:{' '}
              <Link href="mailto:legal@treebio.com" className="text-primary hover:underline">
                legal@treebio.com
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
