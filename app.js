/* No dependencies, tracking, persistent form storage or autoplay. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = reduceMotion.matches;
  const motionButton = $('.motion-toggle');
  const applyMotion = () => {
    document.documentElement.classList.toggle('motion-paused', motionPaused);
    if (motionButton) {
      motionButton.hidden = false;
      motionButton.setAttribute('aria-pressed', String(motionPaused));
      motionButton.disabled = reduceMotion.matches;
      motionButton.textContent = reduceMotion.matches ? 'Reduzierte Bewegung aktiv' : motionPaused ? 'Animationen aktivieren' : 'Animationen pausieren';
    }
  };
  applyMotion();
  motionButton?.addEventListener('click', () => { motionPaused = !motionPaused; applyMotion(); });
  reduceMotion.addEventListener?.('change', event => { motionPaused = event.matches; applyMotion(); });

  // Native dialog provides focus containment and Escape handling.
  const menu = $('#mobileNav');
  const menuToggle = $('.menu-toggle');
  const closeMenu = () => { if (menu?.open) menu.close(); };
  menuToggle?.addEventListener('click', () => {
    if (!menu || typeof menu.showModal !== 'function') return;
    menu.showModal();
    document.body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    $('.menu-close', menu)?.focus();
  });
  $('.menu-close')?.addEventListener('click', closeMenu);
  menu?.addEventListener('close', () => {
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
  menu?.addEventListener('click', event => {
    if (event.target === menu) {
      const bounds = menu.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right) closeMenu();
    }
  });
  $$('a', menu || document.createElement('div')).forEach(link => link.addEventListener('click', closeMenu));
  window.matchMedia('(min-width: 801px)').addEventListener?.('change', event => { if (event.matches) closeMenu(); });

  // Reveal only below-the-fold content; fail safely to visible content.
  if ('IntersectionObserver' in window && !motionPaused) {
    const reveals = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-visible');
        reveals.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 30px 0px' });
    $$('.reveal').forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight - 50) {
        element.classList.add('reveal-pending');
        reveals.observe(element);
      }
    });
  }
  const progress = $('.reading-progress');
  const navLinks = $$('.desktop-nav [data-section]');
  const sections = navLinks.map(link => document.getElementById(link.dataset.section)).filter(Boolean);
  let scrollQueued = false;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
    document.body.classList.toggle('is-scrolled', window.scrollY > 20);
    let current = null;
    sections.forEach(section => { if (section.getBoundingClientRect().top <= 180) current = section.id; });
    navLinks.forEach(link => {
      if (link.dataset.section === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollQueued = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  // SoundCloud is loaded only after explicit interaction. No autoplay.
  $$('.load-player').forEach(button => button.addEventListener('click', () => {
    const area = button.closest('.player-area');
    const host = $('.player-host', area);
    const status = $('.player-status', area);
    if (!host || host.firstElementChild) return;
    const frame = document.createElement('iframe');
    frame.title = 'ZweiKlang – SoundCloud-Set am Opfinger Baggersee';
    frame.src = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2125890612&color=%23cf4929&auto_play=false&hide_related=true&show_comments=false&show_reposts=false&visual=false';
    frame.allow = 'autoplay';
    host.hidden = false;
    host.append(frame);
    button.hidden = true;
    $('.player-note', area).hidden = true;
    status.textContent = 'SoundCloud wird geladen. Falls der Player nicht erscheint, nutze „Auf SoundCloud hören“.';
    frame.addEventListener('load', () => { status.textContent = 'Starte die Wiedergabe im Player. Alternativ kannst du das Set direkt auf SoundCloud hören.'; });
  }));

  const search = $('#session-search');
  search?.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase().replace(/^#/, '');
    const cards = $$('.session-card');
    let count = 0;
    cards.forEach(card => {
      const text = (card.dataset.search + ' ' + card.textContent).toLowerCase();
      const matches = !query || text.includes(query) || (/^\d+$/.test(query) && Number(query) === Number(card.dataset.search.match(/\d+/)?.[0]));
      card.hidden = !matches;
      if (matches) { count++; card.classList.add('reveal-visible'); }
    });
    $('.empty-state').hidden = count !== 0;
    $('#search-status').textContent = `${count} ${count === 1 ? 'Session' : 'Sessions'} gefunden.`;
  });

  const labels = { name: 'Name', email: 'E-Mail', format: 'Anliegen', date: 'Wunschdatum', venue: 'Location / Ort', message: 'Nachricht' };
  const prepareRequest = form => [...new FormData(form).entries()]
    .filter(([, value]) => String(value).trim())
    .map(([name, value]) => `${labels[name] || name}: ${String(value).trim()}`).join('\n\n');
  $$('.booking-form').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const body = prepareRequest(form);
      const subject = `ZweiKlang · ${form.elements.format.value}`;
      window.location.href = `mailto:zweiklangkontakt@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      $('.form-status', form).textContent = 'Bitte prüfe die Anfrage in deinem E-Mail-Programm und sende sie dort ab. Öffnet sich nichts? Unten kannst du den Text kopieren.';
    });
    $('.copy-request', form)?.addEventListener('click', async () => {
      const text = `An: zweiklangkontakt@gmail.com\nBetreff: ZweiKlang · ${form.elements.format.value}\n\n${prepareRequest(form)}`;
      const status = $('.form-status', form);
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(text);
        status.textContent = 'Anfrage kopiert. Du kannst sie jetzt in deine E-Mail einfügen.';
      } catch {
        const output = $('.copy-output', form);
        output.hidden = false;
        output.value = text;
        output.focus();
        output.select();
        status.textContent = 'Der Text ist markiert. Kopiere ihn und füge ihn in deine E-Mail ein.';
      }
    });
  });
  $$('[data-booking]').forEach(link => link.addEventListener('click', () => {
    const select = $('.booking-form select[name="format"]');
    if (select) select.value = link.dataset.booking;
  }));
  $$('img').forEach(img => {
    const fail = () => img.parentElement.classList.add('image-unavailable');
    img.addEventListener('error', fail, { once: true });
    if (img.complete && img.naturalWidth === 0) fail();
  });
  $$('[data-year]').forEach(element => { element.textContent = String(new Date().getFullYear()); });
})();
