// Importação de utilitários para conversão de imagem, cliente do banco e autenticação
import { convertToWebP } from "/shared/utils/conversion.js"; 
import { supabase } from "/services/supabase/supabaseClient.js";

// Seleção do formulário de criação no DOM
const form = document.getElementById("memorial-form");

// Ouvinte de evento para o envio do formulário
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Evita o recarregamento da página

  try {
    // Verifica se o usuário está autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("Você precisa de uma conta pra criar um memorial.");
      return;
    }

    // Coleta o nome e o arquivo de imagem para validações iniciais
    const name = document.getElementById("name").value;
    const profilePicFile = document.getElementById("profile-pic").files[0];

    if (!name) {
      alert("O nome é obrigatório.");
      return;
    }

    let imageUrl = null;

    // FLUXO ARQUITETURAL: Se houver imagem, fazemos o upload ANTES de criar o memorial.
    // Isso evita criar um registro no banco se o upload da imagem falhar.
    if (profilePicFile) {
      imageUrl = await handleImageUpload(profilePicFile);
      if (!imageUrl) {
        alert("Erro ao enviar imagem. O memorial não foi criado.");
        return; // Interrompe o processo se a imagem falhar
      }
    }

    // Agora criamos o memorial já com a URL da imagem (ou null se não houver)
    const memorialData = {
      user_id: user.id,
      name: name,
      birth_date: document.getElementById("born").value || null,
      death_date: document.getElementById("dead").value || null,
      description: document.getElementById("description").value || null,
      image_url: imageUrl,
    };

    const memorial = await saveMemorialData(memorialData);

    // Redireciona para a página do memorial recém-criado
    window.location.href = `/features/memorial/page/memorial.html?id=${memorial.id}`;
  } catch (err) {
    console.error("Erro no processo:", err);
    alert(err.message || "Algo deu errado.");
  }
});

/**
 * Insere os dados iniciais do memorial na tabela 'memorials'
 */
async function saveMemorialData(memorialData) {
  const { data, error } = await supabase
    .from("memorials")
    .insert([memorialData])
    .select()
    .single();

  if (error) throw new Error("Erro ao salvar dados do memorial.");
  return data;
}

/**
 * Converte a imagem para WebP e realiza o upload para o Storage.
 * Usa um UUID aleatório para o nome do arquivo, já que o memorial ainda não foi criado.
 */
async function handleImageUpload(file) {
  // Converte o arquivo original para o formato WebP (otimização)
  const webpBlob = await convertToWebP(file);
  if (!webpBlob) return null;

  // Gera um nome único para o arquivo
  const filePath = `memorial-avatars/${crypto.randomUUID()}.webp`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(filePath, webpBlob, {
      contentType: "image/webp",
      upsert: true,
    });

  if (uploadError) {
    console.error("Erro no upload:", uploadError);
    throw new Error("Erro ao enviar imagem. Tente novamente.");
  }

  // Recupera a URL pública para acesso externo
  const { data: publicUrlData } = supabase.storage
    .from("media")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
