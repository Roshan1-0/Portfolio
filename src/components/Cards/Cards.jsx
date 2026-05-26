import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Cards.css';

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  {
    id: 'summary',
    number: '01',
    chapter: 'Who I Am',
    title: 'Professional Summary',
    summary: 'A CSE student who builds with intention. Engineering precision meets creative thinking.',
    meta: 'Roshan Kumar · Full Stack Developer',
    color: '#c8a97e',
  },
  {
    id: 'skills',
    number: '02',
    chapter: 'How I Think',
    title: 'Skills & Technologies',
    summary: 'Web, Networks, Core CS, and algorithmic problem solving — a layered technical foundation.',
    meta: 'React · Node.js · Python · DSA',
    color: '#8ba7c8',
  },
  {
    id: 'projects',
    number: '03',
    chapter: 'What I Build',
    title: 'Selected Projects',
    summary: 'Four engineering case studies — from AI ad intelligence to real-time collaboration platforms.',
    meta: 'Harmony · ArciADV · RoshPort',
    color: '#9b8ac8',
  },
  {
    id: 'journey',
    number: '04',
    chapter: 'How I Grew',
    title: 'Education & Journey',
    summary: 'From first principles to production-ready code — a timeline of learning and building.',
    meta: '2024 → Present',
    color: '#7ec8a9',
  },
  {
    id: 'contact',
    number: '05',
    chapter: 'What Comes Next',
    title: 'Contact & Collaboration',
    summary: "Let's build something meaningful together. Open to full-time roles and collaborations.",
    meta: 'Open to opportunities',
    color: '#c87ea9',
  },
];

function ChapterCard({ card, index, onNavigate }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = x / rect.width;
    const yPct = y / rect.height;
    const rotX = (yPct - 0.5) * 8;
    const rotY = (xPct - 0.5) * -8;

    gsap.to(cardRef.current, {
      rotateX: rotX,
      rotateY: rotY,
      duration: 0.5,
      ease: 'power2.out',
    });

    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, ${card.color}18, transparent 60%)`;
      glowRef.current.style.opacity = '1';
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.5)',
    });
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="chapter-card"
      style={{ '--card-color': card.color }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onNavigate(card.id)}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      data-cursor-hover
    >
      {/* Spotlight glow */}
      <div ref={glowRef} className="chapter-card-glow" />

      {/* Floating idle animation */}
      <div
        className="chapter-card-float"
        style={{ animationDelay: `${index * 0.4}s` }}
      >
        <div className="chapter-card-inner">
          {/* Top row */}
          <div className="chapter-card-top">
            <span className="chapter-card-num text-mono" style={{ color: card.color }}>
              {card.number}
            </span>
            <span className="chapter-card-chapter text-label">{card.chapter}</span>
          </div>

          {/* Title */}
          <div className="chapter-card-title-wrap">
            <h3 className="chapter-card-title">{card.title}</h3>

            <AnimatePresence>
              {hovered && (
                <motion.p
                  className="chapter-card-summary"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: '0.75rem' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {card.summary}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom meta */}
          <div className="chapter-card-bottom">
            <span className="text-label chapter-card-meta">{card.meta}</span>
            <motion.span
              className="chapter-card-arrow"
              animate={hovered ? { x: 4, opacity: 1 } : { x: 0, opacity: 0.4 }}
              transition={{ duration: 0.3 }}
            >
              →
            </motion.span>
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="chapter-card-bar" style={{ background: card.color }} />
    </motion.div>
  );
}

export default function Cards() {
  const sectionRef = useRef(null);

  const handleNavigate = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cards-intro-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.cards-intro-label',
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="cards-section">
      <div className="container">
        {/* Intro bridge */}
        <div className="cards-intro">
          <div className="cards-intro-line" />
          <p className="cards-intro-label text-label">
            Five chapters · One narrative
          </p>
        </div>

        {/* Card grid */}
        <div className="cards-grid">
          {chapters.map((card, i) => (
            <ChapterCard
              key={card.id}
              card={card}
              index={i}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
