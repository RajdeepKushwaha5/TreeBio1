const { PrismaClient } = require('@prisma/client');

async function checkAndSetupDatabase() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Checking database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    console.log('📊 Checking ShortUrl table...');
    const shortUrls = await prisma.shortUrl.findMany({ take: 5 });
    console.log(`✅ Found ${shortUrls.length} existing short URLs`);

    console.log('🧪 Testing short URL creation...');
    const testUrl = 'https://example.com/test-' + Date.now();
    const shortCode = 'test' + Math.random().toString(36).substring(7);

    const testShortUrl = await prisma.shortUrl.create({
      data: {
        shortCode,
        originalUrl: testUrl,
        userId: null,
        linkId: null
      }
    });

    console.log('✅ Test short URL created:', {
      id: testShortUrl.id,
      shortCode: testShortUrl.shortCode,
      originalUrl: testShortUrl.originalUrl
    });

    console.log('🧪 Testing short URL retrieval...');
    const retrieved = await prisma.shortUrl.findUnique({
      where: { shortCode }
    });

    if (retrieved) {
      console.log('✅ Short URL retrieval successful');
    } else {
      console.log('❌ Short URL retrieval failed');
    }

    console.log('🧹 Cleaning up test data...');
    await prisma.shortUrl.delete({
      where: { id: testShortUrl.id }
    });

    console.log('✅ Database setup verification complete!');

  } catch (error) {
    console.error('❌ Database error:', error);

    if (error.code === 'P2002') {
      console.log('🔍 Unique constraint violation - this is expected for duplicate codes');
    } else if (error.code === 'P1001') {
      console.log('❌ Cannot connect to database. Please check:');
      console.log('  1. Database is running');
      console.log('  2. DATABASE_URL is correct in .env file');
      console.log('  3. Database permissions are correct');
    } else {
      console.log('❌ Unexpected error. Error details:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkAndSetupDatabase();
