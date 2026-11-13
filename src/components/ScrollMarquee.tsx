import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

interface ScrollMarqueeProps {
  items?: string[];
  reverse?: boolean;
}

const DEFAULT_ITEMS = [
  'Full Stack Engineering',
  'Python & Django',
  'React & TypeScript',
  'RESTful APIs',
  'System Architecture',
  'MongoDB & SQL',
  'Docker & CI/CD',
];

export default function ScrollMarquee({
  items = DEFAULT_ITEMS,
  reverse = false,
}: ScrollMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  const x = useTransform(
    smoothProgress,
    [0, 1],
    reverse ? ['-14%', '4%'] : ['4%', '-14%']
  );

  const repeated = [...items, ...items, ...items];

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="overflow-hidden border-b border-slate-200/80 bg-white/80 py-4 select-none"
    >
      <motion.div
        style={prefersReducedMotion ? undefined : { x }}
        className="flex w-max items-center gap-6 whitespace-nowrap will-change-transform"
      >
        {repeated.map((label, idx) => (
          <span key={`${label}-${idx}`} className="inline-flex items-center gap-6">
            <span className="font-mono text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
              {label}
            </span>
            <span className="text-blue-600/75">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
