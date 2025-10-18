/* Professional full-stack portfolio: dark, minimal, responsive */
/* CSS variables for quick theming */
:root{--bg:#050506;--text:#e8f0f2;--muted:#bcd7db;--accent:#ffd54f;--accent-2:#66fcf1}
*{box-sizing:border-box}
html,body{height:100%;margin:0;font-family:"Poppins",system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;background:var(--bg);color:var(--text)}
.bg-layer{position:fixed;inset:0;z-index:0;background:linear-gradient(180deg,rgba(0,0,0,0.55),rgba(0,0,0,0.85));filter:brightness(.82);pointer-events:none}

/* Decorative canvas: fullscreen, pointer-events none so it doesn't block interactions */
#cursor-canvas{position:fixed;inset:0;z-index:1;pointer-events:none}

/* NAV */
.nav{position:sticky;top:0;z-index:40;background:rgba(6,6,6,0.55);backdrop-filter:blur(6px);border-bottom:1px solid rgba(255,255,255,0.03)}
.nav-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:10px 18px}
.brand{color:#66fcf1;font-weight:600}
.nav-links{display:flex;gap:16px;list-style:none;margin:0;padding:0}
.nav-links a{color:#d7e6ea;text-decoration:none;font-weight:500;font-size:.95rem;opacity:.95}
.cta{background:linear-gradient(90deg,#66fcf1,#4ecfff);color:#041018;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:600}

/* HERO */
.hero{padding:36px 18px 46px;display:flex;align-items:center;justify-content:center;z-index:2;position:relative}
.hero-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 360px;gap:28px;align-items:center}
.hero-text h1{margin:0;color:#ffd54f;font-size:2rem;letter-spacing:0.4px}
.lead{color:#dbeff2;margin-top:8px;font-size:1.05rem}
.hero-sub{color:#bcd7db;margin-top:10px}
.hero-actions{margin-top:14px;display:flex;gap:12px}
.btn{padding:10px 14px;border-radius:9px;text-decoration:none;font-weight:600}
.btn.primary{background:#ffd54f;color:#081018}
.btn.ghost{background:transparent;border:1px solid rgba(255,255,255,0.06);color:#dfeff3}

/* hero photo */
.hero-photo{display:flex;flex-direction:column;align-items:center}
.hero-photo img{width:320px;border-radius:12px;display:block;box-shadow:0 18px 60px rgba(0,0,0,0.7);border:6px solid rgba(255,255,255,0.02)}
.hero-photo figcaption{margin-top:10px;color:#bfcad0;font-size:.9rem;text-align:center}

/* MAIN container */
.site-main{position:relative;z-index:2;max-width:1100px;margin:26px auto;padding:0 18px 60px}

/* Panel */
.panel{background:linear-gradient(180deg,rgba(12,12,12,0.6),rgba(12,12,12,0.55));border-radius:10px;border:1px solid rgba(255,255,255,0.02);padding:20px;margin-bottom:20px;box-shadow:0 8px 30px rgba(0,0,0,0.6)}
h2{color:#ffd54f;margin:0 0 8px}

/* Outcomes (small case-study style) */
.panel-grid.outcomes{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.panel-grid.outcomes h4{margin:0 0 6px;color:var(--accent)}
.panel-grid.outcomes p{margin:0;color:var(--muted)}

/* About */
.panel-grid{display:grid;grid-template-columns:1fr 360px;gap:20px;align-items:start}
.approach{list-style:none;padding:0;margin:8px 0 0;color:#c9d9dc}
.meta-cards{display:flex;gap:10px;margin-top:12px}
.meta{background:rgba(255,255,255,0.02);padding:10px;border-radius:8px;min-width:130px}
.m-title{display:block;color:#cfe8f0;font-size:.85rem}
.m-value{font-weight:700;color:#eef8fb}

/* Skills */
.skills-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.skill-block h4{margin:0 0 8px;color:#cfe8f0}
.pill{background:rgba(255,255,255,0.04);padding:4px 8px;border-radius:999px;font-size:.75rem;margin-left:8px;color:#e6fbff}

/* Projects / gallery */
.project{display:grid;grid-template-columns:1fr 420px;gap:18px;align-items:start}
.gallery-note{color:#cbd6db;margin-bottom:8px}
.gallery-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}
.thumb{background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01));padding:6px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .16s ease,box-shadow .16s ease}
.thumb img{width:100%;height:auto;max-height:220px;object-fit:cover;border-radius:6px}
.thumb:hover{transform:translateY(-6px);box-shadow:0 10px 30px rgba(0,0,0,0.65)}

/* Experience */
.timeline{display:grid;gap:14px}
.entry h4{margin:0}
.company{font-style:italic;color:#9fbfc9;margin-bottom:8px}

/* Testimonials / blockquote */
blockquote{background:rgba(255,255,255,0.02);padding:12px 18px;border-left:4px solid rgba(102,252,241,0.08);color:#cee6ea;margin:0}

/* Footer */
.site-footer{text-align:center;padding:18px 10px;color:#bfc6ca;border-top:1px solid rgba(255,255,255,0.02)}

/* lightbox */
#lightbox{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.86);z-index:9999;padding:20px}
#lightbox.visible{display:flex}
#lightbox .lb-content{max-width:920px;max-height:92vh;width:100%;display:flex;align-items:center;gap:16px}
#lightbox img{max-width:calc(100% - 120px);max-height:92vh;object-fit:contain;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.8)}
.lb-prev,.lb-next{background:rgba(255,255,255,0.06);color:#fff;border:none;padding:12px 14px;font-size:26px;border-radius:8px;cursor:pointer}
.lb-close{position:absolute;right:18px;top:18px;background:rgba(255,255,255,0.06);border:none;padding:8px 10px;color:#fff;font-size:18px;border-radius:8px;cursor:pointer}

/* reveal animations */
.reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}
.reveal.visible{opacity:1;transform:none}
.reveal-sm{opacity:0;transform:translateY(10px);transition:opacity .5s ease,transform .5s ease}
.reveal-sm.visible{opacity:1;transform:none}

/* responsive */
@media (max-width:1100px){.hero-inner{grid-template-columns:1fr 300px}.panel-grid{grid-template-columns:1fr}.project{grid-template-columns:1fr}.skills-grid{grid-template-columns:1fr}}
@media (max-width:700px){.nav-links{display:none}.hero-inner{grid-template-columns:1fr}.hero-photo img{width:260px}}
@media (max-width:420px){.hero-photo img{width:220px}}
