// ===== Inject header styles =====
const style = document.createElement("style");
style.innerHTML = `
  .zd-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px; /* Slimmer header */
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 0 1.5rem;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .zd-logo img {
    height: 30px;
  }

  /* Hamburger button */
  #zd-menu-btn {
    cursor: pointer;
    width: 30px;
    height: 22px;
    position: relative;
    border: none;
    background: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
    z-index: 1100;
  }

  #zd-menu-btn span {
    display: block;
    height: 3px;
    width: 100%;
    background: black;
    border-radius: 2px;
    transition: 0.3s ease;
  }

  /* Transform hamburger into X */
  #zd-menu-btn.open span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 6px);
  }
  #zd-menu-btn.open span:nth-child(2) {
    opacity: 0;
  }
  #zd-menu-btn.open span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -6px);
  }

  /* Dropdown menu */
#zd-menu {
  position: absolute;
  top: 60px;          /* directly under the header */
  right: 0;           /* align with button */
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: 0;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.25s ease, opacity 0.25s ease;
  padding-right: 1.5rem; /* <-- keeps it inside the page */
}

  #zd-menu.show {
    opacity: 1;
    transform: scaleY(1);
  }

  #zd-menu a {
    text-decoration: none;
    color: black;
    font-weight: 600;
    font-size: 1rem;
    transition: color 0.2s ease;
  }

  #zd-menu a:hover {
    color: #4f46e5; /* Zona purple */
  }
`;
document.head.appendChild(style);

// ===== Build header =====
const header = document.createElement("header");
header.className = "zd-header";
header.innerHTML = `
  <div class="zd-logo">
    <a href="/index.html"><img src="/assets/zona_desert_wordmark_only.png" alt="Zona Desert Logo"></a>
  </div>
  <button id="zd-menu-btn" aria-label="Menu">
    <span></span>
    <span></span>
    <span></span>
  </button>
  <nav id="zd-menu">
    <a href="/cash-offer.html">Sell Property</a>
    <a href="/buyers.html">Join Buyer List</a>
    <a href="/submit-deal.html">Submit Your Deal</a>
  </nav>
`;
document.body.insertBefore(header, document.body.firstChild);

// ===== Interactions =====
const btn = header.querySelector("#zd-menu-btn");
const menu = header.querySelector("#zd-menu");

btn.addEventListener("click", () => {
  btn.classList.toggle("open");
  menu.classList.toggle("show");
});
