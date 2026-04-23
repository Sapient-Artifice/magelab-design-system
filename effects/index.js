import { initDotGrid } from "./dot-grid.js";
import { initFloatingShapes } from "./floating-shapes.js";
import { initPointerTracer } from "./pointer-tracer.js";

export { initDotGrid, initFloatingShapes, initPointerTracer };

export function initCatalogEffects(root = document) {
  const cleanup = [];

  root.querySelectorAll("[data-ml-effects-badge]").forEach((node) => {
    node.dataset.effectsLoaded = "true";
  });

  root.querySelectorAll("[data-ml-dot-grid]").forEach((node) => {
    node.dataset.effectsLoaded = "true";
    const effect = initDotGrid(node, {
      spacing: Number(node.getAttribute("data-ml-dot-spacing") || 18),
      dotRadius: Number(node.getAttribute("data-ml-dot-radius") || 1.35),
    });
    if (effect) {
      cleanup.push(effect);
    }
  });

  root.querySelectorAll("[data-ml-floating-shapes]").forEach((node) => {
    node.dataset.effectsLoaded = "true";
    const effect = initFloatingShapes(node, {
      shapeCount: Number(node.getAttribute("data-ml-shape-count") || 9),
    });
    if (effect) {
      cleanup.push(effect);
    }
  });

  root.querySelectorAll("[data-ml-pointer-tracer]").forEach((node) => {
    node.dataset.effectsLoaded = "true";
    const effect = initPointerTracer(node);
    if (effect) {
      cleanup.push(effect);
    }
  });

  return () => {
    cleanup.forEach((effect) => effect.destroy?.());
  };
}
