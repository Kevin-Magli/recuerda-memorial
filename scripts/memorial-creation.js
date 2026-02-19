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

function prepareAndSave(memorial) {
  if (memorial.profilePic) {
    const reader = new FileReader();

    reader.onload = function () {
      memorial.image = reader.result;
      delete memorial.profilePic;
      saveMemorial(memorial);
    };

    reader.readAsDataURL(memorial.profilePic);
  } else {
    saveMemorial(memorial);
  }
}

function saveMemorial(memorial) {
  localStorage.setItem("memorial", JSON.stringify(memorial));
  window.location.href = "/memorial.html";
}