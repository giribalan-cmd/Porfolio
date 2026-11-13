import { motion } from 'motion/react';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';
import { EDUCATION_ITEM } from '../data/portfolio';
import { SplitHeadline } from './MotionText';

export default function Education() {
  return (
    <section id="education" className="border-b border-slate-200/80 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.12em] text-blue-600">
            <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>EDUCATION</span>
          </p>
          <SplitHeadline
            as="h2"
            text="Academic Foundation."
            interactiveLetters
            className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl [text-wrap:balance]"
          />
        </div>

        <motion.article
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -3 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 rounded-xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-colors hover:border-blue-500/40"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600">
                <GraduationCap className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-slate-950">
                  {EDUCATION_ITEM.degree}
                </h3>
                <p className="mt-1 text-base font-medium text-slate-700">
                  {EDUCATION_ITEM.institution}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600 sm:text-right">
              <span className="inline-flex items-center gap-2 font-mono text-xs tabular-nums">
                <Calendar className="h-4 w-4 text-blue-600 shrink-0" aria-hidden="true" />
                <span>{EDUCATION_ITEM.duration}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0" aria-hidden="true" />
                <span>{EDUCATION_ITEM.location}</span>
              </span>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
