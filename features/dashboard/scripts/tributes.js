// Importa as funções necessárias de outros módulos (componentes e serviços)
import { initCommentCards } from "/shared/components/memorial/comments/comments.js";
import { getComments } from "/shared/components/memorial/core/commentService.js";

let allComments = [];
/**
 * Inicializa a seção de tributos (comentários) no dashboard.
 */
export async function init() {
  // Seleciona o container onde os cards de comentários serão inseridos
  const container = document.querySelector(".query-area");

  if (!container) return;

  try {
    // Busca apenas os comentários com status 'pending' (definido no commentService)
    allComments = await getComments("pending");

    // Renderiza os cards no container
    await initCommentCards(container, allComments);
  } catch (error) {
    console.error("Erro ao carregar comentários:", error);
  }
}
