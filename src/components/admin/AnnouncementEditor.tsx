import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Megaphone, Edit } from "lucide-react";
import type { Announcement } from "@/types";

interface Props {
  announcements: Announcement[];
  onCreate: (data: Omit<Announcement, "id" | "createdAt">) => void;
  onUpdate: (id: string, data: Partial<Announcement>) => void;
  onDelete: (id: string) => void;
}

const AnnouncementEditor: React.FC<Props> = ({ announcements, onCreate, onUpdate, onDelete }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ text_en: "", text_ar: "", text_ur: "", priority: 1 });

  const handleCreate = () => {
    if (!form.text_en.trim()) return;
    onCreate({
      text_en: form.text_en,
      text_ar: form.text_ar || form.text_en,
      text_ur: form.text_ur || form.text_en,
      active: true,
      priority: form.priority,
      createdBy: user?.uid || "",
    });
    setForm({ text_en: "", text_ar: "", text_ur: "", priority: 1 });
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{announcements.length} announcements</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> New Announcement</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5" /> New Announcement</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>English *</Label>
                <Textarea value={form.text_en} onChange={(e) => setForm({ ...form, text_en: e.target.value })} placeholder="Announcement text in English" />
              </div>
              <div>
                <Label>العربية</Label>
                <Textarea dir="rtl" value={form.text_ar} onChange={(e) => setForm({ ...form, text_ar: e.target.value })} placeholder="النص بالعربية" />
              </div>
              <div>
                <Label>اردو</Label>
                <Textarea dir="rtl" value={form.text_ur} onChange={(e) => setForm({ ...form, text_ur: e.target.value })} placeholder="اردو میں متن" />
              </div>
              <div>
                <Label>Priority (higher = more visible)</Label>
                <Input type="number" min={1} max={10} value={form.priority} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 1 })} />
              </div>
              <Button onClick={handleCreate} className="w-full">{t("create")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {announcements.map((a) => (
          <div key={a.id} className="rounded-lg border bg-card p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{a.text_en}</p>
                {a.text_ar && a.text_ar !== a.text_en && (
                  <p className="text-xs text-muted-foreground mt-1" dir="rtl">{a.text_ar}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="text-[10px]">P{a.priority}</Badge>
                <Switch checked={a.active} onCheckedChange={(v) => onUpdate(a.id, { active: v })} />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(a.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Megaphone className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No announcements yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementEditor;
