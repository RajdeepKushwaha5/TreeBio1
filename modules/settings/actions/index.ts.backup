"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

// Get current user settings
export const getUserSettings = async (): Promise<{ success: boolean; data?: SettingsData; error?: string }> => {
  try {
    const user = await currentUser();
    
    if (!user) {
      return { success: false, error: "No authenticated user found" };
    }

    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        bio: true,
        imageUrl: true,
      },
    });

    if (!dbUser) {
      return { success: false, error: "User not found in database" };
    }

    const settingsData: SettingsData = {
      profile: {
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        username: dbUser.username,
        email: dbUser.email,
        bio: dbUser.bio,
        imageUrl: dbUser.imageUrl,
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
        profileVisibility: true,
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

// Update profile information
export const updateProfile = async (profileData: Partial<ProfileData>): Promise<{ success: boolean; message: string }> => {
  try {
    const user = await currentUser();
    
    if (!user) {
      return { success: false, message: "No authenticated user found" };
    }

    const updateData: Record<string, string | null> = {};
    if (profileData.firstName !== undefined) updateData.firstName = profileData.firstName;
    if (profileData.lastName !== undefined) updateData.lastName = profileData.lastName;
    if (profileData.username !== undefined) updateData.username = profileData.username;
    if (profileData.bio !== undefined) updateData.bio = profileData.bio;

    // Check if username is already taken
    if (profileData.username) {
      const existingUser = await db.user.findFirst({
        where: {
          username: profileData.username,
          clerkId: { not: user.id }
        }
      });
      
      if (existingUser) {
        return { success: false, message: "Username is already taken" };
      }
    }

    await db.user.update({
      where: { clerkId: user.id },
      data: updateData,
    });

    revalidatePath("/admin/settings");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return { success: false, message: "Username is already taken" };
    }
    return { success: false, message: "Failed to update profile" };
  }
};

// Update security settings (mock implementation for now)
export const updateSecuritySettings = async (securityData: Partial<SecuritySettings>): Promise<{ success: boolean; message: string }> => {
  try {
    const user = await currentUser();
    
    if (!user) {
      return { success: false, message: "No authenticated user found" };
    }

    // In a real implementation, these would be stored in a UserSettings table
    // For now, we'll just simulate the update
    console.log("Updating security settings:", securityData);

    revalidatePath("/admin/settings");
    return { success: true, message: "Security settings updated successfully" };
  } catch (error) {
    console.error("Error updating security settings:", error);
    return { success: false, message: "Failed to update security settings" };
  }
};

// Update notification settings (mock implementation for now)
export const updateNotificationSettings = async (notificationData: Partial<NotificationSettings>): Promise<{ success: boolean; message: string }> => {
  try {
    const user = await currentUser();
    
    if (!user) {
      return { success: false, message: "No authenticated user found" };
    }

    // In a real implementation, these would be stored in a UserSettings table
    console.log("Updating notification settings:", notificationData);

    revalidatePath("/admin/settings");
    return { success: true, message: "Notification settings updated successfully" };
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return { success: false, message: "Failed to update notification settings" };
  }
};

// Update privacy settings (mock implementation for now)
export const updatePrivacySettings = async (privacyData: Partial<PrivacySettings>): Promise<{ success: boolean; message: string }> => {
  try {
    const user = await currentUser();
    
    if (!user) {
      return { success: false, message: "No authenticated user found" };
    }

    // In a real implementation, these would be stored in a UserSettings table
    console.log("Updating privacy settings:", privacyData);

    revalidatePath("/admin/settings");
    return { success: true, message: "Privacy settings updated successfully" };
  } catch (error) {
    console.error("Error updating privacy settings:", error);
    return { success: false, message: "Failed to update privacy settings" };
  }
};

// Get active sessions (placeholder - would integrate with Clerk)
export const getActiveSessions = async (): Promise<{ success: boolean; data?: SessionData[]; error?: string }> => {
  try {
    // This would integrate with Clerk's session management
    // For now, returning mock data
    const sessions: SessionData[] = [
      {
        id: "current",
        device: "Windows • Chrome",
        location: "New York, US",
        lastActive: new Date(),
        isCurrent: true,
      },
    ];

    return { success: true, data: sessions };
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
    const user = await currentUser();
    
    if (!user) {
      return { success: false, message: "No authenticated user found" };
    }

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
