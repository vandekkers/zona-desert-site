// assets/js/header.js
(() => {
  // ---------- Styles ----------
  const style = document.createElement('style');
  style.innerHTML = `
    :root { --zd-purple: #6366F1; } /* Zona purple */

    /* Header shell */
    .zd-header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: #fff;
      border-bottom: 1px solid rgba(17, 24, 39, 0.06);
    }
    .zd-wrap {
      max-width: 1200px;
      margin: 0 auto;
      padding: 10px 20px; /* slim header */
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    /* Logo */
    .zd-logo {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      user-select: none;
    }
    .zd-logo img {
      height: 26px; /* compact */
      width: auto;
      display: block;
    }

    /* Right cluster: burger + dropdown aligned together */
    .menu-wrap { position: relative; display: flex; align-items: center; }

    /* Burger button */
    #zd-menu-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 8px;
      border: none;
      background: transparent;         /* no background */
      cursor: pointer;
      padding: 0;
    }
    #zd-menu-btn:focus-visible { outline: 2px solid var(--zd-purple); outline-offset: 2px; }

    /* Burger lines */
    #zd-menu-btn span {
      display: block;
      width: 22px;
      height: 2px;
      background: #0b0b0f;            /* black lines */
      border-radius: 2px;
      transition: transform .25s ease, opacity .2s ease, background .2s ease;
    }
    #zd-menu-btn span + span { margin-top: 5px; }

    /* X animation */
    #zd-menu-btn.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    #zd-menu-btn.open span:nth-child(2) { opacity: 0; }
    #zd-menu-btn.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* Dropdown (text-only, no background) */
    #zd-menu {
      position: absolute;
      top: calc(100% + 8px);  /* directly under button */
      right: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transform-origin: top;
      transform: scaleY(0);
      opacity: 0;
      transition: transform .25s ease, opacity .25s ease;
      padding: 0;
    }
    #zd-menu.show {
      transform: scaleY(1);
      opacity: 1;
    }
    #zd-menu a {
      font-size: 16px;
      line-height: 1;
      text-decoration: none;
      color: #0b0b0f;
      font-weight: 700;         /* bold, like the mock */
      letter-spacing: -0.01em;
      text-align: right;
      padding: 2px 0;
    }
    #zd-menu a:hover { color: var(--zd-purple); }

    /* Slightly larger on md+ */
    @media (min-width: 768px) {
      .zd-wrap { padding: 12px 28px; }
      .zd-logo img { height: 28px; }
      #zd-menu a { font-size: 17px; }
    }
  `;
  document.head.appendChild(style);

  // ---------- Markup ----------
  const header = document.createElement('header');
  header.className = 'zd-header';
  header.innerHTML = `
    <div class="zd-wrap">
      <!-- Left: logo -->
      <a class="zd-logo" href="/index.html" aria-label="Zona Desert Home">
        <img src="/assets/zona_desert_wordmark_only.png" alt="Zona Desert" />
      </a>

      <!-- Right: hamburger + dropdown -->
      <div class="menu-wrap">
        <button id="zd-menu-btn" aria-expanded="false" aria-controls="zd-menu" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
        <nav id="zd-menu" aria-label="Site">
          <a href="/index.html">Home</a>
          <a href="/cash-offer.html">Sell Property</a>
          <a href="/buyers.html">Join Buyer List</a>
          <a href="/submit-deal.html">Submit Your Deal</a>
        </nav>
      </div>
    </div>
  `;
  document.body.insertBefore(header, document.body.firstChild);

  // ---------- Interactions ----------
  const btn  = header.querySelector('#zd-menu-btn');
  const menu = header.querySelector('#zd-menu');

  function closeMenu() {
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('show');
  }
  function toggleMenu() {
    const willOpen = !btn.classList.contains('open');
    btn.classList.toggle('open', willOpen);
    btn.setAttribute('aria-expanded', String(willOpen));
    menu.classList.toggle('show', willOpen);
  }

  btn.addEventListener('click', toggleMenu);

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) closeMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close when navigating via a menu link
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => closeMenu())
  );
})();
