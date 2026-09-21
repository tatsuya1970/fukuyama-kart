# 同梱フォント

`NotoSansJP-400.woff2` / `NotoSansJP-700.woff2` / `NotoSansJP-900.woff2`

**Noto Sans JP** — Copyright The Noto Project Authors.
SIL Open Font License 1.1 (<https://openfontlicense.org/>) で配布されているものです。

## なぜ同梱しているか

HyperFrames のレンダリングは素の headless Chrome で走るので、システムの日本語フォント
(Yu Gothic / Hiragino など) が入っていません。ファイルとして同梱した `@font-face` しか効かず、
ネットワーク越しの `@import` にも頼れません。

## これはサブセットです

`tools/fetch_promo_font.mjs` が Google Fonts の css2 API に `text=` を付けて、
**この動画に出る文字だけ**を取ってきています (フル CJK は 1 書体 5MB 超あるため)。
中身は ASCII 全部・かな全部・よく使う記号と、絵コンテに出てくる漢字だけです。

動画の文言を変えるときは、先に `tools/fetch_promo_font.mjs` の `COPY` に新しい文字列を足して
取り直してください。足さないと新しい漢字が豆腐 (□) になります。

```
node tools/fetch_promo_font.mjs videos/fukuyama-kart-promo/assets/fonts
```
