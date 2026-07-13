// js/hero-bg.js
export function initHeroBackground() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrame;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 1;
      
      // Giảm tốc độ chuyển động
      this.speedX = Math.random() * 0.5 - 0.125;
      this.speedY = Math.random() * 0.5 - 0.125;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce khi chạm biên
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.fillStyle = 'rgba(122, 0, 230, 0.85)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 140) {
          ctx.strokeStyle = `rgba(89, 0, 179, ${1 - distance / 140})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    connectParticles();
    animationFrame = requestAnimationFrame(animate);
  }

  function init() {
    resizeCanvas();
    
    // Giảm số lượng particle trên mobile để mượt hơn
    const particleCount = window.innerWidth < 768 ? 60 : 90;
    particles = Array.from({ length: particleCount }, () => new Particle());
    
    animate();
  }

  // Resize handler
  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationFrame);
    init();
  });

  init();
}