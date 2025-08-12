import { Suspense } from "react"
import { getServerSession } from "next-auth/next";
import { getAuthOptions } from "@/lib/auth/auth"
import { redirect } from "next/navigation";
import { SettingsTabs } from "@/components/profile/profile-tabs";
import { prisma } from "@/lib/prisma"
import { Skeleton } from "@/components/ui/skeleton"

export default async function ProfilePage() {
  const session = await getServerSession(getAuthOptions())

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="max-w-3xl w-full mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account information, appearance preferences, and security options.
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-64 w-full mb-4" />}>
        <SettingsTabs user={user} />
      </Suspense>
    </div>
  )
}
