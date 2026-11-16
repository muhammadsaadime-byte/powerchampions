/**
 * three.js engine for <PowerScene>. Imported dynamically, so three.js never lands in the page bundle.
 * Scenes in brand colours on a transparent canvas:
 * - "core":  a glowing generator core inside rotating gyroscope rings, with a drifting particle field.
 * - "racks": rows of data-centre racks with blinking status LEDs and data pulses running along the floor.
 * - "field": homepage hero; a holographic energy field rippling out from three linked network beacons.
 * - "map":   homepage/locations; the US dot map in 3D with beacons on the three depots and flowing arcs.
 * - "generator": Who We Are; a procedurally modelled diesel genset that assembles, starts up and runs.
 *            This one sits in a theme-aware section, so it follows light/dark.
 */
import * as THREE from "three";
import { LAND, isSoutheast } from "@/components/home/us-dot-map";
import { LOCATIONS } from "@/lib/site";
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

type Built = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update: (t: number, dt: number, px: number, py: number) => void;
  dispose?: () => void;
};

/**
 * Industrial diesel generator set, modelled procedurally (no model download): steel skid, fuel-tank base,
 * weatherproof enclosure with gold-edged panels and door seams, intake louvers, radiator grille with the
 * cooling fan spinning behind it, roof muffler and exhaust stack, control panel and lifting eyes.
 * Sequence: parts assemble (0–2.4s) → start-up (fan spools, panel lights, exhaust) → running (idle
 * vibration, heat haze, power pulses travelling out along the output cables and across the floor ring).
 */
function buildGenerator(dot: THREE.Texture): Built & { stillTime: number; introStart: number } {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(INK, 14, 34);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);

  // Lighting: cool key, warm gold rim and an orange kicker from the radiator side.
  scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1206, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.9);
  key.position.set(-6, 8, 7);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdfe6ff, 0.55);
  fill.position.set(7, 3, 6);
  scene.add(fill);
  const rim = new THREE.PointLight(GOLD, 14, 18, 1.6);
  rim.position.set(-3, 5.5, -6);
  scene.add(rim);
  const kick = new THREE.PointLight(ORANGE, 18, 10, 1.6);
  kick.position.set(4.5, 1.4, 2.5);
  scene.add(kick);

  const steel = new THREE.MeshStandardMaterial({ color: 0x1d1d1d, metalness: 0.7, roughness: 0.42 });
  const darkSteel = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.6, roughness: 0.55 });
  const paint = new THREE.MeshStandardMaterial({ color: 0x242424, metalness: 0.45, roughness: 0.38 });
  const goldMetal = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.85, roughness: 0.28, emissive: GOLD, emissiveIntensity: 0.12 });
  const edgeMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.55 });
  const withEdges = (mesh: THREE.Mesh, opacity = 0.55) => {
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 20), opacity === 0.55 ? edgeMat : new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity }));
    mesh.add(e);
    return mesh;
  };
  const box = (w: number, h: number, d: number, mat: THREE.Material) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);

  const L = 4.4; // length (x)
  const W = 1.55; // width (z)
  const gen = new THREE.Group();
  scene.add(gen);

  // Each assembly stage is a group that drops into place.
  const stage = (delay: number) => {
    const g = new THREE.Group();
    gen.add(g);
    return { g, delay };
  };
  const skid = stage(0);
  const tank = stage(0.35);
  const body = stage(0.7);
  const roof = stage(1.25);
  const ends = stage(1.0);
  const stages = [skid, tank, body, ends, roof];

  // Skid: two rails + cross members.
  for (const z of [-W / 2 + 0.08, W / 2 - 0.08]) {
    const rail = withEdges(box(L + 0.3, 0.18, 0.16, darkSteel), 0.35);
    rail.position.set(0, 0.09, z);
    skid.g.add(rail);
  }
  for (const x of [-1.8, -0.6, 0.6, 1.8]) {
    const cross = box(0.12, 0.1, W - 0.1, darkSteel);
    cross.position.set(x, 0.12, 0);
    skid.g.add(cross);
  }
  // Fuel-tank base with a gold brand band.
  const tankMesh = withEdges(box(L, 0.42, W, steel));
  tankMesh.position.y = 0.39;
  tank.g.add(tankMesh);
  for (const z of [W / 2 + 0.002, -W / 2 - 0.002]) {
    const band = box(L - 0.4, 0.05, 0.004, goldMetal);
    band.position.set(0, 0.42, z);
    tank.g.add(band);
  }

  // Enclosure.
  const EH = 1.55;
  const enclosure = withEdges(box(L - 0.1, EH, W - 0.06, paint));
  enclosure.position.y = 0.6 + EH / 2;
  body.g.add(enclosure);
  // Door seams and hinges on both long sides.
  const seamPts: number[] = [];
  for (const side of [1, -1])
    for (const x of [-1.25, -0.15, 0.95]) {
      const z = side * (W / 2 - 0.03 + 0.004);
      seamPts.push(x, 0.68, z, x, 0.6 + EH - 0.08, z);
    }
  const seamGeo = new THREE.BufferGeometry();
  seamGeo.setAttribute("position", new THREE.Float32BufferAttribute(seamPts, 3));
  body.g.add(new THREE.LineSegments(seamGeo, new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.3 })));
  // Intake louvers: instanced slats on both sides.
  const SLATS = 9;
  const louver = new THREE.InstancedMesh(new THREE.BoxGeometry(0.95, 0.035, 0.07), darkSteel, SLATS * 4);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.55, 0, 0));
  let li = 0;
  for (const side of [1, -1])
    for (const cx of [-0.7, 0.4]) {
      for (let s = 0; s < SLATS; s++) {
        m4.compose(new THREE.Vector3(cx, 0.85 + s * 0.12, side * (W / 2 - 0.0)), q, new THREE.Vector3(1, 1, 1));
        louver.setMatrixAt(li++, m4);
      }
    }
  body.g.add(louver);

  // Radiator end (+x): grille slats with the fan spinning behind them, and an orange glow.
  const grille = new THREE.Group();
  grille.position.set(L / 2 - 0.04, 0.6 + EH / 2, 0);
  for (let s = 0; s < 11; s++) {
    const slat = box(0.05, 0.022, W - 0.3, darkSteel);
    slat.position.y = -0.6 + s * 0.12;
    grille.add(slat);
  }
  const frame = withEdges(box(0.06, EH - 0.2, W - 0.22, new THREE.MeshBasicMaterial({ color: 0x050505, transparent: true, opacity: 0.0 })));
  grille.add(frame);
  const fan = new THREE.Group();
  fan.position.x = -0.22;
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.12, 20), goldMetal);
  hub.rotation.z = Math.PI / 2;
  fan.add(hub);
  for (let b = 0; b < 7; b++) {
    const blade = box(0.02, 0.56, 0.16, goldMetal);
    blade.position.y = 0.32;
    blade.rotation.y = 0.5;
    const arm = new THREE.Group();
    arm.rotation.x = (b / 7) * Math.PI * 2;
    arm.add(blade);
    fan.add(arm);
  }
  grille.add(fan);
  const radGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: ORANGE, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  radGlow.scale.setScalar(2.6);
  radGlow.position.x = 0.15;
  grille.add(radGlow);
  ends.g.add(grille);

  // Control end (-x): panel door, glowing screen and status LEDs.
  const panel = withEdges(box(0.05, 0.7, 0.9, darkSteel), 0.6);
  panel.position.set(-L / 2 + 0.03, 1.45, 0);
  ends.g.add(panel);
  const screenMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.0 });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.24), screenMat);
  screen.rotation.y = -Math.PI / 2;
  screen.position.set(-L / 2 - 0.001, 1.58, 0.12);
  ends.g.add(screen);
  const leds = [0, 1, 2, 3].map((i) => {
    const mat = new THREE.MeshBasicMaterial({ color: i === 3 ? 0x2bd16f : GOLD });
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), mat);
    led.position.set(-L / 2 - 0.01, 1.3, -0.3 + i * 0.12);
    ends.g.add(led);
    return mat;
  });

  // Roof: muffler on saddles, exhaust stack with rain cap, lifting eyes at the corners.
  const roofY = 0.6 + EH;
  const muffler = withEdges(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.5, 28), steel), 0.4);
  muffler.rotation.z = Math.PI / 2;
  muffler.position.set(-0.4, roofY + 0.32, -0.15);
  roof.g.add(muffler);
  for (const x of [-0.95, 0.15]) {
    const saddle = box(0.1, 0.16, 0.5, darkSteel);
    saddle.position.set(x, roofY + 0.08, -0.15);
    roof.g.add(saddle);
  }
  const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.75, 20), steel);
  stack.position.set(0.45, roofY + 0.6, -0.15);
  roof.g.add(stack);
  const capMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.03, 20), goldMetal);
  capMesh.position.set(0.45, roofY + 1.0, -0.15);
  roof.g.add(capMesh);
  for (const x of [-L / 2 + 0.25, L / 2 - 0.25])
    for (const z of [-W / 2 + 0.2, W / 2 - 0.2]) {
      const eye = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.022, 8, 20), goldMetal);
      eye.position.set(x, roofY + 0.08, z);
      roof.g.add(eye);
    }

  // Exhaust heat: soft sprites rising from the stack.
  const PUFFS = 16;
  const puffs = Array.from({ length: PUFFS }, (_, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: 0x9c8a70, transparent: true, opacity: 0, depthWrite: false }));
    scene.add(s);
    return { s, seed: i / PUFFS };
  });
  const stackTop = new THREE.Vector3(0.45, roofY + 1.03, -0.15);

  // Floor: polar platform, expanding power rings, and output cables with travelling pulses.
  const floor = new THREE.PolarGridHelper(5.2, 16, 6, 96, GOLD, GOLD);
  (floor.material as THREE.Material).transparent = true;
  (floor.material as THREE.Material).opacity = 0.14;
  scene.add(floor);
  const rings = [0, 1, 2].map((i) => {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.98, 1, 96),
      new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);
    return { ring, phase: i / 3 };
  });
  const cables = [
    // Output cables leave from the viewer-facing side and run out across the floor to the "grid".
    [new THREE.Vector3(-1.4, 0.3, W / 2), new THREE.Vector3(-2.6, 0.02, 3.2), new THREE.Vector3(-6.2, 0.02, 4.6)],
    [new THREE.Vector3(-0.6, 0.3, W / 2), new THREE.Vector3(-0.4, 0.02, 3.6), new THREE.Vector3(0.6, 0.02, 7)],
    [new THREE.Vector3(-L / 2, 0.3, 0), new THREE.Vector3(-3.8, 0.02, -0.4), new THREE.Vector3(-7, 0.02, -2.2)],
  ].map(([a, b, c]) => {
    const curve = new THREE.QuadraticBezierCurve3(a, b, c);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)),
      new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    scene.add(line);
    const pulses = [0, 0.33, 0.66].map((o) => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: GOLD, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
      s.scale.setScalar(0.38);
      scene.add(s);
      return { s, o };
    });
    return { curve, line, pulses };
  });

  const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
  let fanSpeed = 0;
  return {
    scene,
    camera,
    stillTime: 9,
    introStart: 0,
    update(t, dt, px, py) {
      // 1. Assembly: each stage drops 2.2 units and fades in over 0.7s after its delay.
      for (const st of stages) {
        const k = ease((t - st.delay) / 0.7);
        st.g.position.y = (1 - k) * 2.2;
        st.g.visible = k > 0.001;
      }
      // 2. Start-up from t=2.4, fully running by ~4s.
      const run = ease((t - 2.4) / 1.6);
      fanSpeed += ((run * 22) - fanSpeed) * Math.min(1, dt * 2);
      fan.rotation.x += fanSpeed * dt;
      (radGlow.material as THREE.SpriteMaterial).opacity = run * (0.55 + Math.sin(t * 6) * 0.06);
      screenMat.opacity = run * (0.75 + Math.sin(t * 2.5) * 0.08);
      leds.forEach((m, i) => m.color.set(run > 0.2 && (i === 3 || Math.sin(t * 3 + i * 1.7) > -0.2) ? (i === 3 ? 0x2bd16f : GOLD) : 0x222222));
      // Idle vibration once running (tiny, high frequency).
      gen.position.y = run * Math.sin(t * 60) * 0.006;
      gen.position.x = run * Math.cos(t * 47) * 0.003;

      for (const p of puffs) {
        const u = (t * 0.45 + p.seed) % 1;
        // Plume bends away with the wind and widens as it rises, so it reads as exhaust, not a beam.
        const wob = Math.sin(t * 0.9 + p.seed * 17) * 0.18 * u;
        p.s.position.set(stackTop.x - u * u * 1.6 + wob, stackTop.y + u * 1.7, stackTop.z - u * 0.5 + Math.cos(p.seed * 11) * 0.2 * u);
        p.s.scale.setScalar(0.35 + u * 1.6);
        (p.s.material as THREE.SpriteMaterial).opacity = run * Math.sin(u * Math.PI) * 0.14;
      }
      for (const r of rings) {
        const u = (t * 0.45 + r.phase) % 1;
        r.ring.scale.setScalar(2.6 + u * 2.8);
        (r.ring.material as THREE.MeshBasicMaterial).opacity = run * (1 - u) * 0.5;
      }
      for (const c of cables) {
        (c.line.material as THREE.LineBasicMaterial).opacity = run * 0.55;
        for (const p of c.pulses) {
          const u = (t * 0.35 + p.o) % 1;
          p.s.position.copy(c.curve.getPoint(u));
          (p.s.material as THREE.SpriteMaterial).opacity = run * Math.sin(u * Math.PI);
        }
      }

      // Camera: slow swing around a three-quarter view, plus pointer parallax.
      const a = 0.72 + Math.sin(t * 0.12) * 0.32 + px * 0.25;
      const R = 13;
      camera.position.set(Math.cos(a) * R, 4.2 - py * 1.2, Math.sin(a) * R);
      camera.lookAt(-0.4, 1.15, 0.4);
    },
  };
}

/** A raised arc between two points, for network links. */
function arc(a: THREE.Vector3, b: THREE.Vector3, lift: number) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  mid.y += lift;
  return new THREE.QuadraticBezierCurve3(a, mid, b);
}

function buildField(dot: THREE.Texture): Built {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(INK, 7, 26);
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);

  // Point field: a wide grid whose height is driven by waves radiating from the beacons.
  const COLS = 120;
  const ROWS = 52;
  const SP = 0.3;
  const N = COLS * ROWS;
  const base = new Float32Array(N * 2); // x, z
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      base[i * 2] = (c - COLS / 2) * SP;
      base[i * 2 + 1] = -r * SP + 2;
    }
  const geo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(pos, 3);
  const colAttr = new THREE.BufferAttribute(col, 3);
  geo.setAttribute("position", posAttr);
  geo.setAttribute("color", colAttr);
  const field = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ map: dot, size: 0.13, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  field.position.y = -1.6;
  scene.add(field);

  // Beacons: the three locations as glowing nodes on light beams, linked by arcs that carry pulses.
  const beaconXZ: Array<[number, number]> = [
    // Right half of the frame, so the links never run behind the headline copy.
    [0.5, -5.5],
    [6.5, -10],
    [11, -4],
  ];
  const beacons = beaconXZ.map(([x, z], i) => {
    const top = new THREE.Vector3(x, 1.2 + i * 0.35, z);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: ORANGE, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.position.copy(top);
    glow.scale.setScalar(1.1);
    const beamGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, -1.6, z), top]);
    const beam = new THREE.Line(beamGeo, new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(glow, beam);
    return { top, glow, x, z };
  });
  const links = [
    [0, 1],
    [1, 2],
    [2, 0],
  ].map(([a, b]) => {
    const curve = arc(beacons[a].top, beacons[b].top, 2.2);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)),
      new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    scene.add(line);
    const pulses = [0, 0.5].map((offset) => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: GOLD, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      s.scale.setScalar(0.5);
      scene.add(s);
      return { s, offset };
    });
    return { curve, pulses };
  });

  const gold = GOLD;
  const deep = new THREE.Color("#2a1c02");
  const tmp = new THREE.Color();
  return {
    scene,
    camera,
    update(t, dt, px, py) {
      for (let i = 0; i < N; i++) {
        const x = base[i * 2];
        const z = base[i * 2 + 1];
        let h = Math.sin(x * 0.35 + t * 0.6) * 0.18 + Math.cos(z * 0.4 - t * 0.45) * 0.14;
        for (const b of beacons) {
          const d = Math.hypot(x - b.x, z - b.z);
          h += Math.sin(d * 1.1 - t * 2.2) * 0.32 * Math.exp(-d * 0.16);
        }
        pos[i * 3] = x;
        pos[i * 3 + 1] = h;
        pos[i * 3 + 2] = z;
        const k = Math.min(1, Math.max(0, 0.5 + h * 1.2));
        tmp.copy(deep).lerp(gold, k);
        col[i * 3] = tmp.r;
        col[i * 3 + 1] = tmp.g;
        col[i * 3 + 2] = tmp.b;
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      beacons.forEach((b, i) => b.glow.scale.setScalar(1 + Math.sin(t * 2.4 + i) * 0.18));
      for (const l of links)
        for (const p of l.pulses) {
          const u = (t * 0.22 + p.offset) % 1;
          p.s.position.copy(l.curve.getPoint(u));
          (p.s.material as THREE.SpriteMaterial).opacity = Math.sin(u * Math.PI);
        }

      // Gentle camera glide plus pointer parallax.
      camera.position.set(Math.sin(t * 0.07) * 1.2 + px * 1.4, 1.8 - py * 0.5, 9);
      camera.lookAt(0, -0.1, -5);
      void dt;
    },
  };
}

function buildMap(dot: THREE.Texture, host: HTMLElement): Built {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);

  // Same 1° land grid as the SVG map, laid flat (x = east, z = south).
  const S = 0.42;
  const KX = 0.8;
  const toXZ = (lat: number, lon: number) => new THREE.Vector3((lon + 96) * KX * S, 0, (37.5 - lat) * S);
  const dim: number[] = [];
  const se: number[] = [];
  for (const [latStr, ranges] of Object.entries(LAND)) {
    const lat = Number(latStr);
    for (const [a, b] of ranges)
      for (let lon = a; lon <= b; lon++) {
        const p = toXZ(lat, lon);
        (isSoutheast(lat, lon) ? se : dim).push(p.x, 0, p.z);
      }
  }
  const pts = (arr: number[], size: number) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    return new THREE.Points(g, new THREE.PointsMaterial({ map: dot, size, transparent: true, depthWrite: false }));
  };
  const land = pts(dim, 0.4);
  const southeast = pts(se, 0.48);
  const map = new THREE.Group();
  map.add(land, southeast);
  scene.add(map);

  // Beacons (sprite + expanding ring + light beam) on the three depots.
  const beacons = LOCATIONS.map((l, i) => {
    const p = toXZ(l.lat, l.lon);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: GOLD, transparent: true, depthWrite: false }));
    glow.position.set(p.x, 0.35, p.z);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.22, 0.28, 48),
      new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, side: THREE.DoubleSide, depthWrite: false }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(p.x, 0.02, p.z);
    const beam = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(p.x, 0, p.z), new THREE.Vector3(p.x, 1.6, p.z)]),
      new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.7, depthWrite: false }),
    );
    map.add(glow, ring, beam);
    return { id: l.id, p, glow, ring, phase: i * 0.33, hot: 0 };
  });
  const links = [
    [0, 1],
    [1, 2],
    [2, 0],
  ].map(([a, b]) => {
    const curve = arc(beacons[a].p.clone().setY(0.35), beacons[b].p.clone().setY(0.35), 1.6);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)),
      new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.75, depthWrite: false }),
    );
    const pulse = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: ORANGE, transparent: true, depthWrite: false }));
    pulse.scale.setScalar(0.5);
    map.add(line, pulse);
    return { curve, pulse };
  });

  // Theme: additive glow on dark; normal blending and darker tones on light.
  const glowMats = [
    ...beacons.flatMap((b) => [b.glow.material, b.ring.material]),
    ...links.map((l) => l.pulse.material),
  ] as THREE.Material[];
  const applyTheme = () => {
    const rgb = getComputedStyle(host).color.match(/[\d.]+/g)?.map(Number) ?? [255, 255, 255];
    const light = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255 < 0.5; // dark text = light theme
    const landMat = land.material as THREE.PointsMaterial;
    landMat.color.set(light ? "#141414" : "#ffffff");
    landMat.opacity = light ? 0.3 : 0.24;
    const seMat = southeast.material as THREE.PointsMaterial;
    seMat.color.set(light ? "#b37400" : "#eaa607");
    seMat.opacity = light ? 0.75 : 0.6;
    const blend = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    for (const m of [landMat, seMat, ...glowMats]) {
      m.blending = blend;
      m.needsUpdate = true;
    }
  };
  applyTheme();
  const mo = new MutationObserver(applyTheme);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", applyTheme);

  // The location cards beside the map light up their beacon on hover/focus.
  const section = host.closest("section") ?? document;
  const isHot = (id: string) => !!section.querySelector(`[data-loc="${id}"]:is(:hover, :focus-visible)`);

  // Centre the map on its own bounds.
  const box = new THREE.Box3().setFromObject(land);
  const centre = box.getCenter(new THREE.Vector3());
  map.position.set(-centre.x, 0, -centre.z);

  return {
    scene,
    camera,
    update(t, dt, px, py) {
      for (const b of beacons) {
        b.hot += ((isHot(b.id) ? 1 : 0) - b.hot) * Math.min(1, dt * 10);
        const u = (t * 0.5 + b.phase) % 1;
        b.ring.scale.setScalar(1 + u * 2.4);
        (b.ring.material as THREE.MeshBasicMaterial).opacity = (1 - u) * 0.9;
        b.glow.scale.setScalar((0.9 + Math.sin(t * 3 + b.phase * 6) * 0.12) * (1 + b.hot * 0.9));
      }
      for (const [i, l] of links.entries()) {
        const u = (t * 0.3 + i / 3) % 1;
        l.pulse.position.copy(l.curve.getPoint(u));
        (l.pulse.material as THREE.SpriteMaterial).opacity = Math.sin(u * Math.PI);
      }
      // Tilted, slowly swaying view; pointer adds a little parallax.
      const a = Math.sin(t * 0.15) * 0.12 + px * 0.18;
      camera.position.set(Math.sin(a) * 18 + 1.5, 12.5 - py * 1.5, Math.cos(a) * 18 + 1);
      camera.lookAt(1.2, 0, 0.9); // nudged towards the Southeast, where the network is
    },
    dispose() {
      mo.disconnect();
      mq.removeEventListener("change", applyTheme);
    },
  };
}

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
  const built: Built & { stillTime?: number; introStart?: number } =
    variant === "core"
      ? buildCore(dot)
      : variant === "racks"
        ? buildRacks(dot)
        : variant === "field"
          ? buildField(dot)
          : variant === "generator"
            ? buildGenerator(dot)
            : buildMap(dot, host);
  const { scene, camera, update } = built;

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
    t = built.introStart ?? 0;
    renderer.render(scene, camera);
    onReady();
    kick();
  };
  // Compile shaders asynchronously (parallel compile where the GPU driver supports it), so the
  // lit materials don't block the main thread in one long task on first render.
  renderer.compileAsync(scene, camera).then(begin, begin);

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
