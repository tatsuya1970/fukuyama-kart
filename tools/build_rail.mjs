// OpenStreetMap の線路 (data/osm/rail_raw.json) から data/rail.json を組み立てる。
//   node tools/fetch_rail.mjs && node tools/build_rail.mjs
// ・同じ路線名の way を端点でつないで 1 本の折れ線にする
// ・コースの周り (BBOX) だけ切り出して 60m 間隔に間引く
// ・h (地面からの高さ) は高架なら一定値、地上なら 0。高架の出入りは両端 200m で傾ける
// データは © OpenStreetMap contributors (ODbL)。
import { readFileSync, writeFileSync } from 'node:fs';

const BB = { latMin: 34.4830, latMax: 34.5000, lonMin: 133.3400, lonMax: 133.4060 };
const ky = 110950, kx = 111320 * Math.cos(34.49 * Math.PI / 180);

const raw = JSON.parse(readFileSync('data/osm/rail_raw.json', 'utf8')).elements;
const key = p => p.lat.toFixed(7) + ',' + p.lon.toFixed(7);

/** 同じ路線の way を端点でつないで、いちばん長い連結成分を折れ線で返す */
function stitch(ways) {
  const segs = ways.map(w => w.geometry.slice());
  const out = [];
  while (segs.length) {
    let cur = segs.shift();
    let grew = true;
    while (grew) {
      grew = false;
      for (let i = 0; i < segs.length; i++) {
        const s = segs[i];
        if (key(s[0]) === key(cur[cur.length - 1])) { cur = cur.concat(s.slice(1)); segs.splice(i, 1); grew = true; break; }
        if (key(s[s.length - 1]) === key(cur[0])) { cur = s.concat(cur.slice(1)); segs.splice(i, 1); grew = true; break; }
        if (key(s[s.length - 1]) === key(cur[cur.length - 1])) { cur = cur.concat(s.slice(0, -1).reverse()); segs.splice(i, 1); grew = true; break; }
        if (key(s[0]) === key(cur[0])) { cur = s.slice(1).reverse().concat(cur); segs.splice(i, 1); grew = true; break; }
      }
    }
    out.push(cur);
  }
  const len = p => { let L = 0; for (let i = 0; i + 1 < p.length; i++) L += Math.hypot((p[i].lat - p[i + 1].lat) * ky, (p[i].lon - p[i + 1].lon) * kx); return L; };
  out.sort((a, b) => len(b) - len(a));
  return out[0] ?? [];
}

const inBB = p => p.lat >= BB.latMin && p.lat <= BB.latMax && p.lon >= BB.lonMin && p.lon <= BB.lonMax;

/** BBOX の中で連続している部分のうち、いちばん長いものを取る */
function clip(pts) {
  const runs = []; let cur = [];
  for (const p of pts) { if (inBB(p)) cur.push(p); else { if (cur.length > 1) runs.push(cur); cur = []; } }
  if (cur.length > 1) runs.push(cur);
  runs.sort((a, b) => b.length - a.length);
  return runs[0] ?? [];
}

/** 約 step m 間隔に間引く */
function thin(pts, step) {
  const out = [pts[0]];
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    acc += Math.hypot((pts[i].lat - pts[i - 1].lat) * ky, (pts[i].lon - pts[i - 1].lon) * kx);
    if (acc >= step || i === pts.length - 1) { out.push(pts[i]); acc = 0; }
  }
  return out;
}

/** 高架の高さ h をつける。両端 ramp m は 0 から立ち上げる (地面に潜らせない) */
function withHeight(pts, h, ramp) {
  const d = [0];
  for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot((pts[i].lat - pts[i - 1].lat) * ky, (pts[i].lon - pts[i - 1].lon) * kx));
  const total = d[d.length - 1];
  return pts.map((p, i) => ({
    lat: +p.lat.toFixed(6), lon: +p.lon.toFixed(6),
    h: +(h * Math.min(1, d[i] / ramp) * Math.min(1, (total - d[i]) / ramp)).toFixed(2),
  }));
}

function line(name, h, ramp, step) {
  const ways = raw.filter(e => e.type === 'way' && e.tags?.name === name);
  const pts = thin(clip(stitch(ways)), step);
  console.log(`${name}: way ${ways.length} → ${pts.length} 点`);
  return withHeight(pts, h, ramp);
}

// 山陽新幹線は福山駅の前後ずっと高架 (福山城のすぐ南を通る)。BBOX の端で地面に落とす。
const shinkansen = line('山陽新幹線', 9, 300, 60);
// 山陽本線は地上。
const sanyo = line('JR山陽本線', 0, 1, 60);

writeFileSync('data/rail.json', JSON.stringify({
  comment: '福山市内の鉄道の実在位置 (緯度経度)。線形は OpenStreetMap (ODbL) の山陽新幹線・JR山陽本線から取った。h は地面からの高さ (m)。tools/build_rail.mjs が生成。',
  shinkansen: {
    name: '山陽新幹線',
    trackSpacing: 0,
    embankment: 0,
    viaductHeight: 9,
    stations: [{ name: '福山駅', lat: 34.489280, lon: 133.362480 }],
    path: shinkansen,
  },
  jr: {
    name: 'JR山陽本線 (福山駅付近)',
    trackSpacing: 0,
    embankment: 0.8,
    viaductHeight: 0,
    stations: [{ name: '福山駅', lat: 34.489430, lon: 133.362480 }],
    path: sanyo,
  },
  landmarks: JSON.parse(readFileSync('data/landmarks.json', 'utf8')),
}, null, 1));
console.log('data/rail.json を書き出しました');
