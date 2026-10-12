/**
 * EliteEvents Co. — Main JavaScript
 * Handles: navbar scroll, fade-in animations, portfolio filter,
 * contact form submission, newsletter form, smooth scroll, copyright year.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. Copyright Year ──────────────────────────────────────────────────────
  function initCopyrightYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ─── 2. Navbar Scroll Behavior ──────────────────────────────────────────────
  function initNavbarScroll() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;
    const scrollHandler = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler(); // apply immediately in case page is already scrolled
  }

  // ─── 3. Fade-In IntersectionObserver ────────────────────────────────────────
  function initFadeInObserver() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  // ─── 4. Smooth Scroll for Anchor Links ──────────────────────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navbarHeight = document.getElementById('mainNavbar')?.offsetHeight || 70;
          const top = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  // ─── 5. Portfolio Filter ────────────────────────────────────────────────────
  function initPortfolioFilter() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.portfolio-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        cards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          if (match) {
            card.classList.remove('d-none');
            // Re-trigger fade-in animation for newly visible cards
            card.classList.remove('visible');
            requestAnimationFrame(() => {
              requestAnimationFrame(() => card.classList.add('visible'));
            });
          } else {
            card.classList.add('d-none');
          }
        });
      });
    });
  }

  // ─── 6. Contact Form ────────────────────────────────────────────────────────
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = document.getElementById('submit-btn');
    const alertContainer = document.getElementById('form-alert');

    function showAlert(type, message) {
      const iconClass = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
      alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
          <i class="bi ${iconClass} me-2"></i>${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
      alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function setLoading(isLoading) {
      if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending\u2026';
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Enquiry <i class="bi bi-send-fill ms-2"></i>';
      }
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      alertContainer.innerHTML = '';

      // Trigger Bootstrap native validation UI
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      // Gather form data
      const data = {
        fullName:      (form.fullName?.value || '').trim(),
        email:         (form.email?.value || '').trim(),
        phone:         (form.phone?.value || '').trim(),
        eventType:     form.eventType?.value || '',
        eventDate:     form.eventDate?.value || '',
        guestCount:    form.guestCount?.value || '',
        budget:        form.budget?.value || '',
        eventLocation: (form.eventLocation?.value || '').trim(),
        message:       (form.message?.value || '').trim(),
        website:       form.website?.value || '',  // honeypot
      };

      // Honeypot check — if filled, silently reject (appear to succeed to bots)
      if (data.website) {
        showAlert('success', "Thank you! Your enquiry has been received. We\u2019ll contact you within 24 hours.");
        form.reset();
        return;
      }

      setLoading(true);

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        let result;
        try {
          result = await response.json();
        } catch {
          throw new Error('Invalid server response. Please try again.');
        }

        if (result.success) {
          showAlert('success', result.message || "Thank you! Your enquiry has been received. We\u2019ll contact you within 24 hours.");
          form.reset();
          form.classList.remove('was-validated');
        } else {
          showAlert('danger', result.message || 'Something went wrong. Please try again or contact us directly.');
        }
      } catch (err) {
        showAlert('danger', err.message || 'Network error. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    });
  }

  // ─── 7. Newsletter Form ─────────────────────────────────────────────────────
  function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    const feedback = document.getElementById('newsletter-feedback');
    if (!feedback) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      feedback.innerHTML = '';

      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value.trim() : '';

      if (!email || !email.includes('@')) {
        feedback.innerHTML = '<span class="text-danger"><i class="bi bi-exclamation-circle me-1"></i>Please enter a valid email address.</span>';
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const originalBtnHTML = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Subscribing\u2026';
      }

      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (result.success) {
          feedback.innerHTML = `<span style="color:var(--navy);font-weight:600;"><i class="bi bi-check-circle-fill me-1"></i>${result.message || 'Thank you for subscribing!'}</span>`;
          form.reset();
        } else {
          feedback.innerHTML = `<span class="text-danger">${result.message || 'Subscription failed. Please try again.'}</span>`;
        }
      } catch {
        feedback.innerHTML = '<span class="text-danger"><i class="bi bi-wifi-off me-1"></i>Network error. Please try again.</span>';
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalBtnHTML;
        }
      }
    });
  }

  // ─── Initialise All ─────────────────────────────────────────────────────────
  initCopyrightYear();
  initNavbarScroll();
  initFadeInObserver();
  initSmoothScroll();
  initPortfolioFilter();
  initContactForm();
  initNewsletterForm();

});
