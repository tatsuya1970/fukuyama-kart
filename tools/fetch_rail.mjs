// 鉄道の線形を Overpass API から取る
//   node tools/fetch_rail.mjs   → data/osm/rail_raw.json
// データは © OpenStreetMap contributors (ODbL)。
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const query = `[out:json][timeout:180];(
  way["railway"="rail"]["name"~"山陽本線|山陽新幹線"](34.44,133.30,34.52,133.42);
);out geom tags;`;
mkdirSync('data/osm', { recursive: true });
writeFileSync('data/osm/rail_query.txt', query);
execFileSync('curl', ['-s', '-m', '240', '-A', 'fukuyama-kart', '--data-urlencode', 'data@data/osm/rail_query.txt', 'https://overpass-api.de/api/interpreter', '-o', 'data/osm/rail_raw.json'], { stdio: 'inherit' });
console.log('data/osm/rail_raw.json を書き出しました');
