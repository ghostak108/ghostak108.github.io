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

  const countdownEl = document.querySelector('[data-countdown]');
  if (countdownEl) {
    const targetDate = countdownEl.getAttribute('data-countdown');
    const parsed = targetDate ? new Date(targetDate) : null;
    if (parsed && !Number.isNaN(parsed.valueOf())) {
      const updateCountdown = () => {
        const now = new Date();
        const diff = parsed.getTime() - now.getTime();
        if (diff <= 0) {
          countdownEl.textContent = 'The event is live today!';
          countdownEl.classList.add('is-live');
          return;
        }
        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        countdownEl.classList.remove('is-live');
      };
      updateCountdown();
      setInterval(updateCountdown, 1000);
    }
  }
})();
