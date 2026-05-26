import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { personal } from '../../data/portfolio';
import './Navbar.css';

const navItems = [
  { label: 'About', id: 'summary' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Journey', id: 'journey' },
  { label: 'Contact', id: 'contact' },
];

export default function Navbar({ loaded }) {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out' }
    );
  }, [loaded]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
        aria-label="Main navigation"
      >
        <div className="navbar-inner">
          {/* Logo */}
          <button
            className="navbar-logo text-mono"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Go to top"
          >
            <span className="navbar-logo-bracket">[</span>
            {personal.initials}
            <span className="navbar-logo-bracket">]</span>
          </button>

          {/* Desktop links */}
          <div className="navbar-links" role="list">
            {navItems.map((item) => (
              <button
                key={item.id}
                className="navbar-link text-label"
                onClick={() => scrollTo(item.id)}
                role="listitem"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop resume + mobile toggle */}
          <div className="navbar-right">
            <a
              href={personal.resume}
              className="navbar-resume text-label"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume ↗
            </a>

            {/* Hamburger */}
            <button
              className={`navbar-hamburger ${mobileOpen ? 'navbar-hamburger--open' : ''}`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              <span className="navbar-hamburger-line" />
              <span className="navbar-hamburger-line" />
              <span className="navbar-hamburger-line" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mobile-menu-inner">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  className="mobile-menu-item"
                  onClick={() => scrollTo(item.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <span className="mobile-menu-num text-label">0{i + 1}</span>
                  <span className="mobile-menu-label">{item.label}</span>
                  <span className="mobile-menu-arrow">→</span>
                </motion.button>
              ))}

              <motion.a
                href={personal.resume}
                className="mobile-menu-resume text-label"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                Download Resume ↗
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
