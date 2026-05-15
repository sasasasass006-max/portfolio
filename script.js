/* ════════════════════════════════════════════════════════
   script.js — Mostafa Abdelgawad Portfolio
   Loader · Particles · Nav · Tabs · Scroll Reveal · Lightbox
════════════════════════════════════════════════════════ */

/* ── 1. LOADING SCREEN ─────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Give the fill animation 1.8s, then hide
  setTimeout(() => {
    loader.classList.add('hidden');
    // After transition, remove from DOM entirely
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }, 2200);
});

/* ── 2. PARTICLE CANVAS ────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.alpha = Math.random() * 0.6 + 0.1;
      // Blue or cyan tint
      this.color = Math.random() > 0.5 ? '30,144,255' : '0,212,255';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.0008;
      if (this.y < -10 || this.alpha <= 0) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    // More particles on wider screens
    const count = Math.min(Math.floor(W / 10), 120);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  loop();
})();

/* ── 3. NAVBAR: scroll style + active link ─────────── */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Shrink navbar on scroll
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // Highlight active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

/* ── 4. MOBILE NAV TOGGLE ──────────────────────────── */
const navToggle    = document.getElementById('navToggle');
const navLinksList = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinksList.classList.toggle('open');
});

// Close on link click
navLinksList.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinksList.classList.remove('open');
  });
});

/* ── 5. SCROLL REVEAL ──────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // once
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ── 6. PORTFOLIO TABS ─────────────────────────────── */
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    // Update buttons
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update panels
    tabPanels.forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(`tab-${target}`);
    panel.classList.add('active');

    // Re-trigger reveal animations for newly shown panel
    panel.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('visible');
      // Small timeout so transition re-fires
      setTimeout(() => revealObserver.observe(el), 50);
    });

    // Smooth scroll to portfolio section on mobile
    if (window.innerWidth < 768) {
      document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── 7. VIDEO REEL PLAY ────────────────────────────── */
/**
 * Toggle play/pause for a reel video card.
 * @param {string} videoId  - id of the <video> element
 * @param {string} overlayId - id of the overlay div
 */
function playReel(videoId, overlayId) {
  const video   = document.getElementById(videoId);
  const overlay = document.getElementById(overlayId);

  if (video.paused) {
    video.play();
    overlay.classList.add('hidden');
  } else {
    video.pause();
    overlay.classList.remove('hidden');
  }
}

// Re-show overlay when video ends
document.querySelectorAll('.reel-video').forEach(video => {
  video.addEventListener('ended', () => {
    // overlay id convention: reel-overlay-N
    const overlayId = video.id.replace('reel', 'reel-overlay');
    const overlay   = document.getElementById(overlayId);
    if (overlay) overlay.classList.remove('hidden');
  });
  // Click on video itself toggles play/pause
  video.addEventListener('click', () => {
    const overlayId = video.id.replace('reel', 'reel-overlay');
    playReel(video.id, overlayId);
  });
});

// Expose globally for inline onclick in HTML
window.playReel = playReel;

/* ── 8. LIGHTBOX ───────────────────────────────────── */
/**
 * Open the lightbox with a given image src and caption.
 * @param {string} src
 * @param {string} caption
 */
function openLightbox(src, caption) {
  const lb       = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightboxImg');
  const lbCaption= document.getElementById('lightboxCaption');

  lbImg.src       = src;
  lbCaption.textContent = caption;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on Escape key
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// Expose globally
window.openLightbox  = openLightbox;
window.closeLightbox = closeLightbox;

/* ── 9. CONTACT FORM ───────────────────────────────── */
function handleForm(e) {
  e.preventDefault();
  const btn     = document.querySelector('.form-submit');
  const success = document.getElementById('formSuccess');

  // Simulate sending
  btn.textContent = 'Sending…';
  btn.disabled    = true;

  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.disabled    = false;
    success.classList.add('show');
    document.getElementById('contactForm').reset();

    // Hide success message after 5s
    setTimeout(() => success.classList.remove('show'), 5000);
  }, 1500);
}

window.handleForm = handleForm;

/* ── 10. SMOOTH HERO CTA SCROLL ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── 11. HERO PARALLAX (subtle) ────────────────────── */
window.addEventListener('scroll', () => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const y = window.scrollY;
    heroContent.style.transform = `translateY(${y * 0.18}px)`;
    heroContent.style.opacity   = 1 - y / 500;
  }
}, { passive: true });

/* ── 12. CUSTOM CURSOR GLOW (desktop only) ─────────── */
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 24px; height: 24px;
    border-radius: 50%;
    background: rgba(30,144,255,0.25);
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%,-50%);
    transition: width 0.2s, height 0.2s, background 0.2s;
    mix-blend-mode: screen;
    filter: blur(4px);
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0, cx = 0, cy = 0;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  // Lerp for smooth trailing
  (function animGlow() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animGlow);
  })();

  // Enlarge on interactive elements
  document.querySelectorAll('a, button, .thumb-card, .service-card, .tab-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      glow.style.width  = '60px';
      glow.style.height = '60px';
      glow.style.background = 'rgba(30,144,255,0.4)';
    });
    el.addEventListener('mouseleave', () => {
      glow.style.width  = '24px';
      glow.style.height = '24px';
      glow.style.background = 'rgba(30,144,255,0.25)';
    });
  });
}
