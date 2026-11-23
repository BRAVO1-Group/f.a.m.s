import { useId } from "react";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  /** "auto" adapts wordmark to light/dark theme while keeping the emblem 100% consistent */
  variant?: "auto" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
  subtitle?: string;
  className?: string;
};

/**
 * Precision 3D-faceted vector emblem mark (identical geometry in light & dark mode).
 */
export function BrandLogoMark({
  className,
}: {
  variant?: "auto" | "light" | "dark";
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center select-none",
        className,
      )}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <linearGradient
            id={`bg-${uid}`}
            x1="2"
            y1="2"
            x2="62"
            y2="62"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#1D2E22" />
            <stop offset="55%" stopColor="#131E16" />
            <stop offset="100%" stopColor="#0C140E" />
          </linearGradient>

          <linearGradient
            id={`rim-${uid}`}
            x1="2"
            y1="2"
            x2="62"
            y2="62"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#B4FF52" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#9CE840" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#388E18" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient
            id={`lime-${uid}`}
            x1="12"
            y1="10"
            x2="52"
            y2="50"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#C8FF68" />
            <stop offset="45%" stopColor="#9CE840" />
            <stop offset="100%" stopColor="#6AC21C" />
          </linearGradient>

          <linearGradient
            id={`depth-${uid}`}
            x1="16"
            y1="24"
            x2="54"
            y2="54"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#3CB02A" />
            <stop offset="100%" stopColor="#16761E" />
          </linearGradient>
        </defs>

        {/* Squircle Container */}
        <rect x="2" y="2" width="60" height="60" rx="16" fill={`url(#bg-${uid})`} />
        <rect
          x="2.75"
          y="2.75"
          width="58.5"
          height="58.5"
          rx="15.25"
          stroke={`url(#rim-${uid})`}
          strokeWidth="1.5"
        />

        {/* Academic Cap Top Diamond */}
        <path
          d="M32 12L50 20.5L32 29L14 20.5L32 12Z"
          fill={`url(#lime-${uid})`}
        />
        {/* Cap Left Tassel */}
        <path
          d="M17.5 22V31.5"
          stroke="#A6F244"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="17.5" cy="32.2" r="1.9" fill="#C8FF68" />

        {/* Isometric Cap Base (Left Light Facet + Right Emerald Depth Facet) */}
        <path
          d="M22.5 26L32 30.5V38C29 35 25.8 33.5 22.5 32.8V26Z"
          fill="#98E63B"
        />
        <path
          d="M41.5 26L32 30.5V38L41.5 29.5V26Z"
          fill={`url(#depth-${uid})`}
        />

        {/* 3D Extruded Verification Check-Arrow (Bottom Emerald Depth Layer) */}
        <path
          d="M22 38L32 48L46 34L49 37L52.2 26L41.2 29.2L44.2 32.2L32 44.5L26.2 38.8L22 38Z"
          fill={`url(#depth-${uid})`}
          transform="translate(0, 3.4)"
        />

        {/* 3D Extruded Verification Check-Arrow (Top Luminous Lime Layer) */}
        <path
          d="M22 38H27L32 43L43.6 31.4L40.4 28.2L52.2 25.8L49.8 37.6L46.6 34.4L32 49L22 38Z"
          fill={`url(#lime-${uid})`}
        />
      </svg>
    </div>
  );
}

export function BrandLogo({
  variant = "auto",
  size = "md",
  iconOnly = false,
  subtitle,
  className,
}: BrandLogoProps) {
  const markSize =
    size === "sm" ? "size-7" : size === "lg" ? "size-10" : "size-8";

  const textSize =
    size === "sm" ? "text-base" : size === "lg" ? "text-xl" : "text-[17px]";

  const wordColor =
    variant === "light"
      ? "text-[#141D17]"
      : variant === "dark"
        ? "text-[#F4F9F5]"
        : "text-foreground";

  const accentColor =
    variant === "light"
      ? "text-[#589E10]"
      : variant === "dark"
        ? "text-[#9CE840]"
        : "text-[#589E10] dark:text-[#9CE840]";

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <BrandLogoMark variant={variant} className={markSize} />
      {!iconOnly && (
        <div className="grid flex-1 text-left leading-tight">
          <div className="inline-flex items-center gap-1.5">
            <span
              className={cn(
                "truncate font-display font-extrabold tracking-tight",
                textSize,
                wordColor,
              )}
            >
              Intern<span className={accentColor}>Track</span>
            </span>
          </div>
          {subtitle && (
            <span className="truncate text-[11px] font-medium text-muted-foreground">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
