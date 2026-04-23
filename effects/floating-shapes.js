import * as THREE from "../vendor/three.module.js";

const MAGE_PURPLE = new THREE.Color(0x8b5cf6);
const WHITE_DIM = new THREE.Color(0xffffff);
const MAGE_BRIGHT = new THREE.Color(0xa78bfa);

const DISSOLVE_RADIUS = 3.5;
const DISSOLVE_SPEED = 0.035;

function makeLineMaterial(opacity) {
  return new THREE.LineBasicMaterial({
    color: MAGE_PURPLE.clone().lerp(WHITE_DIM, 0.3),
    transparent: true,
    opacity,
  });
}

function makeFillMaterial(opacity) {
  return new THREE.MeshBasicMaterial({
    color: MAGE_PURPLE.clone().lerp(new THREE.Color(0x000000), 0.5),
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
  });
}

function makeShapeGroup(geometry) {
  const group = new THREE.Group();

  const fill = new THREE.Mesh(geometry, makeFillMaterial(0));
  group.add(fill);

  const edges = new THREE.EdgesGeometry(geometry);
  const wire = new THREE.LineSegments(edges, makeLineMaterial(0));
  group.add(wire);

  return group;
}

function randomShape() {
  const r = Math.random();
  if (r < 0.3) return new THREE.BoxGeometry(1, 1, 1);
  if (r < 0.55) return new THREE.OctahedronGeometry(0.65);
  if (r < 0.75) return new THREE.TetrahedronGeometry(0.7);
  if (r < 0.9) return new THREE.IcosahedronGeometry(0.6, 0);
  return new THREE.DodecahedronGeometry(0.55, 0);
}

function geometryByType(type) {
  switch (type) {
    case "box":
      return new THREE.BoxGeometry(1, 1, 1);
    case "octa":
      return new THREE.OctahedronGeometry(0.65);
    case "tetra":
      return new THREE.TetrahedronGeometry(0.7);
    case "icosa":
      return new THREE.IcosahedronGeometry(0.6, 0);
    case "dodeca":
      return new THREE.DodecahedronGeometry(0.55, 0);
    default:
      return randomShape();
  }
}

const AUTHORED_LAYOUT = [
  { type: "box", x: -6.8, y: 2.8, z: -3.3, scale: 1.55, rot: [0.2, 0.5, -0.1] },
  { type: "tetra", x: 1.5, y: 4.4, z: -2.2, scale: 1.1, rot: [0.6, 1.1, 0.4] },
  { type: "box", x: 3.4, y: 5.0, z: -3.5, scale: 1.45, rot: [0.3, 0.1, 0.8] },
  { type: "box", x: 6.2, y: 4.6, z: -3.8, scale: 1.35, rot: [0.4, 0.7, 0.2] },
  { type: "dodeca", x: -0.7, y: 0.6, z: -2.0, scale: 0.86, rot: [0.2, 0.9, 0.3] },
  { type: "icosa", x: 5.1, y: -0.8, z: -2.7, scale: 1.05, rot: [0.7, 0.3, 0.9] },
  { type: "box", x: 0.9, y: -3.6, z: -3.0, scale: 1.25, rot: [0.5, 0.2, 0.2] },
  { type: "dodeca", x: 3.5, y: -2.8, z: -2.4, scale: 0.72, rot: [0.4, 1.0, 0.5] },
  { type: "box", x: 7.0, y: -3.2, z: -2.6, scale: 1.08, rot: [0.9, 0.4, 0.1] },
  { type: "box", x: 7.9, y: -5.2, z: -3.9, scale: 1.9, rot: [0.5, 0.8, 0.25] },
];

export function initFloatingShapes(host, options = {}) {
  if (!host || host.dataset.effectsFloatingShapes === "ready") {
    return null;
  }

  if (
    !options.force &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return null;
  }

  const count = options.shapeCount ?? 10;

  const layer = document.createElement("div");
  layer.className = "ml-effects-layer ml-floating-shapes-layer";
  host.classList.add("ml-effects-host");
  host.insertBefore(layer, host.firstChild);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55,
    host.offsetWidth / host.offsetHeight,
    0.1,
    100,
  );
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(host.offsetWidth, host.offsetHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.className = "ml-floating-shapes-canvas";
  layer.appendChild(renderer.domElement);

  let mouseNDCx = -10;
  let mouseNDCy = -10;
  let mouseActive = false;

  function handleMouseMove(event) {
    const rect = host.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    if (px < 0 || py < 0 || px > rect.width || py > rect.height) {
      mouseActive = false;
      return;
    }
    mouseNDCx = (px / rect.width) * 2 - 1;
    mouseNDCy = -(py / rect.height) * 2 + 1;
    mouseActive = true;
  }

  function handleMouseLeave() {
    mouseActive = false;
  }

  window.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseleave", handleMouseLeave);

  function handleResize() {
    camera.aspect = host.offsetWidth / host.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(host.offsetWidth, host.offsetHeight);
  }

  const ro = new ResizeObserver(handleResize);
  ro.observe(host);

  const ray = new THREE.Vector3();
  function cursorWorldAt(zPlane) {
    ray.set(mouseNDCx, mouseNDCy, 0.5).unproject(camera);
    ray.sub(camera.position).normalize();
    const t = (zPlane - camera.position.z) / ray.z;
    return {
      wx: camera.position.x + ray.x * t,
      wy: camera.position.y + ray.y * t,
    };
  }

  const groups = [];
  const configs = [];
  const layout = AUTHORED_LAYOUT.slice(0, count);

  for (let i = 0; i < layout.length; i += 1) {
    const preset = layout[i];
    const geometry = geometryByType(preset.type);
    const group = makeShapeGroup(geometry);
    const x = preset.x;
    const y = preset.y;
    const z = preset.z;

    group.position.set(x, y, z);
    group.rotation.set(
      preset.rot[0],
      preset.rot[1],
      preset.rot[2],
    );

    const s = preset.scale;
    group.scale.setScalar(s);
    group.userData.baseScale = s;

    scene.add(group);
    groups.push(group);

    configs.push({
      geometry,
      x,
      y,
      z,
      baseRotSpeed: {
        x: (Math.random() - 0.5) * 0.0012,
        y: (Math.random() - 0.5) * 0.002,
        z: (Math.random() - 0.5) * 0.001,
      },
      floatSpeed: 0.1 + Math.random() * 0.12,
      floatAmp: 0.06 + Math.random() * 0.08,
      floatOffset: Math.random() * Math.PI * 2,
      life: Math.random(),
      lifeSpeed: 0.0008 + Math.random() * 0.001,
      fadeIn: true,
      cursorGlow: 0,
    });
  }

  const baseColor = MAGE_PURPLE.clone().lerp(WHITE_DIM, 0.3);
  const clock = new THREE.Clock();
  let elapsed = 0;
  let animId = 0;

  function animate() {
    animId = window.requestAnimationFrame(animate);
    const delta = clock.getDelta();
    elapsed += delta;

    for (let i = 0; i < groups.length; i += 1) {
      const group = groups[i];
      const cfg = configs[i];
      const fillMat = group.children[0].material;
      const wireMat = group.children[1].material;

      if (cfg.fadeIn) {
        cfg.life += cfg.lifeSpeed;
        if (cfg.life >= 1) {
          cfg.life = 1;
          cfg.fadeIn = false;
        }
      } else {
        cfg.life -= cfg.lifeSpeed * 0.7;
        if (cfg.life <= 0) {
          cfg.life = 0;
          cfg.fadeIn = true;
          cfg.cursorGlow = 0;
        }
      }

      let targetGlow = 0;
      if (mouseActive) {
        const { wx, wy } = cursorWorldAt(cfg.z);
        const floatY =
          Math.sin(elapsed * cfg.floatSpeed + cfg.floatOffset) * cfg.floatAmp;
        const floatX =
          Math.cos(elapsed * cfg.floatSpeed * 0.6 + cfg.floatOffset) *
          cfg.floatAmp *
          0.5;
        const shapeX = cfg.x + floatX;
        const shapeY = cfg.y + floatY;

        const dx = shapeX - wx;
        const dy = shapeY - wy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < DISSOLVE_RADIUS) {
          const proximity = 1 - dist / DISSOLVE_RADIUS;
          targetGlow = proximity * proximity;
        }
      }

      cfg.cursorGlow += (targetGlow - cfg.cursorGlow) * DISSOLVE_SPEED;
      if (cfg.cursorGlow < 0.001) cfg.cursorGlow = 0;

      const baseOpacity = Math.sin(cfg.life * Math.PI * 0.5) * 0.55;
      const dissolveFactor = 1 - cfg.cursorGlow;
      wireMat.opacity = baseOpacity * dissolveFactor;
      fillMat.opacity = baseOpacity * dissolveFactor * 0.12;

      const baseScale = group.userData.baseScale;
      group.scale.setScalar(baseScale * (0.6 + 0.4 * dissolveFactor));

      wireMat.color.copy(baseColor).lerp(MAGE_BRIGHT, cfg.cursorGlow * 0.6);
      fillMat.color.copy(MAGE_PURPLE).lerp(MAGE_BRIGHT, cfg.cursorGlow * 0.4);

      const floatY =
        Math.sin(elapsed * cfg.floatSpeed + cfg.floatOffset) * cfg.floatAmp;
      const floatX =
        Math.cos(elapsed * cfg.floatSpeed * 0.6 + cfg.floatOffset) *
        cfg.floatAmp *
        0.5;
      group.position.set(cfg.x + floatX, cfg.y + floatY, cfg.z);

      group.rotation.x += cfg.baseRotSpeed.x;
      group.rotation.y += cfg.baseRotSpeed.y;
      group.rotation.z += cfg.baseRotSpeed.z;
    }

    renderer.render(scene, camera);
  }

  host.dataset.effectsFloatingShapes = "ready";
  animate();

  return {
    destroy() {
      window.cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      groups.forEach((group) => {
        const fill = group.children[0];
        const wire = group.children[1];
        fill.geometry.dispose();
        fill.material.dispose();
        wire.geometry.dispose();
        wire.material.dispose();
      });
      configs.forEach((cfg) => cfg.geometry.dispose());
      renderer.dispose();
      layer.remove();
      delete host.dataset.effectsFloatingShapes;
    },
  };
}
