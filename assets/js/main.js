(function () {
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');

  document.body.classList.add('nav-ready');

  const closeNav = () => {
    if (mobileNav) {
      mobileNav.classList.remove('is-open');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
    if (mobileNavBackdrop) mobileNavBackdrop.setAttribute('aria-hidden', 'true');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  const openNav = () => {
    if (mobileNav) {
      mobileNav.classList.add('is-open');
      mobileNav.setAttribute('aria-hidden', 'false');
    }
    if (mobileNavBackdrop) mobileNavBackdrop.setAttribute('aria-hidden', 'false');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  };

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', (event) => {
      event.preventDefault();
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      expanded ? closeNav() : openNav();
    });
  }

  mobileNavClose && mobileNavClose.addEventListener('click', closeNav);

  mobileNavBackdrop && mobileNavBackdrop.addEventListener('click', closeNav);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) closeNav();
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (!href || href.length < 2) return;
    anchor.addEventListener('click', (event) => {
      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeNav();
      }
    });
  });

  // Active state for same-page sections
  const sectionTargets = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  if ('IntersectionObserver' in window && sectionTargets.length && navLinks.length) {
    const navMap = navLinks.reduce((map, link) => {
      const key = link.getAttribute('href').slice(1);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(link);
      return map;
    }, new Map());

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const links = navMap.get(entry.target.id);
        if (!links || !links.length) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('is-active'));
          links.forEach((l) => l.classList.add('is-active'));
        }
      });
    }, { threshold: 0.45 });
    sectionTargets.forEach((section) => sectionObserver.observe(section));
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  const handleTilt = (event, card) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 4;
    const rotateX = ((y / rect.height) - 0.5) * -4;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  document.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('pointermove', (e) => handleTilt(e, card));
    card.addEventListener('pointerleave', () => card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)');
  });

  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');

  const getConsent = () => {
    try { return localStorage.getItem('zweiklangConsent'); } catch (err) { return null; }
  };
  const setConsent = (value) => {
    try { localStorage.setItem('zweiklangConsent', value); } catch (err) { /* ignore */ }
  };

  const hideCookie = () => { if (cookieBanner) cookieBanner.classList.add('hidden'); };

  if (getConsent()) hideCookie();

  cookieAccept && cookieAccept.addEventListener('click', () => {
    setConsent('accepted');
    hideCookie();
  });

  cookieDecline && cookieDecline.addEventListener('click', () => {
    setConsent('necessary');
    hideCookie();
  });
})();
