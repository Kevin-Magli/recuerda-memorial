const MOBILE_BREAKPOINT = 1000;
const HAMBURGER_ICON = "☰";
const CLOSE_ICON = "×";
const ORIGINAL_BUTTON_TEXT = "Menu";

document.addEventListener("DOMContentLoaded", async () => {
  // 1️⃣ Carrega a nav
  await loadNavbar();

  // 2️⃣ Inicializa toda a lógica da navbar
  initNavbar();
});

// ---------------------------
// Carrega navbar.html
// ---------------------------
async function loadNavbar() {
  const response = await fetch("/components/navbar.html");
  const navHTML = await response.text();
  document.querySelector("#navbar-component").innerHTML = navHTML;
}

// ---------------------------
// Inicializa navbar
// ---------------------------
function initNavbar() {
  const navbar = document.querySelector("nav");
  const navButton = navbar.querySelector("#menu-toggle");

  // Atualiza botões de acordo com login
  updateNavbarState();

  // Destaca página atual
  highlightCurrentPage();

  // Inicializa mobile menu
  initMobileMenu(navbar, navButton);

  // Event listeners
  window.addEventListener("resize", () => handleResize(navbar, navButton));
  navButton.addEventListener("click", () => toggleMenu(navbar, navButton));

  // Ajuste inicial
  handleResize(navbar, navButton);
}

// ---------------------------
// Atualiza botões de acordo com login
// ---------------------------
function updateNavbarState() {
  const currentUser = localStorage.getItem("currentUser");
  const accountButton = document.querySelector("#account-button");
  const primaryAction = document.querySelector("#primary-action");

  if (currentUser) {
    accountButton.textContent = "Conta";
    accountButton.onclick = () => (window.location.href = "/dashboard.html");

    primaryAction.textContent = "Criar Memorial";
    primaryAction.href = "/create.html";
  } else {
    accountButton.textContent = "Login";
    accountButton.onclick = () => (window.location.href = "/login-page.html");

    primaryAction.textContent = "Eternizar Agora";
    primaryAction.href = "/login-page.html";
  }
}

// ---------------------------
// Destaca link da página atual
// ---------------------------
function highlightCurrentPage() {
  const links = document.querySelectorAll(".nav-links a");
  const currentPath = window.location.pathname;

  links.forEach((link) => {
    if (currentPath.includes(link.getAttribute("href"))) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// ---------------------------
// Mobile menu
// ---------------------------
function initMobileMenu(navbar, navButton) {
  handleResize(navbar, navButton); // Define estado inicial
}

function handleResize(navbar, navButton) {
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

  if (isMobile) {
    document.body.classList.add("mobile-mode");
    navbar.id = "nav-mobile";
    const isOpen = navbar.classList.contains("open");
    navButton.innerText = isOpen ? CLOSE_ICON : HAMBURGER_ICON;
  } else {
    document.body.classList.remove("mobile-mode");
    navbar.id = "nav-desktop";
    navbar.classList.remove("open");
    navButton.innerText = ORIGINAL_BUTTON_TEXT;
  }
}

function toggleMenu(navbar, navButton) {
  if (window.innerWidth < MOBILE_BREAKPOINT) {
    navbar.classList.toggle("open");
    handleResize(navbar, navButton);
  }
}