/**
 * Realistic diesel generator set for <PowerScene variant="generator"> (Who We Are hero).
 * Modelled procedurally, no model download. What makes it read as real rather than a wireframe:
 * - image-based lighting from a tiny painted studio panorama, so the painted steel reflects, ACES tone mapping, and a baked soft contact shadow on a concrete pad.
 *   (Measured on Intel HD 530, cold cache: real-time shadow maps cost ~1.6s of main-thread stall on
 *   first load and RoomEnvironment ~0.3s; this setup costs a few tens of ms. Don't reintroduce them.)
 * - rounded sheet-metal panels, separate doors with handles and hinges, intake louvers, a glazed
 *   controller window with a live readout, an open radiator shroud with core, fan and guard,
 *   forklift pockets, lifting eyes, power cables. The roof is clean: the client asked for no exhaust
 *   stack and no smoke (2026-11-16), so the silencer is assumed internal.
 * Sequence: assemble (0–2.2s) → crank (kick, fan spools, controller boots) → running
 * (idle vibration, readout holds 480 V / 60 Hz, cable pulses).
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const GOLD = new THREE.Color("#eaa607");

type Update = (t: number, dt: number, px: number, py: number) => void;

export function buildGenerator(dot: THREE.Texture, renderer: THREE.WebGLRenderer, lite = false) {
  // lite: software rendering. No environment map; a plain hemisphere light stands in.
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const textures: THREE.Texture[] = [];

  // Reflections: a neutral studio environment, kept low so the dark hero stays dark.
  // Reflections: a 64x32 painted "studio" panorama (dark room, soft ceiling box, warm side strip).
  if (lite) {
    scene.add(new THREE.HemisphereLight(0xffffff, 0x30281a, 1.4));
  } else {
    const ec = document.createElement("canvas");
    ec.width = 64;
    ec.height = 32;
    const eg = ec.getContext("2d")!;
    const sky = eg.createLinearGradient(0, 0, 0, 32);
    sky.addColorStop(0, "#f2f4f8");
    sky.addColorStop(0.45, "#8d9299");
    sky.addColorStop(0.55, "#34363a");
    sky.addColorStop(1, "#141414");
    eg.fillStyle = sky;
    eg.fillRect(0, 0, 64, 32);
    eg.fillStyle = "#ffffff";
    eg.fillRect(4, 2, 26, 8); // key softbox
    eg.fillStyle = "#cfd6e4";
    eg.fillRect(38, 5, 12, 4); // cool fill
    eg.fillStyle = "#eaa607";
    eg.fillRect(54, 12, 6, 3); // warm brand kicker
    const envT = new THREE.CanvasTexture(ec);
    envT.mapping = THREE.EquirectangularReflectionMapping;
    envT.colorSpace = THREE.SRGBColorSpace;
    textures.push(envT);
    scene.environment = envT;
    scene.environmentIntensity = 1.5;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x2a241a, 0.5));
  }

  const key = new THREE.DirectionalLight(0xfff1dd, 2.6);
  key.position.set(6, 9, 7);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xcfd9ff, 0.5);
  fill.position.set(-7, 4, 5);
  scene.add(fill);
  const rim = new THREE.PointLight(GOLD, 26, 22, 1.8);
  rim.position.set(-3, 5, -6);
  scene.add(rim);

  /* ── Materials ── */
  const paint = new THREE.MeshStandardMaterial({ color: 0x5b6067, metalness: 0.4, roughness: 0.38 });
  const paintDark = new THREE.MeshStandardMaterial({ color: 0x1c1d20, metalness: 0.4, roughness: 0.55 });
  const black = new THREE.MeshStandardMaterial({ color: 0x08090a, metalness: 0.2, roughness: 0.8 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x9a9ea3, metalness: 1, roughness: 0.32 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x0b0b0c, metalness: 0, roughness: 0.75 });
  const goldPaint = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.5, roughness: 0.4 });
  const concrete = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, metalness: 0, roughness: 0.95 });

  const box = (w: number, h: number, d: number, m: THREE.Material) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  const rbox = (w: number, h: number, d: number, r: number, m: THREE.Material) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), m);
  const cyl = (rt: number, rb: number, h: number, m: THREE.Material, seg = 28) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
  const at = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number) => {
    o.position.set(x, y, z);
    return o;
  };

  const L = 4.3; // overall length (x): control/alternator end at -x, radiator at +x
  const W = 1.5; // width (z)
  const PAD = 0.12;
  const SKID = 0.2;
  const TANK = 0.34;
  const EH = 1.6;
  const baseY = SKID + TANK; // enclosure bottom
  const roofY = baseY + EH;

  // Concrete pad (static) with the set bolted on top.
  const pad = at(box(L + 1.4, PAD, W + 1.2, concrete), 0, PAD / 2, 0);
  scene.add(pad);
  // Baked contact shadow: a soft dark blob on the pad under the set, and a wider one under the pad.
  const blob = (w: number, d: number, y: number, opacity: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: dot, color: 0x000000, transparent: true, opacity, depthWrite: false }));
    m.rotation.x = -Math.PI / 2;
    m.position.y = y;
    scene.add(m);
  };
  blob(L + 3.4, W + 3.2, 0.002, 0.55);
  blob(L + 1.1, W + 1.0, PAD + 0.002, 0.75);

  const gen = at(new THREE.Group(), 0, PAD, 0);
  scene.add(gen);
  const stage = (delay: number, from: THREE.Vector3) => {
    const g = new THREE.Group();
    gen.add(g);
    return { g, delay, from };
  };
  const up = new THREE.Vector3(0, 2.4, 0);
  const sSkid = stage(0, up);
  const sTank = stage(0.3, up);
  const sBody = stage(0.6, up);
  const sDoorsF = stage(1.05, new THREE.Vector3(0, 0, 1.1));
  const sDoorsB = stage(1.05, new THREE.Vector3(0, 0, -1.1));
  const sRoof = stage(1.4, up);
  const stages = [sSkid, sTank, sBody, sDoorsF, sDoorsB, sRoof];

  /* ── Skid with forklift pockets ── */
  sSkid.g.add(at(rbox(L + 0.2, SKID, W, 0.02, paintDark), 0, SKID / 2, 0));
  for (const side of [1, -1])
    for (const x of [-1.0, 1.0]) sSkid.g.add(at(box(0.5, 0.11, 0.02, black), x, SKID / 2, side * (W / 2 + 0.001)));

  /* ── Fuel-tank base, gold stripe, cable junction box ── */
  sTank.g.add(at(rbox(L, TANK, W - 0.02, 0.025, paintDark), 0, SKID + TANK / 2, 0));
  for (const side of [1, -1]) sTank.g.add(at(box(L - 0.9, 0.035, 0.006, goldPaint), 0.25, SKID + TANK - 0.09, side * (W / 2 - 0.008)));
  const jbx = -1.75;
  sTank.g.add(at(rbox(0.42, 0.26, 0.09, 0.015, paint), jbx, SKID + TANK / 2, W / 2 + 0.03));

  /* ── Enclosure body + open radiator shroud at +x ── */
  const SH = 0.3; // shroud depth
  const bodyL = L - SH;
  const bodyX = -SH / 2;
  const WD = W - 0.04;
  sBody.g.add(at(rbox(bodyL, EH, WD, 0.035, paint), bodyX, baseY + EH / 2, 0));
  const shX = L / 2 - SH / 2;
  sBody.g.add(at(box(SH, 0.14, WD, paint), shX, baseY + 0.07, 0));
  sBody.g.add(at(box(SH, 0.14, WD, paint), shX, roofY - 0.07, 0));
  for (const side of [1, -1]) sBody.g.add(at(box(SH, EH, 0.1, paint), shX, baseY + EH / 2, side * (WD / 2 - 0.05)));
  // Radiator core: fine vertical fins (canvas texture) at the back of the shroud.
  const finC = document.createElement("canvas");
  finC.width = 256;
  finC.height = 8;
  const fg = finC.getContext("2d")!;
  for (let i = 0; i < 256; i++) {
    fg.fillStyle = i % 4 < 2 ? "#3a3d40" : "#0c0d0e";
    fg.fillRect(i, 0, 1, 8);
  }
  const finT = new THREE.CanvasTexture(finC);
  finT.wrapS = finT.wrapT = THREE.RepeatWrapping;
  finT.repeat.set(3, 1);
  finT.colorSpace = THREE.SRGBColorSpace;
  textures.push(finT);
  const core = new THREE.Mesh(new THREE.PlaneGeometry(WD - 0.2, EH - 0.28), new THREE.MeshStandardMaterial({ map: finT, metalness: 0.6, roughness: 0.5 }));
  core.rotation.y = Math.PI / 2;
  sBody.g.add(at(core, L / 2 - SH + 0.004, baseY + EH / 2, 0));
  // Fan: hub + pitched blades, spinning about x.
  const fan = at(new THREE.Group(), L / 2 - SH + 0.12, baseY + EH / 2, 0);
  const hub = cyl(0.11, 0.11, 0.1, steel);
  hub.rotation.z = Math.PI / 2;
  fan.add(hub);
  for (let b = 0; b < 8; b++) {
    const arm = new THREE.Group();
    arm.rotation.x = (b / 8) * Math.PI * 2;
    const blade = at(box(0.015, 0.46, 0.2, paintDark), 0, 0.33, 0);
    blade.rotation.y = 0.55;
    arm.add(blade);
    fan.add(arm);
  }
  sBody.g.add(fan);
  // Guard: horizontal bars + two uprights.
  const gx = L / 2 - 0.03;
  for (let i = 0; i < 17; i++) sBody.g.add(at(box(0.02, 0.014, WD - 0.2, steel), gx, baseY + 0.2 + i * ((EH - 0.4) / 16), 0));
  for (const z of [-0.3, 0.3]) sBody.g.add(at(box(0.024, EH - 0.3, 0.02, steel), gx - 0.012, baseY + EH / 2, z));

  /* ── Doors (both sides): 3 hinged doors + fixed end panel ── */
  const DW = 1.0;
  const DH = EH - 0.2;
  const doorXs = [-1.5, -0.42, 0.66];
  const doorY = baseY + EH / 2;
  const zFace = WD / 2;
  const SLATS = 11;
  for (const [st, side] of [
    [sDoorsF, 1],
    [sDoorsB, -1],
  ] as const) {
    doorXs.forEach((x) => {
      st.g.add(at(rbox(DW, DH, 0.024, 0.01, paint), x, doorY, side * (zFace + 0.008)));
      st.g.add(at(rbox(0.045, 0.2, 0.035, 0.008, steel), x + DW / 2 - 0.09, doorY - 0.1, side * (zFace + 0.036))); // handle
      for (const hy of [-0.5, 0.5]) st.g.add(at(cyl(0.016, 0.016, 0.12, steel, 12), x - DW / 2 - 0.012, doorY + hy, side * (zFace + 0.016))); // hinges
    });
    // Intake louvers on the middle door.
    const lx = doorXs[1];
    st.g.add(at(box(0.8, 0.82, 0.012, black), lx, doorY + 0.18, side * (zFace + 0.022)));
    const slats = new THREE.InstancedMesh(new THREE.BoxGeometry(0.8, 0.012, 0.07), paint, SLATS);
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(side * 0.75, 0, 0));
    for (let s = 0; s < SLATS; s++) {
      m4.compose(new THREE.Vector3(lx, doorY - 0.2 + s * 0.075, side * (zFace + 0.045)), q, new THREE.Vector3(1, 1, 1));
      slats.setMatrixAt(s, m4);
    }
    st.g.add(slats);
    st.g.add(at(rbox(0.86, 0.88, 0.02, 0.008, paintDark), lx, doorY + 0.18, side * (zFace + 0.016))); // louver frame
  }

  /* ── Controller window, e-stop and labels on the front (+z) side ── */
  const font = getComputedStyle(document.body).fontFamily || "sans-serif";
  const scrC = document.createElement("canvas");
  scrC.width = 256;
  scrC.height = 128;
  const sg = scrC.getContext("2d")!;
  const scrT = new THREE.CanvasTexture(scrC);
  scrT.colorSpace = THREE.SRGBColorSpace;
  textures.push(scrT);
  const drawScreen = (state: "OFF" | "CRANK" | "RUN", v: number, hz: number, kw: number) => {
    sg.fillStyle = state === "OFF" ? "#020403" : "#06140c";
    sg.fillRect(0, 0, 256, 128);
    if (state !== "OFF") {
      sg.font = `700 22px ${font}`;
      sg.fillStyle = state === "RUN" ? "#39e07a" : "#eaa607";
      sg.fillText(state === "RUN" ? "● RUNNING" : "● CRANKING", 12, 30);
      sg.fillStyle = "#cfeeda";
      sg.font = `700 26px ${font}`;
      sg.fillText(`${v.toFixed(0)} V`, 12, 70);
      sg.fillText(`${hz.toFixed(1)} Hz`, 132, 70);
      sg.fillText(`${kw.toFixed(0)} kW`, 12, 108);
      sg.fillStyle = "#39e07a";
      sg.fillRect(132, 92, Math.min(1, kw / 300) * 110, 14);
      sg.strokeStyle = "#2a6e45";
      sg.strokeRect(132, 92, 110, 14);
    }
    scrT.needsUpdate = true;
  };
  drawScreen("OFF", 0, 0, 0);
  const wx = doorXs[0];
  const wy = doorY + 0.3;
  const zDoor = zFace + 0.021;
  sDoorsF.g.add(at(rbox(0.56, 0.4, 0.02, 0.01, black), wx, wy, zDoor)); // window frame
  sDoorsF.g.add(at(new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.2), new THREE.MeshBasicMaterial({ map: scrT, toneMapped: false })), wx - 0.04, wy + 0.03, zDoor + 0.012));
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.34),
    new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.14 }),
  );
  sDoorsF.g.add(at(glass, wx, wy, zDoor + 0.02));
  const ledMats = [0, 1, 2].map((i) => {
    const m = new THREE.MeshBasicMaterial({ color: 0x151515, toneMapped: false });
    sDoorsF.g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 10), m), wx - 0.18 + i * 0.05, wy - 0.12, zDoor + 0.014));
    return m;
  });
  // Emergency stop: red mushroom on a yellow plate.
  const es = at(new THREE.Group(), wx + 0.2, wy - 0.42, zDoor);
  const plate = cyl(0.07, 0.07, 0.008, new THREE.MeshStandardMaterial({ color: 0xf2c200, roughness: 0.5 }));
  plate.rotation.x = Math.PI / 2;
  const mush = cyl(0.042, 0.03, 0.04, new THREE.MeshStandardMaterial({ color: 0xc2161a, roughness: 0.35 }));
  mush.rotation.x = Math.PI / 2;
  mush.position.z = 0.025;
  es.add(plate, mush);
  sDoorsF.g.add(es);

  // Brand decal on the third door.
  const logoC = document.createElement("canvas");
  logoC.width = 512;
  logoC.height = 256;
  const lg = logoC.getContext("2d")!;
  lg.fillStyle = "#eaa607";
  lg.beginPath();
  for (const [px, py, i] of [
    [118, 40, 0],
    [52, 138, 1],
    [96, 138, 2],
    [70, 216, 3],
    [150, 108, 4],
    [104, 108, 5],
  ] as const)
    if (i === 0) lg.moveTo(px, py);
    else lg.lineTo(px, py);
  lg.closePath();
  lg.fill();
  lg.fillStyle = "#f4f4f4";
  lg.font = `italic 800 54px ${font}`;
  lg.fillText("Power", 172, 116);
  lg.fillText("Champions", 172, 178, 330);
  const logoT = new THREE.CanvasTexture(logoC);
  logoT.colorSpace = THREE.SRGBColorSpace;
  logoT.anisotropy = 8;
  textures.push(logoT);
  sDoorsF.g.add(
    at(new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.42), new THREE.MeshStandardMaterial({ map: logoT, transparent: true, roughness: 0.5, metalness: 0.1 })), doorXs[2] - 0.02, doorY + 0.25, zDoor + 0.003),
  );
  // Warning label on the fixed end panel.
  const fxp = 1.52;
  sDoorsF.g.add(at(new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.13), new THREE.MeshStandardMaterial({ color: 0xf1f1f1, roughness: 0.6 })), fxp, doorY + 0.42, zFace + 0.019));
  sDoorsF.g.add(at(new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.045), new THREE.MeshStandardMaterial({ color: 0xc2161a, roughness: 0.6 })), fxp, doorY + 0.462, zFace + 0.02));

  /* ── Roof and lifting eyes ── */
  sRoof.g.add(at(rbox(L + 0.06, 0.07, W + 0.03, 0.02, paint), 0, roofY + 0.02, 0));
  for (const x of [-L / 2 + 0.3, L / 2 - 0.3])
    for (const z of [-W / 2 + 0.16, W / 2 - 0.16]) {
      const eye = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 10, 24), steel);
      sRoof.g.add(at(eye, x, roofY + 0.11, z));
    }

  /* ── Power cables from the junction box across the pad, with travelling pulses ── */
  const cables = [-0.12, 0, 0.12].map((dx, i) => {
    const x0 = jbx + dx;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x0, PAD + SKID + 0.06, W / 2 + 0.07),
      new THREE.Vector3(x0, PAD + 0.05, W / 2 + 0.2),
      new THREE.Vector3(x0 - 0.1, PAD + 0.035, W / 2 + 0.5),
      new THREE.Vector3(x0 - 0.6 - i * 0.15, 0.05, W / 2 + 0.75 + i * 0.12),
      new THREE.Vector3(x0 - 2.2, 0.035, W / 2 + 1.5 + i * 0.3),
      new THREE.Vector3(x0 - 5.5, 0.035, W / 2 + 2.6 + i * 0.5),
    ]);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, 0.032, 10), rubber);
    scene.add(tube);
    const pulses = [0, 0.5].map((o) => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: GOLD, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
      s.scale.setScalar(0.3);
      scene.add(s);
      return { s, o: o + i * 0.17 };
    });
    return { curve, pulses };
  });

  // Faint pad ring: the one stylised "power" cue kept from the earlier version.
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.985, 1, 128),
    new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.004;
  scene.add(ring);

  const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
  const START = 2.3;
  let fanSpeed = 0;
  let screenClock = 1;
  const update: Update = (t, dt, px, py) => {
    // 1. Assembly.
    for (const st of stages) {
      const k = ease((t - st.delay) / 0.75);
      st.g.position.copy(st.from).multiplyScalar(1 - k);
      st.g.visible = k > 0.001;
    }
    // 2. Crank (START → +1.2s), then running.
    const run = ease((t - START) / 1.8);
    const cranking = t > START && t < START + 1.2;
    fanSpeed += (run * 30 - fanSpeed) * Math.min(1, dt * 1.6);
    fan.rotation.x += fanSpeed * dt;

    screenClock += dt;
    if (screenClock > 0.3) {
      screenClock = 0;
      if (t < START - 0.3) drawScreen("OFF", 0, 0, 0);
      else if (run < 0.92) drawScreen("CRANK", 480 * run, 60 * run, 0);
      else drawScreen("RUN", 480 + Math.sin(t * 1.3) * 1.2, 60 + Math.sin(t * 0.9) * 0.04, 250 + Math.sin(t * 0.6) * 6);
    }
    ledMats[0].color.set(t > START - 0.3 ? 0x39e07a : 0x151515);
    ledMats[1].color.set(cranking || (run > 0.9 && Math.sin(t * 4) > 0.6) ? 0xeaa607 : 0x151515);
    ledMats[2].color.set(0x151515);

    // Engine shake: a kick while cranking, a fine buzz when running.
    const amp = cranking ? 0.012 : run * 0.0035;
    gen.position.set(Math.cos(t * 51) * amp * 0.6, PAD + Math.sin(t * 64) * amp, Math.sin(t * 43) * amp * 0.4);
    gen.rotation.z = Math.sin(t * 38) * amp * 0.25;
    for (const c of cables)
      for (const p of c.pulses) {
        const u = (t * 0.3 + p.o) % 1;
        p.s.position.copy(c.curve.getPoint(u)).y += 0.04;
        (p.s.material as THREE.SpriteMaterial).opacity = run * Math.sin(u * Math.PI) * 0.9;
      }
    const ru = (t * 0.35) % 1;
    ring.scale.setScalar(3.4 + ru * 2.6);
    (ring.material as THREE.MeshBasicMaterial).opacity = run * (1 - ru) * 0.3;

    // Camera: slow swing around the front three-quarter view, plus pointer parallax.
    const a = 0.86 + Math.sin(t * 0.11) * 0.3 + px * 0.22;
    // In a framed stage (homepage showcase, narrower than the hero) the camera sits closer and centres the set.
    const stage = camera.aspect < 1.7;
    const R = stage ? 9.6 : 12.2;
    camera.position.set(Math.cos(a) * R, (stage ? 3.4 : 3.9) - py * 1.1, Math.sin(a) * R);
    camera.lookAt(stage ? -0.1 : -0.2, stage ? 0.95 : 1.5, 0.2);
  };

  return {
    scene,
    camera,
    update,
    stillTime: 9,
    introStart: 0,
    dispose() {
      textures.forEach((x) => x.dispose());
    },
  };
}
