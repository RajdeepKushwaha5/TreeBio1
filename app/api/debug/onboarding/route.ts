import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { testDatabaseConnection } from '@/lib/db-health';
import { db } from '@/lib/db';

export async function GET() {
  try {
    console.log('🔍 Starting debug onboarding test...');

    // Step 1: Check if user is authenticated
    const user = await currentUser();
    console.log('👤 User check:', user ? 'Authenticated' : 'Not authenticated');
    
    if (!user) {
      return NextResponse.json({
        step: 'authentication',
        status: 'failed',
        error: 'No authenticated user found'
      }, { status: 401 });
    }

    // Step 2: Test database connection
    console.log('🔗 Testing database connection...');
    const dbTest = await testDatabaseConnection();
    console.log('💾 Database test result:', dbTest);
    
    if (!dbTest.success) {
      return NextResponse.json({
        step: 'database_connection',
        status: 'failed',
        error: dbTest.error,
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
      }, { status: 500 });
    }

    // Step 3: Try to find existing user
    console.log('🔍 Looking for existing user with clerkId:', user.id);
    const existingUser = await db.user.findUnique({
      where: { clerkId: user.id }
    });
    console.log('👤 Existing user found:', !!existingUser);

    if (existingUser) {
      return NextResponse.json({
        step: 'user_lookup',
        status: 'success',
        message: 'User already exists',
        userId: existingUser.id,
        userDetails: {
          clerkId: existingUser.clerkId,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName
        }
      });
    }

    // Step 4: Try to create new user
    console.log('✨ Creating new user...');
    const newUser = await db.user.create({
      data: {
        clerkId: user.id,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        imageUrl: user.imageUrl || null,
        email: user.emailAddresses[0]?.emailAddress || "",
      }
    });
    console.log('✅ New user created:', newUser.id);

    return NextResponse.json({
      step: 'user_creation',
      status: 'success',
      message: 'New user created successfully',
      userId: newUser.id,
      userDetails: {
        clerkId: newUser.clerkId,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    });

  } catch (error) {
    console.error('❌ Debug onboarding failed:', error);
    return NextResponse.json({
      step: 'unknown',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      errorName: error instanceof Error ? error.name : 'UnknownError'
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
