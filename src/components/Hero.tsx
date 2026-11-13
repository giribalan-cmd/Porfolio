import { Suspense, lazy, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDownRight, Code2, Download, Github, Linkedin, Terminal } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolio';
import { KineticScrambleText, SplitHeadline } from './MotionText';
import ResumeModal from './ResumeModal';

const Scene3D = lazy(() => import('./Scene3D'));

export default function Hero() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const leftY = useTransform(scrollYProgress, [0, 1], [0, -34]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 26]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  const handleExploreClick = () => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative border-b border-slate-200/80 py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Core Typographic Hierarchy */}
          <motion.div
            style={prefersReducedMotion ? undefined : { y: leftY, opacity: leftOpacity }}
            className="flex flex-col justify-center will-change-transform lg:col-span-6"
          >
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.14em] text-blue-600"
            >
              <Terminal className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <KineticScrambleText text={PERSONAL_INFO.heroKicker} />
            </motion.p>

            <SplitHeadline
              as="h1"
              text={PERSONAL_INFO.heroHeadline}
              interactiveLetters
              triggerOnView={false}
              delay={0.05}
              className="mt-4 font-display text-[clamp(2.4rem,4.3vw,4rem)] font-bold leading-[1.08] tracking-[-0.03em] text-slate-950 [text-wrap:balance]"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-xl text-base leading-[1.7] text-slate-600 sm:text-lg"
            >
              {PERSONAL_INFO.heroDescription}
            </motion.p>

            {/* Unboxed Specialization Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-medium text-slate-700"
            >
              <Code2 className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
              {PERSONAL_INFO.specialization.map((item, idx) => (
                <motion.span
                  key={item}
                  whileHover={{ y: -1, color: '#0f172a' }}
                  transition={{ duration: 0.14 }}
                  className="inline-flex items-center gap-2.5"
                >
                  <span>{item}</span>
                  {idx < PERSONAL_INFO.specialization.length - 1 && (
                    <span aria-hidden="true" className="text-blue-600">
                      /
                    </span>
                  )}
                </motion.span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                onClick={handleExploreClick}
                className="group inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-blue-700"
              >
                <span>Explore My Work</span>
                <ArrowDownRight
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setResumeOpen(true)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap shrink-0 shadow-xs transition-colors duration-150 hover:border-slate-400 hover:bg-slate-50"
              >
                <Download className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <span>Download Resume</span>
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.5 }}
              className="mt-8 flex items-center gap-5 border-t border-slate-200/80 pt-6"
            >
              <motion.a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -1 }}
                aria-label="GitHub profile of Giribalan R."
                className="inline-flex min-h-[40px] items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                <span>GitHub</span>
              </motion.a>

              <span aria-hidden="true" className="h-4 w-px bg-slate-300" />

              <motion.a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -1 }}
                aria-label="LinkedIn profile of Giribalan R."
                className="inline-flex min-h-[40px] items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                <span>LinkedIn</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive 3D Canvas Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={prefersReducedMotion ? undefined : { y: stageY, scale: stageScale }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex will-change-transform lg:col-span-6"
          >
            <Suspense
              fallback={
                <div className="flex min-h-[380px] lg:min-h-[500px] w-full items-center justify-center" />
              }
            >
              <Scene3D />
            </Suspense>
          </motion.div>
        </div>
      </div>

      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </section>
  );
}
