import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Globe, ShieldCheck, Leaf, Crown, MessageSquare } from "lucide-react";
import StarRating from "./StarRating";
import type { Business, Language } from "@/types";

const getName = (b: Business, lang: Language) =>
  lang === "ar" && b.name_ar ? b.name_ar : lang === "ur" && b.name_ur ? b.name_ur : b.name;

const getDesc = (b: Business, lang: Language) =>
  lang === "ar" ? b.description_ar : lang === "ur" ? b.description_ur : b.description_en;

interface Props {
  business: Business;
  onViewDetails: (id: string) => void;
}

const BusinessCard: React.FC<Props> = ({ business, onViewDetails }) => {
  const { language, t } = useLanguage();

  return (
    <Card className="transition-all hover:shadow-md group">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading font-semibold text-base leading-tight">
                {getName(business, language)}
              </h3>
              {business.isPremiumListing && (
                <Crown className="w-4 h-4 text-[hsl(var(--stars-color))] shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <StarRating rating={business.averageRating} />
              <span className="text-xs text-muted-foreground">
                ({business.totalReviews})
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end shrink-0">
            {business.isVerified && (
              <Badge variant="outline" className="text-[10px] gap-1 bg-[hsl(var(--verified-color))]/10 text-[hsl(var(--verified-color))] border-[hsl(var(--verified-color))]/30">
                <ShieldCheck className="w-3 h-3" />
                {t("verified")}
              </Badge>
            )}
            {business.isHalalCertified && (
              <Badge variant="outline" className="text-[10px] gap-1 bg-[hsl(var(--halal-color))]/10 text-[hsl(var(--halal-color))] border-[hsl(var(--halal-color))]/30">
                <Leaf className="w-3 h-3" />
                {t("halalCertified")}
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {getDesc(business, language)}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {business.address}, {business.city}
          </span>
          <span className="inline-flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" />
            {business.phone}
          </span>
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <Globe className="w-3.5 h-3.5" />
              Website
            </a>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {business.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => onViewDetails(business.id)}>
            <MessageSquare className="w-3.5 h-3.5" />
            Reviews ({business.totalReviews})
          </Button>
          {!business.isClaimed && (
            <Button size="sm" variant="ghost" className="gap-1.5 text-primary" onClick={() => onViewDetails(business.id)}>
              {t("claimBusiness")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessCard;
