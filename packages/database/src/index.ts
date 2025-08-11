// ============================================================================
// Database Package Exports
// ============================================================================

// Entities
export { User } from './entities/user';
export { Project } from './entities/project';
export { SourceFile } from './entities/source-file';
export { Run } from './entities/run';
export { TraceEvent } from './entities/trace-event';

// Configuration
export { AppDataSource, initializeDatabase, closeDatabase, checkDatabaseHealth } from './config/data-source';

// Types
export type { DataSource } from 'typeorm';
