import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { certifications } from '../../data/portfolio';
import './Certifications.css';

gsap.registerPlugin(ScrollTrigger);

function CertificationCard({ cert, index }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = x / rect.width;
    const yPct = y / rect.height;
    const rotX = (yPct - 0.5) * 10;
    const rotY = (xPct - 0.5) * -10;

    gsap.to(cardRef.current, {
      rotateX: rotX,
      rotateY: rotY,
      duration: 0.4,
      ease: 'power2.out',
    });

    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, ${cert.color}22, transparent 65%)`;
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
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
      className="cert-card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      data-cursor-hover
      style={{ '--cert-color': cert.color }}
    >
      <div ref={glowRef} className="cert-card-glow" />

      <div className="cert-card-inner">
        {/* Top meta */}
        <div className="cert-card-top">
          <div className="cert-issuer-badge">
            <span className="cert-icon" style={{ color: cert.color }}>
              {cert.icon}
            </span>
            <span className="text-label cert-issuer">{cert.issuer}</span>
          </div>
          <span className="cert-badge-tag text-label" style={{ color: cert.color }}>
            {cert.badge}
          </span>
        </div>

        {/* Title area */}
        <div className="cert-title-wrap">
          <h3 className="cert-title">{cert.title}</h3>
          <span className="text-label cert-date">{cert.date}</span>
        </div>

        {/* Description */}
        <p className="cert-description">{cert.description}</p>

        {/* Skills */}
        <div className="cert-skills">
          {cert.skills.map((skill) => (
            <span key={skill} className="cert-skill-tag text-label">
              {skill}
            </span>
          ))}
        </div>

        {/* Action Link */}
        <div className="cert-footer">
          <a
            href={cert.credentialUrl}
            className="cert-link text-label"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ color: cert.color }}
          >
            Verify Credential ↗
          </a>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="cert-card-accent" style={{ background: cert.color }} />
    </motion.div>
  );
}

export default function Certifications() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.certs-header',
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
    <section ref={sectionRef} id="certifications" className="certifications section">
      <div className="container">
        <div className="certs-header">
          <span className="text-label certs-chapter">Accreditation / Verified Credentials</span>
          <h2 className="certs-title text-heading">
            Certifications &<br />
            <span className="certs-title-accent">Credentials</span>
          </h2>
          <p className="certs-subtitle">
            Industry-recognized credentials validating specialized proficiency in Artificial Intelligence, Cloud Infrastructure, and Advanced Algorithms.
          </p>
        </div>

        {/* Grid */}
        <div className="certs-grid">
          {certifications.map((cert, i) => (
            <CertificationCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>

        <div className="certs-divider" />
      </div>
    </section>
  );
}
