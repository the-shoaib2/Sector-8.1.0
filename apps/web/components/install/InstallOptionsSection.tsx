"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Code2, Check, Copy, Zap, Palette, Sparkles, Globe } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

const platforms = [
  {
    name: "VS Code",
    description: "Microsoft's popular code editor",
    icon: <Code2 className="w-6 h-6" />,
    category: "Editor",
    command: "ext install baby.code-assistant",
    featured: true,
    steps: [
      "Open VS Code",
      "Go to Extensions (Ctrl+Shift+X)",
      "Search for 'B.A.B.Y. Code Assistant'",
      "Click Install"
    ]
  },
  {
    name: "Cursor",
    description: "AI-first code editor built on VS Code",
    icon: <Zap className="w-6 h-6" />,
    category: "Editor",
    command: "ext install baby.code-assistant",
    steps: [
      "Open Cursor",
      "Go to Extensions (Ctrl+Shift+X)",
      "Search for 'B.A.B.Y. Code Assistant'",
      "Click Install"
    ]
  },
  {
    name: "VS Code Insiders",
    description: "Early access version of VS Code",
    icon: <Sparkles className="w-6 h-6" />,
    category: "Editor",
    command: "ext install baby.code-assistant",
    steps: [
      "Open VS Code Insiders",
      "Go to Extensions (Ctrl+Shift+X)",
      "Search for 'B.A.B.Y. Code Assistant'",
      "Click Install"
    ]
  },
  {
    name: "Windsurf",
    description: "Modern code editor for web development",
    icon: <Globe className="w-6 h-6" />,
    category: "Editor",
    command: "ext install baby.code-assistant",
    steps: [
      "Open Windsurf",
      "Go to Extensions (Ctrl+Shift+X)",
      "Search for 'B.A.B.Y. Code Assistant'",
      "Click Install"
    ]
  },
  {
    name: "Trae AI",
    description: "AI-powered code editor",
    icon: <Palette className="w-6 h-6" />,
    category: "Editor",
    command: "ext install baby.code-assistant",
    steps: [
      "Open Trae AI",
      "Go to Extensions (Ctrl+Shift+X)",
      "Search for 'B.A.B.Y. Code Assistant'",
      "Click Install"
    ]
  }
]

export default function InstallOptionsSection() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  const copyToClipboard = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command)
      setCopiedCommand(command)
      setTimeout(() => setCopiedCommand(null), 2000)
    } catch (err) {
      console.error('Failed to copy command:', err)
    }
  }

  return (
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
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Popular Code Editors</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Install B.A.B.Y. in your favorite code editor for seamless integration
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className={`h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 ${platform.featured ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                      {platform.icon}
                    </div>
                    <Badge variant="secondary" className="text-xs">{platform.category}</Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{platform.name}</CardTitle>
                  <CardDescription className="text-sm">{platform.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-muted-foreground">{platform.command}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(platform.command)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedCommand === platform.command ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Installation Steps:</h4>
                      <ol className="text-sm text-muted-foreground space-y-1">
                        {platform.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-2">
                            <span className="text-primary font-medium">{stepIndex + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <Button className="w-full group" variant="outline">
                      <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:scale-105 transition-transform">Install {platform.name}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
} 