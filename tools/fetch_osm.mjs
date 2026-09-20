// ルート計画用の OpenStreetMap データ (道路・鉄道) を Overpass API から取る
//   node tools/fetch_osm.mjs   → data/osm/fukuyama.json
// Node の fetch では Overpass に繋がらない環境があったので curl を使う。
// データは © OpenStreetMap contributors (ODbL)。
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

// 福山駅 (北) 〜 鞆の浦 (南) の回廊。芦田川と沼隈半島の西縁まで入れる。
const BBOX = '34.362,133.310,34.510,133.412';
const query = `[out:json][timeout:180];(
  way["highway"~"^(trunk|primary|secondary|tertiary|trunk_link|primary_link|unclassified|residential)$"](${BBOX});
  way["railway"~"rail|light_rail"](${BBOX});
  node["railway"="station"](${BBOX});
);out geom tags;`;
mkdirSync('data/osm', { recursive: true });
const tmp = 'data/osm/query.txt';
writeFileSync(tmp, query);
execFileSync('curl', ['-s', '-m', '240', '-A', 'fukuyama-kart', '--data-urlencode', `data@${tmp}`, 'https://overpass-api.de/api/interpreter', '-o', 'data/osm/fukuyama.json'], { stdio: 'inherit' });
console.log('data/osm/fukuyama.json を書き出しました');
