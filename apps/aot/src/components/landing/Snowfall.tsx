'use client';
import { useEffect, useRef } from 'react';

interface ParticleAttributes {
  x: number;
  y: number;
  radius: number;
  color: string;
  radians: number;
  velocity: number;
  shadowColor: string;
  shadowBlur: number;
  update: () => void;
  draw: () => void;
}

export default function Snowfall() {
  // Initial Setup
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const c = canvas.getContext('2d');

      canvas.width = innerWidth;
      canvas.height = innerHeight;

      // Variables
      const attributes = {
        particleCount: 400, // Change amount of snowflakes
        particleSize: 3, // Max size of a snowflake
        fallingSpeed: 1, // Intensity of the snowfall horizontal
        colors: ['#ccc', '#eee', '#fff', '#ddd'], // Array of usable colors
      };

      const mouse = {
        x: innerWidth / 2,
        y: innerHeight / 2,
      };

      // Event Listeners
      addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
      });

      addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
      });

      // Utility Functions
      const randomIntFromRange = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
      };

      const randomColor = (colors: string[]) => {
        return colors[Math.floor(Math.random() * colors.length)];
      };

      const distance = (x1: number, y1: number, x2: number, y2: number) => {
        const xDist = x2 - x1;
        const yDist = y2 - y1;

        return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
      };

      // Objects
      // eslint-disable-next-line no-inner-declarations
      function Particle(
        this: ParticleAttributes,
        x: number,
        y: number,
        radius: number,
        color: string,
        radians: number,
      ) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.radians = radians;
        this.velocity = 0.005;
        this.shadowColor = 'transparent';
        this.shadowBlur = 0;

        this.update = () => {
          // Move these points over time
          this.radians += this.velocity;
          this.x = x + Math.cos(this.radians) * 400;
          this.y = y + Math.tan(this.radians) * 600;

          if (distance(mouse.x, mouse.y, this.x, this.y) < 200) {
            this.color = '#fc6';
            this.shadowColor = '#fc6';
            this.shadowBlur = 10;
            // make it move away from the mouse
            // this.x += (this.x - mouse.x) * 0.05
            // this.y += (this.y - mouse.y) * 0.01
          } else {
            this.color = color;
            this.shadowColor = 'transparent';
            this.shadowBlur = 0;
          }

          this.draw();
        };

        this.draw = () => {
          if (!c) return;

          c.beginPath();
          c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
          c.shadowColor = this.shadowColor;
          c.shadowBlur = this.shadowBlur;
          c.fillStyle = this.color;
          c.fill();

          c.closePath();
        };
      }

      // Implementation
      let particles: ParticleAttributes[];
      const init = () => {
        particles = [];

        for (let i = 0; i < attributes.particleCount; i++) {
          particles.push(
            // @ts-expect-error -- This is being used approximately like a class.
            new Particle(
              Math.random() * canvas.width,
              Math.random() * canvas.height,
              randomIntFromRange(0.5, attributes.particleSize),
              randomColor(attributes.colors)!,
              Math.random() * 80,
            ),
          );
        }
      };

      // Animation Loop
      const animate = () => {
        requestAnimationFrame(animate);
        if (!c) return;
        c.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle: { update: () => void }) => {
          particle.update();
        });
      };

      init();
      animate();
    }

    return () => {
      removeEventListener('mousemove', () => {});
      removeEventListener('resize', () => {});
    };
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-0 h-full w-full motion-reduce:hidden">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
