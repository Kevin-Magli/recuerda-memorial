const topBar = document.querySelector("#top-bar");
const tabs = document.querySelectorAll(".tab");

tabs[0].classList.add("active");

function titleHandler() {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((tab) => tab.classList.remove("active"));
      tab.classList.add("active");
    });
  });
}

titleHandler();
