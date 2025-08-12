"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Globe, 
  MapPin, 
  Clock, 
  Shield, 
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  capitalizeDeviceType, 
  formatLocation, 
  formatIpAddress, 
  getBrowserInfo,
  getCurrentSessionTokenFromBrowser
} from "@/lib/auth/utils"

interface Session {
  id: string
  sessionToken: string
  userId: string
  expires: string
  ipAddress: string | null
  userAgent: string | null
  deviceType: string | null
  deviceModel: string | null
  city: string | null
  country: string | null
  latitude: number | null
  longitude: number | null
  createdAt: string
  updatedAt: string
}

interface SessionsFormProps {
  user: any
}

export function SessionsForm({ user }: SessionsFormProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSessions, setSelectedSessions] = useState<string[]>([])
  const [revoking, setRevoking] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  // Fetch sessions on component mount and when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchSessions()
      // Also trigger a session update to capture current device info
      updateCurrentSessionInfo()
    }
  }, [session])

  // Function to update current session with device info
  const updateCurrentSessionInfo = async () => {
    try {
      // This will trigger the sessions API which will update the current session
      await fetch('/api/auth/sessions', { method: 'GET' })
    } catch (error) {
      // console.error('Error updating session info:', error)
    }
  }

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
        
        // Find current session by matching session token
        const currentSession = data.find((s: Session) => 
          s.sessionToken === getCurrentSessionTokenFromBrowser()
        )
        if (currentSession) {
          setCurrentSessionId(currentSession.id)
        }
      } else {
        throw new Error('Failed to fetch sessions')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sessions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSessionSelection = (sessionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSessions(prev => [...prev, sessionId])
    } else {
      setSelectedSessions(prev => prev.filter(id => id !== sessionId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSessions(sessions.map(s => s.id))
    } else {
      setSelectedSessions([])
    }
  }

  const revokeSelectedSessions = async () => {
    if (selectedSessions.length === 0) return

    try {
      setRevoking(true)
      const response = await fetch('/api/auth/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedSessions })
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: result.message,
        })

        // Check if current session was revoked
        if (result.logoutRequired) {
          toast({
            title: "Session Revoked",
            description: "Your current session has been revoked. Please log in again.",
            variant: "destructive",
          })
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login'
          }, 2000)
        } else {
          // Refresh sessions list
          fetchSessions()
          setSelectedSessions([])
        }
      } else {
        throw new Error('Failed to revoke sessions')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke selected sessions",
        variant: "destructive",
      })
    } finally {
      setRevoking(false)
    }
  }

  const revokeAllSessions = async () => {
    try {
      setRevoking(true)
      const response = await fetch('/api/auth/sessions/revoke-all', {
        method: 'POST'
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: result.message,
        })

        // All sessions revoked, redirect to login
        toast({
          title: "All Sessions Revoked",
          description: "All your sessions have been revoked. Please log in again.",
          variant: "destructive",
        })
        
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        throw new Error('Failed to revoke all sessions')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke all sessions",
        variant: "destructive",
      })
    } finally {
      setRevoking(false)
    }
  }

  const getDeviceIcon = (deviceType: string | null) => {
    switch (deviceType?.toLowerCase()) {
      case 'desktop':
        return <Monitor className="h-4 w-4" />
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getStatusIcon = (sessionId: string) => {
    if (sessionId === currentSessionId) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return <Shield className="h-4 w-4 text-blue-500" />
  }

  const getStatusText = (sessionId: string) => {
    if (sessionId === currentSessionId) {
      return "Current Session"
    }
    return "Active"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    }
  }

  const getLocationDisplay = (session: Session) => {
    if (session.city && session.country) {
      return `${session.city}, ${session.country}`
    } else if (session.country) {
      return session.country
    } else if (session.ipAddress) {
      return formatIpAddress(session.ipAddress)
    }
    return "Unknown location"
  }

  const getBrowserDisplay = (userAgent: string | null) => {
    if (!userAgent) return "Unknown browser"
    const browserInfo = getBrowserInfo(userAgent)
    return browserInfo.name
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const totalSessions = sessions.length
  const otherSessions = totalSessions - (currentSessionId ? 1 : 0)

  return (
    <div className="space-y-6">
      {/* Session Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>
            Manage your active sessions across different devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
              <div className="text-sm text-blue-600">Total Active Sessions</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{currentSessionId ? 1 : 0}</div>
              <div className="text-sm text-green-600">Current Session</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{otherSessions}</div>
              <div className="text-sm text-orange-600">Other Sessions</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={revokeSelectedSessions}
              disabled={selectedSessions.length === 0 || revoking}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Revoke Selected ({selectedSessions.length})
            </Button>
            <Button
              onClick={revokeAllSessions}
              disabled={totalSessions === 0 || revoking}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Revoke All
            </Button>
            <Button
              onClick={() => {
                updateCurrentSessionInfo()
                fetchSessions()
              }}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <Clock className="h-4 w-4 mr-2" />
              Refresh Device Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      {totalSessions === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Sessions</h3>
              <p className="text-gray-500">You don't have any active sessions at the moment.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sessions</CardTitle>
                <CardDescription>
                  {totalSessions} active session{totalSessions !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedSessions.length === totalSessions}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm text-gray-600">
                  Select All
                </label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedSessions.includes(session.id)}
                        onCheckedChange={(checked) => 
                          handleSessionSelection(session.id, checked as boolean)
                        }
                      />
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(session.deviceType)}
                        <div>
                          <div className="font-medium">
                            {session.deviceType ? capitalizeDeviceType(session.deviceType) : 'Unknown Device'}
                            {session.deviceModel && ` - ${session.deviceModel}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getBrowserDisplay(session.userAgent)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(session.id)}
                      <Badge variant={session.id === currentSessionId ? "default" : "secondary"}>
                        {getStatusText(session.id)}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">IP Address:</span>
                        <span className="font-mono">{session.ipAddress || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Location:</span>
                        <span>{getLocationDisplay(session)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Last Active:</span>
                        <span>{formatDate(session.updatedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Created:</span>
                        <span>{formatDate(session.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {session.id === currentSessionId && (
                    <Alert className="mt-3">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        This is your current session. Revoking it will log you out immediately.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Session Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Current Session Info</h4>
              <p className="text-sm text-blue-700 mt-1">
                You are currently logged in as <strong>{session?.user?.email}</strong>
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Session ID: {session?.user?.id}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                <strong>Note:</strong> Sessions are now stored in the database. You may need to log out and log back in for the first session to appear.
              </p>
              <p className="text-sm text-blue-700 mt-1">
                <strong>Device Info:</strong> If device information shows as "Unknown", click the "Refresh Device Info" button above to update it.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-900">Security Notice</h4>
              <p className="text-sm text-orange-700 mt-1">
                Only revoke sessions from devices you don't recognize or no longer use. 
                Revoking your current session will log you out immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
