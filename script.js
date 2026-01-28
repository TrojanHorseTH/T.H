// Enhanced Particle System for Cyberpunk Terminal
document.addEventListener('DOMContentLoaded', function() {
    console.log('T.H Terminal Initialized');
    
    // Canvas Setup
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle System
    class Particle {
        constructor() {
            this.reset();
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.originalX = this.x;
            this.originalY = this.y;
        }
        
        reset() {
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = Math.random() > 0.5 ? '#00ff9d' : '#00b8ff';
            this.opacity = Math.random() * 0.5 + 0.3;
            this.waveOffset = Math.random() * Math.PI * 2;
            this.waveAmplitude = Math.random() * 2 + 1;
            this.waveFrequency = Math.random() * 0.02 + 0.01;
            this.pulseSpeed = Math.random() * 0.05 + 0.02;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }
        
        update(time) {
            // Gentle floating motion with wave pattern
            this.x = this.originalX + Math.sin(time * this.waveFrequency + this.waveOffset) * this.waveAmplitude;
            this.y = this.originalY + Math.cos(time * this.waveFrequency + this.waveOffset) * this.waveAmplitude;
            
            // Add drift
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
            
            // Pulsing opacity
            this.opacity = 0.3 + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.2;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            
            // Particle with glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner highlight
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    // Initialize particles
    const particles = [];
    const particleCount = 250;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Performance monitoring
    let fps = 60;
    let frameCount = 0;
    let lastTime = performance.now();
    
    // Animation loop
    let animationId;
    let particlesEnabled = true;
    
    function animate(currentTime) {
        animationId = requestAnimationFrame(animate);
        
        // Calculate FPS
        frameCount++;
        if (currentTime - lastTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = currentTime;
            updateStats();
        }
        
        // Clear with fade effect for trails
        ctx.fillStyle = 'rgba(10, 10, 18, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (!particlesEnabled) return;
        
        const time = currentTime * 0.001; // Convert to seconds
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update(time);
            particle.draw();
        });
        
        // Draw connections between nearby particles
        drawConnections();
    }
    
    function drawConnections() {
        ctx.strokeStyle = 'rgba(0, 255, 157, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    // Adjust opacity based on distance
                    const opacity = 0.1 * (1 - distance / 100);
                    ctx.strokeStyle = `rgba(0, 255, 157, ${opacity})`;
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function updateStats() {
        const fpsCounter = document.getElementById('fpsCounter');
        const particleCountElement = document.getElementById('particleCount');
        const systemLoad = document.getElementById('systemLoad');
        
        if (fpsCounter) fpsCounter.textContent = fps;
        if (particleCountElement) particleCountElement.textContent = particles.length;
        if (systemLoad) {
            const load = Math.floor(Math.random() * 10 + 10); // Simulated load
            systemLoad.textContent = `${load}%`;
        }
    }
    
    // Start animation
    animate(performance.now());
    
    // UI Interactions
    const toggleMatrixBtn = document.getElementById('toggleMatrix');
    const particleToggle = document.getElementById('particleToggle');
    const launchCheatBtn = document.getElementById('launchCheat');
    const viewProjectsBtn = document.getElementById('viewProjects');
    
    // Toggle Matrix Button
    if (toggleMatrixBtn) {
        toggleMatrixBtn.addEventListener('click', function() {
            particlesEnabled = !particlesEnabled;
            this.classList.toggle('active');
            
            if (particlesEnabled) {
                this.querySelector('.btn-text').textContent = 'TOGGLE_MATRIX';
                particles.forEach(p => p.reset());
            } else {
                this.querySelector('.btn-text').textContent = 'ENABLE_MATRIX';
            }
        });
    }
    
    // Particle Toggle Switch
    if (particleToggle) {
        particleToggle.addEventListener('change', function() {
            particlesEnabled = this.checked;
        });
    }
    
    // Launch Cheat Menu
    if (launchCheatBtn) {
        launchCheatBtn.addEventListener('click', function() {
            window.location.href = 'cheat-menu.html';
        });
    }
    
    // View Projects
    if (viewProjectsBtn) {
        viewProjectsBtn.addEventListener('click', function() {
            document.querySelector('[data-tab="projects"]').click();
        });
    }
    
    // Tab Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const tab = this.dataset.tab;
            
            // Handle different tabs
            switch(tab) {
                case 'cheat':
                    window.location.href = 'cheat-menu.html';
                    break;
                case 'projects':
                    showTab('projects');
                    break;
                case 'about':
                    showTab('about');
                    break;
                default:
                    showTab('main');
            }
        });
    });
    
    function showTab(tabName) {
        // Hide all tabs
        const tabs = document.querySelectorAll('.welcome-section');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Show selected tab
        const activeTab = document.getElementById(`${tabName}-tab`);
        if (activeTab) activeTab.classList.add('active');
    }
    
    // Terminal Input
    const terminalInput = document.getElementById('terminalInput');
    const executeBtn = document.getElementById('executeBtn');
    
    if (terminalInput && executeBtn) {
        terminalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                executeCommand();
            }
        });
        
        executeBtn.addEventListener('click', executeCommand);
    }
    
    function executeCommand() {
        const command = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';
        
        switch(command) {
            case 'help':
                alert('Available commands:\n- clear\n- particles [on/off]\n- fps\n- about\n- projects\n- github');
                break;
            case 'clear':
                particles.length = 0;
                break;
            case 'particles on':
                particlesEnabled = true;
                particleToggle.checked = true;
                break;
            case 'particles off':
                particlesEnabled = false;
                particleToggle.checked = false;
                break;
            case 'fps':
                alert(`Current FPS: ${fps}`);
                break;
            case 'about':
                document.querySelector('[data-tab="about"]').click();
                break;
            case 'projects':
                document.querySelector('[data-tab="projects"]').click();
                break;
            case 'github':
                window.open('https://github.com/TrojanHorseTH', '_blank');
                break;
            default:
                if (command) {
                    alert(`Unknown command: ${command}\nType 'help' for available commands.`);
                }
        }
    }
    
    // Cursor Effect
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Add CSS for cursor
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .custom-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid #00ff9d;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s;
        }
        
        .custom-cursor::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 4px;
            height: 4px;
            background: #00ff9d;
            border-radius: 50%;
        }
    `;
    document.head.appendChild(cursorStyle);
    
    // Clean up on page unload
    window.addEventListener('beforeunload', function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
});
