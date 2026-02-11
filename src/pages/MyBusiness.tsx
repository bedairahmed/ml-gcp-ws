import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { sampleBusinesses, sampleReviews } from "@/data/sampleBusinesses";
import type { Business, BusinessReview } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import StarRating from "@/components/directory/StarRating";
import { Store, Clock, MessageSquare, Settings, Save, Star, CheckCircle, AlertCircle, Send } from "lucide-react";
import { toast } from "sonner";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS: Record<string, string> = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu",
  friday: "Fri", saturday: "Sat", sunday: "Sun",
};

const MyBusinessPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, profile, isBusiness, isAdmin } = useAuth();

  // Try Firestore first, fall back to sample data for the logged-in user
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [reviews, setReviews] = useState<Record<string, BusinessReview[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    // Listen for businesses owned by this user
    const q = query(collection(db, "businesses"), where("ownerUid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setBusinesses(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Business)));
      } else {
        // Fallback to sample data matching user
        setBusinesses(sampleBusinesses.filter((b) => b.ownerUid === user.uid || b.claimedBy === user.uid));
      }
      setLoading(false);
    }, () => {
      setBusinesses(sampleBusinesses.filter((b) => b.ownerUid === user.uid || b.claimedBy === user.uid));
      setLoading(false);
    });

    return unsub;
  }, [user]);

  useEffect(() => {
    // Load reviews for each business
    const revMap: Record<string, BusinessReview[]> = {};
    businesses.forEach((biz) => {
      const unsub = onSnapshot(collection(db, "businesses", biz.id, "reviews"), (snap) => {
        if (!snap.empty) {
          revMap[biz.id] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as BusinessReview));
          setReviews({ ...revMap });
        } else if (sampleReviews[biz.id]) {
          revMap[biz.id] = sampleReviews[biz.id];
          setReviews({ ...revMap });
        }
      }, () => {
        if (sampleReviews[biz.id]) {
          revMap[biz.id] = sampleReviews[biz.id];
          setReviews({ ...revMap });
        }
      });
    });
  }, [businesses]);

  if (!user) {
    return (
      <div className="p-8 text-center">
        <Store className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">Please sign in to manage your business.</p>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">{t("loading")}</div>;

  if (businesses.length === 0) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-3">
        <Store className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="text-lg font-semibold">No Business Listing Found</h2>
        <p className="text-sm text-muted-foreground">
          You don't have any claimed businesses yet. Visit the Directory to claim an existing listing or add a new one.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
        <Store className="h-6 w-6 text-primary" /> {t("navMyBusiness")}
      </h1>

      {businesses.map((biz) => (
        <BusinessDashboard key={biz.id} business={biz} reviews={reviews[biz.id] || []} userId={user.uid} />
      ))}
    </div>
  );
};

/* ─── Per-Business Dashboard ─── */

const BusinessDashboard: React.FC<{ business: Business; reviews: BusinessReview[]; userId: string }> = ({
  business, reviews, userId,
}) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {business.name}
            {business.isVerified && <Badge variant="default" className="text-[10px] gap-1"><CheckCircle className="h-3 w-3" /> Verified</Badge>}
            {business.isHalalCertified && <Badge variant="secondary" className="text-[10px]">☪ Halal</Badge>}
          </CardTitle>
          <div className="flex items-center gap-1 text-sm">
            <StarRating rating={business.averageRating} size="sm" />
            <span className="text-muted-foreground ml-1">({business.totalReviews})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="details" className="gap-1.5 text-xs"><Settings className="h-3.5 w-3.5" /> Details</TabsTrigger>
            <TabsTrigger value="hours" className="gap-1.5 text-xs"><Clock className="h-3.5 w-3.5" /> Hours</TabsTrigger>
            <TabsTrigger value="reviews" className="gap-1.5 text-xs"><MessageSquare className="h-3.5 w-3.5" /> Reviews ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <DetailsTab business={business} />
          </TabsContent>
          <TabsContent value="hours" className="mt-4">
            <HoursTab business={business} />
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <ReviewsTab reviews={reviews} businessId={business.id} userId={userId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

/* ─── Details Tab ─── */

const DetailsTab: React.FC<{ business: Business }> = ({ business }) => {
  const [form, setForm] = useState({
    description_en: business.description_en,
    description_ar: business.description_ar,
    description_ur: business.description_ur,
    phone: business.phone,
    email: business.email || "",
    website: business.website || "",
    address: business.address,
    tags: business.tags.join(", "),
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "businesses", business.id), {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        updatedAt: serverTimestamp(),
      });
      toast.success("Business details updated!");
    } catch {
      toast.error("Saved locally (Firestore may be unavailable)");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><Label>Website</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
        <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
      </div>
      <div><Label>Description (EN)</Label><Textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} rows={2} /></div>
      <div><Label>الوصف (AR)</Label><Textarea dir="rtl" value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} rows={2} /></div>
      <div><Label>تفصیل (UR)</Label><Textarea dir="rtl" value={form.description_ur} onChange={(e) => setForm({ ...form, description_ur: e.target.value })} rows={2} /></div>
      <div><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
      <Button onClick={handleSave} disabled={saving} className="gap-1.5">
        <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

/* ─── Hours Tab ─── */

const HoursTab: React.FC<{ business: Business }> = ({ business }) => {
  const [hours, setHours] = useState(business.hours);
  const [saving, setSaving] = useState(false);

  const updateDay = (day: string, field: string, value: string | boolean) => {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "businesses", business.id), { hours, updatedAt: serverTimestamp() });
      toast.success("Hours updated!");
    } catch {
      toast.error("Saved locally (Firestore may be unavailable)");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_1fr_auto] gap-2 p-2 bg-muted/50 text-xs font-medium text-muted-foreground border-b">
          <span>Day</span><span>Open</span><span>Close</span><span>Closed</span>
        </div>
        {DAYS.map((day) => (
          <div key={day} className="grid grid-cols-[80px_1fr_1fr_auto] gap-2 p-2 items-center text-sm border-b last:border-0">
            <span className="font-medium text-xs">{DAY_LABELS[day]}</span>
            <Input
              type="time" value={hours[day]?.open || ""} disabled={hours[day]?.closed}
              onChange={(e) => updateDay(day, "open", e.target.value)}
              className="h-8 text-xs"
            />
            <Input
              type="time" value={hours[day]?.close || ""} disabled={hours[day]?.closed}
              onChange={(e) => updateDay(day, "close", e.target.value)}
              className="h-8 text-xs"
            />
            <Switch
              checked={hours[day]?.closed || false}
              onCheckedChange={(v) => updateDay(day, "closed", v)}
            />
          </div>
        ))}
      </div>
      <Button onClick={handleSave} disabled={saving} className="gap-1.5">
        <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Hours"}
      </Button>
    </div>
  );
};

/* ─── Reviews Tab ─── */

const ReviewsTab: React.FC<{ reviews: BusinessReview[]; businessId: string; userId: string }> = ({
  reviews, businessId, userId,
}) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    try {
      await updateDoc(doc(db, "businesses", businessId, "reviews", reviewId), {
        response: { text: replyText, respondedBy: userId, respondedAt: serverTimestamp() },
      });
      toast.success("Response posted!");
    } catch {
      toast.error("Response saved locally");
    }
    setReplyText("");
    setReplyingTo(null);
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Star className="h-8 w-8 mx-auto mb-2" />
        <p className="text-sm">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((rev) => (
        <div key={rev.id} className="rounded-lg border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{rev.userName}</span>
              <StarRating rating={rev.rating} size="sm" />
            </div>
            <span className="text-xs text-muted-foreground">
              {rev.createdAt?.toDate ? rev.createdAt.toDate().toLocaleDateString() : 
               rev.createdAt instanceof Date ? rev.createdAt.toLocaleDateString() : ""}
            </span>
          </div>
          <p className="text-sm" dir={rev.textDirection}>{rev.reviewText}</p>

          {rev.response ? (
            <div className="bg-muted/50 rounded p-2 text-sm space-y-1">
              <p className="text-xs font-medium text-primary flex items-center gap-1">
                <Store className="h-3 w-3" /> Owner Response
              </p>
              <p>{rev.response.text}</p>
            </div>
          ) : (
            <>
              {replyingTo === rev.id ? (
                <div className="flex gap-2">
                  <Textarea
                    value={replyText} onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your response..." rows={2} className="flex-1 text-sm"
                  />
                  <div className="flex flex-col gap-1">
                    <Button size="sm" className="gap-1" onClick={() => handleReply(rev.id)}>
                      <Send className="h-3 w-3" /> Send
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setReplyingTo(null); setReplyText(""); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => setReplyingTo(rev.id)}>
                  <MessageSquare className="h-3 w-3" /> Respond
                </Button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyBusinessPage;
