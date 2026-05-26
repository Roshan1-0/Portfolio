import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { personal } from '../../data/portfolio';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-header',
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

      gsap.fromTo(
        '.contact-form-field',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1500));
    setStatus('sent');
  };

  return (
    <section ref={sectionRef} id="contact" className="contact section">
      <div className="container">
        {/* Atmospheric glow */}
        <div className="contact-glow" />

        <div className="contact-header">
          <span className="text-label contact-chapter">Chapter 05 / What Comes Next</span>
          <h2 className="contact-title text-heading">
            Let's build something
            <br />
            <span className="contact-title-accent">meaningful.</span>
          </h2>
          <p className="contact-subtitle">
            I'm open to full-time roles, freelance work, and meaningful collaborations.
            <br />
            Don't hesitate to reach out — I respond thoughtfully.
          </p>
        </div>

        <div className="contact-layout">
          {/* Left — Form */}
          <div className="contact-form-wrap">
            {status === 'sent' ? (
              <motion.div
                className="contact-success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="contact-success-icon">✓</span>
                <h3 className="contact-success-title">Message sent.</h3>
                <p className="contact-success-text">
                  Thank you for reaching out. I'll get back to you soon.
                </p>
              </motion.div>
            ) : (
              <form
                className="contact-form"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="contact-form-field">
                  <label htmlFor="contact-name" className="text-label contact-label">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    className="contact-input"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="contact-form-field">
                  <label htmlFor="contact-email" className="text-label contact-label">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    className="contact-input"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="contact-form-field">
                  <label htmlFor="contact-message" className="text-label contact-label">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className="contact-input contact-textarea"
                    placeholder="Tell me about your project or opportunity..."
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  id="contact-submit"
                  className="contact-submit"
                  disabled={status === 'sending'}
                >
                  <span className="contact-submit-text">
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </span>
                  <span className="contact-submit-arrow">→</span>
                </button>
              </form>
            )}
          </div>

          {/* Right — Info */}
          <div className="contact-info">
            <div className="contact-info-item">
              <span className="text-label contact-info-label">Email</span>
              <a
                href={`mailto:${personal.email}`}
                className="contact-info-value"
              >
                {personal.email}
              </a>
            </div>

            <div className="contact-info-item">
              <span className="text-label contact-info-label">GitHub</span>
              <a
                href={personal.github}
                className="contact-info-value"
                target="_blank"
                rel="noopener noreferrer"
              >
                Roshan1-0 ↗
              </a>
            </div>

            <div className="contact-info-item">
              <span className="text-label contact-info-label">LinkedIn</span>
              <a
                href={personal.linkedin}
                className="contact-info-value"
                target="_blank"
                rel="noopener noreferrer"
              >
                in/roshan-kumar ↗
              </a>
            </div>

            {/* Availability */}
            <div className="contact-availability">
              <span className="contact-avail-dot" />
              <span className="text-label contact-avail-text">
                Available for opportunities
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="contact-footer">
          <div className="contact-footer-top">
            <span className="contact-footer-name text-mono">
              [ ROSHAN_KUMAR ]
            </span>
            <span className="text-label contact-footer-year">
              © {new Date().getFullYear()}
            </span>
          </div>
          <p className="contact-footer-note text-label">
            Built with intention — React, Vite, GSAP, Framer Motion, WebGL
          </p>
        </footer>
      </div>
    </section>
  );
}
