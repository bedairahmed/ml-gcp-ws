import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { toast } from "sonner";
import { z } from "zod";

const eventSchema = z.object({
  title_en: z.string().trim().min(1, "Title (EN) is required").max(120),
  title_ar: z.string().trim().max(120).optional(),
  title_ur: z.string().trim().max(120).optional(),
  description_en: z.string().trim().min(1, "Description is required").max(500),
  description_ar: z.string().trim().max(500).optional(),
  description_ur: z.string().trim().max(500).optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required").max(20),
  location: z.string().trim().min(1, "Location is required").max(150),
  category: z.enum(["jummah", "education", "social", "youth", "volunteer", "ramadan"]),
});

type EventFormData = z.infer<typeof eventSchema>;

const emptyForm: EventFormData = {
  title_en: "",
  title_ar: "",
  title_ur: "",
  description_en: "",
  description_ar: "",
  description_ur: "",
  date: "",
  time: "",
  location: "",
  category: "social",
};

const AddEventDialog: React.FC = () => {
  const { t } = useLanguage();
  const { user, isAdmin, isModerator } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<EventFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!isAdmin && !isModerator) return null;

  const updateField = (field: keyof EventFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = eventSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof EventFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "events"), {
        ...result.data,
        title_ar: result.data.title_ar || result.data.title_en,
        title_ur: result.data.title_ur || result.data.title_en,
        description_ar: result.data.description_ar || result.data.description_en,
        description_ur: result.data.description_ur || result.data.description_en,
        rsvpCount: 0,
        rsvpUsers: [],
        targetGroups: ["general"],
        createdBy: user?.uid || "unknown",
        createdAt: serverTimestamp(),
        isActive: true,
      });
      toast.success("Event created! 🎉");
      setForm(emptyForm);
      setOpen(false);
    } catch (error: any) {
      console.error("Create event error:", error.message);
      toast.error("Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" />
          {t("create")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">📅 Create Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title EN */}
          <div className="space-y-1.5">
            <Label htmlFor="title_en">Title (English) *</Label>
            <Input id="title_en" value={form.title_en} onChange={(e) => updateField("title_en", e.target.value)} maxLength={120} />
            {errors.title_en && <p className="text-xs text-destructive">{errors.title_en}</p>}
          </div>

          {/* Title AR */}
          <div className="space-y-1.5">
            <Label htmlFor="title_ar">Title (Arabic)</Label>
            <Input id="title_ar" dir="rtl" value={form.title_ar} onChange={(e) => updateField("title_ar", e.target.value)} maxLength={120} />
          </div>

          {/* Title UR */}
          <div className="space-y-1.5">
            <Label htmlFor="title_ur">Title (Urdu)</Label>
            <Input id="title_ur" dir="rtl" value={form.title_ur} onChange={(e) => updateField("title_ur", e.target.value)} maxLength={120} />
          </div>

          {/* Description EN */}
          <div className="space-y-1.5">
            <Label htmlFor="desc_en">Description (English) *</Label>
            <Textarea id="desc_en" value={form.description_en} onChange={(e) => updateField("description_en", e.target.value)} maxLength={500} rows={3} />
            {errors.description_en && <p className="text-xs text-destructive">{errors.description_en}</p>}
          </div>

          {/* Description AR */}
          <div className="space-y-1.5">
            <Label htmlFor="desc_ar">Description (Arabic)</Label>
            <Textarea id="desc_ar" dir="rtl" value={form.description_ar} onChange={(e) => updateField("description_ar", e.target.value)} maxLength={500} rows={2} />
          </div>

          {/* Description UR */}
          <div className="space-y-1.5">
            <Label htmlFor="desc_ur">Description (Urdu)</Label>
            <Textarea id="desc_ur" dir="rtl" value={form.description_ur} onChange={(e) => updateField("description_ur", e.target.value)} maxLength={500} rows={2} />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date *</Label>
              <Input id="date" type="date" value={form.date} onChange={(e) => updateField("date", e.target.value)} />
              {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time">Time *</Label>
              <Input id="time" placeholder="e.g. 7:00 PM" value={form.time} onChange={(e) => updateField("time", e.target.value)} maxLength={20} />
              {errors.time && <p className="text-xs text-destructive">{errors.time}</p>}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label htmlFor="location">Location *</Label>
            <Input id="location" value={form.location} onChange={(e) => updateField("location", e.target.value)} maxLength={150} />
            {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="jummah">🕌 Jummah</SelectItem>
                <SelectItem value="education">📖 Education</SelectItem>
                <SelectItem value="social">🤝 Social</SelectItem>
                <SelectItem value="youth">⚡ Youth</SelectItem>
                <SelectItem value="volunteer">💚 Volunteer</SelectItem>
                <SelectItem value="ramadan">🌙 Ramadan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventDialog;
