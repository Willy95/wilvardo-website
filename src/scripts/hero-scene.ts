/**
 * Escena Three.js del hero — orbitas elipticas que "se escriben" solas.
 * Hace eco del isotipo v3 (monograma cursivo sobre una elipse): varias elipses finas y
 * alargadas, entrelazadas en 3D; sobre cada una viaja un arco de luz (como tinta trazando
 * el bucle), con precesion lenta y parallax al cursor. Code-split: se importa al entrar el hero.
 * El color se lee del token de marca y se re-sincroniza al cambiar de tema.
 */

import * as THREE from "three";

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface HeroScene {
  destroy: () => void;
}

interface OrbitConfig {
  rx: number;
  ry: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  speed: number;
}

interface Orbit {
  arcGeom: THREE.BufferGeometry;
  headAttr: THREE.BufferAttribute;
  rx: number;
  ry: number;
  speed: number;
  start: number;
}

const readCssColor = (token: string, fallback: string): string => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return value.length > 0 ? value : fallback;
};

const SEG = 240; // puntos por elipse
const ARC_LEN = 64; // largo del arco de luz que viaja

const CONFIGS: OrbitConfig[] = [
  { rx: 13, ry: 6, rotX: 1.2, rotY: 0, rotZ: 0.15, speed: 0.2 },
  { rx: 11, ry: 7.5, rotX: -0.45, rotY: 0.9, rotZ: -0.1, speed: -0.15 },
  { rx: 14, ry: 5, rotX: 0.25, rotY: 1.45, rotZ: 0.35, speed: 0.12 },
  { rx: 9.5, ry: 8.5, rotX: 0.8, rotY: -0.7, rotZ: 0.5, speed: -0.24 },
];

export const createHeroScene = (canvas: HTMLCanvasElement): HeroScene => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
  camera.position.z = 22;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const group = new THREE.Group();
  scene.add(group);

  const orbits: Orbit[] = [];
  const lineMaterials: THREE.LineBasicMaterial[] = [];
  const pointMaterials: THREE.PointsMaterial[] = [];
  const geometries: THREE.BufferGeometry[] = [];

  CONFIGS.forEach((c) => {
    const sub = new THREE.Object3D();
    sub.rotation.set(c.rotX, c.rotY, c.rotZ);
    group.add(sub);

    // Elipse fantasma (bucle completo, muy tenue).
    const ghostPos = new Float32Array(SEG * 3);
    for (let i = 0; i < SEG; i += 1) {
      const t = (i / SEG) * Math.PI * 2;
      ghostPos[i * 3] = Math.cos(t) * c.rx;
      ghostPos[i * 3 + 1] = Math.sin(t) * c.ry;
      ghostPos[i * 3 + 2] = 0;
    }
    const ghostGeom = new THREE.BufferGeometry();
    ghostGeom.setAttribute("position", new THREE.BufferAttribute(ghostPos, 3));
    const ghostMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.08 });
    ghostMat.userData["base"] = 0.08;
    sub.add(new THREE.LineLoop(ghostGeom, ghostMat));

    // Arco de luz que viaja: dos bucles concatenados + drawRange (sin costura).
    const arcPos = new Float32Array(SEG * 2 * 3);
    for (let i = 0; i < SEG * 2; i += 1) {
      const t = ((i % SEG) / SEG) * Math.PI * 2;
      arcPos[i * 3] = Math.cos(t) * c.rx;
      arcPos[i * 3 + 1] = Math.sin(t) * c.ry;
      arcPos[i * 3 + 2] = 0;
    }
    const arcGeom = new THREE.BufferGeometry();
    arcGeom.setAttribute("position", new THREE.BufferAttribute(arcPos, 3));
    arcGeom.setDrawRange(0, ARC_LEN);
    const arcMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.26 });
    arcMat.userData["base"] = 0.26;
    sub.add(new THREE.Line(arcGeom, arcMat));

    // Cabeza brillante (la "pluma").
    const headPos = new Float32Array(3);
    const headGeom = new THREE.BufferGeometry();
    const headAttr = new THREE.BufferAttribute(headPos, 3);
    headGeom.setAttribute("position", headAttr);
    const headMat = new THREE.PointsMaterial({
      size: 0.3,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      depthWrite: false,
    });
    headMat.userData["base"] = 0.55;
    sub.add(new THREE.Points(headGeom, headMat));

    lineMaterials.push(ghostMat, arcMat);
    pointMaterials.push(headMat);
    geometries.push(ghostGeom, arcGeom, headGeom);
    orbits.push({ arcGeom, headAttr, rx: c.rx, ry: c.ry, speed: c.speed, start: Math.random() * SEG });
  });

  // ---- Color por tema ----
  const applyColor = (): void => {
    const color = new THREE.Color(readCssColor("--color-brand-primary", "#4FE3C1"));
    const isDark = (document.documentElement.getAttribute("data-theme") ?? "dark") !== "light";
    const k = isDark ? 1 : 1.4;
    lineMaterials.forEach((m) => {
      m.color.copy(color);
      const base = typeof m.userData["base"] === "number" ? m.userData["base"] : 0.2;
      m.opacity = base * k;
    });
    pointMaterials.forEach((m) => {
      m.color.copy(color);
      const base = typeof m.userData["base"] === "number" ? m.userData["base"] : 0.5;
      m.opacity = base * k;
    });
  };
  applyColor();
  const themeObserver = new MutationObserver(applyColor);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // ---- Resize ----
  const resize = (): void => {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  // ---- Cursor (solo parallax: inclina, no deforma) ----
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointerMove = (event: PointerEvent): void => {
    mouse.tx = (event.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (event.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  const advance = (): void => {
    orbits.forEach((o) => {
      o.start = (o.start + o.speed + SEG) % SEG;
      o.arcGeom.setDrawRange(Math.floor(o.start), ARC_LEN);
      const headT = (((o.start + ARC_LEN) % SEG) / SEG) * Math.PI * 2;
      const arr = o.headAttr.array as Float32Array;
      arr[0] = Math.cos(headT) * o.rx;
      arr[1] = Math.sin(headT) * o.ry;
      arr[2] = 0;
      o.headAttr.needsUpdate = true;
    });
  };

  let frameId = 0;
  const clock = new THREE.Clock();
  let elapsed = 0;

  const animate = (): void => {
    elapsed += clock.getDelta();
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    advance();
    group.rotation.y = elapsed * 0.03 + mouse.x * 0.25;
    group.rotation.x = -0.1 + mouse.y * 0.15;
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
  };

  if (REDUCED_MOTION) {
    advance();
    group.rotation.x = -0.1;
    renderer.render(scene, camera);
  } else {
    frameId = requestAnimationFrame(animate);
  }

  return {
    destroy: (): void => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
      geometries.forEach((g) => g.dispose());
      lineMaterials.forEach((m) => m.dispose());
      pointMaterials.forEach((m) => m.dispose());
      renderer.dispose();
    },
  };
};
