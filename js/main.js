/**
 * Helvetic Dynamics AG – Main JavaScript v2
 * i18n, navigation, language switcher, scroll effects, form, animations, parallax.
 */

document.addEventListener('DOMContentLoaded', async () => {
  initLoadingScreen();
  const lang = await I18n.init();
  initLanguageSwitcher(lang);
  initHeaderScroll();
  initMobileMenu();
  initServicesDropdown();
  initBackToTop();
  initContactForm();
  initScrollAnimations();
  initSmoothScroll();
  initParallax();
  initHeroSlider();
});

/* ==========================================
   Loading Screen
   ========================================== */
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingLogo = document.getElementById('loadingLogo');
  const loadingText = document.getElementById('loadingText');
  const headerLogo = document.querySelector('.header__logo');

  if (!loadingScreen || !loadingLogo || !loadingText || !headerLogo) return;

  // Prevent body scroll during loading
  document.body.classList.add('loading');

  // After text appears and underline expands, reveal page
  setTimeout(() => {
    // Fade out loading screen and show page
    loadingScreen.classList.add('loading-screen--hidden');
    document.body.classList.remove('loading');

    // Remove loading screen after transition
    setTimeout(() => {
      loadingScreen.remove();
    }, 800);
  }, 2000); // Reduced timing since truck animation is removed
}

/* ==========================================
   Language Switcher
   ========================================== */
function initLanguageSwitcher(activeLang) {
  // Initialize desktop language switcher
  const switcher = document.getElementById('langSwitcher');
  if (switcher) {
    initSingleLanguageSwitcher(switcher, activeLang);
  }

  // Initialize mobile language switcher
  const mobileSwitcher = document.getElementById('langSwitcherMobile');
  if (mobileSwitcher) {
    initSingleLanguageSwitcher(mobileSwitcher, activeLang);
  }
}

function initSingleLanguageSwitcher(switcher, activeLang) {
  const btn = switcher.querySelector('.lang-switcher__btn');
  const dropdown = switcher.querySelector('.lang-switcher__dropdown');
  const currentLabel = switcher.querySelector('.lang-switcher__current');
  const options = switcher.querySelectorAll('.lang-switcher__option');

  if (!btn || !dropdown || !currentLabel) return;

  currentLabel.textContent = activeLang.toUpperCase();
  updateActiveOption(activeLang, options);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(btn.getAttribute('aria-expanded') !== 'true');
  });

  options.forEach((option) => {
    option.addEventListener('click', async () => {
      const lang = option.dataset.lang;
      // Update both switchers
      document.querySelectorAll('.lang-switcher__current').forEach((label) => {
        label.textContent = lang.toUpperCase();
      });
      document.querySelectorAll('.lang-switcher__option').forEach((opt) => {
        const li = opt.closest('[role="option"]');
        if (li) li.setAttribute('aria-selected', opt.dataset.lang === lang);
      });
      toggleDropdown(false);
      await I18n.setLanguage(lang);
    });
  });

  document.addEventListener('click', (e) => {
    if (!switcher.contains(e.target)) {
      toggleDropdown(false);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleDropdown(false);
  });

  window.addEventListener('languageChanged', (e) => {
    currentLabel.textContent = e.detail.lang.toUpperCase();
    updateActiveOption(e.detail.lang, options);
  });

  function toggleDropdown(open) {
    btn.setAttribute('aria-expanded', open);
    dropdown.classList.toggle('lang-switcher__dropdown--open', open);
  }

  function updateActiveOption(lang, opts) {
    opts.forEach((opt) => {
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

  nav.querySelectorAll('.header__nav-link:not(.header__nav-link--dropdown)').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('header__nav--open');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================
   Services Dropdown
   ========================================== */
function initServicesDropdown() {
  const dropdownBtn = document.getElementById('servicesDropdown');
  if (!dropdownBtn) return;

  const dropdown = dropdownBtn.nextElementSibling;
  if (!dropdown) return;

  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdownBtn.getAttribute('aria-expanded') === 'true';
    dropdownBtn.setAttribute('aria-expanded', !isOpen);
    dropdown.classList.toggle('nav-dropdown__menu--open', !isOpen);
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdownBtn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdownBtn.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('nav-dropdown__menu--open');
    }
  });

  // Close dropdown on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownBtn.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('nav-dropdown__menu--open');
    }
  });

  // Close dropdown when clicking on a link
  dropdown.querySelectorAll('.nav-dropdown__link').forEach((link) => {
    link.addEventListener('click', () => {
      dropdownBtn.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('nav-dropdown__menu--open');
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
  
  if (!form) {
    console.warn('Contact form not found');
    return;
  }
  
  if (!feedback) {
    console.warn('Form feedback element not found');
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  
  console.log('Contact form initialized', { form, feedback, submitBtn });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted');

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const phone = form.querySelector('#phone');
    const service = form.querySelector('#service');
    const message = form.querySelector('#message');

    console.log('Form fields:', { name, email, phone, service, message });

    // Validation
    if (!name || !name.value.trim() || !email || !email.value.trim() || !message || !message.value.trim()) {
      console.error('Validation failed: missing required fields', {
        name: name?.value,
        email: email?.value,
        message: message?.value
      });
      showFeedback(I18n.t('contact.form.error'), 'error');
      return;
    }

    // Trim email and validate using browser's built-in validation
    const emailValue = email.value.trim();
    console.log('Email value to validate:', emailValue);
    
    // Use browser's built-in email validation (respects type="email")
    if (!email.checkValidity()) {
      console.error('Validation failed: browser email validation failed', {
        emailValue,
        validity: email.validity,
        validationMessage: email.validationMessage
      });
      showFeedback(email.validationMessage || I18n.t('contact.form.error'), 'error');
      return;
    }

    // Disable submit button and show loading
    if (submitBtn) {
      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = I18n.t('contact.form.sending') || 'Wird gesendet...';
    }

    try {
      // Determine API endpoint
      // For Netlify: use /.netlify/functions/send-email
      // For Vercel: use /api/send-email
      // For custom: use your API URL
      const apiUrl = '/.netlify/functions/send-email';
      
      const formData = {
        name: name.value.trim(),
        email: emailValue,
        phone: phone?.value.trim() || '',
        service: service?.value || '',
        message: message.value.trim()
      };
      
      console.log('Sending request to:', apiUrl, formData);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
    showFeedback(I18n.t('contact.form.success'), 'success');
    form.reset();
      } else {
        throw new Error(data.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      showFeedback(I18n.t('contact.form.error') || 'Fehler beim Senden. Bitte versuchen Sie es später erneut.', 'error');
    } finally {
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = I18n.t('contact.form.submit') || 'Nachricht senden';
      }
    }
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
    // Also show service cards
    document.querySelectorAll('.service-card').forEach((el) => el.classList.add('is-visible'));
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

  // Enhanced service cards animation with staggered delays
  initServiceCardsAnimation();

  // Enhanced advantage cards animation with staggered delays
  initAdvantageCardsAnimation();
}

/* ==========================================
   Service Cards Staggered Animation
   ========================================== */
function initServiceCardsAnimation() {
  const serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cards = Array.from(entry.target.parentElement.querySelectorAll('.service-card'));
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('is-visible');
            }, index * 100); // Stagger by 100ms
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
  );

  // Observe the services grid container
  const servicesGrid = document.querySelector('.services__grid');
  if (servicesGrid) {
    observer.observe(servicesGrid);
  }
}

/* ==========================================
   Advantage Cards Staggered Animation
   ========================================== */
function initAdvantageCardsAnimation() {
  const advantageCards = document.querySelectorAll('.advantage-card');
  if (advantageCards.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cards = Array.from(entry.target.parentElement.querySelectorAll('.advantage-card'));
          cards.forEach((card, index) => {
            const delay = card.dataset.animDelay || index * 100;
            setTimeout(() => {
              card.classList.add('is-visible');
            }, parseInt(delay));
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
  );

  // Observe the advantages grid container
  const advantagesGrid = document.querySelector('.advantages__grid');
  if (advantagesGrid) {
    observer.observe(advantagesGrid);
  }
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
  const heroImg = document.querySelector('.hero__slide--active .hero__bg-img');
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

/* ==========================================
   Hero Slider
   ========================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__slider-dot');
  const prevBtn = document.querySelector('.hero__slider-btn--prev');
  const nextBtn = document.querySelector('.hero__slider-btn--next');
  
  if (slides.length === 0) return;

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 3000; // 3 seconds per slide

  function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach((slide, i) => {
      slide.classList.toggle('hero__slide--active', i === index);
    });
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('hero__slider-dot--active', i === index);
    });

    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  function goToSlide(index) {
    if (index >= 0 && index < slides.length) {
      showSlide(index);
      resetAutoSlide();
    }
  }

  function startAutoSlide() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    slideInterval = setInterval(() => {
      nextSlide();
    }, slideDuration);
  }

  function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
  }

  // Event listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      resetAutoSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      resetAutoSlide();
    }
  });

  // Pause on hover
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    heroSection.addEventListener('mouseleave', () => {
      startAutoSlide();
    });
  }

  // Start auto-slide
  startAutoSlide();
}
