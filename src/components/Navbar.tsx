import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import {
  Briefcase,
  Cpu,
  FolderGit2,
  Home,
  Mail,
  Menu,
  MessageSquare,
  User,
  X,
} from 'lucide-react';
import { NAV_LINKS, PERSONAL_INFO } from '../data/portfolio';
import { KineticScrambleText } from './MotionText';

const NAV_ICONS: Record<string, typeof Home> = {
  home: Home,
  about: User,
  skills: Cpu,
  projects: FolderGit2,
  experience: Briefcase,
  contact: Mail,
};

export default function Navbar() {
  const [activeId, setActiveId] = useState<string>('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    restDelta: 0.001,
  });

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => el !== null
    );

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.1, 0.3, 0.6],
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string, id: string) => {
    setActiveId(id);
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="no-print sticky top-0 z-50 border-b border-slate-200/80 bg-[#f8fafc]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home', 'home');
          }}
          className="font-display text-base font-bold tracking-[0.06em] text-slate-900 whitespace-nowrap shrink-0 transition-colors hover:text-blue-600"
        >
          <KineticScrambleText text={PERSONAL_INFO.brand} scrambleOnMount={false} />
        </a>

        {/* Zone 2: Desktop Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            const Icon = NAV_ICONS[link.id] ?? Home;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href, link.id);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`relative inline-flex items-center gap-1.5 py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  isActive
                    ? 'text-slate-950'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 shrink-0 ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                  aria-hidden="true"
                />
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    aria-hidden="true"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-blue-600"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact', 'contact');
            }}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-blue-700"
          >
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Let&apos;s Talk</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 md:hidden transition-colors hover:border-slate-300"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav-menu"
            aria-label="Mobile Navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-slate-200 bg-white px-4 py-4 md:hidden"
          >
            <div className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeId === link.id;
                const Icon = NAV_ICONS[link.id] ?? Home;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href, link.id);
                    }}
                    className={`flex min-h-[44px] items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-slate-950'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? 'text-blue-600' : 'text-slate-400'
                        }`}
                        aria-hidden="true"
                      />
                      <span>{link.label}</span>
                    </span>
                    {isActive && (
                      <span className="text-xs font-mono text-blue-600">Active</span>
                    )}
                  </a>
                );
              })}
              <div className="pt-2">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('#contact', 'contact');
                  }}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  <span>Let&apos;s Talk</span>
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Hairline Scroll Progress Bar */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX }}
        className="h-[2px] w-full origin-left bg-blue-600"
      />
    </header>
  );
}
