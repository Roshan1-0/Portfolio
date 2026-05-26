import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { skills } from '../../data/portfolio';
import './Skills.css';

gsap.registerPlugin(ScrollTrigger);

function SkillBubble({ skill, isActive, onClick, index }) {
  const positions = [
    { top: '15%', left: '15%' },
    { top: '15%', right: '15%' },
    { bottom: '20%', left: '15%' },
    { bottom: '20%', right: '15%' },
  ];
  const pos = positions[index % 4];

  return (
    <motion.div
      className={`skill-bubble ${isActive ? 'skill-bubble--active' : ''}`}
      style={{
        ...pos,
        '--bubble-color': skill.color,
        '--bubble-color-dim': skill.colorDim,
      }}
      onClick={() => onClick(skill.id)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      animate={isActive ? { scale: 1.08 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      data-cursor-hover
    >
      <div className="skill-bubble-inner">
        <span className="skill-bubble-icon">{skill.icon}</span>
        <span className="skill-bubble-title">{skill.title}</span>
        <span className="text-label skill-bubble-count">
          {skill.children.length} skills
        </span>
      </div>
      <div className="skill-bubble-glow" />
    </motion.div>
  );
}

function SkillChildren({ skill }) {
  return (
    <motion.div
      className="skill-children"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="skill-children-header">
        <span
          className="skill-children-icon"
          style={{ color: skill.color }}
        >
          {skill.icon}
        </span>
        <div>
          <h3 className="skill-children-title">{skill.title}</h3>
          <p className="skill-children-desc">{skill.description}</p>
        </div>
      </div>

      <div className="skill-children-list">
        {skill.children.map((child, i) => (
          <motion.div
            key={child.name}
            className="skill-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <div className="skill-item-top">
              <span className="skill-item-name">{child.name}</span>
              <span className="skill-item-level text-label">{child.level}%</span>
            </div>
            <div className="skill-item-bar">
              <motion.div
                className="skill-item-fill"
                style={{ background: skill.color }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: child.level / 100 }}
                transition={{
                  delay: i * 0.06 + 0.2,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);
  const [activeSkill, setActiveSkill] = useState(null);

  const handleBubbleClick = (id) => {
    setActiveSkill((prev) => (prev === id ? null : id));
  };

  const activeData = skills.find((s) => s.id === activeSkill);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.skills-header',
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
    <section ref={sectionRef} id="skills" className="skills section">
      <div className="container">
        <div className="skills-header">
          <span className="text-label skills-chapter">Chapter 02 / How I Think</span>
          <h2 className="skills-title text-heading">
            Skills &<br />
            <span className="skills-title-accent">Technologies</span>
          </h2>
          <p className="skills-subtitle">
            Click a domain to explore the technologies within it.
          </p>
        </div>

        <div className="skills-arena">
          {/* Bubble field */}
          <div className="skills-bubbles-wrap">
            <div className="skills-bubbles">
              {skills.map((skill, i) => (
                <SkillBubble
                  key={skill.id}
                  skill={skill}
                  index={i}
                  isActive={activeSkill === skill.id}
                  onClick={handleBubbleClick}
                />
              ))}

              {/* Center text */}
              <div className="skills-center">
                <span className="text-label skills-center-hint">
                  {activeSkill ? 'Tap to collapse' : 'Select a domain'}
                </span>
              </div>
            </div>
          </div>

          {/* Detail panel */}
          <div className="skills-detail">
            <AnimatePresence mode="wait">
              {activeData ? (
                <SkillChildren key={activeData.id} skill={activeData} />
              ) : (
                <motion.div
                  key="placeholder"
                  className="skills-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="skills-placeholder-text">
                    Select a skill domain on the left to explore its technologies in detail.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="skills-divider" />
      </div>
    </section>
  );
}
