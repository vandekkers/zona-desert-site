(() => {
  const css = `
    :root { --zd-purple:#5b5ce2; --zd-text:#111; }

    /* ===== Header bar ===== */
    .zd-header{
      position: sticky; top: 0; z-index: 100;
      background: #fff;
      padding-right: 0 !important; /* let content hug edges */
      padding-left:  0 !important;
    }

    /* inner wrapper */
    .zd-wrap{
      max-width: 1600px;
      margin: 0 auto;
      height: 64px;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 8px; /* overall left/right breathing room */
    }

    /* brand */
    .zd-brand{ display:flex; align-items:center; text-decoration:none; }
    .zd-word { height: 28px !important; width: auto !important; display:block; }

    /* right side cluster (relative so we can place menu + button) */
    .zd-right{ position: relative; }

    /* ===== Burger / X button ===== */
    .zd-btn{
      -webkit-appearance:none; appearance:none;
      background: transparent; border: 0; cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
      position: absolute; top: 18px; right: 20px; /* <-- keep this in sync with .zd-menu */
      z-index: 60;
    }

    /* burger graphic */
    .zd-burger{ position: relative; width: 28px; height: 22px; }
    .zd-burger span{
      position: absolute; left: 0;
      width: 28px; height: 2px;
      background: var(--zd-text);
      border-radius: 2px;
      transition: transform .25s ease, opacity .2s ease, background .2s ease;
    }
    .zd-burger span:nth-child(1){ top: 0;  }
    .zd-burger span:nth-child(2){ top: 10px; }
    .zd-burger span:nth-child(3){ top: 20px; }

    /* morph to X when open */
    .zd-open .zd-burger span:nth-child(1){ transform: translateY(10px) rotate(45deg); }
    .zd-open .zd-burger span:nth-child(2){ opacity: 0; }
    .zd-open .zd-burger span:nth-child(3){ transform: translateY(-10px) rotate(-45deg); }

    /* ===== Dropdown menu ===== */
    .zd-menu{
      position: absolute;
      top: 64px;           /* below header */
      right: 20px;         /* align with button */
      display: none;
      flex-direction: column;
      gap: 10px;
    }
    .zd-open .zd-menu{ display: flex; }

    /* pill links */
    .zd-menu a{
      display: block;
      background: #fff;
      color: var(--zd-text);
      padding: 10px 14px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.95rem;
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Inter,Helvetica,Arial,sans-serif;
      text-decoration: none;
      white-space: nowrap;               /* no line breaks */
      box-shadow: 0 6px 18px rgba(0,0,0,.10);
      transition: background .2s ease, color .2s ease, transform .05s ease;
    }
    .zd-menu a:hover{ background: var(--zd-purple); color: #fff; }
    .zd-menu a:active{ transform: translateY(1px); }

    /* a11y helper */
    .sr-only{
      position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
      clip:rect(0,0,1px,1px);white-space:nowrap;border:0;
    }

    @media (max-width:768px){
      .zd-wrap{ padding: 0 6px; }
      .zd-word{ height: 24px !important; }
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ===== Build header =====
  const header = document.createElement('header');
  header.className = 'zd-header';
  header.innerHTML = `
    <div class="zd-wrap">
      <a href="index.html" class="zd-brand" aria-label="Zona Desert">
        <img src="assets/zona_desert_wordmark_only.png" alt="Zona Desert" class="zd-word">
      </a>

      <div class="zd-right">
        <button id="zd-menu-btn" class="zd-btn" aria-expanded="false" aria-controls="zd-menu" title="Menu">
          <span class="sr-only">Menu</span>
          <div class="zd-burger" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
        </button>

        <nav id="zd-menu" class="zd-menu" aria-label="Primary">
          <a href="index.html">Home</a>
          <a href="cash-offer.html">Sell Property</a>
          <a href="buyers.html">Join Buyer List</a>
          <a href="submit-deal.html">Submit Your Deal</a>
        </nav>
      </div>
    </div>
  `;
  document.body.insertBefore(header, document.body.firstChild);

  // ===== Interactions =====
  const btn   = header.querySelector('#zd-menu-btn');
  const shell = header.querySelector('.zd-right');

  btn.addEventListener('click', () => {
    const open = shell.classList.toggle('zd-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // click-away to close
  document.addEventListener('click', (e) => {
    if (!shell.contains(e.target)) {
      shell.classList.remove('zd-open');
      btn.setAttribute('aria-expanded','false');
    }
  });
})();
