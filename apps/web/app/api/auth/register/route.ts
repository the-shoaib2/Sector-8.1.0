import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword, validateRegistrationCredentials, isValidEmail } from '@/lib/auth/utils';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Enhanced input validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate input with enhanced validation
    const validationError = validateRegistrationCredentials({
      name,
      email,
      password,
      confirmPassword: password // We'll validate this separately
    });

    if (validationError) {
      return NextResponse.json(
        { message: validationError.message, field: validationError.field },
        { status: 400 }
      );
    }

    // Enhanced email validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address', field: 'email' },
        { status: 400 }
      );
    }

    // Enhanced name validation
    if (name.trim().length < 2) {
      return NextResponse.json(
        { message: 'Name must be at least 2 characters long', field: 'name' },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { message: 'Name must be less than 100 characters long', field: 'name' },
        { status: 400 }
      );
    }

    // Enhanced password validation
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long', field: 'password' },
        { status: 400 }
      );
    }

    // Check for common weak passwords
    const weakPasswords = ['password', '123456', 'qwerty', 'abc123', 'letmein', 'admin', 'welcome'];
    if (weakPasswords.includes(password.toLowerCase())) {
      return NextResponse.json(
        { message: 'Password is too weak. Please choose a stronger password.', field: 'password' },
        { status: 400 }
      );
    }

    // Check if user already exists with case-insensitive email
    const existingUser = await prisma.user.findFirst({
      where: { 
        email: { 
          equals: email.toLowerCase().trim(),
          mode: 'insensitive'
        }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists', field: 'email' },
        { status: 409 }
      );
    }

    // Enhanced password hashing with better salt rounds
    const hashedPassword = await hashPassword(password);

    // Create user with enhanced data validation
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'USER',
        emailVerified: new Date(), // Auto-verify for now, you can implement email verification later
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // Log successful user creation for security monitoring
    console.log(`New user registered: ${user.email} (${user.id})`);

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Enhanced error handling
    if (error instanceof Error) {
      // Handle Prisma-specific errors
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { message: 'User with this email already exists', field: 'email' },
          { status: 409 }
        );
      }
      
      if (error.message.includes('Invalid value')) {
        return NextResponse.json(
          { message: 'Invalid data provided', field: 'general' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
