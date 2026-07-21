/* ═══════════════════════════════════════════════════════════════
   🎂 BIRTHDAY SURPRISE WEBSITE — JAVASCRIPT
   All interactive features, animations, and effects
   ═══════════════════════════════════════════════════════════════ */

/* ─── CONFIGURATION ─── */
// Set your background music file path here:
const BACKGROUND_MUSIC_FILE = 'music/nalone_pongenu.mp3';

/* ═══════════════════════════════════════════
   DOM READY
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    initConfetti();
    initFloatingElements();
    initTypingAnimation();
    initNavigation();
    initScrollReveal();
    initGalleryLightbox();
    initMusicPlayer();
    initCelebrateButton();
    initPlaylistTracks();
    hideEmptyGallery();
});

/* ═══════════════════════════════════════════
   CONFETTI SYSTEM (Canvas-based)
   ═══════════════════════════════════════════ */
function initConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let running = true;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const colors = [
        '#FFB6C1', '#FF69B4', '#FF1493', '#DCD0FF',
        '#B49AFF', '#FFD700', '#FFC107', '#FFE082',
        '#E8DAEF', '#FFDAB9', '#FF6B6B', '#C9B8FF'
    ];

    class ConfettiParticle {
        constructor(burst = false) {
            this.x = burst ? window.innerWidth / 2 + (Math.random() - 0.5) * 200 : Math.random() * canvas.width;
            this.y = burst ? window.innerHeight / 2 : -10;
            this.size = Math.random() * 8 + 4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedX = (Math.random() - 0.5) * (burst ? 12 : 3);
            this.speedY = burst ? -(Math.random() * 10 + 5) : Math.random() * 2 + 1;
            this.gravity = 0.1;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
            this.opacity = 1;
            this.decay = burst ? 0.008 : 0.003;
            this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
            this.wobble = Math.random() * 10;
            this.wobbleSpeed = Math.random() * 0.1 + 0.02;
        }

        update() {
            this.speedY += this.gravity;
            this.x += this.speedX + Math.sin(this.wobble) * 0.5;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            this.opacity -= this.decay;
            this.wobble += this.wobbleSpeed;
            this.speedX *= 0.99;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;

            if (this.shape === 'rect') {
                ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Initial confetti burst on page load
    for (let i = 0; i < 150; i++) {
        particles.push(new ConfettiParticle(false));
    }

    function animate() {
        if (!running && particles.length === 0) return;
        animationId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles = particles.filter(p => p.opacity > 0 && p.y < canvas.height + 50);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Stop initial confetti after it clears
        if (particles.length === 0 && running) {
            running = false;
            cancelAnimationFrame(animationId);
        }
    }
    animate();

    // Expose burst function for celebrate button
    window.triggerConfetti = function () {
        running = true;
        for (let i = 0; i < 120; i++) {
            particles.push(new ConfettiParticle(true));
        }
        // Also add some from top
        for (let i = 0; i < 80; i++) {
            particles.push(new ConfettiParticle(false));
        }
        if (!animationId || particles.length > 0) {
            animate();
        }
    };
}

/* ═══════════════════════════════════════════
   FLOATING ELEMENTS (Hearts, Sparkles, Flowers, Balloons)
   ═══════════════════════════════════════════ */
function initFloatingElements() {
    const container = document.getElementById('floating-container');
    const elements = ['❤️', '💕', '💖', '🌸', '🌺', '✨', '⭐', '💫', '🎈', '🎀', '🌷', '🌹', '💐', '🦋'];

    function createFloating() {
        const el = document.createElement('div');
        el.className = 'floating-element';
        el.textContent = elements[Math.floor(Math.random() * elements.length)];

        const startX = Math.random() * 100;
        const drift = (Math.random() - 0.5) * 100;
        const spin = Math.random() * 720 - 360;
        const duration = Math.random() * 8 + 10;
        const size = Math.random() * 1.2 + 0.8;

        el.style.left = `${startX}%`;
        el.style.fontSize = `${size}rem`;
        el.style.setProperty('--drift', `${drift}px`);
        el.style.setProperty('--spin', `${spin}deg`);
        el.style.animation = `floatUp ${duration}s linear forwards`;

        container.appendChild(el);

        el.addEventListener('animationend', () => el.remove());
    }

    // Create initial batch
    for (let i = 0; i < 6; i++) {
        setTimeout(createFloating, i * 500);
    }

    // Continue creating periodically
    setInterval(createFloating, 2500);
}

/* ═══════════════════════════════════════════
   TYPING ANIMATION
   ═══════════════════════════════════════════ */
function initTypingAnimation() {
    const textEl = document.getElementById('typingText');
    const fullTextEl = document.querySelector('.hero-subtitle-full');
    if (!textEl || !fullTextEl) return;

    const fullText = fullTextEl.textContent.trim();
    let index = 0;

    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    textEl.appendChild(cursor);

    function type() {
        if (index < fullText.length) {
            // Insert text before cursor
            const textNode = document.createTextNode(fullText.charAt(index));
            textEl.insertBefore(textNode, cursor);
            index++;
            const delay = fullText.charAt(index - 1) === '.' ? 400 :
                           fullText.charAt(index - 1) === ',' ? 200 :
                           fullText.charAt(index - 1) === ' ' ? 60 : 40;
            setTimeout(type, delay);
        } else {
            // Remove cursor after a brief pause
            setTimeout(() => cursor.remove(), 2000);
        }
    }

    // Start after a delay
    setTimeout(type, 1500);
}

/* ═══════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════ */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        }
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = navLinks.querySelectorAll('a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL (Intersection Observer)
   ═══════════════════════════════════════════ */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show all
        revealElements.forEach(el => el.classList.add('visible'));
    }
}

/* ═══════════════════════════════════════════
   GALLERY LIGHTBOX
   ═══════════════════════════════════════════ */
function initGalleryLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    let galleryItems = [];
    let currentIndex = 0;

    function refreshGalleryItems() {
        galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    }

    function openLightbox(index) {
        refreshGalleryItems();
        if (galleryItems.length === 0) return;

        currentIndex = index;
        const item = galleryItems[currentIndex];
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay span');

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = overlay ? overlay.textContent : img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigate(direction) {
        refreshGalleryItems();
        if (galleryItems.length === 0) return;
        currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
        openLightbox(currentIndex);
    }

    // Event delegation for gallery items
    document.getElementById('galleryGrid').addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) {
            refreshGalleryItems();
            const index = galleryItems.indexOf(item);
            if (index !== -1) openLightbox(index);
        }
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });
}

/* ═══════════════════════════════════════════
   HIDE EMPTY GALLERY STATE
   ═══════════════════════════════════════════ */
function hideEmptyGallery() {
    const grid = document.getElementById('galleryGrid');
    const emptyState = document.getElementById('galleryEmptyState');
    if (!grid || !emptyState) return;

    const hasImages = grid.querySelectorAll('.gallery-item').length > 0;
    emptyState.style.display = hasImages ? 'none' : 'block';
}

/* ═══════════════════════════════════════════
   MUSIC PLAYER
   ═══════════════════════════════════════════ */
function initMusicPlayer() {
    const audio = document.getElementById('bgMusic');
    const toggleBtn = document.getElementById('musicToggle');
    const playIcon = toggleBtn.querySelector('.music-icon-play');
    const pauseIcon = toggleBtn.querySelector('.music-icon-pause');
    const visualizer = document.querySelector('.music-visualizer');

    // Set music source if configured
    if (BACKGROUND_MUSIC_FILE) {
        const source = document.createElement('source');
        source.src = BACKGROUND_MUSIC_FILE;
        source.type = `audio/${BACKGROUND_MUSIC_FILE.split('.').pop()}`;
        audio.appendChild(source);
        audio.load();
    }

    let isPlaying = false;

    toggleBtn.addEventListener('click', () => {
        if (!BACKGROUND_MUSIC_FILE) {
            console.log('No background music file configured. Set BACKGROUND_MUSIC_FILE in main.js');
            return;
        }

        if (isPlaying) {
            audio.pause();
            playIcon.style.display = '';
            pauseIcon.style.display = 'none';
            visualizer.classList.remove('playing');
        } else {
            audio.play().catch(err => {
                console.log('Audio play failed:', err);
            });
            playIcon.style.display = 'none';
            pauseIcon.style.display = '';
            visualizer.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
}

/* ═══════════════════════════════════════════
   PLAYLIST TRACKS
   ═══════════════════════════════════════════ */
function initPlaylistTracks() {
    const tracksContainer = document.getElementById('playlistTracks');
    const emptyState = document.getElementById('playlistEmpty');
    const audio = document.getElementById('bgMusic');

    if (!tracksContainer) return;

    const tracks = tracksContainer.querySelectorAll('.playlist-track');

    // Show/hide empty state
    if (tracks.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    } else {
        if (emptyState) emptyState.style.display = 'none';
    }

    tracks.forEach(track => {
        track.addEventListener('click', () => {
            const src = track.getAttribute('data-src');
            if (!src) return;

            // Update active state
            tracks.forEach(t => t.classList.remove('active'));
            track.classList.add('active');

            // Play the track
            audio.src = src;
            audio.play().catch(err => console.log('Play failed:', err));

            // Update music controller UI
            const playIcon = document.querySelector('.music-icon-play');
            const pauseIcon = document.querySelector('.music-icon-pause');
            const visualizer = document.querySelector('.music-visualizer');
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) pauseIcon.style.display = '';
            if (visualizer) visualizer.classList.add('playing');
        });
    });
}

/* ═══════════════════════════════════════════
   CELEBRATE BUTTON — FIREWORKS + CONFETTI
   ═══════════════════════════════════════════ */
function initCelebrateButton() {
    const btn = document.getElementById('celebrateBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        // Trigger confetti
        if (window.triggerConfetti) window.triggerConfetti();

        // Trigger fireworks
        launchFireworks();

        // Button animation
        btn.style.transform = 'scale(0.9)';
        setTimeout(() => { btn.style.transform = ''; }, 200);
    });
}

/* ═══════════════════════════════════════════
   FIREWORKS SYSTEM
   ═══════════════════════════════════════════ */
function launchFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks = [];
    const sparks = [];

    const colors = [
        '#FF69B4', '#FFD700', '#B49AFF', '#FF1493',
        '#FFC107', '#E8DAEF', '#FF6B6B', '#87CEEB',
        '#DDA0DD', '#FFB6C1', '#98FB98', '#F0E68C'
    ];

    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * canvas.height * 0.4 + 50;
            this.speed = Math.random() * 4 + 6;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alive = true;
            this.trail = [];
        }

        update() {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 8) this.trail.shift();

            this.y -= this.speed;
            this.x += (Math.random() - 0.5) * 0.5;

            if (this.y <= this.targetY) {
                this.alive = false;
                this.explode();
            }
        }

        explode() {
            const numSparks = Math.floor(Math.random() * 30) + 40;
            for (let i = 0; i < numSparks; i++) {
                const angle = (Math.PI * 2 / numSparks) * i;
                const speed = Math.random() * 4 + 2;
                sparks.push(new Spark(this.x, this.y, angle, speed, this.color));
            }
        }

        draw() {
            // Trail
            this.trail.forEach((pos, i) => {
                ctx.globalAlpha = i / this.trail.length * 0.5;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
                ctx.fill();
            });

            // Head
            ctx.globalAlpha = 1;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();

            // Glow
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Spark {
        constructor(x, y, angle, speed, color) {
            this.x = x;
            this.y = y;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.color = color;
            this.opacity = 1;
            this.decay = Math.random() * 0.015 + 0.01;
            this.gravity = 0.05;
            this.size = Math.random() * 2.5 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.vx *= 0.98;
            this.opacity -= this.decay;
        }

        draw() {
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // Glow effect
            ctx.globalAlpha = Math.max(0, this.opacity * 0.3);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Launch multiple fireworks with staggered timing
    let launchCount = 0;
    const maxLaunches = 8;

    function launchOne() {
        if (launchCount < maxLaunches) {
            fireworks.push(new Firework());
            launchCount++;
            setTimeout(launchOne, Math.random() * 400 + 200);
        }
    }
    launchOne();

    let animFrameId;
    function animate() {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';

        // Update and draw fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw();
            if (!fireworks[i].alive) fireworks.splice(i, 1);
        }

        // Update and draw sparks
        for (let i = sparks.length - 1; i >= 0; i--) {
            sparks[i].update();
            sparks[i].draw();
            if (sparks[i].opacity <= 0) sparks.splice(i, 1);
        }

        if (fireworks.length > 0 || sparks.length > 0) {
            animFrameId = requestAnimationFrame(animate);
        } else {
            // Clear canvas when done
            ctx.globalCompositeOperation = 'source-over';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animFrameId);
        }
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animate();
}

/* ═══════════════════════════════════════════
   SMOOTH SCROLL POLYFILL
   ═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
