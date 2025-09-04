"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  TreesIcon as Tree,
  Heart,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ExternalLink,
  Shield,
  FileText,
  HelpCircle,
  Zap,
  Users,
  BarChart3
} from 'lucide-react';

interface FooterProps {
  variant?: 'default' | 'minimal' | 'admin';
  className?: string;
}

export function Footer({ variant = 'default', className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Minimal footer for admin pages and profiles
  if (variant === 'minimal') {
    return (
      <footer className={`mt-auto border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Tree className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">TreeBio</span>
              <Badge variant="secondary" className="text-xs">v1.0</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <span>© {currentYear}</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Admin footer with dashboard-specific links
  if (variant === 'admin') {
    return (
      <footer className={`mt-auto border-t bg-sidebar/50 ${className}`}>
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-foreground">Quick Actions</h4>
              <div className="space-y-2">
                <Link href="/admin/my-tree" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Edit My Tree
                </Link>
                <Link href="/admin/analytics" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  View Analytics
                </Link>
                <Link href="/admin/settings" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Settings
                </Link>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-foreground">Features</h4>
              <div className="space-y-2">
                <Link href="/admin/enhanced" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Enhanced Features
                </Link>
                <Link href="/admin/archive" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Archive Management
                </Link>
                <Link href="/admin/domains" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Custom Domains
                </Link>
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-foreground">Support</h4>
              <div className="space-y-2">
                <Link href="/help" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
                <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Support
                </Link>
                <Link href="/feedback" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Send Feedback
                </Link>
              </div>
            </div>
          </div>

          <Separator className="my-6" />
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Tree className="h-5 w-5 text-primary" />
              <span className="font-semibold">TreeBio Dashboard</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© {currentYear} TreeBio</span>
              <span>•</span>
              <span>Made with <Heart className="h-3 w-3 inline text-red-500" /> for creators</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Default comprehensive footer for main pages
  return (
    <footer className={`mt-auto border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Tree className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">TreeBio</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              The modern bio link platform for creators, businesses, and influencers. 
              Create beautiful, customizable pages with advanced analytics and features.
            </p>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" asChild>
                <Link href="https://github.com/RajdeepKushwaha5/TreeBio1" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href="https://twitter.com/rajdeeptwts" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Link>
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <div className="space-y-3">
              <Link href="/features" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Features
              </Link>
              <Link href="/templates" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Tree className="h-4 w-4 inline mr-2" />
                Templates
              </Link>
              <Link href="/pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Zap className="h-4 w-4 inline mr-2" />
                Pricing
              </Link>
              <Link href="/changelog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="h-4 w-4 inline mr-2" />
                What's New
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <div className="space-y-3">
              <Link href="/help" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                <HelpCircle className="h-4 w-4 inline mr-2" />
                Help Center
              </Link>
              <Link href="/community" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Users className="h-4 w-4 inline mr-2" />
                Community
              </Link>
              <Link href="/api-docs" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                <FileText className="h-4 w-4 inline mr-2" />
                API Docs
              </Link>
              <Link href="/status" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="h-4 w-4 inline mr-2" />
                Service Status
              </Link>
            </div>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal & Contact</h4>
            <div className="space-y-3">
              <Link href="/privacy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Shield className="h-4 w-4 inline mr-2" />
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                <FileText className="h-4 w-4 inline mr-2" />
                Terms of Service
              </Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4 inline mr-2" />
                Contact Us
              </Link>
              <Link href="/security" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Shield className="h-4 w-4 inline mr-2" />
                Security
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
            <span>© {currentYear} TreeBio. All rights reserved.</span>
            <div className="flex items-center gap-2">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500" />
              <span>by</span>
              <Link 
                href="https://github.com/RajdeepKushwaha5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium hover:text-foreground transition-colors"
              >
                Rajdeep Kushwaha
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-xs">
              v1.0.0
            </Badge>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
