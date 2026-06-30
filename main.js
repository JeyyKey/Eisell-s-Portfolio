/* ============================================================
   PORTFOLIO 2026 — main.js
   Vanilla ES6+ · No dependencies
   ============================================================ */

'use strict';

/* ─── REDUCED MOTION CHECK ───────────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── CUSTOM CURSOR ──────────────────────────────────────────── */
(function initCursor() {
  if (prefersReducedMotion) return;

  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  if (!cursor || !cursorDot) return;

  let mouseX = -100, mouseY = -100;
  let curX   = -100, curY   = -100;
  let rafId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot follows instantly
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateCursor() {
    // Lerp for smooth trailing
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    rafId = requestAnimationFrame(animateCursor);
  }
  rafId = requestAnimationFrame(animateCursor);

  // Magnetic hover
  const magnetTargets = document.querySelectorAll(
    'a, button, .skill-card, .project-card, .service-card, .pillar, .social-link'
  );
  magnetTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '1';
  });
})();

/* ─── NAV ────────────────────────────────────────────────────── */
(function initNav() {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Scroll-based nav style
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link tracking
  const sections = document.querySelectorAll('section[id], main > section');
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionMap = [];

  sections.forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (link) sectionMap.push({ sec, link });
  });

  const linkObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const match = sectionMap.find(m => m.sec === entry.target);
        if (match) {
          navLinks.forEach(l => l.classList.remove('active'));
          match.link.classList.add('active');
        }
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sectionMap.forEach(m => linkObserver.observe(m.sec));

  // Mobile menu toggle
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    mobileMenu.hidden = false;
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // rAF so hidden removal triggers the CSS transition
    requestAnimationFrame(() => requestAnimationFrame(() => {
      mobileMenu.removeAttribute('hidden');
    }));
  }

  function closeMenu() {
    menuOpen = false;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Wait for transition before hiding
    setTimeout(() => {
      if (!menuOpen) mobileMenu.hidden = true;
    }, 420);
  }

  hamburger.addEventListener('click', () => {
    menuOpen ? closeMenu() : openMenu();
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  const mobileCta = mobileMenu.querySelector('.mobile-cta');
  if (mobileCta) mobileCta.addEventListener('click', closeMenu);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });
})();

/* ─── SCROLL REVEAL (INTERSECTION OBSERVER) ──────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up');
  if (!revealEls.length) return;

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  revealEls.forEach(el => observer.observe(el));
})();

/* ─── SKILL BAR ANIMATION ────────────────────────────────────── */
(function initSkillBars() {
  const cards = document.querySelectorAll('.skill-card');
  if (!cards.length) return;

  if (prefersReducedMotion) {
    cards.forEach(c => c.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  cards.forEach(c => observer.observe(c));
})();

/* ─── TIMELINE LINE DRAW ─────────────────────────────────────── */
(function initTimeline() {
  const line = document.querySelector('.timeline-line');
  if (!line || prefersReducedMotion) return;

  line.style.scaleY = 0;
  line.style.transformOrigin = 'top';
  line.style.transition = 'transform 1.2s cubic-bezier(0.16,1,0.3,1)';

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        line.style.transform = 'scaleY(1)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(line.closest('.timeline') || line);
})();

/* ─── TESTIMONIALS CAROUSEL ──────────────────────────────────── */
(function initCarousel() {
  const track     = document.getElementById('carouselTrack');
  const prevBtn   = document.getElementById('prevBtn');
  const nextBtn   = document.getElementById('nextBtn');
  const dotsWrap  = document.getElementById('carouselDots');
  if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

  const cards  = Array.from(track.querySelectorAll('.testimonial-card'));
  const total  = cards.length;
  let current  = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    const dots = dotsWrap.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function goTo(index) {
    current = (index + total) % total;
    const offset = current * 100;
    if (!prefersReducedMotion) {
      track.style.transform = `translateX(-${offset}%)`;
    } else {
      track.style.transform = `translateX(-${offset}%)`;
      track.style.transition = 'none';
    }
    updateDots();
    // Update live region
    track.setAttribute('aria-label', `Testimonial ${current + 1} of ${total}`);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

  // Touch/swipe support
  let touchStartX = 0;
  let touchDelta  = 0;

  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchDelta = 0;
  }, { passive: true });

  track.addEventListener('touchmove', e => {
    touchDelta = e.touches[0].clientX - touchStartX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (Math.abs(touchDelta) > 40) {
      touchDelta > 0 ? prev() : next();
      resetAuto();
    }
  });

  // Keyboard navigation
  const carousel = document.getElementById('carousel');
  if (carousel) {
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
      if (e.key === 'ArrowRight') { next(); resetAuto(); }
    });
  }

  // Auto-scroll
  function startAuto() {
    autoTimer = setInterval(next, 5000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  // Pause on hover
  const wrap = document.querySelector('.carousel-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => clearInterval(autoTimer));
    wrap.addEventListener('mouseleave', startAuto);
  }

  goTo(0);
  startAuto();
})();

/* ─── CONTACT FORM ───────────────────────────────────────────── */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  function getField(id)   { return document.getElementById(id); }
  function getError(input) { return input.parentElement.querySelector('.field-error'); }

  function validate(input) {
    const val = input.value.trim();
    const err = getError(input);
    if (!err) return true;

    if (input.required && !val) {
      err.textContent = 'This field is required.';
      input.classList.add('error');
      return false;
    }
    if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      err.textContent = 'Please enter a valid email address.';
      input.classList.add('error');
      return false;
    }
    err.textContent = '';
    input.classList.remove('error');
    return true;
  }

  // Live validation on blur
  ['name', 'email', 'message'].forEach(id => {
    const input = getField(id);
    if (input) {
      input.addEventListener('blur', () => validate(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) validate(input);
      });
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nameEl    = getField('name');
    const emailEl   = getField('email');
    const messageEl = getField('message');
    const valid     = [nameEl, emailEl, messageEl].map(validate).every(Boolean);

    if (!valid) {
      // Focus first error
      const firstErr = form.querySelector('.error');
      if (firstErr) firstErr.focus();
      return;
    }

    // Simulate sending
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      form.reset();
      successMsg.hidden = false;
      successMsg.focus();
      setTimeout(() => { successMsg.hidden = true; }, 6000);
    }, 1800);
  });
})();

/* ─── SMOOTH ANCHOR SCROLLING ────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = 100; // account for fixed nav + gap
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      // Focus management
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();

/* ─── LAZY LOAD IMAGES ───────────────────────────────────────── */
(function initLazyImages() {
  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  lazyImgs.forEach(img => observer.observe(img));
})();

/* ─── PROJECT CARD TILT (OPTIONAL DEPTH EFFECT) ─────────────── */
(function initCardTilt() {
  if (prefersReducedMotion) return;
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch devices

  const cards = document.querySelectorAll('.project-card, .service-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -4;
      const tiltY  = dx * 4;
      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── FLOATING TAG STAGGER ON LOAD ──────────────────────────── */
(function initHeroStagger() {
  if (prefersReducedMotion) return;

  const tags = document.querySelectorAll('.floating-tag');
  tags.forEach((tag, i) => {
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(12px)';
    tag.style.transition = `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${0.8 + i * 0.15}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${0.8 + i * 0.15}s`;
    requestAnimationFrame(() => {
      tag.style.opacity = '1';
      tag.style.transform = '';
    });
  });
})();

/* ─── FOOTER YEAR ────────────────────────────────────────────── */
(function setFooterYear() {
  const yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach(el => { el.textContent = new Date().getFullYear(); });
})();
