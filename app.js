(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (menu && nav) menu.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); menu.setAttribute('aria-expanded', String(open)); menu.textContent = open ? 'Close' : 'Menu'; });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || !window.ScrollTrigger || reducedMotion) return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.site-header', { y: -18, opacity: 0, duration: .55, ease: 'expo.out' });

  const intro = document.querySelectorAll('.hero-copy > *, .page-hero > *, .volunteer-hero > *');
  if (intro.length) gsap.from(intro, { y: 28, opacity: 0, duration: .72, stagger: .075, ease: 'expo.out', delay: .08 });

  const heroImage = document.querySelector('.hero-art > img');
  if (heroImage) gsap.from(heroImage, { y: 30, scale: .96, opacity: 0, duration: 1.05, ease: 'expo.out', delay: .18 });

  document.querySelectorAll('.program-image, .testimonial-image, .about-image').forEach((el) => {
    gsap.fromTo(el, { scale: .92, opacity: .25 }, {
      scale: 1,
      opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 88%', end: 'bottom 28%', scrub: true },
    });
  });

  const scrub = document.querySelector('.scrub-text');
  if (scrub) {
    const words = scrub.textContent.trim().split(/\s+/);
    scrub.innerHTML = words.map((word) => `<span>${word}</span>`).join(' ');
    const wordNodes = scrub.querySelectorAll('span');
    gsap.set(wordNodes, { opacity: .14 });
    gsap.to(wordNodes, { opacity: 1, stagger: .075, scrollTrigger: { trigger: scrub, start: 'top 82%', end: 'bottom 55%', scrub: true } });
  }

  const cards = gsap.utils.toArray('.stack-card');
  cards.forEach((card, index) => {
    if (index) gsap.to(card, { y: -65 * index, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 35%', scrub: true } });
  });

  gsap.utils.toArray('.bento, .ways-grid article, .values article').forEach((el) => {
    gsap.from(el, { y: 24, opacity: 0, duration: .58, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
})();
