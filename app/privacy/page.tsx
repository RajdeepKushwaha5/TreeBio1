import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Eye, Lock, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
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
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        
        <p className="text-muted-foreground text-lg">
          Last updated: September 4, 2025
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Personal Information</h4>
              <p className="text-muted-foreground leading-relaxed">
                When you create an account with TreeBio, we collect information such as your name, 
                email address, username, and profile information you choose to share. This information 
                is necessary to provide our bio link services.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Usage Data</h4>
              <p className="text-muted-foreground leading-relaxed">
                We collect information about how you use our service, including link clicks, 
                page views, and analytics data to help you understand your audience and improve 
                our platform.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Device Information</h4>
              <p className="text-muted-foreground leading-relaxed">
                We may collect information about the device you use to access TreeBio, 
                including browser type, operating system, and IP address for security and 
                optimization purposes.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Provide and maintain our bio link platform services</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Generate analytics and insights for your links and profile</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Send important service updates and notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Improve our platform and develop new features</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Ensure security and prevent fraud</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Data Protection & Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. You have the 
              right to:
            </p>
            
            <ul className="space-y-2 text-muted-foreground">
              <li>• Access and review your personal data</li>
              <li>• Request corrections to inaccurate information</li>
              <li>• Request deletion of your account and data</li>
              <li>• Export your data in a portable format</li>
              <li>• Opt-out of non-essential communications</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, 
              please contact us at:{' '}
              <Link href="mailto:privacy@treebio.com" className="text-primary hover:underline">
                privacy@treebio.com
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
