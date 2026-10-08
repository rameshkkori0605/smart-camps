/**
 * SMART CAMPUS - Space Cursor & Background Starfield Particle Effect
 * Creates a reactive lighting cursor and cosmic particle atmosphere.
 */

export function initSpaceCursor() {
  const lightOrb = document.getElementById('cursor-light');
  const lightDot = document.getElementById('cursor-dot');
  const canvas = document.getElementById('space-canvas');

  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Track cursor coordinates
  let mouseX = width / 2;
  let mouseY = height / 2;
  let targetX = mouseX;
  let targetY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Cosmic Particles
  const PARTICLE_COUNT = 60;
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.7 + 0.2;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.01;

      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }

    draw() {
      ctx.fillStyle = `rgba(6, 182, 212, ${Math.max(0, Math.min(1, this.alpha))})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // Render Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Smooth cursor follow interpolation
    targetX += (mouseX - targetX) * 0.15;
    targetY += (mouseY - targetY) * 0.15;

    if (lightOrb) {
      lightOrb.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    }
    if (lightDot) {
      lightDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }

    // Draw space starfield particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw subtle connecting lines near cursor
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      const dist = Math.hypot(p1.x - mouseX, p1.y - mouseY);
      if (dist < 120) {
        ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - dist / 120) * 0.25})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}
