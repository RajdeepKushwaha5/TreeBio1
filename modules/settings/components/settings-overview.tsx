"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ThemeCustomizer } from "@/components/theme/theme-customizer";
import { CustomDomainManager } from "@/components/domain/custom-domain-manager";
import { 
  User, 
  Shield, 
  Globe, 
  Palette, 
  Bell, 
  Lock, 
  Trash2, 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  Monitor,
  Smartphone,
  MapPin,
  Clock
} from "lucide-react";
import {
  getUserSettings,
  updateProfile,
  updateSecuritySettings,
  updateNotificationSettings,
  updatePrivacySettings,
  getActiveSessions,
  deleteUserAccount,
  type SettingsData,
  type ProfileData,
  type SecuritySettings,
  type NotificationSettings,
  type PrivacySettings,
  type SessionData
} from "@/modules/settings/actions";

export default function SettingsOverview() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Real-time data fetching with polling
  const fetchSettings = async () => {
    try {
      const [settingsResult, sessionsResult] = await Promise.all([
        getUserSettings(),
        getActiveSessions()
      ]);

      if (settingsResult.success && settingsResult.data) {
        setSettings(settingsResult.data);
      } else {
        toast.error(settingsResult.error || "Failed to load settings");
      }

      if (sessionsResult.success && sessionsResult.data) {
        setSessions(sessionsResult.data);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time polling
  useEffect(() => {
    fetchSettings();
    
    // Poll every 30 seconds for real-time updates
    const interval = setInterval(fetchSettings, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Profile update handler
  const handleProfileUpdate = async (formData: FormData) => {
    setUpdating("profile");
    try {
      const profileData: Partial<ProfileData> = {
        firstName: formData.get("firstName") as string || null,
        lastName: formData.get("lastName") as string || null,
        username: formData.get("username") as string || null,
        bio: formData.get("bio") as string || null,
      };

      const result = await updateProfile(profileData);
      
      if (result.success) {
        toast.success(result.message);
        await fetchSettings(); // Refresh data
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setUpdating("");
    }
  };

  // Security settings update handler
  const handleSecurityUpdate = async (field: keyof SecuritySettings, value: boolean) => {
    setUpdating("security");
    try {
      const result = await updateSecuritySettings({ [field]: value });
      
      if (result.success) {
        toast.success(result.message);
        await fetchSettings();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to update security settings");
    } finally {
      setUpdating("");
    }
  };

  // Notification settings update handler
  const handleNotificationUpdate = async (field: keyof NotificationSettings, value: boolean) => {
    setUpdating("notifications");
    try {
      const result = await updateNotificationSettings({ [field]: value });
      
      if (result.success) {
        toast.success(result.message);
        await fetchSettings();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to update notification settings");
    } finally {
      setUpdating("");
    }
  };

  // Privacy settings update handler
  const handlePrivacyUpdate = async (field: keyof PrivacySettings, value: boolean) => {
    setUpdating("privacy");
    try {
      const result = await updatePrivacySettings({ [field]: value });
      
      if (result.success) {
        toast.success(result.message);
        await fetchSettings();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to update privacy settings");
    } finally {
      setUpdating("");
    }
  };

  // Account deletion handler
  const handleAccountDeletion = async () => {
    setUpdating("delete");
    try {
      const result = await deleteUserAccount();
      
      if (result.success) {
        toast.success(result.message);
        // Would redirect to sign-out in real implementation
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to delete account");
    } finally {
      setUpdating("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load settings</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with real-time status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSettings}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="domain" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Custom Domain
          </TabsTrigger>
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Themes
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and bio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      defaultValue={settings.profile.firstName || ""}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      defaultValue={settings.profile.lastName || ""}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    defaultValue={settings.profile.username || ""}
                    placeholder="Enter your username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={settings.profile.bio || ""}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={updating === "profile"}
                  className="w-full"
                >
                  {updating === "profile" ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={settings.security.twoFactorEnabled}
                  onCheckedChange={(value) => handleSecurityUpdate("twoFactorEnabled", value)}
                  disabled={updating === "security"}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive security-related email notifications
                  </p>
                </div>
                <Switch
                  checked={settings.security.emailNotifications}
                  onCheckedChange={(value) => handleSecurityUpdate("emailNotifications", value)}
                  disabled={updating === "security"}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about suspicious account activity
                  </p>
                </div>
                <Switch
                  checked={settings.security.securityAlerts}
                  onCheckedChange={(value) => handleSecurityUpdate("securityAlerts", value)}
                  disabled={updating === "security"}
                />
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage devices that are currently signed in to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {session.device.includes("Windows") ? (
                        <Monitor className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">{session.device}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {session.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.lastActive.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.isCurrent && (
                        <Badge variant="secondary">Current</Badge>
                      )}
                      {!session.isCurrent && (
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Domain Tab */}
        <TabsContent value="domain" className="space-y-6">
          <CustomDomainManager />
        </TabsContent>

        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-6">
          <ThemeCustomizer />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive general email notifications
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(value) => handleNotificationUpdate("emailNotifications", value)}
                  disabled={updating === "notifications"}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Analytics Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly analytics reports
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.analyticsReports}
                  onCheckedChange={(value) => handleNotificationUpdate("analyticsReports", value)}
                  disabled={updating === "notifications"}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about security events
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.securityAlerts}
                  onCheckedChange={(value) => handleNotificationUpdate("securityAlerts", value)}
                  disabled={updating === "notifications"}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive product updates and marketing emails
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.marketingEmails}
                  onCheckedChange={(value) => handleNotificationUpdate("marketingEmails", value)}
                  disabled={updating === "notifications"}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your privacy and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to others
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.profileVisibility}
                  onCheckedChange={(value) => handlePrivacyUpdate("profileVisibility", value)}
                  disabled={updating === "privacy"}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Analytics Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow analytics tracking for better insights
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.analyticsTracking}
                  onCheckedChange={(value) => handlePrivacyUpdate("analyticsTracking", value)}
                  disabled={updating === "privacy"}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Data Collection</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow data collection for service improvement
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.dataCollection}
                  onCheckedChange={(value) => handlePrivacyUpdate("dataCollection", value)}
                  disabled={updating === "privacy"}
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that will permanently delete your account and data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    disabled={updating === "delete"}
                    className="w-full"
                  >
                    {updating === "delete" ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Deleting Account...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleAccountDeletion}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
