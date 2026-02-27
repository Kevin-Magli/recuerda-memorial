import { getUser } from "/features/auth/auth.js";
import { supabase } from "/services/supabase/supabaseClient.js";

export async function initMemCards(memorials) {
    await loadMemorialCardCSS();
    
    const user = await getUser();

    if (!Array.isArray(memorials)) {
        memorials = [memorials];
    }

    const container = document.querySelector(".memorial-list"); // esse aqui é usado no container que vai conter todos os memoriais
    container.innerHTML = "";

    for (const memorial of memorials) {
        const card = await renderSingleMemorialCard(memorial, user);
        container.appendChild(card);
    }
}

async function renderSingleMemorialCard(memorial, user) {
    
    const data = await fetch("/shared/components/memorial/memorial-card.html");
    const htmlText = await data.text();

    // elemento temporario
    const temp = document.createElement("div");
    temp.innerHTML = htmlText.trim();
    const cardElement = temp.firstElementChild;
    
    cardElement.querySelector(".mem-card-name").textContent = memorial.name;
    
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split("-");
        return `${day}/${month}/${year}`;
    };

    const dates = memorial.birth_date && memorial.death_date
        ? `${formatDate(memorial.birth_date)} - ${formatDate(memorial.death_date)}`
        : formatDate(memorial.birth_date);

    cardElement.querySelector(".mem-card-dates").textContent = dates;
    cardElement.querySelector(".mem-card-description").textContent = memorial.description || "";


    const actionsContainer = cardElement.querySelector(".mem-card-actions"); 

    if (actionsContainer) {
        const openButton = actionsContainer.querySelector(".btn.open");
        if (openButton) {
            openButton.onclick = () => {
                window.location.href = `/features/memorial/page/memorial.html?id=${memorial.id}`;
            };
        }
        const editButton = actionsContainer.querySelector(".btn.edit");
        if (editButton) {
            editButton.onclick = () => {
                window.location.href = `/features/memorial/edit/edit.html?id=${memorial.id}`;
            }
        }
        const deleteButton = actionsContainer.querySelector(".btn.delete");
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
                        // Refresh the page to update the list
                        window.location.reload();
                    }
                }
            }
        }

        if (user && user.id === memorial.user_id) {
            actionsContainer.style.display = "flex";
        } else {
            actionsContainer.style.display = "none";
        }
    }

    return cardElement;
}

function loadMemorialCardCSS() {
    return new Promise((resolve) => {
        if (document.querySelector("link[data-memcard-style]")) {
            return resolve();
        }

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/shared/components/memorial/memorial-card.css";
        link.setAttribute("data-memcard-style", "true");

        link.onload = resolve;
        link.onerror = resolve;

        document.head.appendChild(link);
    });
}