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

// Import types
import '@/lib/auth/types';

const prisma = new PrismaClient();

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

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
              isActive: true,
              password: true
            }
          });

          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            isActive: user.isActive
          };
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

// Re-export everything for backward compatibility
export * from './types';
export * from './config';
export * from './utils';
export * from './session-manager';
export * from './callbacks';
export * from './helpers'; 