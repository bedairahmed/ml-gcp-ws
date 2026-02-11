import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Globe, Clock, ShieldCheck, Leaf, ThumbsUp, MessageSquare } from "lucide-react";
import StarRating from "./StarRating";
import type { Business, BusinessReview, Language } from "@/types";
import { format } from "date-fns";
import { toast } from "sonner";

const getName = (b: Business, lang: Language) =>
  lang === "ar" && b.name_ar ? b.name_ar : lang === "ur" && b.name_ur ? b.name_ur : b.name;

const getDesc = (b: Business, lang: Language) =>
  lang === "ar" ? b.description_ar : lang === "ur" ? b.description_ur : b.description_en;

const dayLabels = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

interface Props {
  business: Business | null;
  reviews: BusinessReview[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClaimBusiness: (businessId: string) => void;
}

const BusinessDetailDialog: React.FC<Props> = ({ business, reviews, open, onOpenChange, onClaimBusiness }) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!business) return null;

  const handleSubmitReview = () => {
    if (!newReview.trim() || newRating === 0) {
      toast.error("Please add a rating and review text");
      return;
    }
    toast.success("Review submitted! ⭐");
    setNewReview("");
    setNewRating(0);
    setShowReviewForm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">
            {getName(business, language)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rating + badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <StarRating rating={business.averageRating} size="md" />
            <span className="text-sm text-muted-foreground">
              ({business.totalReviews} reviews)
            </span>
            {business.isVerified && (
              <Badge variant="outline" className="text-xs gap-1 bg-[hsl(var(--verified-color))]/10 text-[hsl(var(--verified-color))] border-[hsl(var(--verified-color))]/30">
                <ShieldCheck className="w-3 h-3" />
                {t("verified")}
              </Badge>
            )}
            {business.isHalalCertified && (
              <Badge variant="outline" className="text-xs gap-1 bg-[hsl(var(--halal-color))]/10 text-[hsl(var(--halal-color))] border-[hsl(var(--halal-color))]/30">
                <Leaf className="w-3 h-3" />
                {t("halalCertified")}
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-foreground/80">{getDesc(business, language)}</p>

          {/* Contact info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{business.address}, {business.city}, {business.state} {business.zipCode}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{business.phone}</span>
            </div>
            {business.website && (
              <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                <Globe className="w-4 h-4 shrink-0" />
                <span>{business.website}</span>
              </a>
            )}
          </div>

          {/* Hours */}
          <div className="space-y-1.5">
            <h4 className="text-sm font-semibold flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Hours
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
              {dayLabels.map((day) => {
                const h = business.hours[day];
                return (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize font-medium">{day.slice(0, 3)}</span>
                    <span>{h?.closed ? "Closed" : `${h?.open} – ${h?.close}`}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Claim button */}
          {!business.isClaimed && (
            <>
              <Separator />
              <Button variant="outline" className="w-full gap-2" onClick={() => onClaimBusiness(business.id)}>
                <ShieldCheck className="w-4 h-4" />
                {t("claimBusiness")}
              </Button>
            </>
          )}

          {/* Reviews */}
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Reviews
              </h4>
              {user && (
                <Button size="sm" variant="outline" onClick={() => setShowReviewForm(!showReviewForm)}>
                  {t("writeReview")}
                </Button>
              )}
            </div>

            {/* Review form */}
            {showReviewForm && (
              <div className="space-y-2 bg-muted/30 rounded-lg p-3">
                <StarRating rating={newRating} size="md" interactive onRate={setNewRating} showValue={false} />
                <Textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Share your experience..."
                  maxLength={500}
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="ghost" onClick={() => setShowReviewForm(false)}>{t("cancel")}</Button>
                  <Button size="sm" onClick={handleSubmitReview}>Submit</Button>
                </div>
              </div>
            )}

            {/* Review list */}
            {reviews.length === 0 && !showReviewForm && (
              <p className="text-sm text-muted-foreground text-center py-4">No reviews yet</p>
            )}
            {reviews.map((rev) => (
              <div key={rev.id} className="space-y-1.5 border-b border-border pb-3 last:border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{rev.userName}</span>
                    <StarRating rating={rev.rating} showValue={false} />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(rev.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <p className="text-sm text-foreground/80">{rev.reviewText}</p>
                <div className="flex items-center gap-3">
                  <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <ThumbsUp className="w-3 h-3" />
                    {t("helpful")} ({rev.helpfulCount})
                  </button>
                </div>
                {rev.response && (
                  <div className="ml-4 bg-muted/30 rounded-md p-2 text-xs space-y-0.5">
                    <span className="font-medium text-primary">{t("ownerResponse")}:</span>
                    <p className="text-foreground/80">{rev.response.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessDetailDialog;
