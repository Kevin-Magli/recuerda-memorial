const carouselContainer = document.querySelector(".carousel");
const carouselTrack = carouselContainer.querySelector(".carousel-track");
const carouselButtons = document.querySelector(".carousel-buttons");
const backButton = carouselButtons.querySelector(".prev");
const nextButton = carouselButtons.querySelector(".next");

const items = document.querySelectorAll(".carousel-item");
const totalItems = items.length;

let currentIndex = 0;

// Create and insert the dots container
const dotsNav = document.createElement("div");
dotsNav.classList.add("carousel-dots");
carouselContainer.appendChild(dotsNav);

// Create dots for each item and store them
const dots = [];
for (let i = 0; i < totalItems; i++) {
  const dot = document.createElement("button");
  dot.classList.add("carousel-dot");
  dot.addEventListener("click", () => {
    currentIndex = i;
    renderCarousel();
  });
  dotsNav.appendChild(dot);
  dots.push(dot);
}

function updateDots() {
  dots.forEach((dot, index) => {
    if (index === currentIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

function renderCarousel() {
  items.forEach((item, index) => {
    if (index === currentIndex) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
  updateDots(); // Update dots every time the carousel is rendered
}

function carouselDirection(direction) {
  if (direction === "left") {
    currentIndex -= 1;
    if (currentIndex < 0) {
      currentIndex = totalItems - 1;
    }
  }

  if (direction === "right") {
    currentIndex += 1;
    if (currentIndex >= totalItems) {
      currentIndex = 0;
    }
  }

  renderCarousel();
}

backButton.addEventListener("click", () => {
  carouselDirection("left");
});
nextButton.addEventListener("click", () => {
  carouselDirection("right");
});

renderCarousel(); // Initial render
