(function () {
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

        next.addEventListener('click', () => grid.scrollBy({ left: 300, behavior: 'smooth' }));
        prev.addEventListener('click', () => grid.scrollBy({ left: -300, behavior: 'smooth' }));

        grid.addEventListener('scroll', () => {
            prev.style.opacity = grid.scrollLeft <= 10 ? "0" : "1";
            const maxScroll = grid.scrollWidth - grid.clientWidth;
            next.style.opacity = grid.scrollLeft >= maxScroll - 10 ? "0" : "1";
        });
        prev.style.opacity = "0";
    }

    function initRevealOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal, .reveal-sm').forEach(el => observer.observe(el));
    }

    function initLightbox() {
        const thumbs = Array.from(document.querySelectorAll('.gallery-grid .thumb img'));
        const lb = document.createElement('div');
        lb.id = 'lightbox';
        lb.innerHTML = `
      <button class="lb-close">&times;</button>
      <div style="display:flex; align-items:center;">
        <button class="lb-prev">❮</button>
        <img src="" alt="">
        <button class="lb-next">❯</button>
      </div>`;
        document.body.appendChild(lb);
        const img = lb.querySelector('img');
        let curIdx = 0;

        const update = (i) => {
            curIdx = (i + thumbs.length) % thumbs.length;
            img.src = thumbs[curIdx].src;
        };

        thumbs.forEach((t, i) => t.addEventListener('click', () => {
            update(i);
            lb.classList.add('visible');
            document.body.style.overflow = 'hidden';
        }));

        lb.querySelector('.lb-next').onclick = (e) => { e.stopPropagation(); update(curIdx + 1); };
        lb.querySelector('.lb-prev').onclick = (e) => { e.stopPropagation(); update(curIdx - 1); };
        lb.querySelector('.lb-close').onclick = () => { lb.classList.remove('visible'); document.body.style.overflow = ''; };
        lb.onclick = (e) => { if (e.target === lb) lb.querySelector('.lb-close').click(); };
    }

    function initCursorCanvas() {
        const canvas = document.getElementById('cursor-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let cw, ch;
        const particles = [];
        const maxParticles = 28;
        const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const palette = [{ h: 200, s: 100, l: 60 }, { h: 270, s: 95, l: 60 }, { h: 180, s: 95, l: 55 }];

        function resize() {
            cw = canvas.width = window.innerWidth;
            ch = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        window.addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; });

        function spawn(x, y) {
            if (particles.length >= maxParticles) return;
            particles.push({
                x: x + (Math.random() - 0.5) * 16,
                y: y + (Math.random() - 0.5) * 16,
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 1.2,
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
                p.vx *= 0.98; p.vy *= 0.98;
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
        window.addEventListener('scroll', () => {
            if (window.scrollY > 24) nav.classList.add('nav-sm');
            else nav.classList.remove('nav-sm');
        });
    }

    function initSmoothScroll() {
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a[href^="#"]');
            if (!a) return;
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    }

    function initCTA() {
        const btn = document.getElementById('contact-cta');
        if (btn) btn.onclick = () => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }

    function initViewProjectsButton() {
        const btn = document.querySelector('.hero-actions .btn.primary');
        if (btn) btn.onclick = (e) => {
            e.preventDefault();
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        };
    }
})();
