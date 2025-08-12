"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string>('')
  const [errorDescription, setErrorDescription] = useState<string>('')

  useEffect(() => {
    if (!searchParams) return
    
    const errorParam = searchParams.get('error')
    setError(errorParam || 'Unknown error')

    // Provide user-friendly error descriptions
    switch (errorParam) {
      case 'OAuthCallback':
        setErrorDescription('There was an issue with the authentication process. This usually happens when the authentication state is lost or expired.')
        break
      case 'Configuration':
        setErrorDescription('There is a problem with the authentication configuration. Please contact support.')
        break
      case 'AccessDenied':
        setErrorDescription('Access was denied. You may have cancelled the authentication process.')
        break
      case 'Verification':
        setErrorDescription('The verification token has expired or is invalid. Please try signing in again.')
        break
      default:
        setErrorDescription('An unexpected error occurred during authentication. Please try again.')
    }
  }, [searchParams])

  const handleRetry = () => {
    // Clear any existing auth state and redirect to login
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Authentication Error
            </CardTitle>
            <CardDescription>
              We encountered an issue during the sign-in process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error: {error}</AlertTitle>
              <AlertDescription>
                {errorDescription}
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <Button 
                onClick={handleRetry} 
                className="w-full"
                variant="default"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              
              <Link href="/login">
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  Back to Login
                </Button>
              </Link>
            </div>

            <div className="text-sm text-gray-600 text-center">
              <p>If this problem persists, please:</p>
              <ul className="mt-2 space-y-1">
                <li>• Clear your browser cookies and cache</li>
                <li>• Try using a different browser</li>
                <li>• Contact support if the issue continues</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 