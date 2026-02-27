import { supabase } from "/services/supabase/supabaseClient.js";

const urlParams = new URLSearchParams(window.location.search);
const memorialId = urlParams.get("id");

async function loadMemorialData(id) {
  const { data, error } = await supabase
    .from("memorials")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  const form = document.getElementById("edit-memorial-form");
  form.name.value = data.name;
  form.born.value = data.birth_date;
  form.dead.value = data.death_date;
  form.description.value = data.description;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const updatedMemorial = {
      name: form.name.value,
      birth_date: form.born.value,
      death_date: form.dead.value,
      description: form.description.value,
    };

    const { data, error } = await supabase
      .from("memorials")
      .update(updatedMemorial)
      .eq("id", memorialId);
    if (error) {
      console.error(error);
      return;
    }

    window.location.href =
      "/features/memorial/page/memorial.html?id=" + memorialId;
  });
}

loadMemorialData(memorialId);
