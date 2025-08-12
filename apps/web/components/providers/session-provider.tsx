"use client"

import type React from "react"
import { Session } from "next-auth"
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

type SessionProviderProps = {
  children: React.ReactNode
  session?: Session | null
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  )
}
