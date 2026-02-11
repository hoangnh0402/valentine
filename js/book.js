/* ═══════════════════════════════════════════════
   MEMORY BOOK - 3D Page Flip
   Left = Photo, Right = Text
   ═══════════════════════════════════════════════ */

class MemoryBook {
    constructor() {
        this.bookEl = document.getElementById('book');
        this.prevBtn = document.getElementById('prev-page');
        this.nextBtn = document.getElementById('next-page');
        this.indicatorEl = document.getElementById('page-indicator');
        this.currentPage = 0;
        this.isMobile = window.innerWidth <= 767;

        // ──────────────────────────────────────────
        // MOCK DATA — Thay nội dung ở đây!
        // Mỗi trang có: title, date, content, emoji, image (optional)
        // ──────────────────────────────────────────
        this.pages = [
            {
                type: 'cover',
                title: 'Câu Chuyện Của Chúng Ta',
                names: 'Anh & Em', // ← Thay tên ở đây
                subtitle: 'Những khoảnh khắc đẹp nhất...'
            },
            {
                title: 'Lần Đầu Gặp Nhau',
                date: 'Ngày XX tháng XX năm 20XX',
                content: 'Lần đầu anh nhìn thấy em, trái tim anh đã ngừng đập một nhịp. Em đẹp hơn bất cứ ai anh từng gặp, và nụ cười của em đã thay đổi cuộc đời anh mãi mãi...',
                emoji: '💫',
                image: null, // Thay bằng 'images/photo1.jpg' khi có ảnh
                caption: 'Ngày đầu tiên đặc biệt'
            },
            {
                title: 'Ngày Hẹn Hò Đầu Tiên',
                date: 'Ngày XX tháng XX năm 20XX',
                content: 'Anh nhớ lần đầu tiên chúng ta hẹn hò. Anh hồi hộp đến mức không ngủ được cả đêm trước đó. Nhưng khi gặp em, mọi lo lắng đều tan biến...',
                emoji: '🌹',
                image: null,
                caption: 'Buổi hẹn đáng nhớ'
            },
            {
                title: 'Khoảnh Khắc Tỏ Tình',
                date: 'Ngày XX tháng XX năm 20XX',
                content: 'Đó là ngày anh dũng cảm nhất — ngày anh nói với em rằng "Anh yêu em". Tim anh đập nhanh đến nghẹt thở, nhưng khi em mỉm cười đồng ý, cả thế giới bừng sáng...',
                emoji: '💕',
                image: null,
                caption: 'Ngày anh nói yêu em'
            },
            {
                title: 'Những Chuyến Đi Cùng Nhau',
                date: 'Năm 20XX',
                content: 'Cùng em đi khắp nơi, mỗi nơi đều trở nên đặc biệt chỉ vì có em bên cạnh. Từ những quán cà phê nhỏ đến những bãi biển xa xôi, mỗi kỉ niệm đều là viên ngọc quý...',
                emoji: '✈️',
                image: null,
                caption: 'Những bước chân phiêu lưu'
            },
            {
                title: 'Ngày Cầu Hôn',
                date: 'Ngày XX tháng XX năm 20XX',
                content: 'Anh đã giữ chiếc nhẫn trong túi áo suốt cả tuần, tim muốn nhảy ra khỏi lồng ngực. Và khoảnh khắc em gật đầu "Có" — anh biết mình là người hạnh phúc nhất thế gian...',
                emoji: '💍',
                image: null,
                caption: 'Em đã nói CÓ!'
            },
            {
                title: 'Ngày Cưới - 04/02/2026',
                date: '04 tháng 02 năm 2026',
                content: 'Ngày hạnh phúc nhất cuộc đời, khi em bước vào trong chiếc váy cưới trắng tinh khôi. Anh hứa sẽ yêu em, bảo vệ em, và đồng hành cùng em trọn đời...',
                emoji: '💒',
                image: null,
                caption: 'Ngày trọng đại'
            },
            {
                type: 'back-cover',
                title: 'Và Câu Chuyện Vẫn Tiếp Tục...',
                content: 'Mỗi ngày bên em là một trang mới trong cuốn sách tình yêu. Anh sẽ viết tiếp những trang đẹp nhất cùng em...',
                emoji: '♾️'
            }
        ];

        this.totalPages = this.pages.length;
        this.init();
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 767;
            this.render();
        });
    }

    init() {
        this.render();
        this.prevBtn.addEventListener('click', () => this.flipPrev());
        this.nextBtn.addEventListener('click', () => this.flipNext());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isInView()) return;
            if (e.key === 'ArrowLeft') this.flipPrev();
            if (e.key === 'ArrowRight') this.flipNext();
        });

        // Touch swipe for mobile
        let startX = 0;
        this.bookEl.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.bookEl.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.flipNext();
                else this.flipPrev();
            }
        }, { passive: true });
    }

    isInView() {
        const rect = this.bookEl.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    render() {
        this.bookEl.innerHTML = '';

        if (this.isMobile) {
            this.renderMobile();
        } else {
            this.renderDesktop();
        }

        this.updateControls();
    }

    renderDesktop() {
        // Left page (static — shows the page before current)
        const leftPage = document.createElement('div');
        leftPage.className = 'book-left-page';
        leftPage.id = 'book-left';
        this.bookEl.appendChild(leftPage);

        // Create flippable pages (right side)
        this.pages.forEach((pageData, index) => {
            const page = document.createElement('div');
            page.className = 'book-page';
            page.dataset.index = index;

            // Front face (visible on right side when not flipped)
            const front = document.createElement('div');
            front.className = 'page-front';
            front.innerHTML = this.getPageHTML(pageData, index);

            // Back face (visible on left side when flipped)
            const back = document.createElement('div');
            back.className = 'page-back';
            // Back shows the next page's photo content (index+1)
            if (index + 1 < this.pages.length) {
                back.innerHTML = this.getPhotoHTML(this.pages[index + 1], index + 1);
            } else {
                back.innerHTML = `<div class="page-photo"><div class="photo-frame"><div class="photo-placeholder"><span class="placeholder-icon">📖</span><span class="placeholder-text">Hết trang</span></div></div></div>`;
            }

            page.appendChild(front);
            page.appendChild(back);
            this.bookEl.appendChild(page);

            // Set initial z-index
            page.style.zIndex = this.totalPages - index;
        });

        this.updateDesktopPages();
    }

    renderMobile() {
        this.pages.forEach((pageData, index) => {
            const page = document.createElement('div');
            page.className = 'book-page' + (index === this.currentPage ? ' active-mobile' : '');
            page.dataset.index = index;

            const front = document.createElement('div');
            front.className = 'page-front';

            if (pageData.type === 'cover' || pageData.type === 'back-cover') {
                front.innerHTML = this.getCoverHTML(pageData);
            } else {
                // On mobile, show photo + text vertically
                front.innerHTML = `
                    <div style="display: flex; flex-direction: column; height: 100%; overflow-y: auto;">
                        ${this.getPhotoHTML(pageData, index)}
                        ${this.getTextHTML(pageData, index)}
                    </div>
                `;
            }

            page.appendChild(front);
            this.bookEl.appendChild(page);
        });
    }

    getPageHTML(pageData, index) {
        if (pageData.type === 'cover') {
            return this.getCoverHTML(pageData);
        }
        if (pageData.type === 'back-cover') {
            return this.getBackCoverHTML(pageData);
        }
        return this.getTextHTML(pageData, index);
    }

    getCoverHTML(data) {
        return `
            <div class="book-cover-content">
                <div class="cover-icon">📖</div>
                <h3 class="cover-title">${data.title}</h3>
                <p class="cover-names">${data.names || ''}</p>
                <p class="cover-subtitle">${data.subtitle || ''}</p>
            </div>
        `;
    }

    getBackCoverHTML(data) {
        return `
            <div class="book-cover-content">
                <div class="cover-icon">${data.emoji || '💕'}</div>
                <h3 class="cover-title">${data.title}</h3>
                <p class="cover-subtitle" style="font-size: 1.05rem; line-height: 1.8; max-width: 280px; margin: 12px auto 0;">${data.content || ''}</p>
            </div>
        `;
    }

    getPhotoHTML(pageData, index) {
        if (pageData.type === 'cover' || pageData.type === 'back-cover') {
            return `<div class="page-photo"><div class="book-cover-content"><div class="cover-icon">${pageData.type === 'cover' ? '📖' : (pageData.emoji || '💕')}</div><h3 class="cover-title" style="font-size:1.5rem;">${pageData.title}</h3></div></div>`;
        }

        const photoContent = pageData.image
            ? `<img src="${pageData.image}" alt="${pageData.caption || ''}" loading="lazy">`
            : `<div class="photo-placeholder">
                <span class="placeholder-icon">📷</span>
                <span class="placeholder-text">Thêm ảnh kỉ niệm</span>
               </div>`;

        return `
            <div class="page-photo">
                <div class="photo-frame">
                    ${photoContent}
                </div>
                ${pageData.caption ? `<p class="photo-caption">${pageData.caption}</p>` : ''}
            </div>
        `;
    }

    getTextHTML(pageData, index) {
        return `
            <div class="page-text">
                <h3 class="page-title">${pageData.title}</h3>
                <p class="page-date">${pageData.date || ''}</p>
                <p class="page-content">${pageData.content || ''}</p>
                <span class="page-emoji">${pageData.emoji || ''}</span>
            </div>
        `;
    }

    flipNext() {
        if (this.currentPage >= this.totalPages - 1) return;

        if (this.isMobile) {
            this.currentPage++;
            this.updateMobilePages();
        } else {
            const pages = this.bookEl.querySelectorAll('.book-page');
            const currentPageEl = pages[this.currentPage];
            currentPageEl.classList.add('flipped');
            this.currentPage++;
            this.updateDesktopPages();
        }

        this.updateControls();
    }

    flipPrev() {
        if (this.currentPage <= 0) return;

        if (this.isMobile) {
            this.currentPage--;
            this.updateMobilePages();
        } else {
            this.currentPage--;
            const pages = this.bookEl.querySelectorAll('.book-page');
            const currentPageEl = pages[this.currentPage];
            currentPageEl.classList.remove('flipped');
            this.updateDesktopPages();
        }

        this.updateControls();
    }

    updateDesktopPages() {
        const pages = this.bookEl.querySelectorAll('.book-page');
        const leftPage = document.getElementById('book-left');

        pages.forEach((page, i) => {
            page.classList.remove('active-right');
            if (i < this.currentPage) {
                page.classList.add('flipped');
                page.style.zIndex = i + 1;
            } else {
                page.classList.remove('flipped');
                page.style.zIndex = this.totalPages - i;
            }
        });

        // Active right page
        if (this.currentPage < this.totalPages) {
            pages[this.currentPage].classList.add('active-right');
        }

        // Update left page content
        if (this.currentPage > 0) {
            const prevPageData = this.pages[this.currentPage];
            leftPage.innerHTML = this.getPhotoHTML(prevPageData, this.currentPage);
        } else {
            leftPage.innerHTML = `
                <div class="book-cover-content">
                    <div class="cover-icon" style="font-size:3rem;">💕</div>
                    <p class="cover-subtitle">Lật trang để bắt đầu...</p>
                </div>
            `;
        }
    }

    updateMobilePages() {
        const pages = this.bookEl.querySelectorAll('.book-page');
        pages.forEach((page, i) => {
            if (i === this.currentPage) {
                page.classList.add('active-mobile');
            } else {
                page.classList.remove('active-mobile');
            }
        });
    }

    updateControls() {
        this.prevBtn.disabled = this.currentPage <= 0;
        this.nextBtn.disabled = this.currentPage >= this.totalPages - 1;
        this.indicatorEl.textContent = `Trang ${this.currentPage + 1} / ${this.totalPages}`;
    }
}

// Initialize
const memoryBook = new MemoryBook();
