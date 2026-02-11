import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { ChatMessage } from "@/types";
import { format } from "date-fns";
import { Reply, SmilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const QUICK_REACTIONS = ["❤️", "👍", "🤲", "😍", "😂", "🔥"];

// Highlight @mentions in message text
const renderMessage = (text: string) => {
  const parts = text.split(/(@\w[\w\s]*?\b)/g);
  return parts.map((part, i) =>
    part.startsWith("@") ? (
      <span key={i} className="bg-primary/15 text-primary font-medium rounded px-0.5">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

interface Props {
  msg: ChatMessage;
  onReply: (msg: ChatMessage) => void;
  onReact: (msgId: string, emoji: string) => void;
}

const MessageBubble: React.FC<Props> = ({ msg, onReply, onReact }) => {
  const { user } = useAuth();
  const isMine = user?.uid === msg.userId;
  const [showActions, setShowActions] = useState(false);

  const time = msg.timestamp?.toMillis
    ? format(new Date(msg.timestamp.toMillis()), "h:mm a")
    : "";

  if (msg.isDeleted) {
    return (
      <div className="flex justify-center py-1">
        <span className="text-xs text-muted-foreground italic">🚫 Message removed by moderator</span>
      </div>
    );
  }

  const totalReactions = Object.entries(msg.reactions || {});

  return (
    <div
      className={`group flex flex-col gap-1 max-w-[85%] ${isMine ? "self-end items-end" : "self-start items-start"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Sender name */}
      {!isMine && (
        <span className="text-xs font-medium text-muted-foreground ml-1">{msg.displayName}</span>
      )}

      {/* Reply context */}
      {msg.replyTo && (
        <div className="text-xs bg-muted/50 border-l-2 border-primary/40 rounded px-2 py-1 ml-1 max-w-full truncate text-muted-foreground">
          <span className="font-medium">{msg.replyTo.displayName}:</span>{" "}
          {msg.replyTo.messagePreview}
        </div>
      )}

      {/* Bubble */}
      <div className="relative">
        <div
          className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
            isMine
              ? "bg-[hsl(var(--chat-sent))] text-primary-foreground rounded-br-md"
              : "bg-[hsl(var(--chat-received))] text-foreground rounded-bl-md"
          }`}
        >
          <p>{renderMessage(msg.message)}</p>
          <span className={`text-[10px] mt-1 block ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
            {time}
          </span>
        </div>

        {/* Hover actions */}
        {showActions && (
          <div className={`absolute top-0 ${isMine ? "left-0 -translate-x-full" : "right-0 translate-x-full"} flex items-center gap-0.5 px-1`}>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onReply(msg)}>
              <Reply className="w-3.5 h-3.5" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <SmilePlus className="w-3.5 h-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-1.5" side="top">
                <div className="flex gap-1">
                  {QUICK_REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => onReact(msg.id, emoji)}
                      className="text-lg hover:scale-125 transition-transform p-0.5"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* Reactions row */}
      {totalReactions.length > 0 && (
        <div className="flex flex-wrap gap-1 ml-1">
          {totalReactions.map(([emoji, users]) => (
            <button
              key={emoji}
              onClick={() => onReact(msg.id, emoji)}
              className={`inline-flex items-center gap-0.5 text-xs rounded-full px-1.5 py-0.5 border transition-colors ${
                user && users.includes(user.uid)
                  ? "bg-primary/15 border-primary/30 text-primary"
                  : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <span>{emoji}</span>
              <span className="font-medium">{users.length}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
