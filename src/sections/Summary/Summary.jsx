import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { personal } from '../../data/portfolio';
import './Summary.css';

gsap.registerPlugin(ScrollTrigger);

export default function Summary() {
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const [active, setActive] = useState(0);

  const philosophyWords = personal.philosophy.split(' ');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section reveal
      gsap.fromTo(
        headRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );

      // Bio paragraphs stagger
      gsap.fromTo(
        '.summary-bio-para',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.summary-bio',
            start: 'top 80%',
          },
        }
      );

      // Philosophy reveal word by word
      gsap.fromTo(
        '.summary-philo-word',
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.summary-philosophy',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="summary" className="summary section">
      <div className="container">
        {/* Header */}
        <div ref={headRef} className="summary-header">
          <span className="text-label summary-chapter">Chapter 01 / Who I Am</span>
          <h2 className="summary-title text-heading">
            Professional <br />
            <span className="summary-title-accent">Summary</span>
          </h2>
        </div>

        <div className="summary-grid">
          {/* Bio */}
          <div className="summary-bio">
            {personal.bio.map((para, i) => (
              <p key={i} className="summary-bio-para">
                {para}
              </p>
            ))}

            {/* Objective */}
            <div className="summary-objective">
              <span className="text-label">Objective</span>
              <p className="summary-objective-text">{personal.objective}</p>
            </div>
          </div>

          {/* Right — Philosophy + Stats */}
          <div className="summary-aside">
            {/* Philosophy quote */}
            <div className="summary-philosophy">
              <span className="text-label summary-philosophy-label">Philosophy</span>
              <blockquote className="summary-philosophy-quote">
                <span className="summary-philosophy-mark">"</span>
{philosophyWords.map((word, i) => (
  <span key={i} className="summary-philo-word">
    {word}&nbsp;
  </span>
))}
                <span className="summary-philosophy-mark">"</span>
              </blockquote>
            </div>

            {/* Mini stats */}
            <div className="summary-stats">
              {[
                { label: 'Projects', value: '4+' },
                { label: 'Languages', value: '6+' },
                { label: 'Frameworks', value: '8+' },
                { label: 'Focus', value: 'Full Stack' },
              ].map((stat) => (
                <div key={stat.label} className="summary-stat">
                  <span className="summary-stat-value">{stat.value}</span>
                  <span className="text-label summary-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="summary-divider" />
      </div>
    </section>
  );
}
