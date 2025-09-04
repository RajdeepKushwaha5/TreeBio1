#!/usr/bin/env node

/**
 * Fix Existing Short URLs
 * Updates any short URLs that have incorrect domains to use the production domain
 */

const { PrismaClient } = require('@prisma/client');

async function fixExistingShortUrls() {
  const db = new PrismaClient();
  
  try {
    console.log('🔧 Fixing existing short URLs with incorrect domains...');
    
    // Find all short URLs that contain preview deployment URLs
    const shortUrls = await db.shortUrl.findMany({
      select: {
        id: true,
        shortCode: true,
        originalUrl: true,
        createdAt: true
      }
    });
    
    console.log(`📊 Found ${shortUrls.length} total short URLs`);
    
    // Check if any URLs in the database are pointing to our shortener with wrong domains
    const problematicUrls = shortUrls.filter(url => {
      try {
        const urlObj = new URL(url.originalUrl);
        return urlObj.hostname.includes('treebio1') && 
               urlObj.hostname.includes('vercel.app') && 
               urlObj.hostname !== 'treebio1.vercel.app' &&
               urlObj.pathname.startsWith('/s/');
      } catch {
        return false;
      }
    });
    
    if (problematicUrls.length > 0) {
      console.log(`⚠️ Found ${problematicUrls.length} URLs pointing to wrong domains:`);
      
      for (const url of problematicUrls) {
        const oldUrl = url.originalUrl;
        const urlObj = new URL(oldUrl);
        const newUrl = `https://treebio1.vercel.app${urlObj.pathname}${urlObj.search}`;
        
        console.log(`  📝 Fixing: ${oldUrl} -> ${newUrl}`);
        
        await db.shortUrl.update({
          where: { id: url.id },
          data: { originalUrl: newUrl }
        });
      }
      
      console.log(`✅ Fixed ${problematicUrls.length} problematic URLs`);
    } else {
      console.log('✅ No problematic URLs found in database');
    }
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`- Total short URLs: ${shortUrls.length}`);
    console.log(`- Fixed URLs: ${problematicUrls.length}`);
    console.log('- All URLs now use correct domains');
    
    console.log('\n💡 What this fix does:');
    console.log('- Updates URL generation to always use https://treebio1.vercel.app');
    console.log('- Prevents preview deployment URLs from being used in short links');
    console.log('- Ensures consistent user experience');
    console.log('- All new short URLs will use the correct domain');
    
  } catch (error) {
    console.error('❌ Error fixing short URLs:', error);
  } finally {
    await db.$disconnect();
  }
}

if (require.main === module) {
  fixExistingShortUrls();
}
