"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code2, Brain, FileCode, Zap, Search, Palette, Sparkles, ArrowRight, Check, Users, Globe, Shield } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    name: "AI Code Analysis",
    description: "Advanced AI-powered code analysis that understands context and provides intelligent insights",
    icon: <Brain className="w-6 h-6" />,
    category: "Core",
    benefits: ["Context-aware suggestions", "Multi-language support", "Real-time analysis"]
  },
  {
    name: "Flow Diagram Generation",
    description: "Automatically convert complex code into clear, visual flow diagrams",
    icon: <FileCode className="w-6 h-6" />,
    category: "Visualization",
    benefits: ["Step-by-step breakdown", "Interactive diagrams", "Export capabilities"]
  },
  {
    name: "Code Optimization",
    description: "Intelligent suggestions to improve code performance and efficiency",
    icon: <Zap className="w-6 h-6" />,
    category: "Performance",
    benefits: ["Performance analysis", "Optimization tips", "Benchmark comparisons"]
  },
  {
    name: "Error Detection",
    description: "Proactive bug detection and intelligent fix suggestions",
    icon: <Search className="w-6 h-6" />,
    category: "Debugging",
    benefits: ["Early bug detection", "Fix suggestions", "Code quality metrics"]
  },
  {
    name: "Syntax Enhancement",
    description: "Enhanced syntax highlighting and code formatting for better readability",
    icon: <Palette className="w-6 h-6" />,
    category: "Editor",
    benefits: ["50+ languages", "Custom themes", "Auto-formatting"]
  },
  {
    name: "Smart Code Completion",
    description: "AI-powered code completion that learns from your coding patterns",
    icon: <Sparkles className="w-6 h-6" />,
    category: "AI",
    benefits: ["Context-aware suggestions", "Learning capabilities", "Multi-file analysis"]
  }
]

const stats = [
  { number: "50+", label: "Programming Languages" },
  { number: "10K+", label: "Active Users" },
  { number: "1M+", label: "Code Files Analyzed" },
  { number: "99.9%", label: "Uptime" }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge variant="secondary" className="mb-4 animate-pulse">
              <Code2 className="w-4 h-4 mr-2" />
              Core Features
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              Powerful Features for Better Code
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              Discover how B.A.B.Y. can transform your coding experience with AI-powered analysis, visualization, and optimization tools.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            >
              <Button size="lg" className="w-full sm:w-auto group">
                <Code2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Try B.A.B.Y. Free
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto group">
                <ArrowRight className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                View Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm sm:text-base text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Core Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to write, understand, and optimize code better
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{feature.name}</CardTitle>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Additional Features */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Why Choose B.A.B.Y.?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Community Driven</h3>
                    <p className="text-sm text-muted-foreground">Built with feedback from thousands of developers worldwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Multi-Platform</h3>
                    <p className="text-sm text-muted-foreground">Works seamlessly across web, desktop, and mobile platforms</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Secure & Private</h3>
                    <p className="text-sm text-muted-foreground">Your code stays private with enterprise-grade security</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-primary/10 rounded-2xl p-6 sm:p-8 h-64 sm:h-80 flex items-center justify-center backdrop-blur-sm">
                <Code2 className="w-16 h-16 sm:w-32 sm:h-32 text-primary" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-primary"
      >
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold mb-4"
          >
            Ready to Transform Your Coding Experience?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90"
          >
            Join thousands of developers who are already writing better code with B.A.B.Y.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Button size="lg" variant="secondary" className="w-full sm:w-auto group bg-white text-gray-800 hover:bg-gray-100">
              <span className="group-hover:scale-105 transition-transform">Start Free Trial</span>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-800 w-full sm:w-auto group">
              <span className="group-hover:scale-105 transition-transform">Schedule Demo</span>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
} 