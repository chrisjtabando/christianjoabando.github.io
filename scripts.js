(function(){
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initRevealOnScroll();
    initLightbox();
    initGalleryNav();
    initCTA();
    initHeaderShrink();
    initCursorCanvas();
    initViewProjectsButton();
  });

  function initGalleryNav() {
    const grid = document.getElementById('galleryGrid');
    const prev = document.querySelector('.js-gallery-prev');
    const next = document.querySelector('.js-gallery-next');
    if (!grid || !prev || !next) return;

    next.onclick = () => grid.scrollBy({ left: 300, behavior: 'smooth' });
    prev.onclick = () => grid.scrollBy({ left: -300, behavior: 'smooth' });

    grid.onscroll = () => {
        prev.style.opacity = grid.scrollLeft <= 10 ? "0" : "1";
        const max = grid.scrollWidth - grid.clientWidth;
        next.style.opacity = grid.scrollLeft >= max - 10 ? "0" : "1";
    };
    prev.style.opacity = "0";
  }

  function initRevealOnScroll() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal, .reveal-sm').forEach(el => obs.observe(el));
  }

  function initLightbox() {
    const thumbs = Array.from(document.querySelectorAll('.gallery-grid .thumb img'));
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = `<button class="lb-close">&times;</button><img src="" alt="">`;
    document.body.appendChild(lb);
    const img = lb.querySelector('img');

    thumbs.forEach(t => t.onclick = () => {
      img.src = t.src;
      lb.classList.add('visible');
      document.body.style.overflow = 'hidden';
    });

    lb.onclick = (e) => {
      if(e.target !== img) {
        lb.classList.remove('visible');
        document.body.style.overflow = '';
      }
    };
  }

  function initCursorCanvas() {
    const canvas = document.getElementById('cursor-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let cw, ch;
    const particles = [];
    const max = 28;
    const pointer = { x: window.innerWidth/2, y: window.innerHeight/2 };
    const palette = [{h:200, s:100, l:60}, {h:270, s:95, l:60}, {h:180, s:95, l:55}];

    function resize() { cw = canvas.width = window.innerWidth; ch = canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize);
    resize();

    window.onpointermove = (e) => { pointer.x = e.clientX; pointer.y = e.clientY; };

    function spawn(x, y) {
      if (particles.length >= max) return;
      particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        r: Math.random() * 3 + 1.5,
        life: Math.random() * 1000 + 800,
        born: performance.now(),
        col: palette[Math.floor(Math.random() * palette.length)]
      });
    }

    function tick(now) {
      ctx.fillStyle = 'rgba(2, 6, 12, 0.22)';
      ctx.fillRect(0, 0, cw, ch);
      if (Math.random() < 0.6) spawn(pointer.x, pointer.y);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = now - p.born;
        const t = age / p.life;
        if (t >= 1) { particles.splice(i, 1); continue; }
        p.vx += (pointer.x - p.x) * 0.0006;
        p.vy += (pointer.y - p.y) * 0.0006;
        p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx; p.y += p.vy;
        ctx.fillStyle = `hsla(${p.col.h}, ${p.col.s}%, ${p.col.l}%, ${1 - t})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initHeaderShrink() {
    const nav = document.querySelector('.nav');
    window.onscroll = () => {
      if (window.scrollY > 24) nav.classList.add('nav-sm');
      else nav.classList.remove('nav-sm');
    };
  }

  function initSmoothScroll() {
    document.onclick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    };
  }

  function initCTA() {
    const cta = document.getElementById('contact-cta');
    if (cta) cta.onclick = () => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  }

  function initViewProjectsButton() {
    const btn = document.querySelector('.hero-actions .btn.primary');
    if (btn) btn.onclick = (e) => {
        e.preventDefault();
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    };
  }
})();
