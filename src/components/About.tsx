import { motion } from 'motion/react';
import {
  BookOpen,
  Calendar,
  Compass,
  ExternalLink,
  FileCode2,
  GraduationCap,
  MapPin,
  User,
} from 'lucide-react';
import { ABOUT_CONTENT, PERSONAL_INFO } from '../data/portfolio';
import { SplitHeadline } from './MotionText';

export default function About() {
  const profileIcons = [BookOpen, GraduationCap, Calendar, MapPin];

  return (
    <section id="about" className="border-b border-slate-200/80 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16"
        >
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.12em] text-blue-600">
              <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>ABOUT ME</span>
            </p>
            <SplitHeadline
              as="h2"
              text={ABOUT_CONTENT.heading}
              interactiveLetters
              className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl [text-wrap:balance]"
            />

            <div className="mt-7 space-y-5 text-base leading-[1.75] text-slate-600">
              {ABOUT_CONTENT.paragraphs.map((paragraph, idx) => (
                <motion.p
                  key={paragraph.slice(0, 24)}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 'some' }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Focus Areas as Clean Typographic Index */}
            <div className="mt-9 border-t border-slate-200/80 pt-7">
              <h3 className="inline-flex items-center gap-2 font-display text-sm font-semibold text-slate-900">
                <Compass className="h-4 w-4 text-blue-600 shrink-0" aria-hidden="true" />
                <span>Primary Areas of Interest</span>
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600">
                {ABOUT_CONTENT.interests.map((interest, idx) => (
                  <span key={interest} className="inline-flex items-center gap-3">
                    <span className="text-slate-700">{interest}</span>
                    {idx < ABOUT_CONTENT.interests.length - 1 && (
                      <span aria-hidden="true" className="text-slate-300">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Technical Profile Panel */}
          <div className="lg:col-span-5">
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-colors hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 pb-5">
                <div>
                  <h3 className="font-display text-lg font-semibold text-slate-950">
                    Technical Profile
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {PERSONAL_INFO.name} — {PERSONAL_INFO.title}
                  </p>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600">
                  <FileCode2 className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>

              <dl className="divide-y divide-slate-200/70">
                {ABOUT_CONTENT.profilePanel.map((row, idx) => {
                  const Icon = profileIcons[idx] ?? BookOpen;
                  return (
                    <div
                      key={row.label}
                      className="flex items-start justify-between gap-4 py-4"
                    >
                      <dt className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.06em] text-slate-500">
                        <Icon className="h-4 w-4 text-blue-600 shrink-0" aria-hidden="true" />
                        <span>{row.label}</span>
                      </dt>
                      <dd className="text-right text-sm font-medium text-slate-900 tabular-nums">
                        {row.value}
                      </dd>
                    </div>
                  );
                })}
              </dl>

              <div className="mt-6 border-t border-slate-200/80 pt-6">
                <a
                  href={PERSONAL_INFO.existingPortfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full min-h-[44px] items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:border-blue-500/40 hover:bg-blue-50/50"
                >
                  <span>Previous Portfolio Archive</span>
                  <ExternalLink className="h-4 w-4 text-blue-600 shrink-0" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
