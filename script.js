/* Full-featured script:
  - hero slideshow
  - lazy loading (safe)
  - search filter
  - lightbox
  - UPI modal (dynamic with name+price, close + payment-done)
  - contact form validation + demo email log + success alert
  - scroll-to-top button
  - dark/light toggle
  - active nav link highlight
*/
document.addEventListener('DOMContentLoaded', () => {
  /* ---------------- Hero slideshow ---------------- */
  const slides = Array.from(document.querySelectorAll('.hero-slides img'));
  if (slides.length) {
    let idx = 0;
    const show = () => {
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      idx = (idx + 1) % slides.length;
    };
    show();
    setInterval(show, 3000);
  }

  /* ---------------- Lazy load images (defensive) ---------------- */
  const lazyImgs = Array.from(document.querySelectorAll('img.lazy'));
  if (lazyImgs.length) {
    try {
      if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries, obsr) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset && img.dataset.src) img.src = img.dataset.src;
              img.classList.remove('lazy');
              obsr.unobserve(img);
            }
          });
        }, { rootMargin: '80px' });
        lazyImgs.forEach(img => obs.observe(img));
      } else {
        lazyImgs.forEach(img => {
          if (img.dataset && img.dataset.src) img.src = img.dataset.src;
          img.classList.remove('lazy');
        });
      }
    } catch (err) {
      // fallback: set all src
      lazyImgs.forEach(img => {
        if (img.dataset && img.dataset.src) img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
      console.warn('Lazy-load fallback used:', err);
    }
  }

  /* ---------------- Search / Filter ---------------- */
  const searchInput = document.getElementById('searchInput');
  const cards = Array.from(document.querySelectorAll('.card'));
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      cards.forEach(card => {
        const title = (card.dataset.title || '').toLowerCase();
        const tags = (card.dataset.tags || '').toLowerCase();
        card.style.display = (title.includes(q) || tags.includes(q)) ? '' : 'none';
      });
    });
  }

  /* ---------------- Lightbox ---------------- */
  const lightbox = document.getElementById('lightbox');
  const lightImg = lightbox ? lightbox.querySelector('img') : null;
  document.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('click', (e) => {
      // open lightbox, but avoid if click is on buy button area (img click is safe)
      if (!lightbox || !lightImg) return;
      lightImg.src = img.src || img.dataset.src || '';
      lightbox.style.display = 'flex';
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });
  if (lightbox) {
    lightbox.addEventListener('click', () => {
      lightbox.style.display = 'none';
      lightbox.setAttribute('aria-hidden', 'true');
    });
  }

  /* ---------------- UPI Modal (dynamic) ---------------- */
  const upiModal = document.getElementById('upiModal');
  const upiItem = document.getElementById('upiItem');
  const upiTitle = document.getElementById('upiTitle');
  const upiQR = document.getElementById('upiQR');
  const closeUpiBtn = document.getElementById('closeUpi');
  const upiCloseBtn = document.getElementById('upiClose');
  const paymentDoneBtn = document.getElementById('paymentDone');

  // When a buy button is clicked, open modal and populate
  document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If button is contact form submit, do not open modal here (handled separately)
      const isSubmit = (btn.form && btn.type === 'submit') || btn.closest('form')?.id === 'contactForm';
      if (isSubmit) return; // contact form handled below

      e.preventDefault();
      // find the parent card
      const card = btn.closest('.card');
      const title = (card && card.dataset && card.dataset.title) ? card.dataset.title : 'Item';
      const price = (card && card.dataset && card.dataset.price) ? card.dataset.price : '';
      // populate modal
      if (upiItem) upiItem.textContent = `${title} — ₹${price}`;
      if (upiTitle) upiTitle.textContent = `Pay (Demo)`;
      if (upiQR) upiQR.src = upiQR.dataset?.src || upiQR.src; // currently static demo
      if (!upiModal) return;
      upiModal.style.display = 'flex';
      upiModal.setAttribute('aria-hidden', 'false');
    });
  });

  // modal close handlers
  if (closeUpiBtn) closeUpiBtn.addEventListener('click', () => {
    upiModal.style.display = 'none';
    upiModal.setAttribute('aria-hidden', 'true');
  });
  if (upiCloseBtn) upiCloseBtn.addEventListener('click', () => {
    upiModal.style.display = 'none';
    upiModal.setAttribute('aria-hidden', 'true');
  });
  window.addEventListener('click', (e) => {
    if (e.target === upiModal) {
      upiModal.style.display = 'none';
      upiModal.setAttribute('aria-hidden', 'true');
    }
  });
  if (paymentDoneBtn) {
    paymentDoneBtn.addEventListener('click', () => {
      alert('✅ Payment recorded (demo). Thank you!');
      upiModal.style.display = 'none';
      upiModal.setAttribute('aria-hidden', 'true');
    });
  }

  /* ---------------- Contact form ---------------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('name') || {}).value?.trim() || '';
      const email = (document.getElementById('email') || {}).value?.trim() || '';
      const message = (document.getElementById('message') || {}).value?.trim() || '';

      if (!name || !email || !message) {
        alert('⚠️ Please fill all fields before submitting.');
        return;
      }

      // Simulate sending mail to demo address
      const demoEmail = 'naturegallerydemo@example.com';
      console.log(`Demo send -> To: ${demoEmail}\nFrom: ${name} <${email}>\nMessage: ${message}`);

      // Success message
      alert('✅ Thank you for filling this contact form. Your response has been submitted. We will reach you shortly.');

      contactForm.reset();
    });
  }

  /* ---------------- Scroll-to-top ---------------- */
  const topBtn = document.getElementById('topBtn');
  window.addEventListener('scroll', () => {
    if (!topBtn) return;
    if (document.documentElement.scrollTop > 140) topBtn.style.display = 'block';
    else topBtn.style.display = 'none';
  });
  if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------- Dark / Light mode toggle ---------------- */
  const toggle = document.getElementById('modeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      if (document.body.dataset.theme === 'dark') {
        document.body.dataset.theme = '';
        toggle.textContent = '🌙';
        document.body.style.background = 'linear-gradient(to bottom, #e8f5e9, #e3f2fd)';
        document.body.style.color = '#333';
      } else {
        document.body.dataset.theme = 'dark';
        toggle.textContent = '☀️';
        document.body.style.background = '#121212';
        document.body.style.color = '#e8e8e8';
      }
    });
  }

  /* ---------------- Active nav highlight on scroll ---------------- */
  const sections = Array.from(document.querySelectorAll('section[id], header[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  if (sections.length && navLinks.length) {
    const updateActive = () => {
      const top = window.scrollY;
      let currentId = '';
      sections.forEach(sec => {
        const offset = sec.offsetTop - 120;
        const h = sec.offsetHeight;
        if (top >= offset && top < offset + h) currentId = sec.getAttribute('id');
      });
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
      });
    };
    window.addEventListener('scroll', updateActive);
    updateActive();
  }
});
