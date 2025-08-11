#!/usr/bin/env ts-node

import { config } from 'dotenv';
import { AppDataSource } from './config/data-source';
import { User } from './entities/user';
import { Project } from './entities/project';

// Load environment variables
config();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Initialize the data source
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
    
    // Get repositories
    const userRepository = AppDataSource.getRepository(User);
    const projectRepository = AppDataSource.getRepository(Project);
    
    // Check if data already exists
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('⚠️  Database already contains data, skipping seeding');
      return;
    }
    
    console.log('📝 Creating sample data...');
    
    // Create sample user
    const sampleUser = userRepository.create({
      email: 'demo@sector.local',
      username: 'demo',
      displayName: 'Demo User',
      role: 'student' as any,
      isActive: true,
      preferences: {
        theme: 'dark',
        language: 'en'
      }
    });
    
    const savedUser = await userRepository.save(sampleUser);
    console.log('✅ Sample user created:', savedUser.username);
    
    // Create sample project
    const sampleProject = projectRepository.create({
      name: 'Hello World',
      description: 'A sample project to get started with Sector',
      ownerId: savedUser.id,
      visibility: 'public' as any,
      tags: ['sample', 'hello-world', 'beginner'],
      metadata: {
        language: 'python',
        difficulty: 'beginner'
      }
    });
    
    const savedProject = await projectRepository.save(sampleProject);
    console.log('✅ Sample project created:', savedProject.name);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Created:');
    console.log(`  - 1 user (${savedUser.username})`);
    console.log(`  - 1 project (${savedProject.name})`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    // Close the connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}
