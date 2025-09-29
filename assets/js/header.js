// assets/js/header.js
(function () {
  function mountHeader() {
    // --- minimal CSS for animation + hamburger -> X ---
    const style = document.createElement("style");
    style.textContent = `
      /* Slide dropdown */
      .zd-menu {
        position: absolute;
        right: 0;
        top: 100%;
        transform-origin: top right;
        transform: scaleY(0);
        opacity: 0;
        transition: transform 200ms ease, opacity 200ms ease;
      }
      .zd-menu.show {
        transform: scaleY(1);
        opacity: 1;
      }

      /* Hamburger -> X */
      .zd-burger-line {
        width: 24px; height: 2px; background: #111;
        transition: transform 200ms ease, opacity 150ms ease;
      }
      #zd-menu-btn.open .line-1 { transform: translateY(6px) rotate(45deg); }
      #zd-menu-btn.open .line-2 { opacity: 0; }
      #zd-menu-btn.open .line-3 { transform: translateY(-6px) rotate(-45deg); }
    `;
    document.head.appendChild(style);

    // --- build header ---
    const header = document.createElement("header");
    header.className = "bg-white border-b border-slate-200 sticky top-0 z-50";

    header.innerHTML = `
     <div class="w-full px-4 py-3 flex items-center justify-between">
        <!-- Left: Logo -->
        <a href="/" class="flex items-center select-none">
          <img src="/assets/z-mark.png" alt="Zona Desert Logo"
               class="h-9 w-9 md:h-12 md:w-12 object-contain" />
        </a>

        <!-- Right: Burger + dropdown -->
        <div class="relative">
          <button id="zd-menu-btn" aria-expanded="false" aria-controls="zd-menu"
  class="flex flex-col items-center justify-center gap-1.5 p-2 focus:outline-none mr-6"
  title="Menu">
            <span class="zd-burger-line line-1"></span>
            <span class="zd-burger-line line-2"></span>
            <span class="zd-burger-line line-3"></span>
          </button>

          <!-- Text-only dropdown, aligned to button, no background -->
          <nav id="zd-menu" class="zd-menu">
            <ul class="flex flex-col items-end gap-2 pt-2">
              <li><a href="/"               class="text-gray-900 hover:text-indigo-600 text-lg md:text-xl font-extrabold tracking-tight">Home</a></li>
              <li><a href="/about.html"     class="text-gray-900 hover:text-indigo-600 text-lg md:text-xl font-extrabold tracking-tight">About</a></li>
              <li><a href="/services.html"  class="text-gray-900 hover:text-indigo-600 text-lg md:text-xl font-extrabold tracking-tight">Services</a></li>
              <li><a href="/resources.html" class="text-gray-900 hover:text-indigo-600 text-lg md:text-xl font-extrabold tracking-tight">Resources</a></li>
              <li><a href="/contact.html"   class="text-gray-900 hover:text-indigo-600 text-lg md:text-xl font-extrabold tracking-tight">Contact</a></li>
              <li><a href="/offer.html"     class="text-gray-900 hover:text-indigo-600 text-lg md:text-xl font-extrabold tracking-tight">Get an Offer</a></li>
            </ul>
          </nav>
        </div>
      </div>
    `;

    // insert at the very top of <body>
    document.body.insertBefore(header, document.body.firstChild);

    // interactions
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

    // close when clicking outside or pressing Esc
    document.addEventListener("click", (e) => {
      if (!header.contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Run now if DOM is ready; otherwise wait.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountHeader);
  } else {
    mountHeader();
  }
})();
