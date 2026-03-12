import { getUser } from "/features/auth/auth.js";
import { supabase } from "/services/supabase/supabaseClient.js";

let commentTemplate = null;

export async function initCommentCards(container, comments) {
    await loadCommentCardCSS();

  const user = await getUser();


  if (!commentTemplate) {
    const data = await fetch(
      "/shared/components/memorial/comments/comments.html",
    );
    commentTemplate = await data.text();
  }

  if (!Array.isArray(comments)) {
    comments = [comments];
  }

  container.innerHTML = "";

  for (const comment of comments) {
    const card = await renderSingleCommentCard(comment, user, commentTemplate);
    container.appendChild(card);
  }
}

async function renderSingleCommentCard(comment, user, template) {
  const temp = document.createElement("div");
  temp.innerHTML = template.trim();

  const cardElement = temp.firstElementChild;
  // Nota: O parâmetro 'user' foi adicionado à definição para coincidir com a chamada na linha 29.

  cardElement.querySelector(".tribute-message").textContent = comment.message;
  cardElement.querySelector(".tribute-name").textContent =
    comment.author_name || "Anônimo";

  const actionsContainer = cardElement.querySelector(".action-buttons");

  // Verifica se o usuário logado é o dono do memorial atrelado ao comentário
  const isOwner = user && comment.memorials && user.id === comment.memorials.user_id;

  if (actionsContainer && !isOwner) {
      actionsContainer.remove();
  } else if (actionsContainer) {
    const acceptButton = actionsContainer.querySelector(".accept-btn");
    
    // Mostra o botão de aprovar apenas se o comentário estiver pendente
    if (acceptButton && comment.status !== "pending") {
      acceptButton.remove();
    } else if (acceptButton) {
      acceptButton.addEventListener("click", async (event) => {
        event.preventDefault();
        try {
          const { error } = await supabase
            .from("comments")
            .update({ status: "approved" })
            .eq("id", comment.id);
          if (error) throw error;

          // Feedback visual antes de remover
          cardElement.style.opacity = "0.5";
          setTimeout(() => {
            cardElement.remove();
          }, 300);
        } catch (error) {
          console.error("Erro ao aprovar comentário:", error);
        }
      });
    }

    const deleteButton = actionsContainer.querySelector(".delete-btn");
    if (deleteButton) {
      deleteButton.addEventListener("click", async (event) => {
        event.preventDefault();

        if (!confirm("Deseja realmente excluir este tributo?")) return;

        try {
          const { error } = await supabase
            .from("comments")
            .delete()
            .eq("id", comment.id);
          if (error) throw error;

          cardElement.style.transition = "all 0.3s";
          cardElement.remove();
        } catch (error) {
          console.error("Erro ao deletar comentário:", error);
        }
      });
    }
  }
  return cardElement;
}

function loadCommentCardCSS() {
  return new Promise((resolve) => {
    if (document.querySelector("link[data-comment-style]")) {
      return resolve();
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/shared/components/memorial/comments/comments.css";
    link.setAttribute("data-comment-style", "true");

    link.onload = resolve;
    link.onerror = resolve;

    document.head.appendChild(link);
  });
}
