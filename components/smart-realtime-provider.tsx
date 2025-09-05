/**
 * Smart Real-time Provider
 * Automatically uses Pusher if configured, falls back to polling if not
 * Ensures the application works in all environments
 */

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
  archiveLink: (linkId: string) => Promise<void>;
  reorderLinks: (linkIds: string[]) => Promise<void>;
  addSocialLink: (socialLink: any) => Promise<void>;
  updateSocialLink: (socialLink: any) => Promise<void>;
  deleteSocialLink: (socialLinkId: string) => Promise<void>;
  lastUpdate: Date;
  updateFrequency: number;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function SmartRealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [isConnected, setIsConnected] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [updateFrequency] = useState<number>(30000); // 30 seconds
  const [isPusherAvailable, setIsPusherAvailable] = useState(false);

  // Check if Pusher is available
  useEffect(() => {
    const checkPusher = async () => {
      try {
        const pusherModule = await import('@/lib/pusher');
        setIsPusherAvailable(!!pusherModule.pusherClient);
        console.log('Pusher availability:', !!pusherModule.pusherClient);
      } catch (error) {
        console.log('Pusher not available, using polling fallback');
        setIsPusherAvailable(false);
      }
    };

    checkPusher();
  }, []);

  // Initialize real-time connection
  useEffect(() => {
    if (!user?.id) return;

    const initializeConnection = async () => {
      if (isPusherAvailable) {
        // Use Pusher for real-time updates
        try {
          const { pusherClient, PUSHER_CHANNELS, PUSHER_EVENTS } = await import('@/lib/pusher');
          
          if (pusherClient) {
            const userChannel = pusherClient.subscribe(PUSHER_CHANNELS.USER_CHANNEL(user.id));

            // Connection events
            pusherClient.connection.bind('connected', () => {
              setIsConnected(true);
              console.log('Connected to Pusher real-time');
            });

            pusherClient.connection.bind('disconnected', () => {
              setIsConnected(false);
              console.log('Disconnected from Pusher');
            });

            // Profile updates
            userChannel.bind(PUSHER_EVENTS.PROFILE_UPDATED, (data: any) => {
              console.log('Real-time profile update:', data);
              setProfileData(data.profile || data.settings);
              setLastUpdate(new Date());
              toast.success('Profile updated in real-time!');
            });

            // Link updates
            userChannel.bind(PUSHER_EVENTS.LINK_ADDED, (data: any) => {
              console.log('Real-time link added:', data);
              setLinks(prev => [...prev, data.link]);
              setLastUpdate(new Date());
              toast.success('New link added!');
            });

            userChannel.bind(PUSHER_EVENTS.LINK_UPDATED, (data: any) => {
              console.log('Real-time link updated:', data);
              setLinks(prev => prev.map(link => 
                link.id === data.link.id ? data.link : link
              ));
              setLastUpdate(new Date());
              toast.success('Link updated!');
            });

            userChannel.bind(PUSHER_EVENTS.LINK_DELETED, (data: any) => {
              console.log('Real-time link deleted:', data);
              setLinks(prev => prev.filter(link => link.id !== data.linkId));
              setLastUpdate(new Date());
              toast.success('Link removed!');
            });

            // Social link updates
            userChannel.bind(PUSHER_EVENTS.SOCIAL_LINK_ADDED, (data: any) => {
              console.log('Real-time social link added:', data);
              setSocialLinks(prev => [...prev, data.socialLink]);
              setLastUpdate(new Date());
              toast.success('Social link added!');
            });

            userChannel.bind(PUSHER_EVENTS.SOCIAL_LINK_UPDATED, (data: any) => {
              console.log('Real-time social link updated:', data);
              setSocialLinks(prev => prev.map(link => 
                link.id === data.socialLink.id ? data.socialLink : link
              ));
              setLastUpdate(new Date());
              toast.success('Social link updated!');
            });

            userChannel.bind(PUSHER_EVENTS.SOCIAL_LINK_DELETED, (data: any) => {
              console.log('Real-time social link deleted:', data);
              setSocialLinks(prev => prev.filter(link => link.id !== data.socialLinkId));
              setLastUpdate(new Date());
              toast.success('Social link removed!');
            });

            return () => {
              if (pusherClient) {
                pusherClient.unsubscribe(PUSHER_CHANNELS.USER_CHANNEL(user.id));
              }
            };
          }
        } catch (error) {
          console.error('Error setting up Pusher:', error);
          setIsPusherAvailable(false);
        }
      }

      if (!isPusherAvailable) {
        // Use polling fallback
        setIsConnected(true);
        console.log('Using polling fallback for real-time updates');

        const interval = setInterval(() => {
          refreshData();
        }, updateFrequency);

        return () => clearInterval(interval);
      }
    };

    const cleanup = initializeConnection();

    return () => {
      if (cleanup) {
        cleanup.then(cleanupFn => {
          if (cleanupFn) cleanupFn();
        });
      }
    };
  }, [user?.id, isPusherAvailable, updateFrequency]);

  const refreshData = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfileData(data.user);
          setLinks(data.user.links || []);
          setSocialLinks(data.user.socialLinks || []);
          setLastUpdate(new Date());
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Initial data load
  useEffect(() => {
    if (user?.id) {
      refreshData();
    }
  }, [user?.id]);

  const updateProfile = async (profile: any) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();

      // Update local state immediately for better UX
      if (!isPusherAvailable) {
        setProfileData(data.user);
        setLastUpdate(new Date());
        toast.success('Profile updated!');
      }

      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const addLink = async (link: any) => {
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(link),
      });

      if (!response.ok) {
        throw new Error('Failed to add link');
      }

      const data = await response.json();

      // Update local state immediately for better UX
      setLinks(prev => [...prev, data.link]);
      setLastUpdate(new Date());
      toast.success('Link added!');

      return data;
    } catch (error) {
      console.error('Error adding link:', error);
      toast.error('Failed to add link');
      throw error;
    }
  };

  const updateLink = async (link: any) => {
    try {
      const response = await fetch('/api/links', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(link),
      });

      if (!response.ok) {
        throw new Error('Failed to update link');
      }

      const data = await response.json();

      // Update local state immediately for better UX
      setLinks(prev => prev.map(l => l.id === link.id ? data.link : l));
      setLastUpdate(new Date());
      toast.success('Link updated!');

      return data;
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error('Failed to update link');
      throw error;
    }
  };

  const deleteLink = async (linkId: string) => {
    try {
      const response = await fetch(`/api/links?id=${linkId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete link');
      }

      // Update local state immediately for better UX
      setLinks(prev => prev.filter(l => l.id !== linkId));
      setLastUpdate(new Date());
      toast.success('Link deleted!');
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link');
      throw error;
    }
  };

  const archiveLink = async (linkId: string) => {
    try {
      const response = await fetch('/api/archive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkId }),
      });

      if (!response.ok) {
        throw new Error('Failed to archive link');
      }

      // Update local state immediately - remove from active links
      setLinks(prev => prev.filter(l => l.id !== linkId));
      setLastUpdate(new Date());
      toast.success('Link archived!');
    } catch (error) {
      console.error('Error archiving link:', error);
      toast.error('Failed to archive link');
      throw error;
    }
  };

  const reorderLinks = async (linkIds: string[]) => {
    try {
      const response = await fetch('/api/links/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder links');
      }

      // Update local state immediately with new order
      const reorderedLinks = linkIds.map(id => 
        links.find(link => link.id === id)
      ).filter(Boolean);
      
      setLinks(reorderedLinks);
      setLastUpdate(new Date());
      toast.success('Links reordered!');
    } catch (error) {
      console.error('Error reordering links:', error);
      toast.error('Failed to reorder links');
      throw error;
    }
  };

  const addSocialLink = async (socialLink: any) => {
    try {
      const response = await fetch('/api/social-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(socialLink),
      });

      if (!response.ok) {
        throw new Error('Failed to add social link');
      }

      const data = await response.json();

      // Update local state immediately for better UX
      setSocialLinks(prev => [...prev, data.socialLink]);
      setLastUpdate(new Date());
      toast.success('Social link added!');

      return data;
    } catch (error) {
      console.error('Error adding social link:', error);
      toast.error('Failed to add social link');
      throw error;
    }
  };

  const updateSocialLink = async (socialLink: any) => {
    try {
      const response = await fetch('/api/social-links', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(socialLink),
      });

      if (!response.ok) {
        throw new Error('Failed to update social link');
      }

      const data = await response.json();

      // Update local state immediately for better UX
      setSocialLinks(prev => prev.map(l => l.id === socialLink.id ? data.socialLink : l));
      setLastUpdate(new Date());
      toast.success('Social link updated!');

      return data;
    } catch (error) {
      console.error('Error updating social link:', error);
      toast.error('Failed to update social link');
      throw error;
    }
  };

  const deleteSocialLink = async (socialLinkId: string) => {
    try {
      const response = await fetch('/api/social-links', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: socialLinkId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete social link');
      }

      // Update local state immediately for better UX
      setSocialLinks(prev => prev.filter(l => l.id !== socialLinkId));
      setLastUpdate(new Date());
      toast.success('Social link deleted!');
    } catch (error) {
      console.error('Error deleting social link:', error);
      toast.error('Failed to delete social link');
      throw error;
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
    archiveLink,
    reorderLinks,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    lastUpdate,
    updateFrequency,
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
    throw new Error('useRealtime must be used within a SmartRealtimeProvider');
  }
  return context;
}
