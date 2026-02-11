/* ═══════════════════════════════════════════════
   HEART CANVAS - Particle formation heart
   Particles rain down, collect, then form a heart
   Blue/cyan glowing particles on dark background
   ═══════════════════════════════════════════════ */

class HeartAnimation {
    constructor() {
        this.canvas = document.getElementById('heart-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.section = document.getElementById('heart-section');
        this.messageEl = document.getElementById('heart-message');
        this.hasPlayed = false;
        this.isPlaying = false;
        this.particles = [];
        this.heartPoints = [];
        this.phase = 'idle'; // idle -> raining -> forming -> complete
        this.frameCount = 0;
        this.baseGlow = 0;

        this.NUM_PARTICLES = 3500;
        this.RAIN_DURATION = 180;    // frames of raining (extended)
        this.FORM_DURATION = 240;    // frames to assemble heart (extended)

        // Decorative elements
        this.grassBlades = [];
        this.flowers = [];
        this.footsteps = [];

        // Walking characters
        this.boy = null;
        this.girl = null;

        this.setupCanvas();
        window.addEventListener('resize', () => {
            this.setupCanvas();
            if (this.phase !== 'idle') {
                this.generateHeartPoints();
            }
        });

        this.init();
    }

    setupCanvas() {
        const wrapper = this.canvas.parentElement;
        const w = Math.min(wrapper.clientWidth, 700);
        const h = Math.min(w * 1.2, 750);
        this.canvas.width = w;
        this.canvas.height = h;
        this.centerX = w / 2;
        this.centerY = h / 2 - 30;
        this.scale = Math.min(w, h) / 48;
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasPlayed) {
                    this.hasPlayed = true;
                    setTimeout(() => this.startAnimation(), 400);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(this.section);
    }

    // Generate target points on the heart shape
    generateHeartPoints() {
        this.heartPoints = [];
        const numPoints = this.NUM_PARTICLES;

        for (let i = 0; i < numPoints; i++) {
            // Parametric heart: x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
            // Fill the interior by scaling randomly
            const t = (Math.random()) * Math.PI * 2;
            const fillFactor = Math.pow(Math.random(), 0.5); // sqrt for even distribution

            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            this.heartPoints.push({
                x: this.centerX + hx * this.scale * fillFactor,
                y: this.centerY + hy * this.scale * fillFactor
            });
        }
    }

    // Create initial particles (scattered above, raining down)
    createParticles() {
        this.particles = [];
        const w = this.canvas.width;
        const h = this.canvas.height;

        for (let i = 0; i < this.NUM_PARTICLES; i++) {
            const startX = Math.random() * w;
            const startY = -Math.random() * h * 2 - 50; // Start above canvas

            // Random gathering point at the base
            const gatherX = this.centerX + (Math.random() - 0.5) * w * 0.5;
            const gatherY = h - 40 + (Math.random() - 0.5) * 20;

            this.particles.push({
                // Current position
                x: startX,
                y: startY,

                // Rain target (base)
                gatherX: gatherX,
                gatherY: gatherY,

                // Heart target
                heartX: this.heartPoints[i].x,
                heartY: this.heartPoints[i].y,

                // Visual properties
                size: Math.random() * 2 + 0.5,
                brightness: Math.random() * 0.6 + 0.4,
                twinkleSpeed: Math.random() * 0.05 + 0.02,
                twinklePhase: Math.random() * Math.PI * 2,

                // Motion
                vx: (Math.random() - 0.5) * 0.5,
                vy: Math.random() * 3 + 2, // Fall speed
                delay: Math.random() * this.RAIN_DURATION * 0.8, // Stagger rain start

                // State
                arrived: false,
                bounceCount: 0,
                splashing: false
            });
        }
    }

    startAnimation() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.frameCount = 0;

        this.generateHeartPoints();
        this.createParticles();
        this.initializeCharacters();
        this.phase = 'raining';

        this.animate();
    }

    initializeCharacters() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const baseY = h - 40;

        // Initialize boy (from left)
        this.boy = {
            x: -50,
            y: baseY,
            targetX: this.centerX - 25,
            speed: 1.2,
            size: 30, // Bigger for visibility
            walkCycle: 0,
            stepPhase: 0,
            lastStepX: -50,
            reachedTarget: false,
            hugging: false
        };

        // Initialize girl (from right)
        this.girl = {
            x: w + 50,
            y: baseY,
            targetX: this.centerX + 25,
            speed: 1.2,
            size: 28, // Bigger for visibility
            walkCycle: 0,
            stepPhase: 0,
            lastStepX: w + 50,
            reachedTarget: false,
            hugging: false
        };

        // Clear for footstep-based growth
        this.grassBlades = [];
        this.flowers = [];
        this.footsteps = [];
    }

    animate() {
        this.frameCount++;
        const ctx = this.ctx;

        // Semi-transparent clear for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.phase) {
            case 'raining':
                this.updateRaining();
                if (this.frameCount > this.RAIN_DURATION + 60) {
                    this.phase = 'forming';
                    this.frameCount = 0;
                }
                break;
            case 'forming':
                this.updateForming();
                this.updateCharacters();
                if (this.frameCount > this.FORM_DURATION + 30) {
                    this.phase = 'complete';
                    this.frameCount = 0;
                    // Show message
                    setTimeout(() => {
                        this.messageEl.classList.remove('hidden');
                    }, 500);
                }
                break;
            case 'complete':
                this.updateComplete();
                this.updateCharacters();
                break;
        }

        // Draw characters, grass and flowers
        this.drawCharacters();

        // Draw particles
        this.drawParticles();

        // Draw base glow
        this.drawBaseGlow();

        requestAnimationFrame(() => this.animate());
    }

    updateRaining() {
        const h = this.canvas.height;
        const baseY = h - 50;

        this.particles.forEach((p, i) => {
            if (this.frameCount < p.delay) return; // Still waiting

            // Gravity and motion
            if (!p.arrived) {
                p.vy += 0.1; // Gravity acceleration
                p.y += p.vy;
                p.x += p.vx;

                // Horizontal air resistance
                p.vx *= 0.99;
            }

            // Splash effect when hitting the base
            if (!p.arrived && p.y >= baseY) {
                p.splashing = true;
                p.bounceCount++;

                // First bounce - strong splash
                if (p.bounceCount === 1) {
                    p.vy = -(Math.random() * 4 + 2); // Bounce up
                    p.vx = (Math.random() - 0.5) * 3; // Splash sideways
                }
                // Second bounce - weaker
                else if (p.bounceCount === 2) {
                    p.vy = -(Math.random() * 2 + 1);
                    p.vx = (Math.random() - 0.5) * 2;
                }
                // Third bounce - settle
                else if (p.bounceCount === 3) {
                    p.vy = -(Math.random() * 0.5 + 0.3);
                    p.vx = (Math.random() - 0.5) * 1;
                }
                // Finally settle at base
                else {
                    p.y = baseY + (Math.random() - 0.5) * 30;
                    p.x = p.gatherX + (Math.random() - 0.5) * 10;
                    p.vy = 0;
                    p.vx = 0;
                    p.arrived = true;
                    p.splashing = false;
                }
            }

            // Gentle settling motion for arrived particles
            if (p.arrived) {
                p.x += (Math.random() - 0.5) * 0.2;
                p.y += (Math.random() - 0.5) * 0.2;
            }
        });

        // Increase base glow as particles accumulate
        this.baseGlow = Math.min(1, this.frameCount / this.RAIN_DURATION);
    }

    updateForming() {
        const progress = Math.min(1, this.frameCount / this.FORM_DURATION);
        // Ease out cubic for smooth deceleration
        const ease = 1 - Math.pow(1 - progress, 3);

        this.particles.forEach((p) => {
            // Lerp from current to heart position
            const targetX = p.heartX;
            const targetY = p.heartY;

            p.x += (targetX - p.x) * ease * 0.08;
            p.y += (targetY - p.y) * ease * 0.08;

            // Add a swirl effect during formation
            if (progress < 0.7) {
                const angle = this.frameCount * 0.02 + Math.atan2(p.y - this.centerY, p.x - this.centerX);
                const dist = Math.hypot(p.x - this.centerX, p.y - this.centerY);
                p.x += Math.cos(angle) * dist * 0.003;
                p.y += Math.sin(angle) * dist * 0.003;
            }
        });

        // Base glow fades slightly as particles rise
        this.baseGlow = Math.max(0.3, 1 - progress * 0.5);
    }

    updateComplete() {
        // Gentle breathing/pulsing of the heart
        const pulse = Math.sin(this.frameCount * 0.02) * 0.01;

        this.particles.forEach((p) => {
            // Gentle drift toward heart position with subtle movement
            p.x += (p.heartX - p.x) * 0.02;
            p.y += (p.heartY - p.y) * 0.02;

            // Subtle pulse effect
            const dx = p.x - this.centerX;
            const dy = p.y - this.centerY;
            p.x += dx * pulse;
            p.y += dy * pulse;

            // Random sparkle movement
            p.x += (Math.random() - 0.5) * 0.3;
            p.y += (Math.random() - 0.5) * 0.3;
        });

        this.baseGlow = 0.3 + Math.sin(this.frameCount * 0.03) * 0.1;
    }

    drawParticles() {
        const ctx = this.ctx;

        this.particles.forEach((p) => {
            if (this.phase === 'raining' && this.frameCount < p.delay) return;

            // Twinkle
            const twinkle = 0.5 + 0.5 * Math.sin(this.frameCount * p.twinkleSpeed + p.twinklePhase);
            const alpha = p.brightness * twinkle;

            // Blue/cyan color with slight variation
            const hue = 200 + Math.sin(p.twinklePhase) * 20; // 180-220 range (cyan to blue)
            const lightness = 55 + twinkle * 25;

            // Glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 100%, ${lightness}%, ${alpha * 0.15})`;
            ctx.fill();

            // Core particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 100%, ${lightness}%, ${alpha})`;
            ctx.fill();

            // Bright center
            if (twinkle > 0.8) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${hue}, 80%, 90%, ${alpha})`;
                ctx.fill();
            }
        });
    }

    drawBaseGlow() {
        if (this.baseGlow <= 0) return;

        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const baseY = h - 40;

        // Elliptical glow at the base
        const gradient = ctx.createRadialGradient(
            this.centerX, baseY, 0,
            this.centerX, baseY, w * 0.3
        );
        gradient.addColorStop(0, `rgba(0, 150, 255, ${this.baseGlow * 0.6})`);
        gradient.addColorStop(0.3, `rgba(0, 120, 255, ${this.baseGlow * 0.3})`);
        gradient.addColorStop(0.6, `rgba(0, 80, 255, ${this.baseGlow * 0.1})`);
        gradient.addColorStop(1, 'rgba(0, 80, 255, 0)');

        ctx.save();
        ctx.scale(1, 0.2); // Flatten into ellipse
        ctx.beginPath();
        ctx.arc(this.centerX, baseY / 0.2, w * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();

        // Horizontal light line at base
        const lineGrad = ctx.createLinearGradient(this.centerX - w * 0.25, baseY, this.centerX + w * 0.25, baseY);
        lineGrad.addColorStop(0, 'rgba(0, 150, 255, 0)');
        lineGrad.addColorStop(0.3, `rgba(0, 180, 255, ${this.baseGlow * 0.5})`);
        lineGrad.addColorStop(0.5, `rgba(100, 200, 255, ${this.baseGlow * 0.8})`);
        lineGrad.addColorStop(0.7, `rgba(0, 180, 255, ${this.baseGlow * 0.5})`);
        lineGrad.addColorStop(1, 'rgba(0, 150, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(this.centerX - w * 0.25, baseY);
        ctx.lineTo(this.centerX + w * 0.25, baseY);
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Secondary glow line
        ctx.beginPath();
        ctx.moveTo(this.centerX - w * 0.2, baseY);
        ctx.lineTo(this.centerX + w * 0.2, baseY);
        ctx.strokeStyle = `rgba(100, 200, 255, ${this.baseGlow * 0.2})`;
        ctx.lineWidth = 8;
        ctx.filter = 'blur(4px)';
        ctx.stroke();
        ctx.filter = 'none';
    }

    updateCharacters() {
        if (this.phase !== 'forming' && this.phase !== 'complete') return;
        if (!this.boy || !this.girl) return;

        const baseY = this.canvas.height - 40;

        // Update boy
        if (!this.boy.reachedTarget) {
            this.boy.x += this.boy.speed;
            this.boy.walkCycle += 0.15;

            // Create footstep every 15 pixels
            if (Math.abs(this.boy.x - this.boy.lastStepX) > 15) {
                this.createFootstepEffects(this.boy.x, baseY);
                this.boy.lastStepX = this.boy.x;
            }

            if (this.boy.x >= this.boy.targetX) {
                this.boy.reachedTarget = true;
            }
        }

        // Update girl
        if (!this.girl.reachedTarget) {
            this.girl.x -= this.girl.speed;
            this.girl.walkCycle += 0.15;

            // Create footstep every 15 pixels
            if (Math.abs(this.girl.x - this.girl.lastStepX) > 15) {
                this.createFootstepEffects(this.girl.x, baseY);
                this.girl.lastStepX = this.girl.x;
            }

            if (this.girl.x <= this.girl.targetX) {
                this.girl.reachedTarget = true;
            }
        }

        // Start hugging when both reached target
        if (this.boy.reachedTarget && this.girl.reachedTarget && !this.boy.hugging) {
            this.boy.hugging = true;
            this.girl.hugging = true;
        }

        // Update grass and flower growth
        this.grassBlades.forEach(grass => {
            if (grass.height < grass.maxHeight) {
                grass.height = Math.min(grass.maxHeight, grass.height + 0.8);
            }
            grass.sway += grass.swaySpeed;
        });

        this.flowers.forEach(flower => {
            if (flower.size < flower.maxSize) {
                flower.stemHeight = Math.min(flower.maxStemHeight, flower.stemHeight + 0.6);
                flower.size = Math.min(flower.maxSize, flower.size + 0.2);
            }
            flower.rotation += flower.rotationSpeed;
        });
    }

    createFootstepEffects(x, y) {
        // Create grass around footstep
        for (let i = 0; i < 3; i++) {
            const offsetX = (Math.random() - 0.5) * 20;
            this.grassBlades.push({
                x: x + offsetX,
                baseY: y + Math.random() * 10,
                height: 0,
                maxHeight: Math.random() * 30 + 15,
                width: Math.random() * 2 + 1,
                sway: Math.random() * Math.PI * 2,
                swaySpeed: Math.random() * 0.02 + 0.01,
                hue: 120 + Math.random() * 20
            });
        }

        // Create a flower with some probability
        if (Math.random() < 0.3) {
            const offsetX = (Math.random() - 0.5) * 25;
            this.flowers.push({
                x: x + offsetX,
                y: y + Math.random() * 15,
                size: 0,
                maxSize: Math.random() * 6 + 4,
                petalCount: Math.floor(Math.random() * 3) + 5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.01,
                hue: Math.random() * 60 + 300,
                stemHeight: 0,
                maxStemHeight: Math.random() * 20 + 10
            });
        }
    }

    drawCharacters() {
        const ctx = this.ctx;

        // Draw grass blades (same as before)
        this.grassBlades.forEach(grass => {
            if (grass.height <= 0) return;

            const swayOffset = Math.sin(grass.sway) * 3;

            ctx.save();
            ctx.translate(grass.x, grass.baseY);

            const grassGrad = ctx.createLinearGradient(0, 0, 0, -grass.height);
            grassGrad.addColorStop(0, `hsla(${grass.hue}, 60%, 35%, 0.8)`);
            grassGrad.addColorStop(0.5, `hsla(${grass.hue}, 70%, 45%, 0.9)`);
            grassGrad.addColorStop(1, `hsla(${grass.hue}, 80%, 55%, 0.7)`);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(
                swayOffset / 2, -grass.height / 2,
                swayOffset, -grass.height
            );
            ctx.strokeStyle = grassGrad;
            ctx.lineWidth = grass.width;
            ctx.lineCap = 'round';
            ctx.stroke();

            ctx.restore();
        });

        // Draw flowers (same as before)
        this.flowers.forEach(flower => {
            if (flower.size <= 0) return;

            ctx.save();
            ctx.translate(flower.x, flower.y);

            // Draw stem
            if (flower.stemHeight > 0) {
                const stemGrad = ctx.createLinearGradient(0, 0, 0, -flower.stemHeight);
                stemGrad.addColorStop(0, 'hsla(120, 50%, 30%, 0.8)');
                stemGrad.addColorStop(1, 'hsla(120, 60%, 40%, 0.6)');

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -flower.stemHeight);
                ctx.strokeStyle = stemGrad;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // Draw flower at top of stem
            ctx.translate(0, -flower.stemHeight);
            ctx.rotate(flower.rotation);

            // Draw petals
            for (let i = 0; i < flower.petalCount; i++) {
                const angle = (Math.PI * 2 / flower.petalCount) * i;
                ctx.save();
                ctx.rotate(angle);

                const petalGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, flower.size);
                petalGrad.addColorStop(0, `hsla(${flower.hue}, 90%, 70%, 0.9)`);
                petalGrad.addColorStop(0.7, `hsla(${flower.hue}, 80%, 60%, 0.8)`);
                petalGrad.addColorStop(1, `hsla(${flower.hue}, 70%, 50%, 0.4)`);

                ctx.beginPath();
                ctx.ellipse(flower.size * 0.7, 0, flower.size * 0.6, flower.size * 0.4, 0, 0, Math.PI * 2);
                ctx.fillStyle = petalGrad;
                ctx.fill();

                ctx.restore();
            }

            // Draw center
            const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, flower.size * 0.4);
            centerGrad.addColorStop(0, 'hsla(45, 100%, 70%, 1)');
            centerGrad.addColorStop(1, 'hsla(40, 90%, 50%, 0.9)');

            ctx.beginPath();
            ctx.arc(0, 0, flower.size * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = centerGrad;
            ctx.fill();

            ctx.restore();
        });

        // Draw boy character
        if (this.boy && this.boy.x > -50 && this.boy.x < this.canvas.width) {
            this.drawCharacter(this.boy, 'boy');
        }

        // Draw girl character
        if (this.girl && this.girl.x > 0 && this.girl.x < this.canvas.width + 50) {
            this.drawCharacter(this.girl, 'girl');
        }
    }

    drawCharacter(char, type) {
        const ctx = this.ctx;
        const isBoy = type === 'boy';
        const s = char.size;

        ctx.save();
        ctx.translate(char.x, char.y);

        // Setup facing direction
        if (char.hugging) {
            // When hugging, face each other
            if (isBoy) {
                ctx.translate(-8, 0);
            } else {
                ctx.translate(8, 0);
                ctx.scale(-1, 1);
            }
        } else {
            // Walking: boy faces right, girl faces left
            if (!isBoy) ctx.scale(-1, 1);
        }

        // Walking animation
        const legSwing = char.hugging ? 0 : Math.sin(char.walkCycle) * 10;

        // Colors
        const bodyColor = isBoy ? 'hsla(210, 80%, 60%, 1)' : 'hsla(330, 80%, 65%, 1)';
        const skinColor = 'hsla(30, 70%, 75%, 1)';

        ctx.strokeStyle = bodyColor;
        ctx.fillStyle = skinColor;
        ctx.lineWidth = s * 0.15;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Head (simple circle)
        ctx.beginPath();
        ctx.arc(0, -s * 1.3, s * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = skinColor;
        ctx.fill();
        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Simple face
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        // Eyes
        ctx.beginPath();
        ctx.arc(-s * 0.12, -s * 1.35, s * 0.05, 0, Math.PI * 2);
        ctx.arc(s * 0.12, -s * 1.35, s * 0.05, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -s * 1.2, s * 0.12, 0.3, Math.PI - 0.3);
        ctx.stroke();

        // Body (vertical line)
        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = s * 0.15;
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.95);
        ctx.lineTo(0, -s * 0.2);
        ctx.stroke();

        // Legs
        if (!char.hugging) {
            // Walking legs
            ctx.beginPath();
            ctx.moveTo(0, -s * 0.2);
            ctx.lineTo(-s * 0.2, s * 0.25 + legSwing * 0.4);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, -s * 0.2);
            ctx.lineTo(s * 0.2, s * 0.25 - legSwing * 0.4);
            ctx.stroke();
        } else {
            // Standing legs
            ctx.beginPath();
            ctx.moveTo(0, -s * 0.2);
            ctx.lineTo(-s * 0.15, s * 0.25);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, -s * 0.2);
            ctx.lineTo(s * 0.15, s * 0.25);
            ctx.stroke();
        }

        // Arms
        if (char.hugging) {
            // Hugging arms - extended forward
            ctx.beginPath();
            ctx.moveTo(0, -s * 0.8);
            ctx.quadraticCurveTo(-s * 0.4, -s * 0.6, -s * 0.5, -s * 0.4);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, -s * 0.8);
            ctx.quadraticCurveTo(s * 0.4, -s * 0.6, s * 0.5, -s * 0.4);
            ctx.stroke();
        } else {
            // Walking arms
            const armSwing = -legSwing * 0.5;

            ctx.beginPath();
            ctx.moveTo(0, -s * 0.85);
            ctx.lineTo(-s * 0.35, -s * 0.5 + armSwing);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, -s * 0.85);
            ctx.lineTo(s * 0.35, -s * 0.5 - armSwing);
            ctx.stroke();
        }

        ctx.restore();
    }
}

// Initialize
const heartAnimation = new HeartAnimation();

