"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomDomainManager from "@/components/custom-domain-manager";
import { Globe, Settings, Shield, User } from "lucide-react";

export default function AdvancedSettingsPage() {
  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <Settings className="h-8 w-8" />
          Advanced Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your custom domains, security settings, and advanced features
        </p>
      </div>

      <Tabs defaultValue="domains" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="domains" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Custom Domains
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-6">
          <CustomDomainManager />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">Coming Soon</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Login Activity</h4>
                    <p className="text-sm text-muted-foreground">
                      Monitor your account access and active sessions
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">Coming Soon</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <h4 className="font-medium">API Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Manage API keys and access tokens
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">Coming Soon</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Public Profile</h4>
                    <p className="text-sm text-muted-foreground">
                      Manage your public profile visibility and information
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">Available in Settings</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Social Links</h4>
                    <p className="text-sm text-muted-foreground">
                      Add and manage your social media links
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">Available in Settings</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Custom Theme</h4>
                    <p className="text-sm text-muted-foreground">
                      Customize your link tree appearance
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">Available in Design</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Configure your notification preferences
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">Coming Soon</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Analytics Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Control analytics tracking and data collection
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">Coming Soon</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Export Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Download your data and analytics
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">Available in Archive</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
