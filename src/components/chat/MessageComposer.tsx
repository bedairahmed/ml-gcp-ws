import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import type { ChatMessage } from "@/types";

interface Props {
  onSend: (message: string) => void;
  replyTo: ChatMessage | null;
  onCancelReply: () => void;
}

const MessageComposer: React.FC<Props> = ({ onSend, replyTo, onCancelReply }) => {
  const { t } = useLanguage();
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (replyTo) inputRef.current?.focus();
  }, [replyTo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <div className="border-t border-border bg-card p-3 space-y-2">
      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center gap-2 bg-muted/50 rounded-md px-3 py-1.5 text-xs">
          <div className="flex-1 truncate">
            <span className="font-medium text-primary">{replyTo.displayName}:</span>{" "}
            <span className="text-muted-foreground">{replyTo.message.slice(0, 60)}...</span>
          </div>
          <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0" onClick={onCancelReply}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("typeMessage")}
          className="flex-1 bg-muted/50 border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
        />
        <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!text.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default MessageComposer;
