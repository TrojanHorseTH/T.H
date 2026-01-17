const logo = document.querySelector('.hero-logo img');

window.addEventListener('mousemove', (e) => {
  const x = (window.innerWidth / 2 - e.pageX) / 40;
  const y = (window.innerHeight / 2 - e.pageY) / 40;
  logo.style.transform = `translate(${x}px, ${y}px)`;
});
