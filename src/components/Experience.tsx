import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { Briefcase, Building2, Calendar, CheckCircle2 } from 'lucide-react';
import { EXPERIENCE_ITEMS } from '../data/portfolio';
import { SplitHeadline } from './MotionText';

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 82%', 'end 60%'],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <section id="experience" className="border-b border-slate-200/80 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.12em] text-blue-600">
            <Briefcase className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>EXPERIENCE</span>
          </p>
          <SplitHeadline
            as="h2"
            text="Professional Experience."
            interactiveLetters
            className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl [text-wrap:balance]"
          />
        </div>

        {/* Vertical Timeline */}
        <div ref={timelineRef} className="relative mt-12 space-y-8 pl-7 sm:pl-10">
          {/* Background Track */}
          <div
            aria-hidden="true"
            className="absolute bottom-2 left-2.5 top-2 w-px bg-slate-200 sm:left-3.5"
          />
          {/* Scroll-Drawn Blue Spine */}
          <motion.div
            aria-hidden="true"
            style={prefersReducedMotion ? undefined : { scaleY }}
            className="absolute bottom-2 left-2.5 top-2 w-px origin-top bg-blue-600/85 sm:left-3.5"
          />

          {EXPERIENCE_ITEMS.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{
                duration: 0.4,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative rounded-xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-colors hover:border-blue-500/40"
            >
              {/* Timeline Node Marker */}
              <motion.span
                aria-hidden="true"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 22,
                  delay: idx * 0.08 + 0.1,
                }}
                className="absolute -left-[25px] top-8 flex h-5 w-5 items-center justify-center rounded-full border border-blue-500/60 bg-white sm:-left-[34px]"
              >
                <span className="h-2 w-2 rounded-full bg-blue-600" />
              </motion.span>

              <div className="flex flex-col gap-3 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="h-4 w-4 text-blue-600 shrink-0" aria-hidden="true" />
                    <h3 className="font-display text-xl font-bold text-slate-950">
                      {item.role}
                    </h3>
                  </div>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                    <span>{item.organization}</span>
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-slate-500 tabular-nums whitespace-nowrap">
                  <Calendar className="h-3.5 w-3.5 text-blue-600 shrink-0" aria-hidden="true" />
                  <span>{item.duration}</span>
                </span>
              </div>

              <ul className="mt-5 space-y-3">
                {item.responsibilities.map((resp, rIdx) => (
                  <motion.li
                    key={resp}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 'some' }}
                    transition={{
                      duration: 0.35,
                      delay: idx * 0.08 + rIdx * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 sm:text-base"
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-1 h-4 w-4 shrink-0 text-blue-600"
                    />
                    <span>{resp}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
