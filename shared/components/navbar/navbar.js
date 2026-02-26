import { getUser } from "/features/auth/auth.js";

export async function startNavbar() {
  await loadNavbar();
  initNavbar();
}



/* =========================
   LOAD NAVBAR
========================= */

async function loadNavbar() {
  const user = await getUser();
  if (!user) {
    console.log("Navbar hidden: No active session.");
    return;
  }

  await loadNavbarCSS();

  const response = await fetch("/shared/components/navbar/navbar.html");
  const navHTML = await response.text();

  let container = document.querySelector("#navbar-component");
  if (!container) {
    container = document.createElement("header");
    container.id = "navbar-component";
    document.body.prepend(container);
  }

  container.innerHTML = navHTML;
}

function loadNavbarCSS() {
  return new Promise((resolve) => {
    if (document.querySelector("link[data-navbar-style]")) {
      return resolve();
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/shared/components/navbar/navbar.css";
    link.setAttribute("data-navbar-style", "true");

    link.onload = resolve;
    link.onerror = resolve;

    document.head.appendChild(link);
  });
}

/* =========================
   INIT
========================= */

function initNavbar() {
  highlightCurrentPage();
  updateNavbarState();
}

/* =========================
   ACTIVE LINK
========================= */

function highlightCurrentPage() {
  const links = document.querySelectorAll("[data-link]");
  const currentPath = window.location.pathname;

  links.forEach((link) => {
    if (currentPath.includes(link.getAttribute("href"))) {
      link.classList.add("active");
    }
  });
}

/* =========================
   AUTH STATE
========================= */

async function updateNavbarState() {
  const accountButton = document.querySelector("#account-button");

  let user = null;

  try {
    user = await getUser();
  } catch {
    user = null;
  }

  if (!user) {
    accountButton.textContent = "Login";
    accountButton.onclick = () =>
      (window.location.href = "/features/auth/login/login-page.html");
    return;
  }

  const name = user.user_metadata?.name || user.email;
  const avatarUrl = user.user_metadata?.avatar_url;

  accountButton.innerHTML = "";

  if (avatarUrl) {
    const img = document.createElement("img");
    img.src = avatarUrl;
    img.classList.add("avatar-img");
    accountButton.appendChild(img);
  } else {
    accountButton.textContent = name.charAt(0).toUpperCase();
  }

  accountButton.onclick = () =>
    (window.location.href = "/features/auth/account/account-page.html");
}

startNavbar();