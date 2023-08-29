import { useEffect } from 'react';

export function useResetEditor(): { add: (cb: () => void) => void; dispatch: () => void } {
  const ev = new CustomEvent('resetCode');

  function add(cb: () => void) {
    useEffect(() => {
      const fnc = () => {
        cb();
      };
      window.addEventListener('resetCode', fnc);
      return () => window.removeEventListener('resetCode', fnc);
    }, []);
  }

  function dispatch() {
    window.dispatchEvent(ev);
  }
  return { add, dispatch };
}
