import { useState, useEffect } from 'react';

export function useKeyPress() {
  const [keyPresses, setKeyPresses] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeyPresses((prevKeyPresses) => prevKeyPresses + event.key);
    };

    const handleKeyUp = () => {
      setKeyPresses('');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return Array.from(new Set(keyPresses)).join('');
}
