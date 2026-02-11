import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import type { ChatMessage, UserProfile } from "@/types";

interface Props {
  onSend: (message: string) => void;
  replyTo: ChatMessage | null;
  onCancelReply: () => void;
  members?: UserProfile[];
}

const MessageComposer: React.FC<Props> = ({ onSend, replyTo, onCancelReply, members = [] }) => {
  const { t } = useLanguage();
  const [text, setText] = useState("");
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [cursorAtSymbol, setCursorAtSymbol] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (replyTo) inputRef.current?.focus();
  }, [replyTo]);

  const filteredMembers = mentionQuery !== null
    ? members.filter((m) =>
        m.displayName.toLowerCase().includes(mentionQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const cursor = e.target.selectionStart || 0;
    setText(val);

    // Detect @mention trigger
    const before = val.slice(0, cursor);
    const atMatch = before.match(/@(\w*)$/);
    if (atMatch) {
      setCursorAtSymbol(before.lastIndexOf("@"));
      setMentionQuery(atMatch[1]);
      setMentionIndex(0);
    } else {
      setMentionQuery(null);
    }
  };

  const insertMention = (member: UserProfile) => {
    const before = text.slice(0, cursorAtSymbol);
    const after = text.slice(cursorAtSymbol + 1 + (mentionQuery?.length || 0));
    const newText = `${before}@${member.displayName} ${after}`;
    setText(newText);
    setMentionQuery(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (mentionQuery !== null && filteredMembers.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMentionIndex((i) => Math.min(i + 1, filteredMembers.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setMentionIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertMention(filteredMembers[mentionIndex]);
        return;
      } else if (e.key === "Escape") {
        setMentionQuery(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    setMentionQuery(null);
  };

  return (
    <div className="border-t border-border bg-card p-3 space-y-2 relative">
      {/* Mention autocomplete dropdown */}
      {mentionQuery !== null && filteredMembers.length > 0 && (
        <div className="absolute bottom-full left-3 right-3 mb-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {filteredMembers.map((member, i) => (
            <button
              key={member.uid}
              type="button"
              onClick={() => insertMention(member)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors ${
                i === mentionIndex
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {member.photoURL ? (
                <img src={member.photoURL} alt="" className="w-5 h-5 rounded-full" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                  {member.displayName[0]}
                </div>
              )}
              <span className="font-medium">{member.displayName}</span>
            </button>
          ))}
        </div>
      )}

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
          onChange={handleChange}
          onKeyDown={handleKeyDown}
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
