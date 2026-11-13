import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

interface SplitHeadlineProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  interactiveLetters?: boolean;
  triggerOnView?: boolean;
  delay?: number;
}

export function SplitHeadline({
  text,
  as = 'h2',
  className = '',
  interactiveLetters = false,
  triggerOnView = true,
  delay = 0,
}: SplitHeadlineProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(' ');
  const Tag = as;

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  let charCounter = 0;

  return (
    <Tag aria-label={text} className={className}>
      {words.map((word, wordIdx) => {
        const chars = word.split('');
        return (
          <span
            key={`${word}-${wordIdx}`}
            aria-hidden="true"
            className="inline-block whitespace-nowrap mr-[0.28em] last:mr-0"
          >
            {chars.map((char, charIdx) => {
              const idx = charCounter++;
              const enterProps = triggerOnView
                ? {
                    initial: { y: '105%', opacity: 0 },
                    whileInView: { y: '0%', opacity: 1 },
                    viewport: { once: true, amount: 'some' as const },
                  }
                : {
                    initial: { y: '105%', opacity: 0 },
                    animate: { y: '0%', opacity: 1 },
                  };

              return (
                <span key={`${char}-${charIdx}`} className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    {...enterProps}
                    whileHover={
                      interactiveLetters
                        ? {
                            y: -4,
                            color: '#2563eb',
                            transition: { duration: 0.14, ease: [0.16, 1, 0.3, 1] },
                          }
                        : undefined
                    }
                    transition={{
                      duration: 0.45,
                      delay: delay + Math.min(idx * 0.014, 0.38),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`inline-block will-change-transform ${
                      interactiveLetters ? 'cursor-default transition-colors duration-150' : ''
                    }`}
                  >
                    {char}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}

interface KineticScrambleTextProps {
  text: string;
  className?: string;
  scrambleOnMount?: boolean;
}

export function KineticScrambleText({
  text,
  className = '',
  scrambleOnMount = true,
}: KineticScrambleTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState(text);
  const rafRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  const runScramble = () => {
    if (prefersReducedMotion || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    const totalLength = text.length;
    let frame = 0;
    const maxFrames = Math.max(18, totalLength * 1.4);

    const step = () => {
      frame += 1;
      const progress = frame / maxFrames;
      const revealedCount = Math.floor(progress * totalLength);

      const next = text
        .split('')
        .map((char, idx) => {
          if (char === ' ' || char === '.' || char === ',' || char === "'") {
            return char;
          }
          if (idx < revealedCount) {
            return text[idx];
          }
          return SCRAMBLE_CHARS[(frame + idx * 7) % SCRAMBLE_CHARS.length];
        })
        .join('');

      setDisplayText(next);

      if (frame < maxFrames) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayText(text);
        isAnimatingRef.current = false;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (scrambleOnMount && !prefersReducedMotion) {
      runScramble();
    }
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      isAnimatingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, scrambleOnMount, prefersReducedMotion]);

  return (
    <span
      onMouseEnter={runScramble}
      aria-label={text}
      className={`inline-block ${className}`}
    >
      <span aria-hidden="true">{prefersReducedMotion ? text : displayText}</span>
    </span>
  );
}
