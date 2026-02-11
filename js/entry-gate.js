/* ═══════════════════════════════════════════════
   ENTRY GATE - Wedding date verification
   ═══════════════════════════════════════════════ */

class EntryGate {
    constructor() {
        this.gate = document.getElementById('entry-gate');
        this.mainContent = document.getElementById('main-content');
        this.submitBtn = document.getElementById('gate-submit');
        this.dayInput = document.getElementById('gate-day');
        this.monthInput = document.getElementById('gate-month');
        this.yearInput = document.getElementById('gate-year');
        this.errorEl = document.getElementById('gate-error');
        this.gateContent = this.gate.querySelector('.gate-content');
        this.confettiCanvas = document.getElementById('confetti-canvas');

        // Correct answer: 04/02/2026
        this.correctDay = 4;
        this.correctMonth = 2;
        this.correctYear = 2026;

        this.init();
    }

    init() {
        // Check if already passed
        if (sessionStorage.getItem('valentine_gate_passed') === 'true') {
            this.bypass();
            return;
        }

        this.submitBtn.addEventListener('click', () => this.verify());

        // Enter key submission
        [this.dayInput, this.monthInput, this.yearInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.verify();
            });
        });

        // Auto-focus to next field
        this.dayInput.addEventListener('input', () => {
            if (this.dayInput.value.length >= 2) this.monthInput.focus();
        });
        this.monthInput.addEventListener('input', () => {
            if (this.monthInput.value.length >= 2) this.yearInput.focus();
        });
    }

    verify() {
        const day = parseInt(this.dayInput.value);
        const month = parseInt(this.monthInput.value);
        const year = parseInt(this.yearInput.value);

        if (!day || !month || !year) {
            this.showError('Hãy nhập đầy đủ ngày tháng năm nhé em 💭');
            this.shake();
            return;
        }

        if (day === this.correctDay && month === this.correctMonth && year === this.correctYear) {
            this.success();
        } else {
            this.showError('Sai rồi, thử lại nhé em yêu 💝');
            this.shake();
        }
    }

    showError(msg) {
        this.errorEl.textContent = msg;
        setTimeout(() => {
            this.errorEl.textContent = '';
        }, 3000);
    }

    shake() {
        this.gateContent.classList.add('shake');
        setTimeout(() => {
            this.gateContent.classList.remove('shake');
        }, 600);
    }

    success() {
        sessionStorage.setItem('valentine_gate_passed', 'true');

        // Fire confetti
        this.fireConfetti();

        // After confetti, fade out gate
        setTimeout(() => {
            this.gate.classList.add('fade-out');
            this.mainContent.classList.remove('hidden');

            // Trigger music
            if (typeof musicPlayer !== 'undefined') {
                musicPlayer.show();
                musicPlayer.play();
            }

            // Init scroll animations
            if (typeof app !== 'undefined') {
                app.initScrollAnimations();
            }

            setTimeout(() => {
                this.gate.style.display = 'none';
            }, 1200);
        }, 2000);
    }

    bypass() {
        this.gate.style.display = 'none';
        this.mainContent.classList.remove('hidden');

        setTimeout(() => {
            if (typeof musicPlayer !== 'undefined') {
                musicPlayer.show();
            }
            if (typeof app !== 'undefined') {
                app.initScrollAnimations();
            }
        }, 100);
    }

    fireConfetti() {
        const canvas = this.confettiCanvas;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const confetti = [];
        const colors = ['#ff6b9d', '#c084fc', '#fbbf24', '#fb7185', '#f43f5e', '#d4a5ff', '#ff8fb8'];
        const shapes = ['circle', 'rect', 'heart'];

        // Create confetti pieces
        for (let i = 0; i < 150; i++) {
            confetti.push({
                x: canvas.width / 2 + (Math.random() - 0.5) * 200,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 1) * 15 - 5,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                gravity: 0.15,
                opacity: 1,
                fadeSpeed: Math.random() * 0.005 + 0.002
            });
        }

        const drawHeart = (x, y, size, color, opacity, rotation) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.globalAlpha = opacity;
            ctx.fillStyle = color;
            ctx.beginPath();
            const s = size / 15;
            for (let t = 0; t <= Math.PI * 2; t += 0.1) {
                const hx = s * 16 * Math.pow(Math.sin(t), 3);
                const hy = -s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                if (t === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;

            confetti.forEach(c => {
                c.vy += c.gravity;
                c.x += c.vx;
                c.y += c.vy;
                c.rotation += c.rotationSpeed;
                c.vx *= 0.99;
                c.opacity -= c.fadeSpeed;

                if (c.opacity > 0) {
                    alive = true;
                    ctx.save();
                    ctx.globalAlpha = c.opacity;
                    ctx.fillStyle = c.color;

                    if (c.shape === 'circle') {
                        ctx.beginPath();
                        ctx.arc(c.x, c.y, c.size / 2, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (c.shape === 'rect') {
                        ctx.save();
                        ctx.translate(c.x, c.y);
                        ctx.rotate(c.rotation * Math.PI / 180);
                        ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
                        ctx.restore();
                    } else if (c.shape === 'heart') {
                        drawHeart(c.x, c.y, c.size, c.color, c.opacity, c.rotation);
                    }
                    ctx.restore();
                }
            });

            if (alive) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }
}

// Initialize
const entryGate = new EntryGate();
