// assets/js/header.js
(function () {
  function mountHeader() {
    // ---- Inline CSS for the header + hamburger → X animation ----
    const style = document.createElement("style");
    style.textContent = `
      /* Header frame */
      .zd-header { position: sticky; top: 0; z-index: 50; background:#ffffff; border-bottom:1px solid #e5e7eb; }
      .zd-wrap { width:100%; padding:0.75rem 2.5rem 0.75rem 1rem; display:flex; align-items:center; justify-content:space-between; }

      /* Burger button + lines */
      .zd-burger { display:inline-flex; width:44px; height:44px; align-items:center; justify-content:center; flex-direction:column; gap:6px; padding:0.25rem; border:0; background:transparent; cursor:pointer; }
      .zd-burger:focus { outline:none; }
      .zd-burger-line { display:block; width:24px; height:2px; background:#000000; border-radius:1px; transition: transform 200ms ease, opacity 150ms ease; transform-origin:center; }

      /* Turn into a proper X (full, not half) */
      #zd-menu-btn.open .line-1 { transform: translateY(8px) rotate(45deg); }
      #zd-menu-btn.open .line-2 { opacity: 0; }
      #zd-menu-btn.open .line-3 { transform: translateY(-8px) rotate(-45deg); }

      /* Dropdown (words only, no panel) */
      .zd-menu { position:absolute; right:0; top:100%; transform-origin: top right; transform: scaleY(0); opacity:0; transition: transform 200ms ease, opacity 200ms ease; }
      .zd-menu.show { transform: scaleY(1); opacity:1; }

      /* Text look for items (match your big headline weight/spacing) */
      .zd-menu a { 
  color:#ffffff; 
  text-decoration:none; 
  font-weight:800; 
  letter-spacing:-0.01em; 
  line-height:1.1; 
  white-space:nowrap;   /* 🚀 keeps "Cash Offer" on one line */
}
      .zd-menu a:hover { color:#4f46e5; }
      .zd-menu ul { 
  display:flex; 
  flex-direction:column; 
  align-items:flex-end; 
  gap:1rem;          /* 🚀 more space between each option */
  padding-top:1.5rem; /* 🚀 pushes the whole list down away from the X */
  padding-right:.25rem; 
}
      @media (min-width:768px) {
        .zd-menu a { font-size:1.25rem; } /* md:text-xl */
      }
      @media (max-width:767.98px) {
        .zd-menu a { font-size:1.125rem; } /* text-lg */
      }
    `;
    document.head.appendChild(style);

    // ---- Build header ----
    const header = document.createElement("header");
    header.className = "zd-header";
    header.innerHTML = `
      <div class="zd-wrap">
        <!-- Left: Logo -->
        <a href="/" class="flex items-center select-none">
          <img src="/assets/z-mark.png" alt="Zona Desert Logo"
               class="h-9 w-9 md:h-12 md:w-12 object-contain" />
        </a>

        <!-- Right: Burger + dropdown -->
        <div class="relative">
          <button id="zd-menu-btn" aria-expanded="false" aria-controls="zd-menu" class="zd-burger" title="Menu">
            <span class="zd-burger-line line-1"></span>
            <span class="zd-burger-line line-2"></span>
            <span class="zd-burger-line line-3"></span>
          </button>

          <!-- Words-only dropdown aligned to button -->
          <nav id="zd-menu" class="zd-menu">
            <ul class="flex flex-col items-end gap-2 p-2">
  <li><a href="index.html">Home</a></li>
  <li><a href="about.html">About</a></li>
  <li><a href="services.html">Services</a></li>
  <li><a href="resources.html">Resources</a></li>
  <li><a href="contact.html">Contact</a></li>
  <li><a href="cash-offer.html">Cash Offer</a></li>
</ul>
          </nav>
        </div>
      </div>
    `;

    // Insert at top of body
    document.body.insertBefore(header, document.body.firstChild);

    // ---- Interactions ----
    const btn  = header.querySelector("#zd-menu-btn");
    const menu = header.querySelector("#zd-menu");

    const closeMenu = () => {
      btn.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      menu.classList.remove("show");
    };

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = btn.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      menu.classList.toggle("show", open);
    });

    // Close on outside click / Esc
    document.addEventListener("click", (e) => {
      if (!header.contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Mount when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountHeader);
  } else {
    mountHeader();
  }
})();
