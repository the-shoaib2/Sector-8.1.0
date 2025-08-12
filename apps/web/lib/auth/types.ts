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

// Extend the database session type for database strategy
declare module "next-auth/adapters" {
  interface Session {
    id: string;
    sessionToken: string;
    userId: string;
    expires: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
    deviceType?: string | null;
    deviceModel?: string | null;
    city?: string | null;
    country?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdAt: Date;
    updatedAt: Date;
  }
}

// Extend the JWT type (only needed if using JWT strategy)
// declare module "next-auth/jwt" {
//   interface JWT {
//     role: string;
//     isActive: boolean;
//   }
// }

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