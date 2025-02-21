import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

interface ChatMessageProps {
  message: string
  isAi: boolean
  timestamp: Date
}

export function ChatMessage({ message, isAi, timestamp }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-4 p-4",
        isAi ? "flex-row" : "flex-row-reverse"
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={isAi ? "/ai-avatar.png" : "/user-avatar.png"} />
        <AvatarFallback>{isAi ? "AI" : "U"}</AvatarFallback>
      </Avatar>

      <Card
        className={cn(
          "max-w-[80%] p-4 rounded-xl",
          isAi ? "bg-primary/10" : "bg-secondary/10"
        )}
      >
        <p className="text-sm text-foreground/90">{message}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {timestamp.toLocaleTimeString()}
        </p>
      </Card>
    </div>
  )
}
