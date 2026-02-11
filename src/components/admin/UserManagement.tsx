import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, Users, Shield, ShieldCheck, Store, User } from "lucide-react";
import type { UserProfile, UserRole } from "@/types";

interface Props {
  users: UserProfile[];
  onRoleChange: (uid: string, role: string) => void;
  onToggleActive: (uid: string, active: boolean) => void;
}

const roleIcons: Record<UserRole, React.ReactNode> = {
  admin: <Shield className="h-3 w-3" />,
  moderator: <ShieldCheck className="h-3 w-3" />,
  business: <Store className="h-3 w-3" />,
  member: <User className="h-3 w-3" />,
};

const roleBadgeVariant: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
  admin: "destructive",
  moderator: "default",
  business: "secondary",
  member: "outline",
};

const UserManagement: React.FC<Props> = ({ users, onRoleChange, onToggleActive }) => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Badge variant="outline" className="gap-1">
          <Users className="h-3 w-3" /> {users.length}
        </Badge>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 p-3 bg-muted/50 text-xs font-medium text-muted-foreground border-b">
          <span>User</span>
          <span>Role</span>
          <span>Active</span>
          <span>Joined</span>
        </div>
        <div className="divide-y max-h-[60vh] overflow-y-auto">
          {filtered.map((user) => (
            <div key={user.uid} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 p-3 items-center text-sm">
              <div className="min-w-0">
                <p className="font-medium truncate">{user.displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <Select value={user.role} onValueChange={(v) => onRoleChange(user.uid, v)}>
                <SelectTrigger className="w-[130px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["admin", "moderator", "member", "business"] as UserRole[]).map((role) => (
                    <SelectItem key={role} value={role}>
                      <span className="flex items-center gap-1.5">
                        {roleIcons[role]} {t(`role${role.charAt(0).toUpperCase() + role.slice(1)}`)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Switch
                checked={user.isActive}
                onCheckedChange={(v) => onToggleActive(user.uid, v)}
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : "—"}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="p-6 text-center text-muted-foreground text-sm">{t("noResults")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
