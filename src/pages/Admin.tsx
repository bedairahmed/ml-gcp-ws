import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Calendar, Store, Megaphone } from "lucide-react";
import UserManagement from "@/components/admin/UserManagement";
import EventModeration from "@/components/admin/EventModeration";
import ClaimApprovals from "@/components/admin/ClaimApprovals";
import AnnouncementEditor from "@/components/admin/AnnouncementEditor";

const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  const { isAdmin, isModerator, user } = useAuth();
  const {
    users, events, claims, announcements, loading,
    updateUserRole, toggleUserActive,
    toggleEventActive, deleteEvent,
    approveClaim, rejectClaim,
    createAnnouncement, updateAnnouncement, deleteAnnouncement,
  } = useAdmin();

  if (!isAdmin && !isModerator) {
    return (
      <div className="p-8 text-center">
        <Shield className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Access Denied</h2>
        <p className="text-sm text-muted-foreground mt-1">Admin or Moderator role required.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">{t("loading")}</div>;
  }

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" /> {t("navAdmin")}
      </h1>

      <Tabs defaultValue="users">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="users" className="gap-1.5 text-xs sm:text-sm">
            <Users className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-1.5 text-xs sm:text-sm">
            <Calendar className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="claims" className="gap-1.5 text-xs sm:text-sm">
            <Store className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Claims</span>
          </TabsTrigger>
          <TabsTrigger value="announcements" className="gap-1.5 text-xs sm:text-sm">
            <Megaphone className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Announce</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <UserManagement users={users} onRoleChange={updateUserRole} onToggleActive={toggleUserActive} />
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <EventModeration events={events} onToggleActive={toggleEventActive} onDelete={deleteEvent} />
        </TabsContent>

        <TabsContent value="claims" className="mt-4">
          <ClaimApprovals
            claims={claims}
            onApprove={(claim) => approveClaim(claim, user?.uid || "")}
            onReject={(id) => rejectClaim(id, user?.uid || "")}
          />
        </TabsContent>

        <TabsContent value="announcements" className="mt-4">
          <AnnouncementEditor
            announcements={announcements}
            onCreate={createAnnouncement}
            onUpdate={updateAnnouncement}
            onDelete={deleteAnnouncement}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
