// Security monitoring utility for authentication events
export interface SecurityEvent {
  type: 'login_success' | 'login_failure' | 'login_locked' | 'registration' | 'logout' | 'session_expired';
  userId?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: {
    deviceType: string;
    deviceModel: string;
    browser: string;
    os: string;
  };
  timestamp: Date;
  metadata?: Record<string, any>;
}

// In-memory security event store (in production, use a proper logging service)
const securityEvents: SecurityEvent[] = [];
const MAX_EVENTS = 1000; // Keep last 1000 events

export class SecurityMonitor {
  // Log a security event with duplicate prevention
  static logEvent(event: Omit<SecurityEvent, 'timestamp'>) {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    };
    
    // Prevent duplicate events within a short time window (1 second)
    const recentEvents = securityEvents.filter(e => 
      e.type === event.type && 
      e.email === event.email && 
      e.userId === event.userId &&
      Date.now() - e.timestamp.getTime() < 1000
    );
    
    if (recentEvents.length > 0) {
      console.log(`[SECURITY] Duplicate event prevented: ${event.type} for ${event.email}`);
      return;
    }
    
    securityEvents.push(securityEvent);
    
    // Keep only the last MAX_EVENTS events
    if (securityEvents.length > MAX_EVENTS) {
      securityEvents.shift();
    }
    
    // Log to console for development (in production, send to logging service)
    console.log(`[SECURITY] ${event.type}:`, {
      email: event.email,
      userId: event.userId,
      timestamp: securityEvent.timestamp.toISOString(),
      metadata: event.metadata
    });
  }

  // Get recent security events
  static getRecentEvents(limit: number = 100): SecurityEvent[] {
    return securityEvents.slice(-limit).reverse();
  }

  // Get events by type
  static getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return securityEvents.filter(event => event.type === type);
  }

  // Get events for a specific user
  static getUserEvents(email: string): SecurityEvent[] {
    return securityEvents.filter(event => event.email === email);
  }

  // Get failed login attempts count for a user
  static getFailedLoginCount(email: string, timeWindow: number = 60 * 60 * 1000): number {
    const cutoff = new Date(Date.now() - timeWindow);
    return securityEvents.filter(event => 
      event.email === email && 
      event.type === 'login_failure' && 
      event.timestamp > cutoff
    ).length;
  }

  // Check if user account should be monitored
  static shouldMonitorUser(email: string): boolean {
    const recentFailures = this.getFailedLoginCount(email, 15 * 60 * 1000); // Last 15 minutes
    return recentFailures >= 3; // Monitor after 3+ failures
  }

  // Get security summary
  static getSecuritySummary(): {
    totalEvents: number;
    recentFailures: number;
    recentSuccesses: number;
    monitoredUsers: string[];
  } {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const recentEvents = securityEvents.filter(event => event.timestamp > oneHourAgo);
    const recentFailures = recentEvents.filter(event => event.type === 'login_failure').length;
    const recentSuccesses = recentEvents.filter(event => event.type === 'login_success').length;
    
    // Get unique emails with recent failures
    const emailsWithFailures = new Set(
      recentEvents
        .filter(event => event.type === 'login_failure')
        .map(event => event.email)
        .filter(Boolean)
    );
    
    const monitoredUsers = Array.from(emailsWithFailures).filter(email => 
      this.shouldMonitorUser(email!)
    );
    
    return {
      totalEvents: securityEvents.length,
      recentFailures,
      recentSuccesses,
      monitoredUsers
    };
  }

  // Clear old events (cleanup function)
  static cleanupOldEvents(maxAge: number = 24 * 60 * 60 * 1000): number {
    const cutoff = new Date(Date.now() - maxAge);
    const initialCount = securityEvents.length;
    
    // Remove events older than maxAge
    const filteredEvents = securityEvents.filter(event => event.timestamp > cutoff);
    securityEvents.length = 0;
    securityEvents.push(...filteredEvents);
    
    return initialCount - securityEvents.length;
  }
}

// Convenience functions for common security events
export const SecurityLogger = {
  loginSuccess: (email: string, userId: string, metadata?: Record<string, any>) => {
    SecurityMonitor.logEvent({
      type: 'login_success',
      email,
      userId,
      metadata
    });
  },

  loginFailure: (email: string, reason: string, metadata?: Record<string, any>) => {
    SecurityMonitor.logEvent({
      type: 'login_failure',
      email,
      metadata: { reason, ...metadata }
    });
  },

  loginLocked: (email: string, metadata?: Record<string, any>) => {
    SecurityMonitor.logEvent({
      type: 'login_locked',
      email,
      metadata
    });
  },

  registration: (email: string, userId: string, metadata?: Record<string, any>) => {
    SecurityMonitor.logEvent({
      type: 'registration',
      email,
      userId,
      metadata
    });
  },

  logout: (email: string, userId: string, metadata?: Record<string, any>) => {
    SecurityMonitor.logEvent({
      type: 'logout',
      email,
      userId,
      metadata
    });
  },

  sessionExpired: (email: string, userId: string, metadata?: Record<string, any>) => {
    SecurityMonitor.logEvent({
      type: 'session_expired',
      email,
      userId,
      metadata
    });
  }
};
