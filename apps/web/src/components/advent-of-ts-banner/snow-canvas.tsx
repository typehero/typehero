'use client';

import { useEffect, useRef } from 'react';

const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 900;

export function SnowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestAnimationRef = useRef<number | null>(null);

  let particles: Particle[] = [];

  function createParticles(count: number) {
    if (count !== particles.length) {
      particles = Array.from({ length: count }, () => new Particle(CANVAS_HEIGHT, CANVAS_WIDTH));
    }
  }

  // good
  function updateParticles() {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#f6f9fa';

    particles.forEach(function (particle) {
      particle.y += particle.dy;
      particle.x += particle.dx;

      if (particle.y > CANVAS_HEIGHT) {
        particle.y = 0;
      }

      if (particle.x > CANVAS_WIDTH) {
        particle.reset();
        particle.y = 0;
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2, false);
      ctx.fill();
    });

    requestAnimationRef.current = requestAnimationFrame(updateParticles);
  }

  useEffect(() => {
    requestAnimationRef.current = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(requestAnimationRef.current!);
  }, []); // Make sure the effect runs only once

  useEffect(() => {
    function onResize() {
      if (canvasRef.current) {
        canvasRef.current.width = CANVAS_WIDTH;
        canvasRef.current.height = CANVAS_HEIGHT;
      }
      createParticles((CANVAS_WIDTH * CANVAS_HEIGHT) / 10000);
    }

    onResize();
    updateParticles();
    window.addEventListener('resize', onResize);

    // cleanup function, remove event listener
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      id="snow"
      className="pointer-events-none z-20"
      ref={canvasRef}
      height={500}
      width="1000"
    />
  );
}

class Particle {
  height = 0;
  width = 0;
  x: number;
  y: number;
  dx: number;
  dy: number;

  constructor(height: number, width: number) {
    this.x = this.y = this.dx = this.dy = 0;
    this.height = height;
    this.width = width;
    this.reset();
  }

  reset() {
    this.y = Math.random() * this.height;
    this.x = Math.random() * this.width;
    this.dx = Math.random() * 1 - 0.5;
    this.dy = Math.random() * 0.5 + 0.5;
  }
}
