"use client"

import type React from "react"
import { useState } from "react"
import { Mic, Send, Play, Pause, Square, ArrowUp, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"
import { ToolsDropdown, tools } from "./tools-dropdown"

export default function AIPromptInput() {
  const [value, setValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 80,
    maxHeight: 220,
  })

  const getPlaceholder = () => {
    if (isProcessing) return "Processing..."
    const toolObj = tools.find(t => t.label === (selectedTool || 'Chat'))
    return toolObj?.description || "How can I help you today?"
  }

  const handleSubmit = async () => {
    if (value.trim() && !isProcessing) {
      setIsProcessing(true)
      console.log("Submitting:", value)

      // Simulate processing
      setTimeout(() => {
        setValue("")
        adjustHeight(true)
        setIsProcessing(false)
      }, 2000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isProcessing) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    setIsPaused(false)
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
  }

  return (
      <div className="w-full max-w-xl sm:max-w-3xl lg:max-w-4xl">
        <div className="relative bg-muted rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
          <div className="flex items-end gap-2 p-2 sm:gap-3 sm:p-3">
            {/* Tools Button */}
            <ToolsDropdown onToolSelect={setSelectedTool} selectedTool={selectedTool} />

            {/* Input Field */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  adjustHeight()
                }}
                onKeyDown={handleKeyDown}
                placeholder={getPlaceholder()}
                disabled={isProcessing}
                className={cn(
                  "w-full resize-none border-0 bg-muted/30 rounded-2xl px-4 py-4 text-base leading-relaxed",
                  "placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0 focus:outline-none",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-all duration-200",
                )}
                style={{ minHeight: "72px" }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* AI Button */}
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 rounded-full border-2 hover:scale-105 transition-all duration-200"
                onClick={() => {
                  // Placeholder for AI optimization action
                  alert('AI Optimize Prompt (coming soon)')
                }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </Button>
              {/* Recording Controls */}
              {isRecording && (
                <>
                  <Button
                    onClick={togglePause}
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-full border-2 hover:scale-105 transition-all duration-200 bg-transparent"
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={stopRecording}
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-full border-2 hover:scale-105 transition-all duration-200 border-red-200 hover:bg-red-50 bg-transparent"
                  >
                    <Square className="w-4 h-4 text-red-500" />
                  </Button>
                </>
              )}

              {/* Mic Button */}
              <Button
                onClick={toggleRecording}
                variant={isRecording ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-10 w-10 p-0 rounded-full border-2 hover:scale-105 transition-all duration-200",
                  isRecording && "bg-red-500 hover:bg-red-600 border-red-500 animate-pulse",
                )}
              >
                <Mic className="w-4 h-4" />
              </Button>

              {/* Send or Pause Button */}
              {!isProcessing ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!value.trim()}
                  size="sm"
                  className={cn(
                    "h-10 w-10 p-0 rounded-full transition-all duration-200 hover:scale-105",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  )}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={togglePause}
                  size="sm"
                  className={cn(
                    "h-10 w-10 p-0 rounded-full transition-all duration-200 hover:scale-105"
                  )}
                >
                  <Pause className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <span className="ml-2">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>
      </div>
  )
}
