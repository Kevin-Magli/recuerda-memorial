import { supabase } from "/services/supabase/supabaseClient.js";
import { getUser } from "/features/auth/auth.js";

export async function getComments(status, memorialId = null) {
  const user = await getUser();

  let query = supabase
    .from("comments")
    .select(`*, memorials!inner(user_id)`)
    .order("created_at", { ascending: false });

  // Filtra pelo status fornecido (ex: 'approved' ou 'pending')
  if (status) query = query.eq("status", status);

  // Se for busca de pendentes (dashboard), filtra pelo dono do memorial logado
  if (status === "pending" && user) query = query.eq("memorials.user_id", user.id);

  // Se um memorial específico for passado, filtra por ele
  if (memorialId) {
    query = query.eq("memorial_id", memorialId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar comentários:", error);
    return [];
  }

  return data;
}