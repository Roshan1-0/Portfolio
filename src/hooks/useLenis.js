import { useEffect, useRef } from 'react';
import { getLenis } from '../animations/lenis';

export function useLenis(callback) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis || !callbackRef.current) return;

    lenis.on('scroll', callbackRef.current);
    return () => {
      lenis.off('scroll', callbackRef.current);
    };
  }, []);
}
