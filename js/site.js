(function () {
  var STAGGER_MS = 80;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function applyReveal(el, effect, delay, duration) {
    el.classList.add('reveal', 'reveal--' + effect);
    el.style.setProperty('--reveal-delay', '0s');
    el.style.setProperty('--reveal-duration', (duration / 1000) + 's');
    el.dataset.revealDelay = String(delay);
  }

  function showElement(el) {
    if (el.classList.contains('is-visible')) {
      return;
    }

    var delay = parseInt(el.dataset.revealDelay || '0', 10);

    setTimeout(function () {
      el.classList.add('is-visible');
    }, delay);
  }

  function showElementsImmediately(elements) {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      elements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        elements.forEach(showElement);
      });
    });
  }

  function observeElements(elements) {
    if (!elements.length) {
      return;
    }

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      elements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          showElement(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px -2% 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function register(selector, effect, options) {
    options = options || {};
    var nodes = document.querySelectorAll(selector);
    var delay = options.delay || 0;
    var duration = options.duration || 600;
    var stagger = options.stagger || 0;
    var onLoad = options.onLoad === true;
    var elements = [];

    nodes.forEach(function (node, index) {
      var itemDelay = delay + Math.min(index * stagger, 240);
      applyReveal(node, effect, itemDelay, duration);
      elements.push(node);
    });

    if (onLoad) {
      showElementsImmediately(elements);
    } else {
      observeElements(elements);
    }

    return elements;
  }

  function initHeroReveal() {
    // Keep the portrait, headline, and CTA visible immediately.
    register('.hero-services > div', 'fade-up', {
      delay: 100,
      duration: 600,
      stagger: STAGGER_MS,
      onLoad: true
    });
  }

  function initScrollReveal() {
    register('.divider', 'fade-in');
    register('.section-heading', 'fade-up');
    register('.section-subheading', 'fade-in', { delay: 80 });
    register('.bio-split__photo', 'fade-in');
    register('.bio-split__content > p, .bio-split__content > a, .academic-background', 'fade-in', { delay: 80, stagger: STAGGER_MS });
    register('.item-list > li', 'fade-up', { stagger: STAGGER_MS });
    register('.project-group', 'fade-up', { stagger: STAGGER_MS });
    register('.site-footer', 'fade-in');
  }

  function initInnerPageReveal() {
    register('.back-link', 'fade-in', { delay: 0, duration: 800, onLoad: true });
    register('.inner-page .post-header', 'fade-up', { delay: 150, duration: 1000, onLoad: true });
    register('.inner-page .post-content > *', 'fade-in', {
      delay: 300,
      duration: 1500,
      stagger: 80,
      onLoad: true
    });
    register('.inner-page .site-footer', 'fade-in', { delay: 500, duration: 1500, onLoad: true });
  }

  function initContactForm() {
    var form = document.querySelector('.contact-form');
    if (!form) {
      return;
    }

    document.querySelectorAll('[data-service]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        form.querySelector('[name="service"]').value = link.dataset.service;
        document.querySelector('#contact-section').scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
        form.querySelector('[name="name"]').focus({ preventScroll: true });
      });
    });

    form.addEventListener('input', function (event) {
      if (event.target.name === 'name' || event.target.name === 'message') {
        event.target.setCustomValidity('');
      }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      ['name', 'message'].forEach(function (field) {
        var input = form.querySelector('[name="' + field + '"]');
        var error = form.querySelector('#contact-required-error').textContent.trim();
        input.setCustomValidity(input.value.trim() ? '' : error);
      });
      if (!form.reportValidity()) {
        return;
      }

      var data = new FormData(form);
      var service = form.querySelector('[name="service"]');
      var serviceName = service.options[service.selectedIndex].textContent.trim();
      var subject = form.querySelector('#contact-subject-prefix').textContent.trim() + ' — ' + serviceName;
      var body = ['name', 'email', 'service', 'message'].map(function (field) {
        var input = form.querySelector('[name="' + field + '"]');
        var label = form.querySelector('label[for="' + input.id + '"]').textContent.trim();
        var value = field === 'service' ? serviceName : String(data.get(field) || '').trim();
        return label + ':' + (field === 'message' ? '\r\n' : ' ') + value;
      }).join('\r\n\r\n');

      window.location.href = form.getAttribute('action') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      form.querySelector('#contact-form-status').hidden = false;
    });
  }

  function initReveal() {
    document.body.classList.add('js-reveal');

    if (document.querySelector('.hero-split')) {
      initHeroReveal();
      initScrollReveal();
    } else if (document.querySelector('.inner-page')) {
      initInnerPageReveal();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initContactForm();
      initReveal();
    });
  } else {
    initContactForm();
    initReveal();
  }
})();
