// Main auth configuration
export { authOptions } from './auth'

// Types
export * from './types'

// Configuration
export * from './config'

// Providers
export * from './providers'

// Callbacks
export * from './callbacks'

// Helpers
export * from './helpers'

// Utils functions (excluding isCurrentSession to avoid conflict)
export { 
  extractClientInfo,
  getCurrentSessionToken,
  getCurrentSessionTokenFromBrowser,
  parseDeviceInfo,
  capitalizeDeviceType,
  formatLocation,
  formatIpAddress,
  getBrowserInfo,
  isCurrentSession
} from './utils'

// Session manager functions (excluding isCurrentSession)
export {
  getCurrentSessionInfo,
  getAllActiveSessions,
  updateSessionInfo,
  revokeSession,
  revokeMultipleSessions,
  revokeAllSessions,
  isCurrentSessionById,
  updateSessionWithDeviceInfo
} from './session-manager'

// Comment out all console.log and debugging statements 