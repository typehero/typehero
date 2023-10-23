'use client';

import { useEffect, useRef } from 'react';

export function Ghost() {
  const ghostRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const ghost = document.getElementById('cursorthing') as HTMLDivElement;
    ghostRef.current = ghost;

    let mouseX = 0;
    let mouseY = 0;

    let ghostX = 0;
    let ghostY = 0;

    const speed = 0.05;

    function animate() {
      const distX = mouseX - ghostX - ghost.clientWidth / 2;
      const distY = mouseY - ghostY - ghost.clientHeight / 2;

      ghost.style.transform = `skew(${Math.min(Math.max(-distX * 0.1, -50), 50)}deg)`;

      ghost.style.scale = `1 ${Math.min(Math.max(1 - distY / 250, 0.5), 1.5)}`;

      ghost.style.filter = `blur(${Math.min(
        Math.max(Math.abs(distX / 30) + Math.abs(distY / 30), 0),
        2,
      )}px)`;

      ghostX = ghostX + distX * speed;
      ghostY = ghostY + distY * speed;

      ghost.style.left = `${ghostX}px`;
      ghost.style.top = `${ghostY}px`;

      requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
  }, []);
  return (
    <svg
      id="cursorthing"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none fixed z-50 h-16 w-16 overflow-hidden fill-current opacity-50 blur-[1px] duration-75"
      style={{ verticalAlign: 'middle', transition: 'transform 0.2s ease' }}
      viewBox="0 0 1024 1024"
      version="1.1"
    >
      <path d="M500.2 0.18C290.02 6.48 128 189.84 128 400.1v527.84c0 28.52 34.46 42.78 54.62 22.62l49.84-37.06c13.32-9.9 32-7.98 43.02 4.42l85.9 96.7c12.5 12.5 32.76 12.5 45.26 0l81.44-91.7c12.74-14.34 35.12-14.34 47.84 0l81.44 91.7c12.5 12.5 32.76 12.5 45.26 0l85.9-96.7c11.02-12.4 29.7-14.34 43.02-4.42l49.84 37.06c20.16 20.16 54.62 5.88 54.62-22.62V384C896 168 717.66-6.34 500.2 0.18zM384 448c-35.34 0-64-28.66-64-64s28.66-64 64-64 64 28.66 64 64-28.66 64-64 64z m256 0c-35.34 0-64-28.66-64-64s28.66-64 64-64 64 28.66 64 64-28.66 64-64 64z" />
    </svg>
  );
}
