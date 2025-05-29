// Manage slides and navigation with smooth fade and slide transitions
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
let isTransitioning = false;

const nextButtons = document.querySelectorAll('.next-btn');

nextButtons.forEach(button => {
  button.addEventListener('click', async () => {
    if (isTransitioning) return;
    if (currentSlide < slides.length - 1) {
      await transitionToSlide(currentSlide + 1);
    }
  });
});

// Helper: wait for transition end promise
function waitTransitionEnd(element) {
  return new Promise(resolve => {
    function handler(event) {
      // Ensure transition is opacity or transform to avoid multiple calls
      if (event.target === element && (
        event.propertyName === 'opacity' || event.propertyName === 'transform')) {
        element.removeEventListener('transitionend', handler);
        resolve();
      }
    }
    element.addEventListener('transitionend', handler);
  });
}

async function transitionToSlide(newIndex) {
  isTransitioning = true;
  const current = slides[currentSlide];
  const next = slides[newIndex];

  // Start fade out of current slide
  current.classList.add('fade-out');
  // Wait for fade out transition to finish
  await waitTransitionEnd(current);

  // Hide current slide
  current.classList.remove('active', 'fade-out');

  // Show next slide but hidden (opacity 0 and translateX from CSS)
  next.classList.add('active');

  // Wait a frame for transition to trigger
  requestAnimationFrame(() => {
    next.style.opacity = '1';
    next.style.transform = 'translateX(0)';
  });

  // Wait for fade in transition to finish
  await waitTransitionEnd(next);

  currentSlide = newIndex;
  // Focus main content for accessibility
  const focusEl = next.querySelector('div, img, button');
  if (focusEl) focusEl.focus();

  isTransitioning = false;
}

// Music start button
const music = document.getElementById('bgMusic');
const startMusicBtn = document.getElementById('startMusicBtn');
if (startMusicBtn) {
  startMusicBtn.addEventListener('click', () => {
    music.play().catch(e => {
      alert("Gagal memutar musik secara otomatis. Silakan klik tombol play pada perangkat Anda.");
    });
    startMusicBtn.disabled = true;
    startMusicBtn.textContent = 'Musik dimainkan';
    startMusicBtn.style.background = '#394a56';
    startMusicBtn.style.cursor = 'default';
  });
}

// Accessibility: Enable keyboard navigation: Enter key activates buttons
document.body.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement.tagName === 'BUTTON') {
    document.activeElement.click();
  }
});
