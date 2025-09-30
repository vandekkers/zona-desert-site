// assets/js/footer.js
(function () {
  // prevent double-injection during hot reloads
  if (document.getElementById('zd-footer')) return;

  const styles = `
  /* ============ Footer (Zona Desert) ============ */
  .zd-footer-wrap{
    width:100%;
    display:flex;
    justify-content:center;
    padding:24px 16px 40px;       /* outside breathing room */
    box-sizing:border-box;
  }
  .zd-footer{
    background:#0b0b0b;           /* near-black like the mock */
    color:#fff;
    width:100%;
    max-width:1120px;             /* matches your page width vibe */
    border-radius:16px;
    padding:28px 24px;
    box-shadow:0 8px 28px rgba(0,0,0,.25);
    font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI",
                 Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  }

  /* top row */
  .zd-f-top{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:24px;
    flex-wrap:wrap;               /* wrap gracefully on mobile */
  }

  /* brand */
  .zd-f-brand{
    display:flex;
    align-items:flex-start;
    gap:10px;
    min-width:220px;
  }
  .zd-f-logo{
    line-height:1;
    font-weight:800;
    font-size:28px;
    letter-spacing:.2px;
  }
  .zd-f-logo .zd-blue{ color:#6366F1; }   /* your Zona purple/indigo */
  .zd-f-tag{
    margin-top:4px;
    font-size:16px;
    font-weight:500;
    color:#d6d6d6;
  }

  /* nav */
  .zd-f-nav{
    display:flex;
    align-items:center;
    gap:28px;
    flex:1;
    justify-content:center;
    min-width:260px;
  }
  .zd-f-nav a{
    color:#fff;
    text-decoration:none;
    font-size:18px;
    font-weight:600;
    opacity:.95;
    transition:opacity .15s ease, color .15s ease, text-shadow .15s ease;
    white-space:nowrap;
  }
  .zd-f-nav a:hover{
    color:#ffffff;
    text-shadow:0 0 1px rgba(255,255,255,.2);
    opacity:1;
  }

  /* socials */
  .zd-f-socials{
    display:flex;
    align-items:center;
    gap:12px;
  }
  .zd-f-socials a{
    width:36px;
    height:36px;
    border-radius:999px;
    background:transparent;
    border:2px solid #fff;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    transition:background .15s ease, color .15s ease, border-color .15s ease, opacity .15s ease;
    color:#fff;
  }
  .zd-f-socials a:hover{
    background:#ffffff;
    color:#0b0b0b;
    border-color:#ffffff;
  }
  .zd-f-socials svg{
    width:18px; height:18px; display:block;
  }

  /* divider */
  .zd-f-hr{
    height:1px;
    background:rgba(255,255,255,.12);
    border:0; margin:16px 0 14px;
  }

  /* bottom row */
  .zd-f-bottom{
    display:flex; justify-content:space-between; align-items:center;
    gap:16px; flex-wrap:wrap;
  }
  .zd-f-copy{
    font-size:14px; color:#cfcfcf;
  }

  /* ======= Responsive tweaks ======= */
  @media (max-width: 900px){
    .zd-f-top{ gap:18px; }
    .zd-f-logo{ font-size:26px; }
    .zd-f-tag{ font-size:14px; }
    .zd-f-nav{ gap:20px; }
    .zd-f-nav a{ font-size:16px; }
    .zd-f-socials a{ width:34px; height:34px; }
  }
  @media (max-width: 640px){
    .zd-footer{ padding:22px 18px; border-radius:14px; }
    .zd-f-top{
      align-items:flex-start;
    }
    .zd-f-nav{
      order:3;                     /* brand first, socials second, nav third (wrap) */
      width:100%;
      justify-content:flex-start;
      gap:18px;
    }
    .zd-f-socials{
      order:2;
      margin-left:auto;            /* push socials to the right like the mock */
    }
    .zd-f-bottom{
      gap:10px;
    }
    .zd-f-copy{
      font-size:13px;
    }
  }
  `;

  const html = `
  <div class="zd-footer-wrap">
    <footer id="zd-footer" class="zd-footer" role="contentinfo" aria-label="Site footer">
      <div class="zd-f-top">
        <!-- Brand -->
        <div class="zd-f-brand">
          <div>
            <div class="zd-f-logo"><span class="zd-blue">Zona</span>Desert</div>
            <div class="zd-f-tag">Property Solutions</div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="zd-f-nav" aria-label="Footer navigation">
          <a href="/cash-offer.html">Quick Offer</a>
          <a href="/buyers.html">Buyer Portal</a>
          <a href="/submit-deal.html">Submit a Deal</a>
        </nav>

        <!-- Socials -->
        <div class="zd-f-socials" aria-label="Social links">
          <a href="#" aria-label="LinkedIn" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.83-2.05 3.76-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-6.5c0-1.55-.03-3.55-2.17-3.55-2.18 0-2.51 1.7-2.51 3.45V23h-3.91V8.5z"/>
            </svg>
          </a>
          <a href="#" aria-label="Twitter/X" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2H21.5l-7.59 8.665L23 22h-6.828l-5.34-6.52L4.6 22H1.34l8.12-9.28L1 2h6.91l4.82 5.77L18.244 2zm-1.195 18h2.02L7.03 4H4.9l12.149 16z"/>
            </svg>
          </a>
        </div>
      </div>

      <hr class="zd-f-hr">

      <div class="zd-f-bottom">
        <div class="zd-f-copy">
          © 2026 Zona Desert Property Solutions LLC &nbsp;|&nbsp; Phoenix, AZ
        </div>
      </div>
    </footer>
  </div>
  `;

  // inject styles once
  const styleTag = document.createElement('style');
  styleTag.id = 'zd-footer-style';
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);

  // inject footer
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
})();
