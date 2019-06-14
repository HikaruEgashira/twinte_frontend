# twin:te

- アプリケーションURL => https://twinte.net
- アプリ紹介LP => https://twinte.netlify.com
- 公式Twitter => https://twitter.com/te_twin

> twins_timetable nuxt+vuetify project

## 動作仕様

- LocalStorage確認、復元できればログイン状態になる
- 復元データがなければ未ログイン状態、ログイン画面が自動的に表示される
- 教科をクリックすると詳細画面が出てきてmoreをおすとシラバス画面が出てくる
- 詳細画面では名前の変更が可能、saveを押したとき、画面が閉じると同時にvuexへコミットされる
- シラバスはボタンを押すと取得されて表示されるbackで詳細画面に戻る
