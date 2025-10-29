// animations.js - Taoist cultivation theme visuals and micro-interactions
// Respects prefers-reduced-motion

(function() {
  'use strict';
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    console.log('Reduced motion preferred - skipping animations');
    return;
  }

  // Create canvas for background effects
  function createBackgroundCanvas() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.6';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    return { canvas, ctx };
  }

  // Particle system for qi/star particles
  class Particle {
    constructor(canvas) {
      this.canvas = canvas;
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.life = Math.random() * 200 + 100;
      this.maxLife = this.life;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life--;
      
      // Fade in/out
      const lifeRatio = this.life / this.maxLife;
      if (lifeRatio < 0.2) {
        this.opacity = lifeRatio * 5 * (Math.random() * 0.5 + 0.2);
      } else if (lifeRatio > 0.8) {
        this.opacity = (1 - lifeRatio) * 5 * (Math.random() * 0.5 + 0.2);
      }
      
      // Wrap around edges
      if (this.x < 0) this.x = this.canvas.width;
      if (this.x > this.canvas.width) this.x = 0;
      if (this.y < 0) this.y = this.canvas.height;
      if (this.y > this.canvas.height) this.y = 0;
      
      if (this.life <= 0) {
        this.reset();
      }
    }
    
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(94, 234, 212, ${this.opacity})`;
      ctx.fill();
      
      // Add glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity * 0.3})`;
      ctx.fill();
    }
  }

  // Floating lantern
  class Lantern {
    constructor(canvas) {
      this.canvas = canvas;
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * this.canvas.width;
      this.y = this.canvas.height + 50;
      this.targetY = Math.random() * -200 - 100;
      this.speed = Math.random() * 0.3 + 0.2;
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      this.size = Math.random() * 15 + 10;
      this.color = Math.random() > 0.5 ? 'rgba(249, 115, 22, 0.7)' : 'rgba(236, 72, 153, 0.7)';
    }
    
    update() {
      this.y -= this.speed;
      this.sway += this.swaySpeed;
      
      if (this.y < this.targetY) {
        this.reset();
      }
    }
    
    draw(ctx) {
      const swayOffset = Math.sin(this.sway) * 20;
      const x = this.x + swayOffset;
      
      // Lantern glow
      const gradient = ctx.createRadialGradient(x, this.y, 0, x, this.y, this.size * 2);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - this.size * 2, this.y - this.size * 2, this.size * 4, this.size * 4);
      
      // Lantern body
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(x, this.y, this.size * 0.6, this.size, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Lantern string
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, this.y - this.size);
      ctx.lineTo(x, this.y - this.size - 20);
      ctx.stroke();
    }
  }

  // Mist layer
  class MistLayer {
    constructor(canvas, speed, opacity) {
      this.canvas = canvas;
      this.speed = speed;
      this.opacity = opacity;
      this.offset = 0;
    }
    
    update() {
      this.offset += this.speed;
      if (this.offset > 100) this.offset = 0;
    }
    
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      
      for (let i = 0; i < 3; i++) {
        const x = (i * this.canvas.width / 2 + this.offset * 10) % (this.canvas.width + 200) - 100;
        const y = this.canvas.height * 0.6 + Math.sin(this.offset * 0.1 + i) * 30;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 200);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.1)');
        gradient.addColorStop(0.5, 'rgba(20, 184, 166, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x - 200, y - 200, 400, 400);
      }
      
      ctx.restore();
    }
  }

  // Mountain silhouettes (SVG-based, static)
  function createMountainSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'fixed';
    svg.style.bottom = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '40%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '0';
    svg.style.opacity = '0.15';
    svg.setAttribute('viewBox', '0 0 1200 400');
    svg.setAttribute('preserveAspectRatio', 'none');
    
    // Back mountain
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', 'M0,400 L0,250 Q200,150 400,200 T800,150 L1200,200 L1200,400 Z');
    path1.setAttribute('fill', 'rgba(99, 102, 241, 0.2)');
    svg.appendChild(path1);
    
    // Middle mountain
    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', 'M0,400 L0,300 Q300,180 600,250 T1200,280 L1200,400 Z');
    path2.setAttribute('fill', 'rgba(79, 70, 229, 0.25)');
    svg.appendChild(path2);
    
    // Front mountain
    const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path3.setAttribute('d', 'M0,400 L0,320 Q400,280 800,340 L1200,360 L1200,400 Z');
    path3.setAttribute('fill', 'rgba(67, 56, 202, 0.3)');
    svg.appendChild(path3);
    
    document.body.insertBefore(svg, document.body.firstChild);
  }

  // Parallax scroll effect
  function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const rate = scrolled * 0.5;
          hero.style.transform = `translateY(${rate}px)`;
          hero.style.opacity = Math.max(0, 1 - scrolled / 400);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // Micro-interactions for buttons and links
  function initMicroInteractions() {
    const interactiveElements = document.querySelectorAll('a, button, .btn, .task-item');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', function(e) {
        this.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
      });
      
      el.addEventListener('mouseleave', function(e) {
        this.style.transform = '';
      });
    });
  }

  // Initialize everything
  function init() {
    // Add mountains
    createMountainSVG();
    
    // Create canvas for particles and lanterns
    const { canvas, ctx } = createBackgroundCanvas();
    
    // Create particles
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle(canvas));
    }
    
    // Create lanterns
    const lanterns = [];
    for (let i = 0; i < 4; i++) {
      const lantern = new Lantern(canvas);
      lantern.y = canvas.height - i * 200 - Math.random() * 200;
      lanterns.push(lantern);
    }
    
    // Create mist layers
    const mistLayers = [
      new MistLayer(canvas, 0.1, 0.15),
      new MistLayer(canvas, 0.15, 0.1),
      new MistLayer(canvas, 0.08, 0.2)
    ];
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw mist
      mistLayers.forEach(mist => {
        mist.update();
        mist.draw(ctx);
      });
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      // Update and draw lanterns
      lanterns.forEach(lantern => {
        lantern.update();
        lantern.draw(ctx);
      });
      
      requestAnimationFrame(animate);
    }
    animate();
    
    // Initialize parallax and micro-interactions
    initParallax();
    initMicroInteractions();
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
