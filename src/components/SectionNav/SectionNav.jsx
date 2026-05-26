import { useState, useEffect } from 'react';
import './SectionNav.css';

const sections = [
  { id: 'hero', label: 'Intro' },
  { id: 'summary', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

export default function SectionNav() {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const observers = sections.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.4 }
      );

      observer.observe(el);
      return observer;
    });

    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="section-nav" aria-label="Section navigation">
      {sections.map(({ id, label }) => (
        <button
          key={id}
          className={`section-nav-item ${active === id ? 'section-nav-item--active' : ''}`}
          onClick={() => scrollTo(id)}
          aria-label={`Go to ${label}`}
          title={label}
        >
          <span className="section-nav-dot" />
          <span className="section-nav-label text-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
