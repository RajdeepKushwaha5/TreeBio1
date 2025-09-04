import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function runMigrations() {
  // Only run migrations in production with DATABASE_URL available
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    try {
      console.log('🔄 Running database migrations...');
      const { stdout, stderr } = await execAsync('npx prisma migrate deploy');
      if (stderr) {
        console.warn('⚠️ Migration warnings:', stderr);
      }
      console.log('✅ Database migrations completed');
      return stdout;
    } catch (error) {
      console.error('❌ Migration failed:', error);
      // Don't throw error - let the app continue with existing schema
      return null;
    }
  }
  return null;
}
