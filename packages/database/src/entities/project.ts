import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { User } from './user';
import { SourceFile } from './source-file';
import { Run } from './run';

// Define enum locally until common package is built
enum ProjectVisibility {
  private = 'private',
  shared = 'shared',
  public = 'public'
}

@Entity('projects')
@Index(['ownerId'])
@Index(['visibility'])
@Index(['createdAt'])
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid' })
  ownerId!: string;

  @Column({
    type: 'enum',
    enum: ProjectVisibility,
    default: ProjectVisibility.private
  })
  visibility!: ProjectVisibility;

  @Column({ type: 'varchar', array: true, default: [] })
  tags!: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @Column({ type: 'timestamp', nullable: true })
  lastRunAt?: Date;

  // Timestamps
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => User, user => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @OneToMany(() => SourceFile, sourceFile => sourceFile.project, { cascade: true })
  sourceFiles!: SourceFile[];

  @OneToMany(() => Run, run => run.project, { cascade: true })
  runs!: Run[];

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  validateName() {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Project name is required');
    }
    if (this.name.length > 100) {
      throw new Error('Project name must be less than 100 characters');
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateTags() {
    if (this.tags && this.tags.length > 10) {
      throw new Error('Project cannot have more than 10 tags');
    }
    if (this.tags) {
      this.tags = this.tags.filter(tag => tag.trim().length > 0).slice(0, 10);
    }
  }

  // Methods
  isPublic(): boolean {
    return this.visibility === ProjectVisibility.public;
  }

  isPrivate(): boolean {
    return this.visibility === ProjectVisibility.private;
  }

  isShared(): boolean {
    return this.visibility === ProjectVisibility.shared;
  }

  hasTag(tag: string): boolean {
    return this.tags.includes(tag.toLowerCase());
  }

  addTag(tag: string): void {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !this.tags.includes(normalizedTag)) {
      this.tags.push(normalizedTag);
    }
  }

  removeTag(tag: string): void {
    const normalizedTag = tag.toLowerCase().trim();
    this.tags = this.tags.filter(t => t !== normalizedTag);
  }

  getMainFile(): SourceFile | undefined {
    // Try to find main entry point files
    const mainFiles = ['main', 'index', 'app', 'start'];
    const extensions = ['.js', '.ts', '.py', '.java', '.cpp', '.go', '.rs'];
    
    for (const mainFile of mainFiles) {
      for (const ext of extensions) {
        const file = this.sourceFiles?.find(f => 
          f.name === mainFile + ext || f.name === mainFile
        );
        if (file) return file;
      }
    }
    
    // Fallback to first file
    return this.sourceFiles?.[0];
  }

  getFileCount(): number {
    return this.sourceFiles?.length || 0;
  }

  getRunCount(): number {
    return this.runs?.length || 0;
  }

  getLastRunStatus(): string | null {
    if (!this.runs || this.runs.length === 0) return null;
    
    const sortedRuns = [...this.runs].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return sortedRuns[0].status;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      ownerId: this.ownerId,
      visibility: this.visibility,
      tags: this.tags,
      metadata: this.metadata,
      lastRunAt: this.lastRunAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      fileCount: this.getFileCount(),
      runCount: this.getRunCount(),
      lastRunStatus: this.getLastRunStatus(),
    };
  }
}

