import { convertToWebP } from "/shared/utils/conversion.js";
import { supabase } from "/services/supabase/supabaseClient.js";

const form = document.getElementById("memorial-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Você precisa de uma conta pra criar um memorial.");
      return;
    }

    const name = document.getElementById("name").value;
    const birthDate = document.getElementById("born").value;
    const deathDate = document.getElementById("dead").value;
    const description = document.getElementById("description").value;
    // const profilePic = document.getElementById("profile-pic").files[0];

    if (!name) {
      alert("O nome é obrigatório.");
      return;
    }

    const { data, error } = await supabase
      .from("memorials")
      .insert([
        {
          user_id: user.id,
          name: name,
          birth_date: birthDate || null,
          death_date: deathDate || null,
          description: description || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Erro de insert no supabase:", error);
      alert("Erro ao criar memorial.");
      return;
    }

    window.location.href =
      "/features/memorial/page/memorial.html?id=" + data.id;
  } catch (err) {
    console.error("Erro inexperado:", err);
    alert("Algo deu errado.");
  }
});