import { useEffect, useRef, type RefObject } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const HX = (u: string) =>
  "https://images.higgs.ai/?default=1&output=webp&url=" + encodeURIComponent(u) + "&w=2048&q=85";
const CF = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/";

const ASSETS = {
  plate: HX(CF + "hf_20261111_001031_a09dc558-2c69-4e05-83a4-5f01ebdd1363.png"),
  casePlate: HX(CF + "hf_20261111_001031_4a7c3fd9-2168-4219-9736-096a17bbb0e2.png"),
  cut: HX(CF + "hf_20261111_001143_ec356b1a-50a2-4b50-82fc-e346c914a406.png"),
  badge:
    "https://images.higgs.ai/?default=1&output=webp&url=" +
    encodeURIComponent(CF + "hf_20261111_001143_65c037e6-0768-4b12-9f17-17be132ce16b.png") +
    "&w=1200&q=85",
  trans: CF + "hf_20261111_001144_2b054228-95af-41d5-922d-b02979fe485b.mp4",
};

export interface PosterTransitionHandles {
  toCase: () => void;
  toHero: () => void;
}

interface FamsPosterSceneProps {
  mode: "hero" | "case";
  onEnterCase: () => void;
  onExitCase: () => void;
  handlesRef: RefObject<PosterTransitionHandles | null>;
}

export function FamsPosterScene({
  mode,
  onEnterCase,
  onExitCase,
  handlesRef,
}: FamsPosterSceneProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const plateRef = useRef<HTMLImageElement | null>(null);
  const casePlateRef = useRef<HTMLImageElement | null>(null);
  const cutRef = useRef<HTMLImageElement | null>(null);
  const transRef = useRef<HTMLVideoElement | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const wmRef = useRef<SVGSVGElement | null>(null);
  const scriptRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const badgeHitRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frameEl = frameRef.current;
    const stageEl = stageRef.current;
    const plateImg = plateRef.current;
    const casePlateImg = casePlateRef.current;
    const cutImg = cutRef.current;
    const transVideo = transRef.current;
    const screenEl = screenRef.current;
    const flashEl = flashRef.current;
    const wmSvg = wmRef.current;
    const scriptEl = scriptRef.current;
    const badgeEl = badgeRef.current;
    const badgeHitEl = badgeHitRef.current;

    if (
      !frameEl ||
      !stageEl ||
      !plateImg ||
      !casePlateImg ||
      !cutImg ||
      !transVideo ||
      !screenEl ||
      !flashEl ||
      !wmSvg ||
      !scriptEl ||
      !badgeEl ||
      !badgeHitEl
    ) {
      return;
    }

    const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let busy = false;
    let transReady = false;
    let badgeSway: Animation | null = null;
    let currentMode: "hero" | "case" = "hero";

    const onVideoReady = () => {
      transReady = true;
    };
    transVideo.addEventListener("loadeddata", onVideoReady);
    transVideo.addEventListener("canplaythrough", onVideoReady);

    const fitHero = (s: number, x: number, y: number, W: number, H: number) => {
      const vl = Math.max(0, -x / s);
      const vr = Math.min(1440, (W - x) / s);
      const pad = 18 / s;

      wmSvg.style.left = `${vl + 0.6 * pad}px`;
      wmSvg.style.width = `${vr - vl - 1.2 * pad}px`;

      const bLeft = Math.min(986, vr - pad - 417);
      const vb = Math.min(810, (H - y) / s);
      const bTop = Math.min(-165, vb - 56 / s - 935);
      badgeEl.style.left = `${bLeft}px`;
      badgeEl.style.top = `${bTop}px`;
      scriptEl.style.left = `${vl + pad + 70}px`;
    };

    const place = (m: "hero" | "case") => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const isMobile = W <= 820;
      const n = isMobile ? W / 430 : Math.min(W / 1440, H / 900);
      document.documentElement.style.setProperty("--n", `${n}px`);

      frameEl.classList.remove("d-fade", "m-fade");
      frameEl.classList.add(isMobile ? "m-fade" : "d-fade");

      let s: number;
      let x: number;
      let y: number;

      if (!isMobile) {
        const cover = Math.max(W / 1440, H / 810);
        const u = Math.min(W / 1440, H / 900);
        if (m === "hero") {
          s = cover;
          x = (W - 1440 * s) / 2;
          y = 0;
          fitHero(s, x, y, W, H);
        } else {
          const top = 56 * u;
          const fit = (H - top - 32 * u) / (762 - 79);
          if (fit >= cover) {
            s = cover;
            y = Math.min(0, Math.max(H - 810 * s, top - 79 * s));
          } else {
            s = fit;
            y = top - 79 * fit;
          }
          x = (W - 1440 * s) / 2;
        }
      } else {
        if (m === "hero") {
          s = Math.min(W / 650, (0.62 * H) / 810);
          x = W / 2 - 805 * s;
          y = H - 790 * s;
        } else {
          const navH = 0.022 * H + 42 + 22;
          s = Math.min((W - 24) / 905, Math.max(0.2, (H - navH - 140) / (762 - 95)));
          x = W / 2 - 720 * s;
          y = H - navH - 755 * s;
        }
        document.documentElement.style.setProperty("--mbs", ((0.27 * W) / 582).toString());
      }

      frameEl.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
      frameEl.classList.toggle("m-case", m === "case");
      stageEl.classList.toggle("m-case", m === "case");
    };

    const startBadgeSway = () => {
      if (badgeSway) badgeSway.cancel();
      badgeSway = badgeEl.animate(
        [{ transform: "rotate(-0.8deg)" }, { transform: "rotate(0.8deg)" }, { transform: "rotate(-0.8deg)" }],
        { duration: 5400, iterations: Infinity, easing: "ease-in-out" },
      );
    };

    place("hero");
    if (!RM) {
      wmSvg.animate(
        [
          { opacity: 0, transform: "translateY(60px)", clipPath: "inset(100% 0 0 0)" },
          { opacity: 1, transform: "translateY(0)", clipPath: "inset(0)" },
        ],
        { duration: 900, delay: 200, easing: "cubic-bezier(.16, 1, .3, 1)", fill: "both" },
      );
      scriptEl.animate(
        [{ opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0)" }],
        { duration: 900, delay: 450, easing: "cubic-bezier(.2, .8, .2, 1)", fill: "both" },
      );
      const bIn = badgeEl.animate(
        [
          { opacity: 0, transform: "translateY(-110%) rotate(6deg)", offset: 0 },
          { opacity: 1, transform: "translateY(0) rotate(-2deg)", offset: 0.7 },
          { opacity: 1, transform: "rotate(0)", offset: 1 },
        ],
        { duration: 1200, delay: 400, easing: "cubic-bezier(.2, .8, .2, 1)", fill: "both" },
      );
      bIn.finished.then(startBadgeSway).catch(() => {});
    }

    const onResize = () => {
      frameEl.classList.remove("glide");
      place(currentMode);
    };
    window.addEventListener("resize", onResize);

    // Lanyard drag & flick
    let dragging = false;
    let dragStartX = 0;
    let badgeRot = 0;
    let badgeVelocity = 0;
    let lastDragX = 0;
    let lastDragTime = 0;

    const onBadgeDown = (e: PointerEvent) => {
      dragging = true;
      badgeHitEl.setPointerCapture(e.pointerId);
      dragStartX = e.clientX;
      lastDragX = e.clientX;
      lastDragTime = Date.now();
      badgeSway?.pause();
    };

    const onBadgeMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      const now = Date.now();
      const dt = Math.max(1, now - lastDragTime);
      badgeVelocity = (e.clientX - lastDragX) / dt;
      lastDragX = e.clientX;
      lastDragTime = now;
      badgeRot = Math.max(-18, Math.min(18, dx * 0.08));
      badgeEl.style.transform = `rotate(${badgeRot}deg)`;
    };

    const onBadgeUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try {
        badgeHitEl.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
      const fling = Math.max(-25, Math.min(25, badgeRot + badgeVelocity * 12));
      const settle = badgeEl.animate(
        [
          { transform: `rotate(${badgeRot}deg)` },
          { transform: `rotate(${fling}deg)`, offset: 0.25 },
          { transform: "rotate(0deg)" },
        ],
        { duration: 900, easing: "cubic-bezier(.17, .89, .32, 1.25)" },
      );
      settle.finished
        .then(() => {
          badgeEl.style.transform = "";
          startBadgeSway();
        })
        .catch(() => {});
    };

    badgeHitEl.addEventListener("pointerdown", onBadgeDown);
    window.addEventListener("pointermove", onBadgeMove);
    window.addEventListener("pointerup", onBadgeUp);

    const arriveCase = () => {
      currentMode = "case";
      plateImg.style.visibility = "hidden";
      cutImg.style.opacity = "0";
      screenEl.style.opacity = "1";
      flashEl.animate([{ opacity: 0 }, { opacity: 0.55 }, { opacity: 0 }], { duration: 600, easing: "ease-out" });
      onEnterCase();
      setTimeout(() => {
        busy = false;
        frameEl.classList.remove("glide");
      }, 700);
    };

    const toCase = () => {
      if (busy || currentMode === "case") return;
      busy = true;
      wmSvg.animate([{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-40px)" }], {
        duration: 380,
        easing: "cubic-bezier(.5, 0, .75, 0)",
        fill: "forwards",
      });
      scriptEl.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 380,
        easing: "cubic-bezier(.5, 0, .75, 0)",
        fill: "forwards",
      });
      badgeSway?.cancel();
      badgeEl.animate(
        [{ opacity: 1, transform: "translateY(0) rotate(0)" }, { opacity: 0, transform: "translateY(-110%) rotate(-6deg)" }],
        { duration: 380, easing: "cubic-bezier(.5, 0, .75, 0)", fill: "forwards" },
      );

      setTimeout(() => {
        if (RM || !transReady) {
          place("case");
          casePlateImg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, fill: "forwards" });
          arriveCase();
          return;
        }
        transVideo.currentTime = 0;
        transVideo.style.opacity = "1";
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            plateImg.style.visibility = "hidden";
            cutImg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: "ease-out", fill: "forwards" });
            frameEl.style.setProperty("--glide", "1.6s");
            frameEl.classList.add("glide");
            place("case");
          });
        });

        transVideo.play().catch(() => {});
        const duration = transVideo.duration || 5.04;
        const tickSpeed = () => {
          const p = transVideo.currentTime / duration;
          transVideo.playbackRate = Math.max(1.2, 1.8 + 2.4 * Math.sin(Math.PI * Math.min(p * 1.08, 1)));
          if (transVideo.ended || p >= 0.995) {
            transVideo.pause();
            casePlateImg.style.opacity = "1";
            transVideo.style.opacity = "0";
            arriveCase();
          } else {
            requestAnimationFrame(tickSpeed);
          }
        };
        requestAnimationFrame(tickSpeed);
      }, 330);
    };

    const toHero = () => {
      if (busy || currentMode === "hero") return;
      busy = true;
      onExitCase();
      screenEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" });

      frameEl.style.setProperty("--glide", ".9s");
      frameEl.classList.add("glide");
      place("hero");

      plateImg.style.visibility = "visible";
      cutImg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: 150, fill: "forwards" });
      casePlateImg.animate(
        [{ opacity: 1, filter: "blur(0)" }, { opacity: 0, filter: "blur(12px)" }],
        { duration: 800, easing: "cubic-bezier(.65, 0, .35, 1)", fill: "forwards" },
      );
      plateImg.animate(
        [{ transform: "scale(1.12)", filter: "blur(8px)" }, { transform: "scale(1)", filter: "blur(0)" }],
        { duration: 900, easing: "cubic-bezier(.2, .8, .2, 1)", fill: "forwards" },
      );

      setTimeout(() => {
        wmSvg.animate([{ opacity: 0, transform: "translateY(40px)" }, { opacity: 1, transform: "translateY(0)" }], {
          duration: 700,
          fill: "forwards",
        });
        scriptEl.animate([{ opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0)" }], {
          duration: 700,
          delay: 250,
          fill: "forwards",
        });
        const bIn = badgeEl.animate(
          [
            { opacity: 0, transform: "translateY(-110%) rotate(6deg)", offset: 0 },
            { opacity: 1, transform: "translateY(0) rotate(-2deg)", offset: 0.7 },
            { opacity: 1, transform: "rotate(0)", offset: 1 },
          ],
          { duration: 1100, fill: "forwards" },
        );
        bIn.finished.then(startBadgeSway).catch(() => {});

        currentMode = "hero";
        screenEl.style.opacity = "0";
        setTimeout(() => {
          busy = false;
          frameEl.classList.remove("glide");
        }, 1000);
      }, 250);
    };

    handlesRef.current = { toCase, toHero };

    if (window.location.hash === "#case" || window.location.search.includes("case")) {
      setTimeout(toCase, 600);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      badgeHitEl.removeEventListener("pointerdown", onBadgeDown);
      window.removeEventListener("pointermove", onBadgeMove);
      window.removeEventListener("pointerup", onBadgeUp);
      transVideo.removeEventListener("loadeddata", onVideoReady);
      transVideo.removeEventListener("canplaythrough", onVideoReady);
    };
  }, [handlesRef, onEnterCase, onExitCase]);

  return (
    <div className={cn("fams-root", mode === "case" && "fams-is-case")}>
      {/* Stage */}
      <div className="fams-stage" ref={stageRef}>
        <div className="fams-frame" ref={frameRef}>
          <img className="fams-plate" ref={plateRef} src={ASSETS.plate} alt="" crossOrigin="anonymous" />

          <svg className="fams-wm" ref={wmRef} viewBox="0 0 1440 380" preserveAspectRatio="none">
            <defs>
              <linearGradient id="fams-wm-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="0.5" stopColor="#f1f5f3" stopOpacity="0.9" />
                <stop offset="1" stopColor="#d7e6de" stopOpacity="0.28" />
              </linearGradient>
            </defs>
            <text
              x="14"
              y="310"
              fontFamily="'Inter Tight', sans-serif"
              fontWeight="900"
              fontSize="400"
              letterSpacing="-6px"
              fill="url(#fams-wm-grad)"
            >
              FAMS
            </text>
          </svg>

          <img className="fams-cut" ref={cutRef} src={ASSETS.cut} alt="" crossOrigin="anonymous" />

          <div className="fams-badge" ref={badgeRef}>
            <img className="fams-badge-img" src={ASSETS.badge} alt="" crossOrigin="anonymous" />
            <div className="fams-card">
              <h4>
                INTERN
                <br />
                CARD
              </h4>
              <span className="yr">2026</span>
              <div className="role">FIELD ATTACHMENT // STUDENT</div>
              <div className="ph" />
              <div className="row">
                <span>NAME</span>
                <b>A. NAKATO</b>
              </div>
              <div className="row">
                <span>PROGRAM</span>
                <b>BIS, YEAR 3</b>
              </div>
              <div className="row">
                <span>HOST</span>
                <b>NILE ANALYTICS</b>
              </div>
              <div className="row">
                <span>EMAIL</span>
                <b>HELLO@FAMS.APP</b>
              </div>
            </div>
            <div className="hit" ref={badgeHitRef} title="Field Attachment ID" />
          </div>

          <div className="fams-script" ref={scriptRef}>
            field-attachment
          </div>

          <video
            className="fams-trans"
            ref={transRef}
            src={ASSETS.trans}
            playsInline
            muted
            preload="auto"
            crossOrigin="anonymous"
          />

          <img className="fams-caseplate" ref={casePlateRef} src={ASSETS.casePlate} alt="" crossOrigin="anonymous" />

          <div className="fams-screen" ref={screenRef}>
            <div className="flash" ref={flashRef} />
          </div>
        </div>
      </div>

      {/* Scene 1 Pinned Nav */}
      <div className="fams-ui">
        <button className="fams-tag fams-t1" type="button" onClick={() => handlesRef.current?.toHero()}>
          overview
        </button>
        <button className="fams-tag fams-t2" type="button" onClick={() => handlesRef.current?.toCase()}>
          features
        </button>
        <a className="fams-tag fams-t3" href="#contacts" onClick={(e) => e.preventDefault()}>
          contacts
        </a>
        <Link className="fams-tag fams-t4" to="/auth">
          request a demo
        </Link>

        <div className="fams-hint">
          <div className="fams-hint-line">
            <div className="fams-hint-bead" />
          </div>
          <span>scroll into the system</span>
        </div>
      </div>
    </div>
  );
}
