import { useEffect, useRef } from "react";
import type { FamsCameraPose } from "./fams-roles";

export interface Packet3D {
  from: number;
  to: number;
  t: number;
}

interface ThreeDStageCanvasProps {
  active: boolean;
  activeRole: number;
  camStateRef: React.MutableRefObject<FamsCameraPose>;
  packetsRef: React.MutableRefObject<Packet3D[]>;
}

function project3D(
  x: number,
  y: number,
  z: number,
  W: number,
  H: number,
  rotY: number,
  rotX: number,
) {
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = x * cosY - z * sinY;
  const z1 = z * cosY + x * sinY;

  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y2 = y * cosX - z1 * sinX;
  const z2 = z1 * cosX + y * sinX;

  const fov = 700;
  const dist = 850;
  const scale = fov / Math.max(100, dist + z2);
  return {
    sx: W / 2 + x1 * scale,
    sy: H / 2 + y2 * scale,
    scale,
  };
}

export function ThreeDStageCanvas({
  active,
  activeRole,
  camStateRef,
  packetsRef,
}: ThreeDStageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRoleRef = useRef(activeRole);
  activeRoleRef.current = activeRole;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    let rafId = 0;

    const render = () => {
      if (active) {
        time += 0.012;
        const W = window.innerWidth;
        const H = window.innerHeight;
        ctx.clearRect(0, 0, W, H);

        const cam = camStateRef.current;
        const rotY = ((cam.ry * Math.PI) / 180) * 0.45 + Math.sin(time * 0.5) * 0.05;
        const rotX = ((cam.rx * Math.PI) / 180) * 0.35;

        ctx.strokeStyle = "rgba(99, 102, 241, 0.12)";
        ctx.lineWidth = 1;
        const gridY = 340;
        for (let gx = -900; gx <= 900; gx += 120) {
          const p1 = project3D(gx, gridY, -500, W, H, rotY, rotX);
          const p2 = project3D(gx, gridY, 700, W, H, rotY, rotX);
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }
        for (let gz = -500; gz <= 700; gz += 120) {
          const p1 = project3D(-900, gridY, gz, W, H, rotY, rotX);
          const p2 = project3D(900, gridY, gz, W, H, rotY, rotX);
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }

        const nodeCoords = [
          { x: -640, y: -160, z: -80, color: "#6366f1", label: "T1 STUDENT" },
          { x: 640, y: -160, z: -80, color: "#9CE840", label: "T2 FIELD SUP" },
          { x: 640, y: 170, z: -60, color: "#38bdf8", label: "T3 UNI SUP" },
          { x: -640, y: 170, z: -60, color: "#a855f7", label: "T4 UNI ADMIN" },
        ];

        const projectedNodes = nodeCoords.map((n, i) => {
          const floatY = n.y + Math.sin(time * 2 + i * 1.5) * 14;
          return { ...n, ...project3D(n.x, floatY, n.z, W, H, rotY, rotX), idx: i };
        });

        const curRole = activeRoleRef.current;
        for (let i = 0; i < 4; i++) {
          const a = projectedNodes[i];
          const b = projectedNodes[(i + 1) % 4];
          if (!a || !b) continue;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.quadraticCurveTo(W / 2, H / 2 + (i % 2 === 0 ? -240 : 240), b.sx, b.sy);
          ctx.strokeStyle = i === curRole ? "rgba(99, 102, 241, 0.38)" : "rgba(255, 255, 255, 0.06)";
          ctx.lineWidth = i === curRole ? 2 : 1;
          ctx.stroke();
        }

        packetsRef.current = packetsRef.current.filter((pkt) => pkt.t <= 1);
        packetsRef.current.forEach((pkt) => {
          pkt.t += 0.022;
          const a = projectedNodes[pkt.from];
          const b = projectedNodes[pkt.to];
          if (!a || !b) return;
          const cx = W / 2;
          const cy = H / 2 - 180;
          const t = pkt.t;
          const px = (1 - t) * (1 - t) * a.sx + 2 * (1 - t) * t * cx + t * t * b.sx;
          const py = (1 - t) * (1 - t) * a.sy + 2 * (1 - t) * t * cy + t * t * b.sy;

          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#34d399";
          ctx.shadowColor = "#9CE840";
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        projectedNodes.forEach((n) => {
          const isAct = n.idx === curRole;
          const r = (isAct ? 14 : 9) * n.scale;
          ctx.beginPath();
          ctx.arc(n.sx, n.sy, r, 0, Math.PI * 2);
          ctx.fillStyle = isAct ? n.color : "rgba(255,255,255,0.18)";
          if (isAct) {
            ctx.shadowColor = n.color;
            ctx.shadowBlur = 20;
          }
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.font = "700 10px monospace";
          ctx.fillStyle = isAct ? "#ffffff" : "rgba(255,255,255,0.4)";
          ctx.textAlign = "center";
          ctx.fillText(n.label, n.sx, n.sy + r + 14);
        });
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [active, camStateRef, packetsRef]);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
}
