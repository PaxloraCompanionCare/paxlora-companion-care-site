// Paxlora Companion Care — shared behavior

document.addEventListener('DOMContentLoaded', function () {
  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  var scrim = document.querySelector('.nav-scrim');

  function closeNav() {
    nav.classList.remove('is-open');
    scrim.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  function openNav() {
    nav.classList.add('is-open');
    scrim.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  if (toggle && nav && scrim) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.contains('is-open');
      isOpen ? closeNav() : openNav();
    });
    scrim.addEventListener('click', closeNav);
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* Consultation form: client-side validation + Netlify AJAX submit */
  var form = document.getElementById('consultation-form');
  if (form) {
    var statusEl = document.getElementById('form-status');

    function showStatus(kind, message) {
      statusEl.textContent = message;
      statusEl.className = 'form-status ' + (kind === 'success' ? 'is-success' : 'is-error');
      statusEl.setAttribute('role', 'status');
      statusEl.setAttribute('aria-live', 'polite');
    }

    function encode(data) {
      return Object.keys(data)
        .map(function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        })
        .join('&');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot check
      var honeypot = form.querySelector('input[name="bot-field"]');
      if (honeypot && honeypot.value) {
        return; // silently drop likely spam
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var formData = new FormData(form);
      var payload = {};
      formData.forEach(function (value, key) {
        if (payload[key]) {
          payload[key] = payload[key] + ', ' + value;
        } else {
          payload[key] = value;
        }
      });

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(payload),
      })
        .then(function () {
          form.reset();
          showStatus('success', "Thank you. We've received your request and will be in touch within one business day.");
        })
        .catch(function () {
          showStatus('error', 'Something went wrong sending your request. Please call us at (863) 474-5807 or try again.');
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Request a Consultation'; }
        });
    });
  }
});
