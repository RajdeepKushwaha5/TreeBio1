"use client";

import { useEffect, useRef, useState } from 'react';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import { Channel } from 'pusher-js';

// Hook for subscribing to user-specific real-time updates
export const useRealtimeUserUpdates = (userId: string) => {
  const channelRef = useRef<Channel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const channel = pusherClient.subscribe(PUSHER_CHANNELS.USER_CHANNEL(userId));
    channelRef.current = channel;

    // Connection events
    pusherClient.connection.bind('connected', () => {
      setIsConnected(true);
    });

    pusherClient.connection.bind('disconnected', () => {
      setIsConnected(false);
    });

    return () => {
      if (channelRef.current) {
        pusherClient.unsubscribe(PUSHER_CHANNELS.USER_CHANNEL(userId));
        channelRef.current = null;
      }
    };
  }, [userId]);

  const subscribe = (event: string, callback: (data: any) => void) => {
    if (channelRef.current) {
      channelRef.current.bind(event, callback);
    }
  };

  const unsubscribe = (event: string, callback: (data: any) => void) => {
    if (channelRef.current) {
      channelRef.current.unbind(event, callback);
    }
  };

  return {
    subscribe,
    unsubscribe,
    isConnected,
    channel: channelRef.current,
  };
};

// Hook for subscribing to public profile updates
export const useRealtimeProfileUpdates = (username: string) => {
  const channelRef = useRef<Channel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!username) return;

    const channel = pusherClient.subscribe(PUSHER_CHANNELS.PUBLIC_CHANNEL(username));
    channelRef.current = channel;

    pusherClient.connection.bind('connected', () => {
      setIsConnected(true);
    });

    pusherClient.connection.bind('disconnected', () => {
      setIsConnected(false);
    });

    return () => {
      if (channelRef.current) {
        pusherClient.unsubscribe(PUSHER_CHANNELS.PUBLIC_CHANNEL(username));
        channelRef.current = null;
      }
    };
  }, [username]);

  const subscribe = (event: string, callback: (data: any) => void) => {
    if (channelRef.current) {
      channelRef.current.bind(event, callback);
    }
  };

  const unsubscribe = (event: string, callback: (data: any) => void) => {
    if (channelRef.current) {
      channelRef.current.unbind(event, callback);
    }
  };

  return {
    subscribe,
    unsubscribe,
    isConnected,
    channel: channelRef.current,
  };
};

// Hook for real-time analytics
export const useRealtimeAnalytics = (userId: string) => {
  const [linkClicks, setLinkClicks] = useState(0);
  const [profileViews, setProfileViews] = useState(0);
  const { subscribe, unsubscribe } = useRealtimeUserUpdates(userId);

  useEffect(() => {
    const handleLinkClick = (data: any) => {
      setLinkClicks(prev => prev + 1);
    };

    const handleProfileView = (data: any) => {
      setProfileViews(prev => prev + 1);
    };

    subscribe(PUSHER_EVENTS.LINK_CLICKED, handleLinkClick);
    subscribe(PUSHER_EVENTS.PROFILE_VIEWED, handleProfileView);

    return () => {
      unsubscribe(PUSHER_EVENTS.LINK_CLICKED, handleLinkClick);
      unsubscribe(PUSHER_EVENTS.PROFILE_VIEWED, handleProfileView);
    };
  }, [subscribe, unsubscribe]);

  return {
    linkClicks,
    profileViews,
  };
};
