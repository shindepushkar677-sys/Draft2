// Premium Animated Gradient Home Visuals
(function () {

  if (!document.body || document.body.dataset.page !== 'home') return;

  /* =====================================================
     BACKGROUND GRADIENT LAYERS
  ===================================================== */

  const bg = document.createElement('div');
  bg.className = 'home-gradient-bg';
  document.body.prepend(bg);

  const blob1 = document.createElement('div');
  blob1.className = 'home-gradient-blob home-gradient-blob1';
  document.body.appendChild(blob1);

  const blob2 = document.createElement('div');
  blob2.className = 'home-gradient-blob home-gradient-blob2';
  document.body.appendChild(blob2);

  const blob3 = document.createElement('div');
  blob3.className = 'home-gradient-blob home-gradient-blob3';
  document.body.appendChild(blob3);

  const glow = document.createElement('div');
  glow.className = 'home-gradient-glow';
  document.body.appendChild(glow);

  const grain = document.createElement('div');
  grain.className = 'home-gradient-grain';
  document.body.appendChild(grain);

  /* =====================================================
     SCROLL PARALLAX
  ===================================================== */

  window.addEventListener('scroll', function () {

    const sy = window.scrollY || 0;

    blob1.style.transform =
      `translateY(${sy * -0.08}px) scale(1.1)`;

    blob2.style.transform =
      `translateY(${sy * 0.10}px) scale(1.05)`;

    blob3.style.transform =
      `translateY(${sy * -0.06}px) scale(1)`;

    bg.style.filter =
      `blur(${Math.min(8, sy * 0.03)}px)`;

    glow.style.opacity =
      0.7 + Math.sin(sy * 0.01) * 0.08;
  });

  /* =====================================================
     HERO FADE REVEAL
  ===================================================== */

  document
    .querySelectorAll('.hero, .featured-head, .works-grid')
    .forEach(function (el, i) {

      el.style.opacity = 0;

      el.style.transform = 'translateY(40px)';

      setTimeout(function () {

        el.style.transition =
          'opacity 1.1s cubic-bezier(.4,2,.6,1), transform 1.1s cubic-bezier(.4,2,.6,1)';

        el.style.opacity = 1;

        el.style.transform = 'translateY(0)';

      }, 300 + i * 180);

    });

})();



/* =========================================================
   RACHANATMAK PREMIUM FLOW FIELD PARTICLE EFFECT
   Ocean Mist Inspired Artistic Motion
========================================================= */

(function () {

  if (!document.body || document.body.dataset.page !== 'home') return;

  /* =====================================================
     OCEAN MIST PALETTE
  ===================================================== */

  const palette = [

    "#b8dff2", // mist blue
    "#c7e8f5", // airy sky
    "#d9d0f2", // lavender
    "#f4e8d5", // cream
    "#e6d8f7", // lilac
    "#cfe8df", // mint

    /* subtle warmth */
    "#E1B053",
    "#CD6200"

  ];

  /* =====================================================
     CONFIG
  ===================================================== */

  const config = {

    particleCount: 950,
    speed: 0.42,
    fadeAlpha: 0.012,
    noiseScale: 0.0022,

  };

  /* =====================================================
     NOISE ENGINE
  ===================================================== */

  const perm = new Uint8Array(512);

  const grad3 = [

    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]

  ];

  (function buildPerm() {

    const p = new Uint8Array(256);

    for (let i = 0; i < 256; i++) p[i] = i;

    for (let i = 255; i > 0; i--) {

      const j = Math.random() * (i + 1) | 0;

      [p[i], p[j]] = [p[j], p[i]];
    }

    for (let i = 0; i < 512; i++) {

      perm[i] = p[i & 255];
    }

  })();

  function dot(g, x, y) {

    return g[0] * x + g[1] * y;
  }

  function fade(t) {

    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerp(a, b, t) {

    return a + (b - a) * t;
  }

  function noise2(x, y) {

    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = fade(xf);
    const v = fade(yf);

    const aa = perm[perm[X] + Y];
    const ab = perm[perm[X] + Y + 1];
    const ba = perm[perm[X + 1] + Y];
    const bb = perm[perm[X + 1] + Y + 1];

    return lerp(

      lerp(
        dot(grad3[aa % 12], xf, yf),
        dot(grad3[ba % 12], xf - 1, yf),
        u
      ),

      lerp(
        dot(grad3[ab % 12], xf, yf - 1),
        dot(grad3[bb % 12], xf - 1, yf - 1),
        u
      ),

      v
    );
  }

  /* =====================================================
     CANVAS
  ===================================================== */

  const canvas =
    document.getElementById("particle-canvas");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  let W, H;
  let particles = [];
  let animationFrame;
  let time = 0;

  /* =====================================================
     HELPERS
  ===================================================== */

  function hexToRgb(hex) {

    return [

      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16)

    ];
  }

  /* =====================================================
     CREATE PARTICLES
  ===================================================== */

  function spawnParticles() {

    particles = [];

    for (let i = 0; i < config.particleCount; i++) {

      const color =
        palette[Math.floor(Math.random() * palette.length)];

      const [r, g, b] = hexToRgb(color);

      particles.push({

        x: Math.random() * W,
        y: Math.random() * H,

        r,
        g,
        b,

        life: Math.random(),

        maxLife: 0.4 + Math.random() * 0.6
      });
    }
  }

  /* =====================================================
     RESET PARTICLE
  ===================================================== */

  function resetParticle(p) {

    const color =
      palette[Math.floor(Math.random() * palette.length)];

    const [r, g, b] = hexToRgb(color);

    p.x = Math.random() * W;
    p.y = Math.random() * H;

    p.r = r;
    p.g = g;
    p.b = b;

    p.life = 0;

    p.maxLife = 0.4 + Math.random() * 0.6;
  }

  /* =====================================================
     RESIZE
  ===================================================== */

  function resizeCanvas() {

    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;

    ctx.fillStyle = "#dbeaf5";

    ctx.fillRect(0, 0, W, H);

    spawnParticles();
  }

  /* =====================================================
     DRAW LOOP
  ===================================================== */

  function drawParticles() {

    ctx.fillStyle =
      `rgba(215,230,245,${config.fadeAlpha})`;

    ctx.fillRect(0, 0, W, H);

    time += 0.003;

    for (let i = 0; i < particles.length; i++) {

      const p = particles[i];

      const nx =
        p.x * config.noiseScale + time;

      const ny =
        p.y * config.noiseScale + time * 0.7;

      const angle =
        noise2(nx, ny) * Math.PI * 4;

      p.x += Math.cos(angle) * config.speed;

      p.y += Math.sin(angle) * config.speed;

      p.life += 0.005;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;

      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      const progress =
        p.life / p.maxLife;

      let alpha;

      if (progress < 0.2) {

        alpha = progress / 0.2;

      } else if (progress < 0.7) {

        alpha = 1;

      } else {

        alpha = (1 - progress) / 0.3;
      }

      alpha =
        Math.max(0, Math.min(1, alpha)) * 0.55;

      if (p.life >= p.maxLife) {

        resetParticle(p);
      }

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        1.6,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        `rgba(${p.r},${p.g},${p.b},${alpha})`;

      ctx.fill();
    }

    animationFrame =
      requestAnimationFrame(drawParticles);
  }

  /* =====================================================
     RESIZE EVENT
  ===================================================== */

  window.addEventListener("resize", () => {

    cancelAnimationFrame(animationFrame);

    resizeCanvas();

    drawParticles();
  });

  /* =====================================================
     INIT
  ===================================================== */

  resizeCanvas();

  drawParticles();
})();
