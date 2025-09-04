import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, MessageCircle, Github, Twitter, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function Contact() {
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
          <MessageCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Contact Us</h1>
        </div>
        
        <p className="text-muted-foreground text-lg">
          Get in touch with the TreeBio team. We're here to help!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              General Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Need help with your TreeBio account or have questions about our features?
            </p>
            <Button className="w-full" asChild>
              <Link href="mailto:support@treebio.com">
                <Mail className="h-4 w-4 mr-2" />
                support@treebio.com
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              Technical Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Found a bug or have a feature request? Let us know on GitHub.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="https://github.com/RajdeepKushwaha5/TreeBio1/issues" target="_blank">
                <Github className="h-4 w-4 mr-2" />
                GitHub Issues
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Twitter className="h-5 w-5" />
              Social Media
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Follow us for updates and quick support on social media.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="https://twitter.com/rajdeeptwts" target="_blank">
                <Twitter className="h-4 w-4 mr-2" />
                @rajdeeptwts
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Business Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Interested in partnerships or business collaborations?
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="mailto:business@treebio.com">
                <Mail className="h-4 w-4 mr-2" />
                business@treebio.com
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Developer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h4 className="font-semibold">Rajdeep Kushwaha</h4>
              <p className="text-muted-foreground">Creator & Lead Developer</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href="https://github.com/RajdeepKushwaha5" target="_blank">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href="https://twitter.com/rajdeeptwts" target="_blank">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            TreeBio is built with ❤️ using Next.js, TypeScript, and modern web technologies.
            Open source and available on GitHub.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
