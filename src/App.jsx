import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Styles
import './styles/index.css';

// Global systems
import { initLenis } from './animations/lenis';
import Cursor from './components/Cursor/Cursor';
import Grain from './components/Grain/Grain';
import Background from './components/Background/Background';
import Loader from './components/Loader/Loader';
import Navbar from './components/Navbar/Navbar';
import ScrollProgress from './components/ScrollProgress/ScrollProgress';
import SectionNav from './components/SectionNav/SectionNav';

// Sections
import Hero from './components/Hero/Hero';
import Cards from './components/Cards/Cards';
import Summary from './sections/Summary/Summary';
import Skills from './sections/Skills/Skills';
import Projects from './sections/Projects/Projects';
import Journey from './sections/Journey/Journey';
import Contact from './sections/Contact/Contact';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Init Lenis after load
    if (loaded) {
      const lenis = initLenis();
      return () => lenis.destroy();
    }
  }, [loaded]);

  const handleLoaderComplete = () => {
    setLoaded(true);
    document.body.style.overflow = 'auto';
  };

  // Lock scroll during load
  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <>
      {/* Global atmospheric background */}
      <Background />

      {/* Film grain overlay */}
      <Grain />

      {/* Custom cursor */}
      <Cursor />

      {/* Loader */}
      <AnimatePresence>
        {!loaded && (
          <Loader onComplete={handleLoaderComplete} />
        )}
      </AnimatePresence>

      {/* Scroll progress */}
      {loaded && <ScrollProgress />}

      {/* Section nav */}
      {loaded && <SectionNav />}

      {/* Main content */}
      <div className="app-wrapper" style={{ position: 'relative', zIndex: 10 }}>
        <Navbar loaded={loaded} />

        <main id="main-content">
          <Hero loaded={loaded} />
          <Cards />
          <Summary />
          <Skills />
          <Projects />
          <Journey />
          <Contact />
        </main>
      </div>
    </>
  );
}
