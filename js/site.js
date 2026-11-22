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
      var subject = form.querySelector('#contact-subject-prefix').textContent.trim() + ' - ' + serviceName;
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

  function initCollage() {
    document.querySelectorAll('.tour-collage').forEach(function (collage) {
      var photos = collage.querySelectorAll('.tour-collage__photo');
      photos.forEach(function (photo) {
        photo.addEventListener('click', function () {
          photos.forEach(function (item) {
            var selected = item === photo;
            item.classList.toggle('is-front', selected);
            item.setAttribute('aria-pressed', String(selected));
          });
        });
      });
    });
  }

  function initReviews() {
    var section = document.querySelector('.reviews-section');
    if (!section) {
      return;
    }

    var track = section.querySelector('.reviews-track');
    var cards = Array.from(track.querySelectorAll('.review-card'));
    var filters = section.querySelectorAll('[data-review-filter]');
    var previous = section.querySelector('[data-review-prev]');
    var next = section.querySelector('[data-review-next]');
    var range = section.querySelector('[data-review-range]');
    var scrollTimer;
    var resizeTimer;

    section.classList.add('is-carousel');
    section.querySelector('.reviews-filters').hidden = false;
    section.querySelector('.reviews-controls').hidden = false;
    section.querySelector('.reviews-position').hidden = false;

    function visibleCards() {
      return cards.filter(function (card) {
        return !card.hidden;
      });
    }

    function updatePosition() {
      var visible = visibleCards();
      var viewport = track.getBoundingClientRect();
      var inView = [];
      visible.forEach(function (card, index) {
        var box = card.getBoundingClientRect();
        var overlap = Math.min(box.right, viewport.right) - Math.max(box.left, viewport.left);
        if (overlap >= Math.min(box.width, viewport.width) * 0.5) {
          inView.push(index + 1);
        }
      });

      if (inView.length) {
        var first = inView[0];
        var last = inView[inView.length - 1];
        range.textContent = (first === last ? first : first + '–' + last) + ' / ' + visible.length;
      }
      previous.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
    }

    function updateQuotes() {
      var more = section.querySelector('[data-review-more-label]').textContent;
      var less = section.querySelector('[data-review-less-label]').textContent;
      visibleCards().forEach(function (card) {
        var quote = card.querySelector('.review-quote');
        var button = card.querySelector('.review-quote-toggle');
        var expanded = button.getAttribute('aria-expanded') === 'true';
        if (expanded) {
          quote.classList.remove('is-collapsed');
          button.hidden = false;
          button.textContent = less;
          return;
        }

        quote.classList.add('is-collapsed');
        var truncated = quote.scrollHeight > quote.clientHeight + 1;
        button.hidden = !truncated;
        button.textContent = more;
        if (!truncated) {
          quote.classList.remove('is-collapsed');
        }
      });
    }

    function move(direction) {
      var visible = visibleCards();
      if (visible.length < 2) {
        return;
      }
      var step = visible[1].offsetLeft - visible[0].offsetLeft;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var perPage = Math.max(1, Math.floor((track.clientWidth + gap + 1) / step));
      track.scrollBy({ left: direction * step * perPage, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }

    previous.addEventListener('click', function () { move(-1); });
    next.addEventListener('click', function () { move(1); });

    filters.forEach(function (button) {
      button.addEventListener('click', function () {
        var source = button.dataset.reviewFilter;
        cards.forEach(function (card) {
          card.hidden = source !== 'all' && card.dataset.reviewSource !== source;
        });
        filters.forEach(function (filter) {
          filter.setAttribute('aria-pressed', String(filter === button));
        });
        track.scrollTo({ left: 0, behavior: 'auto' });
        updateQuotes();
        updatePosition();
      });
    });

    cards.forEach(function (card) {
      var button = card.querySelector('.review-quote-toggle');
      button.addEventListener('click', function () {
        var expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        updateQuotes();
      });
    });

    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updatePosition, 120);
    }, { passive: true });

    track.addEventListener('keydown', function (event) {
      if (event.target !== track) {
        return;
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        move(event.key === 'ArrowLeft' ? -1 : 1);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        track.scrollTo({ left: event.key === 'Home' ? 0 : track.scrollWidth, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      }
    });

    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        updateQuotes();
        updatePosition();
      }, 120);
    });
    document.addEventListener('site:languagechange', function () {
      updateQuotes();
      updatePosition();
    });

    updateQuotes();
    updatePosition();
    if (document.fonts) {
      document.fonts.ready.then(function () {
        updateQuotes();
        updatePosition();
      });
    }
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
      initCollage();
      initReviews();
      initReveal();
    });
  } else {
    initContactForm();
    initCollage();
    initReviews();
    initReveal();
  }
})();
