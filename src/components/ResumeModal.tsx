import { useEffect } from 'react';
import { Download, Printer, X } from 'lucide-react';
import {
  ABOUT_CONTENT,
  EDUCATION_ITEM,
  EXPERIENCE_ITEMS,
  FEATURED_PROJECTS,
  PERSONAL_INFO,
  SKILL_CATEGORIES,
} from '../data/portfolio';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

function buildPlainTextResume(): string {
  const lines: string[] = [
    PERSONAL_INFO.name.toUpperCase(),
    PERSONAL_INFO.title,
    `${PERSONAL_INFO.location} | ${PERSONAL_INFO.email} | ${PERSONAL_INFO.phone}`,
    `GitHub: ${PERSONAL_INFO.github} | LinkedIn: ${PERSONAL_INFO.linkedin}`,
    '',
    'SUMMARY',
    ...ABOUT_CONTENT.paragraphs,
    '',
    'EDUCATION',
    `${EDUCATION_ITEM.degree} — ${EDUCATION_ITEM.institution} (${EDUCATION_ITEM.duration})`,
    EDUCATION_ITEM.location,
    '',
    'EXPERIENCE',
    ...EXPERIENCE_ITEMS.flatMap((exp) => [
      `${exp.role} | ${exp.organization} (${exp.duration})`,
      ...exp.responsibilities.map((r) => `  - ${r}`),
      '',
    ]),
    'PROJECTS',
    ...FEATURED_PROJECTS.flatMap((proj) => [
      `${proj.title} – ${proj.subtitle}`,
      proj.description,
      ...proj.features.map((f) => `  - ${f}`),
      `  Tech: ${proj.technologies.join(', ')}`,
      '',
    ]),
    'TECHNICAL SKILLS',
    ...SKILL_CATEGORIES.map((cat) => `${cat.title}: ${cat.items.join(', ')}`),
  ];
  return lines.join('\n');
}

export default function ResumeModal({ open, onClose }: ResumeModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleDownloadTxt = () => {
    const content = buildPlainTextResume();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Giribalan_R_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <h2 id="resume-modal-title" className="font-display text-lg font-semibold text-slate-950">
              Resume — {PERSONAL_INFO.name}
            </h2>
            <p className="text-xs text-slate-600">
              Print or save as PDF, or download a plain-text ATS copy.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 whitespace-nowrap transition-colors hover:border-slate-400 hover:bg-slate-100"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Download .TXT</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white whitespace-nowrap transition-colors hover:bg-blue-700"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close resume modal"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-200/70 hover:text-slate-950"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Resume Document Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-5">
            <h3 className="font-display text-2xl font-bold text-slate-950">
              {PERSONAL_INFO.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-blue-600">
              {PERSONAL_INFO.title}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
              <span>{PERSONAL_INFO.location}</span>
              <span aria-hidden="true">·</span>
              <span>{PERSONAL_INFO.email}</span>
              <span aria-hidden="true">·</span>
              <span>{PERSONAL_INFO.phone}</span>
            </div>
          </div>

          <section>
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Profile
            </h4>
            <p className="mt-2 text-slate-700">{ABOUT_CONTENT.paragraphs[0]}</p>
            <p className="mt-2 text-slate-700">{ABOUT_CONTENT.paragraphs[1]}</p>
          </section>

          <section>
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Experience
            </h4>
            <div className="mt-3 space-y-4">
              {EXPERIENCE_ITEMS.map((exp) => (
                <div key={exp.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold text-slate-950">
                      {exp.role} — <span className="text-slate-600 font-normal">{exp.organization}</span>
                    </p>
                    <span className="font-mono text-xs text-slate-500 tabular-nums">
                      {exp.duration}
                    </span>
                  </div>
                  <ul className="mt-1.5 list-disc space-y-1 pl-5 text-xs text-slate-600">
                    {exp.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Projects
            </h4>
            <div className="mt-3 space-y-4">
              {FEATURED_PROJECTS.map((proj) => (
                <div key={proj.id}>
                  <p className="font-semibold text-slate-950">
                    {proj.title} – {proj.subtitle}
                  </p>
                  <p className="mt-1 text-xs text-slate-700">{proj.description}</p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-5 text-xs text-slate-600">
                    {proj.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Education
            </h4>
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold text-slate-950">
                {EDUCATION_ITEM.degree}
              </p>
              <span className="font-mono text-xs text-slate-500 tabular-nums">
                {EDUCATION_ITEM.duration}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {EDUCATION_ITEM.institution}, {EDUCATION_ITEM.location}
            </p>
          </section>

          <section>
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Technical Skills
            </h4>
            <div className="mt-2 space-y-1.5 text-xs">
              {SKILL_CATEGORIES.map((cat) => (
                <p key={cat.id} className="text-slate-700">
                  <span className="font-semibold text-slate-950">{cat.title}:</span>{' '}
                  {cat.items.join(', ')}
                </p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
