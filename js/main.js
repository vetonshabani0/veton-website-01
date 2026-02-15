/**
 * Helvetic Dynamics AG – Main JavaScript v2
 * i18n, navigation, language switcher, scroll effects, form, animations, parallax.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const lang = await I18n.init();
  initLanguageSwitcher(lang);
  initHeaderScroll();
  initMobileMenu();
  initBackToTop();
  initContactForm();
  initScrollAnimations();
  initSmoothScroll();
  initParallax();
});

/* ==========================================
   Language Switcher
   ========================================== */
function initLanguageSwitcher(activeLang) {
  const switcher = document.getElementById('langSwitcher');
  if (!switcher) return;

  const btn = switcher.querySelector('.lang-switcher__btn');
  const dropdown = switcher.querySelector('.lang-switcher__dropdown');
  const currentLabel = switcher.querySelector('.lang-switcher__current');
  const options = switcher.querySelectorAll('.lang-switcher__option');

  currentLabel.textContent = activeLang.toUpperCase();
  updateActiveOption(activeLang);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(btn.getAttribute('aria-expanded') !== 'true');
  });

  options.forEach((option) => {
    option.addEventListener('click', async () => {
      const lang = option.dataset.lang;
      currentLabel.textContent = lang.toUpperCase();
      updateActiveOption(lang);
      toggleDropdown(false);
      await I18n.setLanguage(lang);
    });
  });

  document.addEventListener('click', () => toggleDropdown(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleDropdown(false); });

  window.addEventListener('languageChanged', (e) => {
    currentLabel.textContent = e.detail.lang.toUpperCase();
    updateActiveOption(e.detail.lang);
  });

  function toggleDropdown(open) {
    btn.setAttribute('aria-expanded', open);
    dropdown.classList.toggle('lang-switcher__dropdown--open', open);
  }

  function updateActiveOption(lang) {
    options.forEach((opt) => {
      const li = opt.closest('[role="option"]');
      if (li) li.setAttribute('aria-selected', opt.dataset.lang === lang);
    });
  }
}

/* ==========================================
   Header Scroll Effect
   ========================================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('header--scrolled', window.scrollY > 10);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================
   Mobile Menu
   ========================================== */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !isOpen);
    nav.classList.toggle('header__nav--open', !isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('.header__nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('header__nav--open');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================
   Back to Top
   ========================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.hidden = window.scrollY < 500;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================
   Contact Form
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      showFeedback(I18n.t('contact.form.error'), 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showFeedback(I18n.t('contact.form.error'), 'error');
      return;
    }

    // Static site – show success. Connect a backend (Formspree, Netlify Forms) in production.
    showFeedback(I18n.t('contact.form.success'), 'success');
    form.reset();
  });

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className = `form-feedback form-feedback--${type}`;
    feedback.hidden = false;
    setTimeout(() => { feedback.hidden = true; }, 5000);
  }
}

/* ==========================================
   Scroll Animations (Intersection Observer)
   ========================================== */
function initScrollAnimations() {
  const animatable = document.querySelectorAll('.anim-fade-up:not(.hero .anim-fade-up), .anim-slide-right');

  if (!('IntersectionObserver' in window)) {
    animatable.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
  );

  animatable.forEach((el) => observer.observe(el));
}

/* ==========================================
   Smooth Scroll
   ========================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================
   Parallax – subtle hero background movement
   ========================================== */
function initParallax() {
  const heroImg = document.querySelector('.hero__bg-img');
  if (!heroImg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          heroImg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.05)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
