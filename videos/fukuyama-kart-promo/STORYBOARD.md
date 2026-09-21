---
format: 1920x1080
duration: 30s
message: "実在の福山が、そのままコースになる — ブラウザで、8人で"
arc: 福山城で掴む → 8人で出走 → 実在の街 → 芦田川大橋 → 海沿いを南へ → 常夜燈にゴール → URL
audience: 福山・鞆の浦にゆかりのある人と、PLATEAU / 3D都市モデルに関心のある人
mode: autonomous
music: none
---

## Video direction

- **パレット（`frame.md` の役割どおり。色を発明しない）** — 地 = `ink-black` 濃紺 `#0B1A2A` / 本文 = `cream` 白 /
  アクセント = `fire-orange` 黄 `#FFD83D` ただ一色。第二のアクセントは作らない。
  実写フレーム (1〜6) は**映像そのものが地**で、文字の下敷きだけが濃紺 75%。
  declarative なエンドカード (7) だけが濃紺のベタ地を持つ。
- **タイポ** — `frame.md` の役割名で指定する（display / h1 / h2 / lead / label）。生のフォント名や px は書かない。
  日本語が載るので `frame.md` のフォントスタックをそのまま使うこと。
- **モーション文法** — 既定のイージングは長い尾を引く `power3`（弾ませない）。
  入場は spring-pop entrance を smooth settle で。語の出現は per-word staggered reveal、
  言い換えは hard-cut word-swap（フェードしない）。
- **出し方のモデル（前倒し禁止）** — このビデオは**無音**なので、声の代わりに「画が語る順番」に合わせて出す。
  各フレームは必ず**映像だけの無文字の窓から始め**、文字はその後ろ半分に散らして出す。
  t=0 に全部載せることを禁ずる。
- **静止の配分** — フレーム 4（芦田川大橋）と 7（エンドカード）は**意図的に止める**フレーム。
  4 は橋を見せるため、7 は URL を読ませるため。それ以外は最後の窓で hold に入る。
  hold 中に動かしてよいのは映像そのものだけ。
- **カット** — 1→6 はすべてハードカット（レースの速度感はカットの速さで出す）。6→7 だけ 0.4s クロスフェード。
- **可読性** — 明るい昼景の上に白文字を置くので、**文字には必ず下敷き**（濃紺 75% の帯、または下方向グラデーション）。
  文字は上下左右 5.5cqw の内側、かつ下端 17%（キャプション帯）には置かない。
- **やらないこと** — 無限ループ（particles / marquee / 回り続けるロゴ）、`Math.random` や `Date.now`、
  保持中の lazy breathing（カードの拡大縮小ループ）、後半の遅いパン/プッシュ、
  第二のアクセント色、角丸・影・グラデーション地（broadside は平面）、
  2 つの失敗形（前倒しして固まる「スライドショー」／全部が独立に漂う「スクリーンセーバー」）。

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
- asset_candidates: assets/castle.mp4 — 福山城天守の空撮 (7度/秒で回り込む 5.0s)。PLATEAU 福山市 LOD2 の実写テクスチャ
- onscreen: 「実在の、福山。」→「福山グランプリ」

掴みは**街そのもの**。ゲーム画面だと分からせずに始め、実写テクスチャの天守が回り込むところで
「これは実在の福山だ」と気づかせる。タイトルは後半に置いて、次のカットへ勢いを渡す。

Adapt: ビートで文を組み上げる signature（各ビートが自分の動きを持ち、最後に payoff が pop する）は残す。
組み上げる場所が素のキャンバスではなく**実写映像の上**で、payoff が一文ではなくワードマークになる。

Scene 1 (0.0–1.8s): `castle.mp4` のみ全面。天守が右へ回り込み始める。文字ゼロ。full-width strip、映像 100%。
Scene 2 (1.8–2.9s): 下 1/3 に濃紺 75% の帯が下からワイプで入り、その上に「実在の、」「福山。」が per-word staggered reveal で 2 拍。rule-of-thirds の下段左、帯の高さは画面の ~18%。
Scene 3 (2.9–3.8s): 文が hard-cut word-swap で消え、同じベースラインに黄の rule（36×2 のスタブ）が左から引かれる。映像は回り続ける。
Scene 4 (3.8–5.0s): rule の上に display で「福山グランプリ」が spring-pop entrance（smooth settle）で着地し、その右下に label で小さく「FUKUYAMA KART」。以後 held — 文字は動かさず、映像の回り込みだけが生きている。

## Frame 2 — 8人で出走

- scene: 福山駅のスタート。8台が前に並んで走り出し、8色のドライバーチップが順に並ぶ
- duration: 3.5s
- transition_in: cut
- status: animated
- src: compositions/frames/02-eight.html
- poster: 3s
- type: benefit_highlight
- blueprint: grid-card-assemble (Adapt)
- focal: assets/grid.mp4
- roles: grid.mp4 = background (full-bleed)
- asset_candidates: assets/grid.mp4 — 福山駅のスタートグリッド、8台が前方に並んで発進 (3.5s)
- onscreen: 8色のドライバーチップが左から順に並ぶ → 「最大8人」→「オンライン対戦」

必ず伝える 3 点のうちの 1 つ。**数を見せる** — 8 台が画に入っている映像の上に、
ゲーム内の 8 人の色そのままのチップを左から順に置いていく。8 つ揃った瞬間に言葉が来るので、
言葉より先に数が伝わる。

Adapt: N 個が**段差をつけて自己組み立てする** signature は残す。組み上がるのがカードのグリッドではなく
実写映像の上の 8 個のチップ列で、末尾の zoom-out は使わない（映像が動いているので不要）。

Scene 1 (0.0–0.9s): `grid.mp4` のみ全面。8台が一斉に発進する。文字ゼロ。
Scene 2 (0.9–2.3s): 下段に濃紺 75% の帯がワイプイン。その上に 8 個の丸いドライバーチップが**左から 1 つずつ**着地（per-item stagger、各チップは spring-pop entrance の smooth settle）。色はゲーム内の 8 台と同じ。full-width strip、帯の高さ ~14%。
Scene 3 (2.3–3.5s): 8 個目が着地した拍で、チップ列の右に h2 で「最大8人」が spring-pop、半拍遅れて label で「オンライン対戦」が fade。以後 held。

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
- asset_candidates: assets/city.mp4 — 国道2号の市街地を 8台で疾走 (4.5s)
- onscreen: 「この街は、」→（入れ替え）「つくり物じゃない。」→ 小さく「国土交通省 PLATEAU 3D都市モデル / 福山市 2020年度」

ここが動画の主張。ビルの一棟一棟が実在の建物であることを、控えめな出典表記で裏づける。
出典は表示義務でもあるので、読める大きさで、しかし映像を邪魔しない位置に置く。

Scene 1 (0.0–1.3s): `city.mp4` のみ全面。8台が国道2号を駆け抜ける。文字ゼロ。
Scene 2 (1.3–2.6s): 画面下から上方向の濃紺グラデーション（下端 35% まで）が入り、その上・中央やや左に h1 で「この街は、」が per-word staggered reveal。asymmetric 60/40（文字が左 60）。
Scene 3 (2.6–3.7s): **同じ位置で** hard-cut word-swap し「つくり物じゃない。」に入れ替わる（これが signature の動き — フェードしない）。
Scene 4 (3.7–4.5s): 文はそのまま held。左下隅に label で「国土交通省 PLATEAU 3D都市モデル / 福山市 2020年度」が fade-in。動いているのは映像だけ。

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
- asset_candidates: assets/bridge.mp4 — 芦田川大橋、斜張橋の主塔とケーブルをくぐる (4.5s)
- onscreen: 「芦田川大橋」/ 小さく「Ashidagawa Ohashi Bridge」

道中の見せ場。**意図的に止めるフレーム**（Video direction の静止配分）。主塔をくぐる瞬間に地名を置き、
あとは橋に任せる。文字を足しすぎない。

Adapt: **動きはただ 1 つ、あとは静止**という signature を残す。中央のタイトルカードではなく、
実写の上の左下ネームプレートとして出す。

Scene 1 (0.0–2.1s): `bridge.mp4` のみ全面。主塔とケーブルが迫ってくる。文字ゼロ。
Scene 2 (2.1–3.1s): 主塔をくぐる拍で、左下に黄の rule と h2「芦田川大橋」が **slide-up crossfade** で一度だけ入る（このフレーム唯一の動き）。rule-of-thirds 左下、下敷きは濃紺 75% の小さな帯。
Scene 3 (3.1–4.5s): そのすぐ下に label で「Ashidagawa Ohashi Bridge」が fade。以後完全に held — 文字は一切動かさない。

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
- asset_candidates: assets/coast.mp4 — 県道22号の海沿いを南下 (4.0s)
- onscreen: 「福山駅から」+ 数字 20.7 が駆け上がる +「km」/ 小さく「県道22号 → 鞆の浦」

ワンウェイであることを一言で伝える。数字が動くので「まだ距離がある／ゴールへ向かっている」が出る。
どの blueprint も素直に当たらないので compose。motion-language の語彙だけで組む。

Scene 1 (0.0–1.0s): `coast.mp4` のみ全面。左手に瀬戸内海と島影が開ける。文字ゼロ。
Scene 2 (1.0–2.3s): 右上に label で「福山駅から」が per-word staggered reveal、続けて stat-value で数字が **value-scaled counter** により 0 → 20.7 へ駆け上がり、着地と同時に「km」が添う。rule-of-thirds 右上、下敷きは濃紺 75% の小さな板。
Scene 3 (2.3–4.0s): 数字が確定して held（カウンタは二度と動かさない）。左下に label で「県道22号 → 鞆の浦」が fade-in。動いているのは映像だけ。

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
- asset_candidates: assets/goal.mp4 — 鞆の浦・常夜燈へのゴール (5.0s)
- onscreen: 「GOAL」→（入れ替え）「鞆の浦 常夜燈」/ 小さく「1859年・高さ11m ・ Tomonoura Joyato」

必ず伝える 3 点の最後。ゴールの瞬間に GOAL を出し、収まってから常夜燈の名前に**入れ替える**。
築年と高さを添えて「実在の場所に着いた」ことを確かめさせる。

Adapt: 「ひとつの抑制された動きで出して静止させる」signature を残しつつ、カードを 1 枚ではなく
**2 枚の入れ替え**にする（GOAL → 地名）。入れ替えは scale-swap で、同じ画面中心を受け渡す。

Scene 1 (0.0–1.9s): `goal.mp4` のみ全面。常夜燈が正面に立ち上がってくる。文字ゼロ。
Scene 2 (1.9–2.7s): ゴールをくぐる拍で、画面中央に display の「GOAL」が黄で spring-pop entrance（大きく、~55% 幅）。centered。
Scene 3 (2.7–3.7s): 「GOAL」が **scale-swap** で縮みながら上へ退き、入れ替わりに h1「鞆の浦 常夜燈」が同じ中心に着地。下敷きは濃紺 75% の帯。
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

唯一の静止フレームで、唯一のベタ地フレーム。ここまで動きっぱなしなので、止まることが効く。
URL は最後の 1.5 秒はフルに読める状態で完全静止させる（**意図的に止めるフレーム**）。

Adapt: **マークが画面上に「出来上がる」** signature を残す（文字がカスケードして組み上がる）。
衛星やオービットは使わず、組み上がったロックアップをそのまま URL へ延長する。

Scene 1 (0.0–1.1s): 濃紺 `ink-black` 全面。中央に display で「FUKUYAMA KART」が per-word（チャンク）カスケードで組み上がる。centered、幅 ~60%、chrome は出さない（declarative フレーム）。
Scene 2 (1.1–1.8s): 直下に黄の rule が左から引かれ、h3 で「福山グランプリ」が fade-in。
Scene 3 (1.8–2.5s): その下に URL「tatsuya1970.github.io/fukuyama-kart」が**黄地・濃紺文字のピル**として spring-pop。ピルは角 0（broadside は平面）。
Scene 4 (2.5–3.5s): 最下段に label で「ブラウザで、いますぐ ・ インストール不要 ・ 最大8人」が fade。以後**完全静止** — jitter も入れない。
