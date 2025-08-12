import { Session } from "next-auth";
import { User } from "@prisma/client";
import { SecurityLogger } from "./security-monitor";

// Session callback - updated for database strategy with enhanced security
export const sessionCallback = async ({ session, user }: { session: Session; user: any }) => {
  if (user) {
    // Ensure all required user data is present
    session.user.id = user.id;
    session.user.email = user.email;
    session.user.name = user.name;
    session.user.image = user.image;
    session.user.role = user.role;
    session.user.isActive = user.isActive;
    
    // Add additional security checks
    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }
    
    // Log session creation for security monitoring
    console.log(`Session created for user: ${user.email} (${user.id})`);
  }
  
  return session;
};

// Sign in callback - updated for database strategy with enhanced validation
export const signInCallback = async ({ user, account, profile }: any) => {
  // Ensure user data is properly set for database strategy
  if (user) {
    // Validate user data integrity
    if (!user.id || !user.email || !user.isActive) {
      console.error('Invalid user data in signIn callback:', user);
      return false;
    }
    
    // Log successful sign-in for security monitoring
    console.log(`User signed in successfully: ${user.email} (${user.id}) via ${account?.provider || 'credentials'}`);
    
    // Log security event (single source of truth for login success)
    SecurityLogger.loginSuccess(user.email, user.id, {
      provider: account?.provider || 'credentials',
      accountId: account?.id,
      timestamp: new Date().toISOString()
    });
    
    // Additional security checks for OAuth providers
    if (account?.provider === 'google' || account?.provider === 'github') {
      // Ensure OAuth users have verified emails
      if (!user.emailVerified) {
        console.log(`OAuth user email not verified: ${user.email}`);
        // You can choose to block or allow these users
      }
    }
  }
  
  // Allow all valid sign-ins
  return true;
};

// Events callbacks with enhanced security logging
export const eventsCallbacks = {
  async signIn({ user, account, profile, isNewUser }: any) {
    console.log(`User signed in: ${user.email} via ${account?.provider || 'credentials'}`);
    
    // Log new user creation (only for new users, not every sign-in)
    if (isNewUser) {
      console.log(`New user created via ${account?.provider || 'credentials'}: ${user.email}`);
      SecurityLogger.registration(user.email, user.id, {
        provider: account?.provider || 'credentials',
        accountId: account?.id
      });
    }
    // Note: login_success is already logged in signIn callback to avoid duplication
  },
  
  async signOut({ session, user }: any) {
    const email = user?.email || session?.user?.email;
    const userId = user?.id || session?.user?.id;
    
    console.log(`User signed out: ${email}`);
    
    // Log security event
    if (email && userId) {
      SecurityLogger.logout(email, userId);
    }
  },
  
  async createUser({ user }: any) {
    console.log(`New user created: ${user.email}`);
    // Note: registration is already logged in signIn callback for new users
  },
  
  async updateUser({ user }: any) {
    console.log(`User updated: ${user.email}`);
  },
  
  async linkAccount({ user, account, profile }: any) {
    console.log(`Account linked for user: ${user.email}`);
  },
  
  async session({ session, user }: any) {
    // Log session updates for security monitoring
    if (session?.user?.email) {
      console.log(`Session updated for user: ${session.user.email}`);
    }
  },

  // Capture device information when session is created
  async createSession({ session, user }: any) {
    console.log(`Session created for user: ${user?.email}`);
    
    // You can add device tracking here if needed
    // This would be useful for security monitoring
  },
}; 