/**
 * ==========================================================================
 * MOONLIGHT & MAGIC - Interactive Web Novel Script (Vanilla JS)
 * Created by: Muhamad Kholil Luthfi
 * Prodi: Manajemen Informatika - Politeknik Piksi Input Serang
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initStarlightCanvas();
  initMobileNavigation();
  initReadingProgressBar();
  initReaderControls();
  initBackToTop();
  initSpellSparkles();
});

/* --------------------------------------------------------------------------
 * 1. Animated Starlight & Floating Magic Particles Canvas
 * -------------------------------------------------------------------------- */
function initStarlightCanvas() {
  const canvas = document.getElementById('starlight-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Generate twinkling stars
  const starsCount = Math.floor((width * height) / 9000);
  const stars = [];
  for (let i = 0; i < starsCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1,
    });
  }

  // Generate floating magical dust motes
  const motesCount = 28;
  const motes = [];
  const colors = ['#38BDF8', '#A855F7', '#DDD6FE', '#67E8F9'];
  for (let i = 0; i < motesCount; i++) {
    motes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.45 - 0.1,
    });
  }

  // Shooting star state
  let shootingStar = null;
  function triggerShootingStar() {
    shootingStar = {
      x: Math.random() * (width * 0.7),
      y: Math.random() * (height * 0.4),
      length: Math.random() * 80 + 60,
      speed: Math.random() * 12 + 10,
      opacity: 1,
      angle: Math.PI / 4,
    };
    setTimeout(triggerShootingStar, Math.random() * 8000 + 7000);
  }
  setTimeout(triggerShootingStar, 4000);

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Render stars
    for (const star of stars) {
      star.alpha += star.speed * star.direction;
      if (star.alpha > 0.95) star.direction = -1;
      if (star.alpha < 0.15) star.direction = 1;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.fill();
    }

    // Render floating magic motes
    for (const mote of motes) {
      mote.x += mote.vx;
      mote.y += mote.vy;

      if (mote.y < -10) {
        mote.y = height + 10;
        mote.x = Math.random() * width;
      }
      if (mote.x < -10) mote.x = width + 10;
      if (mote.x > width + 10) mote.x = -10;

      ctx.beginPath();
      ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
      ctx.shadowBlur = 10;
      ctx.shadowColor = mote.color;
      ctx.fillStyle = mote.color;
      ctx.globalAlpha = mote.alpha;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    // Render shooting star
    if (shootingStar) {
      const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
      const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

      const gradient = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(1, `rgba(168, 85, 247, ${shootingStar.opacity})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(shootingStar.x, shootingStar.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
      shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
      shootingStar.opacity -= 0.02;

      if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
        shootingStar = null;
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
 * 2. Mobile Navigation Toggle
 * -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen ? '✕' : '☰';
  });

  // Close menu when clicking outside or clicking any nav link
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      navMenu.classList.remove('open');
      toggleBtn.innerHTML = '☰';
    }
  });

  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.innerHTML = '☰';
    });
  });
}

/* --------------------------------------------------------------------------
 * 3. Reading Progress Bar
 * -------------------------------------------------------------------------- */
function initReadingProgressBar() {
  const progressBar = document.getElementById('reading-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
 * 4. Reader Customization Controls (Font Size & Themes)
 * -------------------------------------------------------------------------- */
function initReaderControls() {
  const fontBtns = document.querySelectorAll('[data-font-size]');
  const themeBtns = document.querySelectorAll('[data-theme]');

  // Load saved preferences
  const savedFontSize = localStorage.getItem('moonlight_font_size') || 'md';
  const savedTheme = localStorage.getItem('moonlight_theme') || 'midnight';

  applyFontSize(savedFontSize);
  applyTheme(savedTheme);

  fontBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const size = btn.dataset.fontSize;
      applyFontSize(size);
      localStorage.setItem('moonlight_font_size', size);
    });
  });

  themeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      applyTheme(theme);
      localStorage.setItem('moonlight_theme', theme);
    });
  });

  function applyFontSize(size) {
    document.body.classList.remove('font-sm', 'font-md', 'font-lg');
    document.body.classList.add(`font-${size}`);
    fontBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.fontSize === size);
    });
  }

  function applyTheme(theme) {
    document.body.classList.remove('theme-midnight', 'theme-twilight', 'theme-parchment');
    if (theme !== 'midnight') {
      document.body.classList.add(`theme-${theme}`);
    }
    themeBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }
}

/* --------------------------------------------------------------------------
 * 5. Back to Top Button
 * -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/* --------------------------------------------------------------------------
 * 6. Interactive Spell Sparkles
 * -------------------------------------------------------------------------- */
function initSpellSparkles() {
  const spellTags = document.querySelectorAll('code');

  spellTags.forEach((tag) => {
    tag.style.cursor = 'pointer';
    tag.title = 'Klik untuk memancarkan sihir!';

    tag.addEventListener('click', (e) => {
      createSparkleBurst(e.clientX, e.clientY);
    });
  });

  function createSparkleBurst(x, y) {
    const colors = ['#38BDF8', '#C4B5FD', '#FCD34D', '#A855F7', '#FFFFFF'];
    const burstCount = 14;

    for (let i = 0; i < burstCount; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'magic-sparkle-dot';
      sparkle.style.position = 'fixed';
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.width = '6px';
      sparkle.style.height = '6px';
      sparkle.style.borderRadius = '50%';
      sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      sparkle.style.boxShadow = `0 0 10px ${sparkle.style.backgroundColor}`;
      sparkle.style.pointerEvents = 'none';
      sparkle.style.zIndex = '9999';

      const angle = (Math.PI * 2 * i) / burstCount;
      const velocity = Math.random() * 45 + 25;
      const destX = Math.cos(angle) * velocity;
      const destY = Math.sin(angle) * velocity;

      sparkle.style.transition = 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      document.body.appendChild(sparkle);

      requestAnimationFrame(() => {
        sparkle.style.transform = `translate(${destX}px, ${destY}px) scale(0)`;
        sparkle.style.opacity = '0';
      });

      setTimeout(() => {
        sparkle.remove();
      }, 700);
    }
  }
}
