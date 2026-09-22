---
workflow: product-launch-video
flow: automation
storyboard: no
message: "実在の福山が、そのままコースになる — ブラウザで、8人で"
destination: youtube
aspect: 1920x1080
language: ja
audience: 福山・鞆の浦にゆかりのある人と、PLATEAU / 3D都市モデルに関心のある人
length: 30s
angle: "福山駅から鞆の浦の常夜燈まで、8人で駆け抜ける 20.5km の旅"
style_preset: broadside
---

## Intent

福山グランプリ (Fukuyama Kart) の SNS 紹介動画。国土交通省 PLATEAU の 3D 都市モデル
（福山市 2020年度）から起こした実在の街を、ブラウザだけで、最大 8 人で走れることを
30 秒で伝える。トーンは「かっこいい」— 観光 PR ではなくレースゲームのプロモとして、
速度感と実在感を前に出す。

コースは周回ではなく福山駅発・鞆の浦の常夜燈着のワンウェイ 20.5km。動画もその順路
どおりに進み、見せ場が自然に並ぶ構成にする。

- 0-4s   福山城の天守を空から → タイトル
- 4-12s  8 台が福山駅をスタート、市街地を疾走
- 12-20s 芦田川大橋の主塔をくぐる / 海沿いを南下
- 20-27s 鞆の浦・常夜燈へ 8 台のゴール争い
- 27-30s ロゴ + URL +「ブラウザで、いますぐ」

## Assets

ゲーム本体から撮り下ろす。実写素材や外部素材は使わない。

- 福山城の俯瞰（PLATEAU LOD2 の実写テクスチャの天守）
- 福山駅のスタートグリッド（8 台が並ぶ）
- 市街地の走行
- 芦田川大橋（斜張橋の主塔とケーブル）
- 県道22号の海沿い
- 鞆の浦・常夜燈のゴール
- タイトル画面のコース図

## Customizations

- 必ず入れる 3 点: **最大 8 人のオンライン対戦** / **福山城** / **鞆の浦の常夜燈**
- 公開 URL を終盤に出す: https://tatsuya1970.github.io/fukuyama-kart/
- 出典表記を入れる: 国土交通省 PLATEAU「3D都市モデル（Project PLATEAU）福山市（2020年度）」

## Notes

- ゲーム画面は 16:9 なので、そのまま全画面で使える（destination を 16:9 にした理由）
- デザインプリセット broadside は、過去の hiroshima-kart-versus / matsue-kart-promo で
  ユーザーが選んだもの（remembered preference）
- **完全に無音で作る**（ナレーションも BGM もなし）。HeyGen に未サインインで、ローカルの
  Kokoro / MusicGen も依存が未導入のため BGM を付ける手段が無く、ユーザーが無音を選択。
  SNS はミュート再生が多いので、文字とモーションだけで成立する構成にする。
  STORYBOARD の `music: none` + SCRIPT.md なし が無音の印。
