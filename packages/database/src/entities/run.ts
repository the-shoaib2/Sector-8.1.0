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
import { Project } from './project';
import { TraceEvent } from './trace-event';

// Define enum locally until common package is built
enum RunStatus {
  pending = 'pending',
  running = 'running',
  completed = 'completed',
  failed = 'failed',
  cancelled = 'cancelled',
  timeout = 'timeout'
}

@Entity('runs')
@Index(['projectId'])
@Index(['status'])
@Index(['language'])
@Index(['createdAt'])
export class Run {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  projectId!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: RunStatus,
    default: RunStatus.pending
  })
  status!: RunStatus;

  @Column({ type: 'varchar', length: 50 })
  language!: string;

  @Column({ type: 'varchar', length: 200 })
  entryPoint!: string;

  @Column({ type: 'varchar', array: true, default: [] })
  arguments!: string[];

  @Column({ type: 'jsonb', default: {} })
  environment!: Record<string, string>;

  @Column({ type: 'jsonb', nullable: true })
  resourceLimits?: {
    memory?: number; // MB
    cpu?: number;    // CPU cores
    timeout?: number; // seconds
  };

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'bigint', nullable: true })
  duration?: number; // milliseconds

  @Column({ type: 'integer', nullable: true })
  exitCode?: number;

  @Column({ type: 'text', nullable: true })
  error?: string;

  @Column({ type: 'text', nullable: true })
  output?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => Project, project => project.runs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @OneToMany(() => TraceEvent, traceEvent => traceEvent.run, { cascade: true })
  traceEvents!: TraceEvent[];

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  validateName() {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Run name is required');
    }
    if (this.name.length > 100) {
      throw new Error('Run name must be less than 100 characters');
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateEntryPoint() {
    if (!this.entryPoint || this.entryPoint.trim().length === 0) {
      throw new Error('Entry point is required');
    }
    if (this.entryPoint.length > 200) {
      throw new Error('Entry point must be less than 200 characters');
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateLanguage() {
    if (!this.language || this.language.trim().length === 0) {
      throw new Error('Language is required');
    }
    if (this.language.length > 50) {
      throw new Error('Language must be less than 50 characters');
    }
  }

  // Methods
  isRunning(): boolean {
    return this.status === RunStatus.running;
  }

  isCompleted(): boolean {
    return this.status === RunStatus.completed;
  }

  isFailed(): boolean {
    return this.status === RunStatus.failed;
  }

  isPending(): boolean {
    return this.status === RunStatus.pending;
  }

  isCancelled(): boolean {
    return this.status === RunStatus.cancelled;
  }

  isTimeout(): boolean {
    return this.status === RunStatus.timeout;
  }

  start(): void {
    if (this.status !== RunStatus.pending) {
      throw new Error('Can only start pending runs');
    }
    this.status = RunStatus.running;
    this.startedAt = new Date();
  }

  complete(exitCode: number, output?: string): void {
    if (this.status !== RunStatus.running) {
      throw new Error('Can only complete running runs');
    }
    this.status = RunStatus.completed;
    this.completedAt = new Date();
    this.exitCode = exitCode;
    this.output = output;
    this.duration = this.completedAt.getTime() - this.startedAt!.getTime();
  }

  fail(error: string): void {
    if (this.status !== RunStatus.running) {
      throw new Error('Can only fail running runs');
    }
    this.status = RunStatus.failed;
    this.completedAt = new Date();
    this.error = error;
    this.duration = this.completedAt.getTime() - this.startedAt!.getTime();
  }

  cancel(): void {
    if (this.status !== RunStatus.pending && this.status !== RunStatus.running) {
      throw new Error('Can only cancel pending or running runs');
    }
    this.status = RunStatus.cancelled;
    this.completedAt = new Date();
    if (this.startedAt) {
      this.duration = this.completedAt.getTime() - this.startedAt.getTime();
    }
  }

  timeout(): void {
    if (this.status !== RunStatus.running) {
      throw new Error('Can only timeout running runs');
    }
    this.status = RunStatus.timeout;
    this.completedAt = new Date();
    this.error = 'Execution timed out';
    this.duration = this.completedAt.getTime() - this.startedAt!.getTime();
  }

  getDurationFormatted(): string {
    if (!this.duration) return 'N/A';
    
    const seconds = Math.floor(this.duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  getStatusColor(): string {
    switch (this.status) {
      case RunStatus.pending: return 'yellow';
      case RunStatus.running: return 'blue';
      case RunStatus.completed: return 'green';
      case RunStatus.failed: return 'red';
      case RunStatus.cancelled: return 'gray';
      case RunStatus.timeout: return 'orange';
      default: return 'gray';
    }
  }

  toJSON() {
    return {
      id: this.id,
      projectId: this.projectId,
      name: this.name,
      description: this.description,
      status: this.status,
      language: this.language,
      entryPoint: this.entryPoint,
      arguments: this.arguments,
      environment: this.environment,
      resourceLimits: this.resourceLimits,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      duration: this.duration,
      durationFormatted: this.getDurationFormatted(),
      exitCode: this.exitCode,
      error: this.error,
      output: this.output,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      statusColor: this.getStatusColor(),
      isRunning: this.isRunning(),
      isCompleted: this.isCompleted(),
      isFailed: this.isFailed(),
    };
  }
}
