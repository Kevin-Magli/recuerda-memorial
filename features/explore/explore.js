// Importa as funções necessárias de outros módulos (componentes e serviços)
import { initMemCards } from "/shared/components/memorial/card/memorialCard.js";
import { getMemorials } from "/shared/components/memorial/core/memorialService.js";

// Variável global para armazenar a lista completa de memoriais vinda do banco/API
let allMemorials = [];

// Aguarda o DOM (HTML) carregar completamente antes de executar o script
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".memorial-list");
  const searchinput = document.getElementById("search");

  // Busca todos os memoriais através do serviço e armazena na variável
  allMemorials = await getMemorials();

  // Inicializa a renderização dos cards no container com todos os memoriais encontrados
  await initMemCards(container, allMemorials);

  // Adiciona um evento de escuta para cada tecla digitada no campo de busca
  searchinput.addEventListener("input", debounce(async () => {
    const query = searchinput.value.toLowerCase().trim();

    // Filtra a lista original baseando-se no nome ou na descrição
    const filtered = allMemorials.filter((mem) => {
      return (
        mem.name?.toLowerCase().includes(query) ||
        mem.description?.toLowerCase().includes(query)
      );
    });

    // Atualiza a interface renderizando apenas os memoriais que passaram no filtro
    await initMemCards(container, filtered);
  }, 300));
});

/**
 * Função de Debounce: Evita que a busca seja disparada a cada tecla.
 * Ela aguarda o usuário parar de digitar por 'wait' milissegundos antes de executar.
 */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
