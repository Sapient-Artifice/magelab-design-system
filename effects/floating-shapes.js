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
  const spread = { x: 7, y: 4 };

  for (let i = 0; i < count; i += 1) {
    const geometry = randomShape();
    const group = makeShapeGroup(geometry);

    const x = (Math.random() - 0.5) * spread.x * 2;
    const y = (Math.random() - 0.5) * spread.y * 2;
    const z = -1 + Math.random() * -3;

    group.position.set(x, y, z);
    group.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    );

    const s = 0.5 + Math.random() * 1.1;
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
        x: (Math.random() - 0.5) * 0.0015,
        y: (Math.random() - 0.5) * 0.0025,
        z: (Math.random() - 0.5) * 0.0012,
      },
      floatSpeed: 0.12 + Math.random() * 0.18,
      floatAmp: 0.08 + Math.random() * 0.12,
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
          cfg.x = (Math.random() - 0.5) * spread.x * 2;
          cfg.y = (Math.random() - 0.5) * spread.y * 2;
          cfg.z = -1 + Math.random() * -3;
          const s = 0.5 + Math.random() * 1.1;
          group.scale.setScalar(s);
          group.userData.baseScale = s;
          cfg.baseRotSpeed = {
            x: (Math.random() - 0.5) * 0.0015,
            y: (Math.random() - 0.5) * 0.0025,
            z: (Math.random() - 0.5) * 0.0012,
          };
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
