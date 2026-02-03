const navbar = document.querySelector("nav");
const navcta = document.querySelector(".nav-cta");
const navButton = navbar.querySelector("button");

// Configurações
const MOBILE_BREAKPOINT = 1000;
const HAMBURGER_ICON = "☰";
const CLOSE_ICON = "✕";
const ORIGINAL_BUTTON_TEXT = "Menu";

function handleResize() {
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

  if (isMobile) {
    activateMobileMode();
  } else {
    deactivateMobileMode();
  }
}

function activateMobileMode() {
  navbar.id = "nav-mobile";
  document.body.style.paddingBottom = "5rem"; // Cria espaço extra no fim da página para o footer não ficar coberto

  // Atualiza o ícone do botão baseado se está aberto ou fechado
  const isOpen = navbar.classList.contains("open");
  navButton.innerText = isOpen ? CLOSE_ICON : HAMBURGER_ICON;

  if (navcta) navcta.style.display = "none";
}

function deactivateMobileMode() {
  navbar.id = "nav-desktop"; // Ativa o estilo de desktop explicitamente
  navbar.classList.remove("open");
  document.body.style.paddingBottom = "0"; // Remove o espaço extra quando volta para desktop
  navButton.innerText = ORIGINAL_BUTTON_TEXT;

  if (navcta) navcta.style.display = "block"; // Ou 'flex', dependendo do seu layout original
}

function toggleMenu() {
  // Só executa a lógica se estivermos no modo mobile
  if (window.innerWidth < MOBILE_BREAKPOINT) {
    navbar.classList.toggle("open");
    activateMobileMode(); // Atualiza o ícone
  }
}

// Event Listeners
window.addEventListener("resize", handleResize);
navButton.addEventListener("click", toggleMenu);

// Inicialização (roda ao carregar a página)
handleResize();
