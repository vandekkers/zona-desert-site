(() => {
  /* ----------------- Inline styles ----------------- */
  const css = `
    :root{ --zd-purple:#5b5ce2; --zd-text:#111; }

    /* make the header bar full-bleed and kill any right padding */
.zd-header{
  position: sticky; top: 0; z-index: 50;
  background: #fff;
  padding-right: 0 !important;   /* ← this is what’s keeping the burger off the edge */
  padding-left: 0 !important;
}

/* full-bleed inner wrapper with tiny edge paddings you can tune */
.zd-wrap{
  max-width: 100%;
  margin: 0;
  height: 64px;
  display:flex; align-items:center; justify-content:space-between;
  padding-left: 8px;              /* tweak to move logo */
  padding-right: 8px;             /* tweak to move burger */
}

/* push the icon right up to the edge */
.zd-right{ margin-right: 0; }

/* keep the dropdown aligned to the icon */
#zd-menu{ right: 8px; }           /* match .zd-wrap padding-right */

    /* brand wordmark */
    .zd-brand{ display:flex; align-items:center; text-decoration:none; }
    .zd-word{ height:24px; width:auto; display:block; }

    /* hamburger button */
    .zd-right{ position:relative; }
    .zd-btn{
      -webkit-appearance:none; appearance:none; background:transparent; border:0;
      padding:10px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center;
    }
    .zd-burger{ position:relative; width:28px; height:22px; }
    .zd-burger span{
      position:absolute; left:0; right:0; height:2px; background:var(--zd-text);
      border-radius:2px; transition:transform .25s ease, opacity .2s ease, top .25s ease;
    }
    .zd-burger span:nth-child(1){ top:0; }
    .zd-burger span:nth-child(2){ top:10px; }
    .zd-burger span:nth-child(3){ top:20px; }

    /* morph to X when open */
    .zd-open .zd-burger span:nth-child(1){ transform:translateY(10px) rotate(45deg); }
    .zd-open .zd-burger span:nth-child(2){ opacity:0; }
    .zd-open .zd-burger span:nth-child(3){ transform:translateY(-10px) rotate(-45deg); }

    /* dropdown (text only, no background) */
    .zd-menu{
      position:absolute; top:64px; right:0; display:none;
      padding:0; margin:0; list-style:none; text-align:right;
    }
    .zd-open .zd-menu{ display:flex; flex-direction:column; gap:.75rem; }
    .zd-menu a{
      color:#fff; /* white text */
      text-decoration:none;
      font-weight:700;
      letter-spacing:-0.01em;
      line-height:1.3;
      font-size:1.125rem;
      white-space:nowrap; /* keeps text on one line */
    }
    .zd-menu a:hover{
      color:var(--zd-purple); /* Zona purple on hover */
    }

    .sr-only{
      position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
      clip:rect(0,0,1px,1px); white-space:nowrap; border:0;
    }

    @media (min-width:1280px){ .zd-wrap{ max-width:1280px; } }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ----------------- Markup ----------------- */
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

  /* ----------------- Behavior ----------------- */
  const btn   = header.querySelector('#zd-menu-btn');
  const shell = header.querySelector('.zd-right');

  btn.addEventListener('click', () => {
    const open = shell.classList.toggle('zd-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // close if you click anywhere outside
  document.addEventListener('click', (e) => {
    if (!shell.contains(e.target)) {
      shell.classList.remove('zd-open');
      btn.setAttribute('aria-expanded','false');
    }
  });
})();
