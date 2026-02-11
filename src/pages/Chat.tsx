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
import { sampleGroups, sampleMessages } from "@/data/sampleChat";
import type { ChatMessage, Group, Language } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

const getGroupName = (g: Group, lang: Language) =>
  lang === "ar" ? g.name_ar : lang === "ur" ? g.name_ur : g.name_en;

const ChatPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, profile } = useAuth();
  const isMobile = useIsMobile();
  const [activeGroup, setActiveGroup] = useState("general");
  const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeGroupObj = sampleGroups.find((g) => g.id === activeGroup);

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
      if (!user || !profile) return;
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        displayName: profile.displayName,
        message: text,
        timestamp: { toMillis: () => Date.now() } as any,
        userId: user.uid,
        groupId: activeGroup,
        textDirection: /[\u0600-\u06FF]/.test(text) ? "rtl" : "ltr",
        isDeleted: false,
        messageType: "text",
        mentions: [],
        reactions: {},
        replyTo: replyTo
          ? {
              messageId: replyTo.id,
              displayName: replyTo.displayName,
              messagePreview: replyTo.message.slice(0, 50),
            }
          : undefined,
      };
      setMessages((prev) => [...prev, newMsg]);
      setReplyTo(null);
    },
    [user, profile, activeGroup, replyTo]
  );

  const handleReact = useCallback(
    (msgId: string, emoji: string) => {
      if (!user) return;
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== msgId) return m;
          const reactions = { ...m.reactions };
          const users = reactions[emoji] ? [...reactions[emoji]] : [];
          if (users.includes(user.uid)) {
            reactions[emoji] = users.filter((u) => u !== user.uid);
            if (reactions[emoji].length === 0) delete reactions[emoji];
          } else {
            reactions[emoji] = [...users, user.uid];
          }
          return { ...m, reactions };
        })
      );
    },
    [user]
  );

  const handleGroupSelect = (id: string) => {
    setActiveGroup(id);
    setReplyTo(null);
    setSidebarOpen(false);
  };

  const groupListEl = (
    <GroupList
      groups={sampleGroups}
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
            {groupMessages.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-12">
                No messages yet. Start the conversation! 💬
              </p>
            )}
            {groupMessages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                onReply={setReplyTo}
                onReact={handleReact}
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
