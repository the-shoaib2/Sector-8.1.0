import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";

// Import configurations and utilities
import { validateEnvironmentVariables, cookieConfig, sessionConfig, pagesConfig } from '@/lib/auth/config';
import { sessionCallback, signInCallback, eventsCallbacks } from '@/lib/auth/callbacks';
import { SecurityLogger } from '@/lib/auth/security-monitor';

// Import types
import '@/lib/auth/types';

const prisma = new PrismaClient();

// In-memory store for failed login attempts (in production, use Redis or database)
const failedLoginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>();

// Rate limiting configuration
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const RESET_ATTEMPT_WINDOW = 60 * 60 * 1000; // 1 hour

// Create auth options function that validates environment variables when called
export function getAuthOptions(): AuthOptions {
  // Validate environment variables only when this function is called
  validateEnvironmentVariables();
  
  return {
    adapter: PrismaAdapter(prisma),
    // debug: process.env.NODE_ENV === 'development',
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: "select_account"
          }
        }
      }),
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: "select_account"
          }
        }
      }),
      CredentialsProvider({
        name: 'credentials',
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter email and password');
          }

          const email = credentials.email.toLowerCase().trim();
          const password = credentials.password;

          // Check for rate limiting
          const now = Date.now();
          const userAttempts = failedLoginAttempts.get(email);
          
          if (userAttempts) {
            // Check if account is locked
            if (userAttempts.lockedUntil && now < userAttempts.lockedUntil) {
              const remainingTime = Math.ceil((userAttempts.lockedUntil - now) / 1000 / 60);
              
              // Log security event for locked account
              SecurityLogger.loginLocked(email, {
                reason: 'rate_limit_exceeded',
                attempts: userAttempts.count,
                lockedUntil: userAttempts.lockedUntil
              });
              
              throw new Error(`Account temporarily locked. Please try again in ${remainingTime} minutes.`);
            }
            
            // Reset attempts if outside the reset window
            if (now - userAttempts.lastAttempt > RESET_ATTEMPT_WINDOW) {
              failedLoginAttempts.delete(email);
            }
          }

          try {
            const user = await prisma.user.findUnique({
              where: { email },
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                isActive: true,
                password: true,
                emailVerified: true
              }
            });

            if (!user) {
              await recordFailedAttempt(email);
              SecurityLogger.loginFailure(email, 'user_not_found');
              throw new Error("Invalid email or password");
            }

            if (!user.password) {
              await recordFailedAttempt(email);
              SecurityLogger.loginFailure(email, 'oauth_account_no_password');
              throw new Error("This account was created with OAuth. Please use the OAuth login option.");
            }

            if (!user.isActive) {
              SecurityLogger.loginFailure(email, 'account_deactivated');
              throw new Error("Account is deactivated. Please contact support.");
            }

            if (!user.emailVerified) {
              SecurityLogger.loginFailure(email, 'email_not_verified');
              throw new Error("Please verify your email address before signing in.");
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
              await recordFailedAttempt(email);
              SecurityLogger.loginFailure(email, 'invalid_password');
              throw new Error("Invalid email or password");
            }

            // Clear failed attempts on successful login
            failedLoginAttempts.delete(email);

            // Log successful login
            console.log(`Successful login: ${email} (${user.id})`);
            
            // Note: Security logging is handled in the signIn callback to avoid duplication
            
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.role,
              isActive: user.isActive
            };
          } catch (error) {
            // Re-throw validation errors
            if (error instanceof Error && error.message.includes('Invalid email or password')) {
              throw error;
            }
            
            // Log unexpected errors
            console.error('Login error:', error);
            throw new Error('An error occurred during authentication. Please try again.');
          }
        }
      })
    ],
    session: sessionConfig,
    cookies: cookieConfig,
    callbacks: {
      session: sessionCallback,
      signIn: signInCallback
    },
    pages: pagesConfig,
    secret: process.env.NEXTAUTH_SECRET,
    events: eventsCallbacks
  };
}

// Helper function to record failed login attempts
async function recordFailedAttempt(email: string) {
  const now = Date.now();
  const attempts = failedLoginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  
  attempts.count += 1;
  attempts.lastAttempt = now;
  
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    attempts.lockedUntil = now + LOCKOUT_DURATION;
    console.log(`Account locked for ${email} due to ${attempts.count} failed attempts`);
    
    // Log security event for account lockout
    SecurityLogger.loginLocked(email, {
      reason: 'max_attempts_exceeded',
      attempts: attempts.count,
      lockedUntil: attempts.lockedUntil
    });
  }
  
  failedLoginAttempts.set(email, attempts);
}

// Re-export everything for backward compatibility
export * from './types';
export * from './config';
export * from './utils';
export * from './session-manager';
export * from './callbacks';
export * from './helpers';
export * from './security-monitor'; 