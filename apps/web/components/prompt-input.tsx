"use client"

import type React from "react"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"
import { Button } from "@/components/ui/button"
import { Paperclip, ArrowRight } from "lucide-react"

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  disabled?: boolean
}

export default function PromptInput({ value, onChange, onSubmit, placeholder = "What can I do for you?", disabled }: PromptInputProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 72, maxHeight: 300 })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (onSubmit) onSubmit()
      adjustHeight(true)
    }
  }

  return (
    <div className="w-full py-2">
      <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-1.5">
        <div className="relative flex flex-col">
          <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
            <Textarea
              value={value}
              placeholder={placeholder}
              className={cn(
                "w-full rounded-xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                "min-h-[72px]",
              )}
              ref={textareaRef}
              onKeyDown={handleKeyDown}
              onChange={e => {
                onChange(e.target.value)
                adjustHeight()
              }}
              disabled={disabled}
            />
          </div>
          <div className="h-14 bg-black/5 dark:bg-white/5 rounded-b-xl flex items-center">
            <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
              <div className="flex items-center gap-2">
                <label
                  className={cn(
                    "rounded-lg p-2 bg-black/5 dark:bg-white/5 cursor-pointer",
                    "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                    "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white",
                  )}
                  aria-label="Attach file"
                >
                  <input type="file" className="hidden" />
                  <Paperclip className="w-4 h-4 transition-colors" />
                </label>
              </div>
              <button
                type="button"
                className={cn(
                  "rounded-lg p-2 bg-black/5 dark:bg-white/5",
                  "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                )}
                aria-label="Send message"
                disabled={disabled || !value.trim()}
                onClick={onSubmit}
              >
                <ArrowRight
                  className={cn(
                    "w-4 h-4 dark:text-white transition-opacity duration-200",
                    value.trim() ? "opacity-100" : "opacity-30",
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 