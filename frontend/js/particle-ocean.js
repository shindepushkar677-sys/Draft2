// OCEAN MIST PARTICLE CANVAS for HERO LEFT
// This script is loaded only on the homepage and only if the #particle-canvas exists in the DOM.
(function () {
  if (!document.body || document.body.dataset.page !== 'home') return;
  var canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, particles = [], animId, t = 0;
  // Ocean Mist palette (locked to brand)
  // Brand palette: soft blue and orange only
  var palette = ["#E1B053", "#CD6200", "#93C3DB", "#E3D6AD", "#CD5000", "#f7f6f2"];
  // Use mostly orange and blue, with a touch of sand/white for blending
  var mainParticles = ["#CD6200", "#93C3DB"];
  var bgParticles = ["#E3D6AD", "#f7f6f2"];
  var particleCount = 220; // less dense, more airy
  var speed = 0.32; // slower, more gentle
  var fadeAlpha = 0.035; // more fade, softer trails
  var noiseScale = 0.0025;
  // Simplex-like noise
  var perm = new Uint8Array(512);
  var grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
  (function buildPerm() {
    var p = new Uint8Array(256);
    for (var i=0;i<256;i++) p[i]=i;
    for (var i=255;i>0;i--) { var j=Math.random()*(i+1)|0; [p[i],p[j]]=[p[j],p[i]]; }
    for (var i=0;i<512;i++) perm[i]=p[i&255];
  })();
  function dot(g,x,y){ return g[0]*x+g[1]*y; }
  function fade(t){ return t*t*t*(t*(t*6-15)+10); }
  function lerp(a,b,t){ return a+(b-a)*t; }
  function noise2(x,y){
    var X=Math.floor(x)&255, Y=Math.floor(y)&255;
    var xf=x-Math.floor(x), yf=y-Math.floor(y);
    var u=fade(xf), v=fade(yf);
    var aa=perm[perm[X]+Y],   ab=perm[perm[X]+Y+1];
    var ba=perm[perm[X+1]+Y], bb=perm[perm[X+1]+Y+1];
    return lerp(
      lerp(dot(grad3[aa%12],xf,yf),     dot(grad3[ba%12],xf-1,yf),   u),
      lerp(dot(grad3[ab%12],xf,yf-1),   dot(grad3[bb%12],xf-1,yf-1), u),
      v
    );
  }
  function hexToRgb(hex) {
    var r = parseInt(hex.slice(1,3),16);
    var g = parseInt(hex.slice(3,5),16);
    var b = parseInt(hex.slice(5,7),16);
    return [r,g,b];
  }
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, W, H);
    spawnParticles();
  }
  function spawnParticles() {
    particles = [];
    for (var i=0; i<particleCount; i++) {
      // 70% main (orange/blue), 30% bg (sand/white)
      var colorArr = (i < particleCount * 0.7) ? mainParticles : bgParticles;
      var ci = Math.floor(Math.random() * colorArr.length);
      var rgb = hexToRgb(colorArr[ci]);
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: rgb[0], g: rgb[1], b: rgb[2],
        life: Math.random(),
        maxLife: 0.4 + Math.random() * 0.6
      });
    }
  }
  function resetParticle(p) {
    var ci = Math.floor(Math.random() * palette.length);
    var rgb = hexToRgb(palette[ci]);
    p.x = Math.random() * W;
    p.y = Math.random() * H;
    p.r = rgb[0]; p.g = rgb[1]; p.b = rgb[2];
    p.life = 0;
    p.maxLife = 0.4 + Math.random() * 0.6;
  }
  function draw() {
    // Soft pastel blue/white background
    ctx.fillStyle = 'rgba(235, 242, 250, 0.92)';
    ctx.fillRect(0, 0, W, H);
    t += 0.003;
    for (var i=0; i<particles.length; i++) {
      var p = particles[i];
      var nx = p.x * noiseScale + t;
      var ny = p.y * noiseScale + t * 0.7;
      var angle = noise2(nx, ny) * Math.PI * 4;
      p.x += Math.cos(angle) * speed;
      p.y += Math.sin(angle) * speed;
      p.life += 0.005;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      var prog = p.life / p.maxLife;
      var alpha;
      if (prog < 0.2)      alpha = prog / 0.2;
      else if (prog < 0.7) alpha = 1;
      else                 alpha = (1 - prog) / 0.3;
      alpha = Math.max(0, Math.min(1, alpha)) * 0.55;
      if (p.life >= p.maxLife) resetParticle(p);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
      ctx.fill();
    }
    animId = requestAnimationFrame(draw);
  }
  function start() {
    if (animId) cancelAnimationFrame(animId);
    resize();
    draw();
  }
  window.addEventListener('resize', function () { cancelAnimationFrame(animId); resize(); draw(); });
  // Only run if .hero-left is visible
  var heroLeft = document.querySelector('.hero-left');
  if (heroLeft && getComputedStyle(heroLeft).display !== 'none') {
    start();
  }
})();
