async function testConnection() {
    const { data, error } = await supabaseClient
        .from("memorials")
        .select("*")
        .limit(1);
    
    if (error) {
        console.error("Erro na conexão:", error);
    } else {
        console.log("Conectado com sucesso:", data);
    }
}

testConnection();