import "/services/supabase/supabaseClient.js";

/**
 * Global initialization for all pages
 */

// 1. Add Favicon to the head
function injectFavicon() {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = '/shared/assets/logo2.png'; // Caminho absoluto para funcionar em todas as rotas
    document.head.appendChild(link);
}

// 2. Initialize Navbar
async function initNavbarModule() {
    try {
        await import('/shared/components/navbar/navbar.js');
    } catch (error) {
        console.error("Failed to load navbar:", error);
    }
}

// 3. Initialize Global Features
async function initGlobalFeatures() {
    injectFavicon();
    await initNavbarModule();
}

initGlobalFeatures();