import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Code2, Brain, Zap, Users, BookOpen, Target, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-3 rounded-full bg-primary/10 px-6 py-3 text-primary">
              <Code2 className="h-5 w-5" />
              <span className="text-sm font-medium">Synapse Learning Platform</span>
            </div>
          </div>
          
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Universal Intelligent
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Learning Assistant
            </span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Transform your coding journey with AI-powered learning, real-time assistance, and intelligent code analysis. 
            Built for developers, by developers.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="group">
              <Link href="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Why Choose Synapse?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Experience the future of learning with cutting-edge AI technology and seamless integration.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">AI-Powered Learning</h3>
              <p className="text-muted-foreground">
                Intelligent code analysis and personalized learning paths tailored to your skill level.
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Real-time Assistance</h3>
              <p className="text-muted-foreground">
                Get instant help and suggestions as you code, with context-aware recommendations.
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Community Driven</h3>
              <p className="text-muted-foreground">
                Connect with fellow developers, share knowledge, and learn from the community.
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Comprehensive Resources</h3>
              <p className="text-muted-foreground">
                Access a vast library of tutorials, examples, and best practices across all programming languages.
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Goal-Oriented Learning</h3>
              <p className="text-muted-foreground">
                Set learning objectives and track your progress with detailed analytics and insights.
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">VS Code Integration</h3>
              <p className="text-muted-foreground">
                Seamlessly integrate with your favorite editor for a smooth development experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Ready to Transform Your Learning?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Join thousands of developers who are already using Synapse to accelerate their learning journey.
          </p>
          <Button asChild size="lg">
            <Link href="/register">Start Learning Today</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
