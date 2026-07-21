// Nordic Built — shared site scripts

document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
    // close menu when a link is clicked (mobile)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  // Gallery filtering (gallery.html)
  var filterButtons = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var group = btn.getAttribute('data-filter');
        var visibleCount = 0;
        galleryItems.forEach(function (item) {
          if (group === 'all' || item.getAttribute('data-category') === group) {
            item.style.display = '';
            visibleCount++;
          } else {
            item.style.display = 'none';
          }
        });
        var emptyMsg = document.getElementById('gallery-empty');
        if (emptyMsg) emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
      });
    });
  }

  // Contact form (contact.html) — submits to /api/contact, a Vercel
  // serverless function that writes each lead into Neon Postgres.
  // See README.txt for the one-time Neon + Vercel setup.
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = document.getElementById('form-success');
      var errorBox = document.getElementById('form-error');
      var submitBtn = form.querySelector('button[type="submit"]');

      var payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        project: form.project.value,
        message: form.message.value.trim()
      };

      if (errorBox) { errorBox.style.display = 'none'; errorBox.textContent = ''; }
      if (success) success.style.display = 'none';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (body) {
            return { ok: r.ok, body: body };
          });
        })
        .then(function (result) {
          if (result.ok) {
            if (success) {
              success.style.display = 'block';
              success.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            form.reset();
          } else {
            throw new Error((result.body && result.body.error) || 'Something went wrong. Please try again or call us directly.');
          }
        })
        .catch(function (err) {
          if (errorBox) {
            errorBox.textContent = err.message || 'Network error — this form needs to be deployed on Vercel with the database connected. See README.txt.';
            errorBox.style.display = 'block';
            errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; }
        });
    });
  }

  // Highlight current page in nav
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a[href]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });
});
