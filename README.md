--------------------
追加部分
twinte.net frontend製作者として公開します。
改善部分など多いと思うので、プルリクを頂けるとありがたいです。
-------------------

# twins_timetable

> twins_timetable nuxt+vuetify project

## やったとこ

- テーブルの作成
- 時間割をタップで詳細を見られるように
- 縦を中央に揃える

## TODO

### 1

- 文字サイズの変更
- 教室コード（number）の文字コードなどを利用して分かりやすい色付け
- weekをタップすると一日だけ表示とか（候補）

### 2

- Loading画面
- componentの分割
- サイズ変更
- カラー変更
- 学期選択
- アプリ紹介
- homeボタンのバグ修正
- theme変更されない

## Build Setup

NUXTを利用しています

``` bash
npm i　#or yarn
vue ui
```

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out the [Nuxt.js](https://github.com/nuxt/nuxt.js) and [Vuetify.js](https://vuetifyjs.com/) documentation.

## 動作仕様

- LocalStorage確認、復元できればログイン状態になる
- 復元データがなければ未ログイン状態、ログイン画面が自動的に表示される
- 教科をクリックすると詳細画面が出てきてmoreをおすとシラバス画面が出てくる
- 詳細画面では名前の変更が可能、saveを押したとき、画面が閉じると同時にvuexへコミットされる
- シラバスはボタンを押すと取得されて表示されるbackで詳細画面に戻る
