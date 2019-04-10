<template>
  <v-container fluid grid-list-sm>
    <h1 class="title font-weight-bold pa-4 font-italic text-xs-center">{{ name }}の時間割</h1>
    <h3 class="pa-4 text-xs-center">授業番号一覧</h3>
    <h4 class="pa-4 text-xs-center">これまで作成した時間割を上書きします。これまでのものを残しておきたい場合は、<a href="https://twinte.net/qrcode">QRコード</a>を保存しておくことをお勧めします。</h4>
    <div v-for="(nums, i) in number" :key="i">
    <v-layout class="pa-4" v-if="nums !== 'none' && typeof nums === 'object'">
      <v-flex xs12 sm6 offset-sm3>
        <h5 class="pa-4 text-xs-center">{{ season[i] }}</h5>
        <v-card>
          <v-list>
          <v-list-tile v-for="n in nums" :key="n">
            <v-list-tile-content v-text="n">
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        </v-card>
        <div class="py-4 text-xs-center">
          <!-- <v-btn outline round @click="generate(season[i], nums, false)">時間割のプレビュー</v-btn> -->
          <v-btn outline round @click="generate(season[i], nums, true)">時間割への登録（これまでの時間割は削除されます）</v-btn>
        </div>
      </v-flex>
    </v-layout>
    <v-layout class="pa-4" v-else-if="nums !== 'none'">
      <v-flex xs12 sm6 offset-sm3>
        <h5 class="pa-4 text-xs-center">{{ season[i] }}</h5>
        <v-card>
          <v-list>
          <v-list-tile>
            <v-list-tile-content v-text="nums">
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        </v-card>
        <div class="py-4 text-xs-center">
          <!-- <v-btn outline round @click="generate(season[i], nums, false)">時間割のプレビュー</v-btn> -->
          <v-btn outline round @click="generate(season[i], nums, true)">時間割への登録（これまでの時間割は削除されます）</v-btn>
        </div>
      </v-flex>
    </v-layout>
    <v-snackbar auto-height v-model='log' :top='true' :timeout='3000'>
      {{ message }}
      <v-btn color='pink' flat @click='log = false'>Close</v-btn>
    </v-snackbar>
    </div>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      log: false,
      message: '',
      season: ['春A', '春B', '春C', '秋A', '秋B', '秋C'],
      name: 'QRコード',
      number: []
    }
  },
  asyncData (context) {
    return {
      number: context.query
    }
  },
  mounted () {
    this.$store.commit('login')
  },
  methods: {
    async generate (season, nums, save) {
      if (typeof nums === 'string') nums = [nums]
      switch (season) {
        case '春A':
          await this.$store.dispatch('number', { number: nums, semester: 'haruA' })
          break
        case '春B':
          await this.$store.dispatch('number', { number: nums, semester: 'haruB' })
          break
        case '春C':
          await this.$store.dispatch('number', { number: nums, semester: 'haruC' })
          break
        case '秋A':
          await this.$store.dispatch('number', { number: nums, semester: 'akiA' })
          break
        case '秋B':
          await this.$store.dispatch('number', { number: nums, semester: 'akiB' })
          break
        case '秋C':
          await this.$store.dispatch('number', { number: nums, semester: 'akiC' })
          break
      }
      this.$store.commit('reLogin', false)
      if (save) this.$store.dispatch('save', { state: this.$store.state })
      this.message = this.$store.state.isLogin ? '時間割を作成しました。' : '時間割の取得に失敗しました。'
      this.log = true
      this.$router.push('/')
    }
  }
}
</script>