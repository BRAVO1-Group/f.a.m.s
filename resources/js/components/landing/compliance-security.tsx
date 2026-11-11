import {
  CheckCircle2,
  FileBadge2,
  Fingerprint,
  Lock,
  Scale,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const COMPLIANCE_ITEMS = [
  {
    icon: Scale,
    title: "CUE & TVETA Curriculum Aligned",
    description:
      "Pre-configured to satisfy statutory higher education requirements for mandatory industrial attachment credit hours and grading rubrics.",
  },
  {
    icon: ShieldCheck,
    title: "Cryptographic Audit Trails",
    description:
      "Every task entry, supervisor comment, and signature is cryptographically hashed with immutable timestamps to prevent retroactive tampering.",
  },
  {
    icon: Lock,
    title: "5-Tier Principle of Least Privilege",
    description:
      "Strict data segregation ensures host company mentors only access their assigned interns, while university admins retain cohort-wide oversight.",
  },
  {
    icon: Fingerprint,
    title: "Data Protection Act & GDPR Compliant",
    description:
      "Enterprise encryption in transit (TLS 1.3) and at rest (AES-256), fully aligned with national personal data protection regulations.",
  },
];

export function ComplianceSecurity() {
  return (
    <section className="py-20 sm:py-24 bg-muted/20 border-y border-border/70 relative">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center mb-14 sm:mb-18">
          <Badge
            variant="outline"
            className="mb-3.5 px-3 py-1 text-xs font-semibold tracking-wide border-primary/30 text-primary bg-primary/5 uppercase"
          >
            Institutional Trust & Compliance
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Built for rigorous academic accreditation.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Enterprise-grade security and institutional governance engineered from the ground up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMPLIANCE_ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-card hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                  <item.icon className="size-5" />
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>Audited & Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
