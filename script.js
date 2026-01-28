// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully');
    
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            const icon = this.querySelector('i');
            if (document.body.classList.contains('light-theme')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
            
            // Save theme preference
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.querySelector('i').classList.remove('fa-moon');
            themeToggle.querySelector('i').classList.add('fa-sun');
        }
    }
    
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Smooth scroll
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Particle System
    const particleSlider = document.getElementById('particleSlider');
    const particleCount = document.getElementById('particleCount');
    const toggleParticlesBtn = document.getElementById('toggleParticles');
    const resetBtn = document.getElementById('resetBtn');
    const previewCanvas = document.getElementById('previewCanvas');
    
    let particles = [];
    let animationId = null;
    let particlesEnabled = true;
    
    if (previewCanvas && particleSlider && particleCount) {
        // Setup canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        previewCanvas.appendChild(canvas);
        
        // Set canvas size
        function resizeCanvas() {
            canvas.width = previewCanvas.clientWidth;
            canvas.height = previewCanvas.clientHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle class
        class Particle {
            constructor() {
                this.reset();
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.color = `rgba(99, 102, 241, ${Math.random() * 0.5 + 0.3})`;
                this.opacity = 1;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Bounce off edges
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
                
                // Fade in/out effect
                this.opacity += 0.02;
                if (this.opacity >= 1) this.opacity = 1;
            }
            
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Glow effect
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        
        // Initialize particles
        function initParticles(count) {
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        
        // Animation loop
        function animateParticles() {
            if (!particlesEnabled) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connecting lines
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
            ctx.lineWidth = 1;
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            animationId = requestAnimationFrame(animateParticles);
        }
        
        // Start with initial particles
        initParticles(parseInt(particleSlider.value));
        animateParticles();
        
        // Update particle count
        particleSlider.addEventListener('input', function() {
            const count = parseInt(this.value);
            particleCount.textContent = count;
            initParticles(count);
        });
        
        // Toggle particles
        if (toggleParticlesBtn) {
            toggleParticlesBtn.addEventListener('click', function() {
                particlesEnabled = !particlesEnabled;
                this.textContent = particlesEnabled ? 'Hide Particles' : 'Show Particles';
                
                if (particlesEnabled) {
                    animateParticles();
                } else {
                    cancelAnimationFrame(animationId);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            });
        }
        
        // Reset button
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                particleSlider.value = 50;
                particleCount.textContent = '50';
                particlesEnabled = true;
                if (toggleParticlesBtn) {
                    toggleParticlesBtn.textContent = 'Hide Particles';
                }
                initParticles(50);
            });
        }
    }
    
    // Particle demo button
    const particleDemoBtn = document.getElementById('particleDemo');
    if (particleDemoBtn) {
        particleDemoBtn.addEventListener('click', function() {
            // Create fullscreen particle demo
            const demo = document.createElement('div');
            demo.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            `;
            
            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Close Demo';
            closeBtn.className = 'btn btn-primary';
            closeBtn.style.marginTop = '20px';
            
            const demoCanvas = document.createElement('canvas');
            demo.style.zIndex = '10000';
            
            demo.appendChild(demoCanvas);
            demo.appendChild(closeBtn);
            document.body.appendChild(demo);
            
            // Setup demo canvas
            const demoCtx = demoCanvas.getContext('2d');
            demoCanvas.width = window.innerWidth;
            demoCanvas.height = window.innerHeight;
            
            // Demo particles
            const demoParticles = [];
            for (let i = 0; i < 200; i++) {
                demoParticles.push({
                    x: Math.random() * demoCanvas.width,
                    y: Math.random() * demoCanvas.height,
                    size: Math.random() * 4 + 1,
                    speedX: Math.random() * 3 - 1.5,
                    speedY: Math.random() * 3 - 1.5,
                    color: `hsl(${Math.random() * 360}, 100%, 70%)`
                });
            }
            
            // Demo animation
            function animateDemo() {
                demoCtx.clearRect(0, 0, demoCanvas.width, demoCanvas.height);
                
                demoParticles.forEach(p => {
                    p.x += p.speedX;
                    p.y += p.speedY;
                    
                    if (p.x > demoCanvas.width || p.x < 0) p.speedX *= -1;
                    if (p.y > demoCanvas.height || p.y < 0) p.speedY *= -1;
                    
                    demoCtx.fillStyle = p.color;
                    demoCtx.beginPath();
                    demoCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    demoCtx.fill();
                    
                    // Glow
                    demoCtx.shadowColor = p.color;
                    demoCtx.shadowBlur = 15;
                    demoCtx.beginPath();
                    demoCtx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                    demoCtx.fill();
                    demoCtx.shadowBlur = 0;
                });
                
                requestAnimationFrame(animateDemo);
            }
            
            animateDemo();
            
            // Close demo
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(demo);
            });
            
            // Close on escape
            document.addEventListener('keydown', function closeOnEscape(e) {
                if (e.key === 'Escape') {
                    document.body.removeChild(demo);
                    document.removeEventListener('keydown', closeOnEscape);
                }
            });
        });
    }
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(26, 26, 46, 0.95)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(26, 26, 46, 0.9)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
    
    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Update active nav link on scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
