// Все ссылки выбора мессенджера находятся здесь.
const MESSENGER_URLS = {
  telegram: 'https://t.me/Okonniiserwis',
  max: 'MAX_URL', // Замените только эту строку на настоящую ссылку MAX.
  whatsapp: 'https://wa.me/79160877380?text=Здравствуйте%2C%20Юрий.%20Хочу%20показать%20проблему%20с%20окном.%20Отправляю%20фото.',
};

const messengerModal = document.getElementById('messenger-modal');
let photoTrigger;
for (const name of ['telegram', 'whatsapp']) {
  messengerModal.querySelector(`[data-messenger="${name}"]`).href = MESSENGER_URLS[name];
}
const maxOption = messengerModal.querySelector('[data-messenger="max"]');
if (MESSENGER_URLS.max !== 'MAX_URL') {
  const maxLink = document.createElement('a');
  maxLink.className = maxOption.className;
  maxLink.dataset.messenger = 'max';
  maxLink.href = MESSENGER_URLS.max;
  maxLink.innerHTML = maxOption.innerHTML;
  maxOption.replaceWith(maxLink);
} else {
  maxOption.addEventListener('click', () => {
    messengerModal.querySelector('.messenger-status').hidden = false;
  });
}

document.querySelectorAll('[data-photo-cta]').forEach(trigger => {
  trigger.addEventListener('click', event => {
    event.preventDefault();
    photoTrigger = trigger;
    messengerModal.querySelector('.messenger-status').hidden = true;
    messengerModal.showModal();
    document.body.classList.add('messenger-open');
    messengerModal.querySelector('[data-messenger="telegram"]').focus();
  });
});
messengerModal.querySelector('.messenger-close').addEventListener('click', () => messengerModal.close());
messengerModal.addEventListener('click', event => {
  const bounds = messengerModal.getBoundingClientRect();
  if (event.target === messengerModal &&
      (event.clientX < bounds.left || event.clientX > bounds.right ||
       event.clientY < bounds.top || event.clientY > bounds.bottom)) messengerModal.close();
});
// Native dialog handles Escape and keeps keyboard focus inside the modal.
messengerModal.addEventListener('close', () => {
  document.body.classList.remove('messenger-open');
  photoTrigger?.focus();
});

// Микроанимации: контент без JavaScript всегда остаётся видимым.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver;
if (!motionPreference.matches) {
  const heroElements = document.querySelectorAll('.hero .eyebrow, .hero h1, .hero-description, .hero-actions, .hero .master-photo');
  heroElements.forEach((element, index) => {
    element.style.setProperty('--motion-delay', `${index * 55}ms`);
    element.classList.add('motion-hero');
    element.addEventListener('animationend', () => {
      element.classList.remove('motion-hero');
      element.style.removeProperty('--motion-delay');
    }, { once: true });
  });

  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    const revealElements = document.querySelectorAll(
      'main .section .section-heading, .reviews-heading, .problem-card, .service-card, .trust .master-visual, .trust-copy, .review-card, .reviews-source, .workflow-card, .workflow-actions'
    );
    revealElements.forEach(element => {
      // Уже видимый контент, включая переход по якорю, не скрываем.
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      const siblings = [...element.parentElement.children];
      const index = siblings.indexOf(element);
      const isCard = element.matches('.problem-card, .service-card, .review-card, .workflow-card');
      element.style.setProperty('--motion-delay', `${isCard ? Math.min(index, 3) * 60 : 0}ms`);
      element.classList.add('motion-reveal');
      revealObserver.observe(element);
    });
  }
}
motionPreference.addEventListener('change', event => {
  if (!event.matches) return;
  revealObserver?.disconnect();
  document.querySelectorAll('.motion-reveal, .motion-hero').forEach(element => {
    element.classList.remove('motion-reveal', 'motion-hero', 'is-visible');
    element.style.removeProperty('--motion-delay');
  });
});
