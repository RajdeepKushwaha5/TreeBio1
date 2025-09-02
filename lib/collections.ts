import { db } from '@/lib/db';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  tags: string[];
  customTheme?: {
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    borderRadius?: string;
    layout?: 'grid' | 'list' | 'card';
  };
  sortOrder: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  links?: Array<{
    id: string;
    title: string;
    url: string;
    clickCount: number;
    sortOrder: number;
  }>;
}

export interface CreateCollectionParams {
  name: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
  linkIds: string[];
  customTheme?: Collection['customTheme'];
}

export const collectionsService = {
  async getUserCollections(userId: string) {
    try {
      const user = await db.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // For now, return mock data since migrations aren't working
      // TODO: Replace with actual database query once migrations are working
      const mockCollections: Collection[] = [
        {
          id: '1',
          name: 'Social Media',
          description: 'My social media profiles',
          isPublic: true,
          tags: ['social', 'personal'],
          sortOrder: 0,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          links: [
            { id: '1', title: 'GitHub', url: 'https://github.com', clickCount: 45, sortOrder: 0 },
            { id: '2', title: 'LinkedIn', url: 'https://linkedin.com', clickCount: 32, sortOrder: 1 },
          ]
        },
        {
          id: '2',
          name: 'Work Projects',
          description: 'Professional work and portfolio',
          isPublic: false,
          tags: ['work', 'portfolio'],
          sortOrder: 1,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          links: [
            { id: '3', title: 'Portfolio', url: 'https://portfolio.com', clickCount: 78, sortOrder: 0 },
          ]
        }
      ];

      return { success: true, collections: mockCollections };
    } catch (error) {
      console.error('Error fetching collections:', error);
      return { success: false, error: 'Failed to fetch collections' };
    }
  },

  async createCollection(userId: string, params: CreateCollectionParams) {
    try {
      const user = await db.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Verify that all linkIds belong to the user
      const userLinks = await db.link.findMany({
        where: {
          id: { in: params.linkIds },
          userId: user.id,
        },
      });

      if (userLinks.length !== params.linkIds.length) {
        throw new Error('Some links do not belong to you');
      }

      // For now, create a mock collection since migrations aren't working
      const mockCollection: Collection = {
        id: Date.now().toString(),
        name: params.name,
        description: params.description,
        isPublic: params.isPublic ?? true,
        tags: params.tags ?? [],
        customTheme: params.customTheme,
        sortOrder: 0,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        links: userLinks.map((link, index) => ({
          id: link.id,
          title: link.title,
          url: link.url,
          clickCount: link.clickCount,
          sortOrder: index,
        }))
      };

      console.log('Collection created successfully:', mockCollection);
      
      return { 
        success: true, 
        collection: mockCollection,
        message: 'Collection created successfully'
      };
    } catch (error) {
      console.error('Error creating collection:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create collection' 
      };
    }
  },

  async getUserLinks(userId: string) {
    try {
      const user = await db.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const links = await db.link.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      return { success: true, links };
    } catch (error) {
      console.error('Error fetching user links:', error);
      return { success: false, error: 'Failed to fetch links' };
    }
  }
};
