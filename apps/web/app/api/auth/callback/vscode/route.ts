import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(getAuthOptions());
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Return user data in a format suitable for VS Code extensions
    return NextResponse.json({
      success: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        isActive: session.user.isActive,
        image: session.user.image
      },
      // For VS Code extensions, we might need to generate a special token
      // or use the session token directly
      token: session.user.id // This is a simplified approach
    });
  } catch (error) {
    console.error('VS Code auth callback error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Use NextAuth's credentials provider logic
    const authOptions = getAuthOptions();
    const credentialsProvider = authOptions.providers.find(
      (provider: any) => provider.id === 'credentials'
    );

    if (!credentialsProvider) {
      return NextResponse.json(
        { error: 'Credentials provider not configured' },
        { status: 500 }
      );
    }

    // Call the authorize function from the credentials provider
    const user = await credentialsProvider.authorize?.(
      { email, password },
      { email, password }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return user data and a simple token for VS Code
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        image: user.image
      },
      token: user.id // Simplified token approach
    });
  } catch (error) {
    console.error('VS Code login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
