import { supabase } from "/services/supabase/supabaseClient.js";

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

  renderMemorial(memorial);
});

function renderMemorial(memorial) {
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
}
