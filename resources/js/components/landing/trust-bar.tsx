import { Building2, GraduationCap, ShieldCheck, Sparkles, Trophy, Users } from "lucide-react";

const INSTITUTIONS = [
  { name: "University of Nairobi", code: "UoN", type: "Academic" },
  { name: "TechCorp Kenya", code: "TECHCORP", type: "Host Enterprise" },
  { name: "Strathmore University", code: "SU", type: "Academic" },
  { name: "Safaricom PLC", code: "SAFARICOM", type: "Host Enterprise" },
  { name: "JKUAT", code: "JKUAT", type: "Academic" },
  { name: "Equity Group Foundation", code: "EQUITY", type: "Host Enterprise" },
  { name: "Kenyatta University", code: "KU", type: "Academic" },
  { name: "Andela Africa", code: "ANDELA", type: "Host Enterprise" },
];

const METRICS = [
  {
    value: "35,000+",
    label: "Accredited Logbook Entries",
    sub: "Cryptographically timestamped & verified",
  },
  {
    value: "14+",
    label: "Partner Institutions",
    sub: "Standardized across STEM & Business faculties",
  },
  {
    value: "99.8%",
    label: "On-Time Defense Clearance",
    sub: "Zero last-minute paperwork panic",
  },
  {
    value: "100%",
    label: "Audit Trail Integrity",
    sub: "Dual host-mentor & faculty signatures",
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-border/70 bg-muted/20 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Ticker / Logos Label */}
        <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground/80 mb-8">
          Trusted by Academic Faculties & Leading Industry Internship Hosts
        </p>

        {/* Institution Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 items-center">
          {INSTITUTIONS.map((inst) => (
            <div
              key={inst.name}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/50 bg-card/60 backdrop-blur-xs transition-all hover:border-primary/40 hover:bg-card hover:shadow-xs group"
            >
              <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                {inst.code}
              </span>
              <span className="text-[10px] text-muted-foreground/70 truncate max-w-full text-center mt-1">
                {inst.name}
              </span>
            </div>
          ))}
        </div>

        {/* Trust Stats Row */}
        <div className="mt-12 pt-10 border-t border-border/60 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {METRICS.map((metric) => (
            <div key={metric.label} className="text-center sm:text-left space-y-1">
              <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                {metric.value}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-foreground">{metric.label}</p>
              <p className="text-[11px] text-muted-foreground leading-snug">{metric.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
