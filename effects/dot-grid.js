const TRAIL_MS = 2600;

function dotHash(col, row) {
  let h = (col * 374761393 + row * 668265263) | 0;
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return (h & 0x7fffffff) / 0x7fffffff;
}

export function initDotGrid(host, options = {}) {
  if (!host || host.dataset.effectsDotGrid === "ready") {
    return null;
  }

  if (
    !options.force &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return null;
  }

  const layer = document.createElement("div");
  layer.className = "ml-effects-layer ml-dot-grid-layer";

  const canvas = document.createElement("canvas");
  canvas.className = "ml-dot-grid-canvas";
  layer.appendChild(canvas);

  host.classList.add("ml-effects-host");
  host.insertBefore(layer, host.firstChild);
  host.dataset.effectsDotGrid = "ready";

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }

  const spacing = options.spacing ?? 16;
  const dotRadius = options.dotRadius ?? 1.5;
  const glowRadius = options.glowRadius ?? 340;
  const dpr = window.devicePixelRatio || 1;
  const rippleSpeed = 0.16;
  const rippleWidth = 70;

  const GR = 139;
  const GG = 92;
  const GB = 246;
  const BASE_R = 128;
  const BASE_G = 128;
  const BASE_B = 142;

  let width = 0;
  let height = 0;
  let animId = 0;
  let smoothX = -10000;
  let smoothY = -10000;
  let velX = 0;
  let velY = 0;
  let smoothSpeed = 0;
  let lastRawX = -10000;
  let lastRawY = -10000;
  let lastMoveTime = -Infinity;
  const trail = [];

  let ghostActive = false;
  let ghostLaunched = false;
  let ghostStartX = 0;
  let ghostStartY = 0;
  let ghostEndX = 0;
  let ghostEndY = 0;
  let ghostStartTime = 0;
  const ghostLifetime = 1500;

  const resize = () => {
    width = host.clientWidth;
    height = host.clientHeight;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  function handleMove(event) {
    const rect = host.getBoundingClientRect();
    const rawX = event.clientX - rect.left;
    const rawY = event.clientY - rect.top;
    const now = performance.now();

    if (smoothX === -10000) {
      smoothX = rawX;
      smoothY = rawY;
      lastRawX = rawX;
      lastRawY = rawY;
    }

    const dt = now - lastMoveTime;
    if (dt > 0 && dt < 100) {
      velX = (rawX - lastRawX) / dt;
      velY = (rawY - lastRawY) / dt;
    }

    const rawSpeed = Math.sqrt(velX * velX + velY * velY);
    smoothSpeed = rawSpeed > smoothSpeed
      ? smoothSpeed * 0.3 + rawSpeed * 0.7
      : smoothSpeed * 0.92 + rawSpeed * 0.08;

    smoothX = smoothX * 0.15 + rawX * 0.85;
    smoothY = smoothY * 0.15 + rawY * 0.85;

    lastRawX = rawX;
    lastRawY = rawY;
    lastMoveTime = now;

    ghostActive = false;
    ghostLaunched = false;

    trail.push({
      x: smoothX,
      y: smoothY,
      t: now,
      speed: smoothSpeed,
      strength: 1,
    });
  }

  function handleLeave() {
    lastMoveTime = performance.now() - 120;
  }

  host.addEventListener("pointermove", handleMove);
  host.addEventListener("pointerenter", handleMove);
  host.addEventListener("pointerleave", handleLeave);

  function draw() {
    const now = performance.now();
    const timeSinceMove = now - lastMoveTime;

    if (smoothX !== -10000 && timeSinceMove > 60 && !ghostLaunched) {
      const speed = Math.sqrt(velX * velX + velY * velY);
      if (speed > 0.12) {
        ghostActive = true;
        ghostLaunched = true;
        ghostStartTime = now;
        ghostStartX = smoothX;
        ghostStartY = smoothY;
        const driftDist = Math.min(speed * 130, 280);
        ghostEndX = ghostStartX + (velX / speed) * driftDist;
        ghostEndY = ghostStartY + (velY / speed) * driftDist;
      }
    }

    if (ghostActive) {
      const elapsed = now - ghostStartTime;
      const t = elapsed / ghostLifetime;
      if (t >= 1) {
        ghostActive = false;
      } else {
        const eased = 1 - Math.pow(1 - t, 3);
        const gx = ghostStartX + (ghostEndX - ghostStartX) * eased;
        const gy = ghostStartY + (ghostEndY - ghostStartY) * eased;
        const ghostStrength = Math.pow(1 - t, 0.7) * 0.6;
        trail.push({
          x: gx,
          y: gy,
          t: now - 6,
          speed: ghostStrength * 30,
          strength: ghostStrength,
        });
      }
    }

    if (timeSinceMove > 80) {
      smoothSpeed *= 0.93;
    }

    while (trail.length > 0 && now - trail[0].t > TRAIL_MS) {
      trail.shift();
    }
    while (trail.length > 350) {
      trail.shift();
    }

    ctx.clearRect(0, 0, width, height);

    const offsetX = (width % spacing) / 2;
    const offsetY = (height % spacing) / 2;
    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;
    const glowRadiusSq = glowRadius * glowRadius;
    const n = trail.length;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = offsetX + col * spacing;
        const y = offsetY + row * spacing;

        const h1 = dotHash(col, row);
        const h2 = dotHash(col + 997, row + 613);
        const h3 = dotHash(col + 271, row + 1439);

        const sensitivity = 0.55 + h1 * 0.45;
        const timeJitter = (h2 - 0.5) * 80;
        const sizePersonality = 0.85 + h3 * 0.3;

        let maxGlow = 0;

        for (let i = 0; i < n; i += 1) {
          const tp = trail[i];
          const age = now - tp.t;
          const ageNorm = age / TRAIL_MS;
          if (ageNorm >= 1) {
            continue;
          }

          const dx = x - tp.x;
          const dy = y - tp.y;
          const distSq = dx * dx + dy * dy;
          if (distSq >= glowRadiusSq) {
            continue;
          }

          const dist = Math.sqrt(distSq);
          const fadeByAge = Math.pow(1 - ageNorm, 0.55) * tp.strength * sensitivity;
          const proximity = 1 - dist / glowRadius;
          const softGlow = proximity * proximity * fadeByAge * 0.7;

          const jitteredAge = Math.max(0, age + timeJitter);
          const ringRadius = jitteredAge * rippleSpeed;
          const ringDelta = Math.abs(dist - ringRadius);
          let ringGlow = 0;
          if (ringDelta < rippleWidth) {
            const ringProx = 1 - ringDelta / rippleWidth;
            ringGlow = ringProx * ringProx * (3 - 2 * ringProx) * fadeByAge * 0.6;
          }

          const combined = softGlow + ringGlow;
          if (combined > maxGlow) {
            maxGlow = combined;
          }
        }

        maxGlow = Math.min(1, maxGlow);

        const alpha = 0.04 + maxGlow * 0.78;
        const r = Math.round(GR * maxGlow + BASE_R * (1 - maxGlow));
        const g = Math.round(GG * maxGlow + BASE_G * (1 - maxGlow));
        const b = Math.round(GB * maxGlow + BASE_B * (1 - maxGlow));
        const radius = dotRadius * sizePersonality + maxGlow * dotRadius * 0.65;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
      }
    }

    animId = window.requestAnimationFrame(draw);
  }

  animId = window.requestAnimationFrame(draw);

  return {
    destroy() {
      window.cancelAnimationFrame(animId);
      ro.disconnect();
      host.removeEventListener("pointermove", handleMove);
      host.removeEventListener("pointerenter", handleMove);
      host.removeEventListener("pointerleave", handleLeave);
      layer.remove();
      delete host.dataset.effectsDotGrid;
    },
  };
}
