import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { journey } from '../../data/portfolio';
import './Journey.css';

gsap.registerPlugin(ScrollTrigger);

const typeColors = {
  education: '#c8a97e',
  milestone: '#8ba7c8',
  achievement: '#7ec8a9',
  project: '#9b8ac8',
  present: '#c87e8a',
};

export default function Journey() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo(
        '.journey-header',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );

      // Timeline line draw
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: '.journey-timeline',
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="journey" className="journey section">
      <div className="container">
        <div className="journey-header">
          <span className="text-label journey-chapter">Chapter 04 / How I Grew</span>
          <h2 className="journey-title text-heading">
            Education &<br />
            <span className="journey-title-accent">Journey</span>
          </h2>
        </div>

        <div className="journey-timeline">
          {/* Animated line */}
          <div className="journey-line-wrap">
            <div ref={lineRef} className="journey-line" />
          </div>

          {/* Items */}
          <div className="journey-items">
            {journey.map((item, i) => (
              <motion.div
                key={i}
                className={`journey-item journey-item--${item.type}`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Dot */}
                <div
                  className="journey-dot"
                  style={{ background: typeColors[item.type] }}
                />

                {/* Content */}
                <div className="journey-content">
                  <div className="journey-content-top">
                    <span
                      className="journey-year text-mono"
                      style={{ color: typeColors[item.type] }}
                    >
                      {item.year}
                    </span>
                    <span className="text-label journey-type">{item.type}</span>
                  </div>

                  <h3 className="journey-item-title">{item.title}</h3>
                  <p className="journey-item-desc">{item.description}</p>

                  <div className="journey-tags">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="journey-tag text-label"
                        style={{
                          borderColor: `${typeColors[item.type]}40`,
                          color: typeColors[item.type],
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="journey-divider" />
      </div>
    </section>
  );
}
