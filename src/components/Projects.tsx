import { useRef, useState, type MouseEvent } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import {
  CheckCircle2,
  Code2,
  Cpu,
  Eye,
  FolderGit2,
  Layers,
  ListChecks,
} from 'lucide-react';
import { FEATURED_PROJECTS, type ProjectItem } from '../data/portfolio';
import { SplitHeadline } from './MotionText';

interface ProjectCardProps {
  project: ProjectItem;
}

function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [activeTab, setActiveTab] = useState<'preview' | 'architecture'>('preview');
  const [imageError, setImageError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const imageParallaxY = useTransform(scrollYProgress, [0, 1], [-16, 16]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-y * 4.5).toFixed(2)),
      ry: Number((x * 4.5).toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="rounded-xl border border-slate-200/90 bg-white/95 p-5 sm:p-7 lg:p-8 shadow-[0_1px_4px_rgba(15,23,42,0.05)]"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
        {/* Left/Top Large Visual Preview Area */}
        <div className="flex flex-col lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <span className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.1em] text-blue-600">
              <FolderGit2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>PROJECT {project.index}</span>
            </span>

            {/* Interactive View Switcher */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`relative inline-flex min-h-[32px] items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'preview' ? 'text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {activeTab === 'preview' && (
                  <motion.span
                    layoutId={`project-tab-${project.id}`}
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-md bg-blue-600"
                  />
                )}
                <Eye className="relative z-10 h-3.5 w-3.5" aria-hidden="true" />
                <span className="relative z-10">Visual Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('architecture')}
                className={`relative inline-flex min-h-[32px] items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'architecture'
                    ? 'text-white'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {activeTab === 'architecture' && (
                  <motion.span
                    layoutId={`project-tab-${project.id}`}
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-md bg-blue-600"
                  />
                )}
                <Cpu className="relative z-10 h-3.5 w-3.5" aria-hidden="true" />
                <span className="relative z-10">Architecture Notes</span>
              </button>
            </div>
          </div>

          <div className="group relative flex-1 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 aspect-[16/9]">
            <AnimatePresence mode="wait">
              {activeTab === 'preview' ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full w-full"
                >
                  {imageError ? (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-50 p-8 text-center">
                      <Layers className="h-8 w-8 text-blue-600" aria-hidden="true" />
                      <p className="mt-3 font-display text-lg font-semibold text-slate-900">
                        {project.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">{project.subtitle}</p>
                    </div>
                  ) : (
                    <>
                      <motion.div
                        style={prefersReducedMotion ? undefined : { y: imageParallaxY, scale: 1.06 }}
                        className="h-full w-full will-change-transform"
                      >
                        <img
                          src={project.image}
                          alt={project.imageAlt}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={() => setImageError(true)}
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                      </motion.div>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent px-4 py-3">
                        <p className="text-xs font-medium text-slate-100">
                          {project.statusNote}
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="architecture"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-full w-full flex-col justify-between bg-slate-50 p-6 sm:p-8"
                >
                  <div>
                    <h4 className="font-display text-base font-semibold text-slate-950">
                      System Design &amp; Implementation Highlights
                    </h4>
                    <ul className="mt-4 space-y-3">
                      {project.architectureNotes.map((note) => (
                        <li
                          key={note}
                          className="flex items-start gap-3 text-sm leading-relaxed text-slate-700"
                        >
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-blue-600"
                            aria-hidden="true"
                          />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-600">
                    {project.statusNote}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Project Details */}
        <div className="flex flex-col justify-between lg:col-span-5">
          <div>
            <h3 className="font-display text-2xl font-bold text-slate-950 sm:text-3xl">
              {project.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-blue-600">{project.subtitle}</p>

            <p className="mt-4 text-sm leading-[1.7] text-slate-600 sm:text-base">
              {project.description}
            </p>

            <div className="mt-5">
              <h4 className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                <ListChecks className="h-3.5 w-3.5 text-blue-600 shrink-0" aria-hidden="true" />
                <span>Key Features</span>
              </h4>
              <ul className="mt-3 space-y-2.5">
                {project.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700"
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-blue-600"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Technology Stack (Unboxed Metadata with Typographic Separators) */}
          <div className="mt-6 border-t border-slate-200/80 pt-5">
            <h4 className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              <Code2 className="h-3.5 w-3.5 text-blue-600 shrink-0" aria-hidden="true" />
              <span>Technology Stack</span>
            </h4>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm font-medium text-slate-800">
              {project.technologies.map((tech, idx) => (
                <span key={tech} className="inline-flex items-center gap-2.5">
                  <span>{tech}</span>
                  {idx < project.technologies.length - 1 && (
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="border-b border-slate-200/80 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.12em] text-blue-600">
            <FolderGit2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>FEATURED WORK</span>
          </p>
          <SplitHeadline
            as="h2"
            text="Selected Engineering Projects."
            interactiveLetters
            className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl [text-wrap:balance]"
          />
          <p className="mt-4 text-base text-slate-600">
            Full-stack and data-driven applications built with modern frontend frameworks, RESTful APIs, and structured client-server architecture.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
