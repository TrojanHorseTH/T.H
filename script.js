/* === FALLING PARTICLES === */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];
const COUNT = 90;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speed = Math.random() * 0.6 + 0.3;
  }

  update() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.y = 0;
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < COUNT; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", () => {
  resize();
  initParticles();
});

initParticles();
animateParticles();

/* === CHEAT PREVIEW CURSOR TILT === */
const preview = document.querySelector('.cheat-preview img');

document.addEventListener('mousemove', (e) => {
  if (!preview) return;

  const rect = preview.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const x = (centerX - e.clientX) / 25;
  const y = (centerY - e.clientY) / 25;

  preview.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});
