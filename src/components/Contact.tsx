import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  AtSign,
  Check,
  Copy,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolio';
import { SplitHeadline } from './MotionText';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedMailto, setSubmittedMailto] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      setErrorMsg('Please complete all fields before preparing your email.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const bodyLines = [
      `Name: ${trimmedName}`,
      `Email: ${trimmedEmail}`,
      '',
      trimmedMessage,
    ].join('\n');

    const mailtoHref = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(
      trimmedSubject
    )}&body=${encodeURIComponent(bodyLines)}`;

    setSubmittedMailto(mailtoHref);
    window.location.href = mailtoHref;
  };

  return (
    <section id="contact" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16"
        >
          {/* Left Column: Direct Channels */}
          <div className="lg:col-span-5">
            <p className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.12em] text-blue-600">
              <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>CONTACT</span>
            </p>
            <SplitHeadline
              as="h2"
              text="Have a Project in Mind? Let's Build Something."
              interactiveLetters
              className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl [text-wrap:balance]"
            />
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              I&apos;m always interested in connecting with developers, recruiters, and teams working on meaningful technology.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white/95 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="flex min-w-0 items-center gap-3 text-sm font-medium text-slate-900 transition-colors hover:text-blue-600"
                >
                  <Mail className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                  <span className="truncate">{PERSONAL_INFO.email}</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                  className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={PERSONAL_INFO.phoneHref}
                className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white/95 p-4 text-sm font-medium text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-slate-300 hover:text-blue-600"
              >
                <Phone className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                <span className="tabular-nums">{PERSONAL_INFO.phone}</span>
              </a>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white/95 p-4 text-sm text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <MapPin className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                <span>{PERSONAL_INFO.location}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-xs transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                <span>GitHub</span>
              </a>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-xs transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form with Honest mailto Fallback */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 shadow-[0_1px_4px_rgba(15,23,42,0.05)]"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-slate-600"
                  >
                    <User className="h-3.5 w-3.5 text-blue-600 shrink-0" aria-hidden="true" />
                    <span>Name</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-slate-600"
                  >
                    <AtSign className="h-3.5 w-3.5 text-blue-600 shrink-0" aria-hidden="true" />
                    <span>Email</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="contact-subject"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-slate-600"
                >
                  <FileText className="h-3.5 w-3.5 text-blue-600 shrink-0" aria-hidden="true" />
                  <span>Subject</span>
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Software engineering opportunity or project inquiry"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="contact-message"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-slate-600"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-blue-600 shrink-0" aria-hidden="true" />
                  <span>Message</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details about your role, team, or project..."
                  className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              {errorMsg && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-700"
                >
                  {errorMsg}
                </p>
              )}

              {submittedMailto && (
                <div
                  role="status"
                  className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-slate-700"
                >
                  <p>
                    Your default email client was triggered with a pre-filled draft to{' '}
                    <span className="font-semibold text-slate-950">{PERSONAL_INFO.email}</span>.
                  </p>
                  <a
                    href={submittedMailto}
                    className="mt-1.5 inline-block font-semibold text-blue-600 underline hover:text-blue-800"
                  >
                    Click here if your email app did not open automatically
                  </a>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Prepares a pre-filled draft directly in your default email app.
                </p>
                <motion.button
                  type="submit"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  <span>Open Email Draft</span>
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
