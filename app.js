(() => {
  const page = document.body.dataset.page;
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');

  if (nav) {
    const current = page === 'about' ? 'about.html' : page === 'programs' ? 'programs.html' : page === 'volunteer' ? 'volunteer.html' : '';
    const activeLink = [...nav.querySelectorAll('a')].find((link) => link.getAttribute('href') === current);
    if (activeLink) activeLink.setAttribute('aria-current', 'page');
  }

  if (menu && nav) {
    const setMenu = (open, instant = false) => {
      if (instant) nav.classList.add('menu-instant');
      nav.classList.toggle('is-open', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.textContent = open ? 'Close' : 'Menu';
      if (instant) requestAnimationFrame(() => requestAnimationFrame(() => nav.classList.remove('menu-instant')));
    };

    menu.addEventListener('click', (event) => setMenu(!nav.classList.contains('is-open'), event.detail === 0));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false, true);
        menu.focus();
      }
    });
    document.addEventListener('pointerdown', (event) => {
      if (nav.classList.contains('is-open') && !nav.contains(event.target) && !menu.contains(event.target)) setMenu(false);
    });
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || !window.ScrollTrigger || reducedMotion) return;

  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add('motion-ready');
  const mobile = window.matchMedia('(max-width: 800px)').matches;
  const smallTravel = mobile ? 10 : 14;
  const headlineTravel = mobile ? 16 : 26;

  const revealEditorial = (section, eyebrow, heading, following = []) => {
    if (!section || !heading) return;
    const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 83%', once: true } });
    timeline.eventCallback('onComplete', () => section.classList.add('reveal-complete'));
    if (eyebrow) timeline.from(eyebrow, { y: smallTravel, autoAlpha: 0, duration: .55, ease: 'power3.out' }, 0);
    timeline.from(heading, { y: headlineTravel, autoAlpha: 0, duration: .82, ease: 'power3.out' }, eyebrow ? .1 : 0);
    if (following.length) timeline.from(following, { y: smallTravel, autoAlpha: 0, duration: .65, stagger: .08, ease: 'power3.out' }, .28);
  };

  gsap.from('.site-header', { y: -12, autoAlpha: 0, duration: .55, ease: 'power3.out' });

  if (page === 'volunteer') {
    const hero = document.querySelector('.volunteer-hero');
    const [eyebrow, headline, description] = hero.querySelector('div:first-child').children;
    const poster = hero.querySelector('.volunteer-poster');
    const intro = gsap.timeline();
    intro.from(eyebrow, { y: smallTravel, autoAlpha: 0, duration: .58, ease: 'power3.out' }, .08)
      .from(headline, { y: headlineTravel, autoAlpha: 0, duration: .92, ease: 'power3.out' }, .2)
      .from(description, { y: smallTravel, autoAlpha: 0, duration: .72, ease: 'power3.out' }, .4)
      .from(poster, { y: mobile ? 10 : 18, autoAlpha: 0, duration: .95, ease: 'power3.out' }, .27);

    const posterType = poster.querySelector('span');
    const lines = posterType.innerText.split(/\n/).map((line) => line.trim()).filter(Boolean);
    posterType.setAttribute('aria-label', 'Your time can change a day');
    posterType.replaceChildren(...lines.map((line) => {
      const word = document.createElement('span');
      word.className = 'poster-word';
      word.setAttribute('aria-hidden', 'true');
      word.textContent = line;
      return word;
    }));
    const words = posterType.querySelectorAll('.poster-word');
    gsap.set(words, { y: mobile ? 9 : 16, scale: .97, opacity: .25, transformOrigin: 'left center' });
    gsap.timeline({ scrollTrigger: { trigger: poster, start: 'top 88%', end: 'bottom 28%', scrub: .55 } })
      .to(words, { y: 0, scale: 1, opacity: 1, stagger: .24, duration: 1, ease: 'none' });

    const ways = document.querySelector('.ways');
    revealEditorial(ways, ways.querySelector('.eyebrow'), ways.querySelector('h2'));
    ways.querySelectorAll('.ways-grid article').forEach((article) => {
      const [number, title, description] = article.children;
      gsap.timeline({ scrollTrigger: { trigger: article, start: 'top 87%', once: true, onEnter: () => article.classList.add('is-visible') }, onComplete: () => article.classList.add('reveal-complete') })
        .from(number, { y: 8, autoAlpha: 0, duration: .5, ease: 'power3.out' }, 0)
        .from(title, { y: mobile ? 12 : 18, autoAlpha: 0, duration: .7, ease: 'power3.out' }, .09)
        .from(description, { y: 10, autoAlpha: 0, duration: .65, ease: 'power3.out' }, .19);
    });
    const contact = document.querySelector('.contact-panel');
    revealEditorial(contact, contact.querySelector('.eyebrow'), contact.querySelector('h2'), [contact.querySelector('p:not(.eyebrow)'), contact.querySelector('.button')]);
  } else {
    const hero = document.querySelector('.hero-copy, .page-hero');
    if (hero) gsap.from([...hero.children], { y: mobile ? 14 : 25, autoAlpha: 0, duration: .75, stagger: .08, ease: 'power3.out', delay: .08 });

    const homeImage = document.querySelector('.hero-art > img');
    if (homeImage) gsap.from(homeImage, { clipPath: 'inset(0 0 0 100%)', duration: 1.25, ease: 'expo.out', delay: .18 });

    const scrub = document.querySelector('.scrub-text');
    if (scrub) {
      const original = scrub.textContent.trim();
      scrub.setAttribute('aria-label', original);
      scrub.innerHTML = original.split(/\s+/).map((word) => `<span aria-hidden="true">${word}</span>`).join(' ');
      const words = scrub.querySelectorAll('span');
      gsap.set(words, { opacity: .18 });
      gsap.to(words, { opacity: 1, stagger: .075, ease: 'none', scrollTrigger: { trigger: scrub, start: 'top 82%', end: 'bottom 55%', scrub: true } });
    }

    const programHeading = document.querySelector('.section-heading');
    if (programHeading) revealEditorial(programHeading, programHeading.querySelector('.eyebrow'), programHeading.querySelector('h2'), [programHeading.querySelector('.text-link')]);
    const bento = document.querySelector('.bento-grid');
    if (bento) gsap.from(bento.children, { y: mobile ? 12 : 20, autoAlpha: 0, duration: .67, stagger: .075, ease: 'power3.out', scrollTrigger: { trigger: bento, start: 'top 84%', once: true } });

    const stackHeading = document.querySelector('.stack-heading');
    if (stackHeading) revealEditorial(stackHeading, stackHeading.querySelector('.eyebrow'), stackHeading.querySelector('h2'), [stackHeading.querySelector('p:last-child')]);
    gsap.utils.toArray('.stack-card').forEach((card, index) => {
      if (index) gsap.to(card, { y: -65 * index, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 35%', scrub: true } });
    });

    document.querySelectorAll('.program-row').forEach((row) => {
      const copy = row.querySelector('.program-copy');
      revealEditorial(row, copy.querySelector('.eyebrow'), copy.querySelector('h2'), [copy.querySelector('p:not(.eyebrow)'), copy.querySelector('.text-link')]);
    });
    document.querySelectorAll('.program-image img, .about-image img, .testimonial-image img').forEach((image) => {
      gsap.from(image, { scale: 1.04, duration: 1.1, ease: 'power2.out', scrollTrigger: { trigger: image.parentElement, start: 'top 84%', once: true } });
    });
    document.querySelectorAll('.values article').forEach((card) => {
      gsap.from(card.children, { y: mobile ? 10 : 16, autoAlpha: 0, duration: .64, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 86%', once: true } });
    });
    const quote = document.querySelector('.testimonial blockquote');
    if (quote) gsap.from(quote, { y: headlineTravel, autoAlpha: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: quote, start: 'top 82%', once: true } });
  }

  const cta = document.querySelector('.cta-band');
  if (cta) revealEditorial(cta, cta.querySelector('.eyebrow'), cta.querySelector('h2'), [cta.querySelector('.button')]);
})();
