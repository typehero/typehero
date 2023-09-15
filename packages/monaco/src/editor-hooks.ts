import { useEffect, useCallback } from 'react';

class EditorEvents extends EventTarget {
  dispatch(ev: string) {
    this.dispatchEvent(new CustomEvent(ev));
  }
}

const event = new EditorEvents();
type EventNames = 'resetCode';
export function useResetEditor(): {
  subscribe: (eventName: EventNames, cb: () => void) => void;
  dispatch: (eventName: EventNames) => void;
} {
  function subscribe(eventName: EventNames, cb: () => void) {
    // Memoize the callback to avoid stale closures
    const memoizedCb = useCallback(() => {
      cb();
    }, [cb]);

    useEffect(() => {
      const fnc = () => {
        memoizedCb();
      };
      event.addEventListener(eventName, fnc);
      return () => event.removeEventListener(eventName, fnc);
    }, [memoizedCb]);
  }

  function dispatch(eventName: EventNames) {
    event.dispatch(eventName);
  }
  return { subscribe, dispatch };
}
