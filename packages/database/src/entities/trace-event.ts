import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { Run } from './run';

// Define TraceEventType enum locally until common package is built
enum TraceEventType {
  line_execution = 'line_execution',
  variable_change = 'variable_change',
  function_call = 'function_call',
  error = 'error',
  output = 'output',
  memory_usage = 'memory_usage',
  cpu_usage = 'cpu_usage',
  breakpoint = 'breakpoint',
  step = 'step',
}

@Entity('trace_events')
@Index(['runId'])
@Index(['type'])
@Index(['timestamp'])
@Index(['lineNumber'])
export class TraceEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  runId!: string;

  @Column({
    type: 'enum',
    enum: TraceEventType
  })
  type!: TraceEventType;

  @Column({ type: 'timestamp' })
  timestamp!: Date;

  @Column({ type: 'integer', nullable: true })
  lineNumber?: number;

  @Column({ type: 'integer', nullable: true })
  columnNumber?: number;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  // Relationships
  @ManyToOne(() => Run, run => run.traceEvents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'runId' })
  run!: Run;

  // Methods
  isLineExecution(): boolean {
    return this.type === TraceEventType.line_execution;
  }

  isVariableChange(): boolean {
    return this.type === TraceEventType.variable_change;
  }

  isFunctionCall(): boolean {
    return this.type === TraceEventType.function_call;
  }

  isError(): boolean {
    return this.type === TraceEventType.error;
  }

  isOutput(): boolean {
    return this.type === TraceEventType.output;
  }

  isMemoryUsage(): boolean {
    return this.type === TraceEventType.memory_usage;
  }

  isCpuUsage(): boolean {
    return this.type === TraceEventType.cpu_usage;
  }

  isBreakpoint(): boolean {
    return this.type === TraceEventType.breakpoint;
  }

  isStep(): boolean {
    return this.type === TraceEventType.step;
  }

  getFormattedTimestamp(): string {
    return this.timestamp.toISOString();
  }

  getRelativeTimestamp(baseTime: Date): number {
    return this.timestamp.getTime() - baseTime.getTime();
  }

  getFormattedRelativeTimestamp(baseTime: Date): string {
    const diff = this.getRelativeTimestamp(baseTime);
    if (diff < 1000) return `${diff}ms`;
    if (diff < 60000) return `${(diff / 1000).toFixed(2)}s`;
    return `${(diff / 60000).toFixed(2)}m`;
  }

  getVariableName(): string | null {
    if (this.type === TraceEventType.variable_change && this.data) {
      return (this.data as any).variableName || null;
    }
    return null;
  }

  getVariableValue(): unknown {
    if (this.type === TraceEventType.variable_change && this.data) {
      return (this.data as any).value;
    }
    return null;
  }

  getFunctionName(): string | null {
    if (this.type === TraceEventType.function_call && this.data) {
      return (this.data as any).functionName || null;
    }
    return null;
  }

  getErrorDetails(): { message: string; stack?: string } | null {
    if (this.type === TraceEventType.error && this.data) {
      return {
        message: (this.data as any).message || this.message || 'Unknown error',
        stack: (this.data as any).stack
      };
    }
    return null;
  }

  getMemoryUsage(): { used: number; total: number; percentage: number } | null {
    if (this.type === TraceEventType.memory_usage && this.data) {
      const used = (this.data as any).used || 0;
      const total = (this.data as any).total || 0;
      return {
        used,
        total,
        percentage: total > 0 ? (used / total) * 100 : 0
      };
    }
    return null;
  }

  getCpuUsage(): { usage: number; cores: number } | null {
    if (this.type === TraceEventType.cpu_usage && this.data) {
      return {
        usage: (this.data as any).usage || 0,
        cores: (this.data as any).cores || 1
      };
    }
    return null;
  }

  toJSON() {
    return {
      id: this.id,
      runId: this.runId,
      type: this.type,
      timestamp: this.timestamp,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      message: this.message,
      data: this.data,
      metadata: this.metadata,
      createdAt: this.createdAt,
      formattedTimestamp: this.getFormattedTimestamp(),
      isLineExecution: this.isLineExecution(),
      isVariableChange: this.isVariableChange(),
      isFunctionCall: this.isFunctionCall(),
      isError: this.isError(),
      isOutput: this.isOutput(),
      isMemoryUsage: this.isMemoryUsage(),
      isCpuUsage: this.isCpuUsage(),
      isBreakpoint: this.isBreakpoint(),
      isStep: this.isStep(),
      variableName: this.getVariableName(),
      variableValue: this.getVariableValue(),
      functionName: this.getFunctionName(),
      errorDetails: this.getErrorDetails(),
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: this.getCpuUsage(),
    };
  }
}
