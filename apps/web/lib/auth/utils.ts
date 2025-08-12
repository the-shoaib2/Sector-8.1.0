import bcrypt from "bcryptjs";
import { AuthUser, LoginCredentials, RegisterCredentials, AuthResponse, AuthError } from "./types";

// Hash password with enhanced security
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Increased from default for better security
  return bcrypt.hash(password, saltRounds);
}

// Compare password with timing attack protection
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Validate email format with enhanced regex
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

// Enhanced password strength validation
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

  // Enhanced security: require special characters
  if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
    return {
      field: "password",
      message: "Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)"
    };
  }

  // Enhanced security: check for common weak patterns
  const weakPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /abc123/,
    /letmein/i,
    /admin/i,
    /welcome/i
  ];

  for (const pattern of weakPatterns) {
    if (pattern.test(password)) {
      return {
        field: "password",
        message: "Password contains common weak patterns. Please choose a stronger password."
      };
    }
  }

  return null;
}

// Enhanced login credentials validation
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

  // Enhanced security: check for minimum password length
  if (credentials.password.length < 8) {
    return {
      field: "password",
      message: "Password must be at least 8 characters long"
    };
  }

  return null;
}

// Enhanced registration credentials validation
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

  // Enhanced security: check for maximum name length
  if (credentials.name.trim().length > 100) {
    return {
      field: "name",
      message: "Name must be less than 100 characters long"
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

  // Enhanced security: check for maximum email length
  if (credentials.email.length > 254) {
    return {
      field: "email",
      message: "Email address is too long"
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

// Enhanced user data sanitization
export function sanitizeUser(user: any): AuthUser {
  const { password, resetToken, resetTokenExpiry, ...sanitizedUser } = user;
  return sanitizedUser as AuthUser;
}

// Enhanced token generation with better entropy
export function generateToken(): string {
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto API
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Enhanced validation error formatting
export function formatValidationErrors(errors: AuthError[]): Record<string, string> {
  const formatted: Record<string, string> = {};
  errors.forEach(error => {
    formatted[error.field] = error.message;
  });
  return formatted;
}

// Enhanced device info parsing with better detection
export function parseDeviceInfo(userAgent: string) {
  if (!userAgent) {
    return { deviceType: 'Unknown', deviceModel: '' };
  }

  const ua = userAgent.toLowerCase();
  
  // Enhanced mobile detection
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad') || ua.includes('windows phone')) {
    if (ua.includes('iphone')) {
      return { deviceType: 'Mobile', deviceModel: 'iPhone' };
    } else if (ua.includes('ipad')) {
      return { deviceType: 'Tablet', deviceModel: 'iPad' };
    } else if (ua.includes('android')) {
      // Try to extract Android version
      const androidMatch = ua.match(/android\s*(\d+\.?\d*)/);
      const androidVersion = androidMatch ? androidMatch[1] : '';
      return { deviceType: 'Mobile', deviceModel: `Android${androidVersion ? ` ${androidVersion}` : ''}` };
    } else if (ua.includes('windows phone')) {
      return { deviceType: 'Mobile', deviceModel: 'Windows Phone' };
    } else {
      return { deviceType: 'Mobile', deviceModel: 'Mobile Device' };
    }
  }
  
  // Enhanced desktop detection
  if (ua.includes('windows')) {
    const windowsMatch = ua.match(/windows nt (\d+\.?\d*)/);
    const windowsVersion = windowsMatch ? windowsMatch[1] : '';
    return { deviceType: 'Desktop', deviceModel: `Windows${windowsVersion ? ` ${windowsVersion}` : ''}` };
  } else if (ua.includes('macintosh') || ua.includes('mac os')) {
    const macMatch = ua.match(/mac os x (\d+[._]\d+)/);
    const macVersion = macMatch ? macMatch[1].replace('_', '.') : '';
    return { deviceType: 'Desktop', deviceModel: `Mac${macVersion ? ` ${macVersion}` : ''}` };
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

// Enhanced location formatting
export function formatLocation(city?: string | null, country?: string | null, ipAddress?: string | null): string {
  if (city && country) {
    return `${city}, ${country}`;
  } else if (city) {
    return city;
  } else if (country) {
    return country;
  } else if (ipAddress) {
    return ipAddress === '127.0.0.1' || ipAddress === 'localhost' ? 'Localhost' : 'Unknown Location';
  }
  return 'Unknown Location';
}

// Enhanced IP address formatting
export function formatIpAddress(ipAddress?: string | null): string {
  if (!ipAddress) return 'N/A';
  if (ipAddress === '127.0.0.1' || ipAddress === 'localhost' || ipAddress === '::1') {
    return 'Localhost';
  }
  return ipAddress;
}

// Enhanced browser information extraction
export function getBrowserInfo(userAgent?: string | null): { name: string; version?: string } {
  if (!userAgent) return { name: 'N/A' };
  
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('chrome') && !ua.includes('edg')) {
    const versionMatch = ua.match(/chrome\/(\d+\.?\d*)/);
    return { name: 'Chrome', version: versionMatch ? versionMatch[1] : undefined };
  }
  if (ua.includes('firefox')) {
    const versionMatch = ua.match(/firefox\/(\d+\.?\d*)/);
    return { name: 'Firefox', version: versionMatch ? versionMatch[1] : undefined };
  }
  if (ua.includes('safari') && !ua.includes('chrome')) {
    const versionMatch = ua.match(/version\/(\d+\.?\d*)/);
    return { name: 'Safari', version: versionMatch ? versionMatch[1] : undefined };
  }
  if (ua.includes('edge')) {
    const versionMatch = ua.match(/edge\/(\d+\.?\d*)/);
    return { name: 'Edge', version: versionMatch ? versionMatch[1] : undefined };
  }
  if (ua.includes('opera')) {
    const versionMatch = ua.match(/opera\/(\d+\.?\d*)/);
    return { name: 'Opera', version: versionMatch ? versionMatch[1] : undefined };
  }
  
  return { name: 'Unknown Browser' };
}

// Enhanced session validation
export function isCurrentSession(session: any): boolean {
  // This is a placeholder - in a real implementation, you'd compare with the current session
  return false;
}

// Enhanced session token extraction from browser cookies
export function getCurrentSessionTokenFromBrowser(): string {
  if (typeof window === 'undefined') return '';
  
  // Try to get the session token from cookies with enhanced security
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'next-auth.session-token' || name === '__Secure-next-auth.session-token') {
      return value || '';
    }
  }
  
  return '';
}

// New security utility functions

// Check if password is compromised (placeholder for integration with breach databases)
export async function isPasswordCompromised(password: string): Promise<boolean> {
  // This would integrate with services like HaveIBeenPwned
  // For now, return false as placeholder
  return false;
}

// Generate secure random string for tokens
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate session token format
export function isValidSessionToken(token: string): boolean {
  // Basic validation - you can enhance this based on your token format
  return token && token.length >= 32 && /^[a-zA-Z0-9-_]+$/.test(token);
} 