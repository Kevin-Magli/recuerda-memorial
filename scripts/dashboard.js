const topBar = document.querySelector("#top-bar");
const tabs = document.querySelectorAll(".tab");
const content = document.getElementById("content");



tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    
    tabs.forEach((tab) => tab.classList.remove("active"));
    tab.classList.add("active");
    
    const page = tab.dataset.tab;
    loadPage(page);
  });
});

async function loadPage(page) {
  const response = await fetch(`./components/dashboard-src/dash-${page}.html`);
  const html = await response.text();

  content.innerHTML = html;
  try {
    const module = await import(`./scripts/dash-${page}.js`);
    if (module.init) module.init();
  } catch (err) {
    console.warn(`Sem JS para ${page}`)
  }
}

tabs[0].click();
