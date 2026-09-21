# Fukuyama Kart — 福山グランプリ

国土交通省 **PLATEAU** の 3D 都市モデル（福山市 2020 年度, CityGML）を使った、実在の福山の街と鞆の浦を走るカートレースゲームです。ブラウザ (three.js) で動作します。[Matsue Kart](https://github.com/tatsuya1970/matsue-kart)（松江グランプリ）の福山市版です。

## コース

**福山駅（スタート）→ 駅前を南下して国道2号へ → 入船町 → 国道313号で JR を越える → 福山城 → 国道2号を西へ → 草戸稲荷神社 → 芦田川の西岸を南下 → 草戸町 → 草戸大橋 → 芦田川大橋 → 水呑町 → 県道22号で瀬戸内海沿いを南へ → 田尻町 → 鞆の浦 → 鞆の浦 常夜燈（ゴール）**

**20.7 km のワンウェイ。周回しません。** スタートとゴールが別の場所にあるので、`Track` は閉ループではなく開いた経路として扱います（後述）。

| 必ず通る地点 | どう通るか |
| --- | --- |
| 福山駅 | 駅前がスタート。バス乗り場の東を南下して国道2号に出て、東へ。入船町から国道313号で JR 山陽本線・山陽新幹線を越える |
| 福山城 | 線路の北側を西へ戻り、城山の東へ回り込む。天守は **PLATEAU の LOD2（実写テクスチャ）** がそのまま建っている |
| 草戸稲荷神社 | 駅の西で国道2号に入り、芦田川を渡ってすぐ南へ。国宝の明王院五重塔が並ぶ |
| 芦田川 | 西岸を南下し、草戸大橋（県道22号）で東岸へ渡って河口へ向かう |
| 芦田川大橋 | 県道380号で河口を渡って水呑町へ。福山市で最初の斜張橋なので、主塔とケーブルは独自モデルで足している |
| 鞆の浦 常夜燈 | 県道22号を南へ 7km、鞆の町なかへ入って港の西側がゴール。**常夜燈**（1859年・高さ 11m）の手前で終わり、沖には **弁天島** が見える |

走っている道は 0〜0.5km が駅前の市道、0.5〜1.4km が国道2号、1.4〜3.6km が国道313号と線路北側の市道、3.6〜4.8km が福山城まわり、4.8〜6.3km が国道2号、6.3〜9.3km が芦田川西岸の堤防道路、9.3〜12.3km が東岸の市道、12.3〜13.2km が県道380号、13.2〜20.7km が県道22号です。

全 AI で走らせると **約 5 分 50 秒**（`node tools/airace.mjs`）。広い国道では 220km/h 前後、幅 9m の市道や鞆の町なかでは AI も速度を落とします。

### 路面の幅は区間ごとに変わります

一律の幅で敷くと、国道2号では実物より狭く、芦田川東岸の市道では実物の倍近くに広がってしまいます。そこで **PLATEAU の道路面の縁までの距離をそのまま路面の半幅として使い**、区間ごとに変えています（`tools/build_course.mjs` が `course_path.json` の `halfWidth` に書き出し、`Track.hw` が読む）。

| 地点 | 路面幅 |
| --- | --- |
| 入船町（駅前・国道2号） | 18〜20 m |
| 芦田川大橋 | 19 m |
| 福山城 | 13 m |
| 田尻町（県道22号） | 13 m |
| 北吉津町・草戸町（市道） | 9〜10 m |
| 鞆の町なか・常夜燈 | 9 m |

`data/course.json` の `roadWidth` が上限（20m）、`minHalfWidth` が下限の半幅（4.5m = 幅 9m）です。生の距離は交差点で跳ね上がるので、上下限で丸めてから 100m 窓で平滑化しています。

幅に合わせて次も区間ごとに変わります。路面のライン（13m 未満はセンターラインだけの 2 車線、それ以上は片側 2 車線）、縁石・ガードレール・支柱の位置、看板ゲートの柱の間隔、地形を削る幅（`Terrain.flattenAlong`）、コースに掛かる建物の除去、線路を路面から逃がす距離、コイン・バナナの横位置、AI のライン取り、カートが壁に当たる位置。

全 AI で走らせると **約 7 分 15 秒**（`node tools/airace.mjs`）。広い国道では 220km/h 前後、幅 9m の市道では AI も速度を落とします。スピンも詰まりもなく 8 台すべてがゴールし、ゴール後は常夜燈の手前で停止します。

**走行線は PLATEAU の道路データ (tran) の上を通ります**（道路上 99.7%）。作り方は 2 段です。

1. **経由地を OSM の道路網でつなぐ**（`tools/plan_route_osm.mjs`）。`tools/route_vias.json` の経由地どうしを OpenStreetMap の道路網の最短路でつなぎ、案内線 `data/drawn_route.json` を作ります。経由地には道路の絞り込み（`"^22"` なら県道22号）を付けられ、同じ道を往復しないよう一度通った道には割増を掛けます。区間ごとの距離が出るので、遠回りしている区間はすぐ分かります。
2. **PLATEAU の道路面の上で A* 探索**（`tools/build_course.mjs`）。道路面を 2m グリッドにラスタライズし、道路の中央寄り・案内線寄りを通るように重みを付けて探索します。結果は `data/course_path.json`（2m 間隔の点列）で、ゲームはこれをそのまま走行線に使います。`open: true` なら閉じない一本道です。

制御点は案内線に沿って **約 300m 間隔**（`ANCHOR_SPACING`）で置いています。松江版は案内線を 26 等分していましたが、長いコースでは 1.4km 間隔になり、A* が案内線を無視して近道を選んでしまいます（福山城へ回り込む区間が丸ごと落ちました）。距離で置くようにして直しています。

### コースの形は地図に描いて決める

発着の区間は、`public/course-map.html` のスクリーンショットに手で線を引いてもらい、そこから起こしました。画面に写っている**今の走行線（赤）を手がかりにピクセル座標 → 緯度経度の変換を当てはめ**（尺度と平行移動の総当たり。今回は赤線の 84% が一致）、手描きの線を緯度経度へ戻して `tools/route_vias.json` の経由地にしています。地名を読み取って経由地を打ち直すより速く、意図どおりの道に載ります。

このとき OpenStreetMap の地図側にも青い文字や記号があるので、色だけで抜くと拾ってしまいます。連結成分の大きいものだけを手描きの線とみなしています。

### 周回しないコース（一本道）

スタートとゴールが別の場所にあるので、エンジン側にも手が入っています。`tools/route_vias.json` に `"open": true` を書くと、`plan_route_osm.mjs` は最後の経由地から最初へ戻る区間を作らず、`build_course.mjs` は往復除去の回転・平滑化・再サンプルを開いた経路として行い、`course_path.json` に `open: true` を書き出します。

ゲーム側は `Track.open` を見て次のように振る舞いを変えます。

| 箇所 | 周回コース | 一本道 |
| --- | --- | --- |
| `Track.wrap(i)` | index を循環 | 両端で止める（クランプ） |
| `Track.nearest()` の `s` | 0..length を循環 | 0..length にクランプ |
| スタートグリッド | スタートラインの手前に並べる | ラインの先に並べる（後ろに道が無い） |
| 周回数 | ラインを越えるたび `lap++` | 最初から `lap = 1`、末尾を越えて `lap = 2`（= ゴール） |
| HUD | `LAP n/m` | `ゴールまで n.nn km` |
| 看板 | START / FINISH ゲート 1 つ | START ゲートと GOAL ゲート |
| ミニマップ・コース図 | 閉じた輪 | 開いた線 + S / G の印 |
| ゴール後の AI | そのまま周回を続ける | ブレーキで止める（先に道が無い） |

`Track.wrap()` をクランプにしたとき、`main.ts` の地名表示だけは壊れます。あちらは `wrap(player.trackIdx - l.idx)` で「通過した直後か」を見ていて、クランプすると後ろのラベルの差がすべて 0 になり、スタート直後に全地名が一斉に出ます。一本道では素の差で判定します。

コースを変えるときは `tools/route_vias.json` を直して次を順に実行します。

```bash
node tools/plan_route_osm.mjs      # data/drawn_route.json
node tools/build_course.mjs        # data/course_path.json と data/course_map.png
node tools/convert_lod2.mjs        # コース沿い 150m の LOD2 を選び直す (テクスチャが増えたら download → atlas も)
node tools/convert_citygml.mjs     # LOD2 で描く建物を LOD1 から除く
node tools/export_course_geo.mjs   # 地図用の書き出し
```

地名の看板は `data/course.json` の `waypoints`（`label: true` のもの）から作ります。英語名は `en`、地図用の短い名前は `short` です。

## コースを地図で見る

`tools/export_course_geo.mjs` が完成したコースを地図用に書き出します。

| ファイル | 用途 |
| --- | --- |
| `public/course-map.html` | OpenStreetMap / 地理院地図 / 空中写真に重ねて表示する単体ページ |
| `public/course.geojson` | geojson.io、QGIS など |
| `public/course.kml` | Google マイマップ、Google Earth |
| `public/course.gpx` | GPX トラック |

開発サーバー起動中なら http://localhost:5182/course-map.html で見られます。

## 使用している PLATEAU データ

| 地物 | 用途 |
| --- | --- |
| 建築物モデル `bldg` (LOD2) | コース沿い 150m の 1,104 棟。**PLATEAU の実写テクスチャ**（航空写真由来）をそのまま使用。福山城天守もここに含まれる |
| 建築物モデル `bldg` (LOD1 Solid) | LOD2 の範囲外（57,645 棟）。高さ・用途からプロシージャル生成した壁面テクスチャを貼付 |
| 交通（道路）モデル `tran` (LOD1) | 走行線の探索と地面テクスチャの道路面（11,503 面） |
| 地形モデル `dem` (LOD1 TIN) | 5m グリッドの標高マップ（1194×2931）。瀬戸内海・芦田川を水面として判定し、橋を自動生成 |

出典: 国土交通省 PLATEAU「3D都市モデル（Project PLATEAU）福山市（2020年度）」(CC BY 4.0)

### 範囲が広いので回廊で絞る

福山駅から鞆の浦までの回廊は南北 14.6km × 東西 6.0km あり、松江版の 10 倍ほどの面積になります。矩形のまま出すと建物だけで数十 MB になって読み込みが持たないので、`tools/convert_citygml.mjs` は**案内線からの距離**で絞っています。

| 地物 | 残す範囲 |
| --- | --- |
| 建築物 | 案内線から 700m（`BLDG_CORRIDOR`）。29,324 棟を除外 |
| 道路面 | 案内線から 400m（`ROAD_CORRIDOR`）。A* は案内線に沿うのでこれで足りる |
| 地形 | BBOX 全体（遠景の山並みと海が要るため） |

### 福山城天守（LOD2）

福山市のデータには LOD3 がありません。一方、福山城天守は駅前のメッシュ `51335288` に **LOD2（実写テクスチャ付き）**で入っています（`<gml:name>福山城博物館</gml:name>`）。コース沿い 150m の採用範囲にちょうど入るので、専用モデルは作らず LOD2 をそのまま描いています（松江版の `tools/convert_castle.mjs` に当たるものはありません）。

コースは天守から 116m の所を通ります。天守は城山の上にあり、いちばん近い一般道までがその距離です。

### LOD2 の実写テクスチャについて

福山市で LOD2 を持つのは駅周辺の 6 メッシュ（`51335278` / `79` / `88` / `89` / `98` / `99`）です。コース沿い 150m で 1,104 棟あり、1 タイル 112px のアトラス 2 枚（高画質 4.5MB / 低画質 1.0MB）に収まります。

航空写真に写らない壁面が単色のベタ塗りで入っているのは松江・広島と同じで、アトラス生成時に合成テクスチャへ差し替えています。

### 地形と水面

DEM は 2 次メッシュ 513342 / 513343 / 513352 / 513353 / 513362 / 513363 の 6 枚（計 11GB）です（北緯 34.500 を越える版のコースを試したときに 2 次メッシュ 1 段ぶん北まで取ったもので、今のコースだけなら 4 枚で足ります）。読むのに十数分かかるので、格子に落とした結果を `data/dem_grid.bin` にキャッシュし、`ONLY_TERRAIN=1 node tools/convert_citygml.mjs` で水面判定だけやり直せます。

市街地は標高 2〜4m、河口の埋立地（箕島・水呑の新田）でも 1.5m 以上あるので、水面のしきい値は松江版と同じで足ります。

| 条件 | 判定 |
| --- | --- |
| DEM 欠測、または標高 0.3m 未満 | 水面（瀬戸内海は DEM が欠測） |
| 標高 0.3〜0.6m で水面から 10m 以内 | 水面（護岸の縁） |
| 海の中に残った小さな陸で最高点 1.5m 未満 | 水面（浅瀬のノイズ） |
| **OpenStreetMap の水面の輪郭の中で、標高 6m 未満** | 水面（下記） |

**芦田川は標高だけでは水面と見分けられません。** 河口堰で水位が T.P. 1.8m に保たれていて、市街地（2〜4m）とほとんど変わらないためです。しきい値を上げると街が水没するので、OpenStreetMap の水面の輪郭（`data/water.json`、`tools/fetch_water.mjs` → `tools/build_water.mjs`）を重ねて水にしています。6m の上限を付けてあるのは、DEM に入っている橋の桁面まで沈めないためです。これで芦田川大橋が橋として立ち上がります（`Track.bridge`）。

コースが丘を切り通す所（芦田川東岸の段丘、鞆へ下る坂など）は DEM の斜面が路面より高く、地形が路面にはみ出します。`Terrain.flattenAlong` が走行線沿いの地形を路面の下まで削り、外側を 0.8 の勾配で元の斜面へ戻しています。

**光の当て方は松江版から変えてあります。** コースの半分が南北に走るため、松江版の低い西日（`SUN_DIR = (-600, 330, 180)` / 環境光 0.9）だと北や東を向いた壁がずっと日陰になり、街が真っ黒に見えました。太陽を高くし（`(-520, 520, 240)`）、環境光を 2.1 に上げています。

## 日本語 / 英語

**言語ごとに URL が分かれています。** 日本語は `/`、英語は `/en/` です。英語に実体のある URL を与えているのは検索と SNS のためで、理由は後述の「SEO」に書いてあります。判定は `/en/` → `?lang=ja|en` → `localStorage` → `navigator.language` の順です（`src/i18n.ts`）。IP から国を見るにはサーバーが要るので、GitHub Pages の静的配信では使えません。日本語環境から英語で見たい人（その逆も）がいるので、画質ボタンの隣に手動の切り替えを必ず出しています。切り替えは看板やラベルを作り直す必要があるため、その言語の URL へ移動して読み込み直します。開発サーバーには `/en/` が無いので、そこでは `?lang=en` を使います。

差し替えの場所は 2 つに分けています。

| 対象 | 持たせ方 |
| --- | --- |
| `index.html` の固定文言 | 日本語をそのまま置き、英語を `data-en` / `data-en-html` / `data-en-placeholder` 属性に持たせる。`applyDomLang()` がまとめて差し替える |
| TypeScript 側の文言 | `src/i18n.ts` の辞書を `t('key', ...)` で引く |

日本語をソースに残す形にしたのは、読んで意味が分かるほうが直しやすいためです。

**コースの看板は常に二か国語です。** 選んだ言語を大きく、もう一方を副題に出します（看板の副題行はもともと空いていたので、切り替えずに両方出せます）。地名の英語は `data/course.json` の `en` に持たせ、`tools/build_course.mjs` が `course_path.json` へ書き出します。

```
福山駅 → Fukuyama Sta. / 芦田川大橋 → Ashidagawa Ohashi Bridge / 鞆の浦 常夜燈 → Tomonoura Joyato
```

`?lang=en` を付ければ日本語環境でも英語で確認できます。

## SEO

検索と SNS のカードのために、次を入れてあります。**日本語と英語で別々の URL** を持たせているのが要です。

| URL | 言語 | 中身 |
| --- | --- | --- |
| `https://tatsuya1970.github.io/fukuyama-kart/` | 日本語 | `dist/index.html` |
| `https://tatsuya1970.github.io/fukuyama-kart/en/` | 英語 | `dist/en/index.html`（中身は同じで head だけ英語） |

**なぜ URL を分けるのか。** X や Facebook のカードを作るクローラは JavaScript を実行しません。1 つの URL で実行時に英語へ差し替えても、共有カードは日本語のままになります。検索も、1 つの URL に 2 言語が同居していると、どちらの言語のページとして出すか決めきれません。

**英語ページの作り方。** ページを二重管理しないよう、`index.html` は 1 つだけです。head の言語依存部分を `<!-- ==== SEO:ja ==== -->` と `<!-- ==== /SEO:ja ==== -->` で囲んであり、ビルド後に `tools/build_en_page.mjs` がそこを `tools/seo-en.html` の中身へ差し替え、`<html lang>` を `en` にして `dist/en/index.html` として書き出します（`npm run build` に組み込み済み）。**目印のコメントを消さないでください。** 画面の文言は `applyDomLang()` が `/en/` を見て英語にします。

入れてあるもの。

| 項目 | 場所 |
| --- | --- |
| 見出しと説明（言語別） | `index.html` の SEO ブロック / `tools/seo-en.html` |
| canonical と hreflang（ja / en / x-default） | 同上。各ページが自分を canonical に指す |
| OGP と Twitter カード（`summary_large_image`） | 同上 |
| 構造化データ（schema.org の `VideoGame`） | 同上。JSON-LD |
| カード画像 1200x630 | `public/ogp.png`（日本語）/ `public/ogp-en.png`（英語） |
| サイトマップ | `public/sitemap.xml`。2 言語を hreflang で結んである |

カード画像は `PORT=5182 node tools/make_ogp.mjs` で作り直せます。福山城天守を上空から撮り、HUD を消してタイトル帯を重ねたものです。文字はブラウザに描かせているので日本語のフォントも崩れません。背景を変えたいときは `QUERY` の `photo=緯度,経度,注視高さ,距離,方位角` を差し替えてください。

**robots.txt は現状読まれません。** クローラが読むのはドメイン直下の `/robots.txt` だけで、プロジェクトページでは `/fukuyama-kart/robots.txt` に置かれるためです。置いてはありますが（独自ドメインに移したときに効きます）、サイトマップは Search Console に直接登録してください。

**ドメインを変えるとき。** URL は `index.html` の SEO ブロック、`tools/seo-en.html`、`public/sitemap.xml`、`public/robots.txt` の 4 か所に書いてあります。GitHub Pages で独自ドメインを設定すると `github.io` 側は 301 で転送されるので、リンクの評価は引き継がれます。

## オンライン対戦

タイトル画面で「対戦PLAY」を押すと公開ロビーに入り、**2 人そろった時点で 30 秒のカウントダウン**が始まって自動的に発走します。集まった人どうしで最大 8 人、空いた枠は AI が走ります。1 人のあいだは相手が来るまで待ち、待たずに走りたければ「すぐ始める」で AI と走れます。相手が入ると短いジングルが鳴り、別のタブを見ていればタブの見出しが点滅します（トップ画面にいるときに待ち人が現れた場合も同じ）。

部屋は押した人が作ります（`OPEN` + 5 文字）。同じ部屋に集まる手段は後述の presence で、待っている人の部屋が見えていればそこへ入り、見えていなければ新しい部屋を作ります。お互いに見えないまま部屋が 2 つできたときは、1 人で待っている側が部屋名の小さいほうへ移って合流します（`src/main.ts` の `maybeMergeLobby`）。以前は壁時計を 30 秒で区切った部屋名にしていましたが、「2 人そろってから」にするには締切を人数で決める必要があり、時刻から決まる部屋名とは相容れないので変えました。

締切はホストが 2 人目の席を配るときに決めて座席表に載せます（`LobbyInfo.deadline`）。1 人に戻ったら締切を消し、相手が抜けたのに 1 人で発走することはありません。発走の合図はホストが出して足並みを揃え、締切を 2 秒過ぎても合図が来なければ（ホストが落ちた等）各自で始めます。席が無いまま発走したら 1 人で走ります（席が無いのに 0 番を名乗ると、ホストとカートを奪い合うため）。レース中の部屋に入ってしまった人には `busy` を返し、新しい部屋で待ち直してもらいます。

**トップ画面に「対戦待ち」の状況を出します。** 対戦PLAY を押す前から、レースの部屋とは別の常設の部屋（`mk-presence`）に全員が入り、「トップ画面にいる / 対戦待ち / レース中」を伝え合います（`src/net.ts` の `Presence`）。誰かが待っていれば「いま 1 人が対戦待ち（たろう）対戦相手を待っています」、カウントダウン中なら「発走まで 18 秒」と緑で光り、ロビーで待っている側にも「トップ画面に 1 人います」と出ます。

trystero 0.25 は同じ appId なら部屋をまたいで WebRTC 接続を共有します（`@trystero-p2p/core` の SharedPeerManager）。そのため、トップ画面でつながった相手とは、対戦PLAY を押した瞬間にリレーの往復なしで同じ部屋に入れます。相手とつながるまでの 8〜19 秒はページの読み込み中に済み、カウントダウン中の部屋にも締切の 3 秒前（`JOIN_MIN_WAIT`）まで入れます。

合言葉で部屋を作る方式はコメントアウトしてあります（同時に遊ぶ人が少ないうちは、待ち時間が読めるほうが遊びやすいため）。`index.html` と `src/main.ts` の「合言葉」の箇所を戻せば復活します。URL に `?room=XXXXX` を付けると、今でも合言葉の部屋へ直接入れます。

**サーバーはありません。** GitHub Pages で配信しているので常駐サーバーを置けず、[trystero](https://github.com/dmotz/trystero) で WebRTC のブラウザ直結にしています。公開リレーを通るのは「どの部屋に誰がいるか」のシグナリングだけで、レース中の通信はブラウザ同士を直接流れます（`src/net.ts`）。

同期の考え方は次のとおりです。

| 対象 | 誰が決めるか |
| --- | --- |
| 自分のカート | 自分だけが物理計算する。他の人のカートは受信位置へ寄せるだけで、物理は回さない |
| 空き枠の AI | ホストだけが計算して位置を配る |
| アイテムボックスの取得・被弾 | そのカートを持っている側だけが判定し、結果をイベントで配る |
| アイテムの発射 | 使った人が位置とともに配り、各自の画面で同じものを出す |
| ホスト | 合言葉の部屋では作った人。公開ロビーには作成者がいないので ID が最小の人。抜けたら次の人へ移る |

位置は 15Hz で送り、受信側は速度で前へ進めながら（デッドレコニング）表示位置を寄せます。取得と被弾を持ち主の側に寄せていないと、各自の画面で別々に当たったことになります。

送信間隔は `dt` ではなく実時間で測ります。`dt` は 0.05 秒で頭打ちにしてあるので、fps が落ちた端末では送信間隔まで一緒に間延びし、相手の画面で 100m 以上ずれます（検証環境で実測）。

**待っている人がいるのに「見当たりません」と出るとき。** 次の順に疑ってください。

1. **どちらかが古いページのまま。** 配信後もブラウザのキャッシュに前の版が残ることがあり、古い版は新しい版の「対戦待ち」を読めません（「1 人がレース中」と出ます）。タイトル画面の一番下に `build <コミット> (<時刻>)` を出しているので、両方の端末で同じか見てください。違えば再読み込み（スマホは一度タブを閉じて開き直す）です。
2. **見つかるまで 1 分近くかかる。** trystero の nostr 戦略は「自分の告知を受け取った相手が接続してくる」仕組みで、相手の再告知は 60 秒おきです。リレーは購読した時刻より新しい出来事しか流さないため、端末の時計が数秒ずれていると相手からの応答が捨てられ、相手の次の再告知まで待ちます。そのためトップ画面の「確認しています...」は 70 秒続けます。相手が現れれば音で知らせるので、待っていて構いません。
3. **リレーにつながっていない。** 誰も見えないあいだは「リレー 4/8 に接続中」のように接続数を添えています。0 なら回線か、社内ネットワーク等で WebSocket が塞がれています。trystero が既定で選ぶリレーのうち 1 つは落ちていたので（`nostr.data.haus`、実測）、使うリレーを 5 から 8 に増やしてあります（`src/net.ts` の `RELAY_CONFIG`。全員が同じ組になるよう appId から順が決まります）。
4. **開発サーバーと本番は別の世界。** `vite` の開発サーバーでは appId を `fukuyama-kart-dev` にして本番の利用者と切り離しています（テスト用のブラウザが本番の画面に映っていたため）。PC の開発サーバーとスマホの本番ページでは互いに見えません。開発サーバーから本番の相手と試すときは `?net=prod` を付けてください。
5. **待っている側の画面が消えている。** スマホで画面を消したりタブを裏にしたりすると、ブラウザが接続を止めるので相手から見えなくなります。画面に戻れば数秒で復帰します。
6. **携帯回線 (5G / 4G) と家庭の回線の組み合わせ。** リレーにつながっていて告知も届いているのに相手が見えないときは、ここがいちばん怪しいです。WebRTC の直結は STUN で自分の外側の住所を相手に伝える方式で、携帯回線の CGNAT（対称型 NAT）と家庭のルータ（ポート制限コーン）の組み合わせでは直結できません。これを中継するのが TURN で、サーバーが要ります。トップ画面では STUN サーバー 2 つに聞いて NAT の種類を推定し、対称型なら「相手と直結しにくい種類の NAT です」と出します（`src/net.ts` の `natProbe`）。対処は下の「TURN の設定」です。
7. **アプリ内ブラウザ (Facebook / Instagram / LINE / X)。** WebView は WebRTC が制限されていたり、裏に回ると接続が切れたりします。検出したら「Safari / Chrome で開いてください」と出します（`inAppBrowser`）。

**TURN の設定。** 誰でも使える無料の公開 TURN（Open Relay）は候補が取れなくなっていた（2026-09 実測）ので、サイトの持ち主が用意します。`public/turn.json` を置くと、ページ読み込み時に読んで trystero の `turnConfig` に渡します。無ければ STUN だけで動きます（直結できる相手とだけつながる）。

- いちばん簡単なのは [metered.ca](https://www.metered.ca/stun-turn) の無料プラン（月 0.5 GB）。登録して TURN の API キーを取り、`public/turn.json` に次のように書きます。API キーはページに載るので公開されますが、できるのは自分の枠を使った TURN 資格情報の発行だけです。

  ```json
  { "url": "https://<アプリ名>.metered.live/api/v1/turn/credentials?apiKey=<API キー>" }
  ```

- 自前の TURN（coturn 等）や固定の資格情報なら、ICE サーバーの一覧をそのまま書きます。

  ```json
  { "iceServers": [{ "urls": ["turn:example.com:3478", "turns:example.com:5349"], "username": "u", "credential": "p" }] }
  ```

- [Cloudflare の TURN](https://developers.cloudflare.com/realtime/turn/)（月 1 TB まで無料）は資格情報を短命で発行する API なので、鍵をページに載せられません。Cloudflare Workers 等で発行する URL を作り、その URL を `"url"` に書きます（返す JSON は `iceServers` の配列、または `{ "iceServers": [...] }`）。

中継が通っているかは、対称型 NAT の端末でトップ画面に「TURN で中継できます」と出るかで分かります。レースの位置情報は 1 組あたり毎秒 10 KB ほどなので、5 分のレースで 3〜4 MB です。

**相手と初めてつながるまでに 8〜19 秒かかります**（公開リレー経由の WebRTC ハンドシェイク。実測値）。ただし上記の presence でページ読み込み中につながっていれば、ロビーでの合流は 2 秒ほどです（`tools/nettest.mjs` で実測 1.9 秒）。それでも人が集まらないようなら `src/net.ts` の `OPEN_PERIOD` を延ばしてください。

参加した直後は相手の挨拶がまだ届かず、作成者が誰か分かりません。そのまま ID 順でホストを決めると、参加した側が一瞬ホストだと思い込んで座席表を配ってしまい、席が入れ替わります。そのため作成者でない場合は 5 秒待ってからホストを名乗ります。

`PORT=5183 node tools/nettest.mjs` でブラウザを 2 つ立ち上げ、同時に押して合流・カウントダウン・発走・位置の一致まで通しで確認できます。`PORT=5183 node tools/presencetest.mjs` は、トップ画面に対戦待ちが出るか、押すと同じ部屋に入って 2 人でカウントダウンが始まるかを確認します。

## 実在の鉄道（走行します）

| 路線 | 表現 |
| --- | --- |
| 山陽新幹線 | 福山駅の前後はずっと高架（高さ 9m）。福山城の石垣のすぐ南をかすめる。N700S を模した 6 両編成が 2 本走る |
| JR 山陽本線 | 福山駅を東西に貫く地上線。バラスト・架線柱・トロリ線つき。227系「Red Wing」を模した 4 両編成が 2 本走る |

線形は OpenStreetMap の way を端点でつないだもので、`tools/fetch_rail.mjs` → `tools/build_rail.mjs` が `data/rail.json` を書き出します（`npm run data:rail`）。高架の高さは両端 300m で 0 から立ち上げ、BBOX の端で地面に落としています。

**地上を走る車両に接触するとスピン**します（山陽本線は踏切でコースと交わります）。高架の上の新幹線には当たりません。

コースは幅 16m で道路の中央に敷いているため、OSM の線形のままだと山陽本線が路面に乗ってしまいます。コースと平行な区間だけ線路を横へずらしています（`src/rail.ts` の `keepOffCourse`）。踏切（交差角が大きい所）は動かしません。高架の新幹線は道路をまたぐので、このずらしは掛けていません。

車両は終端で折り返さず、反対の端へ回して同じ向きに走り続けます（松江版・広島版と同じ。接触したカートが列車を押し戻したように見えないようにするため）。

## 実在ランドマーク

| ランドマーク | 作り方 |
| --- | --- |
| 福山城天守 | PLATEAU の LOD2（実写テクスチャ）をそのまま |
| 鞆の浦 常夜燈 | 独自モデル。基壇・竿・火袋・宝形の笠・擬宝珠を積んだ高さ 11m の石造常夜燈と案内板 |
| 弁天島 | 独自モデル。DEM にある島の上に緑を敷き、朱塗りの弁天堂・多宝塔・松を置く |
| 芦田川大橋 | 独自モデル。PLATEAU の `tran` には路面しか無いので、橋の区間（`Track.bridge`）を拾って主塔（高さ 34m）とケーブル 24 本を足す |

位置は `data/landmarks.json` にあり、`tools/build_rail.mjs` が `data/rail.json` の `landmarks` へ埋め込みます。

## 公園

福山城公園・五本松公園・芦田川緑地かわまち広場・水辺公園など 11 か所、樹木 580 本を芝生と樹木で再現しています（`src/parks.ts` と `data/parks.json`）。PLATEAU には公園の輪郭が無いので、OpenStreetMap の輪郭を `tools/fetch_parks.mjs` → `tools/build_parks.mjs` で取り込み、コースから 400m 以内・面積 2000m² 以上のものだけを残しています。福山城の内堀は近代に埋め立てられていて DEM にも水面が無いので、濠を掘り直す処理は使っていません（`moat: null`）。

## セットアップ

```bash
npm install
npm run data:download                 # PLATEAU CityGML を data/citygml/ に (建物・道路 1.5GB + DEM 11GB)
node tools/fetch_osm.mjs              # ルート計画用の OSM 道路・鉄道
npm run data:water                    # 水面の輪郭 (芦田川) → data/water.json
npm run data:parks                    # 公園の輪郭 → data/parks.json
npm run data:rail                     # 鉄道の線形 → data/rail.json
npm run data:convert                  # 地形・道路・LOD1 建物 (初回は DEM の読み込みに十数分)
npm run data:route                    # 案内線 → 走行線 (data/course_path.json)
node tools/convert_lod2.mjs           # LOD2 (コース沿い)
node tools/download_lod2_tex.mjs      # LOD2 テクスチャ (1,104 枚)
node tools/build_lod2_atlas.mjs       # アトラス
npm run data:lq                       # 低画質用アトラス
npm run data:convert                  # LOD2 で描く建物を LOD1 から除く (DEM はキャッシュ)
node tools/export_course_geo.mjs      # 地図用の書き出し
npm run dev             # http://localhost:5182/
```

`public/data/` に生成済みデータが含まれていれば、`npm run dev` だけで遊べます。

## デプロイ

`main` に push すると GitHub Actions が GitHub Pages へ公開します（`.github/workflows/deploy.yml`）。

公開先: **https://tatsuya1970.github.io/fukuyama-kart/**

プロジェクトページはサブパス配信なので `base` が要ります。`vite preview` は `command` が `'serve'` 扱いになり、`command === 'build'` で分岐するとビルド成果物を root で配信してしまって検証にならないため、環境変数で渡しています。

```bash
BASE_PATH=/fukuyama-kart/ npm run build
BASE_PATH=/fukuyama-kart/ npm run preview   # http://127.0.0.1:4173/fukuyama-kart/
```

`npm run build` は最後に `tools/build_en_page.mjs` を呼び、英語版 `dist/en/index.html` を書き出します（「SEO」の項）。Git Bash から実行するときは `MSYS_NO_PATHCONV=1` を付けてください。付けないと `/fukuyama-kart/` が Windows のパスへ変換され、`base` が `/Program Files/Git/fukuyama-kart/` になります。

`public/` 配下のアセットは絶対パスで直書きせず、`src/geo.ts` の `assetUrl()` が `import.meta.env.BASE_URL` を基準に解決します。新しくデータを読む箇所を足すときはこれを使ってください。

初回ロードは「中」画質で約 19MB（2048px アトラス 1.2MB ＋ LOD2 形状 6.5MB ＋ 建物 4.4MB ＋ 地形 6.3MB ＋ 道路 1.7MB）。GitHub Pages の帯域ソフト制限は月 100GB です。

## 操作

| キー | 操作 |
| --- | --- |
| ↑ / W | アクセル |
| ↓ / S | ブレーキ・バック |
| ← → / A D | ハンドル |
| Shift / Space | ドリフト（離すとミニターボ） |
| Ctrl / Enter / X | アイテム使用 |
| B | 後方視点 |
| C | カメラ切替 |
| M | ミュート |

アイテム: キノコ（加速）、バナナ（後方に設置）、ミドリこうら（前方に発射・壁で反射）、スター（無敵）。コインを取ると最高速が少し上がります。

### スマホ / タブレット

タッチ操作に対応しています。**横向き推奨**ですが、縦向きでも遊べます（Facebook などアプリ内ブラウザは縦に固定されていることがあるため）。

| ボタン | 操作 |
| --- | --- |
| ◀ ▶（左下） | ハンドル |
| D（右下） | ドリフト（離すとミニターボ） |
| ▼ | ブレーキ・バック |
| ★ | アイテム使用 |

**アクセルは自動です。** 親指 2 本でハンドル・ドリフト・アイテムを賄うので、アクセルを押しっぱなしにする指がありません。ブレーキを押している間だけアクセルが離れます。

タッチは各ボタンではなく画面全面（`#touch`）で受け、指ごとに座標からボタンを引き直します（`src/input.ts`）。ボタンに `touchstart` を付ける方式だと、◀ に置いた指を ▶ へ滑らせても ◀ が押されたままになるためです。

Android の Chrome では PLAY を押すと全画面にして横向きに固定します。iPhone は全画面 API も向きの固定も無いので、縦向きのときはタイトル画面に「横向きにすると見やすくなります」と出すだけです。HUD とボタンはノッチ・ホームバーを避けて置きます（`viewport-fit=cover` と `env(safe-area-inset-*)`）。ミニマップはスマホでは出しません。

## 画質プリセット

公開環境では GPU を選べないため、タイトル画面に画質切り替えを置いています。初回は WebGL の `WEBGL_debug_renderer_info` から GPU 名を読んで自動選択し、以後は localStorage に保存します（`src/quality.ts`）。アトラスの解像度が変わるので、切り替えはページ再読み込みで反映されます。

| プリセット | アトラス | 影 | 解像度上限 | 描画距離 |
| --- | --- | --- | --- | --- |
| 高（専用GPU向け） | 4096px | 2048 シャドウマップ | DPR 1.5 | 4200m |
| 中（内蔵GPU向け） | 2048px | 1024 シャドウマップ | DPR 1.0 | 3000m |
| 低（最軽量） | 2048px | なし | DPR 1.0 | 2000m |

自動判定は、ソフトウェアラスタライザとモバイルを「低」、Intel UHD/Iris など内蔵 GPU を「中」、GeForce/Radeon RX/Apple M 系を「高」に割り当てます。

**最大のコストは三角形数ではなくテクスチャ VRAM です。** LOD2 は 92,815 三角形で、ジオメトリはまとめてあるのでドローコールも少ない一方、4096px のアトラス 2 枚は非圧縮 RGBA + ミップで約 170MB を占めます。2048px 版に落とすと約 43MB になり、転送量も 4.9MB → 1.2MB に減ります。福山版は松江版よりアトラスが少ないぶん軽く、代わりに LOD1 の建物（57,645 棟）と地形（1194×2931）が大きくなっています。

低画質用のアトラスは既存の 4096px 版から生成します（PLATEAU の元データは不要）。UV はアトラス内の正規化座標なので、画像を縮小しても `lod2.bin` 側は変更不要です。

```bash
npm run data:lq            # public/data/lod2_atlas_N_2k.jpg を生成
```

### 実測値（広島版での値）

Intel UHD Graphics（内蔵 GPU）/ 1920×1080 / DPR 1.5 / 本番ビルド / 全 AI 走行時の中央値:

| プリセット | fps | 読み込み |
| --- | --- | --- |
| 高 | 16 | 4.6s |
| 中 | 28 | 4.7s |
| 低 | 35 | 3.9s |

同じシーンを GeForce RTX 3070 Laptop で動かすと「高」でも 93fps 出ます。内蔵 GPU との差が大きいので、公開時は自動判定に任せるのが前提です。なお連続計測すると熱で 3 割ほど落ちるため、上表は各プリセットを冷えた状態で 1 番目に測った値です。

## 開発用デバッグ

URL パラメータでカウントダウン無しに任意地点から開始できます。

```
http://localhost:5182/?debug=1&wp=7&cam=3      # 経由地 7 から俯瞰カメラで開始
http://localhost:5182/?debug=1&idx=2000&cam=0  # スプラインのサンプル番号 2000 から
http://localhost:5182/?debug=1&ai=1&steps=60   # プレイヤーも AI 操作 + 物理を 60 倍速 (低速環境での検証用)
http://localhost:5182/?debug=1&photo=35.4752,133.0506,12,95,160  # 指定した緯度経度を撮影 (注視高さ, 距離, 方位角)
```

`norail=1` `nolod2=1` `nobldg=1` `nodome=1` `nopark=1` `noshadow=1` `lod2basic=1` で要素を切り分けられます。

ポート 5182 が別プロジェクトに使われている場合は `npx vite --port 5183 --strictPort` で起動し、`PORT=5183 node tools/shots.mjs ...` のように `PORT` を渡します（`shots.mjs` と `airace.mjs` が対応しています）。

画面左上（タイマーの下）に FPS を常時表示します。50 以上で緑、30 以上で黄、それ未満は赤。`nofps=1` で非表示にできます。

`?q=low` `?q=medium` `?q=high` で画質プリセットを固定できます（自動判定と localStorage より優先）。

`cam` は 0: 追従, 1: 遠め, 2: ボンネット, 3: 俯瞰。`tools/shots.mjs` と `tools/airace.mjs` は Playwright (SwiftShader) でこれらを自動実行します。

## 構成

```
data/course.json           地点名・看板 (緯度経度・英語名)
data/drawn_route.json      走行線探索の案内線 (plan_route_osm.mjs が生成)
data/course_path.json      道路上を通る走行線 (build_course.mjs が生成)
data/rail.json             鉄道・軌道・ランドマークの実在位置
data/parks.json            公園の輪郭 (OSM)
data/osm/fukuyama.json     ルート計画用の OSM 道路・鉄道 (tools/fetch_osm.mjs)
data/landmarks.json        ランドマークの実在位置 (build_rail.mjs が rail.json へ埋める)
data/water.json            水面の輪郭 (OSM)
tools/download_plateau.mjs PLATEAU CityGML ダウンロード
tools/fetch_osm.mjs        ルート計画用の OSM 道路・鉄道を取得
tools/route_vias.json      コースの経由地 (道路の絞り込み・踏切の手動接続つき)
tools/plan_route_osm.mjs   経由地を OSM の道路網でつなぎ data/drawn_route.json を作る
tools/fetch_rail.mjs       鉄道の線形を OSM から取得
tools/build_rail.mjs       OSM の way をつないで data/rail.json を作る
tools/fetch_water.mjs      水面の輪郭を OSM から取得
tools/build_water.mjs      リレーションの outer を環にして data/water.json を作る
tools/fetch_parks.mjs      公園の輪郭を OSM から取得
tools/build_parks.mjs      コース沿いの公園だけ残して data/parks.json を作る
tools/triangulate.mjs      多角形の三角形分割 (LOD2 で使用)
tools/convert_citygml.mjs  CityGML → buildings.json / roads.json / terrain.bin (LOD1)
tools/convert_lod2.mjs     CityGML → lod2.bin / lod2.json (LOD2 実写テクスチャ)
tools/download_lod2_tex.mjs LOD2 テクスチャ画像のダウンロード
tools/build_lod2_atlas.mjs テクスチャアトラス生成 (ベタ塗り面の補正込み)
tools/build_lod2_atlas_lq.mjs 低画質用 2048px アトラス生成 (既存アトラスから)
tools/build_course.mjs     走行線を PLATEAU の道路面の上に載せる (A* 探索)
tools/export_course_geo.mjs コースを GeoJSON / KML / GPX / OSM 地図ページへ書き出す
tools/screenshot.mjs       Playwright による動作確認スクリーンショット
tools/mobile_check.mjs     スマホ表示 (横持ち / 縦持ち) とタッチ操作の確認
tools/shots.mjs            任意地点のスクリーンショット
tools/airace.mjs           全 AI による高速レース検証
tools/nettest.mjs          オンライン対戦の疎通確認 (ブラウザ 2 つ)
tools/presencetest.mjs     トップ画面の「対戦待ち」表示と、待っている人の部屋へ即座に入れるかの確認
tools/make_ogp.mjs         SNS のカード画像 (1200x630, 日本語 / 英語) を作る
tools/build_en_page.mjs    ビルド後に英語版 dist/en/index.html を書き出す (head だけ差し替え)
tools/probe_scene.mjs      画面前方の物体をレイキャストで特定
tools/probe_uv.mjs         UV とアトラス参照先の特定
tools/check_trains.mjs     車両が走行しているかの確認
src/geo.ts        座標変換 (等距円筒近似, 原点 = 福山駅前)
src/terrain.ts    地形メッシュ + 地面テクスチャ (道路・河川)
src/buildings.ts  LOD1 建物メッシュ (テクスチャ 6 種)
src/textures.ts   プロシージャルテクスチャ
src/track.ts      スプライン・路面・高架・欄干・看板・最寄点検索
src/lod2.ts       LOD2 実写テクスチャ建物の読み込み
src/quality.ts    画質プリセット (GPU 自動判定・localStorage 保存)
src/rail.ts       山陽新幹線・JR 山陽本線の線路と走行車両
src/landmarks.ts  鞆の浦 常夜燈・弁天島・芦田川大橋の斜張橋
src/parks.ts      公園の芝・樹木 (濠を持つ公園にも対応)
src/net.ts        オンライン対戦 (サーバー無しの P2P, WebRTC) と「対戦待ち」の伝え合い (presence)
src/i18n.ts       日本語 / 英語の切り替え
src/kart.ts       カート物理・モデル・AI
src/items.ts      アイテムボックス・コイン・バナナ・甲羅
src/hud.ts        HUD・ミニマップ
src/audio.ts      WebAudio 効果音
src/main.ts       シーン構築・レース進行
```

## ライセンス

| 対象 | ライセンス |
| --- | --- |
| ソースコード (`src/`, `tools/`, `index.html`) | MIT — [LICENSE](LICENSE) |
| 3D 都市データ (`public/data/`, `data/`) | CC BY 4.0 — [DATA_LICENSE.md](DATA_LICENSE.md) |

データの出典は国土交通省「3D都市モデル（Project PLATEAU）福山市（2020年度）」、ルート計画・鉄道の線形・公園と水面の輪郭は © OpenStreetMap contributors (ODbL) です。加工内容の一覧は [DATA_LICENSE.md](DATA_LICENSE.md) にあります。

本作品は任天堂株式会社とは一切関係がなく、同社が承認・後援するものでもありません。
