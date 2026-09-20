Astroship Clone — HTML, CSS & JavaScript
=========================================

Open index.html in a browser to view the site. Home, Pricing, About, Blog,
Contact and 404 pages included.

JavaScript features (js/main.js, loaded on every page):

1. Mobile hamburger navigation menu — tap the icon below 650px width to
   open/close the nav links.
2. Active nav-link highlighting for whichever page you're on.
3. "Features" dropdown — hover over "Features" in the navbar (desktop) to
   see quick links to Home, Pricing, About, Blog, Contact and the 404
   page. On mobile it expands automatically inside the menu since there's
   no hover on touch screens.
4. Pricing page: Monthly / Yearly billing toggle switch that updates the
   displayed prices live.
5. Contact page:
   - Real client-side validation (name, valid email format, message
     length) with inline error messages under each field.
   - Every keystroke is saved to localStorage as a draft, so if you
     refresh the page your unfinished input is restored.
   - On successful submit, the message is saved permanently in
     localStorage (key: astroship_contact_messages) since there is no
     backend here, the draft is cleared, and a success message is shown.

No external libraries or build step — plain HTML, CSS and vanilla
JavaScript only.

Folder structure:
  index.html
  css/style.css
  js/main.js
  pages/about.html, blog.html, contact.html, pricing.html, 404.html
  images/
