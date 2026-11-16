/**
 * three.js engine for <PowerScene>. Imported dynamically, so three.js never lands in the page bundle.
 * Scenes in brand colours on a transparent canvas:
 * - "backup": Backup Power Centers; a realistic backup power yard looping an outage (backup-yard-scene.ts).
 * - "racks": Data Center Solutions; a realistic data hall aisle (data-hall-scene.ts).
 * - "city":  homepage hero; a night city that loops a grid outage where protected facilities stay lit (city-scene.ts).
 * - "map":   homepage/locations; the US dot map in 3D, framed on the Southeast (network-map-scene.ts).
 * - "generator": Who We Are; a procedurally modelled diesel genset that assembles, starts up and runs.
 */
import * as THREE from "three";
import { buildBackupYard } from "./backup-yard-scene";
import { buildCity } from "./city-scene";
import { buildDataHall } from "./data-hall-scene";
import { buildGenerator } from "./generator-scene";
import { buildNetworkMap } from "./network-map-scene";
import type { SceneVariant } from "./power-scene";


/** Soft round sprite (canvas) so points render as glowing dots instead of squares. */
function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.85)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

type Built = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update: (t: number, dt: number, px: number, py: number) => void;
  dispose?: () => void;
};

export function mountScene(host: HTMLElement, variant: SceneVariant, onReady: () => void) {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: dpr < 1.5, powerPreference: "high-performance" });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  host.appendChild(canvas);

  // Software WebGL (no GPU: some VMs, remote desktops, headless browsers) renders every frame on the
  // CPU. There the scene shows one finished still frame, like prefers-reduced-motion, with lite materials.
  const gl = renderer.getContext();
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
  const software = /swiftshader|llvmpipe|software|basic render/i.test(gpu);

  const dot = dotTexture();
  // Start-up timings, readable in DevTools: performance.getEntriesByType("measure").
  const t0 = performance.now();
  const built: Built & { stillTime?: number; introStart?: number } =
    variant === "backup"
      ? buildBackupYard(dot, renderer, software)
      : variant === "racks"
        ? buildDataHall(dot, renderer, software)
        : variant === "city"
          ? buildCity(dot)
          : variant === "generator"
            ? buildGenerator(dot, renderer, software)
            : buildNetworkMap(dot, host);
  const { scene, camera, update } = built;
  performance.measure(`pc3d:${variant}:build`, { start: t0, end: performance.now() });

  const resize = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  // Pointer parallax (normalised -1..1), eased inside update().
  let px = 0;
  let py = 0;
  const onPointer = (e: PointerEvent) => {
    px = (e.clientX / window.innerWidth) * 2 - 1;
    py = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const still = software || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let visible = true;
  let raf = 0;
  let last = performance.now();
  let t = 0;
  let cost = 0;
  let frames = 0;
  let degraded = false;

  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    t += dt;
    const c0 = performance.now();
    update(t, dt, px, py);
    renderer.render(scene, camera);
    // Adaptive quality: if frames are slow on this device, drop to 1x resolution and no shadows (once).
    cost += (performance.now() - c0 - cost) * 0.1;
    if (!degraded && ++frames > 40 && cost > 18) {
      degraded = true;
      renderer.setPixelRatio(1);
      resize();
      if (renderer.shadowMap.enabled) {
        renderer.shadowMap.enabled = false;
        scene.traverse((o) => {
          const m = (o as THREE.Mesh).material as THREE.Material | undefined;
          if (m && !Array.isArray(m)) m.needsUpdate = true;
        });
      }
    }
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const kick = () => {
    if (!raf && visible && !document.hidden && !still) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    kick();
  });
  io.observe(host);
  const onVis = () => kick();
  document.addEventListener("visibilitychange", onVis);

  // First frame. Reduced motion gets the scene's finished pose; otherwise scenes with an intro
  // (the generator assembling) start at its beginning, the rest a little way in.
  let disposed = false;
  const begin = () => {
    if (disposed) return;
    if (still) {
      // Let time-integrated values (e.g. the generator's fan speed) settle before the single frame.
      for (let i = 0; i < 60; i++) update((built.stillTime ?? 1.5) - (60 - i) * 0.05, 0.05, 0, 0);
    } else {
      update(built.introStart ?? 1.5, 0.016, 0, 0);
    }
    const t1 = performance.now();
    t = built.introStart ?? 0;
    // Debug: ?t3d=9 starts the scene clock at 9s (to inspect a stage of a timed sequence).
    const dbgT = Number(new URLSearchParams(location.search).get("t3d"));
    if (dbgT > 0) t = dbgT;
    renderer.render(scene, camera);
    performance.measure(`pc3d:${variant}:first-render`, { start: t1, end: performance.now() });
    onReady();
    kick();
  };
  // Compile shaders asynchronously (parallel compile where the GPU driver supports it), so the
  // lit materials don't block the main thread in one long task on first render.
  const t2 = performance.now();
  const compiled = renderer.compileAsync(scene, camera);
  performance.measure(`pc3d:${variant}:compile-call`, { start: t2, end: performance.now() });
  compiled.then(begin, begin);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVis);
    scene.traverse((o) => {
      const obj = o as THREE.Mesh;
      obj.geometry?.dispose();
      const mat = obj.material as THREE.Material | THREE.Material[] | undefined;
      (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((mm) => mm.dispose());
    });
    built.dispose?.();
    dot.dispose();
    renderer.dispose();
    canvas.remove();
  };
}
