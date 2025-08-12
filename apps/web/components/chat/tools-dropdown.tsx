"use client"

import { useState } from "react"
import { Plus, MessageCircle, BarChart2, Wrench, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type React from "react"

export const tools = [
  {
    icon: MessageCircle,
    label: "Chat",
    description: "General AI conversation",
  },
  {
    icon: BarChart2,
    label: "Visualflow",
    description: "Visualize flows and processes",
  },
  {
    icon: BarChart2,
    label: "Analyze",
    description: "Analyze data or text",
  },
  {
    icon: Wrench,
    label: "Optimize code",
    description: "Improve and refactor code",
  },
  {
    icon: ClipboardList,
    label: "Create project plan",
    description: "Generate a project plan",
  },
]

interface ToolsDropdownProps {
  onToolSelect?: (tool: string) => void;
  selectedTool?: string | null;
}

export function ToolsDropdown({ onToolSelect, selectedTool }: ToolsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  // Default to 'Chat' if nothing is selected
  const currentTool = selectedTool || 'Chat'

  // Find the current tool object
  const toolObj = tools.find(t => t.label === currentTool) || tools[0]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 px-3 rounded-full text-xs font-medium transition-all duration-200 border-2",
            "hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0",
            "shadow-sm hover:shadow-md",
            isOpen && "scale-105 shadow-md",
          )}
        >
          {toolObj.icon && (
            <toolObj.icon className="w-3 h-3 mr-1.5" />
          )}
          {toolObj.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-56 p-2 bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border-border/20"
        sideOffset={12}
      >
        {tools.map((tool) => (
          <DropdownMenuItem
            key={tool.label}
            className={cn(
              "flex items-center gap-2 p-2 rounded-xl cursor-pointer hover:bg-muted/60 focus:bg-muted/60 transition-all duration-200 hover:scale-[1.02]",
              currentTool === tool.label && "bg-primary/10 border border-primary/30"
            )}
            onClick={() => {
              onToolSelect?.(tool.label)
              setIsOpen(false)
            }}
          >
            <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
              <tool.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-xs text-foreground">{tool.label}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{tool.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
