(() => {
  'use strict';
  const body = document.body;
  const page = body.dataset.page;
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const header = document.querySelector('.site-header');
  const mobileNav = window.matchMedia('(max-width: 800px)');

  // Navigation remains usable independently of the animation libraries.
  if (menu && nav) {
    body.classList.add('nav-ready');
    const setMenu = (open, instant = false) => {
      if (instant) nav.classList.add('menu-instant');
      nav.classList.toggle('is-open', open);
      nav.inert = mobileNav.matches && !open;
      menu.setAttribute('aria-expanded', String(open));
      menu.textContent = open ? 'Close' : 'Menu';
      if (instant) requestAnimationFrame(() => requestAnimationFrame(() => nav.classList.remove('menu-instant')));
    };
    setMenu(false, true);
    menu.addEventListener('click', (event) => setMenu(!nav.classList.contains('is-open'), event.detail === 0));
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false, true);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false, true);
        menu.focus();
      }
    });
    document.addEventListener('pointerdown', (event) => {
      if (nav.classList.contains('is-open') && !header.contains(event.target)) setMenu(false);
    });
    header.addEventListener('focusout', (event) => {
      if (event.relatedTarget && !header.contains(event.relatedTarget)) setMenu(false, true);
    });
    mobileNav.addEventListener('change', () => setMenu(false, true));
  }

  if (!window.gsap || !window.ScrollTrigger || !gsap.matchMedia) return;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  const focusReveals = new Map();

  // Each media context automatically reverts styles, pins, and triggers on changes.
  media.add({
    reduced: '(prefers-reduced-motion: reduce)',
    desktop: '(min-width: 801px)',
    mobile: '(max-width: 800px)',
    compact: '(max-width: 650px)'
  }, (context) => {
    if (context.conditions.reduced) return;
    const mobile = context.conditions.mobile;
    const travel = mobile ? 12 : 24;
    const cleanups = [];
    const reveal = (block, targets = [block], delay = 0) => {
      if (!block || block.dataset.revealed === 'true' || !targets.length) return;
      const tween = gsap.from(targets, {
        y: travel, autoAlpha: 0, duration: .75, stagger: .08,
        delay, ease: 'power3.out',
        scrollTrigger: { trigger: block, start: 'top 92%', once: true },
        onComplete: () => {
          block.dataset.revealed = 'true';
          focusReveals.delete(block);
        }
      });
      focusReveals.set(block, tween);
      cleanups.push(() => focusReveals.delete(block));
    };

    document.querySelectorAll('[data-reveal-group]').forEach((group) => reveal(group, [...group.children]));
    document.querySelectorAll('[data-reveal]').forEach((item) => reveal(item));
    document.querySelectorAll('[data-photo]').forEach((wrapper) => {
      const image = wrapper.querySelector('img');
      if (!image) return;
      gsap.fromTo(image, { scale: 1.045 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: wrapper, start: 'top bottom', end: 'bottom top', scrub: .65 }
      });
    });
    const cta = document.querySelector('.cta-band');
    if (cta && !cta.hasAttribute('data-reveal-group')) reveal(cta, [...cta.children]);

    if (page === 'home') {
      const heroPhoto = document.querySelector('.home-hero-media');
      if (heroPhoto && heroPhoto.dataset.revealed !== 'true') {
        gsap.from(heroPhoto, {
          clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power3.out', delay: .12,
          onComplete: () => { heroPhoto.dataset.revealed = 'true'; }
        });
      }
      const scrub = document.querySelector('.scrub-text');
      if (scrub) {
        const original = scrub.textContent.trim();
        const accessible = document.createElement('span');
        accessible.className = 'sr-only';
        accessible.textContent = original;
        const visual = document.createElement('span');
        visual.setAttribute('aria-hidden', 'true');
        original.split(/\s+/).forEach((word, index) => {
          if (index) visual.append(' ');
          const span = document.createElement('span');
          span.textContent = word;
          visual.append(span);
        });
        scrub.replaceChildren(accessible, visual);
        gsap.fromTo(visual.children, { opacity: .55 }, {
          opacity: 1, stagger: .065, ease: 'none',
          scrollTrigger: { trigger: scrub, start: 'top 88%', end: 'bottom 60%', scrub: .4 }
        });
        cleanups.push(() => scrub.replaceChildren(document.createTextNode(original)));
      }
      if (context.conditions.desktop) {
        const heading = document.querySelector('.stack-heading');
        const cards = document.querySelector('.stack-cards');
        ScrollTrigger.create({
          trigger: cards, start: 'top 120px', end: 'bottom 55%',
          pin: heading, pinSpacing: false, invalidateOnRefresh: true
        });
        document.querySelectorAll('.stack-card').forEach((card, index) => {
          if (index) gsap.to(card, {
            y: -65 * index, ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 35%', scrub: true, invalidateOnRefresh: true }
          });
        });
      }
    } else if (page === 'events') {
      const hero = document.querySelector('.events-hero');
      reveal(hero, [...hero.querySelector('.events-hero-content').children]);
      gsap.fromTo('.events-hero-photo', { scale: 1.05, opacity: 1 }, {
        scale: 1, opacity: .35, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .6 }
      });
      document.querySelectorAll('.event-year').forEach((year) => {
        const heading = year.querySelector('.event-year-heading');
        const index = year.querySelector('.event-index');
        reveal(heading, [...heading.children]);
        reveal(index, [...index.children]);
        year.querySelectorAll('.event-story').forEach((story, storyIndex) => {
          if (storyIndex && !context.conditions.compact) {
            gsap.fromTo(story, { y: 36, scale: .99 }, {
              y: 0, scale: 1, ease: 'none',
              scrollTrigger: { trigger: story, start: 'top bottom', end: 'top 56%', scrub: .6 }
            });
          }
          const copy = story.querySelector('.event-story-copy');
          reveal(copy, [...copy.children]);
          story.querySelectorAll('.event-story-media img').forEach((image) => {
            gsap.fromTo(image, { scale: 1.035 }, {
              scale: 1, ease: 'none',
              scrollTrigger: { trigger: story, start: 'top bottom', end: 'bottom top', scrub: .6 }
            });
          });
        });
      });
    } else if (page === 'team') {
      const hero = document.querySelector('.team-hero');
      reveal(hero, [...hero.children]);
      document.querySelectorAll('.team-profile').forEach((profile, index) => reveal(profile, [profile], mobile ? 0 : (index % 2) * .1));
    }

    // Photos have reserved dimensions; refreshing on lazy image loads can interrupt
    // a native anchor scroll. Only font metric changes need an explicit refresh.
    const refresh = () => ScrollTrigger.refresh();
    let active = true;
    if (document.fonts) document.fonts.ready.then(() => { if (active) refresh(); });
    return () => {
      active = false;
      cleanups.forEach((cleanup) => cleanup());
    };
  });

  // Keyboard visitors never have to wait for an entrance reveal to reach a link.
  document.addEventListener('focusin', (event) => {
    focusReveals.forEach((tween, block) => {
      if (block.contains(event.target)) tween.progress(1);
    });
  });
})();
