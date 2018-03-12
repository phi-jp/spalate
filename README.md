# spalate

single page application template

- ルーマニア語で「洗浄」らしい
- おまえらの腐ったコードを俺らのテンプレートで綺麗にしてやるぜ！みたいな。
- ルーマニアがどんな国かはしらない

by @Haltie


## run test

サーバーが立ち上がって watch & build する

```
$ cd test
$ npm test
```


## run icon output

```
$ cd test
$ node ../bin/spalate.js webfont
```


## run deploy to circleci

```
$ cd test
$ node ../bin/spalate.js deploy circleci
```


## memo

- font generator 候補
  - https://www.npmjs.com/package/svgicons2svgfont
  - https://www.npmjs.com/package/webfont
  - https://www.npmjs.com/package/fontcustom
