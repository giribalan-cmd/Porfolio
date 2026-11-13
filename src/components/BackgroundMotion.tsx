import { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

interface ParticleNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
}

export default function BackgroundMotion() {
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const { scrollYProgress } = useScroll();

  const ringsY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const ringsScrollRotate = useTransform(scrollYProgress, [0, 1], [0, 75]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const nodeCount = width < 768 ? 28 : 54;
    const nodes: ParticleNode[] = Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i * 137.5 * Math.PI) / 180;
      const speed = 0.28 + (i % 5) * 0.1;
      return {
        x: ((i * 97) % Math.max(width, 1)) + Math.random() * 40,
        y: ((i * 61) % Math.max(height, 1)) + Math.random() * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.6 + (i % 3) * 0.75,
        baseAlpha: 0.26 + (i % 4) * 0.08,
      };
    });

    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      pointerRef.current.active = true;
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    const maxLinkDist = width < 768 ? 125 : 165;
    let lastTime = performance.now();

    const drawFrame = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.667, 2.5);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Update positions when motion is enabled
      if (!prefersReducedMotion) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          n.x += n.vx * dt;
          n.y += n.vy * dt;

          // Subtle pointer attraction/repulsion ripple
          if (pointerRef.current.active) {
            const dx = pointerRef.current.x - n.x;
            const dy = pointerRef.current.y - n.y;
            const distSq = dx * dx + dy * dy;
            if (distSq > 4 && distSq < 190 * 190) {
              const dist = Math.sqrt(distSq);
              const force = ((190 - dist) / 190) * 0.018 * dt;
              n.x -= (dx / dist) * force * 24;
              n.y -= (dy / dist) * force * 24;
            }
          }

          if (n.x < -20) n.x = width + 20;
          if (n.x > width + 20) n.x = -20;
          if (n.y < -20) n.y = height + 20;
          if (n.y > height + 20) n.y = -20;
        }
      }

      // Draw connecting constellation edges
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxLinkDist) {
            const strength = 1 - dist / maxLinkDist;
            ctx.strokeStyle = `rgba(37, 99, 235, ${(strength * 0.2).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            // Traveling subtle signal dot on select strong links
            if (!prefersReducedMotion && (i + j) % 9 === 0 && strength > 0.35) {
              const pulseT = ((now * 0.00045 + i * 0.21) % 1);
              const px = a.x + (b.x - a.x) * pulseT;
              const py = a.y + (b.y - a.y) * pulseT;
              ctx.fillStyle = `rgba(37, 99, 235, ${(strength * 0.52).toFixed(3)})`;
              ctx.beginPath();
              ctx.arc(px, py, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Connect nearby nodes to user cursor for responsive feedback
        if (pointerRef.current.active) {
          const pdx = a.x - pointerRef.current.x;
          const pdy = a.y - pointerRef.current.y;
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pdist < 185) {
            const pStrength = 1 - pdist / 185;
            ctx.strokeStyle = `rgba(37, 99, 235, ${(pStrength * 0.34).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointerRef.current.x, pointerRef.current.y);
            ctx.stroke();
          }
        }
      }

      // Draw crisp geometric nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.fillStyle =
          i % 3 === 0
            ? `rgba(37, 99, 235, ${(n.baseAlpha + 0.14).toFixed(3)})`
            : `rgba(71, 85, 105, ${n.baseAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    if (prefersReducedMotion) {
      drawFrame(performance.now());
    } else {
      rafId = requestAnimationFrame(drawFrame);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="no-print pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#f8fafc]"
    >
      {/* Scroll-parallax architectural dot grid */}
      <motion.div
        style={prefersReducedMotion ? undefined : { y: gridY }}
        className="absolute -inset-y-40 inset-x-0 opacity-[0.45] will-change-transform"
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'radial-gradient(rgba(30, 41, 59, 0.16) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
      </motion.div>

      {/* Kinetic daylight ambient gradient waves */}
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: ['-8%', '10%', '-4%', '-8%'],
                y: ['-6%', '8%', '2%', '-6%'],
                scale: [1, 1.14, 0.94, 1],
              }
        }
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -left-24 -top-24 h-[580px] w-[580px] rounded-full will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(37, 99, 235, 0.16) 0%, rgba(59, 130, 246, 0.06) 45%, rgba(248, 250, 252, 0) 72%)',
        }}
      />

      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: ['8%', '-10%', '4%', '8%'],
                y: ['6%', '-8%', '5%', '6%'],
                scale: [1.06, 0.92, 1.12, 1.06],
              }
        }
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -right-24 top-[18%] h-[620px] w-[620px] rounded-full will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(99, 102, 241, 0.06) 48%, rgba(248, 250, 252, 0) 74%)',
        }}
      />

      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: ['-6%', '9%', '-5%', '-6%'],
                y: ['6%', '-7%', '3%', '6%'],
                scale: [0.95, 1.12, 1, 0.95],
              }
        }
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-[-140px] left-[24%] h-[560px] w-[560px] rounded-full will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(37, 99, 235, 0.14) 0%, rgba(56, 189, 248, 0.06) 48%, rgba(248, 250, 252, 0) 74%)',
        }}
      />

      {/* Interactive 60fps geometric constellation canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />

      {/* Continuously orbiting + scroll-linked architectural geometry */}
      <motion.div
        style={prefersReducedMotion ? undefined : { y: ringsY, rotate: ringsScrollRotate }}
        className="absolute right-[4%] top-[8%] h-[540px] w-[540px] opacity-[0.55] will-change-transform"
      >
        <motion.svg
          viewBox="0 0 540 540"
          fill="none"
          className="h-full w-full"
          animate={prefersReducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
        >
          <circle
            cx="270"
            cy="270"
            r="240"
            stroke="rgba(37, 99, 235, 0.22)"
            strokeWidth="1.25"
            strokeDasharray="8 12"
          />
          <circle
            cx="270"
            cy="270"
            r="175"
            stroke="rgba(15, 23, 42, 0.1)"
            strokeWidth="1"
          />
          <circle
            cx="270"
            cy="30"
            r="4"
            fill="rgba(37, 99, 235, 0.45)"
          />
        </motion.svg>
      </motion.div>

      {/* Sweeping diagonal & horizontal kinetic light lines */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            animate={{ x: ['-25%', '125%'] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[24%] h-px w-80 bg-gradient-to-r from-transparent via-blue-600/35 to-transparent will-change-transform"
          />
          <motion.div
            animate={{ x: ['125%', '-25%'] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'linear', delay: 2 }}
            className="absolute top-[58%] h-px w-96 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent will-change-transform"
          />
          <motion.div
            animate={{ x: ['-25%', '125%'] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'linear', delay: 4 }}
            className="absolute top-[84%] h-px w-72 bg-gradient-to-r from-transparent via-blue-500/25 to-transparent will-change-transform"
          />
        </>
      )}
    </div>
  );
}
