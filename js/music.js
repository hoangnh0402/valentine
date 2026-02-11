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
                src: 'music/track1.mp3',
                name: 'Bài hát 1'
            },
            {
                src: 'music/track2.mp3',
                name: 'Bài hát 2'
            },
            {
                src: 'music/track3.mp3',
                name: 'Bài hát 3'
            },
            {
                src: 'music/track4.mp3',
                name: 'Bài hát 4'
            },
            {
                src: 'music/track5.mp3',
                name: 'Bài hát 5'
            }
        ];

        this.init();
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
                console.log('Autoplay bị chặn, click nút nhạc để phát');
                this.isPlaying = false;
                this.playerEl.classList.add('paused');
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
