import { SessionStrategy } from "next-auth";

// Environment validation
export function validateEnvironmentVariables() {
  const required = [
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'DATABASE_URL'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Session configuration
export const sessionConfig = {
  strategy: "database" as SessionStrategy,
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
};

// Cookie configuration
export const cookieConfig = {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
  },
  callbackUrl: {
    name: `next-auth.callback-url`,
    options: {
      sameSite: "lax" as const,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
  },
  csrfToken: {
    name: `next-auth.csrf-token`,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
  },
};

// Pages configuration
export const pagesConfig = {
  signIn: '/login',
  signUp: '/register',
  signOut: '/logout',
  error: '/auth/error',
  verifyRequest: '/auth/verify-request',
  newUser: '/dashboard', // Redirect new users directly to dashboard instead of non-existent page
}; 