<template>
  <v-container>
    <v-toolbar flat>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">設定</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <v-divider></v-divider>
    <v-list dense class="py-0">
      <v-list-tile v-for="item in navigationItems" :key="item.title" :to="item.link">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list dense class="py-0">
        <v-list-tile @click="$store.commit('relogin', true)">
          <v-list-tile-action>
            <v-icon>add</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>この学期の時間割データ追加</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="confirm('時間割データを端末内から削除します', 'delAll')">
          <v-list-tile-action>
            <v-icon>delete_sweep</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>時間割データの消去</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{ path: '/account/login' }">
          <v-list-tile-action>
            <v-icon>delete_sweep</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-if="username===''">ログイン</v-list-tile-title>
            <v-list-tile-title v-else>ようこそ{{ username }}さん！</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-list>
    <v-list dense class="pa-2 ml-2">
      <a
        href="https://twitter.com/share?ref_src=twsrc%5Etfw"
        class="twitter-share-button"
        data-url="https://twinte.net"
        data-hashtags="Twinte"
        data-lang="ja"
        data-show-count="false"
      >Tweet</a>
      <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    </v-list>
    <!-- confirm -->
    <v-dialog
      v-model="Confirm.bool"
      max-width="290"
    >
      <v-card style="border-radius: 8px">
        <v-card-title class="title">{{ Confirm.text }}</v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="teal darken-1"
            flat="flat"
            @click="Confirm.bool = false"
          >
            Disagree
          </v-btn>

          <v-btn
            color="teal darken-1"
            flat="flat"
            @click="confirmAction(Confirm.func)"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      Confirm: { text: '', func: '', bool: false },
      navigationItems: [
        { title: 'このアプリの使い方', icon: 'question_answer', link: 'tutorial' },
        { title: 'About', icon: 'group', link: 'about' },
        { title: '表示設定', icon: 'dashboard', link: 'view' },
        { title: '時間割の共有', icon: 'camera', link: 'qrcode' }
      ]
    }
  },
  methods: {
    confirm (text, func) {
      this.Confirm = { text, func, bool: true }
    },
    async deleteItems () {
      localStorage.removeItem('twinte-data')
      location.href = '/'
    },
    confirmAction (func) {
      switch (func) {
        case 'delAll':
          this.deleteItems()
          break
      }
    }
  }
}
</script>
