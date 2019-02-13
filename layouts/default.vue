<template>
  <v-app>
    <!-- ツールバー -->
    <v-toolbar
      app
      dark
      color='teal darken-1'
    >
      <v-toolbar-title class='white--text'>Twin:te</v-toolbar-title>
    </v-toolbar>
    <!-- ログイン -->
    <login />
    <!-- サイドバー -->
    <v-navigation-drawer
      app
      right
      v-model='drawer'
    >
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class='title'>
              設定
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list
        dense
        class='py-0'
      >
        <v-list-tile
          v-for='item in navigationItems'
          :key='item.title'
          :to='item.link'
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      <v-list dense class='py-0'>
        <v-list-tile @click="deleteItems">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>時間割データの消去</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      </v-list>
      <v-list dense class='pa-2 ml-2'>
        <!-- <v-list-tile href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-url="https://twinte.net" data-hashtags="Twinte" data-lang="ja" data-show-count="false">
        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
          <v-list-tile-action>
            <v-icon>bubble_chart</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Twitterで共有</v-list-tile-title>
          </v-list-tile-content>`
        </v-list-tile> -->
        <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-url="https://twinte.net" data-hashtags="Twinte" data-lang="ja" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </v-list>
    </v-navigation-drawer>
    <v-content fill-height>
      <nuxt />
    </v-content>
    <!-- ナビゲーションバー -->
    <v-bottom-nav
      app
      :value='true'
      color='white'
    >
      <v-btn
        color='teal darken-3'
        flat
        value='reload'
        @click="sheet = true"
      >
        <span>semester</span>
        <v-icon>view_carousel</v-icon>
      </v-btn>
      <v-btn
        color='teal darken-3'
        flat
        value='home'
        to='/'
      >
        <span>home</span>
        <v-icon>event</v-icon>
      </v-btn>
      <v-btn
        color='teal darken-3'
        flat
        value='settings'
        @click='drawer = !drawer'
      >
        <span>settings</span>
        <v-icon>settings</v-icon>
      </v-btn>
    </v-bottom-nav>
    <!-- 学期選択 -->
    <v-bottom-sheet v-model="sheet">
      <v-list>
        <v-subheader>どの学期を見ますか?</v-subheader>
        <v-list-tile
          v-for="(tile, index) in tiles"
          :key="index"
          @click="changeSemester(index)"
        >
          <v-list-tile-title>{{ tile.title }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-bottom-sheet>
  </v-app>
</template>
<script>
import login from '~/components/default_login.vue'
export default {
  // el: '#app',
  components: {
    login
  },
  data () {
    return {
      drawer: null,
      sheet: false,
      navigationItems: [
        { title: 'このアプリの使い方', icon: 'question_answer', link: 'tutorial' },
        { title: 'About', icon: 'group', link: 'about' },
        { title: '表示設定', icon: 'dashboard', link: 'view' }
      ],
      tiles: [
        { title: '春A' },
        { title: '春B' },
        { title: '春C' },
        { title: '秋A' },
        { title: '秋B' },
        { title: '秋C' }
      ]
    }
  },
  computed: {
    loginData: function () {
      return this.$store.state.loginData
    }
  },
  mounted () {
    this.$store.dispatch('restore')
  },
  methods: {
    async login () {
      await this.$store.dispatch('login', {
        id: this.form.id,
        pass: this.form.pass
      })
      this.loginDialogIsShow = false
    },
    async deleteItems () {
      localStorage.removeItem('twinte-data')
      location.href = '/'
    },
    changeSemester (index) {
      let name = 'haruA'
      switch (index) {
        case 0:
          name = 'haruA'
          break
        case 1:
          name = 'haruB'
          break
        case 2:
          name = 'haruC'
          break
        case 3:
          name = 'akiA'
          break
        case 4:
          name = 'akiB'
          break
        case 5:
          name = 'akiC'
          break
        default:
          break
      }
      this.$store.commit('updated', { items: this.$store.state.items[index], season: name, change: true })
      this.sheet = false
    }
  }
}
</script>
