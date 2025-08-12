// Main auth configuration
export { getAuthOptions } from './auth'

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

// Utils functions
export { 
  parseDeviceInfo,
  capitalizeDeviceType,
  formatLocation,
  formatIpAddress,
  getBrowserInfo,
  isCurrentSession,
  getCurrentSessionTokenFromBrowser
} from './utils'

// Session manager functions
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