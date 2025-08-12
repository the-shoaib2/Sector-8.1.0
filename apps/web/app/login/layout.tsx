'use client';

import { ThemeProvider } from "@/components/providers/theme-provider"
import { SessionProvider } from "@/components/providers/session-provider"

import { ToastProvider } from "@/components/providers/toast-provider"

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SessionProvider>
        {children}
        <ToastProvider />
      </SessionProvider>
    </ThemeProvider>
  )
}
