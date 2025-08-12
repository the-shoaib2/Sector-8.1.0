import * as React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface TimePickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

function to12Hour(hour: number) {
  const h = hour % 12
  return h === 0 ? 12 : h
}

function to24Hour(hour: number, ampm: "AM" | "PM") {
  if (ampm === "AM") return hour === 12 ? 0 : hour
  return hour === 12 ? 12 : hour + 12
}

function formatDisplayTime(hour: string, minute: string, ampm: "AM" | "PM") {
  if (!hour || !minute) return "Select time"
  return `${hour}:${minute} ${ampm}`
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, label }) => {
  const [open, setOpen] = React.useState(false)
  // Memoize hours and minutes
  const hours = React.useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), [])
  const minutes = React.useMemo(() => Array.from({ length: 60 }, (_, i) => i), [])

  // Parse value to 12-hour format
  const getInitialState = React.useCallback(() => {
    const initialHour = value ? parseInt(value.split(":")[0], 10) : 0
    const initialMinute = value ? value.split(":")[1] : "00"
    const ampm: "AM" | "PM" = initialHour >= 12 ? "PM" : "AM"
    const hour12 = to12Hour(initialHour).toString().padStart(2, "0")
    return { hour: hour12, minute: initialMinute, ampm }
  }, [value])

  const [{ hour, minute, ampm }, setState] = React.useState(getInitialState())

  // Reset state to value when popover opens
  React.useEffect(() => {
    if (open) {
      setState(getInitialState())
    }
    // eslint-disable-next-line
  }, [open])

  // Call onChange when hour/minute/ampm changes
  React.useEffect(() => {
    if (hour && minute && ampm) {
      const hour24 = to24Hour(parseInt(hour, 10), ampm)
      onChange(`${hour24.toString().padStart(2, "0")}:${minute}`)
    }
    // eslint-disable-next-line
  }, [hour, minute, ampm])

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-sm font-medium text-foreground mb-1">{label}</span>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[120px] justify-start bg-background border-muted text-foreground"
            type="button"
          >
            {hour && minute && ampm ? formatDisplayTime(hour, minute, ampm) : "Select time"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 p-2 bg-background border-muted text-foreground">
          <div className="flex gap-2">
            <div className="flex flex-col items-center">
              <span className="text-xs mb-1">Hour</span>
              <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent pr-1">
                {hours.map((h) => {
                  const hStr = h.toString().padStart(2, "0")
                  return (
                    <Button
                      key={h}
                      variant={hour === hStr ? "default" : "ghost"}
                      className="w-12 h-8 mb-1"
                      onClick={() => setState((s) => ({ ...s, hour: hStr }))}
                    >
                      {hStr}
                    </Button>
                  )
                })}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs mb-1">Minute</span>
              <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent pr-1">
                {minutes.map((m) => {
                  const mStr = m.toString().padStart(2, "0")
                  return (
                    <Button
                      key={m}
                      variant={minute === mStr ? "default" : "ghost"}
                      className="w-12 h-8 mb-1"
                      onClick={() => setState((s) => ({ ...s, minute: mStr }))}
                    >
                      {mStr}
                    </Button>
                  )
                })}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs mb-1">AM/PM</span>
              <Button
                variant={ampm === "AM" ? "default" : "ghost"}
                className="w-12 h-8 mb-1"
                onClick={() => setState((s) => ({ ...s, ampm: "AM" }))}
              >
                AM
              </Button>
              <Button
                variant={ampm === "PM" ? "default" : "ghost"}
                className="w-12 h-8"
                onClick={() => setState((s) => ({ ...s, ampm: "PM" }))}
              >
                PM
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 