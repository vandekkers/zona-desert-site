// Injects the dark footer bar shown in your mock.

(function () {
  const css = `
    .zd-footer{background:#0c0d0f; color:#fff; margin-top:72px}
    .zd-foot-wrap{max-width:1200px; margin:0 auto; padding:28px 20px; display:flex; gap:24px; align-items:center; justify-content:space-between; flex-wrap:wrap}
    .zd-foot-brand{display:flex; align-items:flex-start; gap:14px}
    .zd-foot-logo{background:#1a1b1f; border-radius:14px; padding:16px 18px; font-weight:800; font-size:22px}
    .zd-foot-links{display:flex; gap:22px; flex-wrap:wrap}
    .zd-foot-links a{color:#e5e7eb; text-decoration:none; font-weight:600}
    .zd-foot-links a:hover{color:#fff}
    .zd-social{display:flex; gap:12px}
    .zd-social a{display:inline-grid; place-items:center; width:34px; height:34px; border-radius:999px; background:#1a1b1f; color:#fff; text-decoration:none; font-weight:800}
    .zd-copy{opacity:.7; font-size:13px; margin-top:10px}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const footer = document.createElement('footer');
  footer.className = 'zd-footer';
  footer.innerHTML = `
    <div class="zd-foot-wrap">
      <div>
        <div class="zd-foot-brand">
          <div class="zd-foot-logo">Zona Desert</div>
          <div>
            <div style="opacity:.75">Property Solutions</div>
            <div class="zd-copy">© 2026 Zona Desert Property Solutions LLC | Phoenix, AZ</div>
          </div>
        </div>
      </div>

      <nav class="zd-foot-links" aria-label="Footer">
        <a href="/cash-offer.html">Quick Offer</a>
        <a href="/buyers.html">Buyer Portal</a>
        <a href="/submit-deal.html">Submit a Deal</a>
      </nav>

      <div class="zd-social">
        <a aria-label="LinkedIn" href="#">in</a>
        <a aria-label="X / Twitter" href="#">𝕏</a>
      </div>
    </div>
  `;
  document.body.appendChild(footer);
})();
