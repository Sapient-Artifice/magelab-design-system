import { initFloatingShapes } from "./floating-shapes.js";
import { initPointerTracer } from "./pointer-tracer.js";

export { initFloatingShapes, initPointerTracer };

export function initCatalogEffects(root = document) {
  const cleanup = [];

  root.querySelectorAll("[data-ml-floating-shapes]").forEach((node) => {
    const effect = initFloatingShapes(node, {
      shapeCount: Number(node.getAttribute("data-ml-shape-count") || 9),
    });
    if (effect) {
      cleanup.push(effect);
    }
  });

  root.querySelectorAll("[data-ml-pointer-tracer]").forEach((node) => {
    const effect = initPointerTracer(node);
    if (effect) {
      cleanup.push(effect);
    }
  });

  return () => {
    cleanup.forEach((effect) => effect.destroy?.());
  };
}
