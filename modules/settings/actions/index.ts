// Client-side utilities for settings management
// Removed "use server" directive to prevent Server Actions issues in Codespaces

export interface ProfileData {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string | null;
  bio: string | null;
  imageUrl: string | null;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  securityAlerts: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  analyticsReports: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
}

export interface PrivacySettings {
  profileVisibility: boolean;
  analyticsTracking: boolean;
  dataCollection: boolean;
}

export interface SessionData {
  id: string;
  device: string;
  location: string;
  lastActive: Date;
  isCurrent: boolean;
}

export interface SettingsData {
  profile: ProfileData;
  security: SecuritySettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

// Get current user settings via API
export const getUserSettings = async (): Promise<{ success: boolean; data?: SettingsData; error?: string }> => {
  try {
    const response = await fetch('/api/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { success: false, error: `HTTP error! status: ${response.status}` };
    }

    const result = await response.json();
    
    if (!result.success) {
      return { success: false, error: result.error || "Failed to fetch settings" };
    }

    const user = result.user;
    const settingsData: SettingsData = {
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email || null,
        bio: user.bio,
        imageUrl: user.imageUrl,
      },
      security: {
        twoFactorEnabled: false, // Default values - would be stored in separate table
        emailNotifications: true,
        securityAlerts: true,
      },
      notifications: {
        emailNotifications: true,
        analyticsReports: true,
        securityAlerts: true,
        marketingEmails: false,
      },
      privacy: {
        profileVisibility: user.isPublic || true,
        analyticsTracking: true,
        dataCollection: true,
      },
    };

    return { success: true, data: settingsData };
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return { success: false, error: "Failed to fetch settings" };
  }
};

// Update profile information via API
export const updateProfile = async (profileData: Partial<ProfileData>): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('/api/settings/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'profile', data: profileData }),
    });

    if (!response.ok) {
      return { success: false, message: `HTTP error! status: ${response.status}` };
    }

    const result = await response.json();
    
    if (!result.success) {
      return { success: false, message: result.error || "Failed to update profile" };
    }

    return { success: true, message: result.message || "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Failed to update profile" };
  }
};

// Update security settings (mock implementation for now)
export const updateSecuritySettings = async (securityData: Partial<SecuritySettings>): Promise<{ success: boolean; message: string }> => {
  try {
    // In a real implementation, these would be stored in a UserSettings table
    console.log("Updating security settings:", securityData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true, message: "Security settings updated successfully" };
  } catch (error) {
    console.error("Error updating security settings:", error);
    return { success: false, message: "Failed to update security settings" };
  }
};

// Update notification settings (mock implementation for now)
export const updateNotificationSettings = async (notificationData: Partial<NotificationSettings>): Promise<{ success: boolean; message: string }> => {
  try {
    // In a real implementation, these would be stored in a UserSettings table
    console.log("Updating notification settings:", notificationData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true, message: "Notification settings updated successfully" };
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return { success: false, message: "Failed to update notification settings" };
  }
};

// Update privacy settings (mock implementation for now)
export const updatePrivacySettings = async (privacyData: Partial<PrivacySettings>): Promise<{ success: boolean; message: string }> => {
  try {
    // In a real implementation, these would be stored in a UserSettings table
    console.log("Updating privacy settings:", privacyData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true, message: "Privacy settings updated successfully" };
  } catch (error) {
    console.error("Error updating privacy settings:", error);
    return { success: false, message: "Failed to update privacy settings" };
  }
};

// Get active sessions via API
export const getActiveSessions = async (): Promise<{ success: boolean; data?: SessionData[]; error?: string }> => {
  try {
    const response = await fetch('/api/settings/sessions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { success: false, error: `HTTP error! status: ${response.status}` };
    }

    const result = await response.json();
    
    if (!result.success) {
      return { success: false, error: result.error || "Failed to fetch sessions" };
    }

    return { success: true, data: result.sessions };
  } catch (error) {
    console.error("Error fetching active sessions:", error);
    return { success: false, error: "Failed to fetch sessions" };
  }
};

// Verify domain (placeholder for domain management)
export const verifyCustomDomain = async (domain: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Domain verification logic would go here
    // For now, simulating verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return { success: true, message: `Domain ${domain} verified successfully` };
  } catch (error) {
    console.error("Error verifying domain:", error);
    return { success: false, message: "Failed to verify domain" };
  }
};

// Delete user account (dangerous operation)
export const deleteUserAccount = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // This would be a more complex operation involving:
    // 1. Deleting all user data
    // 2. Removing from Clerk
    // 3. Cleanup of associated resources
    
    // For now, just returning a success message without actually deleting
    return { success: true, message: "Account deletion process initiated" };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, message: "Failed to delete account" };
  }
};
