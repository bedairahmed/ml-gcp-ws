import React, { useState } from "react";
import { Bell, CheckCheck, MessageSquare, Store, Megaphone, ShieldCheck, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NotificationType } from "@/lib/notifications";

const typeIcons: Record<NotificationType, React.ReactNode> = {
  review: <MessageSquare className="h-4 w-4 text-secondary" />,
  claim_approved: <ShieldCheck className="h-4 w-4 text-primary" />,
  claim_rejected: <X className="h-4 w-4 text-destructive" />,
  claim_pending: <Store className="h-4 w-4 text-secondary" />,
  announcement: <Megaphone className="h-4 w-4 text-accent" />,
};

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user?.uid);
  const [open, setOpen] = useState(false);

  const timeAgo = (ts: any) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diff < 1) return "now";
    if (diff < 60) return `${diff}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}d`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs gap-1 h-7" onClick={markAllAsRead}>
              <CheckCheck className="h-3 w-3" /> Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-40" />
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {notifications.slice(0, 20).map((n) => (
                <button
                  key={n.id}
                  onClick={() => { markAsRead(n.id); if (n.link) window.location.hash = n.link; }}
                  className={`w-full text-left p-3 flex gap-3 hover:bg-muted/50 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                >
                  <div className="shrink-0 mt-0.5">{typeIcons[n.type] || <Bell className="h-4 w-4" />}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${!n.read ? "font-medium" : ""}`}>{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(n.createdAt)}</span>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
