---
format: 1080x1920
duration: 30s
message: "実在の福山が、そのままコースになる — ブラウザで、8人で"
arc: 福山城で掴む → 8人で出走 → 実在の街 → 芦田川大橋 → 海沿いを南へ → 常夜燈にゴール → URL
audience: 福山・鞆の浦にゆかりのある人と、PLATEAU / 3D都市モデルに関心のある人
mode: autonomous
music: none
---

## Video direction

- **これは 16:9 版の縦型 (9:16) で、物語・尺・文言は同じ。変えるのは画の置き方だけ。**
  映像はクロップではなく、ゲームを 1080x1920 で撮り直したもの。three.js の fov は垂直画角なので
  被写体の大きさは 16:9 と同じまま、左右が狭くなっている。
- **縦画面の three-band 構図** — 縦長の画では被写体（天守・主塔・常夜燈・カートの隊列）が
  画面の**中央の帯 (高さ 30〜70%)** に来る。上の空と下の路面はほぼ無地なので、
  そこが**そのまま文字の下敷きになる**。文字は上帯か下帯に置き、中央の帯には置かない。
- **セーフエリア** — SNS の縦型は上下に UI が乗る。文字も罫線も **y 12%〜86% の内側**に収める。
  左右は 6cqw の内側。
- **文字の大きさ** — コンテナ幅が 1080px なので 1cqw = 10.8px（16:9 の 19.2px に対して約 0.56 倍）。
  16:9 版と同じ見た目にするには cqw の数値を約 1.8 倍にする必要がある。
  縦型はスマホで小さく見るので、**16:9 版の換算値よりさらに一回り大きく**すること。
  display は 11〜13cqw、h1 は 9〜10cqw、h2 は 7〜8cqw、label は 3〜3.4cqw が目安。
- **パレット（`frame.md` の役割どおり。色を発明しない）** — 地 = `ink-black` 濃紺 `#0B1A2A` / 本文 = `cream` 白 /
  アクセント = `fire-orange` 黄 `#FFD83D` ただ一色。第二のアクセントは作らない。
  実写フレーム (1〜6) は**映像そのものが地**で、文字の下敷きだけが濃紺 75%。
  declarative なエンドカード (7) だけが濃紺のベタ地を持つ。
- **タイポ** — `frame.md` の役割名で指定する（display / h1 / h2 / lead / label）。生のフォント名や px は書かない。
- **モーション文法** — 既定のイージングは長い尾を引く `power3`（弾ませない）。
  入場は spring-pop entrance を smooth settle で。語の出現は per-word staggered reveal、
  言い換えは hard-cut word-swap（フェードしない）。
  **縦型では入退場の向きを縦にする** — 16:9 で横に流していた所は上下に流す。画の縦の流れに乗る。
- **出し方のモデル（前倒し禁止）** — このビデオは**無音**なので、声の代わりに「画が語る順番」に合わせて出す。
  各フレームは必ず**映像だけの無文字の窓から始め**、文字はその後ろ半分に散らして出す。
  t=0 に全部載せることを禁ずる。
- **静止の配分** — フレーム 4（芦田川大橋）と 7（エンドカード）は**意図的に止める**フレーム。
  それ以外は最後の窓で hold に入る。hold 中に動かしてよいのは映像そのものだけ。
- **カット** — 1→6 はすべてハードカット。6→7 だけ 0.4s クロスフェード。
- **やらないこと** — 無限ループ（particles / marquee / 回り続けるロゴ）、`Math.random` や `Date.now`、
  保持中の lazy breathing、第二のアクセント色、角丸・影・グラデーション地（broadside は平面）、
  中央の帯に文字を置いて被写体を隠すこと。

## Frame 1 — 福山城で掴む

- scene: 福山城の天守を空から。ゆっくり回り込みながらタイトルが組み上がる
- duration: 5s
- transition_in: cut
- status: animated
- src: compositions/frames/01-castle.html
- poster: 4.5s
- type: hook
- blueprint: kinetic-type-beats (Adapt)
- focal: assets/castle.mp4
- roles: castle.mp4 = background (full-bleed, 減光なし — 昼景そのものを見せる)
- asset_candidates: assets/castle.mp4 — 福山城天守の空撮 1080x1920 (7度/秒で回り込む 5.0s)。天守が画面中央、上に市街地と山と瀬戸内海、下は城山の緑
- onscreen: 「実在の、福山。」→「福山グランプリ」

掴みは**街そのもの**。縦型では天守が画面中央に大きく立ち、上 1/3 に市街地と二段高架と山並み、
下 1/3 が城山の緑になる。**文字は下 1/3 の緑の上**に置く（天守にかからない）。

Scene 1 (0.0–1.8s): `castle.mp4` のみ全面。天守が右へ回り込み始める。文字ゼロ。
Scene 2 (1.8–2.9s): 下帯（y 62%〜78%）に濃紺 75% の帯が下からワイプで入り、その上に「実在の、」「福山。」が per-word staggered reveal で 2 拍。
Scene 3 (2.9–3.8s): 文が hard-cut word-swap で消え、同じベースラインに黄の rule が左から引かれる。映像は回り続ける。
Scene 4 (3.8–5.0s): rule の上に display で「福山グランプリ」が spring-pop entrance（smooth settle）で着地し、その下に label で小さく「FUKUYAMA KART」。以後 held。

## Frame 2 — 8人で出走

- scene: 福山駅のスタート。8台が前に並んで走り出し、8色のドライバーチップが並ぶ
- duration: 3.5s
- transition_in: cut
- status: animated
- src: compositions/frames/02-eight.html
- poster: 3s
- type: benefit_highlight
- blueprint: grid-card-assemble (Adapt)
- focal: assets/grid.mp4
- roles: grid.mp4 = background (full-bleed)
- asset_candidates: assets/grid.mp4 — 福山駅のスタートグリッド 1080x1920、8台が前方に並んで発進 (3.5s)。左手に二段高架
- onscreen: 8色のドライバーチップが順に並ぶ → 「最大8人」→「オンライン対戦」

必ず伝える 3 点のうちの 1 つ。**数を見せる**。縦型では横に 8 個並べると 1 個が小さくなるので、
**4 個 × 2 段**に組む（チップは大きく、色が読める大きさを優先）。下帯に置く。

Scene 1 (0.0–0.9s): `grid.mp4` のみ全面。8台が一斉に発進する。文字ゼロ。
Scene 2 (0.9–2.3s): 下帯（y 60%〜80%）に濃紺 75% の板がワイプイン。その上に 8 個の丸いドライバーチップが**左上から 1 つずつ**着地（4 個 × 2 段、per-item stagger、spring-pop entrance の smooth settle）。色はゲーム内の 8 台と同じ。
Scene 3 (2.3–3.5s): 8 個目が着地した拍で、チップの下に h2 で「最大8人」が spring-pop、半拍遅れて label で「オンライン対戦」が fade。以後 held。

## Frame 3 — 実在の街が、そのままコース

- scene: 国道2号の市街地を疾走。言い換えで主張を立て、出典を控えめに置く
- duration: 4.5s
- transition_in: cut
- status: animated
- src: compositions/frames/03-city.html
- poster: 4s
- type: product_intro
- blueprint: kinetic-type-beats (Reproduce)
- focal: assets/city.mp4
- roles: city.mp4 = background (full-bleed)
- asset_candidates: assets/city.mp4 — 国道2号の市街地を 8台で疾走 1080x1920 (4.5s)。両側にビル、中央に道路が消失点へ伸びる
- onscreen: 「この街は、」→（入れ替え）「つくり物じゃない。」→ 小さく「国土交通省 PLATEAU 3D都市モデル / 福山市 2020年度」

ここが動画の主張。縦型では道路が画面の縦を貫くので、**文字は上帯（空とビルの上部）**に置く。
出典は表示義務でもあるので、下帯に読める大きさで置く。

Scene 1 (0.0–1.3s): `city.mp4` のみ全面。8台が国道2号を駆け抜ける。文字ゼロ。
Scene 2 (1.3–2.6s): 上から下方向の濃紺グラデーション（y 12%〜34%）が入り、その上に h1 で「この街は、」が per-word staggered reveal。
Scene 3 (2.6–3.7s): **同じ位置で** hard-cut word-swap し「つくり物じゃない。」に入れ替わる（これが signature の動き — フェードしない）。2 行に折り返してよい。
Scene 4 (3.7–4.5s): 文はそのまま held。下帯（y 78%〜86%）に label で「国土交通省 PLATEAU 3D都市モデル / 福山市 2020年度」が fade-in。動いているのは映像だけ。

## Frame 4 — 芦田川大橋

- scene: 芦田川大橋の主塔をくぐる。地名が一度だけ、静かに入る
- duration: 4.5s
- transition_in: cut
- status: animated
- src: compositions/frames/04-bridge.html
- poster: 3.5s
- type: feature_showcase
- blueprint: titlecard-reveal (Adapt)
- focal: assets/bridge.mp4
- roles: bridge.mp4 = background (full-bleed)
- asset_candidates: assets/bridge.mp4 — 芦田川大橋、斜張橋の主塔とケーブルをくぐる 1080x1920 (4.5s)。2.1s (63コマ目) で「芦田川大橋」の看板の下を通る。看板は画面中央 (y 30〜42%) に来るので、そこに文字を置かない
- onscreen: 「芦田川大橋」/ 小さく「Ashidagawa Ohashi Bridge」

道中の見せ場。**意図的に止めるフレーム**。縦型は斜張橋と相性が良く、主塔とケーブルが画面の縦を使う。
ゲーム内の看板が中央にあるので、ネームプレートは**下帯**に置く。

Scene 1 (0.0–2.1s): `bridge.mp4` のみ全面。主塔とケーブルが迫ってくる。文字ゼロ。
Scene 2 (2.1–3.1s): 主塔をくぐる拍で、下帯（y 68%〜80%）に黄の rule と h2「芦田川大橋」が **slide-up crossfade** で一度だけ入る（このフレーム唯一の動き）。下敷きは濃紺 75% の帯。
Scene 3 (3.1–4.5s): そのすぐ下に label で「Ashidagawa Ohashi Bridge」が fade。以後完全に held。

## Frame 5 — 海沿いを南へ

- scene: 県道22号、瀬戸内海沿いを南下。距離の数字が駆け上がる
- duration: 4s
- transition_in: cut
- status: animated
- src: compositions/frames/05-coast.html
- poster: 3.5s
- type: benefit_highlight
- blueprint: compose
- focal: assets/coast.mp4
- roles: coast.mp4 = background (full-bleed)
- asset_candidates: assets/coast.mp4 — 県道22号の海沿いを南下 1080x1920 (4.0s)。左に瀬戸内海と島影、右に山と町並み
- onscreen: 「福山駅から」+ 数字 20.7 が駆け上がる +「km」/ 小さく「県道22号 → 鞆の浦」

ワンウェイであることを一言で伝える。数字が動くので「まだ距離がある／ゴールへ向かっている」が出る。
縦型では**上帯に数字**を大きく置く（海と空の上、画面の主役にする）。

Scene 1 (0.0–1.0s): `coast.mp4` のみ全面。左手に瀬戸内海と島影が開ける。文字ゼロ。
Scene 2 (1.0–2.3s): 上帯（y 14%〜34%）に濃紺 86% の板が入り、その上に label で「福山駅から」、続けて stat-value で数字が **value-scaled counter** により 0 → 20.7 へ駆け上がり、着地と同時に「km」が添う。数字は画面幅いっぱいを使う大きさ（display 相当）。
Scene 3 (2.3–4.0s): 数字が確定して held（カウンタは二度と動かさない）。下帯（y 78%〜86%）に label で「県道22号 → 鞆の浦」が fade-in。動いているのは映像だけ。

## Frame 6 — 常夜燈にゴール

- scene: 鞆の浦。常夜燈の手前でゴールし、名前が入れ替わりで立つ
- duration: 5s
- transition_in: cut
- status: animated
- src: compositions/frames/06-goal.html
- poster: 4.5s
- type: feature_showcase
- blueprint: titlecard-reveal (Adapt)
- focal: assets/goal.mp4
- roles: goal.mp4 = background (full-bleed)
- asset_candidates: assets/goal.mp4 — 鞆の浦・常夜燈へのゴール 1080x1920 (5.0s)。2.1s (63コマ目) に「GOAL / 鞆の浦 常夜燈」のゲートをくぐり、その後 常夜燈が画面左寄りに立ち、8台が足元に停まる
- onscreen: 「GOAL」→（入れ替え）「鞆の浦 常夜燈」/ 小さく「1859年・高さ11m ・ Tomonoura Joyato」

必ず伝える 3 点の最後。縦型は常夜燈という**縦の被写体**に最も合う。
常夜燈は画面の左寄り・中央の帯に立つので、名前は**下帯**に置いて塔にかけない。

Scene 1 (0.0–1.9s): `goal.mp4` のみ全面。ゲートが迫ってくる。文字ゼロ。
Scene 2 (1.9–2.7s): ゴールをくぐる拍で、画面中央やや下に display の「GOAL」が黄で spring-pop entrance（大きく、~70% 幅）。
Scene 3 (2.7–3.7s): 「GOAL」が **scale-swap** で縮みながら上へ退き、入れ替わりに h1「鞆の浦 常夜燈」が下帯（y 66%〜78%）に着地。下敷きは濃紺 75% の帯。
Scene 4 (3.7–5.0s): その下に label で「1859年・高さ11m ・ Tomonoura Joyato」が fade。以後 held。

## Frame 7 — エンドカード

- scene: 濃紺の地にロゴと URL。ブラウザで今すぐ遊べることを言い切る
- duration: 3.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-endcard.html
- poster: 3s
- type: cta
- blueprint: logo-assemble-lockup (Adapt)
- focal: (映像なし・タイポグラフィのみ)
- roles: —
- asset_candidates: none — 映像は使わない。地は frame.md の ink-black、タイポグラフィのみ
- onscreen: 「FUKUYAMA KART / 福山グランプリ」+「tatsuya1970.github.io/fukuyama-kart」+「ブラウザで、いますぐ ・ インストール不要 ・ 最大8人」

唯一の静止フレームで、唯一のベタ地フレーム。URL は最後の 1.5 秒はフルに読める状態で完全静止させる。
縦型では**画面の縦中央に積む**（上下の余白は均等に）。URL のピルは横幅いっぱい近くを使い、
必要なら `tatsuya1970.github.io/` と `fukuyama-kart` の 2 行に折り返してよい（ピルは 1 枚のまま）。

Scene 1 (0.0–1.1s): 濃紺 `ink-black` 全面。中央に display で「FUKUYAMA KART」が per-word（チャンク）カスケードで組み上がる。2 行（FUKUYAMA / KART）に積んでよい。
Scene 2 (1.1–1.8s): 直下に黄の rule が左から引かれ、h3 で「福山グランプリ」が fade-in。
Scene 3 (1.8–2.5s): その下に URL が**黄地・濃紺文字のピル**として spring-pop。ピルは角 0（broadside は平面）。
Scene 4 (2.5–3.5s): 最下段に label で「ブラウザで、いますぐ ・ インストール不要 ・ 最大8人」が fade。以後**完全静止** — jitter も入れない。
