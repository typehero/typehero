import { useEffect } from 'react';

class EditorEvents extends EventTarget {
  dispatch(ev: string) {
    this.dispatchEvent(new CustomEvent(ev));
  }
}

const event = new EditorEvents();
type EventNames = 'resetCode';
export function useResetEditor(deps: unknown[] = []): {
  subscribe: (eventName: EventNames, cb: () => void) => void;
  dispatch: (eventName: EventNames) => void;
} {
  function subscribe(eventName: EventNames, cb: () => void) {
    useEffect(() => {
      const fnc = () => {
        cb();
      };
      event.addEventListener(eventName, fnc);
      return () => event.removeEventListener(eventName, fnc);
    }, [...deps]);
  }

  function dispatch(eventName: EventNames) {
    event.dispatch(eventName);
  }
  return { subscribe, dispatch };
}
