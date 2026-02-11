import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import GroupList from "@/components/chat/GroupList";
import MessageBubble from "@/components/chat/MessageBubble";
import MessageComposer from "@/components/chat/MessageComposer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import type { ChatMessage, Group, Language } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

const getGroupName = (g: Group, lang: Language) =>
  lang === "ar" ? g.name_ar : lang === "ur" ? g.name_ur : g.name_en;

const ChatPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, profile } = useAuth();
  const isMobile = useIsMobile();
  const [activeGroup, setActiveGroup] = useState("general");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, groups, loading, sendMessage, toggleReaction } = useChat(activeGroup);

  const activeGroupObj = groups.find((g) => g.id === activeGroup);

  const groupMessages = useMemo(
    () => messages.filter((m) => m.groupId === activeGroup).sort((a, b) => {
      const aTime = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
      const bTime = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
      return aTime - bTime;
    }),
    [messages, activeGroup]
  );

  // Auto-scroll to bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [groupMessages.length]);

  const handleSend = useCallback(
    (text: string) => {
      sendMessage(text, replyTo);
      setReplyTo(null);
    },
    [sendMessage, replyTo]
  );

  const handleGroupSelect = (id: string) => {
    setActiveGroup(id);
    setReplyTo(null);
    setSidebarOpen(false);
  };

  const groupListEl = (
    <GroupList
      groups={groups}
      activeGroupId={activeGroup}
      onSelect={handleGroupSelect}
    />
  );

  return (
    <div className="flex h-[calc(100vh-4rem-5rem)] md:h-[calc(100vh-4rem)] max-w-6xl mx-auto border border-border rounded-lg overflow-hidden bg-card">
      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="w-60 border-r border-border shrink-0">{groupListEl}</div>
      )}

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card">
          {isMobile && (
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                {groupListEl}
              </SheetContent>
            </Sheet>
          )}
          <span className="text-lg">{activeGroupObj?.icon}</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-heading font-semibold text-sm truncate">
              {activeGroupObj ? getGroupName(activeGroupObj, language) : ""}
            </h2>
            <p className="text-xs text-muted-foreground">
              {activeGroupObj?.memberCount} members
            </p>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="flex flex-col gap-3 p-4">
            {loading && (
              <p className="text-center text-muted-foreground text-sm py-12 animate-pulse">
                {t("loading")}
              </p>
            )}
            {!loading && groupMessages.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-12">
                No messages yet. Start the conversation! 💬
              </p>
            )}
            {!loading && groupMessages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                onReply={setReplyTo}
                onReact={toggleReaction}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Composer */}
        <MessageComposer onSend={handleSend} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} />
      </div>
    </div>
  );
};

export default ChatPage;
