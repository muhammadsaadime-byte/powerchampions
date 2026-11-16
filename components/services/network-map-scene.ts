/**
 * <PowerScene variant="map"> — homepage Locations section and /locations.
 * The US dot map in 3D, framed on the Southeast so the three depots read as separate places:
 * - each depot is a light pillar with a pulsing base, a soft coverage disc and a name label;
 * - arcs link the depots and carry pulses;
 * - waves of light travel outward from the network across the rest of the country.
 * Sits in a theme-aware section, so colours and blending follow light/dark. Hovering a location card
 * (data-loc) highlights its beacon.
 */
import * as THREE from "three";
import { LAND, isSoutheast } from "@/components/home/us-dot-map";
import { LOCATIONS } from "@/lib/site";

const GOLD = new THREE.Color("#eaa607");
const ORANGE = new THREE.Color("#f57500");

export function buildNetworkMap(dot: THREE.Texture, host: HTMLElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 200);
  const textures: THREE.Texture[] = [];

  // Same 1° land grid as the SVG map, laid flat (x = east, z = south).
  const S = 0.42;
  const KX = 0.8;
  const toXZ = (lat: number, lon: number) => new THREE.Vector3((lon + 96) * KX * S, 0, (37.5 - lat) * S);
  const depots = LOCATIONS.map((l) => toXZ(l.lat, l.lon));
  const hub = depots.reduce((a, p) => a.add(p), new THREE.Vector3()).multiplyScalar(1 / depots.length);

  /* ── Land dots: one Points cloud, colour and height animated per dot ── */
  const base: number[] = [];
  const isSE: boolean[] = [];
  for (const [latStr, ranges] of Object.entries(LAND)) {
    const lat = Number(latStr);
    for (const [a, b] of ranges)
      for (let lon = a; lon <= b; lon++) {
        const p = toXZ(lat, lon);
        base.push(p.x, p.z);
        isSE.push(isSoutheast(lat, lon));
      }
  }
  const N = isSE.length;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const dist = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = base[i * 2];
    pos[i * 3 + 2] = base[i * 2 + 1];
    dist[i] = Math.hypot(base[i * 2] - hub.x, base[i * 2 + 1] - hub.z);
  }
  const geo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(pos, 3);
  const colAttr = new THREE.BufferAttribute(col, 3);
  geo.setAttribute("position", posAttr);
  geo.setAttribute("color", colAttr);
  const landMat = new THREE.PointsMaterial({ map: dot, size: 0.36, vertexColors: true, transparent: true, depthWrite: false });
  scene.add(new THREE.Points(geo, landMat));

  /* ── Depots ── */
  const font = getComputedStyle(document.body).fontFamily || "sans-serif";
  const label = (title: string, sub: string) => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 128;
    const g = c.getContext("2d")!;
    g.fillStyle = "rgba(16,16,16,0.9)";
    g.fillRect(0, 0, 512, 128);
    g.fillStyle = "#eaa607";
    g.fillRect(0, 0, 8, 128);
    g.fillStyle = "#ffffff";
    g.font = `700 44px ${font}`;
    g.fillText(title, 30, 56, 470);
    g.fillStyle = "rgba(255,255,255,0.72)";
    g.font = `500 27px ${font}`;
    g.fillText(sub, 30, 100, 470);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    textures.push(t);
    return t;
  };
  // Label anchors fan out so the three never overlap: west label to the left, east to the right, north on top.
  const order = depots.map((p, i) => ({ i, x: p.x })).sort((a, b) => a.x - b.x);
  const anchor = new Map<number, { cx: number; cy: number; h: number }>([
    [order[0].i, { cx: 1.06, cy: 0.5, h: 0.95 }],
    [order[1].i, { cx: 0.5, cy: -0.25, h: 2.0 }],
    [order[2].i, { cx: -0.06, cy: 0.5, h: 1.25 }],
  ]);
  const glowMats: THREE.Material[] = [];
  const beacons = LOCATIONS.map((l, i) => {
    const p = depots[i];
    const a = anchor.get(i)!;
    const g = new THREE.Group();
    g.position.copy(p);
    scene.add(g);

    const disc = new THREE.Mesh(new THREE.CircleGeometry(1.25, 64), new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.07, depthWrite: false }));
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = 0.01;
    const rings = [0, 0.5].map((phase) => {
      const r = new THREE.Mesh(new THREE.RingGeometry(0.93, 1, 64), new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
      r.rotation.x = -Math.PI / 2;
      r.position.y = 0.02;
      g.add(r);
      glowMats.push(r.material);
      return { r, phase };
    });
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, a.h, 8), new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.9, depthWrite: false }));
    pillar.position.y = a.h / 2;
    const foot = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: GOLD, transparent: true, depthWrite: false }));
    foot.position.y = 0.06;
    foot.scale.setScalar(0.7);
    const head = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: ORANGE, transparent: true, depthWrite: false }));
    head.position.y = a.h;
    const tag = new THREE.Sprite(new THREE.SpriteMaterial({ map: label(`${l.city.split(",")[0]}, ${l.region}`, l.name), transparent: true, depthWrite: false, depthTest: false }));
    tag.center.set(a.cx, a.cy);
    tag.position.y = a.h;
    tag.renderOrder = 10;
    g.add(disc, pillar, foot, head, tag);
    glowMats.push(disc.material, foot.material, head.material);
    return { id: l.id, p, rings, head, foot, tag, disc, hot: 0, seed: i * 2.1 };
  });

  const links = [
    [0, 1],
    [1, 2],
    [2, 0],
  ].map(([a, b], i) => {
    const pa = depots[a].clone().setY(0.08);
    const pb = depots[b].clone().setY(0.08);
    const mid = pa.clone().add(pb).multiplyScalar(0.5);
    mid.y = 0.75;
    const curve = new THREE.QuadraticBezierCurve3(pa, mid, pb);
    const lineMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.8, depthWrite: false });
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)), lineMat));
    const pulse = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: ORANGE, transparent: true, depthWrite: false }));
    pulse.scale.setScalar(0.34);
    scene.add(pulse);
    glowMats.push(pulse.material);
    return { curve, pulse, o: i / 3 };
  });

  /* ── Theme ── */
  const cDim = new THREE.Color();
  const cSE = new THREE.Color();
  const cWave = new THREE.Color();
  const applyTheme = () => {
    const rgb = getComputedStyle(host).color.match(/[\d.]+/g)?.map(Number) ?? [255, 255, 255];
    const light = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255 < 0.5; // dark text = light theme
    cDim.set(light ? "#b4b4b4" : "#3c3c3c");
    cSE.set(light ? "#b37400" : "#a87705");
    cWave.set(light ? "#8f5b00" : "#ffc233");
    const blend = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    for (const m of [landMat, ...glowMats]) {
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

  const tmp = new THREE.Color();
  const update = (t: number, dt: number, px: number, py: number) => {
    // Waves leave the network every ~3.5s and fade with distance.
    for (let i = 0; i < N; i++) {
      const d = dist[i];
      const w = Math.pow(Math.max(0, Math.sin(d * 0.85 - t * 1.8)), 8) * Math.exp(-d * 0.085);
      pos[i * 3 + 1] = w * 0.22;
      tmp.copy(isSE[i] ? cSE : cDim).lerp(cWave, Math.min(1, w * 1.4));
      col[i * 3] = tmp.r;
      col[i * 3 + 1] = tmp.g;
      col[i * 3 + 2] = tmp.b;
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    for (const b of beacons) {
      b.hot += ((isHot(b.id) ? 1 : 0) - b.hot) * Math.min(1, dt * 10);
      for (const { r, phase } of b.rings) {
        const u = (t * 0.45 + phase + b.seed) % 1;
        r.scale.setScalar(0.25 + u * (1.1 + b.hot * 0.5));
        (r.material as THREE.MeshBasicMaterial).opacity = (1 - u) * 0.85;
      }
      const beat = 1 + Math.sin(t * 3 + b.seed) * 0.12;
      b.head.scale.setScalar(0.42 * beat * (1 + b.hot * 0.8));
      b.foot.scale.setScalar(0.7 * (1 + b.hot * 0.6));
      (b.disc.material as THREE.MeshBasicMaterial).opacity = 0.06 + b.hot * 0.1 + Math.sin(t * 1.2 + b.seed) * 0.015;
      const k = 1 + b.hot * 0.12;
      b.tag.scale.set(2.9 * k, 0.725 * k, 1);
    }
    for (const l of links) {
      const u = (t * 0.32 + l.o) % 1;
      l.pulse.position.copy(l.curve.getPoint(u));
      (l.pulse.material as THREE.SpriteMaterial).opacity = Math.sin(u * Math.PI);
    }

    // Low three-quarter view from the south-east, looking across the network to the rest of the country.
    const sway = Math.sin(t * 0.14) * 0.1 + px * 0.14;
    camera.position.set(hub.x + 1.2 + Math.sin(sway) * 3.5, 9.2 - py * 0.9, hub.z + 11.5);
    camera.lookAt(hub.x - 2.3, 0, hub.z - 0.4);
  };

  return {
    scene,
    camera,
    update,
    dispose() {
      mo.disconnect();
      mq.removeEventListener("change", applyTheme);
      textures.forEach((x) => x.dispose());
    },
  };
}
