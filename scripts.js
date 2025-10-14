const gallery = document.querySelector('.gallery');
const images = document.querySelectorAll('.gallery img');
let index = 0;
let interval = setInterval(nextImage, 4000);

function showImage(i) {
  gallery.style.transform = `translateX(-${i * 100}%)`;
}

function nextImage() {
  index = (index + 1) % images.length;
  showImage(index);
}

function prevImage() {
  index = (index - 1 + images.length) % images.length;
  showImage(index);
}

// Add event listeners for manual control
document.querySelector('.next').addEventListener('click', () => {
  nextImage();
  resetInterval();
});

document.querySelector('.prev').addEventListener('click', () => {
  prevImage();
  resetInterval();
});

function resetInterval() {
  clearInterval(interval);
  interval = setInterval(nextImage, 4000);
}

// Add flip animation when image changes
setInterval(() => {
  images[index].classList.add('flip');
  setTimeout(() => images[index].classList.remove('flip'), 800);
}, 4000);
