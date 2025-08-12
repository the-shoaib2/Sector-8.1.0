import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';

// Initialize Resend only if API key is available
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Helper function to generate reset URL
function getResetUrl(token: string): string {
  const baseUrl = process.env.NEXTAUTH_URL;
  return `${baseUrl}/reset-password?token=${token}`;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if the user doesn't exist for security reasons
    if (!user) {
      return NextResponse.json(
        { message: 'If an account with that email exists, you will receive a password reset link.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save the reset token to the database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Only try to send email if Resend is properly configured
    if (resend) {
      try {
        const resetUrl = getResetUrl(resetToken);
        
        await resend.emails.send({
          from: 'B.A.B.Y. <noreply@baby.vercel.app>',
          to: email,
          subject: 'Password Reset Request',
          html: `
            <div>
              <h2>Reset Your Password</h2>
              <p>You requested a password reset. Click the link below to set a new password:</p>
              <a href="${resetUrl}">Reset Password</a>
              <p>If you didn't request this, please ignore this email.</p>
              <p>This link will expire in 1 hour.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send reset email:', emailError);
        // Continue execution even if email fails
      }
    } else {
      console.warn('Resend API key not configured. Email sending is disabled.');
    }

    return NextResponse.json(
      { 
        message: 'If an account with that email exists, you will receive a password reset link.',
        // In development, include the reset link in the response for testing
        ...(process.env.NODE_ENV === 'development' && { 
          resetLink: getResetUrl(resetToken) 
        })
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}