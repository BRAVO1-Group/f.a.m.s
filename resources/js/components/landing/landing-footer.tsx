import { GraduationCap, ShieldCheck } from "lucide-react";
import { Link } from "@inertiajs/react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/80 bg-card/60 backdrop-blur-md pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border/60">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group" aria-label="InternTrack home">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
                <GraduationCap className="size-5" />
              </span>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold tracking-tight text-foreground">
                  InternTrack
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                  Internship Operating System
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              The accredited digital platform uniting students, host workplace mentors, and
              university faculty assessors into a single tamper-proof workflow.
            </p>

            <div className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-foreground">All Systems Operational</span>
              <span className="text-[10px] text-muted-foreground/70">• CUE v2.4 API</span>
            </div>
          </div>

          {/* Col 1: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Platform</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  Digital Logbook
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  Geofenced Clock-in
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  Dual Sign-off Protocol
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  Defense Dossier Export
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  Dean & HOD Analytics
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Stakeholders */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Stakeholders
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="#roles" className="hover:text-foreground transition-colors">
                  For University Faculty
                </a>
              </li>
              <li>
                <a href="#roles" className="hover:text-foreground transition-colors">
                  For Host Employers
                </a>
              </li>
              <li>
                <a href="#roles" className="hover:text-foreground transition-colors">
                  For Student Interns
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-foreground transition-colors">
                  4-Stage Placement Journey
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground transition-colors">
                  Common Inquiries
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Governance
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  CUE & TVETA Aligned
                </span>
              </li>
              <li>
                <span>Kenya DPA 2019 Ready</span>
              </li>
              <li>
                <span>256-bit TLS Encryption</span>
              </li>
              <li>
                <span>Immutable Audit Trails</span>
              </li>
              <li>
                <Link href="/auth" className="text-primary font-semibold hover:underline">
                  Launch Interactive Demo →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} InternTrack Pro. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-foreground cursor-pointer transition-colors">
              Privacy Notice
            </span>
            <span className="hover:text-foreground cursor-pointer transition-colors">
              Terms of Placement
            </span>
            <span className="hover:text-foreground cursor-pointer transition-colors">
              Accreditation Standards
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
