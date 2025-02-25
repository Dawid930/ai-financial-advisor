import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, User, ArrowRight } from "lucide-react"

interface ChatMessageProps {
  message: string
  isAi: boolean
  timestamp: Date
  suggestions?: string[]
  onSuggestionClick?: (suggestion: string) => void
}

export function ChatMessage({
  message,
  isAi,
  timestamp,
  suggestions,
  onSuggestionClick,
}: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-4",
        isAi ? "flex-row" : "flex-row-reverse"
      )}
    >
      <Avatar
        className={cn(
          "h-10 w-10 shadow-sm",
          isAi ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
        )}
      >
        {isAi ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
        <AvatarFallback>{isAi ? "AI" : "U"}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-3 max-w-[85%]">
        <div
          className={cn("flex flex-col", isAi ? "items-start" : "items-end")}
        >
          <Card
            className={cn(
              "p-4 rounded-2xl shadow-sm",
              isAi
                ? "bg-white border-gray-100"
                : "bg-blue-600 text-white border-blue-600"
            )}
          >
            <div className="text-sm whitespace-pre-wrap">{message}</div>
            <div
              className={cn(
                "text-xs mt-2 flex justify-between items-center",
                isAi ? "text-gray-400" : "text-blue-100"
              )}
            >
              <span>
                {timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </Card>
        </div>

        {isAi && suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs bg-white border-gray-200 hover:bg-gray-50 hover:text-blue-600 rounded-full px-3 py-1 h-auto flex items-center gap-1 group"
                onClick={() => onSuggestionClick?.(suggestion)}
              >
                {suggestion}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
