import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './MagneticButton.css';

export default function MagneticButton({
  children,
  onClick,
  variant = 'primary',
  id,
  className = '',
}) {
  const btnRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const onMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.5,
        ease: 'power3.out',
      });
    };

    const onMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)',
      });
    };

    btn.addEventListener('mousemove', onMouseMove);
    btn.addEventListener('mouseleave', onMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', onMouseMove);
      btn.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      id={id}
      className={`mag-btn mag-btn--${variant} ${className}`}
      onClick={onClick}
      data-cursor-hover
    >
      <span className="mag-btn-inner">{children}</span>
    </button>
  );
}
