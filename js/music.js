/* ═══════════════════════════════════════════════
   MUSIC PLAYER - Background music controller
   ═══════════════════════════════════════════════ */

class MusicPlayer {
    constructor() {
        this.playerEl = document.getElementById('music-player');
        this.toggleBtn = document.getElementById('music-toggle');
        this.trackNameEl = document.getElementById('music-track-name');
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentTrack = 0;

        // ──────────────────────────────────────────
        // PLAYLIST — Thêm file nhạc vào thư mục music/
        // Đổi tên file và hiển thị tương ứng
        // ──────────────────────────────────────────
        this.playlist = [
            {
                src: 'music/Bình Yên.mp3',
                name: 'Bình Yên'
            },
            {
                src: 'music/Dễ thương.mp3',
                name: 'Dễ thương'
            },
            {
                src: 'music/Hát Vang Rằng Em Yêu Anh.mp3',
                name: 'Hát Vang Rằng Em Yêu Anh'
            },
            {
                src: 'music/Ngày Đầu Tiên.mp3',
                name: 'Ngày Đầu Tiên'
            }
        ];

        this.shufflePlaylist();
        this.init();
    }

    shufflePlaylist() {
        for (let i = this.playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
        }
    }

    init() {
        this.audio.volume = 0.5;
        this.audio.preload = 'auto';

        this.toggleBtn.addEventListener('click', () => this.toggle());

        // Auto next track
        this.audio.addEventListener('ended', () => this.next());

        // Handle loading errors gracefully
        this.audio.addEventListener('error', () => {
            console.log(`Không tìm thấy file nhạc: ${this.playlist[this.currentTrack]?.src}`);
            // Try next track
            if (this.currentTrack < this.playlist.length - 1) {
                this.currentTrack++;
                this.loadTrack();
            }
        });
    }

    show() {
        this.playerEl.classList.remove('hidden');
    }

    hide() {
        this.playerEl.classList.add('hidden');
    }

    loadTrack() {
        if (this.currentTrack >= this.playlist.length) {
            this.currentTrack = 0;
        }

        const track = this.playlist[this.currentTrack];
        this.audio.src = track.src;
        this.trackNameEl.textContent = `♪ ${track.name}`;
    }

    play() {
        this.loadTrack();

        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.playerEl.classList.remove('paused');
            }).catch(() => {
                // Autoplay blocked - wait for user interaction
                console.log('Autoplay bị chặn, nhạc sẽ phát sau tương tác đầu tiên');
                this.isPlaying = false;
                this.playerEl.classList.add('paused');

                // Add one-time listener to start music on first click anywhere
                const startOnInteraction = () => {
                    if (!this.isPlaying) {
                        this.play();
                    }
                    document.removeEventListener('click', startOnInteraction);
                    document.removeEventListener('touchstart', startOnInteraction);
                };
                document.addEventListener('click', startOnInteraction);
                document.addEventListener('touchstart', startOnInteraction);
            });
        }
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playerEl.classList.add('paused');
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            if (!this.audio.src || this.audio.src === window.location.href) {
                this.loadTrack();
            }
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.playerEl.classList.remove('paused');
            }).catch(() => {
                console.log('Không thể phát nhạc');
            });
        }
    }

    next() {
        this.currentTrack++;
        if (this.currentTrack >= this.playlist.length) {
            this.currentTrack = 0;
        }
        this.loadTrack();
        if (this.isPlaying) {
            this.audio.play().catch(() => { });
        }
    }

    prev() {
        this.currentTrack--;
        if (this.currentTrack < 0) {
            this.currentTrack = this.playlist.length - 1;
        }
        this.loadTrack();
        if (this.isPlaying) {
            this.audio.play().catch(() => { });
        }
    }

    setVolume(vol) {
        this.audio.volume = Math.max(0, Math.min(1, vol));
    }

    fadeIn(duration = 2000) {
        this.audio.volume = 0;
        const step = 0.5 / (duration / 50);
        const fadeInterval = setInterval(() => {
            if (this.audio.volume < 0.5) {
                this.audio.volume = Math.min(0.5, this.audio.volume + step);
            } else {
                clearInterval(fadeInterval);
            }
        }, 50);
    }
}

// Initialize as global (referenced by entry-gate.js)
const musicPlayer = new MusicPlayer();
