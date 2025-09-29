// header.js

document.addEventListener("DOMContentLoaded", function () {
  const header = document.createElement("header");
  header.className = "zd-header";

  header.innerHTML = `
    <div class="zd-wrap">
      <!-- Logo -->
      <a href="/" class="zd-logo">
        <span class="zd-logo-text"><span class="zd-purple">Zona</span>Desert.</span>
      </a>

      <!-- Burger button -->
      <button class="zd-btn" aria-label="Toggle menu">
        <span></span>
      </button>

      <!-- Dropdown menu -->
      <nav class="zd-menu">
        <a href="/" class="zd-link">Home</a>
        <a href="/cash-offer.html" class="zd-link">Sell Property</a>
        <a href="/buyers.html" class="zd-link">Join Buyer List</a>
        <a href="/submit-deal.html" class="zd-link">Submit Your Deal</a>
      </nav>
    </div>
  `;

  document.body.prepend(header);

  // Toggle dropdown
  const burger = header.querySelector(".zd-btn");
  const menu = header.querySelector(".zd-menu");
  burger.addEventListener("click", () => {
    burger.classList.toggle("is-open");
    menu.classList.toggle("is-open");
  });

  // Inject styles
  const style = document.createElement("style");
  style.textContent = `
    /* header container */
    .zd-header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: #fff;
    }

    /* inner wrapper */
    .zd-wrap {
      max-width: 1200px;
      margin: 0 auto;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
    }

    /* logo */
    .zd-logo-text {
      font-size: 1.4rem;
      font-weight: 700;
      font-family: inherit;
      color: #111;
      text-decoration: none;
    }
    .zd-purple {
      color: #4f46e5;
    }

    /* burger button */
    .zd-btn {
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      border: 0;
      height: 64px;
      width: 52px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .zd-btn span {
      display: block;
      width: 24px;
      height: 2px;
      background: #111;
      border-radius: 2px;
      position: relative;
    }
    .zd-btn span::before,
    .zd-btn span::after {
      content: "";
      position: absolute;
      left: 0;
      width: 100%;
      height: 2px;
      background: inherit;
      border-radius: 2px;
      transition: transform 0.22s ease, opacity 0.22s ease, top 0.22s ease;
    }
    .zd-btn span::before { top: -7px; }
    .zd-btn span::after { top: 7px; }

    /* open state -> X */
    .zd-btn.is-open span { background: transparent; }
    .zd-btn.is-open span::before {
      top: 0; transform: rotate(45deg);
    }
    .zd-btn.is-open span::after {
      top: 0; transform: rotate(-45deg);
    }

    /* dropdown menu */
    .zd-menu {
      position: absolute;
      top: 64px;
      right: 16px;
      display: none;
      flex-direction: column;
      gap: 10px;
    }
    .zd-menu.is-open {
      display: flex;
    }

    /* menu links styled as minimal buttons */
    .zd-link {
      background: #fff;
      color: #111;
      font-family: inherit;
      font-size: 15px;
      font-weight: 500;
      text-decoration: none;
      padding: 8px 14px;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: background 0.2s ease, color 0.2s ease;
    }
    .zd-link:hover {
      background: #4f46e5;
      color: #fff;
    }
  `;
  document.head.appendChild(style);
});
