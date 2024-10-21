"use client"
import { useRef } from "react"

export default function Snowfall() {
  // Initial Setup
  const canvasRef = useRef()
  if (canvasRef.current) {
    const canvas = canvasRef.current
    const c = canvas.getContext('2d')

    canvas.width = innerWidth
    canvas.height = innerHeight

    // Variables
    const attributes = {
      particleCount: 400,   // Change amount of snowflakes
      particleSize: 3,      // Max size of a snowflake
      fallingSpeed: 1,      // Intensity of the snowfall horizontal
      colors: ['#ccc', '#eee', '#fff', '#ddd'] // Array of usable colors
    }

    const mouse = {
      x: innerWidth / 2,
      y: innerHeight / 2
    }


    // Event Listeners
    addEventListener('mousemove', event => {
      mouse.x = event.clientX
      mouse.y = event.clientY
    })

    addEventListener('resize', () => {
      canvas.width = innerWidth
      canvas.height = innerHeight
      init()
    })

    // Utility Functions
    function randomIntFromRange(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function randomColor(colors) {
      return colors[Math.floor(Math.random() * colors.length)]
    }

    function distance(x1, y1, x2, y2) {
      const xDist = x2 - x1
      const yDist = y2 - y1

      return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
    }

    // Objects
    function Particle(x, y, radius, color, radians) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.radians = radians;
      this.velocity = 0.005;

      this.update = () => {
        // Move these points over time
        this.radians += this.velocity;
        this.x = x + Math.cos(this.radians) * 400;
        this.y = y + Math.tan(this.radians) * 600;

        this.draw();
      }

      this.draw = () => {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()

        c.closePath()
      }
    }

    // Implementation
    let particles;
    function init() {
      particles = [];

      for (let i = 0; i < attributes.particleCount; i++) {
        particles.push(
          new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            randomIntFromRange(0.5, attributes.particleSize),
            randomColor(attributes.colors),
            Math.random() * 80
          )
        );
      }
      console.log(particles);
    }

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate)
      c.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.update();
      });
    }

    init()
    animate()
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}