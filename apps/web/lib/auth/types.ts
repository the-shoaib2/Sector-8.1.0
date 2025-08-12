import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isActive: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    isActive: boolean;
    resetToken?: string;
    resetTokenExpiry?: Date;
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    isActive: boolean;
  }
}

// Custom types for authentication
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
  token?: string;
}

export interface AuthError {
  field: string;
  message: string;
}

// Location data type for session tracking
export interface LocationData {
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  ipAddress?: string;
} 