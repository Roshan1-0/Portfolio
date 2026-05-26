import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Cursor.css';

export default function Cursor() {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  useEffect(() => {
    if (isMobile) return;

    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.08,
        ease: 'none',
      });
    };

    const animate = () => {
      curX = lerp(curX, mouseX, 0.08);
      curY = lerp(curY, mouseY, 0.08);
      gsap.set(cursor, { x: curX, y: curY });
      requestAnimationFrame(animate);
    };

    const onMouseEnterLink = () => {
      gsap.to(cursor, { scale: 2.5, opacity: 0.6, duration: 0.4, ease: 'power2.out' });
      gsap.to(dot, { scale: 0, duration: 0.3 });
    };

    const onMouseLeaveLink = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    const onMouseDown = () => {
      gsap.to(cursor, { scale: 0.85, duration: 0.15 });
    };

    const onMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
    };

    const setupLinks = () => {
      const links = document.querySelectorAll('a, button, [data-cursor-hover]');
      links.forEach((link) => {
        link.addEventListener('mouseenter', onMouseEnterLink);
        link.addEventListener('mouseleave', onMouseLeaveLink);
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const observer = new MutationObserver(setupLinks);
    observer.observe(document.body, { childList: true, subtree: true });
    setupLinks();
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      observer.disconnect();
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      <div ref={cursorRef} className="cursor-ring" />
      <div ref={cursorDotRef} className="cursor-dot" />
    </>
  );
}
