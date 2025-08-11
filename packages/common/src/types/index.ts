import { z } from 'zod';

// ============================================================================
// User & Authentication Types
// ============================================================================

export const UserRoleSchema = z.enum(['student', 'teacher', 'admin', 'researcher']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const OAuthProviderSchema = z.enum(['github', 'google']);
export type OAuthProvider = z.infer<typeof OAuthProviderSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(50),
  displayName: z.string().min(1).max(100),
  avatarUrl: z.string().url().optional(),
  role: UserRoleSchema,
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLoginAt: z.date().optional(),
  preferences: z.record(z.unknown()).optional(),
});

export type User = z.infer<typeof UserSchema>;

export const AuthTokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.date(),
  tokenType: z.literal('Bearer'),
});

export type AuthToken = z.infer<typeof AuthTokenSchema>;

// ============================================================================
// Project & Workspace Types
// ============================================================================

export const ProjectVisibilitySchema = z.enum(['private', 'shared', 'public']);
export type ProjectVisibility = z.infer<typeof ProjectVisibilitySchema>;

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  ownerId: z.string().uuid(),
  visibility: ProjectVisibilitySchema,
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastRunAt: z.date().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const SourceFileSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string().min(1).max(100),
  path: z.string(),
  content: z.string(),
  language: z.string(),
  size: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SourceFile = z.infer<typeof SourceFileSchema>;

// ============================================================================
// Execution & Run Types
// ============================================================================

export const RunStatusSchema = z.enum([
  'pending',
  'running',
  'completed',
  'failed',
  'cancelled',
  'timeout'
]);
export type RunStatus = z.infer<typeof RunStatusSchema>;

export const RunSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  status: RunStatusSchema,
  language: z.string(),
  entryPoint: z.string(),
  arguments: z.array(z.string()).default([]),
  environment: z.record(z.string()).default({}),
  resourceLimits: z.object({
    memory: z.number().optional(), // MB
    cpu: z.number().optional(),    // CPU cores
    timeout: z.number().optional(), // seconds
  }).optional(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  duration: z.number().optional(), // milliseconds
  exitCode: z.number().optional(),
  error: z.string().optional(),
  output: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Run = z.infer<typeof RunSchema>;

export const TraceEventTypeSchema = z.enum([
  'line_execution',
  'variable_change',
  'function_call',
  'error',
  'output',
  'memory_usage',
  'cpu_usage',
  'breakpoint',
  'step',
]);

export type TraceEventType = z.infer<typeof TraceEventTypeSchema>;

export const TraceEventSchema = z.object({
  id: z.string().uuid(),
  runId: z.string().uuid(),
  type: TraceEventTypeSchema,
  timestamp: z.date(),
  lineNumber: z.number().optional(),
  columnNumber: z.number().optional(),
  message: z.string().optional(),
  data: z.record(z.unknown()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type TraceEvent = z.infer<typeof TraceEventSchema>;

// ============================================================================
// AI & Prompt Types
// ============================================================================

export const PromptStatusSchema = z.enum([
  'pending',
  'streaming',
  'completed',
  'failed',
  'cancelled'
]);
export type PromptStatus = z.infer<typeof PromptStatusSchema>;

export const PromptSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  prompt: z.string().min(1),
  context: z.object({
    code: z.string().optional(),
    files: z.array(z.string()).optional(),
    documents: z.array(z.string()).optional(),
    previousConversation: z.array(z.string()).optional(),
  }).optional(),
  status: PromptStatusSchema,
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
  response: z.string().optional(),
  error: z.string().optional(),
  tokensUsed: z.number().optional(),
  cost: z.number().optional(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  duration: z.number().optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Prompt = z.infer<typeof PromptSchema>;

export const StreamingTokenSchema = z.object({
  id: z.string().uuid(),
  promptId: z.string().uuid(),
  token: z.string(),
  index: z.number(),
  timestamp: z.date(),
  isComplete: z.boolean(),
  metadata: z.record(z.unknown()).optional(),
});

export type StreamingToken = z.infer<typeof StreamingTokenSchema>;

// ============================================================================
// Context & Document Types
// ============================================================================

export const DocumentTypeSchema = z.enum(['pdf', 'book', 'markdown', 'text', 'code']);
export type DocumentType = z.infer<typeof DocumentTypeSchema>;

export const DocumentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1).max(200),
  type: DocumentTypeSchema,
  size: z.number(),
  path: z.string(),
  mimeType: z.string(),
  metadata: z.object({
    author: z.string().optional(),
    title: z.string().optional(),
    pages: z.number().optional(),
    language: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }).optional(),
  isProcessed: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Document = z.infer<typeof DocumentSchema>;

export const DocumentChunkSchema = z.object({
  id: z.string().uuid(),
  documentId: z.string().uuid(),
  content: z.string(),
  embedding: z.array(z.number()).optional(),
  metadata: z.object({
    page: z.number().optional(),
    section: z.string().optional(),
    startIndex: z.number().optional(),
    endIndex: z.number().optional(),
    tokens: z.number().optional(),
  }).optional(),
  createdAt: z.date(),
});

export type DocumentChunk = z.infer<typeof DocumentChunkSchema>;

export const ContextSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  documents: z.array(z.string().uuid()).default([]),
  isActive: z.boolean().default(true),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ContextSession = z.infer<typeof ContextSessionSchema>;

// ============================================================================
// Visualization & Export Types
// ============================================================================

export const VisualizationTypeSchema = z.enum([
  'execution_tree',
  'data_structure',
  'ast_walk',
  'neural_network',
  'compiler_phases',
  'memory_layout',
  'call_graph',
  'dependency_graph',
]);

export type VisualizationType = z.infer<typeof VisualizationTypeSchema>;

export const VisualizationSchema = z.object({
  id: z.string().uuid(),
  runId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  type: VisualizationTypeSchema,
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  data: z.record(z.unknown()),
  config: z.record(z.unknown()).optional(),
  thumbnail: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Visualization = z.infer<typeof VisualizationSchema>;

export const ExportFormatSchema = z.enum(['pdf', 'png', 'jpeg', 'svg', 'docx', 'pptx']);
export type ExportFormat = z.infer<typeof ExportFormatSchema>;

export const ExportJobSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  visualizationId: z.string().uuid().optional(),
  format: ExportFormatSchema,
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  outputPath: z.string().optional(),
  error: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ExportJob = z.infer<typeof ExportJobSchema>;

// ============================================================================
// Language & Adapter Types
// ============================================================================

export const LanguageSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  extensions: z.array(z.string()),
  mimeTypes: z.array(z.string()),
  syntaxHighlighting: z.boolean().default(true),
  executionSupported: z.boolean().default(true),
  visualizationSupported: z.boolean().default(true),
  metadata: z.record(z.unknown()).optional(),
});

export type Language = z.infer<typeof LanguageSchema>;

export const AdapterSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  type: z.enum(['language', 'visualization', 'export', 'ai']),
  description: z.string(),
  author: z.string(),
  repository: z.string().url().optional(),
  isEnabled: z.boolean().default(true),
  config: z.record(z.unknown()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type Adapter = z.infer<typeof AdapterSchema>;

// ============================================================================
// API Response Types
// ============================================================================

export const ApiResponseSchema = <T>(dataSchema: z.ZodType<T>) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    timestamp: z.date(),
    requestId: z.string().uuid(),
  });

export type ApiResponse<T> = z.infer<ReturnType<typeof ApiResponseSchema<T>>>;

export const PaginatedResponseSchema = <T>(dataSchema: z.ZodType<T>) =>
  z.object({
    success: z.boolean(),
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }),
    timestamp: z.date(),
    requestId: z.string().uuid(),
  });

export type PaginatedResponse<T> = z.infer<ReturnType<typeof PaginatedResponseSchema<T>>>;

// ============================================================================
// WebSocket & Real-time Types
// ============================================================================

export const WebSocketMessageTypeSchema = z.enum([
  'run_event',
  'prompt_token',
  'visualization_update',
  'export_progress',
  'system_notification',
  'error',
]);

export type WebSocketMessageType = z.infer<typeof WebSocketMessageTypeSchema>;

export const WebSocketMessageSchema = z.object({
  type: WebSocketMessageTypeSchema,
  id: z.string().uuid(),
  timestamp: z.date(),
  data: z.record(z.unknown()),
  metadata: z.record(z.unknown()).optional(),
});

export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;

// ============================================================================
// Utility Types
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type ExcludeFields<T, K extends keyof T> = Omit<T, K>;

// ============================================================================
// Constants
// ============================================================================

export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'csharp',
  'go',
  'rust',
  'swift',
  'kotlin',
  'scala',
  'php',
  'ruby',
  'haskell',
  'ocaml',
  'fsharp',
  'clojure',
  'elixir',
  'erlang',
  'lisp',
] as const;

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_PROJECT_SIZE = 1024 * 1024 * 1024; // 1GB
export const MAX_CONCURRENT_RUNS = 5;
export const MAX_PROMPT_LENGTH = 10000;
export const MAX_VISUALIZATION_SIZE = 50 * 1024 * 1024; // 50MB

export const DEFAULT_RESOURCE_LIMITS = {
  memory: 512, // MB
  cpu: 1,      // CPU cores
  timeout: 300, // seconds
} as const;

export const API_RATE_LIMITS = {
  auth: { window: 15 * 60 * 1000, max: 5 },      // 5 attempts per 15 minutes
  prompts: { window: 60 * 1000, max: 10 },        // 10 prompts per minute
  runs: { window: 60 * 1000, max: 3 },            // 3 runs per minute
  uploads: { window: 60 * 1000, max: 5 },         // 5 uploads per minute
  exports: { window: 60 * 1000, max: 2 },         // 2 exports per minute
} as const;

