(function () {
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  const closeNav = () => {
    if (!navList) return;
    navList.classList.remove('open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  };

  const openNav = () => {
    if (!navList) return;
    navList.classList.add('open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
  };

  if (navToggle && navList) {
    navToggle.addEventListener('click', (event) => {
      event.preventDefault();
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (!navList || !navList.classList.contains('open')) return;
    if (navList.contains(event.target) || (navToggle && navToggle.contains(event.target))) return;
    closeNav();
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
