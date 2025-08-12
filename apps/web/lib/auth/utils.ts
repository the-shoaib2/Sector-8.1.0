import bcrypt from "bcryptjs";
import { AuthUser, LoginCredentials, RegisterCredentials, AuthResponse, AuthError } from "./types";

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function validatePassword(password: string): AuthError | null {
  if (password.length < 8) {
    return {
      field: "password",
      message: "Password must be at least 8 characters long"
    };
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return {
      field: "password",
      message: "Password must contain at least one lowercase letter"
    };
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      field: "password",
      message: "Password must contain at least one uppercase letter"
    };
  }

  if (!/(?=.*\d)/.test(password)) {
    return {
      field: "password",
      message: "Password must contain at least one number"
    };
  }

  return null;
}

// Validate login credentials
export function validateLoginCredentials(credentials: LoginCredentials): AuthError | null {
  if (!credentials.email || !credentials.email.trim()) {
    return {
      field: "email",
      message: "Email is required"
    };
  }

  if (!isValidEmail(credentials.email)) {
    return {
      field: "email",
      message: "Please enter a valid email address"
    };
  }

  if (!credentials.password || !credentials.password.trim()) {
    return {
      field: "password",
      message: "Password is required"
    };
  }

  return null;
}

// Validate registration credentials
export function validateRegistrationCredentials(credentials: RegisterCredentials): AuthError | null {
  if (!credentials.name || !credentials.name.trim()) {
    return {
      field: "name",
      message: "Name is required"
    };
  }

  if (credentials.name.trim().length < 2) {
    return {
      field: "name",
      message: "Name must be at least 2 characters long"
    };
  }

  if (!credentials.email || !credentials.email.trim()) {
    return {
      field: "email",
      message: "Email is required"
    };
  }

  if (!isValidEmail(credentials.email)) {
    return {
      field: "email",
      message: "Please enter a valid email address"
    };
  }

  if (!credentials.password || !credentials.password.trim()) {
    return {
      field: "password",
      message: "Password is required"
    };
  }

  const passwordError = validatePassword(credentials.password);
  if (passwordError) {
    return passwordError;
  }

  if (credentials.password !== credentials.confirmPassword) {
    return {
      field: "confirmPassword",
      message: "Passwords do not match"
    };
  }

  return null;
}

// Sanitize user data for response
export function sanitizeUser(user: any): AuthUser {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser as AuthUser;
}

// Generate random token
export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Format validation errors
export function formatValidationErrors(errors: AuthError[]): Record<string, string> {
  const formatted: Record<string, string> = {};
  errors.forEach(error => {
    formatted[error.field] = error.message;
  });
  return formatted;
}

// Device info parsing functions
export function parseDeviceInfo(userAgent: string) {
  if (!userAgent) {
    return { deviceType: 'Unknown', deviceModel: '' };
  }

  const ua = userAgent.toLowerCase();
  
  // Mobile detection
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) {
    if (ua.includes('iphone')) {
      return { deviceType: 'Mobile', deviceModel: 'iPhone' };
    } else if (ua.includes('ipad')) {
      return { deviceType: 'Tablet', deviceModel: 'iPad' };
    } else if (ua.includes('android')) {
      return { deviceType: 'Mobile', deviceModel: 'Android' };
    } else {
      return { deviceType: 'Mobile', deviceModel: 'Mobile Device' };
    }
  }
  
  // Desktop detection
  if (ua.includes('windows')) {
    return { deviceType: 'Desktop', deviceModel: 'Windows PC' };
  } else if (ua.includes('macintosh') || ua.includes('mac os')) {
    return { deviceType: 'Desktop', deviceModel: 'Mac' };
  } else if (ua.includes('linux')) {
    return { deviceType: 'Desktop', deviceModel: 'Linux PC' };
  }
  
  return { deviceType: 'Desktop', deviceModel: 'Desktop' };
}

// Capitalize device type
export function capitalizeDeviceType(deviceType: string): string {
  if (!deviceType) return 'Unknown';
  return deviceType.charAt(0).toUpperCase() + deviceType.slice(1).toLowerCase();
} 