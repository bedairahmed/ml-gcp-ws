import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Store, Mail, Phone, FileText } from "lucide-react";
import type { BusinessClaim } from "@/types";

interface Props {
  claims: BusinessClaim[];
  onApprove: (claim: BusinessClaim) => void;
  onReject: (id: string) => void;
}

const methodIcons = { phone: Phone, email: Mail, document: FileText };

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

const ClaimApprovals: React.FC<Props> = ({ claims, onApprove, onReject }) => {
  const { t } = useLanguage();
  const pending = claims.filter((c) => c.status === "pending");
  const resolved = claims.filter((c) => c.status !== "pending");

  return (
    <div className="space-y-4">
      {pending.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-secondary" /> Pending ({pending.length})
          </h3>
          {pending.map((claim) => {
            const Icon = methodIcons[claim.verificationMethod];
            return (
              <div key={claim.id} className="rounded-lg border bg-card p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium flex items-center gap-1.5">
                      <Store className="h-4 w-4 text-primary" /> {claim.businessName}
                    </p>
                    <p className="text-sm text-muted-foreground">{claim.userName} · {claim.userEmail}</p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded p-2">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="capitalize">{claim.verificationMethod}:</span>
                  <span>{claim.verificationDetails}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" className="gap-1.5" onClick={() => onApprove(claim)}>
                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-1.5" onClick={() => onReject(claim.id)}>
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pending.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
          <p className="text-sm">No pending claims</p>
        </div>
      )}

      {resolved.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">History ({resolved.length})</h3>
          {resolved.map((claim) => (
            <div key={claim.id} className="rounded-lg border p-3 flex items-center justify-between text-sm opacity-70">
              <div>
                <span className="font-medium">{claim.businessName}</span>
                <span className="text-muted-foreground ml-2">by {claim.userName}</span>
              </div>
              <Badge variant={statusColors[claim.status]}>{claim.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaimApprovals;
