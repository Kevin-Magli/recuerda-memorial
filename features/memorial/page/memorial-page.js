document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));

  const memorials = JSON.parse(localStorage.getItem("memorials")) || [];

  const memorial = memorials.find((m) => m.id === id);

  // if (!memorial) {
  //   alert("Nenhum memorial encontrado.");
  //   return;
  // }

  renderMemorial(memorial);
});

function renderMemorial(memorial) {
  document.getElementById("memorial-name").textContent = memorial.name;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const dates = memorial.dead
    ? `${formatDate(memorial.born)} - ${formatDate(memorial.dead)}`
    : formatDate(memorial.born);

  document.getElementById("memorial-dates").textContent = dates;

  document.getElementById("memorial-description").textContent =
    memorial.description || "";

  if (memorial.image) {
    document.getElementById("memorial-image").src = memorial.image;
  }
}
