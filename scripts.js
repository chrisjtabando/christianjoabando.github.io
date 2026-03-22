(function(){
  'use strict';

  // --- DOM ready ---------------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initRevealOnScroll();
    initLightbox();
    initCTA();
    initHeaderShrink();
    initCursorCanvas(); // Tron-like particles
    initViewProjectsButton();
    initGalleryNav(); // The fix for your gallery buttons
  });

  // --- Gallery Horizontal Scroll Navigation ------------------------------------------------------
  function initGalleryNav() {
    const grid = document.querySelector('.gallery-grid');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');

    if (!grid || !prevBtn || !nextBtn) return;

    // Scroll by 80% of the visible container width
    const getScrollAmount = () => grid.clientWidth * 0.8;

    nextBtn.addEventListener('click', () => {
      grid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      grid.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    // Toggle button visibility based on scroll position
    grid.addEventListener('scroll', () => {
      const isAtStart = grid.scrollLeft <= 10;
      const isAtEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 10;
      
      prevBtn.style.opacity = isAtStart ? "0" : "1";
      prevBtn.style.pointerEvents = isAtStart ? "none" : "auto";
      
      nextBtn.style.opacity = isAtEnd ? "0" : "1";
      nextBtn.style.pointerEvents = isAtEnd ? "none" : "auto";
    });

    // Initial state setup
    prevBtn.style.opacity = "0";
    prevBtn.style.pointerEvents = "none";
  }

  // --- Smooth scroll for internal anchors --------------------------------------------------------
  function initSmoothScroll(){
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const href = a.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const nav = document.querySelector('.nav');
      const navHeight = nav ? nav.getBoundingClientRect().height : 0;
      const top = window.scrollY + target.getBoundingClientRect().top - Math.round(navHeight + 8);

      window.scrollTo({ top, behavior: 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus();
      setTimeout(() => target.removeAttribute('tabindex'), 1200);
    });
  }

  // --- Reveal on scroll -------------------------------------------------------------------------
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

    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = `
      <button class="lb-close" aria-label="Close (Esc)"> </button>
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
    }

    function closeLB(){ lbEl.classList.remove('visible'); document.body.style.overflow = ''; }
    function prev(){ open(idx - 1); }
    function next(){ open(idx + 1); }

    thumbs.forEach((t,i) => t.addEventListener('click', () => open(i)));
    btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
    btnNext.addEventListener('click', (e) => { e.stopPropagation(); next(); });
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

  // --- View Projects Button ---------------------------------------------------------------------
  function initViewProjectsButton(){
    const btn = document.querySelector('.hero-actions .btn.primary') || document.querySelector('a.btn.primary');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute && btn.getAttribute('href');
      if (href && href.startsWith('#')) return; 
      e.preventDefault();
      const projects = document.getElementById('projects');
      if (projects) {
        projects.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.scrollBy(0, -12);
        projects.setAttribute('tabindex', '-1');
        projects.focus();
        setTimeout(() => projects.removeAttribute('tabindex'), 1200);
      }
    });
  }

  // --- Header Shrink on Scroll -----------------------------------------------------------------
  function initHeaderShrink(){
    const nav = document.querySelector('.nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 24) nav.classList.add('nav-sm'); else nav.classList.remove('nav-sm');
    });
  }

  // --- Cursor-aware Tron Canvas -----------------------------------------------------------------
  function initCursorCanvas(){
    const canvas = document.getElementById('cursor-canvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');

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
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const max = 28;
    const pointer = { x: window.innerWidth/2, y: window.innerHeight/2 };
    const palette = [{h:200, s:100, l:60}, {h:270, s:95, l:60}, {h:180, s:95, l:55}];

    window.addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; });

    function rand(a,b){ return Math.random() * (b-a) + a; }

    function spawn(x,y){
      if (particles.length >= max) return;
      particles.push({
        x: x + rand(-8,8), y: y + rand(-8,8),
        vx: rand(-0.6, 0.6), vy: rand(-0.6, 0.6),
        r: rand(1.6, 4.6), life: rand(800, 1800),
        born: performance.now(),
        col: palette[Math.floor(rand(0, palette.length))]
      });
    }

    let last = performance.now();
    function tick(now){
      const dt = now - last;
      last = now;
      ctx.fillStyle = 'rgba(2,6,12,0.22)';
      ctx.fillRect(0, 0, cw, ch);

      if (Math.random() < 0.6) spawn(pointer.x, pointer.y);

      ctx.globalCompositeOperation = 'lighter';
      for (let i = particles.length - 1; i >= 0; i--){
        const p = particles[i];
        const age = now - p.born;
        const t = age / p.life;
        if (t >= 1){ particles.splice(i,1); continue; }

        p.vx += (pointer.x - p.x) * 0.0006;
        p.vy += (pointer.y - p.y) * 0.0006;
        p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx * dt * 0.06;
        p.y += p.vy * dt * 0.06;

        const alpha = 1 - t;
        const glowR = p.r * 6;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        grad.addColorStop(0, `hsla(${p.col.h}, ${p.col.s}%, ${p.col.l}%, ${0.55 * alpha})`);
        grad.addColorStop(1, `hsla(${p.col.h}, ${p.col.s}%, ${p.col.l}%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(p.x, p.y, glowR, 0, Math.PI*2); ctx.fill();

        ctx.save();
        ctx.shadowBlur = Math.max(6, p.r * 6);
        ctx.shadowColor = `hsla(${p.col.h}, ${p.col.s}%, ${p.col.l}%, ${0.95 * alpha})`;
        ctx.fillStyle = `hsla(${p.col.h}, ${p.col.s}%, ${p.col.l}%, ${0.98 * alpha})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++){
        const a = particles[i];
        for (let j = i+1; j < particles.length; j++){
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < 2500){
            const dist = Math.sqrt(d2);
            const alpha = 0.26 * (1 - dist / 50);
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${a.col.h}, ${a.col.s}%, ${a.col.l}%, ${alpha})`;
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(tick);
    }
    ctx.fillStyle = '#02060c';
    ctx.fillRect(0, 0, cw, ch);
    requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', () => { if (document.hidden) last = performance.now(); });
  }

})();
