document.write(`
  <header class="bg-white border-b border-slate-200 sticky top-0 z-10">
    <div class="w-full px-4 py-3 flex items-center justify-between">
      
      <!-- Logo -->
      <a href="index.html" class="flex items-center">
        <img src="/assets/z-mark.png" alt="Zona Desert Logo" class="h-9 w-auto object-contain">
      </a>

      <!-- Hamburger Menu -->
      <button id="menu-toggle" class="md:hidden flex flex-col space-y-1.5 focus:outline-none">
        <span class="w-6 h-0.5 bg-gray-800"></span>
        <span class="w-6 h-0.5 bg-gray-800"></span>
        <span class="w-6 h-0.5 bg-gray-800"></span>
      </button>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex space-x-6 font-medium text-gray-700">
        <a href="index.html" class="hover:text-indigo-600">Home</a>
        <a href="about.html" class="hover:text-indigo-600">About</a>
        <a href="services.html" class="hover:text-indigo-600">Services</a>
        <a href="resources.html" class="hover:text-indigo-600">Resources</a>
        <a href="contact.html" class="hover:text-indigo-600">Contact</a>
        <a href="offer.html" class="hover:text-indigo-600">Get an Offer</a>
      </nav>
    </div>

    <!-- Mobile Nav (hidden by default) -->
    <nav id="mobile-menu" class="hidden flex-col space-y-4 px-4 pb-4 md:hidden font-medium text-gray-700">
      <a href="index.html" class="hover:text-indigo-600">Home</a>
      <a href="about.html" class="hover:text-indigo-600">About</a>
      <a href="services.html" class="hover:text-indigo-600">Services</a>
      <a href="resources.html" class="hover:text-indigo-600">Resources</a>
      <a href="contact.html" class="hover:text-indigo-600">Contact</a>
      <a href="offer.html" class="hover:text-indigo-600">Get an Offer</a>
    </nav>
  </header>

  <script>
    document.getElementById("menu-toggle").addEventListener("click", function () {
      const menu = document.getElementById("mobile-menu");
      menu.classList.toggle("hidden");
    });
  </script>
`);
