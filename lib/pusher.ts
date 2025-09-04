import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher instance - with fallback for missing credentials
export const pusherServer = process.env.PUSHER_APP_ID && 
  process.env.NEXT_PUBLIC_PUSHER_KEY && 
  process.env.PUSHER_SECRET && 
  process.env.NEXT_PUBLIC_PUSHER_CLUSTER ? 
  new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
  }) : null;

// Client-side Pusher instance - with fallback for missing credentials
export const pusherClient = process.env.NEXT_PUBLIC_PUSHER_KEY && 
  process.env.NEXT_PUBLIC_PUSHER_CLUSTER ? 
  new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_KEY!,
    {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true,
    }
  ) : null;

// Real-time event types
export const PUSHER_EVENTS = {
  PROFILE_UPDATED: 'profile-updated',
  LINK_ADDED: 'link-added',
  LINK_UPDATED: 'link-updated',
  LINK_DELETED: 'link-deleted',
  SOCIAL_LINK_ADDED: 'social-link-added',
  SOCIAL_LINK_UPDATED: 'social-link-updated',
  SOCIAL_LINK_DELETED: 'social-link-deleted',
  LINK_CLICKED: 'link-clicked',
  PROFILE_VIEWED: 'profile-viewed',
} as const;

// Channel names
export const PUSHER_CHANNELS = {
  USER_CHANNEL: (userId: string) => `private-user-${userId}`,
  PUBLIC_CHANNEL: (username: string) => `public-profile-${username}`,
} as const;

// Utility function to trigger real-time events
export const triggerRealtimeEvent = async (
  channel: string,
  event: string,
  data: any
) => {
  try {
    if (pusherServer) {
      await pusherServer.trigger(channel, event, data);
    } else {
      console.log('Pusher not configured - skipping real-time event:', { channel, event, data });
    }
  } catch (error) {
    console.error('Failed to trigger real-time event:', error);
  }
};
