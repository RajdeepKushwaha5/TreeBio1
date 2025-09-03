import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// Client-side Pusher instance
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    forceTLS: true,
  }
);

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
    await pusherServer.trigger(channel, event, data);
  } catch (error) {
    console.error('Failed to trigger real-time event:', error);
  }
};
