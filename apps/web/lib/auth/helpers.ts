import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { UAParser } from 'ua-parser-js';
import { PrismaClient } from "@prisma/client";
import { authOptions } from '@/lib/auth/auth';
import { extractClientInfo, capitalizeDeviceType } from '@/lib/auth/utils';

const prisma = new PrismaClient();

// Helper function to get session with device info (for API routes)
export const getServerAuthSessionForApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    const userAgent = req.headers['user-agent'] || '';
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    const browser = parser.getBrowser();
    const os = parser.getOS();

    // Update session with device info
    (session as any).userAgent = userAgent || '';
    (session as any).ipAddress = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req.headers['x-real-ip']?.toString() ||
      (req.socket as any)?.remoteAddress || '';
    (session as any).deviceType = capitalizeDeviceType(device.type || 'desktop');
    (session as any).deviceModel = `${device.vendor || ''} ${device.model || ''}`.trim() || '';
    (session as any).browser = `${browser.name || ''} ${browser.version || ''}`.trim() || '';
    (session as any).os = `${os.name || ''} ${os.version || ''}`.trim() || '';

    // Update the session in the database
    try {
      await prisma.session.updateMany({
        where: {
          sessionToken: (session as any).sessionToken,
          userId: session.user.id
        },
        data: {
          userAgent: (session as any).userAgent || '',
          ipAddress: (session as any).ipAddress || '',
          deviceType: (session as any).deviceType || 'Desktop',
          deviceModel: (session as any).deviceModel || '',
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error updating session info:', error);
    }
  }

  return session;
};

// For Server Components
export const getServerAuthSession = async () => {
  return await getServerSession(authOptions);
};

// For API routes
export const getApiAuthSession = async (req: NextApiRequest, res: NextApiResponse) => {
  return getServerAuthSessionForApi(req, res);
};

// Helper function to format device information
export function formatDeviceInfo(deviceType: string, deviceModel: string): string {
  const capitalizedType = capitalizeDeviceType(deviceType);
  if (deviceModel) {
    return `${capitalizedType} - ${deviceModel}`;
  }
  return capitalizedType;
}

// Helper function to validate session data
export function validateSessionData(session: any): boolean {
  return !!(session && session.user && session.user.id);
}

// Helper function to format user display name
export function formatUserDisplayName(user: any): string {
  if (user.name) {
    return user.name;
  }
  if (user.email) {
    return user.email.split('@')[0];
  }
  return 'User';
} 