const track = document.querySelector(".carousel-track");
const slides = Array.from(track.children);
const nextButton = document.querySelector(".next");
const prevButton = document.querySelector(".prev");

let currentIndex = 0;

function moveToSlide(index) {
  track.style.transform = `translateX(-${index * 100}%)`;
}

nextButton.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % slides.length;
  moveToSlide(currentIndex);
});

prevButton.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  moveToSlide(currentIndex);
});

// Auto-slide every 5s
setInterval(() => {
  currentIndex = (currentIndex + 1) % slides.length;
  moveToSlide(currentIndex);
}, 5000);
