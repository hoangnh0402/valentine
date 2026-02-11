/* ═══════════════════════════════════════════════
   COUNTDOWN TIMER - Valentine's Day 2026
   ═══════════════════════════════════════════════ */

class CountdownTimer {
    constructor() {
        this.targetDate = new Date('2026-02-14T00:00:00+07:00'); // Vietnam timezone
        this.daysEl = document.getElementById('countdown-days');
        this.hoursEl = document.getElementById('countdown-hours');
        this.minutesEl = document.getElementById('countdown-minutes');
        this.secondsEl = document.getElementById('countdown-seconds');
        this.reachedEl = document.getElementById('valentine-reached');
        this.gridEl = document.querySelector('.countdown-grid');

        this.start();
    }

    start() {
        this.update();
        this.interval = setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date();
        const diff = this.targetDate - now;

        if (diff <= 0) {
            this.showReached();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        this.animateValue(this.daysEl, days);
        this.animateValue(this.hoursEl, hours);
        this.animateValue(this.minutesEl, minutes);
        this.animateValue(this.secondsEl, seconds);
    }

    animateValue(el, value) {
        const formatted = String(value).padStart(2, '0');
        if (el.textContent !== formatted) {
            el.style.transform = 'scale(1.1)';
            el.textContent = formatted;
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 200);
        }
    }

    showReached() {
        clearInterval(this.interval);
        if (this.gridEl) this.gridEl.classList.add('hidden');
        if (this.reachedEl) this.reachedEl.classList.remove('hidden');
    }
}

// Initialize
const countdownTimer = new CountdownTimer();
