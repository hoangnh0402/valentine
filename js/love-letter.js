/* ═══════════════════════════════════════════════
   LOVE LETTER - Typewriter effect
   ═══════════════════════════════════════════════ */

class LoveLetter {
    constructor() {
        this.bodyEl = document.getElementById('letter-body');
        this.section = document.getElementById('letter-section');
        this.hasPlayed = false;
        this.isPlaying = false;

        // ──────────────────────────────────────────
        // MOCK CONTENT — Thay nội dung thư ở đây!
        // ──────────────────────────────────────────
        this.letterContent = `Ngày Valentine này, anh muốn dành cho em những lời từ đáy lòng...

Em là điều tuyệt vời nhất đã đến trong cuộc đời anh. Từ ngày có em, mỗi buổi sáng thức dậy anh đều mỉm cười vì biết rằng có một người đặc biệt đang ở bên cạnh.

Cảm ơn em vì đã kiên nhẫn với anh, vì đã cười khi anh kể những câu chuyện dở, vì đã ôm anh khi anh mệt mỏi, và vì đã chọn anh giữa hàng triệu người trên thế giới.

Em không chỉ là vợ anh, em là người bạn thân nhất, là nguồn cảm hứng, là lý do anh muốn trở thành phiên bản tốt hơn mỗi ngày.

Anh hứa sẽ luôn bên em, trong những ngày nắng đẹp cũng như những lúc mưa bão. Anh hứa sẽ nâng niu từng nụ cười của em và lau đi mọi giọt nước mắt.

Happy Valentine's Day, em yêu! 💕
Anh yêu em nhiều hơn tất cả những vì sao trên bầu trời. ✨`;

        this.init();
    }

    init() {
        // Set up Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasPlayed) {
                    this.hasPlayed = true;
                    this.startTypewriter();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(this.section);
    }

    startTypewriter() {
        if (this.isPlaying) return;
        this.isPlaying = true;

        this.bodyEl.innerHTML = '<span class="cursor"></span>';
        let charIndex = 0;
        const text = this.letterContent;
        const speed = 30; // ms per character

        const type = () => {
            if (charIndex < text.length) {
                const char = text[charIndex];

                // Remove cursor temporarily
                const cursor = this.bodyEl.querySelector('.cursor');

                if (char === '\n') {
                    this.bodyEl.insertBefore(document.createElement('br'), cursor);
                } else {
                    const span = document.createTextNode(char);
                    this.bodyEl.insertBefore(span, cursor);
                }

                charIndex++;

                // Vary speed for natural feel
                let delay = speed;
                if (char === '.' || char === '!' || char === '?') delay = speed * 8;
                else if (char === ',') delay = speed * 3;
                else if (char === '\n') delay = speed * 5;

                setTimeout(type, delay);
            } else {
                // Remove cursor after done
                const cursor = this.bodyEl.querySelector('.cursor');
                if (cursor) {
                    setTimeout(() => {
                        cursor.style.display = 'none';
                    }, 3000);
                }
                this.isPlaying = false;
            }
        };

        // Small delay before starting
        setTimeout(type, 500);
    }
}

// Initialize
const loveLetter = new LoveLetter();
