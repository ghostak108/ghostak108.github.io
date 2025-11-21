(function () {
  const root = document.documentElement;
  const body = document.body;
  const nav = document.querySelector('[data-nav]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const themeToggleLabel = themeToggle ? themeToggle.querySelector('[data-theme-toggle-label]') : null;
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)');
  const closeOnResize = window.matchMedia('(min-width: 961px)');

  body.classList.add('js');

  const THEMES = ['dark', 'light'];
  const getStoredTheme = () => {
    try {
      const stored = localStorage.getItem('theme');
      return THEMES.includes(stored) ? stored : null;
    } catch (err) {
      return null;
    }
  };

  const storeTheme = (theme) => {
    try {
      localStorage.setItem('theme', theme);
    } catch (err) {
      /* storage might be unavailable (private mode); ignore */
    }
  };

  const applyTheme = (theme) => {
    const target = THEMES.includes(theme) ? theme : THEMES[0];
    root.setAttribute('data-theme', target);
    if (themeToggleLabel) {
      themeToggleLabel.textContent = target === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', target === 'dark' ? 'false' : 'true');
      themeToggle.dataset.theme = target;
      const icon = target === 'light' ? '☀' : '☾';
      themeToggle.setAttribute('data-theme-icon', icon);
      themeToggle.querySelector('[data-theme-icon-slot]').textContent = icon;
    }
  };

  const initTheme = () => {
    const stored = getStoredTheme();
    if (stored) {
      applyTheme(stored);
      return;
    }
    const initial = prefersLight.matches ? 'light' : 'dark';
    applyTheme(initial);
  };

  initTheme();

  prefersLight.addEventListener('change', (event) => {
    if (!getStoredTheme()) {
      applyTheme(event.matches ? 'light' : 'dark');
    }
  });

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      storeTheme(next);
    });
  }

  const closeNav = (focusToggle = false) => {
    if (!body.classList.contains('nav-open')) return;
    body.classList.remove('nav-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      if (focusToggle) {
        navToggle.focus();
      }
    }
    if (nav) {
      nav.setAttribute('aria-hidden', 'true');
    }
  };

  const openNav = () => {
    body.classList.add('nav-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'true');
    }
    if (nav) {
      nav.setAttribute('aria-hidden', 'false');
      const focusable = nav.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
      if (focusable) {
        focusable.focus({ preventScroll: true });
      }
    }
  };

  if (nav) {
    nav.setAttribute('aria-hidden', 'true');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (body.classList.contains('nav-open')) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (!body.classList.contains('nav-open')) return;
    const target = event.target;
    if (nav && nav.contains(target)) {
      return;
    }
    if (navToggle && navToggle.contains(target)) {
      return;
    }
    closeNav();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeNav(true);
    }
    if (event.key === 'Tab' && body.classList.contains('nav-open') && nav) {
      const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusables = Array.from(nav.querySelectorAll(focusableSelectors));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  if (closeOnResize) {
    const handleResize = (event) => {
      if (event.matches) {
        closeNav();
        if (nav) {
          nav.removeAttribute('aria-hidden');
        }
      } else if (nav) {
        nav.setAttribute('aria-hidden', body.classList.contains('nav-open') ? 'false' : 'true');
      }
    };
    closeOnResize.addEventListener('change', handleResize);
    handleResize(closeOnResize);
  }

  if (nav) {
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeNav(false));
    });
  }

  // Reveal-on-scroll animation (lightweight)
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Micro-interaction: gradient focus point for CTA buttons
  document.querySelectorAll('.cta-btn').forEach((btn) => {
    const setPosition = (event) => {
      const rect = btn.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--x', `${x}%`);
      btn.style.setProperty('--y', `${y}%`);
    };
    ['pointermove', 'touchmove'].forEach((evt) => btn.addEventListener(evt, setPosition, { passive: true }));
    btn.addEventListener('pointerenter', setPosition);
  });

  // Micro-interaction: ripple pulse on clickable elements
  const rippleTargets = document.querySelectorAll('button, .cta-btn, .filter-btn, .footer-actions a');
  rippleTargets.forEach((el) => {
    el.addEventListener('click', (event) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      el.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Tilt follow effect for featured cards
  const tiltCards = Array.from(document.querySelectorAll('[data-tilt]'));
  if (tiltCards.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tiltCards.forEach((card) => {
      const dampen = 30;
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        card.style.setProperty('--tilt-x', `${x / dampen}deg`);
        card.style.setProperty('--tilt-y', `${-y / dampen}deg`);
      }, { passive: true });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  // Header float + active section highlighting
  const header = document.querySelector('header');
  let lastScrollY = 0;
  if (header) {
    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      const isGoingDown = current > lastScrollY;
      header.classList.toggle('is-floating', current > 20);
      if (isGoingDown && current > 140) {
        header.classList.add('is-hidden');
      } else {
        header.classList.remove('is-hidden');
      }
      lastScrollY = current;
    }, { passive: true });
  }

  const sectionObserverTargets = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  if ('IntersectionObserver' in window && sectionObserverTargets.length && navLinks.length) {
    const navMap = new Map(
      navLinks.map((link) => [link.getAttribute('href').replace('#', ''), link])
    );
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const link = navMap.get(id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { threshold: 0.4 });
    sectionObserverTargets.forEach((section) => sectionObserver.observe(section));
  }

  // Simple filter for music cards
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const filterTarget = document.querySelector('[data-filter-target]');
  if (filterButtons.length && filterTarget) {
    const cards = Array.from(filterTarget.querySelectorAll('[data-category]'));
    const setFilter = (filter) => {
      cards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.style.display = matches ? '' : 'none';
      });
    };
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        setFilter(btn.dataset.filter || 'all');
      });
    });
    setFilter('all');
  }
})();
