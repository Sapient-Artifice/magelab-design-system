export function initPointerTracer(host) {
  if (!host || host.dataset.effectsPointerTracer === "ready") {
    return null;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  host.classList.add("ml-effects-host");

  const layer = document.createElement("div");
  layer.className = "ml-effects-layer ml-pointer-tracer-layer";

  const glow = document.createElement("div");
  glow.className = "ml-pointer-tracer-glow";

  const dot = document.createElement("div");
  dot.className = "ml-pointer-tracer-dot";

  layer.append(glow, dot);
  host.insertBefore(layer, host.firstChild);

  function setPointer(clientX, clientY) {
    const rect = host.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const rx = rect.width > 0 ? x / rect.width : 0.5;
    const ry = rect.height > 0 ? y / rect.height : 0.5;

    host.style.setProperty("--ml-pointer-x", `${x}px`);
    host.style.setProperty("--ml-pointer-y", `${y}px`);
    host.style.setProperty("--ml-pointer-rx", `${rx}`);
    host.style.setProperty("--ml-pointer-ry", `${ry}`);
    host.dataset.effectsActive = "true";
  }

  function handlePointerMove(event) {
    setPointer(event.clientX, event.clientY);
  }

  function handleLeave() {
    host.dataset.effectsActive = "false";
  }

  host.addEventListener("pointermove", handlePointerMove);
  host.addEventListener("pointerenter", handlePointerMove);
  host.addEventListener("pointerleave", handleLeave);
  host.dataset.effectsPointerTracer = "ready";

  return {
    destroy() {
      host.removeEventListener("pointermove", handlePointerMove);
      host.removeEventListener("pointerenter", handlePointerMove);
      host.removeEventListener("pointerleave", handleLeave);
      layer.remove();
      delete host.dataset.effectsPointerTracer;
      delete host.dataset.effectsActive;
    },
  };
}
