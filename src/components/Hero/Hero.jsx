import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { personal } from '../../data/portfolio';
import { useMousePosition } from '../../hooks/useMousePosition';
import MagneticButton from '../MagneticButton/MagneticButton';
import './Hero.css';

export default function Hero({ loaded }) {
  const sectionRef = useRef(null);
  const roleRef = useRef(null);
  const headlineRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollRef = useRef(null);
  const lineRef = useRef(null);
  const spotlightRef = useRef(null);
  const mouse = useMousePosition();

  // Mouse spotlight reactive effect
  useEffect(() => {
    if (!spotlightRef.current) return;
    const el = spotlightRef.current;
    el.style.background = `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, rgba(200,169,126,0.07), transparent 50%)`;
  }, [mouse]);

  useEffect(() => {
    if (!loaded) return;

    const tl = gsap.timeline({ delay: 0.2 });

    // Decorative line
    tl.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: 'power4.inOut' }
    );

    // Role label
    tl.fromTo(
      roleRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
      '-=0.5'
    );

    // Name words — clip-path reveal
    const nameWords = sectionRef.current.querySelectorAll('.hero-name-word');
    tl.fromTo(
      nameWords,
      { y: '110%' },
      {
        y: '0%',
        duration: 1.3,
        stagger: 0.12,
        ease: 'power4.out',
      },
      '-=0.4'
    );

    // Headline fade
    tl.fromTo(
      headlineRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      '-=0.7'
    );

    // CTA
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    );

    // Scroll indicator
    tl.fromTo(
      scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 },
      '-=0.3'
    );
  }, [loaded]);

  const nameParts = personal.name.split(' ');

  return (
    <section ref={sectionRef} className="hero" id="hero" aria-label="Hero">
      {/* Mouse-reactive spotlight */}
      <div ref={spotlightRef} className="hero-spotlight" aria-hidden="true" />

      {/* Large atmospheric number in background */}
      <div className="hero-bg-text" aria-hidden="true">
        <span>01</span>
      </div>

      <div className="hero-content container">
        {/* Top line */}
        <div className="hero-line-wrap">
          <div ref={lineRef} className="hero-line" />
        </div>

        {/* Role label */}
        <p ref={roleRef} className="hero-role">
          <span className="text-label hero-role-main">{personal.role}</span>
          <span className="hero-role-sep" />
          <span className="text-label hero-role-status">
            <span className="hero-avail-dot" />
            Available for opportunities
          </span>
        </p>

        {/* Main name */}
        <h1 className="hero-name-wrap" aria-label={personal.name}>
          {nameParts.map((word, i) => (
            <div key={i} className="hero-name-overflow">
              <span className={`hero-name-word hero-name-word--${i}`}>
                {word}
              </span>
            </div>
          ))}
        </h1>

        {/* Tagline */}
        <div className="hero-tagline-row" ref={headlineRef}>
          <div className="hero-tagline-line" />
          <p className="hero-headline">
            {personal.headline}
          </p>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="hero-cta">
          <MagneticButton
            id="hero-cta-projects"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            variant="primary"
          >
            View Projects
          </MagneticButton>

          <MagneticButton
            id="hero-cta-contact"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            variant="ghost"
          >
            Let's Talk
          </MagneticButton>

          <a
            id="hero-cta-resume"
            href={personal.resume}
            className="hero-resume-link text-label"
            target="_blank"
            rel="noopener noreferrer"
          >
            ↓ Resume
          </a>
        </div>

        {/* Meta row */}
        <div className="hero-meta">
          {['CSE Student', 'Full Stack Developer', 'Problem Solver'].map((tag, i) => (
            <span key={tag} className="hero-meta-tag text-label">
              {i > 0 && <span className="hero-meta-sep">·</span>}
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="hero-scroll" aria-hidden="true">
        <div className="hero-scroll-track">
          <motion.div
            className="hero-scroll-dot"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-label">Scroll</span>
      </div>

      {/* Side info */}
      <div className="hero-side-info">
        <a
          href={personal.github}
          className="hero-side-link text-label"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href={personal.linkedin}
          className="hero-side-link text-label"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>

      {/* Bottom fade gradient */}
      <div className="hero-bottom-fade" aria-hidden="true" />
    </section>
  );
}
