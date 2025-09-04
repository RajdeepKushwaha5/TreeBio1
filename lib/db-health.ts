import { db } from './db';

export async function testDatabaseConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    // Simple database connectivity test
    await db.$queryRaw`SELECT 1`;
    console.log("✅ Database connection test successful");
    return { success: true };
  } catch (error) {
    console.error("❌ Database connection test failed:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
}
