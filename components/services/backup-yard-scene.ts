/**
 * <PowerScene variant="backup"> — Backup Power Centers hero.
 * A backup power yard: two enclosed generator sets, a switchgear/ATS line-up, the utility pad-mount
 * transformer and the facility they protect. It loops the story the page tells (18s):
 *   0s utility normal, sets on standby  →  3s utility fails, facility goes dark
 *   →  3.8s sets crank and come up to 480 V / 60 Hz  →  6s ATS transfers, power flows, lights return
 *   →  14s utility restored, retransfer  →  sets cool down and stop.
 */
import * as THREE from "three";
import { GOLD, at, blob, box, canvasTex, cyl, ease, makeCable, makeGenset, makeGensetTextures, makeMaterials, rbox, setupRealism, type Genset } from "./scene-kit";

const PERIOD = 18;
const T_OUT = 3;
const T_CRANK = 3.8;
const T_XFER = 6;
const T_RESTORE = 14;

export function buildBackupYard(dot: THREE.Texture, renderer: THREE.WebGLRenderer, lite = false) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0d0d0e, 13, 34);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);
  const textures: THREE.Texture[] = [];
  setupRealism(renderer, scene, lite, textures, 1.4);
  if (!lite) scene.add(new THREE.HemisphereLight(0xffffff, 0x2a241a, 0.45));
  const key = new THREE.DirectionalLight(0xfff1dd, 2.4);
  key.position.set(6, 10, 8);
  scene.add(key);
  const rim = new THREE.PointLight(GOLD, 30, 26, 1.8);
  rim.position.set(-6, 5, -5);
  scene.add(rim);

  const m = makeMaterials();
  const font = getComputedStyle(document.body).fontFamily || "sans-serif";
  const gtex = makeGensetTextures(textures, font);

  /* ── Yard ── */
  const slab = canvasTex(
    256,
    256,
    (g) => {
      g.fillStyle = "#2c2d2f";
      g.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 900; i++) {
        g.fillStyle = `rgba(${Math.random() < 0.5 ? "255,255,255" : "0,0,0"},${Math.random() * 0.05})`;
        g.fillRect(Math.random() * 256, Math.random() * 256, 2 + Math.random() * 3, 2 + Math.random() * 3);
      }
      g.strokeStyle = "#1a1a1b";
      g.lineWidth = 3;
      g.strokeRect(0, 0, 256, 256);
    },
    textures,
  );
  slab.wrapS = slab.wrapT = THREE.RepeatWrapping;
  slab.repeat.set(14, 14);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), new THREE.MeshStandardMaterial({ map: slab, roughness: 0.92, metalness: 0 }));
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const padMat = new THREE.MeshStandardMaterial({ color: 0x47484a, roughness: 0.95 });
  const sets: Array<{ s: Genset; base: THREE.Vector3; delay: number; fanSpeed: number }> = [];
  for (const [x, z, delay] of [
    [-2.3, 1.5, 0],
    [-1.5, -1.3, 0.45],
  ] as const) {
    scene.add(at(box(4.6, 0.1, 2.2, padMat), x, 0.05, z));
    blob(scene, dot, 6.4, 3.8, x, 0.004, z, 0.5);
    blob(scene, dot, 4.6, 2.0, x, 0.104, z, 0.75);
    const s = makeGenset(m, gtex, textures, font);
    const base = new THREE.Vector3(x, 0.1, z);
    s.g.position.copy(base);
    scene.add(s.g);
    sets.push({ s, base, delay, fanSpeed: 0 });
  }
  // Safety bollards and a painted boundary line in front of the sets.
  for (const [x, z] of [
    [-5.0, 3.1],
    [0.4, 3.1],
  ])
    scene.add(at(cyl(0.07, 0.07, 0.95, m.yellow, 14), x, 0.475, z));
  scene.add(at(box(6.4, 0.006, 0.08, m.yellow), -2.3, 0.004, 3.45));

  /* ── Switchgear / ATS line-up ── */
  const SGX = [3.0, 3.94, 4.88];
  const SGZ = -0.5;
  const CH = 2.1;
  scene.add(at(box(3.1, 0.1, 1.0, padMat), 3.94, 0.05, SGZ));
  blob(scene, dot, 4.6, 2.4, 3.94, 0.004, SGZ, 0.55);
  const zF = SGZ + 0.36;
  SGX.forEach((x, i) => {
    scene.add(at(rbox(0.92, CH, 0.7, 0.02, m.paintLight), x, 0.1 + CH / 2, SGZ));
    scene.add(at(rbox(0.82, CH - 0.2, 0.02, 0.01, m.paintLight), x, 0.1 + CH / 2, zF)); // door
    scene.add(at(rbox(0.035, 0.22, 0.03, 0.007, m.steel), x + 0.33, 1.1, zF + 0.025)); // handle
    scene.add(at(box(0.6, 0.22, 0.008, m.black), x, 0.45, zF + 0.012)); // vent
    for (let v = 0; v < 5; v++) scene.add(at(box(0.6, 0.012, 0.02, m.paintLight), x, 0.37 + v * 0.045, zF + 0.02));
    scene.add(at(new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.06), new THREE.MeshStandardMaterial({ color: 0xf1f1f1, roughness: 0.6 })), x, 2.02, zF + 0.012)); // nameplate
    if (i === 1)
      for (const dx of [-0.22, 0, 0.22]) {
        const ringM = cyl(0.085, 0.085, 0.012, m.steel, 24);
        ringM.rotation.x = Math.PI / 2;
        scene.add(at(ringM, x + dx, 1.72, zF + 0.012));
        const face = cyl(0.07, 0.07, 0.014, m.black, 24);
        face.rotation.x = Math.PI / 2;
        scene.add(at(face, x + dx, 1.72, zF + 0.014));
      }
    if (i === 2) for (const dy of [0, 0.22, 0.44]) scene.add(at(rbox(0.3, 0.12, 0.05, 0.01, m.black), x - 0.1, 1.45 + dy, zF + 0.03));
  });
  // ATS controller on the first cabinet: screen + source lamps.
  const atsC = document.createElement("canvas");
  atsC.width = 256;
  atsC.height = 128;
  const ag = atsC.getContext("2d")!;
  const atsT = new THREE.CanvasTexture(atsC);
  atsT.colorSpace = THREE.SRGBColorSpace;
  textures.push(atsT);
  let atsState = "";
  const drawAts = (state: "UTILITY" | "LOST" | "GEN") => {
    if (state === atsState) return;
    atsState = state;
    ag.fillStyle = "#07101a";
    ag.fillRect(0, 0, 256, 128);
    ag.font = `700 20px ${font}`;
    ag.fillStyle = "#9fb4c8";
    ag.fillText("TRANSFER SWITCH", 12, 28);
    ag.font = `800 30px ${font}`;
    ag.fillStyle = state === "UTILITY" ? "#39e07a" : state === "LOST" ? "#ff4d4d" : "#eaa607";
    ag.fillText(state === "UTILITY" ? "ON UTILITY" : state === "LOST" ? "UTILITY LOST" : "ON GENERATOR", 12, 74);
    ag.font = `700 20px ${font}`;
    ag.fillStyle = "#cfe0ee";
    ag.fillText(state === "LOST" ? "Starting generators…" : "480 V   60.0 Hz", 12, 110);
    atsT.needsUpdate = true;
  };
  drawAts("UTILITY");
  scene.add(at(rbox(0.5, 0.32, 0.02, 0.008, m.black), SGX[0], 1.62, zF + 0.014));
  scene.add(at(new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.21), new THREE.MeshBasicMaterial({ map: atsT, toneMapped: false })), SGX[0], 1.64, zF + 0.026));
  const lampU = new THREE.MeshBasicMaterial({ color: 0x39e07a, toneMapped: false });
  const lampG = new THREE.MeshBasicMaterial({ color: 0x1a1a1a, toneMapped: false });
  scene.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.03, 14, 12), lampU), SGX[0] - 0.12, 1.32, zF + 0.02));
  scene.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.03, 14, 12), lampG), SGX[0] + 0.12, 1.32, zF + 0.02));

  /* ── Utility pad-mount transformer ── */
  const green = new THREE.MeshStandardMaterial({ color: 0x33503f, metalness: 0.3, roughness: 0.5 });
  const TX = 7.0;
  scene.add(at(box(1.8, 0.12, 1.6, padMat), TX, 0.06, SGZ));
  blob(scene, dot, 3.0, 2.8, TX, 0.004, SGZ, 0.5);
  scene.add(at(rbox(1.4, 1.25, 1.2, 0.03, green), TX, 0.12 + 0.625, SGZ));
  scene.add(at(rbox(1.3, 1.05, 0.02, 0.01, green), TX, 0.12 + 0.6, SGZ + 0.61));
  scene.add(at(new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.14), m.yellow), TX + 0.3, 1.05, SGZ + 0.625));
  for (const dz of [-0.35, 0, 0.35]) scene.add(at(cyl(0.05, 0.07, 0.16, m.paintLight, 12), TX, 1.45, SGZ + dz)); // bushings

  /* ── Facility ── */
  const BZ = -11;
  const wall = new THREE.MeshStandardMaterial({ color: 0x1b1c1f, metalness: 0.2, roughness: 0.7 });
  scene.add(at(box(19, 6, 4, wall), 3, 3, BZ - 2));
  scene.add(at(box(19.3, 0.25, 4.3, m.paintDark), 3, 6.1, BZ - 2));
  const winT = canvasTex(
    512,
    160,
    (g) => {
      g.fillStyle = "#000";
      g.fillRect(0, 0, 512, 160);
      // Five floors of narrow windows in bays of three, most lit, some dark.
      for (let r = 0; r < 5; r++)
        for (let c = 0; c < 42; c++) {
          if (c % 4 === 3) continue; // pier between bays
          const on = Math.random() < 0.7;
          g.fillStyle = on ? (Math.random() < 0.75 ? "#e8c48e" : "#b9cbe6") : "#070707";
          g.fillRect(6 + c * 12, 10 + r * 30, 8, 17);
        }
    },
    textures,
  );
  const winMat = new THREE.MeshStandardMaterial({ color: 0x050505, emissive: 0xffffff, emissiveMap: winT, emissiveIntensity: 1, roughness: 0.3 });
  scene.add(at(new THREE.Mesh(new THREE.PlaneGeometry(17.6, 4.6), winMat), 3, 3.2, BZ + 0.01));
  const glow = new THREE.PointLight(0xffd9a0, 0, 16, 1.6); // window spill onto the yard
  glow.position.set(3, 2.5, BZ + 2.5);
  scene.add(glow);

  /* ── Cabling ── */
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const feeds = sets.map(({ s, base }, i) => {
    const j = base.clone().add(s.junction);
    return makeCable(scene, dot, m, [j, V(j.x + 0.05, 0.14, j.z + 0.25), V(j.x + 0.6, 0.04, j.z + 0.45 - i * 0.3), V(2.2, 0.04, 0.9 - i * 0.5), V(SGX[0] - 0.15 + i * 0.3, 0.04, zF + 0.25), V(SGX[0] - 0.15 + i * 0.3, 0.3, zF + 0.02)], 3);
  });
  const utilFeed = makeCable(scene, dot, m, [V(TX - 0.7, 0.3, SGZ + 0.2), V(TX - 1.0, 0.04, SGZ + 0.5), V(SGX[2] + 0.8, 0.04, SGZ + 0.55), V(SGX[2] + 0.4, 0.3, zF + 0.02)], 2);
  const loadFeed = makeCable(scene, dot, m, [V(SGX[1], 0.3, SGZ - 0.36), V(SGX[1], 0.04, SGZ - 0.8), V(3.6, 0.04, -3.5), V(3.2, 0.04, BZ + 0.6), V(3.2, 0.5, BZ + 0.02)], 4, 0.04);

  let lit = 1;
  let screenClock = 1;
  const update = (t: number, dt: number, px: number, py: number) => {
    const c = t % PERIOD;
    const utility = c < T_OUT || c >= T_RESTORE;
    const onGen = c >= T_XFER && c < T_RESTORE;

    screenClock += dt;
    const redraw = screenClock > 0.3;
    if (redraw) screenClock = 0;
    for (const set of sets) {
      // Run level 0..1: up after crank, down after utility returns (cool-down).
      const up = ease((c - T_CRANK - set.delay) / 1.8);
      const down = ease((c - T_RESTORE - 1 - set.delay) / 2.2);
      const run = c < T_OUT ? 0 : up * (1 - down);
      const cranking = c > T_CRANK + set.delay && c < T_CRANK + set.delay + 1.1;
      set.fanSpeed += (run * 30 - set.fanSpeed) * Math.min(1, dt * 1.6);
      set.s.fan.rotation.x -= set.fanSpeed * dt;
      const amp = cranking ? 0.011 : run * 0.0032;
      set.s.g.position.set(set.base.x + Math.cos(t * 51 + set.delay) * amp * 0.6, set.base.y + Math.sin(t * 64 + set.delay * 9) * amp, set.base.z + Math.sin(t * 43) * amp * 0.4);
      set.s.led.color.set(run > 0.9 ? 0x39e07a : cranking || Math.sin(t * 2) > 0 ? 0xeaa607 : 0x3a2a05);
      if (redraw) {
        if (run < 0.02) set.s.drawScreen("STANDBY", 0, 0, 0);
        else if (run < 0.92 || c >= T_RESTORE + 1) set.s.drawScreen(c >= T_RESTORE ? "RUN" : "CRANK", 480 * run, 60 * run, 0);
        else set.s.drawScreen("RUN", 480 + Math.round(Math.sin(t * 1.3 + set.delay)), 60, onGen ? 250 + Math.round(Math.sin(t * 0.6 + set.delay * 5) * 6) : 0);
      }
    }

    drawAts(utility ? "UTILITY" : onGen ? "GEN" : "LOST");
    lampU.color.set(utility ? 0x39e07a : Math.sin(t * 9) > 0 ? 0xff3b3b : 0x3a0a0a);
    lampG.color.set(onGen ? 0x39e07a : 0x1a1a1a);

    // Facility lights: on with any source, a quick flicker as the ATS picks up the load.
    const target = utility || onGen ? 1 : 0.02;
    lit += (target - lit) * Math.min(1, dt * (target > lit ? 9 : 14));
    const flick = onGen && c < T_XFER + 0.35 ? 0.6 + Math.sin(t * 70) * 0.4 : 1;
    winMat.emissiveIntensity = lit * flick * 0.8;
    glow.intensity = lit * flick * 14;

    for (const f of feeds) f(t, onGen ? 1 : 0, 0.34);
    utilFeed(t, utility ? 1 : 0, 0.5);
    loadFeed(t, utility || onGen ? lit : 0, 0.26);

    const a = 1.02 + Math.sin(t * 0.09) * 0.2 + px * 0.16;
    const R = 17;
    camera.position.set(0.2 + Math.cos(a) * R, 5 - py * 1.1, -0.6 + Math.sin(a) * R);
    camera.lookAt(0.2, 1.3, -1.6);
  };

  return {
    scene,
    camera,
    update,
    stillTime: 9.5,
    introStart: 1.2,
    dispose() {
      textures.forEach((x) => x.dispose());
    },
  };
}
