import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { Project } from './project';

// Define enums locally until common package is built
enum UserRole {
  student = 'student',
  teacher = 'teacher',
  admin = 'admin',
  researcher = 'researcher'
}

enum OAuthProvider {
  credientials = 'credentials',
  github = 'github',
  google = 'google'
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 100 })
  displayName!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatarUrl?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.student
  })
  role!: UserRole;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  preferences?: Record<string, unknown>;

  // OAuth related fields
  @Column({ type: 'varchar', length: 50, nullable: true })
  oauthProvider?: OAuthProvider;

  @Column({ type: 'varchar', length: 255, nullable: true })
  oauthId?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  refreshToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  refreshTokenExpiresAt?: Date;

  // Timestamps
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @OneToMany(() => Project, project => project.owner)
  projects!: Project[];

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  validateEmail() {
    if (this.email && !this.email.includes('@')) {
      throw new Error('Invalid email format');
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateUsername() {
    if (this.username && this.username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
  }

  // Methods
  toJSON() {
    const { refreshToken, refreshTokenExpiresAt, ...user } = this;
    return user;
  }

  isAdmin(): boolean {
    return this.role === UserRole.admin;
  }

  isTeacher(): boolean {
    return this.role === UserRole.teacher || this.role === UserRole.admin;
  }

  canAccessProject(project: Project): boolean {
    if (project.visibility === 'public') return true;
    if (project.ownerId === this.id) return true;
    if (this.isAdmin()) return true;
    return false;
  }
}

