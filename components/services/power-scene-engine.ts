/**
 * three.js engine for <PowerScene>. Imported dynamically, so three.js never lands in the page bundle.
 * Two scenes in brand colours on a transparent canvas (the hero behind it is always ink):
 * - "core":  a glowing generator core inside rotating gyroscope rings, with a drifting particle field.
 * - "racks": rows of data-centre racks with blinking status LEDs and data pulses running along the floor.
 */
import * as THREE from "three";
import type { SceneVariant } from "./power-scene";

const GOLD = new THREE.Color("#eaa607");
const ORANGE = new THREE.Color("#f57500");
const INK = 0x101010;

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

type Built = { scene: THREE.Scene; camera: THREE.PerspectiveCamera; update: (t: number, dt: number, px: number, py: number) => void };

function buildCore(dot: THREE.Texture): Built {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  const rig = new THREE.Group();
  scene.add(rig);

  // Core: wireframe icosahedron around a pulsing inner sphere and a soft glow sprite.
  const ico = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.55, 1)),
    new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  const inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.85, 2),
    new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: dot, color: GOLD, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  glow.scale.setScalar(6.5);
  rig.add(glow, inner, ico);

  // Gyroscope rings, each carrying a bright node, like an alternator spinning up.
  const rings: Array<{ spinner: THREE.Object3D; speed: number }> = [];
  const ringSpec: Array<[number, number, number, number]> = [
    // radius, tiltX, tiltZ, speed
    [2.35, 1.2, 0.2, 0.55],
    [2.95, 0.35, -0.6, -0.38],
    [3.55, -0.9, 0.9, 0.24],
  ];
  for (const [r, tx, tz, speed] of ringSpec) {
    const pivot = new THREE.Group();
    pivot.rotation.set(tx, 0, tz);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.012, 6, 200),
      new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    const node = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: dot, color: ORANGE, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    node.scale.setScalar(0.55);
    node.position.set(r, 0, 0);
    ring.add(node);
    pivot.add(ring);
    rig.add(pivot);
    rings.push({ spinner: ring, speed }); // spinning in its own plane carries the node round
  }

  // Particle shell.
  const N = 1400;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 3.8 + Math.random() * 5;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6;
    pos[i * 3 + 2] = r * Math.cos(ph);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ map: dot, color: GOLD, size: 0.07, sizeAttenuation: true, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  scene.add(particles);

  return {
    scene,
    camera,
    update(t, dt, px, py) {
      ico.rotation.y += dt * 0.18;
      ico.rotation.x += dt * 0.07;
      const pulse = 1 + Math.sin(t * 2.2) * 0.07;
      inner.scale.setScalar(pulse);
      (glow.material as THREE.SpriteMaterial).opacity = 0.45 + Math.sin(t * 2.2) * 0.12;
      for (const r of rings) r.spinner.rotation.z += dt * r.speed;
      particles.rotation.y += dt * 0.025;
      // Mouse parallax: the whole rig leans towards the pointer.
      rig.rotation.y += (px * 0.35 - rig.rotation.y) * 0.05;
      rig.rotation.x += (py * 0.25 - rig.rotation.x) * 0.05;
    },
  };
}

function buildRacks(dot: THREE.Texture): Built {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(INK, 9, 24);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);

  const ROWS = 5;
  const COLS = 10;
  const W = 0.9;
  const H = 2.2;
  const D = 0.9;
  const GAP_X = 1.05;
  const GAP_Z = 2.4;
  const x0 = -((COLS - 1) * GAP_X) / 2;
  const z0 = -((ROWS - 1) * GAP_Z) / 2;

  const floor = new THREE.GridHelper(34, 34, GOLD, GOLD);
  const fm = floor.material as THREE.Material;
  fm.transparent = true;
  fm.opacity = 0.12;
  scene.add(floor);

  // Rack bodies (one instanced mesh) + all rack edges merged into one LineSegments.
  const bodies = new THREE.InstancedMesh(new THREE.BoxGeometry(W, H, D), new THREE.MeshBasicMaterial({ color: 0x161616 }), ROWS * COLS);
  const edgeSrc = new THREE.EdgesGeometry(new THREE.BoxGeometry(W, H, D)).getAttribute("position").array as Float32Array;
  const edges = new Float32Array(edgeSrc.length * ROWS * COLS);
  const LEDS_PER = 7;
  const ledPos = new Float32Array(ROWS * COLS * LEDS_PER * 3);
  const ledCol = new Float32Array(ROWS * COLS * LEDS_PER * 3);
  const m = new THREE.Matrix4();
  let k = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = x0 + c * GAP_X;
      const z = z0 + r * GAP_Z;
      m.makeTranslation(x, H / 2, z);
      bodies.setMatrixAt(k, m);
      for (let i = 0; i < edgeSrc.length; i += 3) {
        const o = k * edgeSrc.length + i;
        edges[o] = edgeSrc[i] + x;
        edges[o + 1] = edgeSrc[i + 1] + H / 2;
        edges[o + 2] = edgeSrc[i + 2] + z;
      }
      for (let l = 0; l < LEDS_PER; l++) {
        const o = (k * LEDS_PER + l) * 3;
        ledPos[o] = x - W / 2 + 0.16 + (l % 2) * 0.12;
        ledPos[o + 1] = 0.35 + l * 0.26;
        ledPos[o + 2] = z + D / 2 + 0.01;
      }
      k++;
    }
  }
  scene.add(bodies);
  const eGeo = new THREE.BufferGeometry();
  eGeo.setAttribute("position", new THREE.BufferAttribute(edges, 3));
  scene.add(new THREE.LineSegments(eGeo, new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.32 })));

  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute("position", new THREE.BufferAttribute(ledPos, 3));
  const colAttr = new THREE.BufferAttribute(ledCol, 3);
  lGeo.setAttribute("color", colAttr);
  scene.add(
    new THREE.Points(
      lGeo,
      new THREE.PointsMaterial({ map: dot, size: 0.16, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    ),
  );
  const dim = new THREE.Color("#3a2a05");
  const setLed = (i: number, on: boolean) => {
    const col = on ? (Math.random() < 0.85 ? GOLD : ORANGE) : dim;
    ledCol[i * 3] = col.r;
    ledCol[i * 3 + 1] = col.g;
    ledCol[i * 3 + 2] = col.b;
  };
  for (let i = 0; i < ROWS * COLS * LEDS_PER; i++) setLed(i, Math.random() < 0.6);

  // Data pulses travelling along the aisles.
  const P = 46;
  const pulsePos = new Float32Array(P * 3);
  const pulseSpeed = new Float32Array(P);
  const span = (COLS + 4) * GAP_X;
  for (let i = 0; i < P; i++) {
    const lane = Math.floor(Math.random() * (ROWS - 1));
    pulsePos[i * 3] = (Math.random() - 0.5) * span;
    pulsePos[i * 3 + 1] = 0.04;
    pulsePos[i * 3 + 2] = z0 + lane * GAP_Z + GAP_Z / 2 + (Math.random() - 0.5) * 0.6;
    pulseSpeed[i] = (1.2 + Math.random() * 2.4) * (Math.random() < 0.5 ? 1 : -1);
  }
  const pGeo = new THREE.BufferGeometry();
  const pAttr = new THREE.BufferAttribute(pulsePos, 3);
  pGeo.setAttribute("position", pAttr);
  scene.add(
    new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ map: dot, color: GOLD, size: 0.32, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }),
    ),
  );

  let blinkClock = 0;
  return {
    scene,
    camera,
    update(t, dt, px, py) {
      blinkClock += dt;
      if (blinkClock > 0.09) {
        blinkClock = 0;
        for (let n = 0; n < 18; n++) setLed(Math.floor(Math.random() * ROWS * COLS * LEDS_PER), Math.random() < 0.65);
        colAttr.needsUpdate = true;
      }
      for (let i = 0; i < P; i++) {
        let x = pulsePos[i * 3] + pulseSpeed[i] * dt;
        if (x > span / 2) x = -span / 2;
        if (x < -span / 2) x = span / 2;
        pulsePos[i * 3] = x;
      }
      pAttr.needsUpdate = true;
      // Slow drifting orbit plus pointer parallax.
      const a = Math.sin(t * 0.08) * 0.35 + px * 0.25;
      const radius = 13;
      camera.position.set(Math.sin(a) * radius, 4.2 + py * -1.2, Math.cos(a) * radius);
      camera.lookAt(0, 1, 0);
    },
  };
}

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

  const dot = dotTexture();
  const { scene, camera, update } = variant === "core" ? buildCore(dot) : buildRacks(dot);

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

  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let visible = true;
  let raf = 0;
  let last = performance.now();
  let t = 0;

  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    t += dt;
    update(t, dt, px, py);
    renderer.render(scene, camera);
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

  // First frame: settle the scene a little so the still (reduced-motion) frame isn't the t=0 pose.
  update(1.5, 0.016, 0, 0);
  renderer.render(scene, camera);
  onReady();
  kick();

  return () => {
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
    dot.dispose();
    renderer.dispose();
    canvas.remove();
  };
}
