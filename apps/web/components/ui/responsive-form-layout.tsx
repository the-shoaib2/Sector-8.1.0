"use client"

import type React from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface ResponsiveFormLayoutProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveFormLayout({ children, className }: ResponsiveFormLayoutProps) {
  const isMobile = useIsMobile()

  return (
    <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2", className)}>
      {children}
    </div>
  )
}

interface ResponsiveFormItemProps {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export function ResponsiveFormItem({ children, className, fullWidth = false }: ResponsiveFormItemProps) {
  const isMobile = useIsMobile()

  return (
    <div className={cn(isMobile || fullWidth ? "col-span-1" : "col-span-1 md:col-span-2", className)}>{children}</div>
  )
}
