import { useEffect, useRef } from "react";

export type FocusId = "nozzle" | "entrain" | "diffuser" | "hold";

type VacuumSimulatorProps = {
  running: boolean;
  pressure: number;
  focus: FocusId;
};

type Particle = {
  kind: "supply" | "entrained";
  x: number;
  y: number;
  offset: number;
  size: number;
  speed: number;
};

const W = 1000;
const H = 600;
const CENTER = 260;
const RED = "#E5432E";
const BLUE = "#3F90CD";
const INK = "#444444";

function halfWidth(x: number) {
  if (x < 300) return 30;
  if (x < 390) return 30 - ((x - 300) / 90) * 20;
  if (x < 520) return 10 + ((x - 390) / 130) * 30;
  if (x < 860) return 40 + ((x - 520) / 340) * 25;
  return 65;
}

function createParticles(): Particle[] {
  const supply: Particle[] = Array.from({ length: 76 }, () => ({
    kind: "supply",
    x: Math.random() * 1040 - 20,
    y: CENTER,
    offset: Math.random() * 1.6 - 0.8,
    size: 2.5 + Math.random() * 2.8,
    speed: 0.78 + Math.random() * 0.44,
  }));
  const entrained: Particle[] = Array.from({ length: 42 }, () => ({
    kind: "entrained",
    x: 500 + (Math.random() * 56 - 28),
    y: 330 + Math.random() * 220,
    offset: Math.random() * 1.4 - 0.7,
    size: 2.5 + Math.random() * 2.5,
    speed: 0.75 + Math.random() * 0.5,
  }));
  return [...supply, ...entrained];
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  direction: "right" | "up",
  color: string,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (direction === "right") {
    ctx.moveTo(x - 22, y);
    ctx.lineTo(x + 22, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 22, y);
    ctx.lineTo(x + 12, y - 7);
    ctx.lineTo(x + 12, y + 7);
  } else {
    ctx.moveTo(x, y + 22);
    ctx.lineTo(x, y - 22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - 22);
    ctx.lineTo(x - 7, y - 12);
    ctx.lineTo(x + 7, y - 12);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawMachine(
  ctx: CanvasRenderingContext2D,
  running: boolean,
  pressure: number,
  lift: number,
) {
  ctx.clearRect(0, 0, W, H);

  // Fine drafting grid: a quiet technical backdrop, not a decorative texture.
  ctx.save();
  ctx.strokeStyle = "rgba(68,68,68,0.055)";
  ctx.lineWidth = 1;
  for (let x = 20; x < W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 40);
    ctx.lineTo(x, 570);
    ctx.stroke();
  }
  for (let y = 40; y < 580; y += 40) {
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(980, y);
    ctx.stroke();
  }
  ctx.restore();

  // Cast body and pipe connections.
  const metal = ctx.createLinearGradient(0, 110, 0, 390);
  metal.addColorStop(0, "#E4E7E9");
  metal.addColorStop(0.48, "#CBD1D5");
  metal.addColorStop(1, "#E0E4E6");
  ctx.fillStyle = metal;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  roundedRect(ctx, 122, 120, 746, 272, 26);
  ctx.fill();
  ctx.stroke();
  roundedRect(ctx, 42, 207, 132, 106, 14);
  ctx.fill();
  ctx.stroke();
  roundedRect(ctx, 826, 176, 138, 168, 16);
  ctx.fill();
  ctx.stroke();

  // Vacuum port and suction cup.
  roundedRect(ctx, 448, 350, 104, 154, 12);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(455, 492);
  ctx.quadraticCurveTo(410, 512 - lift * 10, 394, 536 - lift * 10);
  ctx.lineTo(606, 536 - lift * 10);
  ctx.quadraticCurveTo(590, 512 - lift * 10, 545, 492);
  ctx.closePath();
  ctx.fillStyle = "#59646C";
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(500, 536 - lift * 10, 106, 15, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#343D43";
  ctx.fill();

  // Internal flow path, drawn as a cutaway void.
  ctx.beginPath();
  ctx.moveTo(42, 230);
  ctx.lineTo(300, 230);
  ctx.lineTo(390, 250);
  ctx.lineTo(520, 220);
  ctx.lineTo(860, 195);
  ctx.lineTo(964, 195);
  ctx.lineTo(964, 325);
  ctx.lineTo(860, 325);
  ctx.lineTo(520, 300);
  ctx.lineTo(390, 270);
  ctx.lineTo(300, 290);
  ctx.lineTo(42, 290);
  ctx.closePath();
  ctx.fillStyle = "#FAFBFB";
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.stroke();

  roundedRect(ctx, 474, 270, 52, 246, 4);
  ctx.fillStyle = "#FAFBFB";
  ctx.fill();
  ctx.stroke();

  // Nozzle lips make the converging geometry explicit.
  ctx.fillStyle = "#AEB8BE";
  ctx.strokeStyle = INK;
  ctx.beginPath();
  ctx.moveTo(270, 230);
  ctx.lineTo(390, 250);
  ctx.lineTo(390, 236);
  ctx.lineTo(286, 206);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(270, 290);
  ctx.lineTo(390, 270);
  ctx.lineTo(390, 284);
  ctx.lineTo(286, 314);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Low-pressure zone at the nozzle exit.
  const lowPressure = ctx.createRadialGradient(440, CENTER, 4, 440, CENTER, 105);
  lowPressure.addColorStop(0, `rgba(63,144,205,${running ? 0.28 + pressure * 0.25 : 0.08})`);
  lowPressure.addColorStop(1, "rgba(63,144,205,0)");
  ctx.fillStyle = lowPressure;
  ctx.fillRect(360, 150, 210, 220);

  // Section hatching and fasteners.
  ctx.save();
  ctx.strokeStyle = "rgba(68,68,68,0.28)";
  ctx.lineWidth = 1.2;
  for (let x = 170; x < 820; x += 34) {
    ctx.beginPath();
    ctx.moveTo(x, 132);
    ctx.lineTo(x + 18, 150);
    ctx.stroke();
  }
  ctx.restore();
  [170, 810].forEach((x) => {
    ctx.beginPath();
    ctx.arc(x, 164, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#F4F5F5";
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 5, 164);
    ctx.lineTo(x + 5, 164);
    ctx.stroke();
  });

  // Silencer perforations.
  ctx.fillStyle = "#86939B";
  for (let x = 880; x <= 940; x += 20) {
    for (let y = 214; y <= 306; y += 23) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Port identifiers and flow arrows.
  ctx.fillStyle = INK;
  ctx.font = "600 22px 'Noto Sans SC', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("P", 82, 184);
  ctx.fillText("R", 914, 151);
  ctx.fillText("V", 425, 422);
  ctx.font = "500 18px 'Noto Sans SC', sans-serif";
  ctx.fillText("喷嘴", 340, 181);
  ctx.fillText("扩散器", 704, 163);
  ctx.fillText("真空吸盘", 690, 532);
  ctx.strokeStyle = "rgba(68,68,68,0.55)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(635, 526);
  ctx.lineTo(598, 526);
  ctx.stroke();
  drawArrow(ctx, 172, CENTER, "right", RED);
  drawArrow(ctx, 500, 448, "up", BLUE);

  // Workpiece lift is tied to vacuum establishment.
  const workpieceY = 556 - lift * 18;
  ctx.fillStyle = "#2052BB";
  ctx.strokeStyle = "#173F91";
  ctx.lineWidth = 2;
  roundedRect(ctx, 360, workpieceY, 280, 24, 3);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(32,82,187,0.13)";
  ctx.fillRect(390, workpieceY + 24, 220, 8);
}

export default function VacuumSimulator({ running, pressure, focus }: VacuumSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ running, pressure, focus });
  stateRef.current = { running, pressure, focus };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = createParticles();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let lastTime = performance.now();
    let inView = true;
    let lift = stateRef.current.running ? 1 : 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };

    const render = (now: number) => {
      const state = stateRef.current;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (state.running && !reducedMotion) {
        for (const p of particles) {
          if (p.kind === "supply") {
            const jet = p.x > 290 && p.x < 530 ? 2.25 : p.x >= 530 ? 1.15 : 0.85;
            p.x += (95 + state.pressure * 190) * jet * p.speed * dt;
            p.y = CENTER + p.offset * halfWidth(p.x) * 0.72;
            if (p.x > 990) {
              p.x = 24;
              p.offset = Math.random() * 1.6 - 0.8;
            }
          } else if (p.y > 308) {
            p.y -= (65 + state.pressure * 130) * p.speed * dt;
            p.x += (500 - p.x) * Math.min(1, dt * 5);
          } else {
            p.x += (105 + state.pressure * 175) * p.speed * dt;
            const targetY = CENTER + p.offset * halfWidth(p.x) * 0.64;
            p.y += (targetY - p.y) * Math.min(1, dt * 7);
            if (p.x > 970) {
              p.x = 500 + (Math.random() * 50 - 25);
              p.y = 500 + Math.random() * 45;
            }
          }
        }
      }
      lift += ((state.running ? 1 : 0) - lift) * Math.min(1, dt * 3.2);

      ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
      drawMachine(ctx, state.running, state.pressure, lift);

      // Particles remain crisp at high DPI and are intentionally sparse enough to read.
      for (const p of particles) {
        const isEntrained = p.kind === "entrained";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isEntrained ? BLUE : RED;
        ctx.globalAlpha = state.running ? 0.9 : 0.34;
        ctx.fill();
        if (state.running && p.x > 300 && p.x < 530) {
          ctx.strokeStyle = isEntrained ? "rgba(63,144,205,0.38)" : "rgba(229,67,46,0.35)";
          ctx.lineWidth = p.size * 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x - 13, p.y);
          ctx.lineTo(p.x - 4, p.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      const focusRegions: Record<FocusId, [number, number, number, number]> = {
        nozzle: [350, 260, 100, 78],
        entrain: [485, 318, 100, 116],
        diffuser: [700, 260, 172, 105],
        hold: [500, 510 - lift * 10, 145, 70],
      };
      const [x, y, rx, ry] = focusRegions[state.focus];
      const pulse = reducedMotion ? 0.65 : 0.55 + Math.sin(now * 0.004) * 0.15;
      ctx.strokeStyle = `rgba(32,82,187,${pulse})`;
      ctx.lineWidth = 3;
      ctx.setLineDash([9, 8]);
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const loop = (now: number) => {
      if (inView && !document.hidden) render(now);
      else lastTime = now;
      animationFrame = requestAnimationFrame(loop);
    };

    resize();
    render(performance.now());
    const resizeObserver = new ResizeObserver(() => {
      resize();
      render(performance.now());
    });
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    intersectionObserver.observe(canvas);
    if (!reducedMotion) animationFrame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [running, pressure, focus]);

  return (
    <canvas
      ref={canvasRef}
      className="vacuum-canvas"
      role="img"
      aria-label="真空发生器剖面动画：红色压缩空气经喷嘴加速，蓝色气体从真空口被卷吸，两股气体经扩散器共同排出，吸盘在负压下吸持工件。"
    />
  );
}
