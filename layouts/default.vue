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
    <!-- コンポネント -->
    <login />
    <!-- サイドバー -->
    <v-navigation-drawer
      app
      right
      v-model='drawer'
    >
      <navigation />
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
  </v-app>
</template>
<script>
import login from '~/components/default_login.vue'
import alert from '~/components/default_alert.vue'
import navigation from '~/components/default_navigation.vue'
export default {
  // el: '#app',
  components: {
    login,
    alert,
    navigation
  },
  data () {
    return {
      Confirm: { text: '', func: '', bool: false },
      drawer: null,
      sheet: false,
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
    confirm (text, func) {
      this.Confirm = { text, func, bool: true }
    },
    confirmAction (func) {
      switch (func) {
        case 'delAll':
          this.deleteItems()
          break
      }
    },
    async deleteItems () {
      localStorage.removeItem('twinte-data')
      location.href = '/'
    },
    changeSemester (index) {
      switch (index) {
        case 0:
          this.$store.commit('updated', { items: this.$store.state.items[index], number: [], season: 'haruA' })
          break
        case 1:
          this.$store.commit('updated', { items: this.$store.state.items[index], number: [], season: 'haruB' })
          break
        case 2:
          this.$store.commit('updated', { items: this.$store.state.items[index], number: [], season: 'haruC' })
          break
        case 3:
          this.$store.commit('updated', { items: this.$store.state.items[index], number: [], season: 'akiA' })
          break
        case 4:
          this.$store.commit('updated', { items: this.$store.state.items[index], number: [], season: 'akiB' })
          break
        case 5:
          this.$store.commit('updated', { items: this.$store.state.items[index], number: [], season: 'akiC' })
          break
        default:
          break
      }
      this.sheet = false
    }
  }
}
</script>
