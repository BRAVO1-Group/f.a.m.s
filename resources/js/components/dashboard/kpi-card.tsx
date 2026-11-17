import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  unit?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Minimalist KPI metric card with clean typographic hierarchy. */
export function KpiCard({
  label,
  value,
  unit,
  meta,
  children,
  className,
}: KpiCardProps) {
  return (
    <Card className={cn("border-border/60 bg-card shadow-none", className)}>
      <CardContent className="p-4 sm:p-5">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="font-display text-2xl font-semibold tracking-tight tabular-nums text-foreground">
            {value}
          </span>
          {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
        </div>
        {children && <div className="mt-3">{children}</div>}
        {meta && <p className="mt-2 text-xs text-muted-foreground">{meta}</p>}
      </CardContent>
    </Card>
  );
}
