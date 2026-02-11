/* ═══════════════════════════════════════════════
   APP - Main controller
   Scroll animations, section visibility, etc.
   ═══════════════════════════════════════════════ */

class App {
    constructor() {
        this.scrollObserver = null;
        this.initialized = false;
    }

    initScrollAnimations() {
        if (this.initialized) return;
        this.initialized = true;

        // Intersection Observer for fade-in animations
        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all animated elements
        const animatedElements = document.querySelectorAll(
            '.fade-in-up, .fade-in-left, .fade-in-right, .fade-in-scale'
        );

        animatedElements.forEach(el => {
            this.scrollObserver.observe(el);
        });

        // Add stagger delays to countdown cards
        const countdownCards = document.querySelectorAll('.countdown-card');
        countdownCards.forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.15}s`;
        });
    }
}

// Initialize as global
const app = new App();

// ═══════════════════════════════════════════════
// Smooth scroll polyfill for older browsers
// ═══════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
