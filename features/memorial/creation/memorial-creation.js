import { convertToWebP } from "/shared/utils/conversion.js";

const form = document.getElementById("memorial-form");

form.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  const memorial = getFormData();

  if (!validateMemorial(memorial)) return;

  prepareAndSave(memorial);
}

function getFormData() {
  const id = Date.now();
  const name = document.getElementById("name").value;
  const born = document.getElementById("born").value;
  const dead = document.getElementById("dead").value;
  const description = document.getElementById("description").value;
  const profilePic = document.getElementById("profile-pic").files[0];

  return {
    id,
    name,
    born,
    dead,
    description,
    profilePic,
  };
}

function validateMemorial(memorial) {
  if (!memorial.name) {
    alert("Nome é obrigatório");
    return false;
  }

  if (memorial.born && memorial.dead && memorial.born > memorial.dead) {
    alert("Data inválida.");
    return false;
  }

  return true;
}

async function prepareAndSave(memorial) {
  try {
    if (memorial.profilePic) {
      const webpBlob = await convertToWebP(memorial.profilePic);

      const reader = new FileReader();

      const readAsDataURL = (blob) => {
        return new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      memorial.image = await readAsDataURL(webpBlob);
      delete memorial.profilePic;
    }

    saveMemorial(memorial);
  } catch (err) {
    console.error("Erro ao preparar e salvar o memorial:", err);
    alert("Ocorreu um erro ao criar o memorial. Por favor, tente novamente.");
  }
}

function saveMemorial(memorial) {
  // convertemos os memoriais do localStorage para uma lista
  const memorials = JSON.parse(localStorage.getItem("memorials")) || [];
  // jogamos o memorial(carregado com a função) pra dentro da lista (ainda não no localStorage)
  memorials.push(memorial);
  // substituimos a lista do localStorage com a lista incrementada
  localStorage.setItem("memorials", JSON.stringify(memorials));
  // O link está correto pois o arquivo memorial.html está dentro da pasta 'page' relativa a este diretório
  window.location.href = "../page/memorial.html?id=" + memorial.id;
}
