/* ══════════════════════════════════════════════════════
   Punto Alto — 404 mini-game
   Estilo dino-runner, com a identidade do chevron.
   ══════════════════════════════════════════════════════ */

(function () {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // ── Canvas sharpness (DPR-aware) ─────────────────────
  const DESIGN_W = 900;
  const DESIGN_H = 220;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width  = DESIGN_W * dpr;
  canvas.height = DESIGN_H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const W = DESIGN_W;
  const H = DESIGN_H;
  const GROUND_Y = H - 32;

  // Physics
  const GRAVITY = 0.7;
  const JUMP_V  = -12.2;

  // Colors (ligados à identidade Punto Alto)
  const C = {
    bg:        '#06101F',
    dot:       'rgba(255,255,255,0.04)',
    ground:    'rgba(255,255,255,0.18)',
    tick:      'rgba(255,255,255,0.09)',
    chevron:   '#F8FAFC',
    accent:    '#FF6A3D',  // orange — logo dot
    blue:      '#378ADD',
    blueDeep:  '#1B5FA8',
    danger:    '#F87171'
  };

  // Elements
  const overlay   = document.getElementById('gameOverlay');
  const overlayP  = document.getElementById('overlayMsg');
  const scoreEl   = document.getElementById('gameScore');
  const bestEl    = document.getElementById('gameBest');

  // Persistent best score
  const BEST_KEY = 'pa-404-best';
  let best = 0;
  try { best = parseInt(localStorage.getItem(BEST_KEY) || '0', 10) || 0; } catch (e) {}
  bestEl.textContent = best;

  const state = {
    mode:       'idle',     // idle | playing | paused | over
    tick:       0,
    score:      0,
    speed:      6,
    player:     { x: 80, y: GROUND_Y, vy: 0, onGround: true, w: 20, h: 36 },
    obstacles:  [],
    nextSpawn:  90,
    groundOff:  0
  };

  // ── Overlay helpers ──────────────────────────────────
  function showOverlay(html) {
    overlayP.innerHTML = html;
    overlay.classList.remove('is-hidden');
  }
  function hideOverlay() {
    overlay.classList.add('is-hidden');
  }

  // ── Reset / start ────────────────────────────────────
  function start() {
    state.tick = 0;
    state.score = 0;
    state.speed = 6;
    state.obstacles = [];
    state.nextSpawn = 90;
    state.groundOff = 0;
    state.player.y = GROUND_Y;
    state.player.vy = 0;
    state.player.onGround = true;
    state.mode = 'playing';
    hideOverlay();
    requestAnimationFrame(loop);
  }

  function gameOver() {
    state.mode = 'over';
    if (state.score > best) {
      best = state.score;
      try { localStorage.setItem(BEST_KEY, String(best)); } catch (e) {}
      bestEl.textContent = best;
      showOverlay('<strong>¡Nuevo récord!</strong>' + state.score + ' pts<br/>Presioná <kbd>Espacio</kbd> o tocá para reintentar');
    } else {
      showOverlay('<strong>¡Chocaste!</strong>' + state.score + ' pts<br/>Presioná <kbd>Espacio</kbd> o tocá para reintentar');
    }
  }

  function togglePause() {
    if (state.mode === 'playing') {
      state.mode = 'paused';
      showOverlay('<strong>Pausa</strong>Presioná <kbd>P</kbd> para seguir');
    } else if (state.mode === 'paused') {
      state.mode = 'playing';
      hideOverlay();
      requestAnimationFrame(loop);
    }
  }

  // ── Jump ─────────────────────────────────────────────
  function jumpOrStart() {
    if (state.mode === 'idle' || state.mode === 'over') { start(); return; }
    if (state.mode === 'paused') { togglePause(); return; }
    if (state.mode === 'playing' && state.player.onGround) {
      state.player.vy = JUMP_V;
      state.player.onGround = false;
    }
  }

  // ── Spawn obstacles ──────────────────────────────────
  function spawnObstacle() {
    // Two variants: single bar, or a pair of bars for harder sections
    const r = Math.random();
    if (r < 0.25 && state.score > 15) {
      // Double bar
      const h1 = 22 + Math.random() * 12;
      const h2 = 22 + Math.random() * 12;
      state.obstacles.push({ x: W + 20, y: GROUND_Y - h1, w: 12, h: h1 });
      state.obstacles.push({ x: W + 46, y: GROUND_Y - h2, w: 12, h: h2 });
    } else if (r < 0.5 && state.score > 30) {
      // Taller single
      const h = 36 + Math.random() * 14;
      state.obstacles.push({ x: W + 20, y: GROUND_Y - h, w: 14, h });
    } else {
      const h = 22 + Math.random() * 12;
      const w = 12 + Math.random() * 4;
      state.obstacles.push({ x: W + 20, y: GROUND_Y - h, w, h });
    }
  }

  // ── Update ───────────────────────────────────────────
  function update() {
    state.tick++;

    // Difficulty: speed ramp
    if (state.tick % 600 === 0) state.speed = Math.min(state.speed + 0.45, 12);

    // Score: 1 pt a cada 6 ticks
    state.score = Math.floor(state.tick / 6);
    scoreEl.textContent = state.score;

    // Player physics
    const p = state.player;
    p.vy += GRAVITY;
    p.y  += p.vy;
    if (p.y >= GROUND_Y) {
      p.y = GROUND_Y;
      p.vy = 0;
      p.onGround = true;
    }

    // Ground animation
    state.groundOff = (state.groundOff - state.speed) % 24;

    // Spawn
    state.nextSpawn--;
    if (state.nextSpawn <= 0) {
      spawnObstacle();
      // Harder over time: spawn more often
      const min = Math.max(50, 100 - Math.floor(state.tick / 40));
      state.nextSpawn = min + Math.random() * 50;
    }

    // Move obstacles + collision
    for (let i = state.obstacles.length - 1; i >= 0; i--) {
      const o = state.obstacles[i];
      o.x -= state.speed;
      if (o.x + o.w < -20) { state.obstacles.splice(i, 1); continue; }

      // Player AABB: chevron ~ 26 wide × 28 tall, anchored at bottom
      const px = p.x - p.w / 2;
      const py = p.y - p.h;
      if (
        px < o.x + o.w - 2 &&
        px + p.w > o.x + 2 &&
        py < o.y + o.h &&
        py + p.h > o.y
      ) {
        gameOver();
        return;
      }
    }
  }

  // ── Draw ─────────────────────────────────────────────
  function draw() {
    // Background
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);

    // Subtle dot grid
    ctx.fillStyle = C.dot;
    for (let x = 0; x < W; x += 22) {
      for (let y = 0; y < H; y += 22) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Ground line
    ctx.strokeStyle = C.ground;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 2);
    ctx.lineTo(W, GROUND_Y + 2);
    ctx.stroke();

    // Ground ticks (moving dashes)
    ctx.strokeStyle = C.tick;
    ctx.lineWidth = 1;
    for (let x = state.groundOff; x < W; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, GROUND_Y + 8);
      ctx.lineTo(x + 10, GROUND_Y + 8);
      ctx.stroke();
    }

    // Obstacles
    for (const o of state.obstacles) {
      // shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(o.x + 2, o.y + 2, o.w, o.h);
      // body
      ctx.fillStyle = C.blueDeep;
      ctx.fillRect(o.x, o.y, o.w, o.h);
      // inner highlight
      ctx.fillStyle = C.blue;
      ctx.fillRect(o.x + 2, o.y + 2, o.w - 4, o.h - 4);
      // top accent line (orange)
      ctx.fillStyle = C.accent;
      ctx.fillRect(o.x, o.y, o.w, 2);
    }

    // Player (businessman)
    drawBusinessman(state.player.x, state.player.y, !state.player.onGround);

    // Soft vignette
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(6,16,31,0.4)');
    grad.addColorStop(0.4, 'rgba(6,16,31,0)');
    grad.addColorStop(0.9, 'rgba(6,16,31,0)');
    grad.addColorStop(1, 'rgba(6,16,31,0.5)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  function drawBusinessman(cx, yBottom, isJumping) {
    // Anchor: feet at yBottom. Char is ~36 tall × ~22 wide.
    const FEET_Y    = yBottom;
    const PANTS_TOP = yBottom - 10;
    const TORSO_TOP = yBottom - 22;
    const HEAD_CY   = yBottom - 28;
    const HEAD_R    = 6;

    const SKIN     = '#F5C99B';
    const HAIR     = '#2A1810';
    const SUIT     = '#042C53';
    const SUIT_DK  = '#0C1E35';
    const PANTS    = '#0E1525';
    const SHOE     = '#0A0A10';
    const SHIRT    = '#F8FAFC';
    const TIE      = C.accent;
    const INK      = '#1A1A1A';

    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';

    // ── Shadow under feet ────────────────────────────
    const shadowAlpha = isJumping ? 0.1 : 0.38;
    ctx.fillStyle = `rgba(0,0,0,${shadowAlpha})`;
    ctx.beginPath();
    ctx.ellipse(cx, FEET_Y + 2, 10, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Legs / shoes ─────────────────────────────────
    ctx.fillStyle = PANTS;
    if (isJumping) {
      // Knees tucked slightly — stance mais compacto
      ctx.fillRect(cx - 5, PANTS_TOP,     3, 7);
      ctx.fillRect(cx + 2, PANTS_TOP,     3, 7);
      ctx.fillStyle = SHOE;
      ctx.fillRect(cx - 7, FEET_Y - 3, 6, 3);
      ctx.fillRect(cx + 1, FEET_Y - 3, 6, 3);
    } else {
      ctx.fillRect(cx - 6, PANTS_TOP, 4, 10);
      ctx.fillRect(cx + 2, PANTS_TOP, 4, 10);
      ctx.fillStyle = SHOE;
      ctx.fillRect(cx - 7, FEET_Y - 2, 6, 2);
      ctx.fillRect(cx + 1, FEET_Y - 2, 6, 2);
    }

    // ── Suit torso ───────────────────────────────────
    ctx.fillStyle = SUIT;
    ctx.fillRect(cx - 8, TORSO_TOP, 16, 12);

    // Lapels (triângulos escuros nos dois lados)
    ctx.fillStyle = SUIT_DK;
    ctx.beginPath();
    ctx.moveTo(cx - 8, TORSO_TOP);
    ctx.lineTo(cx,     TORSO_TOP + 4);
    ctx.lineTo(cx - 4, TORSO_TOP + 9);
    ctx.lineTo(cx - 8, TORSO_TOP + 6);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 8, TORSO_TOP);
    ctx.lineTo(cx,     TORSO_TOP + 4);
    ctx.lineTo(cx + 4, TORSO_TOP + 9);
    ctx.lineTo(cx + 8, TORSO_TOP + 6);
    ctx.closePath();
    ctx.fill();

    // Shirt collar (V branco)
    ctx.fillStyle = SHIRT;
    ctx.beginPath();
    ctx.moveTo(cx - 3, TORSO_TOP);
    ctx.lineTo(cx,     TORSO_TOP + 4);
    ctx.lineTo(cx + 3, TORSO_TOP);
    ctx.closePath();
    ctx.fill();

    // Gravata — laranja, detalhe Punto Alto
    ctx.fillStyle = TIE;
    ctx.fillRect(cx - 1.5, TORSO_TOP + 2, 3, 2);   // nó
    ctx.beginPath();
    ctx.moveTo(cx - 2,   TORSO_TOP + 4);
    ctx.lineTo(cx + 2,   TORSO_TOP + 4);
    ctx.lineTo(cx + 2.5, TORSO_TOP + 10);
    ctx.lineTo(cx,       TORSO_TOP + 11);
    ctx.lineTo(cx - 2.5, TORSO_TOP + 10);
    ctx.closePath();
    ctx.fill();

    // ── Braços ────────────────────────────────────────
    ctx.fillStyle = SUIT;
    if (isJumping) {
      // Braços levantados (impulso)
      ctx.fillRect(cx - 10, TORSO_TOP,     3, 7);
      ctx.fillRect(cx +  7, TORSO_TOP,     3, 7);
      // Mãos levantadas
      ctx.fillStyle = SKIN;
      ctx.fillRect(cx - 10, TORSO_TOP - 3, 3, 3);
      ctx.fillRect(cx +  7, TORSO_TOP - 3, 3, 3);
    } else {
      // Braços relaxados nos lados
      ctx.fillRect(cx - 10, TORSO_TOP + 2, 3, 9);
      ctx.fillRect(cx +  7, TORSO_TOP + 2, 3, 9);
      ctx.fillStyle = SKIN;
      ctx.fillRect(cx - 10, TORSO_TOP + 10, 3, 2);
      ctx.fillRect(cx +  7, TORSO_TOP + 10, 3, 2);
    }

    // ── Pescoço ──────────────────────────────────────
    ctx.fillStyle = SKIN;
    ctx.fillRect(cx - 2, TORSO_TOP - 2, 4, 2);

    // ── Cabeça ───────────────────────────────────────
    ctx.fillStyle = SKIN;
    ctx.beginPath();
    ctx.arc(cx, HEAD_CY, HEAD_R, 0, Math.PI * 2);
    ctx.fill();

    // Cabelo (semicírculo superior + franja)
    ctx.fillStyle = HAIR;
    ctx.beginPath();
    ctx.arc(cx, HEAD_CY, HEAD_R, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(cx - 4, HEAD_CY - 1, 7, 2);      // franja
    ctx.fillRect(cx - HEAD_R,     HEAD_CY - 1, 1, 3); // costeleta esquerda
    ctx.fillRect(cx + HEAD_R - 1, HEAD_CY - 1, 1, 3); // costeleta direita

    // ── Face ─────────────────────────────────────────
    if (isJumping) {
      // CONCENTRADO: olhos semifechados + boca reta
      ctx.fillStyle = INK;
      ctx.fillRect(cx - 3, HEAD_CY,     2, 1);
      ctx.fillRect(cx + 1, HEAD_CY,     2, 1);
      // Sobrancelhas franzidas
      ctx.fillRect(cx - 3, HEAD_CY - 2, 2, 0.7);
      ctx.fillRect(cx + 1, HEAD_CY - 2, 2, 0.7);
      // Boca séria — linha reta
      ctx.fillRect(cx - 2, HEAD_CY + 3, 4, 1);
    } else {
      // FELIZ: olhos redondos + sorriso + blush
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(cx - 2, HEAD_CY, 0.9, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 2, HEAD_CY, 0.9, 0, Math.PI * 2); ctx.fill();

      // Sorriso (arco)
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(cx, HEAD_CY + 2, 2.2, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      // Blush (bochechas rosadas/laranjas)
      ctx.fillStyle = 'rgba(255, 106, 61, 0.4)';
      ctx.beginPath();
      ctx.arc(cx - 4.5, HEAD_CY + 2, 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 4.5, HEAD_CY + 2, 1.2, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ── Loop ─────────────────────────────────────────────
  function loop() {
    if (state.mode !== 'playing') return;
    update();
    if (state.mode !== 'playing') { draw(); return; } // game over during update
    draw();
    requestAnimationFrame(loop);
  }

  // ── Initial draw ─────────────────────────────────────
  draw();
  // draw a static happy businessman in idle mode
  state.player.y = GROUND_Y;
  drawBusinessman(state.player.x, state.player.y, false);

  // ── Input ────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      jumpOrStart();
    } else if (e.code === 'KeyP') {
      e.preventDefault();
      togglePause();
    }
  });

  const wrap = canvas.parentElement;
  wrap.addEventListener('click', (e) => {
    e.preventDefault();
    jumpOrStart();
  });
  wrap.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jumpOrStart();
  }, { passive: false });

  // Pause when tab hides
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.mode === 'playing') togglePause();
  });
})();
