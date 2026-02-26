/**
 * Global initialization for all pages
 */

// 1. Add Favicon to the head
function injectFavicon() {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = '/assets/logo2.png'; // Adjust path if necessary
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