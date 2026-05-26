import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../../data/portfolio';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const categories = ['All', 'Full Stack', 'AI / ML', 'Frontend', 'Cloud'];

function ProjectCard({ project, index, onClick }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = x / rect.width;
    const yPct = y / rect.height;
    const rotX = (yPct - 0.5) * 12;
    const rotY = (xPct - 0.5) * -12;

    gsap.to(cardRef.current, {
      rotateX: rotX,
      rotateY: rotY,
      duration: 0.4,
      ease: 'power2.out',
    });

    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, ${project.color}20, transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
    if (glowRef.current) {
      glowRef.current.style.background = 'none';
    }
  };

  return (
    <motion.div
      className="proj-card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(project)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      data-cursor-hover
      style={{ '--project-color': project.color }}
    >
      <div ref={glowRef} className="proj-card-glow" />

      <div className="proj-card-inner">
        {/* Status badge */}
        <div className="proj-card-top">
          <span
            className="proj-status text-label"
            style={{ color: project.color }}
          >
            ● {project.status}
          </span>
          <span className="proj-year text-label">{project.year}</span>
        </div>

        {/* Title area */}
        <div className="proj-title-wrap">
          <h3 className="proj-title">{project.title}</h3>
          <p className="proj-tagline">{project.tagline}</p>
        </div>

        {/* Description */}
        <p className="proj-description">{project.description}</p>

        {/* Tech stack */}
        <div className="proj-tech">
          {project.tech.map((t) => (
            <span key={t} className="proj-tech-tag text-label">
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="proj-links">
          <a
            href={project.github}
            className="proj-link text-label"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            GitHub ↗
          </a>
          {project.live && (
            <a
              href={project.live}
              className="proj-link proj-link--live text-label"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: project.color }}
            >
              Live Demo ↗
            </a>
          )}
          <button className="proj-link proj-link--detail text-label" onClick={() => onClick(project)}>
            Case Study →
          </button>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="proj-card-accent"
        style={{ background: project.color }}
      />
    </motion.div>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <motion.div
      className="proj-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="proj-modal"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="proj-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="proj-modal-header" style={{ '--project-color': project.color }}>
          <div className="proj-modal-meta">
            <span className="text-label" style={{ color: project.color }}>
              ● {project.status}
            </span>
            <span className="text-label proj-year">{project.year} · {project.category}</span>
          </div>
          <h2 className="proj-modal-title">{project.title}</h2>
          <p className="proj-modal-tagline">{project.tagline}</p>
        </div>

        <div className="proj-modal-body">
          <div className="proj-modal-section">
            <span className="text-label proj-modal-section-label">Overview</span>
            <p>{project.description}</p>
          </div>

          <div className="proj-modal-section">
            <span className="text-label proj-modal-section-label">Architecture</span>
            <p>{project.architecture}</p>
          </div>

          <div className="proj-modal-section">
            <span className="text-label proj-modal-section-label">Challenges</span>
            <p>{project.challenges}</p>
          </div>

          <div className="proj-modal-section">
            <span className="text-label proj-modal-section-label">Tech Stack</span>
            <div className="proj-tech">
              {project.tech.map((t) => (
                <span key={t} className="proj-tech-tag text-label" style={{ borderColor: `${project.color}40`, color: project.color }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="proj-modal-links">
            <a href={project.github} className="mag-btn mag-btn--ghost text-label" target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            {project.live && (
              <a href={project.live} className="mag-btn text-label" style={{ background: project.color, color: '#080808' }} target="_blank" rel="noopener noreferrer">
                Live Demo ↗
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = filter === 'All'
    ? projects
    : projects.filter((p) => p.category === filter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.projects-header',
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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="projects section">
      <div className="container">
        <div className="projects-header">
          <span className="text-label projects-chapter">Chapter 03 / What I Build</span>
          <h2 className="projects-title text-heading">
            Selected <br />
            <span className="projects-title-accent">Projects</span>
          </h2>
        </div>

        {/* Filter */}
        <div className="projects-filter" role="tablist" aria-label="Project categories">
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={filter === cat}
              className={`projects-filter-btn text-label ${filter === cat ? 'projects-filter-btn--active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="projects-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onClick={setSelected}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Modal */}
        <AnimatePresence>
          {selected && (
            <ProjectModal
              project={selected}
              onClose={() => setSelected(null)}
            />
          )}
        </AnimatePresence>

        <div className="projects-divider" />
      </div>
    </section>
  );
}
