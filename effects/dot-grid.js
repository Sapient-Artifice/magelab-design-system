export function initDotGrid(host, options = {}) {
  if (!host || host.dataset.effectsDotGrid === "ready") {
    return null;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

  const spacing = options.spacing ?? 18;
  const dotRadius = options.dotRadius ?? 1.35;
  const glowRadius = options.glowRadius ?? 260;
  const dpr = window.devicePixelRatio || 1;

  let width = 0;
  let height = 0;
  let animId = 0;
  let pointerX = -1000;
  let pointerY = -1000;
  let pointerActive = false;

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
    pointerX = event.clientX - rect.left;
    pointerY = event.clientY - rect.top;
    pointerActive = true;
  }

  function handleLeave() {
    pointerActive = false;
  }

  host.addEventListener("pointermove", handleMove);
  host.addEventListener("pointerenter", handleMove);
  host.addEventListener("pointerleave", handleLeave);

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const offsetX = (width % spacing) / 2;
    const offsetY = (height % spacing) / 2;
    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;
    const glowRadiusSq = glowRadius * glowRadius;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = offsetX + col * spacing;
        const y = offsetY + row * spacing;

        let glow = 0;
        if (pointerActive) {
          const dx = x - pointerX;
          const dy = y - pointerY;
          const distSq = dx * dx + dy * dy;
          if (distSq < glowRadiusSq) {
            const proximity = 1 - Math.sqrt(distSq) / glowRadius;
            glow = proximity * proximity;
          }
        }

        const alpha = 0.09 + glow * 0.6;
        const radius = dotRadius + glow * 0.75;
        const fill = glow > 0
          ? `rgba(139, 92, 246, ${alpha})`
          : "rgba(112, 98, 162, 0.28)";

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = fill;
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
