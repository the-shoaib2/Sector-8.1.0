import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { Project } from './project';

@Entity('source_files')
@Index(['projectId'])
@Index(['language'])
@Index(['path'])
export class SourceFile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  projectId!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 500 })
  path!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'varchar', length: 50 })
  language!: string;

  @Column({ type: 'bigint' })
  size!: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => Project, project => project.sourceFiles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  validateName() {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Source file name is required');
    }
    if (this.name.length > 100) {
      throw new Error('Source file name must be less than 100 characters');
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validatePath() {
    if (!this.path || this.path.trim().length === 0) {
      throw new Error('Source file path is required');
    }
    if (this.path.length > 500) {
      throw new Error('Source file path must be less than 500 characters');
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateContent() {
    if (this.content === undefined || this.content === null) {
      throw new Error('Source file content is required');
    }
    this.size = Buffer.byteLength(this.content, 'utf8');
  }

  // Methods
  getExtension(): string {
    const parts = this.name.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }

  getFileNameWithoutExtension(): string {
    return this.name.replace(/\.[^/.]+$/, '');
  }

  isBinary(): boolean {
    const binaryExtensions = ['exe', 'dll', 'so', 'dylib', 'bin', 'obj', 'o', 'a'];
    return binaryExtensions.includes(this.getExtension().toLowerCase());
  }

  isImage(): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    return imageExtensions.includes(this.getExtension().toLowerCase());
  }

  isDocument(): boolean {
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'md', 'rtf'];
    return documentExtensions.includes(this.getExtension().toLowerCase());
  }

  toJSON() {
    return {
      id: this.id,
      projectId: this.projectId,
      name: this.name,
      path: this.path,
      language: this.language,
      size: this.size,
      extension: this.getExtension(),
      isBinary: this.isBinary(),
      isImage: this.isImage(),
      isDocument: this.isDocument(),
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
