import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/user';
import { Project } from '../entities/project';
import { SourceFile } from '../entities/source-file';
import { Run } from '../entities/run';
import { TraceEvent } from '../entities/trace-event';

// Load environment variables
config();

// Database configuration based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

// Base configuration
const baseConfig = {
  type: 'postgres' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'sector_user',
  password: process.env.DB_PASSWORD || 'sector_password',
  database: process.env.DB_NAME || 'sector_dev',
  synchronize: isDevelopment || isTest, // Auto-sync in development/test
  logging: isDevelopment,
  entities: [User, Project, SourceFile, Run, TraceEvent],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

// Test configuration
const testConfig = {
  ...baseConfig,
  type: 'sqlite' as const,
  database: ':memory:',
  synchronize: true,
  logging: false,
};

// Development configuration
const developmentConfig = {
  ...baseConfig,
  synchronize: true,
  logging: true,
};

// Production configuration
const productionConfig = {
  ...baseConfig,
  synchronize: false,
  logging: false,
  ssl: { rejectUnauthorized: false },
};

// Select configuration based on environment
let dataSourceOptions: any;
if (isTest) {
  dataSourceOptions = testConfig;
} else if (isDevelopment) {
  dataSourceOptions = developmentConfig;
} else {
  dataSourceOptions = productionConfig;
}

// Create DataSource instance
export const AppDataSource = new DataSource(dataSourceOptions);

// Initialize database connection
export async function initializeDatabase(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ Database connection established successfully');
    }
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}

// Close database connection
export async function closeDatabase(): Promise<void> {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  } catch (error) {
    console.error('❌ Failed to close database connection:', error);
    throw error;
  }
}

// Check database health
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    if (!AppDataSource.isInitialized) {
      return false;
    }
    
    // Simple query to check if database is responsive
    await AppDataSource.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

