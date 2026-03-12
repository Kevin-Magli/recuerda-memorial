import { supabase } from "/services/supabase/supabaseClient.js";
import { getUser } from "/features/auth/auth.js";

import { initCommentCards } from "/shared/components/memorial/comments/comments.js";
import { getComments } from "/shared/components/memorial/core/commentService.js";


// Aguarda o carregamento do DOM para iniciar a busca dos dados
document.addEventListener("DOMContentLoaded", async () => {
  // Extrai o ID do memorial da URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    console.error("ID não fornecido na URL");
    document.body.innerHTML = "<h1>Memorial não encontrado</h1>";
    return;
  }

  const { data: memorial, error } = await supabase
    .from("memorials")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !memorial) {
    console.error("Erro ao carregar memorial:", error);
    alert("Memorial não encontrado.");
    return;
  }

  // Obtém o usuário logado para verificar permissões de edição/exclusão
  const user = await getUser();
  renderMemorial(memorial, user);
  
  // Inicializa a exibição dos comentários aprovados para este memorial
  initComments(id);

});

/**
 * Preenche o HTML com os dados do memorial e configura ações do proprietário
 */
function renderMemorial(memorial, user) {
  document.getElementById("memorial-name").textContent = memorial.name;

  // Formata datas de YYYY-MM-DD para DD/MM/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const dates =
    memorial.birth_date && memorial.death_date
      ? `✴ ${formatDate(memorial.birth_date)} \n † ${formatDate(memorial.death_date)}`
      : `✴ ${formatDate(memorial.birth_date)}`;

  document.getElementById("memorial-dates").textContent = dates;
  document.getElementById("memorial-description").textContent =
    memorial.description || "";

  // Renderiza a imagem se ela existir (URL salva no banco via memorialCreation)
  if (memorial.image_url) {
    const imgElement = document.getElementById("memorial-image");
    if (imgElement) {
      imgElement.src = memorial.image_url;
    }
  }

  // Configuração dos botões de ação (apenas para o criador do memorial)
  const editButton = document.querySelector(".btn.edit");
  const deleteButton = document.querySelector(".btn.delete");

  if (user && user.id === memorial.user_id) {
    if (editButton) {
      editButton.onclick = () => {
        window.location.href = `/features/memorial/edit/edit.html?id=${memorial.id}`;
      };
    }
    
    if (deleteButton) {
      deleteButton.onclick = async () => {
        const confirmed = confirm(`Tem certeza que deseja apagar o memorial de "${memorial.name}"? Essa ação não pode ser desfeita.`);
        if (confirmed) {
          const { error } = await supabase
            .from("memorials")
            .delete()
            .eq("id", memorial.id);

          if (error) {
            console.error("Error deleting memorial:", error);
            alert("Falha ao apagar memorial, tente novamente.");
          } else {
            window.location.href = "/features/dashboard/dashboard.html";
          }
        }
      };
    }
  } else {
    // Esconde botões se o usuário não for o dono
    if (editButton) editButton.style.display = "none";
    if (deleteButton) deleteButton.style.display = "none";
  }
}

const tributeForm = document.getElementById("tribute-form");

tributeForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cooldown = 2 * 60 * 1000; // 2 minutos
  const lastSend = localStorage.getItem("lastCommentTime");

  if (lastSend && Date.now() - lastSend < cooldown) {
    const remainingMs = cooldown - (Date.now() - lastSend);
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    alert(`Espere mais ${remainingSeconds} segundos antes de enviar outro comentário.`);
    return;
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const memorialId = params.get("id");

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      alert("Não é possivel enviar comentario sem uma conta.");
      return;
    }
    
    const tributeName = document.getElementById("tribute-name").value;
    const tributeMessage = document.getElementById("tribute-message").value;

    if (!tributeMessage.trim()) {
      alert("Não é possivel enviar uma mensagem sem escrever a mensagem");
      return;
    }

    const tributeMessageData = {
      author_id: user.id,
      memorial_id: memorialId,
      author_name: tributeName || null,
      message: tributeMessage,
    }

    const comment = await saveTributeMessageData(tributeMessageData)

    localStorage.setItem("lastCommentTime", Date.now());
    alert("Homenagem enviada com sucesso!"); // substituir por um card bonitinho que esconde o forms pós envio, ou um alerta em baixo
    tributeForm.reset(); 

    localStorage.setItem("lastCommentTime", Date.now());
    // TODO: Adicionar lógica para atualizar a lista de comentários na tela sem refresh

  } catch (error) {
    console.error(error);
  };
});

async function saveTributeMessageData(tributeMessageData) {
  const { data, error } = await supabase
    .from("comments")
    .insert([tributeMessageData])
    .select()
    .single();

  if (error) throw new Error("Erro ao salvar dados do comentario.");
  return data;
}

/**
 * Inicializa a seção de tributos (comentários) na página do memorial.
 */
async function initComments(memorialId) {
  const container = document.querySelector(".query-area");
  if (!container) return;

  try {
    // Busca apenas os comentários com status 'approved' para este memorial específico
    const comments = await getComments("approved", memorialId);

    // Renderiza os cards no container
    await initCommentCards(container, comments);
  } catch (error) {
    console.error("Erro ao carregar comentários:", error);
  }
 }
