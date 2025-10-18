// Portfolio UI: clean, commented, and extended features
// - Smooth scrolling
// - Reveal on scroll
// - Lightbox gallery
// - CTA scrolling
// - Header shrink on scroll
// - Decorative canvas: moving shapes that respond to cursor

(function(){
  'use strict';

  // --- DOM ready ---------------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initRevealOnScroll();
    initLightbox();
    initCTA();
    initHeaderShrink();
    initCursorCanvas(); // animated shapes responding to cursor
    initViewProjectsButton(); // ensure View Projects button always scrolls to projects
  });

  // --- Smooth scroll for internal anchors --------------------------------------------------------
  function initSmoothScroll(){
    // Use event delegation so dynamically added links or links inside other elements still work.
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      // allow normal behavior when modifier keys are used
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const href = a.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // compute top position and subtract nav height if present
      const nav = document.querySelector('.nav');
      const navHeight = nav ? nav.getBoundingClientRect().height : 0;
      const top = window.scrollY + target.getBoundingClientRect().top - Math.round(navHeight + 8);

      window.scrollTo({ top, behavior: 'smooth' });

      // accessibility: move focus to section
      target.setAttribute('tabindex', '-1');
      target.focus();
      setTimeout(() => target.removeAttribute('tabindex'), 1200);
    });
  }

  // --- Reveal on scroll using IntersectionObserver -----------------------------------------------
  function initRevealOnScroll(){
    const revealables = document.querySelectorAll('.reveal, .reveal-sm');
    if (!('IntersectionObserver' in window) || revealables.length === 0) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.12 });

    revealables.forEach(el => obs.observe(el));
  }

  // --- Lightbox gallery -------------------------------------------------------------------------
  function initLightbox(){
    const thumbs = Array.from(document.querySelectorAll('.gallery-grid .thumb img'));
    if (thumbs.length === 0) return;

    // create lightbox elements
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = `
      <button class="lb-close" aria-label="Close (Esc)"></button>
      <div class="lb-content" role="dialog" aria-modal="true">
        <button class="lb-prev" aria-label="Previous (Left)">&lsaquo;</button>
        <img src="" alt="" />
        <button class="lb-next" aria-label="Next (Right)">&rsaquo;</button>
      </div>
      <div class="lb-meta"><div class="lb-caption"></div><div class="lb-index"></div></div>
    `;
    document.body.appendChild(lb);

    const lbEl = document.getElementById('lightbox');
    const lbImg = lbEl.querySelector('img');
    const lbCaption = lbEl.querySelector('.lb-caption');
    const lbIndex = lbEl.querySelector('.lb-index');
    const btnPrev = lbEl.querySelector('.lb-prev');
    const btnNext = lbEl.querySelector('.lb-next');
    const btnClose = lbEl.querySelector('.lb-close');

    let idx = 0;
    const total = thumbs.length;

    function open(i){
      idx = (i + total) % total;
      const t = thumbs[idx];
      lbImg.src = t.src;
      lbImg.alt = t.alt || '';
      lbCaption.textContent = t.alt || '';
      lbIndex.textContent = `${idx + 1} / ${total}`;
      lbEl.classList.add('visible');
      document.body.style.overflow = 'hidden';
      btnClose.focus();
      // preload neighbors
      new Image().src = thumbs[(idx+1)%total].src;
      new Image().src = thumbs[(idx-1+total)%total].src;
    }

    function closeLB(){ lbEl.classList.remove('visible'); document.body.style.overflow = ''; }
    function prev(){ open(idx - 1); }
    function next(){ open(idx + 1); }

    thumbs.forEach((t,i) => t.addEventListener('click', () => open(i)));
    btnPrev.addEventListener('click', prev);
    btnNext.addEventListener('click', next);
    btnClose.addEventListener('click', closeLB);

    lbEl.addEventListener('click', (e) => { if (e.target === lbEl) closeLB(); });
    document.addEventListener('keydown', (e) => {
      if (!lbEl.classList.contains('visible')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });
  }

  // --- CTA scroll to contact -------------------------------------------------------------------
  function initCTA(){
    const cta = document.getElementById('contact-cta');
    if (!cta) return;
    cta.addEventListener('click', () => {
      const contact = document.getElementById('contact');
      if (!contact) return;
      contact.scrollIntoView({ behavior: 'smooth' });
      window.scrollBy(0, -12);
    });
  }

  // --- Ensure "View Projects" button scrolls to projects -------------------------------------
  function initViewProjectsButton(){
    // target the primary button inside hero; fall back to any .btn.primary that links to #projects
    const btn = document.querySelector('.hero-actions .btn.primary') || document.querySelector('a.btn.primary');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      // if it's a normal anchor with href and browser handled it, let it be
      // otherwise run a smooth scroll to the projects section
      const href = btn.getAttribute && btn.getAttribute('href');
      if (href && href.startsWith('#')) return; // existing anchor handler will take care of smooth scroll

      e.preventDefault();
      const projects = document.getElementById('projects');
      if (!projects) return;
      projects.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollBy(0, -12);
      // move focus for accessibility
      projects.setAttribute('tabindex', '-1');
      projects.focus();
      // remove tabindex after a short delay
      setTimeout(() => projects.removeAttribute('tabindex'), 1200);
    });
  }

  // --- Header shrink on scroll -----------------------------------------------------------------
  function initHeaderShrink(){
    const nav = document.querySelector('.nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 24) nav.classList.add('nav-sm'); else nav.classList.remove('nav-sm');
    });
  }

  // --- Cursor-aware canvas shapes ---------------------------------------------------------------
  function initCursorCanvas(){
    const canvas = document.getElementById('cursor-canvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');

    // Resize canvas to full screen (devicePixelRatio aware)
    // Use CSS pixel sizes for drawing commands to avoid mismatches that leave uncovered areas.
    let cw = window.innerWidth;
    let ch = window.innerHeight;
    function resize(){
      const dpr = window.devicePixelRatio || 1;
      cw = window.innerWidth;
      ch = window.innerHeight;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      canvas.style.width = cw + 'px';
      canvas.style.height = ch + 'px';
      // reset transform then scale once — avoid accumulating scale on repeated resize
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resize);
    resize();

    // Tron-like particles
    const particles = [];
    const max = 28; // allow more for striking Tron trails, but cap

    // pointer tracking
    const pointer = { x: window.innerWidth/2, y: window.innerHeight/2, down: false };
    window.addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; });
    window.addEventListener('pointerdown', () => pointer.down = true);
    window.addEventListener('pointerup', () => pointer.down = false);

    // neon palette tuned for Tron-like look
    const palette = [
      {h:200, s:100, l:60}, // cyan
      {h:270, s:95, l:60},  // magenta/purple
      {h:180, s:95, l:55}   // teal
    ];

    // helper
    function rand(a,b){ return Math.random() * (b-a) + a; }

    // spawn particles near the pointer; they'll have neon core and glow
    function spawn(x,y){
      if (particles.length >= max) return;
      const p = {
        x: x + rand(-8,8),
        y: y + rand(-8,8),
        vx: rand(-0.6, 0.6),
        vy: rand(-0.6, 0.6),
        r: rand(1.6, 4.6),
        life: rand(800, 1800), // ms
        born: performance.now(),
        col: palette[Math.floor(rand(0, palette.length))]
      };
      particles.push(p);
    }

    // animation
    let last = performance.now();
    function tick(now){
      const dt = now - last;
      last = now;

  // draw a translucent rectangle (in CSS pixels) to create trailing fade
  ctx.fillStyle = 'rgba(2,6,12,0.22)'; // dark but slightly transparent to leave trails
  ctx.fillRect(0, 0, cw, ch);

      // occasionally spawn near pointer when moving
      if (Math.random() < 0.6) spawn(pointer.x, pointer.y);

      // update particles and draw neon glow + core
      // Use additive blending for stronger neon glow
      ctx.globalCompositeOperation = 'lighter';
      for (let i = particles.length - 1; i >= 0; i--){
        const p = particles[i];
        const age = now - p.born;
        const t = age / p.life;
        if (t >= 1){ particles.splice(i,1); continue; }

        // simple movement and slight attraction to pointer for more dynamic lines
        p.vx += (pointer.x - p.x) * 0.0006;
        p.vy += (pointer.y - p.y) * 0.0006;
        p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx * dt * 0.06;
        p.y += p.vy * dt * 0.06;

        // neon glow (larger, soft) - stronger center and wider falloff
        const glowR = p.r * 6;
        const alpha = 1 - t;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        grad.addColorStop(0, `hsla(${p.col.h}, ${p.col.s}%, ${p.col.l}%, ${0.55 * alpha})`);
        grad.addColorStop(0.35, `hsla(${p.col.h}, ${p.col.s}%, ${p.col.l}%, ${0.28 * alpha})`);
        grad.addColorStop(0.7, `hsla(${p.col.h}, ${p.col.s}%, ${p.col.l}%, ${0.08 * alpha})`);
        grad.addColorStop(1, `hsla(${p.col.h}, ${p.col.s}%, ${p.col.l}%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(p.x, p.y, glowR, 0, Math.PI*2); ctx.fill();

        // bright core with shadow for neon bloom
        ctx.save();
        ctx.shadowBlur = Math.max(6, p.r * 6);
        ctx.shadowColor = `hsla(${p.col.h}, ${p.col.s}%, ${p.col.l}%, ${0.95 * alpha})`;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.col.h}, ${p.col.s}%, ${p.col.l}%, ${0.98 * alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        // thin neon outline (slightly brighter)
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${p.col.h}, ${p.col.s}%, ${p.col.l}%, ${0.95 * alpha})`;
        ctx.lineWidth = Math.max(0.6, p.r * 0.28);
        ctx.arc(p.x, p.y, p.r + 1, 0, Math.PI*2);
        ctx.stroke();
      }

      // draw connecting lines between nearby particles for Tron grid effect
      for (let i = 0; i < particles.length; i++){
        const a = particles[i];
        for (let j = i+1; j < particles.length; j++){
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < 2500){ // up to 50px distance for lines
            const dist = Math.sqrt(d2);
            const alpha = 0.26 * (1 - dist / 50);
            // gradient between the two particle hues
            const lg = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            lg.addColorStop(0, `hsla(${a.col.h}, ${a.col.s}%, ${a.col.l}%, ${alpha})`);
            lg.addColorStop(1, `hsla(${b.col.h}, ${b.col.s}%, ${b.col.l}%, ${alpha * 0.9})`);
            ctx.beginPath();
            ctx.strokeStyle = lg;
            ctx.lineWidth = 1.0;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // keep particles under max
      if (particles.length > max) particles.splice(0, particles.length - max);

      // reset composite mode back to default so non-glow drawing isn't affected
      ctx.globalCompositeOperation = 'source-over';

      requestAnimationFrame(tick);
    }

  // prime canvas with a clear black background once (use CSS pixels)
  ctx.fillStyle = '#02060c';
  ctx.fillRect(0, 0, cw, ch);
    requestAnimationFrame(tick);

    // Pause updates on hidden tab
    document.addEventListener('visibilitychange', () => { if (document.hidden) last = performance.now(); });
  }

})();
