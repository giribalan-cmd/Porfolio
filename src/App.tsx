import { MotionConfig } from 'motion/react';
import BackgroundMotion from './components/BackgroundMotion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollMarquee from './components/ScrollMarquee';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#f8fafc] text-slate-900">
        <BackgroundMotion />

        <div className="relative z-10">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
          >
            Skip to main content
          </a>

          <Navbar />

          <main id="main-content">
            <Hero />
            <ScrollMarquee />
            <About />
            <Skills />
            <ScrollMarquee
              reverse
              items={[
                'Marine AI',
                'ParkSpot',
                'Leaflet & OpenStreetMap',
                'Django & Node.js',
                'JWT Authentication',
                'Data Visualization',
              ]}
            />
            <Projects />
            <Experience />
            <Education />
            <Contact />
          </main>

          <Footer />
        </div>
      </div>
    </MotionConfig>
  );
}
