/**
 * Shared building blocks for the realistic three.js scenes (backup yard, data hall).
 * Lighting model is the one measured for the Who We Are generator: ACES tone mapping, a tiny painted
 * equirect environment for reflections and baked blob shadows. No shadow maps, no PMREM room scene,
 * standard materials only (those stalled the first load by ~2s on integrated graphics).
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export const GOLD = new THREE.Color("#eaa607");

export const box = (w: number, h: number, d: number, m: THREE.Material) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
export const rbox = (w: number, h: number, d: number, r: number, m: THREE.Material) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 1, r), m);
export const cyl = (rt: number, rb: number, h: number, m: THREE.Material, seg = 24) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
export const at = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number) => {
  o.position.set(x, y, z);
  return o;
};
export const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

/** Canvas → sRGB texture, tracked for disposal. */
export function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, textures: THREE.Texture[]) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  textures.push(t);
  return t;
}

/** Tone mapping + reflections. `lite` (software WebGL) skips the environment map. */
export function setupRealism(renderer: THREE.WebGLRenderer, scene: THREE.Scene, lite: boolean, textures: THREE.Texture[], envIntensity = 1.5) {
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  if (lite) {
    scene.add(new THREE.HemisphereLight(0xffffff, 0x30281a, 1.4));
    return;
  }
  const envT = canvasTex(
    64,
    32,
    (g) => {
      const sky = g.createLinearGradient(0, 0, 0, 32);
      sky.addColorStop(0, "#f2f4f8");
      sky.addColorStop(0.45, "#8d9299");
      sky.addColorStop(0.55, "#34363a");
      sky.addColorStop(1, "#141414");
      g.fillStyle = sky;
      g.fillRect(0, 0, 64, 32);
      g.fillStyle = "#ffffff";
      g.fillRect(4, 2, 26, 8);
      g.fillStyle = "#cfd6e4";
      g.fillRect(38, 5, 12, 4);
      g.fillStyle = "#eaa607";
      g.fillRect(54, 12, 6, 3);
    },
    textures,
  );
  envT.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = envT;
  scene.environmentIntensity = envIntensity;
}

/** Soft baked contact shadow on the ground. */
export function blob(parent: THREE.Object3D, dot: THREE.Texture, w: number, d: number, x: number, y: number, z: number, opacity: number) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: dot, color: 0x000000, transparent: true, opacity, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

export function makeMaterials() {
  return {
    paint: new THREE.MeshStandardMaterial({ color: 0x5b6067, metalness: 0.4, roughness: 0.38 }),
    paintLight: new THREE.MeshStandardMaterial({ color: 0x8a9098, metalness: 0.35, roughness: 0.42 }),
    paintDark: new THREE.MeshStandardMaterial({ color: 0x1c1d20, metalness: 0.4, roughness: 0.55 }),
    black: new THREE.MeshStandardMaterial({ color: 0x08090a, metalness: 0.2, roughness: 0.8 }),
    steel: new THREE.MeshStandardMaterial({ color: 0x9a9ea3, metalness: 1, roughness: 0.32 }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x0b0b0c, metalness: 0, roughness: 0.75 }),
    goldPaint: new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.5, roughness: 0.4 }),
    yellow: new THREE.MeshStandardMaterial({ color: 0xf2c200, metalness: 0.1, roughness: 0.55 }),
    red: new THREE.MeshStandardMaterial({ color: 0xc2161a, metalness: 0.1, roughness: 0.35 }),
  };
}
export type Mats = ReturnType<typeof makeMaterials>;

/** Textures shared by every genset in a scene: radiator fins and the PowerChampions door decal. */
export function makeGensetTextures(textures: THREE.Texture[], font: string) {
  const fin = canvasTex(
    256,
    8,
    (g) => {
      for (let i = 0; i < 256; i++) {
        g.fillStyle = i % 4 < 2 ? "#3a3d40" : "#0c0d0e";
        g.fillRect(i, 0, 1, 8);
      }
    },
    textures,
  );
  fin.wrapS = fin.wrapT = THREE.RepeatWrapping;
  fin.repeat.set(3, 1);
  const logo = canvasTex(
    512,
    256,
    (g) => {
      g.fillStyle = "#eaa607";
      g.beginPath();
      [
        [118, 40],
        [52, 138],
        [96, 138],
        [70, 216],
        [150, 108],
        [104, 108],
      ].forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
      g.closePath();
      g.fill();
      g.fillStyle = "#f4f4f4";
      g.font = `italic 800 54px ${font}`;
      g.fillText("Power", 172, 116);
      g.fillText("Champions", 172, 178, 330);
    },
    textures,
  );
  logo.anisotropy = 8;
  return { fin, logo };
}

export type GensetState = "STANDBY" | "CRANK" | "RUN";

/**
 * Enclosed diesel generator set, radiator at -x, controls and cable junction at the +x end of the
 * front (+z) face. Same construction as the Who We Are hero unit, slightly smaller, no assembly intro.
 */
export function makeGenset(m: Mats, tex: ReturnType<typeof makeGensetTextures>, textures: THREE.Texture[], font: string) {
  const g = new THREE.Group();
  const L = 3.6;
  const W = 1.3;
  const SKID = 0.18;
  const TANK = 0.3;
  const EH = 1.4;
  const baseY = SKID + TANK;
  const roofY = baseY + EH;
  const SH = 0.28;
  const WD = W - 0.04;
  const zFace = WD / 2;

  g.add(at(rbox(L + 0.16, SKID, W, 0.02, m.paintDark), 0, SKID / 2, 0));
  g.add(at(rbox(L, TANK, W - 0.02, 0.02, m.paintDark), 0, SKID + TANK / 2, 0));
  for (const side of [1, -1]) {
    for (const x of [-0.9, 0.9]) g.add(at(box(0.45, 0.1, 0.02, m.black), x, SKID / 2, side * (W / 2 + 0.001)));
    g.add(at(box(L - 0.9, 0.03, 0.006, m.goldPaint), -0.25, SKID + TANK - 0.08, side * (W / 2 - 0.008)));
  }

  // Body + open radiator shroud at -x.
  g.add(at(rbox(L - SH, EH, WD, 0.03, m.paint), SH / 2, baseY + EH / 2, 0));
  const shX = -L / 2 + SH / 2;
  g.add(at(box(SH, 0.12, WD, m.paint), shX, baseY + 0.06, 0));
  g.add(at(box(SH, 0.12, WD, m.paint), shX, roofY - 0.06, 0));
  for (const side of [1, -1]) g.add(at(box(SH, EH, 0.09, m.paint), shX, baseY + EH / 2, side * (WD / 2 - 0.045)));
  const core = new THREE.Mesh(new THREE.PlaneGeometry(WD - 0.18, EH - 0.24), new THREE.MeshStandardMaterial({ map: tex.fin, metalness: 0.6, roughness: 0.5 }));
  core.rotation.y = -Math.PI / 2;
  g.add(at(core, -L / 2 + SH - 0.004, baseY + EH / 2, 0));
  const fan = at(new THREE.Group(), -L / 2 + SH - 0.12, baseY + EH / 2, 0);
  const hub = cyl(0.1, 0.1, 0.09, m.steel);
  hub.rotation.z = Math.PI / 2;
  fan.add(hub);
  for (let b = 0; b < 8; b++) {
    const arm = new THREE.Group();
    arm.rotation.x = (b / 8) * Math.PI * 2;
    const blade = at(box(0.014, 0.4, 0.17, m.paintDark), 0, 0.29, 0);
    blade.rotation.y = 0.55;
    arm.add(blade);
    fan.add(arm);
  }
  g.add(fan);
  const gx = -L / 2 + 0.03;
  for (let i = 0; i < 15; i++) g.add(at(box(0.02, 0.013, WD - 0.18, m.steel), gx, baseY + 0.17 + i * ((EH - 0.34) / 14), 0));
  for (const z of [-0.26, 0.26]) g.add(at(box(0.022, EH - 0.26, 0.018, m.steel), gx + 0.012, baseY + EH / 2, z));

  // Doors on both sides; louvers on the middle one.
  const DW = 0.9;
  const DH = EH - 0.18;
  const doorXs = [1.22, 0.27, -0.68];
  const doorY = baseY + EH / 2;
  const SLATS = 9;
  for (const side of [1, -1]) {
    for (const x of doorXs) {
      g.add(at(rbox(DW, DH, 0.022, 0.009, m.paint), x, doorY, side * (zFace + 0.007)));
      g.add(at(rbox(0.04, 0.18, 0.03, 0.007, m.steel), x - DW / 2 + 0.08, doorY - 0.08, side * (zFace + 0.032)));
      for (const hy of [-0.42, 0.42]) g.add(at(cyl(0.014, 0.014, 0.1, m.steel, 10), x + DW / 2 + 0.01, doorY + hy, side * (zFace + 0.014)));
    }
    const lx = doorXs[1];
    g.add(at(rbox(0.76, 0.76, 0.018, 0.007, m.paintDark), lx, doorY + 0.14, side * (zFace + 0.014)));
    g.add(at(box(0.7, 0.7, 0.01, m.black), lx, doorY + 0.14, side * (zFace + 0.02)));
    const slats = new THREE.InstancedMesh(new THREE.BoxGeometry(0.7, 0.011, 0.065), m.paint, SLATS);
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(side * 0.75, 0, 0));
    for (let s = 0; s < SLATS; s++) {
      m4.compose(new THREE.Vector3(lx, doorY - 0.17 + s * 0.077, side * (zFace + 0.042)), q, new THREE.Vector3(1, 1, 1));
      slats.setMatrixAt(s, m4);
    }
    g.add(slats);
  }

  // Controller window with live readout, status LEDs, e-stop.
  const scrC = document.createElement("canvas");
  scrC.width = 256;
  scrC.height = 128;
  const sg = scrC.getContext("2d")!;
  const scrT = new THREE.CanvasTexture(scrC);
  scrT.colorSpace = THREE.SRGBColorSpace;
  textures.push(scrT);
  let lastKey = "";
  const drawScreen = (state: GensetState, v: number, hz: number, kw: number) => {
    const key = `${state}|${v.toFixed(0)}|${hz.toFixed(1)}|${kw.toFixed(0)}`;
    if (key === lastKey) return;
    lastKey = key;
    sg.fillStyle = "#06140c";
    sg.fillRect(0, 0, 256, 128);
    sg.font = `700 22px ${font}`;
    sg.fillStyle = state === "RUN" ? "#39e07a" : "#eaa607";
    sg.fillText(state === "RUN" ? "● RUNNING" : state === "CRANK" ? "● CRANKING" : "● STANDBY", 12, 30);
    sg.fillStyle = "#cfeeda";
    sg.font = `700 26px ${font}`;
    sg.fillText(`${v.toFixed(0)} V`, 12, 70);
    sg.fillText(`${hz.toFixed(1)} Hz`, 132, 70);
    sg.fillText(`${kw.toFixed(0)} kW`, 12, 108);
    sg.fillStyle = "#39e07a";
    sg.fillRect(132, 92, Math.min(1, kw / 300) * 110, 14);
    sg.strokeStyle = "#2a6e45";
    sg.strokeRect(132, 92, 110, 14);
    scrT.needsUpdate = true;
  };
  drawScreen("STANDBY", 0, 0, 0);
  const wx = doorXs[0];
  const wy = doorY + 0.26;
  const zDoor = zFace + 0.019;
  g.add(at(rbox(0.5, 0.36, 0.018, 0.009, m.black), wx, wy, zDoor));
  g.add(at(new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.18), new THREE.MeshBasicMaterial({ map: scrT, toneMapped: false })), wx - 0.03, wy + 0.03, zDoor + 0.011));
  g.add(
    at(
      new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.3), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.14 })),
      wx,
      wy,
      zDoor + 0.018,
    ),
  );
  const led = new THREE.MeshBasicMaterial({ color: 0xeaa607, toneMapped: false });
  g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.013, 10, 10), led), wx - 0.16, wy - 0.11, zDoor + 0.013));
  const es = at(new THREE.Group(), wx + 0.16, wy - 0.38, zDoor);
  const plate = cyl(0.06, 0.06, 0.008, m.yellow);
  plate.rotation.x = Math.PI / 2;
  const mush = cyl(0.036, 0.026, 0.035, m.red);
  mush.rotation.x = Math.PI / 2;
  mush.position.z = 0.022;
  es.add(plate, mush);
  g.add(es);

  g.add(
    at(new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.36), new THREE.MeshStandardMaterial({ map: tex.logo, transparent: true, roughness: 0.5, metalness: 0.1 })), doorXs[2], doorY + 0.2, zDoor + 0.003),
  );

  // Roof with lifting eyes; cable junction box at the control end.
  g.add(at(rbox(L + 0.05, 0.06, W + 0.03, 0.02, m.paint), 0, roofY + 0.018, 0));
  for (const x of [-L / 2 + 0.28, L / 2 - 0.28])
    for (const z of [-W / 2 + 0.14, W / 2 - 0.14]) g.add(at(new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.018, 8, 20), m.steel), x, roofY + 0.095, z));
  const jx = L / 2 - 0.32;
  g.add(at(rbox(0.38, 0.22, 0.08, 0.012, m.paint), jx, SKID + TANK / 2, W / 2 + 0.03));

  return { g, fan, drawScreen, led, L, W, junction: new THREE.Vector3(jx, SKID + 0.04, W / 2 + 0.08) };
}
export type Genset = ReturnType<typeof makeGenset>;

/** Black rubber cable along a curve, with gold pulses that can be switched on. */
export function makeCable(scene: THREE.Scene, dot: THREE.Texture, m: Mats, pts: THREE.Vector3[], pulses = 3, radius = 0.03) {
  const curve = new THREE.CatmullRomCurve3(pts);
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(24, pts.length * 12), radius, 8), m.rubber));
  const sprites = Array.from({ length: pulses }, (_, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: GOLD, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    s.scale.setScalar(0.3);
    scene.add(s);
    return { s, o: i / pulses };
  });
  return (t: number, power: number, speed = 0.3) => {
    for (const p of sprites) {
      const u = (t * speed + p.o) % 1;
      p.s.position.copy(curve.getPoint(u)).y += 0.05;
      (p.s.material as THREE.SpriteMaterial).opacity = power * Math.sin(u * Math.PI) * 0.95;
    }
  };
}
