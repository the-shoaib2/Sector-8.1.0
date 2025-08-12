import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient, User as PrismaUser } from "@prisma/client";

const prisma = new PrismaClient();

// Create Google provider with explicit environment variable access
export const googleProvider = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  httpOptions: {
    timeout: 10000 // Increase timeout to 10 seconds
  },
  authorization: {
    params: {
      prompt: "consent",
      access_type: "offline",
      response_type: "code"
    }
  }
});

// Credentials provider for email/password authentication
export const credentialsProvider = CredentialsProvider({
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
        password: true
      }
    }) as (PrismaUser & { password: string | null }) | null;

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
      role: user.role
    };
  }
});

export const providers = [googleProvider, credentialsProvider]; 