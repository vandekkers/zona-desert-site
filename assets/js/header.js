<script>
(() => {
  // ---------- Styles ----------
  const css = `
  :root { --zd-purple:#5b5ce2; --zd-text:#111; }
  .zd-header{
    position:sticky; top:0; z-index:50; background:#fff;
    height:64px; border-bottom:1px solid rgba(0,0,0,.06);
  }
  .zd-wrap{
    max-width:1200px; margin:0 auto; height:64px;
    display:flex; align-items:center; justify-content:space-between;
    padding:0 16px;
  }
  .zd-brand{ display:flex; align-items:center; gap:.5rem; text-decoration:none; }
  .zd-word{ height:22px; display:block; }

  /* --- Burger --- */
  .zd-burger-btn{
    appearance:none; background:transparent; border:0; padding:10px;
    cursor:pointer; display:inline-flex; align-items:center; justify-content:center;
  }
  .zd-burger{
    position:relative; width:28px; height:22px;
  }
  .zd-burger span{
    position:absolute; left:0; right:0; height:2px; background:var(--zd-text);
    border-radius:2px; transition:transform .25s ease, opacity .2s ease, top .25s ease;
  }
  .zd-burger span:nth-child(1){ top:0;   transform-origin:center; }
  .zd-burger span:nth-child(2){ top:10px; transform-origin:center; }
  .zd-burger span:nth-child(3){ top:20px; transform-origin:center; }

  /* morph to X */
  .zd-open .zd-burger span:nth-child(1){ transform:translateY(10px) rotate(45deg); }
  .zd-open .zd-burger span:nth-child(2){ opacity:0; }
  .zd-open .zd-burger span:nth-child(3){ transform:translateY(-10px) rotate(-45deg); }

  /* --- Menu --- */
  .zd-menu{
    position:absolute; top:64px; right:16px;
    display:none; flex-direction:column; align-items:flex-end; gap:.5rem;
  }
  .zd-open .zd-menu{ display:flex; }
  .zd-menu a{
    color:var(--zd-text); text-decoration:none; font-weight:700;
    line-height:1.1; letter-spacing:-0.01em; font-size:1.125rem;
  }
  .zd-menu a:hover{ color:var(--zd-purple); }
  @media (min-width:768px){
    .zd-menu a{ font-size:1.25rem; }
  }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- Markup ----------
  const header = document.createElement('header');
  header.className = 'zd-header';
  header.innerHTML = `
    <div class="zd-wrap">
      <a href="index.html" class="zd-brand" aria-label="Zona Desert">
        <img src="/assets/zona_desert_wordmark_only.png" alt="Zona Desert" class="zd-word">
      </a>
      <div class="zd-right" style="position:relative">
        <button id="zd-menu-btn" class="zd-burger-btn" aria-expanded="false" aria-controls="zd-menu" title="Menu">
          <span class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;">Menu</span>
          <div class="zd-burger" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
        </button>
        <nav id="zd-menu" class="zd-menu">
          <a href="index.html">Home</a>
          <a href="cash-offer.html">Sell Property</a>
          <a href="buyers.html">Join Buyer List</a>
          <a href="submit-deal.html">Submit Your Deal</a>
        </nav>
      </div>
    </div>
  `;
  document.body.insertBefore(header, document.body.firstChild);

  // ---------- Behavior ----------
  const btn = header.querySelector('#zd-menu-btn');
  const wrap = header.querySelector('.zd-right');
  btn.addEventListener('click', () => {
    const open = wrap.classList.toggle('zd-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) {
      wrap.classList.remove('zd-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();
</script>
