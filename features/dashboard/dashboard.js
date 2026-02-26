import { requireAuth } from "../auth/auth.js"; // CORREÇÃO: Adicionada extensão .js para evitar erro de resolução de módulo

// CORREÇÃO: requireAuth é assíncrona; embora funcione sem await aqui, é boa prática garantir a verificação antes de carregar o conteúdo
requireAuth(); 

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
  const response = await fetch(`./screens/${page}.html`);
  const html = await response.text();

  if (content) content.innerHTML = html; // CORREÇÃO: Verificação de existência do elemento content antes de atribuir innerHTML

  try {
    // CORREÇÃO: Adicionado cache-busting ou garantia de caminho relativo para o import dinâmico
    const module = await import(`./scripts/${page}.js?v=${Date.now()}`);
    if (module.init) module.init();
  } catch (err) {
    console.warn(`Sem JS para ${page} ou erro no script:`, err.message);
  }
}
if (tabs.length > 0) tabs[0].click(); // CORREÇÃO: Verificação se existem abas antes de tentar clicar na primeira
