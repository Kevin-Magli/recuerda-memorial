document.addEventListener("DOMContentLoaded", () => {
    const memorial = JSON.parse(localStorage.getItem("memorial"));

    if (!memorial) {
        alert("Nenhum memorial encontrado.");
        return;
    }

    renderMemorial(memorial);
});

function renderMemorial(memorial) {
    document.getElementById("memorial-name").textContent = memorial.name;

    const dates = memorial.dead
        ? `${memorial.born} - ${memorial.dead}`
        : `${memorial.born}`;
    
    document.getElementById("memorial-dates").textContent = dates;

    document.getElementById("memorial-description").textContent = memorial.description || "";

    if (memorial.image) {
        document.getElementById("memorial-image").src = memorial.image;
    }
}
