const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let particles = [];
let animationRunning = false;

// Fireworks Logic
class Firework {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetY = Math.random() * (canvas.height / 2);
    this.speed = Math.random() * 4 + 4;
    this.exploded = false;
    this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
  }

  update() {
    if (!this.exploded) {
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        this.exploded = true;
        this.explode();
      }
    }
  }

  draw() {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  explode() {
    for (let i = 0; i < 70; i++) {
      particles.push(new Particle(this.x, this.y, this.color));
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 1;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.015;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05;
    this.alpha -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function animateFireworks() {
  ctx.fillStyle = 'rgba(3, 3, 5, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.08) {
    fireworks.push(new Firework());
  }

  fireworks.forEach((fw, index) => {
    fw.update();
    fw.draw();
    if (fw.exploded) fireworks.splice(index, 1);
  });

  particles.forEach((p, index) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) particles.splice(index, 1);
  });

  if (animationRunning) {
    requestAnimationFrame(animateFireworks);
  }
}

// Photo Data in Exact Order requested
const photoSteps = [
  { src: "photo1.jpg", caption: "The cutest troublemaker! 😄" },
  { src: "photo2.jpg", caption: "Always smiling & shining ✨" },
  { src: "photo3.jpg", caption: "Best partner in crime! 🤝❤️" },
  { src: "photo4.jpg", caption: "The rockstar sister! 🌟" }
];

let currentStep = -1;

// Open Gift Box Action
function openSurprise() {
  // Play Music
  const music = document.getElementById('bgMusic');
  music.play().catch(e => console.log("Audio play error:", e));

  // Trigger Side Party Poppers Animation
  const leftPop = document.getElementById('leftPop');
  const rightPop = document.getElementById('rightPop');
  leftPop.classList.add('active-left');
  rightPop.classList.add('active-right');

  // Trigger Camera Flash Effect
  triggerFlash();

  // Start Background Fireworks
  animationRunning = true;
  animateFireworks();

  // Switch Scenes after slight delay
  setTimeout(() => {
    document.getElementById('sceneIntro').classList.remove('active');
    document.getElementById('sceneContent').classList.add('active');
    nextStep(); // Load first photo
  }, 600);
}

// Typewriter Subtitle Effect for Captions
function typeWriterEffect(text, elementId) {
  const el = document.getElementById(elementId);
  el.innerText = "";
  let i = 0;
  function type() {
    if (i < text.length) {
      el.innerText += text.charAt(i);
      i++;
      setTimeout(type, 40);
    }
  }
  type();
}

// Camera Flash Trigger
function triggerFlash() {
  const flash = document.getElementById('cameraFlash');
  flash.style.opacity = '0.7';
  setTimeout(() => {
    flash.style.opacity = '0';
  }, 300);
}

// Handle Photo and Finale progression on click
function nextStep() {
  currentStep++;
  triggerFlash();

  if (currentStep < photoSteps.length) {
    // Show Photos one by one with typewriter caption
    const imgEl = document.getElementById('displayPhoto');
    imgEl.src = photoSteps[currentStep].src;
    typeWriterEffect(photoSteps[currentStep].caption, 'photoCaption');
  } else if (currentStep === photoSteps.length) {
    // Hide photo card and show Grand Finale "Bauni" Screen
    document.getElementById('photoCardBox').classList.add('hidden');
    document.getElementById('photoCaption').classList.add('hidden');
    document.querySelector('.tap-instruction').classList.add('hidden');
    
    document.getElementById('finaleBox').classList.remove('hidden');
  }
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});