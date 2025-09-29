// Injects a clean white header with your wordmark + hamburger menu.
// Menu opens into a simple right-aligned list (same wording as the hero tiles).

(function () {
  const css = `
    .zd-header{position:fixed; top:0; inset-inline:0; z-index:50; background:#fff;}
    .zd-nav{max-width:1200px; margin:0 auto; padding:16px 20px; display:flex; align-items:center; justify-content:space-between;}
    .zd-brand{display:flex; align-items:center; gap:10px; text-decoration:none;}
    .zd-brand img{height:26px; width:auto; display:block}
    .zd-burger{background:transparent; border:0; cursor:pointer; padding:10px; display:grid; place-items:center;}
    .zd-burger .line{display:block; width:24px; height:2px; background:#111; margin:4px 0; transition:.2s ease;}
    .zd-burger[aria-expanded="true"] .line:nth-child(1){transform:translateY(6px) rotate(45deg)}
    .zd-burger[aria-expanded="true"] .line:nth-child(2){opacity:0}
    .zd-burger[aria-expanded="true"] .line:nth-child(3){transform:translateY(-6px) rotate(-45deg)}

    .zd-menu{position:absolute; right:20px; top:58px; background:#fff; border-radius:16px; box-shadow:0 12px 30px rgba(0,0,0,.14); padding:12px; width:210px; display:none}
    .zd-menu.show{display:block}
    .zd-menu a{display:block; padding:10px 12px; color:#111; text-decoration:none; font-weight:600; border-radius:10px}
    .zd-menu a:hover{background:#f3f4f6}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const header = document.createElement('header');
  header.className = 'zd-header';
  header.innerHTML = `
    <nav class="zd-nav" aria-label="Main">
      <a href="/index.html" class="zd-brand" aria-label="Zona Desert Home">
        <img src="/assets/zona_desert_wordmark_only.png" alt="Zona Desert">
      </a>

      <div style="position:relative">
        <button class="zd-burger" id="zd-menu-btn" aria-expanded="false" aria-controls="zd-menu">
          <span class="line"></span><span class="line"></span><span class="line"></span>
          <span class="sr-only">Menu</span>
        </button>

        <div id="zd-menu" class="zd-menu" role="menu">
          <a role="menuitem" href="/cash-offer.html">Get a Cash Offer</a>
          <a role="menuitem" href="/buyers.html">Join Buyer List</a>
          <a role="menuitem" href="/submit-deal.html">Submit a Deal</a>
          <a role="menuitem" href="/about.html">About</a>
          <a role="menuitem" href="/contact.html">Contact</a>
        </div>
      </div>
    </nav>
  `;
  document.body.prepend(header);

  const btn = header.querySelector('#zd-menu-btn');
  const menu = header.querySelector('#zd-menu');

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('show');
    }
  });
})();
