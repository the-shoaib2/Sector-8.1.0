import { redirect } from "next/navigation"
import { verifyEmail } from "@/lib/email-utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Metadata } from 'next'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  params: Promise<{ [key: string]: string }>
}

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Verify your email address',
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const token = resolvedParams.token as string
  const email = resolvedParams.email as string

  if (!token || !email) {
    redirect("/login")
  }

  let verified = false
  let error = ""

  try {
    verified = await verifyEmail(email, token)
  } catch (err) {
    console.error("Error verifying email:", err)
    error = "An error occurred while verifying your email."
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
