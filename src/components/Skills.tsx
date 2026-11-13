import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Bot,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  Layers,
  Layout,
  Server,
  Terminal,
} from 'lucide-react';
import { SKILL_CATEGORIES, type SkillCategory } from '../data/portfolio';
import { SplitHeadline } from './MotionText';

type FilterGroup = 'all' | SkillCategory['group'];

const FILTER_OPTIONS: Array<{ id: FilterGroup; label: string }> = [
  { id: 'all', label: 'All Capabilities' },
  { id: 'languages', label: 'Languages' },
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'infrastructure', label: 'DevOps & Tools' },
  { id: 'engineering', label: 'Engineering & AI' },
];

const CATEGORY_ICONS: Record<string, typeof Code2> = {
  'programming-languages': Code2,
  frontend: Layout,
  backend: Server,
  databases: Database,
  'devops-tools': Terminal,
  'software-engineering': Cpu,
  'ai-assisted-dev': Bot,
};

export default function Skills() {
  const [activeFilter, setActiveFilter] = useState<FilterGroup>('all');

  const visibleCategories =
    activeFilter === 'all'
      ? SKILL_CATEGORIES
      : SKILL_CATEGORIES.filter((cat) => cat.group === activeFilter);

  return (
    <section id="skills" className="border-b border-slate-200/80 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header & Functional Filter Bar */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.12em] text-blue-600">
              <Layers className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>TECHNICAL STACK</span>
            </p>
            <SplitHeadline
              as="h2"
              text="Technical Skills & Engineering Foundations."
              interactiveLetters
              className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl [text-wrap:balance]"
            />
          </div>

          <div
            role="tablist"
            aria-label="Filter technical skills by category"
            className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-white/90 p-1 shadow-xs"
          >
            {FILTER_OPTIONS.map((opt) => {
              const selected = activeFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveFilter(opt.id)}
                  className={`relative min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                    selected ? 'text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="skills-filter-active"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-md bg-blue-600"
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categorized Architectural Grid */}
        <motion.div
          layout
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visibleCategories.map((category, idx) => {
              const Icon = CATEGORY_ICONS[category.id] ?? Code2;
              const isWide =
                activeFilter === 'all' &&
                (category.id === 'software-engineering' || category.id === 'devops-tools');

              return (
                <motion.article
                  layout
                  key={category.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: 0.28,
                    delay: Math.min(idx * 0.03, 0.16),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -3 }}
                  className={`group rounded-xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-colors duration-200 hover:border-blue-500/40 ${
                    isWide ? 'md:col-span-2 lg:col-span-2' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 pb-4">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-slate-950">
                        {category.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">{category.subtitle}</p>
                    </div>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-blue-600 transition-transform duration-200 group-hover:scale-105 group-hover:border-blue-500/40">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </div>

                  <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {category.items.map((skill) => (
                      <motion.li
                        key={skill}
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.12 }}
                        className="flex items-center gap-2 rounded-md border border-slate-200/70 bg-slate-50/80 px-3 py-2 text-sm text-slate-700 transition-colors duration-150 hover:border-blue-500/35 hover:bg-blue-50/40 hover:text-slate-950"
                      >
                        <ChevronRight
                          className="h-3.5 w-3.5 shrink-0 text-blue-600/70"
                          aria-hidden="true"
                        />
                        <span>{skill}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
