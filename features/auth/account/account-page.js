import { getUser, requireAuth, signOut } from "../auth.js";

requireAuth();

const user = await getUser();
const name = user.user_metadata.name;
const email = user.email;

const DOMname = document.querySelector(".name-field");
const DOMemail = document.querySelector(".email-field");

function renderAccount() {
    if (DOMname && DOMemail) {
    DOMname.textContent = name;
    DOMemail.textContent = email;
  } else {
    alert("Não ha usuario logado.");
  }
}

renderAccount();

const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut();
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Erro ao sair:", error.message);
    alert("Erro ao encerrar sessão.");
  }
})
