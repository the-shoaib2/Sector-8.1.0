import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { User } from "@prisma/client";

// Session callback
export const sessionCallback = async ({ session, token }: { session: Session; token: JWT }) => {
  if (token) {
    session.user.id = token.sub!;
    session.user.email = token.email!;
    session.user.name = token.name!;
    session.user.image = token.picture as string | null;
    session.user.role = token.role as string;
  }
  
  return session;
};

// Sign in callback
export const signInCallback = async ({ user, account, profile }: any) => {
  // Allow all sign-ins for now
  // You can add additional logic here for user validation
  return true;
};

// Events callbacks
export const eventsCallbacks = {
  async signIn({ user, account, profile, isNewUser }: any) {
    console.log(`User signed in: ${user.email}`);
  },
  
  async signOut({ session, token }: any) {
    console.log(`User signed out: ${token?.email}`);
  },
  
  async createUser({ user }: any) {
    console.log(`New user created: ${user.email}`);
  },
  
  async updateUser({ user }: any) {
    console.log(`User updated: ${user.email}`);
  },
  
  async linkAccount({ user, account, profile }: any) {
    console.log(`Account linked for user: ${user.email}`);
  },
  
  async session({ session, token }: any) {
    console.log(`Session updated for user: ${token?.email}`);
  },
}; 