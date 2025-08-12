"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function LoadingBar() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    // When pathname changes, navigation is complete
    if (isLoading) {
      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
      }, 500)
    }
  }, [pathname, isLoading])

  useEffect(() => {
    if (isLoading) {
      // Simulate smooth progress with easing
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 80) {
            clearInterval(timer)
            return 80
          }
          // Slower progress as it gets higher for smoother feel
          const increment = Math.max(2, 12 - (prev / 10))
          return prev + increment
        })
      }, 60)

      return () => clearInterval(timer)
    }
  }, [isLoading])

  // Listen for navigation start
  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true)
      setProgress(0)
    }

    // Listen for custom route change events
    const handleRouteChangeStart = () => handleStart()

    // Add custom event listeners
    window.addEventListener('routeChangeStart', handleRouteChangeStart)

    return () => {
      window.removeEventListener('routeChangeStart', handleRouteChangeStart)
    }
  }, [])

  if (!isLoading && progress === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-background">
      <div
        className="h-full bg-primary transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}