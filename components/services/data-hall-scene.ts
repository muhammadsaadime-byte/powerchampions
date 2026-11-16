/**
 * <PowerScene variant="racks"> — Data Center Solutions hero.
 * A data hall cold aisle seen from its entrance: two facing rows of server racks with detailed front
 * doors and blinking status LEDs, overhead ladder trays carrying fibre trunks, ceiling light strips
 * reflected in a tiled raised floor, and data pulses running along the trays. The camera dollies
 * slowly down the aisle.
 */
import * as THREE from "three";
import { GOLD, at, box, canvasTex, setupRealism } from "./scene-kit";

export function buildDataHall(dot: THREE.Texture, renderer: THREE.WebGLRenderer, lite = false) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0b0c0e, 5, 22);
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 80);
  const textures: THREE.Texture[] = [];
  setupRealism(renderer, scene, lite, textures, 0.9);
  if (!lite) scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x0c0c0e, 0.55));

  const N = 18; // racks per row
  const PITCH = 0.62;
  const RW = 0.6; // rack width (along the aisle, z)
  const RH = 2.05;
  const RD = 1.0; // depth (x)
  const AISLE = 0.9; // half aisle width to the rack fronts
  const rowX = AISLE + RD / 2;
  const zOf = (i: number) => -0.6 - i * PITCH;
  const zEnd = zOf(N - 1) - PITCH;

  /* ── Raised floor ── */
  const tile = canvasTex(
    256,
    256,
    (g) => {
      for (let ty = 0; ty < 2; ty++)
        for (let tx = 0; tx < 2; tx++) {
          const v = 34 + Math.floor(Math.random() * 14);
          g.fillStyle = `rgb(${v},${v + 1},${v + 3})`;
          g.fillRect(tx * 128, ty * 128, 128, 128);
          if (tx === 1 && ty === 0) {
            // perforated airflow tile
            g.fillStyle = "#0e0f10";
            for (let y = 14; y < 128; y += 12) for (let x = 14; x < 128; x += 12) g.fillRect(128 + x - 2, y - 2, 4, 4);
          }
        }
      g.strokeStyle = "#050506";
      g.lineWidth = 6;
      g.strokeRect(0, 0, 128, 128);
      g.strokeRect(128, 0, 128, 128);
      g.strokeRect(0, 128, 128, 128);
      g.strokeRect(128, 128, 128, 128);
    },
    textures,
  );
  tile.wrapS = tile.wrapT = THREE.RepeatWrapping;
  tile.repeat.set(20, 20);
  tile.anisotropy = 8;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), new THREE.MeshStandardMaterial({ map: tile, metalness: 0.55, roughness: 0.32 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = -8;
  scene.add(floor);

  /* ── Racks ── */
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x17181b, metalness: 0.6, roughness: 0.42 });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x2b2d31, metalness: 0.7, roughness: 0.35 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x9a9ea3, metalness: 1, roughness: 0.32 });
  const UNITS = 21;
  const doorT = canvasTex(
    128,
    512,
    (g) => {
      g.fillStyle = "#0b0c0e";
      g.fillRect(0, 0, 128, 512);
      const uh = 500 / UNITS;
      for (let u = 0; u < UNITS; u++) {
        const y = 6 + u * uh;
        const kind = Math.random();
        g.fillStyle = kind < 0.15 ? "#15171a" : "#2a2e34";
        g.fillRect(8, y + 1, 112, uh - 3);
        if (kind >= 0.15) {
          g.fillStyle = "#0a0b0c";
          if (kind < 0.6) for (let b = 0; b < 8; b++) g.fillRect(14 + b * 11, y + 4, 8, uh - 9); // drive bays
          else for (let v = 0; v < 26; v++) g.fillRect(14 + v * 3.2, y + 5, 1.6, uh - 11); // vents
          g.fillStyle = "#454a52";
          g.fillRect(104, y + 4, 12, uh - 9); // handle / ears
        }
      }
      g.strokeStyle = "#31343a";
      g.lineWidth = 4;
      g.strokeRect(2, 2, 124, 508);
    },
    textures,
  );
  doorT.anisotropy = 8;
  const doorMat = new THREE.MeshStandardMaterial({ map: doorT, metalness: 0.55, roughness: 0.45 });

  const bodies = new THREE.InstancedMesh(new THREE.BoxGeometry(RD, RH, RW - 0.015), bodyMat, N * 2);
  const frames = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, RH, RW), frameMat, N * 2);
  const doors = new THREE.InstancedMesh(new THREE.PlaneGeometry(RW - 0.06, RH - 0.1), doorMat, N * 2);
  const handles = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 0.16, 0.02), steel, N * 2);
  const m4 = new THREE.Matrix4();
  const qL = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)); // left row faces +x
  const qR = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0));
  const one = new THREE.Vector3(1, 1, 1);
  const LEDS = 16;
  const ledPos = new Float32Array(N * 2 * LEDS * 3);
  const ledCol = new Float32Array(N * 2 * LEDS * 3);
  let k = 0;
  for (const side of [-1, 1]) {
    for (let i = 0; i < N; i++) {
      const z = zOf(i);
      m4.makeTranslation(side * rowX, RH / 2, z);
      bodies.setMatrixAt(k, m4);
      m4.makeTranslation(side * (AISLE + 0.005), RH / 2, z);
      frames.setMatrixAt(k, m4);
      m4.compose(new THREE.Vector3(side * (AISLE - 0.012), RH / 2, z), side < 0 ? qL : qR, one);
      doors.setMatrixAt(k, m4);
      m4.compose(new THREE.Vector3(side * (AISLE - 0.03), 1.05, z + side * (RW / 2 - 0.07)), side < 0 ? qL : qR, one);
      handles.setMatrixAt(k, m4);
      for (let l = 0; l < LEDS; l++) {
        const o = (k * LEDS + l) * 3;
        const u = Math.floor(Math.random() * UNITS);
        ledPos[o] = side * (AISLE - 0.02);
        ledPos[o + 1] = RH - 0.1 - (u + 0.5) * ((RH - 0.1) / UNITS);
        ledPos[o + 2] = z + (Math.random() < 0.7 ? -1 : 1) * (0.08 + Math.random() * 0.16);
      }
      k++;
    }
  }
  scene.add(bodies, frames, doors, handles);

  const C_GREEN = new THREE.Color("#39e07a");
  const C_BLUE = new THREE.Color("#4aa8ff");
  const C_OFF = new THREE.Color("#07130c");
  const ledKind = new Uint8Array(N * 2 * LEDS).map(() => (Math.random() < 0.72 ? 0 : Math.random() < 0.6 ? 1 : 2));
  const setLed = (i: number, on: boolean) => {
    const c = on ? (ledKind[i] === 0 ? C_GREEN : ledKind[i] === 1 ? C_BLUE : GOLD) : C_OFF;
    ledCol[i * 3] = c.r;
    ledCol[i * 3 + 1] = c.g;
    ledCol[i * 3 + 2] = c.b;
  };
  for (let i = 0; i < N * 2 * LEDS; i++) setLed(i, Math.random() < 0.7);
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute("position", new THREE.BufferAttribute(ledPos, 3));
  const colAttr = new THREE.BufferAttribute(ledCol, 3);
  lGeo.setAttribute("color", colAttr);
  scene.add(new THREE.Points(lGeo, new THREE.PointsMaterial({ map: dot, size: 0.07, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })));

  /* ── Overhead ladder trays with fibre trunks ── */
  const len = -zEnd + 1;
  const zc = zEnd / 2 + 0.2;
  const trayY = RH + 0.28;
  const rungs = new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.02, 0.03), steel, 2 * 40);
  let r = 0;
  for (const side of [-1, 1]) {
    const x = side * (AISLE + 0.35);
    for (const dx of [-0.25, 0.25]) scene.add(at(box(0.025, 0.05, len, steel), x + dx, trayY, zc));
    for (let i = 0; i < 40; i++) {
      m4.makeTranslation(x, trayY - 0.01, 0.4 - i * (len / 40));
      rungs.setMatrixAt(r++, m4);
    }
    scene.add(at(box(0.12, 0.05, len, new THREE.MeshStandardMaterial({ color: 0xe0b400, roughness: 0.6 })), x - 0.1, trayY + 0.03, zc));
    scene.add(at(box(0.08, 0.04, len, new THREE.MeshStandardMaterial({ color: 0x1f6fd0, roughness: 0.6 })), x + 0.08, trayY + 0.025, zc));
  }
  scene.add(rungs);

  /* ── Ceiling light strips, their floor reflections, end wall ── */
  const stripMat = new THREE.MeshBasicMaterial({ color: 0xe6eeff, toneMapped: false });
  const refl = new THREE.MeshBasicMaterial({ map: dot, color: 0xcfe0ff, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false });
  for (let z = -1.2; z > zEnd; z -= 2.4) {
    scene.add(at(box(0.22, 0.03, 1.5, stripMat), 0, RH + 0.75, z));
    const p = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 2.6), refl);
    p.rotation.x = -Math.PI / 2;
    scene.add(at(p, 0, 0.003, z));
  }
  for (const z of [-2, -7, -12]) {
    const pl = new THREE.PointLight(0xcfe0ff, 9, 8, 1.7);
    pl.position.set(0, RH + 0.5, z);
    scene.add(pl);
  }
  scene.add(at(box(6, 4, 0.2, bodyMat), 0, 2, zEnd - 0.6));

  /* ── Data pulses along the trays ── */
  const P = 14;
  const pulses = Array.from({ length: P }, (_, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: i % 3 === 0 ? 0x4aa8ff : GOLD, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    s.scale.setScalar(0.22);
    scene.add(s);
    return { s, side: i % 2 ? 1 : -1, o: Math.random(), v: 0.05 + Math.random() * 0.06, dir: Math.random() < 0.5 ? 1 : -1 };
  });

  let blink = 0;
  const update = (t: number, dt: number, px: number, py: number) => {
    blink += dt;
    if (blink > 0.07) {
      blink = 0;
      for (let n = 0; n < 40; n++) setLed(Math.floor(Math.random() * N * 2 * LEDS), Math.random() < 0.72);
      colAttr.needsUpdate = true;
    }
    for (const p of pulses) {
      let u = (t * p.v + p.o) % 1;
      if (p.dir < 0) u = 1 - u;
      p.s.position.set(p.side * (AISLE + 0.35) + (p.dir > 0 ? -0.1 : 0.08), trayY + 0.09, 0.4 + u * (zEnd - 0.4));
      (p.s.material as THREE.SpriteMaterial).opacity = Math.sin(u * Math.PI) * 0.9;
    }
    // Slow dolly down the aisle and back, with pointer parallax.
    const d = 0.5 - 0.5 * Math.cos(t * 0.12);
    camera.position.set(px * 0.3, 1.5 - py * 0.15, 2.6 - d * 3.2);
    camera.lookAt(px * 0.6, 1.15, -9);
  };

  return {
    scene,
    camera,
    update,
    stillTime: 6,
    dispose() {
      textures.forEach((x) => x.dispose());
    },
  };
}
