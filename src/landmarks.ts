// 実在ランドマーク
//   鞆の浦 常夜燈   — 鞆港の雁木の北に立つ高さ 11m の石造常夜燈 (1859年)
//   弁天島           — 鞆港の沖に浮かぶ、朱塗りの弁天堂と塔の小島
//   芦田川大橋       — 県道380号の斜張橋。PLATEAU の tran には路面しか無いので主塔とケーブルを足す
//
// 福山城天守は PLATEAU 福山市の LOD2 (実写テクスチャ) に入っているので、
// ここでは何もしない (src/lod2.ts がそのまま描く)。
import * as THREE from 'three';
import railData from '../data/rail.json';
import { llToXZ, rng } from './geo';
import type { Terrain } from './terrain';
import type { Track } from './track';
import { makeSignTexture } from './textures';
import { isJa } from './i18n';

type LandmarkInfo = { name: string; lat: number; lon: number; headingDeg: number; excludeRadius: number };
const LM = (railData as any).landmarks as Record<string, LandmarkInfo>;

/**
 * ランドマークの専用モデルと重なる PLATEAU 建物を除く。
 *
 * tools/convert_citygml.mjs も同じ除外を行うが、あちらはデータ生成時にしか効かない。
 * 生成済みの public/data/ を作り直さずにランドマークを足せるよう、実行時にも判定する。
 */
export function landmarkBlocksBuilding(ring: number[]): boolean {
  for (const info of Object.values(LM)) {
    if (!info.excludeRadius) continue;
    const [lx, lz] = llToXZ(info.lat, info.lon);
    const r2 = info.excludeRadius * info.excludeRadius;
    for (let k = 0; k + 1 < ring.length; k += 2) {
      const dx = ring[k] - lx, dz = ring[k + 1] - lz;
      if (dx * dx + dz * dz < r2) return true;
    }
  }
  return false;
}

/** 水際に立つものの足元の高さ。水面セルなら岸の高さを拾う */
function shoreHeight(terrain: Terrain, x: number, z: number): number {
  const h = terrain.heightAt(x, z);
  return h !== null ? h : Math.max(terrain.groundHeight(x, z), terrain.WATER_LEVEL + 1.2);
}

/**
 * 鞆の浦 常夜燈。安政6年 (1859) 建立、基壇まで含めて高さ 11m あり、
 * 港の常夜燈としては現存最大級。石積みの基壇・角柱の竿・火袋 (四方に窓)・
 * 宝形の笠・擬宝珠という積み方をそのまま起こす。港の雁木の際に立つ。
 */
export function buildJoyato(terrain: Terrain): THREE.Group {
  const info = LM.joyato;
  const g = new THREE.Group();
  const [x, z] = llToXZ(info.lat, info.lon);
  g.position.set(x, shoreHeight(terrain, x, z), z);
  g.rotation.y = THREE.MathUtils.degToRad(info.headingDeg);

  const stone = new THREE.MeshLambertMaterial({ color: 0xbdb5a4 });
  const darkStone = new THREE.MeshLambertMaterial({ color: 0x9a9384 });
  const add = (mesh: THREE.Mesh, y: number) => { mesh.position.y = y; mesh.castShadow = true; mesh.receiveShadow = true; g.add(mesh); return mesh; };

  // 基壇 (石積み 2 段)
  add(new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.9, 5.6), darkStone), 0.45);
  add(new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.8, 4.2), darkStone), 1.3);
  // 台石
  add(new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.7, 2.8), stone), 2.05);
  // 竿 (八角の柱。上へ少し細る)
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.95, 4.6, 8), stone), 4.7);
  // 中台
  add(new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.15, 0.5, 8), stone), 7.25);
  // 火袋 (四方に窓。灯りが入る所なので中を明るくしておく)
  add(new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.35, 1.8, 8), stone), 8.4);
  const glow = new THREE.Mesh(
    new THREE.CylinderGeometry(1.05, 1.1, 1.5, 8),
    new THREE.MeshBasicMaterial({ color: 0xffdca0 }),
  );
  glow.position.y = 8.4;
  g.add(glow);
  // 笠 (宝形) と擬宝珠
  add(new THREE.Mesh(new THREE.ConeGeometry(2.3, 1.5, 4), stone), 10.05).rotation.y = Math.PI / 4;
  add(new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), stone), 11.0);

  // 案内板
  const signTex = makeSignTexture(isJa ? '鞆の浦 常夜燈' : 'Tomonoura Joyato', isJa ? 'Tomonoura Joyato (1859)' : '鞆の浦 常夜燈');
  const board = new THREE.Mesh(new THREE.PlaneGeometry(8, 1.5), new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide }));
  board.position.set(0, 2.6, 5.4);
  g.add(board);
  for (const s of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.6, 6), darkStone);
    leg.position.set(s * 3.4, 1.3, 5.4);
    g.add(leg);
  }
  return g;
}

/**
 * 弁天島。鞆港の沖に浮かぶ小島で、朱塗りの弁天堂と小さな多宝塔が建つ。
 * 島そのものは DEM に標高 8m ほどの平たい陸として入っているが、地面の色は
 * 市街地と同じ砂色になってしまうので、島の上に緑を敷いてから建物を置く。
 */
export function buildBentenjima(terrain: Terrain): THREE.Group {
  const info = LM.bentenjima;
  const g = new THREE.Group();
  const [x, z] = llToXZ(info.lat, info.lon);
  const top = shoreHeight(terrain, x, z);
  g.position.set(x, top, z);

  // 島の上の緑 (地面から少しだけ浮かせて、DEM の凹凸に負けないようにする)
  const R = 26;
  const shape = new THREE.Shape();
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    const r = R * (0.82 + 0.18 * Math.cos(t * 3));
    if (i === 0) shape.moveTo(Math.cos(t) * r, Math.sin(t) * r * 0.78);
    else shape.lineTo(Math.cos(t) * r, Math.sin(t) * r * 0.78);
  }
  const grass = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshLambertMaterial({ color: 0x4f7340 }));
  grass.rotation.x = -Math.PI / 2;
  grass.position.y = 0.3;
  grass.receiveShadow = true;
  g.add(grass);

  const vermilion = new THREE.MeshLambertMaterial({ color: 0xc8452f });
  const roofMat = new THREE.MeshLambertMaterial({ color: 0x4a5560 });
  const white = new THREE.MeshLambertMaterial({ color: 0xeae4d8 });

  /** 宝形屋根を 1 段 */
  const roof = (r: number, h: number, y: number, parent: THREE.Group) => {
    const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, 4), roofMat);
    m.position.y = y;
    m.rotation.y = Math.PI / 4;
    m.castShadow = true;
    parent.add(m);
  };

  // 弁天堂 (朱塗りの小さなお堂)
  const hall = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(6, 3.4, 6), vermilion);
  body.position.y = 1.9;
  body.castShadow = true;
  hall.add(body);
  roof(5.6, 2.4, 4.8, hall);
  hall.position.set(-7, 0.3, 2);
  g.add(hall);

  // 多宝塔 (白い亀腹の上に朱の上層)
  const tower = new THREE.Group();
  const t1 = new THREE.Mesh(new THREE.BoxGeometry(4.6, 3.2, 4.6), vermilion);
  t1.position.y = 1.8;
  t1.castShadow = true;
  tower.add(t1);
  roof(4.6, 1.8, 4.3, tower);
  const drum = new THREE.Mesh(new THREE.SphereGeometry(2.0, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), white);
  drum.position.y = 5.0;
  tower.add(drum);
  const t2 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.6, 2.4, 10), vermilion);
  t2.position.y = 6.3;
  t2.castShadow = true;
  tower.add(t2);
  roof(3.4, 1.6, 8.2, tower);
  const sorin = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 2.6, 6), new THREE.MeshLambertMaterial({ color: 0x6f6350 }));
  sorin.position.y = 10.1;
  tower.add(sorin);
  tower.position.set(6, 0.3, -2);
  g.add(tower);

  // 松 (島の縁に数本)
  const rand = rng(1859);
  const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5a4636 });
  const leafMat = new THREE.MeshLambertMaterial({ color: 0x2f5a34 });
  for (let i = 0; i < 7; i++) {
    const t = (i / 7) * Math.PI * 2;
    const px = Math.cos(t) * R * 0.72, pz = Math.sin(t) * R * 0.55;
    const h = 6 + rand() * 3;
    const pine = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.4, h, 6), trunkMat);
    trunk.position.y = h / 2;
    trunk.rotation.z = (rand() - 0.5) * 0.4;
    trunk.castShadow = true;
    pine.add(trunk);
    for (let k = 0; k < 3; k++) {
      const r = 2.6 - k * 0.6 + rand() * 0.6;
      const crown = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 5), leafMat);
      crown.scale.set(r, 0.65, r);
      crown.position.set((rand() - 0.5) * 1.4, h - 1.1 + k, (rand() - 0.5) * 1.4);
      crown.castShadow = true;
      pine.add(crown);
    }
    pine.position.set(px, 0.3, pz);
    g.add(pine);
  }
  return g;
}

/**
 * 芦田川大橋の主塔とケーブル。
 *
 * PLATEAU の tran (道路) には路面のポリゴンしか無いので、走るだけでは橋がただの
 * 直線になる。福山市で最初の斜張橋という見どころなので、コースが水面を渡っている
 * 区間 (Track.bridge) を拾って、その中央に主塔を立て、前後の路面へケーブルを張る。
 */
export function buildAshidaBridge(track: Track): THREE.Group {
  const info = LM.ashidaBridge;
  const g = new THREE.Group();
  const [lx, lz] = llToXZ(info.lat, info.lon);

  // 橋の区間 (水面上) のうち、芦田川大橋に当たるものを探す
  const n = track.n;
  let center = -1, bd = Infinity;
  for (let i = 0; i < n; i++) {
    if (!track.bridge[i]) continue;
    const d = Math.hypot(track.px[i] - lx, track.pz[i] - lz);
    if (d < bd) { bd = d; center = i; }
  }
  if (center < 0 || bd > 200) { console.warn('芦田川大橋の橋梁区間が見つかりませんでした'); return g; }
  // 区間の端を探して、その真ん中に主塔を置く
  let a = center, b = center;
  while (track.bridge[(a - 1 + n) % n] && (center - a + n) % n < 400) a = (a - 1 + n) % n;
  while (track.bridge[(b + 1) % n] && (b - center + n) % n < 400) b = (b + 1) % n;
  const span = (b - a + n) % n;
  if (span < 20) return g;
  const mid = (a + Math.floor(span / 2)) % n;

  const px = track.px[mid], pz = track.pz[mid], py = track.py[mid];
  const tx = track.tx[mid], tz = track.tz[mid];
  const nx = track.nx[mid], nz = track.nz[mid];
  const yaw = Math.atan2(tx, tz);

  const concrete = new THREE.MeshLambertMaterial({ color: 0xd8d4cb });
  const cableMat = new THREE.MeshBasicMaterial({ color: 0x9aa2a8 });
  const TOWER_H = 34;                    // 路面からの主塔の高さ
  const ARM = track.hw[mid] + 1.2;       // 路面の外へ立てる位置

  // 主塔 (路面の両側に 1 本ずつ立て、頂部を梁でつなぐ)
  const tower = new THREE.Group();
  tower.position.set(px, py, pz);
  tower.rotation.y = yaw;
  for (const s of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(1.8, TOWER_H, 2.4), concrete);
    leg.position.set(s * ARM, TOWER_H / 2 - 1, 0);
    leg.castShadow = true;
    tower.add(leg);
  }
  const beam = new THREE.Mesh(new THREE.BoxGeometry(ARM * 2, 2.2, 2.0), concrete);
  beam.position.set(0, TOWER_H - 4, 0);
  beam.castShadow = true;
  tower.add(beam);
  g.add(tower);

  // ケーブル (前後それぞれ 6 本ずつ、扇状に路面へ)
  const topY = py + TOWER_H - 5;
  const step = Math.max(2, Math.floor(span / 14));
  const tube = (from: THREE.Vector3, to: THREE.Vector3) => {
    const dir = new THREE.Vector3().subVectors(to, from);
    const len = dir.length();
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, len, 5), cableMat);
    m.position.copy(from).addScaledVector(dir, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return m;
  };
  for (const s of [-1, 1]) {
    const top = new THREE.Vector3(px + nx * s * ARM, topY, pz + nz * s * ARM);
    for (const dir of [-1, 1]) for (let k = 1; k <= 6; k++) {
      const j = (mid + dir * k * step + n) % n;
      const anchor = new THREE.Vector3(
        track.px[j] + track.nx[j] * s * (track.hw[j] + 0.6),
        track.py[j] + 1.2,
        track.pz[j] + track.nz[j] * s * (track.hw[j] + 0.6),
      );
      g.add(tube(top, anchor));
    }
  }
  return g;
}
