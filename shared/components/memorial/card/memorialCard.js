import { getUser } from "/features/auth/auth.js";
import { supabase } from "/services/supabase/supabaseClient.js";


export async function initMemCards(container, memorials) {
  // Garante que o CSS do card esteja carregado na página
  await loadMemorialCardCSS();

  // Busca o usuário logado para saber se ele tem permissão de editar/deletar
  const user = await getUser();

  // Carrega o template HTML do card apenas uma vez
  let memorialCardTemplate = null;
  if (!memorialCardTemplate) {
      const data = await fetch("/shared/components/memorial/card/memorial-card.html");
      memorialCardTemplate = await data.text();
  }

  // Garante que 'memorials' seja um array, mesmo que venha um único objeto
  if (!Array.isArray(memorials)) {
    memorials = [memorials];
  }

  // Seleciona o container onde os cards serão inseridos e limpa o conteúdo atual
  container.innerHTML = "";

  // Itera sobre cada memorial e cria o elemento visual (DOM)
  for (const memorial of memorials) {
    const card = await renderSingleMemorialCard(memorial, user, memorialCardTemplate);
    container.appendChild(card);
  }
}

async function renderSingleMemorialCard(memorial, user, template) {

  const temp = document.createElement("div");
  temp.innerHTML = template.trim();
  
  // Pega o elemento principal do card
  const cardElement = temp.firstElementChild;

  // Preenche o nome do memorial
  cardElement.querySelector(".mem-card-name").textContent = memorial.name;

  // Função interna para formatar a data de YYYY-MM-DD para DD/MM/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const dates =
    memorial.birth_date && memorial.death_date
      ? `✴ ${formatDate(memorial.birth_date)} \n † ${formatDate(memorial.death_date)}`
      : `† ${formatDate(memorial.birth_date)}`;

  // Preenche as datas e a descrição no card
  cardElement.querySelector(".mem-card-dates").textContent = dates;
  cardElement.querySelector(".mem-card-description").textContent =
    memorial.description || "";

  // Lógica de Imagem
  if (memorial.image_url) {
    const imgElement = cardElement.querySelector(".mem-card-profile");
    if (imgElement) {
      imgElement.src = memorial.image_url;
    }
  }

  // Configura as ações (botões) do card
  const actionsContainer = cardElement.querySelector(".actionsContainer");

  if (actionsContainer) {
    // Botão Abrir: Redireciona para a página de visualização
    const openButton = actionsContainer.querySelector(".open");
    if (openButton) {
      openButton.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `/features/memorial/page/memorial.html?id=${memorial.id}`;
      });
    }

    // Botão Switch: Alterna a classe 'flipped' para animação de giro
    const switchButton = actionsContainer.querySelector(".switch");
    if (switchButton) {
      switchButton.addEventListener("click", (e) => {
        e.preventDefault();
        cardElement.classList.toggle("flipped");
      });
    }

    // Botão Editar: Redireciona para a página de edição
    const editButton = actionsContainer.querySelector(".edit");
    if (editButton) {
      editButton.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `/features/memorial/edit/edit.html?id=${memorial.id}`;
      });
    }
    // Botão Deletar: Confirma e remove do banco de dados e da tela
    const deleteButton = actionsContainer.querySelector(".delete");
    if (deleteButton) {
      deleteButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const confirmed = confirm(
          `Tem certeza que deseja apagar o memorial de "${memorial.name}"? Essa ação não pode ser desfeita.`,
        );

        if (confirmed) {
          // Deleta no Supabase
          const { error } = await supabase
            .from("memorials")
            .delete()
            .eq("id", memorial.id);

          if (error) {
            console.error("Error deleting memorial:", error);
            alert("Falha ao apagar memorial, tente novamente.");
          } else {
            // Efeito visual de sumir antes de remover o elemento do DOM
            cardElement.style.transition = "opacity 0.3s ease";
            cardElement.style.opacity = "0";
            
            setTimeout(() => {
              cardElement.remove();
            }, 300);
          }
        }
      });
    }

    // Lógica de Permissão: Só mostra botões de Editar/Deletar se o usuário for o dono do memorial
    const editBtn = actionsContainer.querySelector(".edit");
    const deleteBtn = actionsContainer.querySelector(".delete");
    const isOwner = user && user.id === memorial.user_id;

    if (!isOwner) {
      if (editBtn) editBtn.style.display = "none";
      if (deleteBtn) deleteBtn.style.display = "none";
    }
  }

  return cardElement;
}

// Função para injetar o CSS do componente dinamicamente no <head>
function loadMemorialCardCSS() {
  return new Promise((resolve) => {
    if (document.querySelector("link[data-memcard-style]")) {
      return resolve();
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/shared/components/memorial/card/memorial-card.css";
    link.setAttribute("data-memcard-style", "true");

    link.onload = resolve;
    link.onerror = resolve;

    document.head.appendChild(link);
  });
}

// there is a button in the actions container called switch(class). I need you to do the following. When click it will cause a "card flip" animation on it's card, revealing the description that is now display none, it will appear at the back of the card. The switch button must also appear at the back to revert the card to it's original state