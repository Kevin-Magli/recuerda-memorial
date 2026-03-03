import { supabase } from "/services/supabase/supabaseClient.js";

export async function getMemorials() {
  const { data, error } = await supabase.from("memorials").select("*");
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

// Sim, este arquivo é necessário. Ele centraliza a lógica de busca de dados do Supabase para memoriais, permitindo que múltiplos componentes (como o explore.js) consumam esses dados de forma padronizada sem duplicar código de consulta.
