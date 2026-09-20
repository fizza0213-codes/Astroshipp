/* ==========================================================================
   Astroship Clone — main.js
     1. Mobile hamburger navigation (works on every page)
     2. Active navigation link highlighting
     3. "Features" nav dropdown (hover on desktop, expanded on mobile)
     4. Pricing monthly/yearly toggle (pages/pricing.html)
     5. Contact form validation + saving all form data to localStorage
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initActiveNavLink();
  initFeaturesDropdown();
  initPricingToggle();
  initContactForm();
});

/* --------------------------------------------------------------------
   1. Mobile hamburger navigation
   -------------------------------------------------------------------- */
function initMobileNav() {
  var nav = document.querySelector('.site-header .nav');
  var navLinks = document.querySelector('.nav-links');
  if (!nav || !navLinks) return;

  // Build the hamburger button and place it right before the auth links
  var toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Toggle navigation menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span><span></span>';

  var auth = nav.querySelector('.auth');
  nav.insertBefore(toggle, auth || null);

  function closeMenu() {
    navLinks.classList.remove('open');
    navLinks.style.display = '';
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    navLinks.classList.add('open');
    navLinks.style.display = 'flex';
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close the menu automatically once a link inside it is clicked
  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeMenu();
  });

  // Reset menu state if the window is resized back to desktop width
  window.addEventListener('resize', function () {
    if (window.innerWidth > 650) closeMenu();
  });
}

/* --------------------------------------------------------------------
   2. Active navigation link highlighting
   -------------------------------------------------------------------- */
function initActiveNavLink() {
  var links = document.querySelectorAll('.nav-links a:not(.features-link):not(.pro)');
  if (!links.length) return;

  var currentFile = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(function (link) {
    var linkFile = link.getAttribute('href').split('/').pop().split('#')[0] || 'index.html';
    if (linkFile === currentFile) link.classList.add('active');
  });
}

/* --------------------------------------------------------------------
   3. "Features" nav dropdown — hover on desktop, always-open on mobile
   -------------------------------------------------------------------- */
function initFeaturesDropdown() {
  var featuresLink = document.querySelector('.features-link');
  if (!featuresLink) return;

  var inPages = window.location.pathname.indexOf('/pages/') !== -1;
  var toPages = inPages ? '' : 'pages/';

  // Matches the reference design exactly: first three are placeholder
  // links (go nowhere), only "404 Page" is a real, working link.
  var links = [
    { label: 'Action', href: '#' },
    { label: 'Another action', href: '#' },
    { label: 'Dropdown Submenu', href: '#' },
    { label: '404 Page', href: toPages + '404.html' }
  ];

  // Wrap the existing "Features" link in a positioning container
  var wrapper = document.createElement('div');
  wrapper.className = 'nav-dropdown';
  featuresLink.parentNode.insertBefore(wrapper, featuresLink);
  wrapper.appendChild(featuresLink);

  var panel = document.createElement('div');
  panel.className = 'dropdown-panel';
  links.forEach(function (link) {
    var a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.label;
    if (link.href === '#') {
      a.addEventListener('click', function (e) { e.preventDefault(); });
    }
    panel.appendChild(a);
  });
  wrapper.appendChild(panel);

  // Flip the chevron while the dropdown is visible (hover or tap-open)
  var chevron = featuresLink.querySelector('.chevron');
  wrapper.addEventListener('mouseenter', function () {
    if (chevron) chevron.textContent = '^';
  });
  wrapper.addEventListener('mouseleave', function () {
    if (chevron && !panel.classList.contains('open')) chevron.textContent = '⌄';
  });

  // Touch devices don't have :hover, so also support tap-to-toggle
  featuresLink.addEventListener('click', function (e) {
    if (window.innerWidth > 650 && window.matchMedia('(hover: none)').matches) {
      e.preventDefault();
      var isOpen = panel.classList.toggle('open');
      if (chevron) chevron.textContent = isOpen ? '^' : '⌄';
    }
  });

  document.addEventListener('click', function (e) {
    if (!wrapper.contains(e.target)) panel.classList.remove('open');
  });
}

/* --------------------------------------------------------------------
   4. Pricing monthly/yearly toggle (pages/pricing.html)
   -------------------------------------------------------------------- */
function initPricingToggle() {
  var toggle = document.getElementById('billingSwitch');
  if (!toggle) return;

  var wrapper = document.querySelector('.billing-toggle');
  var labels = wrapper.querySelectorAll('.toggle-label');
  var prices = document.querySelectorAll('.price-card h2[data-monthly]');

  function setBilling(isYearly) {
    toggle.setAttribute('aria-checked', String(isYearly));
    wrapper.classList.toggle('yearly', isYearly);
    labels[0].setAttribute('data-active', String(!isYearly));
    labels[1].setAttribute('data-active', String(isYearly));

    prices.forEach(function (h2) {
      h2.textContent = isYearly ? h2.getAttribute('data-yearly') : h2.getAttribute('data-monthly');
    });
  }

  toggle.addEventListener('click', function () {
    var isYearly = toggle.getAttribute('aria-checked') !== 'true';
    setBilling(isYearly);
  });

  setBilling(false);
}

/* --------------------------------------------------------------------
   5. Contact form validation + save all data to localStorage
   -------------------------------------------------------------------- */
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var status = document.getElementById('formStatus');
  var DRAFT_KEY = 'astroship_contact_draft';
  var MESSAGES_KEY = 'astroship_contact_messages';

  var fields = {
    name: {
      input: document.getElementById('cName'),
      error: document.getElementById('cNameError'),
      validate: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your full name.'; }
    },
    email: {
      input: document.getElementById('cEmail'),
      error: document.getElementById('cEmailError'),
      validate: function (v) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(v.trim()) ? '' : 'Please enter a valid email address.';
      }
    },
    message: {
      input: document.getElementById('cMessage'),
      error: document.getElementById('cMessageError'),
      validate: function (v) { return v.trim().length >= 10 ? '' : 'Message should be at least 10 characters.'; }
    }
  };

  // Restore any unfinished draft so the visitor doesn't lose their input on refresh
  (function restoreDraft() {
    try {
      var saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
      Object.keys(fields).forEach(function (key) {
        if (saved[key]) fields[key].input.value = saved[key];
      });
    } catch (e) { /* ignore bad data */ }
  })();

  // Save every keystroke to localStorage so all form data lives there
  function saveDraft() {
    var data = {};
    Object.keys(fields).forEach(function (key) {
      data[key] = fields[key].input.value;
    });
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  }

  function validateField(field) {
    var msg = field.validate(field.input.value);
    field.error.textContent = msg;
    field.input.closest('.field').classList.toggle('has-error', !!msg);
    return !msg;
  }

  Object.keys(fields).forEach(function (key) {
    var field = fields[key];
    field.input.addEventListener('input', function () {
      saveDraft();
      if (field.input.closest('.field').classList.contains('has-error')) validateField(field);
    });
    field.input.addEventListener('blur', function () { validateField(field); });
  });

  function showStatus(type, message) {
    status.hidden = false;
    status.className = 'form-status ' + type;
    status.textContent = message;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var results = Object.keys(fields).map(function (key) { return validateField(fields[key]); });
    var allValid = results.every(function (ok) { return ok; });
    if (!allValid) {
      showStatus('error', 'Please fix the highlighted fields and try again.');
      return;
    }

    // Save the submitted message permanently in localStorage (no backend here)
    var entry = {
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      message: fields.message.input.value.trim(),
      submittedAt: new Date().toISOString()
    };
    var allMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    allMessages.push(entry);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
    localStorage.removeItem(DRAFT_KEY);

    showStatus('success', 'Thanks! Your message has been saved \u2014 we\u2019ll get back to you soon.');
    form.reset();
    Object.keys(fields).forEach(function (key) {
      fields[key].error.textContent = '';
      fields[key].input.closest('.field').classList.remove('has-error');
    });
  });
}
