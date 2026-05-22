import { useEffect } from 'react';

export function useClickOutside(ref, handler) {
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) handler(e); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [ref, handler]);
}
