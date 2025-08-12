"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, Brain, BookOpen, Target, Zap, Users, ExternalLink } from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleVSCodeIntegration = () => {
    // This would integrate with the VS Code extension
    window.open('vscode://', '_blank')
  }

  const handleCursorIntegration = () => {
    // This would integrate with Cursor editor
    window.open('cursor://', '_blank')
  }

  const handleWindsurfIntegration = () => {
    // This would integrate with Windsurf editor
    window.open('windsurf://', '_blank')
  }

  const handleTeraIntegration = () => {
    // This would integrate with Tera editor
    window.open('tera://', '_blank')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {session.user?.name || 'Developer'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey with Synapse
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button onClick={handleVSCodeIntegration} className="h-auto flex-col gap-2 p-4">
              <Code2 className="h-6 w-6" />
              <span>Open in VS Code</span>
            </Button>
            
            <Button onClick={handleCursorIntegration} variant="outline" className="h-auto flex-col gap-2 p-4">
              <Code2 className="h-6 w-6" />
              <span>Open in Cursor</span>
            </Button>
            
            <Button onClick={handleWindsurfIntegration} variant="outline" className="h-auto flex-col gap-2 p-4">
              <Code2 className="h-6 w-6" />
              <span>Open in Windsurf</span>
            </Button>
            
            <Button onClick={handleTeraIntegration} variant="outline" className="h-auto flex-col gap-2 p-4">
              <Code2 className="h-6 w-6" />
              <span>Open in Tera</span>
            </Button>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Learning Progress</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">7 days</div>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">24</div>
                <p className="text-xs text-muted-foreground">Out of 100</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">12h 30m</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Completed React Fundamentals</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Set new learning goal</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">AI Code Review</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* VS Code Extension Info */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">VS Code Extension</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Synapse Learning Extension
              </CardTitle>
              <CardDescription>
                Get real-time assistance and learning insights directly in your editor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The Synapse VS Code extension provides seamless integration between your learning platform 
                  and development environment. Get instant help, code suggestions, and learning recommendations 
                  as you code.
                </p>
                
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleVSCodeIntegration}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Install Extension
                  </Button>
                  <Button size="sm" variant="outline">
                    View Documentation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
