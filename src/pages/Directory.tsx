import React, { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useDirectory } from "@/hooks/useDirectory";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import BusinessCard from "@/components/directory/BusinessCard";
import BusinessDetailDialog from "@/components/directory/BusinessDetailDialog";
import { businessCategories } from "@/data/sampleBusinesses";
import { toast } from "sonner";

const DirectoryPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, profile } = useAuth();
  const { businesses, reviewsMap, loading, submitClaim } = useDirectory();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedBizId, setSelectedBizId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = businesses.filter((b) => b.isActive);
    if (activeCategory !== "all") {
      list = list.filter((b) => b.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description_en.toLowerCase().includes(q) ||
          b.tags.some((tag) => tag.includes(q)) ||
          b.category.includes(q)
      );
    }
    return list.sort((a, b) => {
      if (a.isPremiumListing !== b.isPremiumListing) return a.isPremiumListing ? -1 : 1;
      return b.averageRating - a.averageRating;
    });
  }, [searchQuery, activeCategory, businesses]);

  const selectedBiz = selectedBizId ? businesses.find((b) => b.id === selectedBizId) || null : null;
  const selectedReviews = selectedBizId ? reviewsMap[selectedBizId] || [] : [];

  const handleClaim = async (businessId: string) => {
    if (!user || !profile) {
      toast.error("Please sign in to claim a business");
      return;
    }
    try {
      const biz = businesses.find((b) => b.id === businessId);
      await submitClaim(businessId, biz?.name || "", user.uid, profile.displayName, profile.email);
      toast.success("Claim request submitted! An admin will review it shortly. 📋");
    } catch {
      toast.error("Failed to submit claim");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">{t("loading")}</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="font-heading text-2xl font-bold">🏢 {t("navDirectory")}</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("search")} className="pl-9" />
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {businessCategories.map((cat) => {
            const label = language === "ar" ? cat.ar : language === "ur" ? cat.ur : cat.en;
            return (
              <Button key={cat.id} variant={activeCategory === cat.id ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(cat.id)} className="shrink-0 gap-1.5">
                <span>{cat.emoji}</span><span>{label}</span>
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <p className="text-xs text-muted-foreground">{filtered.length} {filtered.length === 1 ? "business" : "businesses"} found</p>

      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">{t("noResults")}</p>}
        {filtered.map((biz) => (
          <BusinessCard key={biz.id} business={biz} onViewDetails={setSelectedBizId} />
        ))}
      </div>

      <BusinessDetailDialog
        business={selectedBiz}
        reviews={selectedReviews}
        open={!!selectedBizId}
        onOpenChange={(open) => { if (!open) setSelectedBizId(null); }}
        onClaimBusiness={handleClaim}
      />
    </div>
  );
};

export default DirectoryPage;
