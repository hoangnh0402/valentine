/* ═══════════════════════════════════════════════
   PARTICLES - Floating hearts background
   ═══════════════════════════════════════════════ */

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 35;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        const colors = ['#ff6b9d', '#c084fc', '#ff8fb8', '#fbbf24', '#fb7185', '#d4a5ff'];
        return {
            x: Math.random() * this.canvas.width,
            y: this.canvas.height + 20,
            size: Math.random() * 12 + 6,
            speedY: Math.random() * 1 + 0.3,
            speedX: (Math.random() - 0.5) * 0.8,
            opacity: Math.random() * 0.4 + 0.1,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 2,
            wave: Math.random() * Math.PI * 2,
            waveSpeed: Math.random() * 0.02 + 0.01,
            waveAmplitude: Math.random() * 30 + 10
        };
    }

    drawHeart(x, y, size, color, opacity, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation * Math.PI / 180);
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();

        const s = size / 15;
        for (let t = 0; t <= Math.PI * 2; t += 0.01) {
            const hx = s * 16 * Math.pow(Math.sin(t), 3);
            const hy = -s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            if (t === 0) {
                this.ctx.moveTo(hx, hy);
            } else {
                this.ctx.lineTo(hx, hy);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    update() {
        // Add particles
        if (this.particles.length < this.maxParticles && Math.random() < 0.03) {
            this.particles.push(this.createParticle());
        }

        // Update particles
        this.particles.forEach((p, i) => {
            p.y -= p.speedY;
            p.wave += p.waveSpeed;
            p.x += Math.sin(p.wave) * 0.5 + p.speedX;
            p.rotation += p.rotationSpeed;

            // Fade out near top
            if (p.y < 100) {
                p.opacity *= 0.98;
            }

            // Remove offscreen
            if (p.y < -30 || p.opacity < 0.01) {
                this.particles.splice(i, 1);
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => {
            this.drawHeart(p.x, p.y, p.size, p.color, p.opacity, p.rotation);
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    start() {
        this.animate();
    }
}

// Initialize
const particleSystem = new ParticleSystem();
particleSystem.start();
