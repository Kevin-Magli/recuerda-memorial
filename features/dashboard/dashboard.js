import { requireAuth } from "../auth/auth.js"; // CORREÇÃO: Adicionada extensão .js para evitar erro de resolução de módulo

// CORREÇÃO: requireAuth é assíncrona; embora funcione sem await aqui, é boa prática garantir a verificação antes de carregar o conteúdo
await requireAuth(); 

const topBar = document.querySelector("#top-bar");
const tabs = document.querySelectorAll(".tab");
const content = document.getElementById("content");



tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((tab) => tab.classList.remove("active"));
    tab.classList.add("active");

    const page = tab.dataset.tab;
    loadPage(page);
  });
});

async function loadPage(page) {
  const response = await fetch(`/features/dashboard/screens/${page}.html`);
  const html = await response.text();

  // Remove existing screen-specific styles
  document.getElementById("screen-style")?.remove();

  // Load screen-specific CSS
  const link = document.createElement("link");
  link.id = "screen-style";
  link.rel = "stylesheet";
  link.href = `/features/dashboard/styles/${page}.css`;
  document.head.appendChild(link);

  if (content) {
    content.innerHTML = html;
    // Garante que o scroll volte ao topo ao trocar de aba
    content.scrollTop = 0;
  }

  try {
    // Importa o módulo e tenta executar a função init
    // O sufixo ?t= garante que o script seja re-executado ao trocar de abas
    const module = await import(`/features/dashboard/scripts/${page}.js?t=${Date.now()}`);
    if (module.init) module.init();
  } catch (err) {
    console.warn(`Sem JS para ${page} ou erro no script:`, err.message);
  }
}
if (tabs.length > 0) tabs[1].click(); // CORREÇÃO: Verificação se existem abas antes de tentar clicar na primeira
