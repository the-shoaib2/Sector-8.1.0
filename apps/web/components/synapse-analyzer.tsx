"use client"

import { useState } from "react"
import { Code2, Circle, ChevronDown } from "lucide-react"
import dynamic from "next/dynamic"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import PromptInput from "@/components/prompt-input"

const Mermaid = dynamic(() => import("@/components/ui/mermaid"), { ssr: false })

export default function SynapseAnalyzer() {
  const [input, setInput] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [output, setOutput] = useState<string | null>(null)
  const [view, setView] = useState<'diagram' | 'summary'>("diagram")
  const [loading, setLoading] = useState(false)

  const handleAnalyze = () => {
    setLoading(true)
    setOutput(null)
    setTimeout(() => {
      setLoading(false)
      if (view === "diagram") {
        setOutput(`graph TD;\nA[Start] --> B{Is it C code?};\nB -- Yes --> C[Parse C code];\nB -- No --> D[Show error];\nC --> E[Generate Flow Diagram];\nE --> F[Show to User];`)
      } else {
        setOutput("This code takes your C code, parses it, generates a flow diagram, and displays it to you. If the input is not C code, it shows an error.")
      }
    }, 700)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted/60 to-background p-4 relative overflow-hidden">
      {/* Dotted SVG background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" width="100%" height="100%" style={{ minHeight: '100vh' }}>
        <defs>
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#8884" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
      <motion.header
        className="flex items-center gap-3 mt-8 mb-10 select-none z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-2 shadow-sm">
          <Code2 className="w-10 h-10 text-primary" />
        </span>
        <span className="text-3xl font-extrabold tracking-tight text-foreground">Synapse</span>
        <span className="ml-2 text-base font-medium text-muted-foreground hidden sm:inline">Intelligent Learning & Coding Assistant</span>
      </motion.header>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-xl z-10"
      >
        <Card className="bg-card/80 shadow-2xl border border-muted/40 backdrop-blur-md relative flex flex-row">
          {/* Left-side dropdown menu */}
          <div className="flex flex-col items-center justify-start p-4 pr-0 min-w-[120px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/60 hover:bg-muted/80 text-foreground font-semibold shadow-md border border-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200">
                  <Circle className="w-5 h-5 text-primary" />
                  <span className="hidden sm:inline">{view === 'diagram' ? 'Flow Diagram' : 'Summary'}</span>
                  <ChevronDown className="w-4 h-4 ml-1 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[140px] mt-2">
                <DropdownMenuItem onClick={() => setView('diagram')}>
                  Flow Diagram
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView('summary')}>
                  Summary
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Main analyzer content */}
          <div className="flex-1 flex flex-col gap-6 p-6 pl-2">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="flex items-center gap-2">
                <span>Analyze & Visualize Code</span>
              </CardTitle>
              <CardDescription>Paste your code or upload a file to generate a flow diagram or summary.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 p-0">
              <PromptInput
                value={input}
                onChange={setInput}
                onSubmit={handleAnalyze}
                placeholder="Paste your code or describe what you want (e.g., 'Show flow diagram for this C code')"
                disabled={loading}
              />
              <input
                type="file"
                accept=".c,.cpp,.js,.ts,.py,.java,.cs,.go,.rb,.rs,.php,.swift,.kt,.m,.scala,.sh,.json,.yaml,.yml,.txt"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all duration-200"
              />
              <Button
                className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg px-6 py-2 font-bold shadow-lg hover:from-primary/90 hover:to-primary/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 mt-2"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze & Visualize"}
              </Button>
              <AnimatePresence>
                {output && (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                    className="mt-4 p-4 bg-muted/60 rounded-lg shadow-inner min-h-[120px]"
                  >
                    {view === 'diagram' ? (
                      <Mermaid chart={output} />
                    ) : (
                      <div className="text-base text-foreground/90 leading-relaxed">{output}</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </div>
  )
} 