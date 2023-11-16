'use client';
import React, { useEffect, useRef } from 'react';
import './advent-of-ts-banner.css';

const AdventofTSBanner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let width = 0;
  let height = 0;

  // Intially 0 particles
  let particles: Particle[] = [];

  class Particle {
    x: number;
    y: number;
    dx: number;
    dy: number;

    constructor() {
      this.x = this.y = this.dx = this.dy = 0;
      this.reset();
    }

    reset() {
      this.y = Math.random() * height;
      this.x = Math.random() * width;
      this.dx = Math.random() * 1 - 0.5;
      this.dy = Math.random() * 0.5 + 0.5;
    }
  }

  function createParticles(count: number) {
    if (count !== particles.length) {
      particles = Array.from({ length: count }, () => new Particle());
    }
  }

  // good
  function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }
    createParticles((width * height) / 10000);
  }

  function updateParticles() {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f6f9fa';

    particles.forEach(function (particle) {
      particle.y += particle.dy;
      particle.x += particle.dx;

      if (particle.y > height) {
        particle.y = 0;
      }

      if (particle.x > width) {
        particle.reset();
        particle.y = 0;
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2, false);
      ctx.fill();
    });

    window.requestAnimationFrame(updateParticles);
  }

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        console.log('canvy is ready, uwu');
        // Make snow after the canvas is ready
        console.log('ayo particles before resize?', particles);

        onResize();
        console.log('ayo particles after resize?', particles);

        updateParticles(ctx);
        window.addEventListener('resize', onResize);

        // cleanup function, remove event listener
        return () => {
          window.removeEventListener('resize', onResize);
        };
      }
    }
  }, []);

  return (
    <div className="content relative rounded-3xl">
      <canvas id="snow" className="snow" ref={canvasRef}></canvas>
      <div className="flex flex-col p-10">
        <h1 className="text-8xl font-bold text-[#37455d]">Advent of TypeScript</h1>
        <h2 className="mb-8 text-4xl text-[#37455d] underline">Twelve Days of Typescript</h2>
        <div>
          <button className="candy-cane relative flex items-center gap-1 bg-[#4476C0] px-8 py-4 text-2xl text-white transition duration-700 ease-in-out hover:scale-110 hover:shadow-[0_0_2rem_-0.5rem_#4476C0]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <g fill="none" fill-rule="evenodd">
                <path d="M24 0v24H0V0h24ZM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018Zm.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01l-.184-.092Z" />
                <path
                  fill="currentColor"
                  d="M12.23 3a7.23 7.23 0 0 1 7.21 6.676l.544 7.073A3 3 0 1 1 15 19l-9 .001a3 3 0 0 1-1-5.83v-2.94A7.23 7.23 0 0 1 12.23 3ZM18 18a1 1 0 1 0 0 2a1 1 0 0 0 0-2Zm-2.72-3H6a1 1 0 0 0-.117 1.993L6 17h9.764l.135-.141l-.62-1.859Z"
                />
              </g>
            </svg>
            <span className="relative z-10">Get Started</span>
          </button>
        </div>
      </div>
      <div className="ground absolute bottom-0 h-[160px] w-full bg-[#f6f9fa]">
        <div className="mound pointer-events-none">
          <div className="mound_text flex translate-y-[-180px] rotate-6 items-center justify-center">
            <svg
              width="300"
              height="300"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="38" height="38" rx="4.5" fill="#4476C0" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M15.6947 20.9344H20V18H8V20.9344H12.2842V34H15.6947V20.9344Z"
                fill="white"
              />
              <path
                d="M22 34V18H25.4511V24.6309H30.5405V18H34V34H30.5405V27.3458H25.4511V34H22Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="mound_spade absolute right-[50%] top-[42%] z-0 mr-[-250px] block block h-[30px] w-[35px] rotate-45 bg-[#4476C0]"></div>
        </div>
      </div>
    </div>
  );
};

export default AdventofTSBanner;
