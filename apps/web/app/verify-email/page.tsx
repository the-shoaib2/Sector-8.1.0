"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerifyEmailPage() {
  const [token, setToken] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [verified, setVerified] = useState<boolean | null>(null)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const tokenParam = urlParams.get('token')
    const emailParam = urlParams.get('email')

    console.log("VerifyEmailPage - URL params:", { token: tokenParam, email: emailParam })

    if (!tokenParam || !emailParam) {
      console.log("VerifyEmailPage - Missing params, redirecting to login")
      window.location.href = "/login"
      return
    }

    setToken(tokenParam)
    setEmail(emailParam)

    // Verify email
    const verifyEmail = async () => {
      try {
        console.log("VerifyEmailPage - Attempting to verify email")
        const response = await fetch(`/api/user/verify-email?token=${encodeURIComponent(tokenParam)}&email=${encodeURIComponent(emailParam)}`, {
          method: 'GET',
        })

        if (response.ok) {
          console.log("VerifyEmailPage - Email verified successfully")
          setVerified(true)
        } else {
          console.log("VerifyEmailPage - Email verification failed")
          setVerified(false)
          const errorData = await response.json()
          setError(errorData.message || "Verification failed")
        }
      } catch (err) {
        console.error("VerifyEmailPage - Error:", err)
        setVerified(false)
        setError("An error occurred while verifying your email.")
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [])

  // Prevent any alerts from appearing
  useEffect(() => {
    // Override alert function to prevent any alerts
    const originalAlert = window.alert
    window.alert = () => {
      console.log("Alert blocked on verify-email page")
    }

    // Override confirm function to prevent any confirm dialogs
    const originalConfirm = window.confirm
    window.confirm = () => {
      console.log("Confirm dialog blocked on verify-email page")
      return false
    }

    return () => {
      window.alert = originalAlert
      window.confirm = originalConfirm
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Verifying Email...</h2>
            <p className="mt-2 text-sm text-gray-500">Please wait while we verify your email address.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Email Verification</h2>
        </div>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {verified ? (
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Email Verified Successfully</h3>
              <p className="mt-2 text-sm text-gray-500">
                Your email has been verified. You can now use all features of MealSphere.
              </p>
              <div className="mt-5">
                <Button asChild className="w-full">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Verification Failed</h3>
              <p className="mt-2 text-sm text-gray-500">
                {error || "The verification link is invalid or has expired."}
              </p>
              <div className="mt-5">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Return to Login</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
