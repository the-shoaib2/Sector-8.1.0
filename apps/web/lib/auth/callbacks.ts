import { Session } from "next-auth";
import { User } from "@prisma/client";

// Session callback - updated for database strategy
export const sessionCallback = async ({ session, user }: { session: Session; user: any }) => {
  if (user) {
    session.user.id = user.id;
    session.user.email = user.email;
    session.user.name = user.name;
    session.user.image = user.image;
    session.user.role = user.role;
    session.user.isActive = user.isActive;
  }
  
  return session;
};

// Sign in callback - updated for database strategy
export const signInCallback = async ({ user, account, profile }: any) => {
  // Ensure user data is properly set for database strategy
  if (user) {
    // The user object should already contain the necessary data from the authorize function
    // console.log('Sign in callback - User data:', {
    //   id: user.id,
    //   email: user.email,
    //   name: user.name,
    //   role: user.role
    // })
  }
  
  // Allow all sign-ins for now
  // You can add additional logic here for user validation
  return true;
};

// Events callbacks
export const eventsCallbacks = {
  async signIn({ user, account, profile, isNewUser }: any) {
    // console.log(`User signed in: ${user.email}`);
  },
  
  async signOut({ session, user }: any) {
    // console.log(`User signed out: ${user?.email || session?.user?.email}`);
  },
  
  async createUser({ user }: any) {
    // console.log(`New user created: ${user.email}`);
  },
  
  async updateUser({ user }: any) {
    // console.log(`User updated: ${user.email}`);
  },
  
  async linkAccount({ user, account, profile }: any) {
    // console.log(`Account linked for user: ${user.email}`);
  },
  
  async session({ session, user }: any) {
    // console.log(`Session updated for user: ${user?.email || session?.user?.email}`);
  },

  // Capture device information when session is created
  async createSession({ session, user }: any) {
    // console.log(`Session created for user: ${user?.email}`);
  },
}; 