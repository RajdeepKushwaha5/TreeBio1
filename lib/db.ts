import { PrismaClient } from "@prisma/client"

// Declare global prisma for hot reloading
declare global {
  var __prisma: PrismaClient | undefined
}

// Temporary mock for development when Prisma client isn't generated
const createMockDb = () => ({
  user: {
    upsert: async () => ({ id: 'mock-user', clerkId: 'mock-clerk-id' }),
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => ({ id: 'mock-user' }),
    update: async () => ({ id: 'mock-user' }),
    delete: async () => ({ id: 'mock-user' })
  },
  // Add other models as needed
  link: {
    findMany: async () => [],
    create: async () => ({ id: 'mock-link' })
  }
});

// Initialize Prisma client with proper error handling
let db: PrismaClient;

try {
  // In production, always create a new instance
  // In development, use global instance for hot reloading
  if (process.env.NODE_ENV === "production") {
    db = new PrismaClient({
      log: ['error', 'warn'],
    });
  } else {
    if (!global.__prisma) {
      global.__prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
      });
    }
    db = global.__prisma;
  }
  
  console.log("✅ Prisma client initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize Prisma client:", error);
  throw new Error("Database initialization failed. Please check your DATABASE_URL environment variable.");
}

export { db };