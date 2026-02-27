import { supabase } from "/services/supabase/supabaseClient.js";
import { getUser } from "/features/auth/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  console.log("ID recebido:", id);

  if (!id) {
    alert("Memorial não encontrado.");
    return;
  }

  const { data: memorial, error } = await supabase
    .from("memorials")
    .select("*")
    .eq("id", id)
    .single(); // 🔥 importante

  console.log("MEMORIAL:", memorial);
  console.log("ERROR:", error);

  if (error || !memorial) {
    console.error("Erro ao carregar memorial:", error);
    alert("Memorial não encontrado.");
    return;
  }

  const user = await getUser();
  renderMemorial(memorial, user);
});

function renderMemorial(memorial, user) {
  document.getElementById("memorial-name").textContent = memorial.name;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const dates =
    memorial.birth_date && memorial.death_date
      ? `${formatDate(memorial.birth_date)} - ${formatDate(memorial.death_date)}`
      : formatDate(memorial.birth_date);

  document.getElementById("memorial-dates").textContent = dates;
  document.getElementById("memorial-description").textContent =
    memorial.description || "";

  if (memorial.profile_image) {
    document.getElementById("memorial-image").src = memorial.profile_image;
  }

  // Configuração dos botões de ação
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
    if (editButton) editButton.style.display = "none";
    if (deleteButton) deleteButton.style.display = "none";
  }
}
