document.addEventListener("DOMContentLoaded", () => {
  const header = document.createElement("header");
  header.className = "bg-white border-b border-slate-200 sticky top-0 z-10";

  header.innerHTML = `
    <div class="w-full px-4 py-3 flex items-center justify-between">
      <!-- Logo -->
      <a href="/" class="flex items-center">
        <img src="/assets/z-mark.png" alt="Zona Desert Logo"
             class="h-9 w-9 md:h-12 md:w-12 object-contain">
      </a>

      <!-- Hamburger menu -->
      <button id="menu-btn" class="flex flex-col justify-center items-center space-y-1.5">
        <span class="block w-6 h-0.5 bg-black"></span>
        <span class="block w-6 h-0.5 bg-black"></span>
        <span class="block w-6 h-0.5 bg-black"></span>
      </button>
    </div>

    <!-- Hidden nav links -->
    <nav id="menu" class="hidden bg-white border-t border-slate-200">
      <ul class="flex flex-col space-y-2 p-4">
        <li><a href="/" class="hover:text-indigo-600">Home</a></li>
        <li><a href="/about.html" class="hover:text-indigo-600">About</a></li>
        <li><a href="/services.html" class="hover:text-indigo-600">Services</a></li>
        <li><a href="/resources.html" class="hover:text-indigo-600">Resources</a></li>
        <li><a href="/contact.html" class="hover:text-indigo-600">Contact</a></li>
        <li><a href="/offer.html" class="hover:text-indigo-600">Get an Offer</a></li>
      </ul>
    </nav>
  `;

  document.body.insertBefore(header, document.body.firstChild);

  // Toggle menu open/close
  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");

  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
});
