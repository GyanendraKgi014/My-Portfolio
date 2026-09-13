/**
 * Gyanendra Kushwaha - Personal Portfolio
 * Interactive Scripts: Theme Toggle, Mobile Nav, ScrollSpy, Form Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initStickyHeader();
  initMobileNav();
  initScrollSpy();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve saved preference or check OS preference
  const savedTheme = localStorage.getItem('gk_portfolio_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    htmlElement.setAttribute('data-theme', 'dark');
  } else {
    htmlElement.setAttribute('data-theme', 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('gk_portfolio_theme', newTheme);
    });
  }
}

/* --------------------------------------------------------------------------
   2. Sticky Navigation Header
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const closeDrawer = document.getElementById('close-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .drawer-footer a');

  if (!mobileDrawer || !mobileToggle) return;

  const openMenu = () => {
    mobileDrawer.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileDrawer.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  mobileToggle.addEventListener('click', openMenu);
  if (closeDrawer) closeDrawer.addEventListener('click', closeMenu);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMenu);

  // Close drawer on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   4. Scroll Spy & Active Nav Link Highlighting
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${currentId}`) {
            link.classList.add('active');
          } else if (href.startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   5. Interactive Contact Form with Validation & Feedback
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submit-btn');
  const formFeedback = document.getElementById('form-feedback');

  const showError = (fieldId, message) => {
    const errorElem = document.getElementById(`${fieldId}-error`);
    if (errorElem) {
      errorElem.textContent = message;
    }
    const input = document.getElementById(fieldId);
    if (input) {
      input.style.borderColor = '#ef4444';
    }
  };

  const clearError = (fieldId) => {
    const errorElem = document.getElementById(`${fieldId}-error`);
    if (errorElem) {
      errorElem.textContent = '';
    }
    const input = document.getElementById(fieldId);
    if (input) {
      input.style.borderColor = '';
    }
  };

  // Clear errors when typing
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        clearError(input.id);
        if (formFeedback) {
          formFeedback.className = 'form-feedback';
          formFeedback.textContent = '';
        }
      });
    }
  });

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Name Validation
    if (!nameInput.value.trim()) {
      showError('name', 'Please enter your name.');
      isValid = false;
    } else {
      clearError('name');
    }

    // Email Validation
    if (!emailInput.value.trim()) {
      showError('email', 'Please enter your email.');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      showError('email', 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError('email');
    }

    // Subject Validation
    if (!subjectInput.value.trim()) {
      showError('subject', 'Please enter a subject.');
      isValid = false;
    } else {
      clearError('subject');
    }

    // Message Validation
    if (!messageInput.value.trim()) {
      showError('message', 'Please write your message.');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError('message', 'Message must be at least 10 characters.');
      isValid = false;
    } else {
      clearError('message');
    }

    if (!isValid) return;

    // Simulate sending state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;

      // Show success feedback
      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = 'Thank you! Your message has been received. Gyanendra will get back to you shortly.';
      }

      form.reset();
    }, 1000);
  });
}
