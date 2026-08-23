'use client';

import { useEffect, useRef } from 'react';
import styles from './NeuralNetCanvas.module.css';

interface Node {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  label: string;
  size: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
  layer: number;
}

interface Edge {
  from: number;
  to: number;
  weight: number;
  animated: number; // 0-1 signal position
  active: boolean;
}

const BENCHMARK_LABELS = [
  'MMLU', 'HumanEval', 'GSM8K', 'MATH', 'HellaSwag', 'ARC-C',
  'TruthfulQA', 'BBH', 'MBPP', 'GPQA', 'AGIEval', 'DROP',
];

const COLORS = [
  '#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706',
  '#dc2626', '#0284c7', '#6d28d9',
];

function project(x: number, y: number, z: number, w: number, h: number) {
  const fov = 500;
  const scale = fov / (fov + z);
  return {
    sx: x * scale + w / 2,
    sy: y * scale + h / 2,
    scale,
  };
}

export function NeuralNetCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const angleRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Build layered neural network topology
    // Layers: 3-5-5-3 (input → hidden1 → hidden2 → output)
    const layers = [3, 5, 5, 3];
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const spreadX = 240;
    const spreadY = 130;
    const spreadZ = 80;

    layers.forEach((count, layerIdx) => {
      const xPos = (layerIdx - (layers.length - 1) / 2) * 130;
      for (let i = 0; i < count; i++) {
        const yPos = (i - (count - 1) / 2) * (spreadY / (count - 1 || 1));
        nodes.push({
          x: xPos + (Math.random() - 0.5) * 10,
          y: yPos + (Math.random() - 0.5) * 10,
          z: (Math.random() - 0.5) * spreadZ,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          vz: (Math.random() - 0.5) * 0.1,
          label: BENCHMARK_LABELS[Math.floor(Math.random() * BENCHMARK_LABELS.length)],
          size: layerIdx === 0 || layerIdx === layers.length - 1 ? 7 : 5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          layer: layerIdx,
        });
      }
    });

    // Add floating extra nodes
    for (let i = 0; i < 8; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * spreadX * 1.8,
        y: (Math.random() - 0.5) * spreadY * 1.8,
        z: (Math.random() - 0.5) * 150,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        vz: (Math.random() - 0.5) * 0.15,
        label: BENCHMARK_LABELS[i % BENCHMARK_LABELS.length],
        size: 3,
        color: COLORS[i % COLORS.length],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        layer: -1,
      });
    }

    // Build edges between adjacent layers
    let nodeIdx = 0;
    const layerStarts: number[] = [];
    layers.forEach((count) => {
      layerStarts.push(nodeIdx);
      nodeIdx += count;
    });

    for (let l = 0; l < layers.length - 1; l++) {
      const fromStart = layerStarts[l];
      const toStart = layerStarts[l + 1];
      for (let f = 0; f < layers[l]; f++) {
        for (let t = 0; t < layers[l + 1]; t++) {
          edges.push({
            from: fromStart + f,
            to: toStart + t,
            weight: Math.random(),
            animated: Math.random(),
            active: Math.random() > 0.3,
          });
        }
      }
    }

    // Add some random extra edges between floating nodes
    const mainCount = nodes.length - 8;
    for (let i = 0; i < 12; i++) {
      const from = Math.floor(Math.random() * mainCount);
      const to = mainCount + Math.floor(Math.random() * 8);
      edges.push({ from, to, weight: Math.random() * 0.5, animated: Math.random(), active: true });
    }

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener('resize', resize);

    let t = 0;

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      t += 0.008;
      angleRef.current += 0.003;
      const angle = angleRef.current;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const tiltCos = Math.cos(0.18);
      const tiltSin = Math.sin(0.18);

      // Rotate nodes (slow orbit)
      const rotated = nodes.map((n) => {
        // Gentle rotation + slight bob
        const rx = n.x * cosA - n.z * sinA;
        const rz = n.x * sinA + n.z * cosA;
        const ry = n.y * tiltCos - rz * tiltSin * 0.1;
        return { rx, ry: ry + Math.sin(t + n.pulse) * 3, rz: rz + n.z };
      });

      // Sort by z for painter's algorithm
      const order = nodes.map((_, i) => i).sort((a, b) => rotated[b].rz - rotated[a].rz);

      // Draw edges first
      edges.forEach((e) => {
        const fn = rotated[e.from];
        const tn = rotated[e.to];
        const fp = project(fn.rx, fn.ry, fn.rz, W, H);
        const tp = project(tn.rx, tn.ry, tn.rz, W, H);
        const alpha = e.weight * 0.22;

        ctx.beginPath();
        ctx.moveTo(fp.sx, fp.sy);
        ctx.lineTo(tp.sx, tp.sy);
        ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
        ctx.lineWidth = e.weight * 0.8;
        ctx.stroke();

        // Animated signal dot traveling along edge
        if (e.active) {
          e.animated = (e.animated + 0.004) % 1;
          const px = fp.sx + (tp.sx - fp.sx) * e.animated;
          const py = fp.sy + (tp.sy - fp.sy) * e.animated;
          const glow = ctx.createRadialGradient(px, py, 0, px, py, 4);
          glow.addColorStop(0, 'rgba(99, 179, 237, 0.9)');
          glow.addColorStop(1, 'rgba(99, 179, 237, 0)');
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }
      });

      // Draw nodes
      order.forEach((i) => {
        const n = nodes[i];
        const r = rotated[i];
        const p = project(r.rx, r.ry, r.rz, W, H);
        const pulse = Math.sin(t * 40 * n.pulseSpeed + n.pulse) * 0.5 + 0.5;
        const baseRadius = n.size * p.scale;
        const glowRadius = baseRadius + pulse * 4;

        // Outer glow
        const grad = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, glowRadius * 2.5);
        grad.addColorStop(0, n.color + '44');
        grad.addColorStop(1, n.color + '00');
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, glowRadius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core circle
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();

        // White inner highlight
        ctx.beginPath();
        ctx.arc(p.sx - baseRadius * 0.3, p.sy - baseRadius * 0.3, baseRadius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fill();

        // Label for larger nodes
        if (baseRadius > 5 && p.scale > 0.7) {
          ctx.font = `${Math.max(9, 10 * p.scale)}px Inter, sans-serif`;
          ctx.fillStyle = `rgba(30, 41, 59, ${Math.min(1, p.scale * 1.2)})`;
          ctx.textAlign = 'center';
          ctx.fillText(n.label, p.sx, p.sy + baseRadius + 12);
        }
      });

      // Subtle floating particles
      for (let i = 0; i < 20; i++) {
        const px = (Math.sin(t * 0.3 + i * 1.4) * 0.5 + 0.5) * W;
        const py = (Math.cos(t * 0.2 + i * 0.9) * 0.5 + 0.5) * H;
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${0.1 + Math.sin(t + i) * 0.05})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.overlay} />
    </div>
  );
}
