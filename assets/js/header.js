(() => {
  const css = `
    :root{ --zd-purple:#5b5ce2; --zd-text:#111; }

    /* header bar */
    .zd-header{
      position:sticky; top:0; z-index:100;
      background:#fff;
      padding-right:0 !important;
      padding-left:0 !important;
    }

    /* inner wrapper */
    .zd-wrap{
      max-width:1600px;
      margin:0 auto;
      height:64px;
      display:flex; align-items:center; justify-content:space-between;
      padding:0 8px;
    }

    /* brand wordmark */
    .zd-brand{ display:flex; align-items:center; text-decoration:none; }
    .zd-word{ height:28px !important; width:auto !important; display:block; }

    /* right side (burger + menu) */
    .zd-right{ position:relative; }

    .zd-btn{
      -webkit-appearance:none; appearance:none;
      background:transparent; border:0;
      padding:6px;
      cursor:pointer; display:inline-flex; align-items:center; justify-content:center;
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

    /* dropdown container (hidden by default) */
    .zd-menu{
  display:none;
  position:absolute; 
  top: calc(100% + 20px);
  right:6px;   /* ✅ shifts the menu to align with the X */
  padding:10px 0;  /* tighter padding */
  gap:12px;
  z-index:100;
  flex-direction:column;
  align-items:flex-end; /* ✅ ensures items align with button edge */
}
    /* 🔧 THIS line makes the menu show when open */
    .zd-open .zd-menu{ display:flex; }

    /* menu items as light white buttons */
.zd-menu a{
  display:block;
  background:#fff;
  color:#111;
  padding:8px 14px;
  border-radius:4px;
  font-weight:600;
  font-size:0.95rem;
  font-family: 'Helvetica Neue', Arial, sans-serif;  /* ✅ match site-wide font */
  text-decoration:none;
  white-space:nowrap;
  box-shadow:0 2px 8px rgba(0,0,0,.08);
  transition:background .2s ease, color .2s ease, transform .05s ease;
}
.zd-menu a:hover{
  background:var(--zd-purple);
  color:#fff;
}
    .zd-menu a:active{ transform:translateY(1px); }

    .sr-only{
      position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
      clip:rect(0,0,1px,1px); white-space:nowrap; border:0;
    }

    @media (max-width:768px){
      .zd-wrap{ padding:0 6px; }
      .zd-word{ height:24px !important; }
    }
    /* =========================
   MOBILE HEADER (≤768px)
   ========================= */
@media (max-width: 768px) {
  .zd-wrap{
    height: 56px;
    padding-left: 10px;              /* logo a touch in from edge */
    padding-right: 10px;             /* burger a touch in from edge */
  }

  /* Burger size/target */
  #zd-menu-btn{
    padding: 10px;
    width: 44px; height: 44px;       /* comfy tap area */
  }

  /* Dropdown: move just below bar, align to right, nicer spacing */
  #zd-menu{
    top: 56px;                        /* sits under the smaller header */
    right: 10px;                      /* aligns with burger */
    gap: 8px;
  }

  /* Dropdown “chip buttons” */
  #zd-menu a{
    font-size: 15px;                  /* use site base font size */
    font-weight: 600;                 /* match site tone */
    color: #111;
    background: rgba(255,255,255,.92);
    border: 1px solid rgba(0,0,0,.06);
    border-radius: 12px;
    padding: 10px 14px;
    box-shadow: 0 6px 18px rgba(0,0,0,.10);
  }
  #zd-menu a:hover{
    background: #fff;
    border-color: rgba(99,102,241,.25); /* subtle Zona purple hint */
  }
}
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

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

  const btn   = header.querySelector('#zd-menu-btn');
  const shell = header.querySelector('.zd-right');

  btn.addEventListener('click', () => {
    const open = shell.classList.toggle('zd-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!shell.contains(e.target)) {
      shell.classList.remove('zd-open');
      btn.setAttribute('aria-expanded','false');
    }
  });
})();
