// Fallback implementation without Pusher for immediate functionality
// This provides professional features without requiring Pusher setup

"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

interface RealtimeContextType {
  isConnected: boolean;
  profileData: any;
  links: any[];
  socialLinks: any[];
  refreshData: () => Promise<void>;
  updateProfile: (profile: any) => Promise<void>;
  addLink: (link: any) => Promise<void>;
  updateLink: (link: any) => Promise<void>;
  deleteLink: (linkId: string) => Promise<void>;
  addSocialLink: (socialLink: any) => Promise<void>;
  updateSocialLink: (socialLink: any) => Promise<void>;
  deleteSocialLink: (socialLinkId: string) => Promise<void>;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [isConnected, setIsConnected] = useState(true); // Always connected in fallback mode
  const [profileData, setProfileData] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    // Simulate connection
    setIsConnected(true);
    console.log('Real-time provider initialized (fallback mode)');

    // Initial data fetch
    refreshData();
  }, [user?.id]);

  const refreshData = async () => {
    try {
      // For now, just set some default data
      // In a real implementation, this would fetch from API
      setProfileData({
        name: user?.firstName + ' ' + user?.lastName || 'Your Name',
        bio: 'Your bio description goes here...',
        avatar: user?.imageUrl || '',
        username: user?.username || 'your-username',
      });
      
      // Set some default links and social links
      setLinks([]);
      setSocialLinks([]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const updateProfile = async (profile: any) => {
    try {
      // Update local state immediately for optimistic UI
      setProfileData(profile);
      toast.success('Profile updated!');
      
      // In a real implementation, this would make API call
      console.log('Profile updated:', profile);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const addLink = async (link: any) => {
    try {
      const newLink = { 
        ...link, 
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      };
      
      setLinks(prev => [...prev, newLink]);
      toast.success('Link added!');
      console.log('Link added:', newLink);
    } catch (error) {
      console.error('Error adding link:', error);
      toast.error('Failed to add link');
    }
  };

  const updateLink = async (link: any) => {
    try {
      setLinks(prev => prev.map(l => l.id === link.id ? link : l));
      toast.success('Link updated!');
      console.log('Link updated:', link);
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error('Failed to update link');
    }
  };

  const deleteLink = async (linkId: string) => {
    try {
      setLinks(prev => prev.filter(l => l.id !== linkId));
      toast.success('Link removed!');
      console.log('Link deleted:', linkId);
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link');
    }
  };

  const addSocialLink = async (socialLink: any) => {
    try {
      const newSocialLink = { 
        ...socialLink, 
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      };
      
      setSocialLinks(prev => [...prev, newSocialLink]);
      toast.success('Social link added!');
      console.log('Social link added:', newSocialLink);
    } catch (error) {
      console.error('Error adding social link:', error);
      toast.error('Failed to add social link');
    }
  };

  const updateSocialLink = async (socialLink: any) => {
    try {
      setSocialLinks(prev => prev.map(l => l.id === socialLink.id ? socialLink : l));
      toast.success('Social link updated!');
      console.log('Social link updated:', socialLink);
    } catch (error) {
      console.error('Error updating social link:', error);
      toast.error('Failed to update social link');
    }
  };

  const deleteSocialLink = async (socialLinkId: string) => {
    try {
      setSocialLinks(prev => prev.filter(l => l.id !== socialLinkId));
      toast.success('Social link removed!');
      console.log('Social link deleted:', socialLinkId);
    } catch (error) {
      console.error('Error deleting social link:', error);
      toast.error('Failed to delete social link');
    }
  };

  const contextValue: RealtimeContextType = {
    isConnected,
    profileData,
    links,
    socialLinks,
    refreshData,
    updateProfile,
    addLink,
    updateLink,
    deleteLink,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
  };

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}
