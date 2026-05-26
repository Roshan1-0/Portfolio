// GSAP animation helpers and presets
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

// ── Reveal from below
export function revealFromBelow(target, options = {}) {
  return gsap.fromTo(
    target,
    { y: 60, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    {
      y: 0,
      opacity: 1,
      clipPath: 'inset(0 0 0% 0)',
      duration: options.duration || 1.2,
      delay: options.delay || 0,
      ease: 'power4.out',
      ...options,
    }
  );
}

// ── Stagger reveal for multiple elements
export function staggerReveal(targets, options = {}) {
  return gsap.fromTo(
    targets,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: options.duration || 1,
      stagger: options.stagger || 0.12,
      delay: options.delay || 0,
      ease: 'power3.out',
      ...options,
    }
  );
}

// ── Cinematic text reveal (character by character)
export function cinematicReveal(target, options = {}) {
  return gsap.fromTo(
    target,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: options.duration || 1.4,
      delay: options.delay || 0,
      ease: 'expo.out',
      ...options,
    }
  );
}

// ── ScrollTrigger reveal for sections
export function scrollReveal(target, options = {}) {
  return gsap.fromTo(
    target,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: options.duration || 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: options.trigger || target,
        start: options.start || 'top 85%',
        end: options.end || 'bottom 15%',
        toggleActions: 'play none none none',
        ...options.scrollTrigger,
      },
    }
  );
}

// ── Magnetic button effect
export function magneticEffect(element, strength = 0.4) {
  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration: 0.6,
      ease: 'power3.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
}

export { gsap, ScrollTrigger, Flip };
