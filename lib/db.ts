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

// Initialize Prisma client with fallback
let db: PrismaClient | any;

try {
  db = global.__prisma || new PrismaClient();
  if (process.env.NODE_ENV !== "production") {
    global.__prisma = db;
  }
} catch (error) {
  console.warn("⚠️ Prisma client not generated. Using mock database. Please run 'npx prisma generate'");
  db = createMockDb();
}

export { db };