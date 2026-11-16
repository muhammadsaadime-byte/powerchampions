/**
 * <PowerScene variant="city"> — homepage hero.
 * A night city seen from above, with traffic. It loops the reason the company exists (18s):
 *   0s   city lit by the grid
 *   4s   the grid fails; darkness sweeps across the skyline
 *        … except the facilities with backup power (hospital, data centre, manufacturing and a few
 *        more): they flicker once, then stay lit while gold power flows to them from the stations
 *   12s  the grid returns and the city relights
 * Deliberately unlit (basic materials, per-building brightness via instance colour): one cheap draw
 * call per building class, no environment map, so start-up cost stays in the tens of milliseconds.
 */
import * as THREE from "three";

const GOLD = new THREE.Color("#eaa607");
const PERIOD = 18;
const T_OUT = 4;
const T_BACK = 12;
const SWEEP = 1.7; // seconds for the blackout / restore front to cross the city
const PITCH = 2.2;

type B = { x: number; z: number; w: number; d: number; h: number; prot: boolean; cls: number; idx: number; r: number };

export function buildCity(dot: THREE.Texture) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x101010, 34, 74);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 160);
  const textures: THREE.Texture[] = [];
  const tex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d")!);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    textures.push(t);
    return t;
  };

  /* ── Ground: blocks and streets on the same grid as the buildings ── */
  const street = tex(64, 64, (g) => {
    g.fillStyle = "#1b1c20";
    g.fillRect(0, 0, 64, 64);
    g.fillStyle = "#0c0d0f";
    g.fillRect(9, 9, 46, 46);
    g.fillStyle = "#3a3b40";
    for (let i = 12; i < 64; i += 16) {
      g.fillRect(i, 3, 6, 1);
      g.fillRect(3, i, 1, 6);
    }
  });
  street.wrapS = street.wrapT = THREE.RepeatWrapping;
  const GS = 60; // blocks across
  street.repeat.set(GS, GS);
  street.anisotropy = 8;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(GS * PITCH, GS * PITCH), new THREE.MeshBasicMaterial({ map: street }));
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  /* ── Buildings ── */
  const stations: Array<[number, number]> = [
    [-3, 3],
    [2, 1],
    [6, 4],
  ];
  const special = new Map<string, { w: number; d: number; h: number; label?: string }>([
    ["7,-3", { w: 1.7, d: 1.5, h: 2.6, label: "Hospital" }],
    ["3,-1", { w: 1.8, d: 1.7, h: 1.5, label: "Data Center" }],
    ["7,2", { w: 1.8, d: 1.6, h: 1.2, label: "Manufacturing" }],
    ["-1,2", { w: 1.3, d: 1.3, h: 3.4 }],
    ["1,3", { w: 1.4, d: 1.2, h: 2.2 }],
    ["5,1", { w: 1.3, d: 1.4, h: 4.2 }],
    ["4,5", { w: 1.5, d: 1.3, h: 1.8 }],
  ]);
  const isStation = (i: number, j: number) => stations.some(([a, b]) => a === i && b === j);
  const list: B[] = [];
  const counts = [0, 0, 0];
  for (let i = -13; i <= 13; i++)
    for (let j = -12; j <= 7; j++) {
      if (isStation(i, j)) continue;
      const sp = special.get(`${i},${j}`);
      if (!sp && Math.random() < 0.1) continue; // open lots
      // Downtown towers sit behind the protected district, so the foreground stays low-rise and readable.
      const dist = Math.hypot(i - 1, j + 8);
      const h = sp?.h ?? 0.6 + Math.random() * 1.2 + Math.max(0, 7 - dist * 0.8) * Math.random();
      const cls = h < 2 ? 0 : h < 4.2 ? 1 : 2;
      list.push({ x: i * PITCH, z: j * PITCH, w: sp?.w ?? 1.0 + Math.random() * 0.5, d: sp?.d ?? 1.0 + Math.random() * 0.5, h, prot: !!sp, cls, idx: counts[cls]++, r: Math.random() });
    }
  // Three window textures (rows scale with height class) so tall towers don't get stretched windows.
  const winTex = [5, 10, 20].map((rows) =>
    tex(64, rows * 12 + 4, (g) => {
      g.fillStyle = "#0b0c0f";
      g.fillRect(0, 0, 64, rows * 12 + 4);
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < 5; c++) {
          const on = Math.random() < 0.62;
          g.fillStyle = on ? (Math.random() < 0.72 ? "#ffcf8a" : "#cfe0ff") : "#15171b";
          g.fillRect(5 + c * 12, 4 + r * 12, 7, 6);
        }
    }),
  );
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const meshes = winTex.map((map, cls) => {
    const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ map }), Math.max(1, counts[cls]));
    mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    scene.add(mesh);
    return mesh;
  });
  const roofs = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x131417 }), list.length);
  list.forEach((b, n) => {
    m4.compose(new THREE.Vector3(b.x, b.h / 2, b.z), q, new THREE.Vector3(b.w, b.h, b.d));
    meshes[b.cls].setMatrixAt(b.idx, m4);
    m4.compose(new THREE.Vector3(b.x, b.h + 0.03, b.z), q, new THREE.Vector3(b.w + 0.06, 0.06, b.d + 0.06));
    roofs.setMatrixAt(n, m4);
  });
  scene.add(roofs);

  /* ── Protected facilities: labels, rings ── */
  const font = getComputedStyle(document.body).fontFamily || "sans-serif";
  const labelTex = (title: string, sub: string, on: boolean) =>
    tex(512, 128, (g) => {
      g.fillStyle = "rgba(16,16,16,0.92)";
      g.fillRect(0, 0, 512, 128);
      g.fillStyle = on ? "#39e07a" : "#eaa607";
      g.fillRect(0, 0, 8, 128);
      g.fillStyle = "#ffffff";
      g.font = `700 44px ${font}`;
      g.fillText(title, 30, 56, 470);
      g.fillStyle = on ? "#39e07a" : "rgba(255,255,255,0.72)";
      g.font = `600 27px ${font}`;
      g.fillText(sub, 30, 100, 470);
    });
  const prot = list.filter((b) => b.prot);
  const labels: Array<{ s: THREE.Sprite; normal: THREE.Texture; backup: THREE.Texture }> = [];
  const rings = prot.map((b) => {
    const sp = special.get(`${Math.round(b.x / PITCH)},${Math.round(b.z / PITCH)}`)!;
    if (sp.label) {
      const normal = labelTex(sp.label, "Protected by PowerChampions", false);
      const backup = labelTex(sp.label, "● On backup power", true);
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: normal, transparent: true, depthTest: false, depthWrite: false }));
      s.center.set(0.5, 0);
      s.position.set(b.x, b.h + 0.9, b.z);
      s.scale.set(5.4, 1.35, 1);
      s.renderOrder = 10;
      scene.add(s);
      labels.push({ s, normal, backup });
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 6), new THREE.MeshBasicMaterial({ color: GOLD }));
      stem.position.set(b.x, b.h + 0.45, b.z);
      scene.add(stem);
    }
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.94, 1, 48),
      new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(b.x, 0.04, b.z);
    scene.add(ring);
    return { ring, seed: b.r };
  });

  /* ── Power stations and feeders along the streets ── */
  const half = PITCH / 2;
  const stationGlow = stations.map(([i, j]) => {
    const x = i * PITCH;
    const z = j * PITCH;
    const pad = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 1.3), new THREE.MeshBasicMaterial({ color: 0x2a2b2f }));
    pad.position.set(x, 0.04, z);
    scene.add(pad);
    for (const dx of [-0.36, 0.36]) {
      const unit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.34, 0.95), new THREE.MeshBasicMaterial({ color: 0x6b7078 }));
      unit.position.set(x + dx, 0.25, z);
      scene.add(unit);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.05, 0.97), new THREE.MeshBasicMaterial({ color: GOLD }));
      stripe.position.set(x + dx, 0.14, z);
      scene.add(stripe);
    }
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: GOLD, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.position.set(x, 0.5, z);
    glow.scale.setScalar(3.2);
    scene.add(glow);
    return glow;
  });
  // Each protected building is fed from its nearest station along an L-shaped street route.
  const feeders = prot.map((b, n) => {
    const [si, sj] = stations.reduce((best, s) => (Math.hypot(s[0] * PITCH - b.x, s[1] * PITCH - b.z) < Math.hypot(best[0] * PITCH - b.x, best[1] * PITCH - b.z) ? s : best));
    const sx = si * PITCH;
    const sz = sj * PITCH;
    const y = 0.05;
    const pts = [new THREE.Vector3(sx, y, sz), new THREE.Vector3(sx, y, sz + half), new THREE.Vector3(b.x + half, y, sz + half), new THREE.Vector3(b.x + half, y, b.z), new THREE.Vector3(b.x, y, b.z)];
    const mat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false });
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    const lens = pts.slice(1).map((p, k) => p.distanceTo(pts[k]));
    const total = lens.reduce((a, c) => a + c, 0);
    const at = (u: number, out: THREE.Vector3) => {
      let dd = u * total;
      for (let k = 0; k < lens.length; k++) {
        if (dd <= lens[k] || k === lens.length - 1) return out.lerpVectors(pts[k], pts[k + 1], Math.min(1, dd / (lens[k] || 1)));
        dd -= lens[k];
      }
      return out;
    };
    const pulses = [0, 0.5].map((o) => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: GOLD, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
      s.scale.setScalar(0.7);
      scene.add(s);
      return { s, o: o + n * 0.13 };
    });
    return { mat, at, pulses, speed: 4.5 / total };
  });

  /* ── Traffic: headlights and tail lights along the streets ── */
  const CARS = 90;
  const carPos = new Float32Array(CARS * 3);
  const carCol = new Float32Array(CARS * 3);
  const cars = Array.from({ length: CARS }, (_, i) => {
    const alongX = Math.random() < 0.5;
    const lane = (Math.floor(Math.random() * 22) - 12) * PITCH + half + (Math.random() < 0.5 ? -0.12 : 0.12);
    const dir = Math.random() < 0.5 ? 1 : -1;
    const c = dir > 0 ? [1, 0.93, 0.8] : [1, 0.16, 0.12];
    carCol.set(c, i * 3);
    return { alongX, lane, dir, o: Math.random() * 60, v: 1.6 + Math.random() * 2.2 };
  });
  const carGeo = new THREE.BufferGeometry();
  const carAttr = new THREE.BufferAttribute(carPos, 3);
  carGeo.setAttribute("position", carAttr);
  carGeo.setAttribute("color", new THREE.BufferAttribute(carCol, 3));
  scene.add(new THREE.Points(carGeo, new THREE.PointsMaterial({ map: dot, size: 0.3, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));

  const white = new THREE.Color(1, 1, 1);
  const warm = new THREE.Color("#ffd27a");
  const tmp = new THREE.Color();
  const v3 = new THREE.Vector3();
  const X0 = -13 * PITCH - 2;
  const XW = 26 * PITCH + 4;
  let labelState = false;
  const update = (t: number, dt: number, px: number, py: number) => {
    const c = t % PERIOD;
    const outFront = X0 + ((c - T_OUT) / SWEEP) * XW; // sweeps +x
    const backFront = X0 + XW - ((c - T_BACK) / SWEEP) * XW; // sweeps -x
    const outage = c >= T_OUT + 0.2 && c < T_BACK;

    for (const b of list) {
      const lost = c >= T_OUT && b.x < outFront && !(c >= T_BACK && b.x > backFront);
      let level = 1;
      if (lost) {
        if (b.prot) {
          // One flicker as the grid drops, then solid on backup with a warm tint.
          const since = c - (T_OUT + ((b.x - X0) / XW) * SWEEP);
          level = since < 0.35 ? 0.25 + Math.abs(Math.sin(since * 40)) * 0.5 : 1.25;
          tmp.copy(white).lerp(warm, since < 0.35 ? 0 : 0.55).multiplyScalar(level);
        } else {
          tmp.copy(white).multiplyScalar(0.09 + b.r * 0.03);
        }
      } else {
        level = 0.92 + Math.sin(t * 0.7 + b.r * 40) * 0.05;
        tmp.copy(white).multiplyScalar(level);
      }
      meshes[b.cls].setColorAt(b.idx, tmp);
    }
    for (const m of meshes) if (m.instanceColor) m.instanceColor.needsUpdate = true;

    if (outage !== labelState) {
      labelState = outage;
      for (const l of labels) {
        l.s.material.map = outage ? l.backup : l.normal;
        l.s.material.needsUpdate = true;
      }
    }
    const power = outage ? Math.min(1, (c - T_OUT - 0.2) / 0.8) : Math.max(0, 1 - (c - T_BACK) / 0.8) * (c >= T_BACK ? 1 : 0);
    for (const r of rings) {
      const u = (t * 0.5 + r.seed) % 1;
      r.ring.scale.setScalar(0.9 + u * 1.3);
      (r.ring.material as THREE.MeshBasicMaterial).opacity = power * (1 - u) * 0.9;
    }
    for (const f of feeders) {
      f.mat.opacity = 0.2 + power * 0.7;
      for (const p of f.pulses) {
        const u = (t * f.speed + p.o) % 1;
        f.at(u, v3);
        p.s.position.set(v3.x, 0.12, v3.z);
        (p.s.material as THREE.SpriteMaterial).opacity = power * Math.sin(u * Math.PI);
      }
    }
    stationGlow.forEach((g, i) => {
      (g.material as THREE.SpriteMaterial).opacity = 0.3 + power * (0.5 + Math.sin(t * 5 + i) * 0.12);
      g.scale.setScalar(3.2 + power * 1.4);
    });

    for (let i = 0; i < CARS; i++) {
      const car = cars[i];
      const s = ((((t * car.v + car.o) * car.dir) % 60) + 60) % 60 - 30;
      carPos[i * 3] = car.alongX ? s : car.lane;
      carPos[i * 3 + 1] = 0.09;
      carPos[i * 3 + 2] = car.alongX ? car.lane : s * 0.75 - 4;
    }
    carAttr.needsUpdate = true;

    // Slow aerial drift with pointer parallax.
    const a = 0.42 + Math.sin(t * 0.045) * 0.3 + px * 0.1;
    const R = 34;
    camera.position.set(1 + Math.sin(a) * R, 21 - py * 1.5, 2 + Math.cos(a) * R);
    camera.lookAt(1, 0.5, -1.5);
    void dt;
  };

  return {
    scene,
    camera,
    update,
    stillTime: 8,
    introStart: 1,
    dispose() {
      textures.forEach((x) => x.dispose());
    },
  };
}
