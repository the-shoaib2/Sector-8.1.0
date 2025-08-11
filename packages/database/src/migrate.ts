#!/usr/bin/env ts-node

import { config } from 'dotenv';
import { AppDataSource } from './config/data-source';

// Load environment variables
config();

async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...');
    
    // Initialize the data source
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
    
    // Run migrations
    const migrations = await AppDataSource.runMigrations();
    console.log(`✅ ${migrations.length} migrations executed successfully`);
    
    // Show migration details
    if (migrations.length > 0) {
      console.log('\n📋 Executed migrations:');
      migrations.forEach(migration => {
        console.log(`  - ${migration.name}`);
      });
    } else {
      console.log('📋 No new migrations to run');
    }
    
    console.log('\n🎉 Database migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}
