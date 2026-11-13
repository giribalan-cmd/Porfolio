import { Github, Linkedin, Mail } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolio';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="no-print border-t border-slate-200/80 bg-white/80 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-sm font-bold tracking-[0.06em] text-slate-950">
            {PERSONAL_INFO.brand}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {PERSONAL_INFO.title}
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-950"
          >
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            <span>GitHub</span>
          </a>
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-950"
          >
            <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
            <span>LinkedIn</span>
          </a>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-950"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Email</span>
          </a>
        </div>

        <p className="text-xs text-slate-500 tabular-nums">
          &copy; {currentYear} {PERSONAL_INFO.name} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
