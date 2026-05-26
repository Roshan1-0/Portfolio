import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { TextScramble } from '../../utils/textScramble';
import './Loader.css';

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null);
  const counterRef = useRef(null);
  const scrambleRef = useRef(null);
  const barRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  // Ambient loader canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Concentric animated rings
      for (let i = 0; i < 4; i++) {
        const r = 80 + i * 60 + Math.sin(t + i * 0.8) * 12;
        const alpha = (0.06 - i * 0.012) * (0.7 + 0.3 * Math.sin(t * 2 + i));
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200,169,126,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Subtle arc
      ctx.beginPath();
      ctx.arc(cx, cy, 140 + Math.sin(t * 0.7) * 8, -Math.PI / 2, -Math.PI / 2 + t * 0.4);
      ctx.strokeStyle = `rgba(139,167,200,0.12)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Main loader sequence
  useEffect(() => {
    const tl = gsap.timeline();

    // Fade in
    tl.fromTo(loaderRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });

    // Text scramble sequence
    if (scrambleRef.current) {
      const scrambler = new TextScramble(scrambleRef.current);
      const phrases = ['ROSHAN_KUMAR', 'ROSHAN_KUMAR // initializing...', 'ROSHAN_KUMAR // ready'];
      let i = 0;
      const next = () => {
        if (i < phrases.length) {
          scrambler.setText(phrases[i]).then(() => {
            i++;
            if (i < phrases.length) setTimeout(next, 500);
          });
        }
      };
      setTimeout(next, 200);
    }

    // Counter + bar
    const obj = { val: 0 };
    tl.to(
      obj,
      {
        val: 100,
        duration: 3.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          const v = Math.round(obj.val);
          if (counterRef.current) counterRef.current.textContent = String(v).padStart(3, '0');
          if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
        },
      },
      0.3
    );

    // Exit: wipe upward
    tl.to(loaderRef.current, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1.0,
      ease: 'power4.inOut',
      delay: 0.6,
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    return () => tl.kill();
  }, []);

  return (
    <div ref={loaderRef} className="loader" style={{ clipPath: 'inset(0 0 0% 0)' }}>
      {/* Ambient canvas */}
      <canvas ref={canvasRef} className="loader-canvas" aria-hidden="true" />

      {/* Diagonal decorative lines */}
      <div className="loader-lines" aria-hidden="true">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="loader-diag-line" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>

      <div className="loader-content">
        <div className="loader-scramble-wrap">
          <span className="loader-label text-label">PORTFOLIO SYSTEM</span>
          <h1 ref={scrambleRef} className="loader-title" />
          <p className="loader-sub text-label">Full Stack Developer · CSE Student</p>
        </div>

        <div className="loader-bottom">
          <div className="loader-bar-wrap">
            <div className="loader-bar-track">
              <div ref={barRef} className="loader-bar-fill" />
            </div>
          </div>

          <div className="loader-counter-wrap">
            <span className="text-label loader-counter-label">Loading experience</span>
            <div className="loader-counter-right">
              <span ref={counterRef} className="loader-counter">000</span>
              <span className="loader-counter-pct text-label">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
