// Importação de dependências: cliente Supabase, utilitário de conversão de imagem e autenticação
import { supabase } from "/services/supabase/supabaseClient.js";
import { convertToWebP } from "/shared/utils/conversion.js";
import { getUser } from "/features/auth/auth.js";

// Captura o ID do memorial a partir dos parâmetros da URL
const urlParams = new URLSearchParams(window.location.search);
const memorialId = urlParams.get("id");
const form = document.getElementById("edit-memorial-form");

// Inicialização: carrega os dados atuais do memorial ao carregar a página
document.addEventListener("DOMContentLoaded", async () => {
  if (!memorialId) {
    alert("ID do memorial não encontrado.");
    window.location.href = "/features/dashboard/dashboard.html";
    return;
  }

  // Verifica se o usuário está autenticado
  const user = await getUser();
  if (!user) {
    alert("Você precisa estar logado.");
    return;
  }

  // Busca os dados do memorial no banco de dados
  const { data: memorial, error } = await supabase
    .from("memorials")
    .select("*")
    .eq("id", memorialId)
    .single();

  if (error || !memorial) {
    alert("Erro ao carregar memorial.");
    return;
  }

  // Segurança: verifica se o usuário logado é o dono do memorial
  if (memorial.user_id !== user.id) {
    alert("Você não tem permissão para editar este memorial.");
    window.location.href = "/features/dashboard/dashboard.html";
    return;
  }

  // Preenche os campos do formulário com os dados existentes
  form.name.value = memorial.name;
  form.born.value = memorial.birth_date || "";
  form.dead.value = memorial.death_date || "";
  form.description.value = memorial.description || "";

  const preview = document.getElementById("current-image-preview");
  if (memorial.image_url) {
    if (preview) {
      preview.src = memorial.image_url;
      preview.classList.remove("hidden");
      preview.style.display = "block";
    }
  }
});

// Listener para atualizar o preview quando uma nova imagem for selecionada
const profilePicInput = document.getElementById("profile-pic");
profilePicInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const preview = document.getElementById("current-image-preview");
  
  if (file && preview) {
    preview.src = URL.createObjectURL(file);
    preview.classList.remove("hidden");
    preview.style.display = "block";
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const profilePicFile = document.getElementById("profile-pic").files[0];
    let imageUrl = null;
    
    // Se uma nova imagem foi selecionada, faz o upload
    if (profilePicFile) {
      imageUrl = await handleImageUpload(profilePicFile);
    }

    // Monta o objeto com os dados atualizados
    const updatedData = {
      name: form.name.value,
      birth_date: form.born.value,
      death_date: form.dead.value,
      description: form.description.value,
    };

    // Só atualiza a URL da imagem se uma nova imagem tiver sido enviada
    if (imageUrl) {
      updatedData.image_url = imageUrl;
    }

    // Executa a atualização no Supabase
    const { error } = await supabase
      .from("memorials")
      .update(updatedData)
      .eq("id", memorialId);

    if (error) throw error;

    // Redireciona de volta para a página de visualização do memorial
    window.location.href = `/features/memorial/page/memorial.html?id=${memorialId}`;
  } catch (err) {
    console.error("Erro ao atualizar:", err);
    alert("Erro ao salvar alterações.");
  }
});

/**
 * Converte a imagem para WebP e faz o upload para o Storage do Supabase
 */
async function handleImageUpload(file) {
  // Otimização de imagem
  const webpBlob = await convertToWebP(file);
  if (!webpBlob) return null;

  // Gera um caminho único para evitar conflitos de nomes
  const filePath = `memorial-avatars/${crypto.randomUUID()}.webp`;
  const { error: uploadError } = await supabase.storage.from("media").upload(filePath, webpBlob);

  if (uploadError) throw new Error("Erro no upload da imagem.");

  // Retorna a URL pública para ser salva no banco de dados
  const { data } = supabase.storage.from("media").getPublicUrl(filePath);
  return data.publicUrl;
}