<template>
  <v-container fluid grid-list-sm>
    <h1 class="title font-weight-bold pt-5 pb-3 text-xs-center">QRコードの取得と共有</h1>
    <v-layout>
      <v-flex xs12>
        <v-card class="text-xs-center">
          <v-card-text>
            <h5>このQRコードをほかのユーザーのTwin:teで読み取ることで、時間割を共有することができるようになります。時間割が大きい場合時間割が表示されません。</h5>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <vue-q-art class="text-xs-center pa-5" :config="config"></vue-q-art>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import VueQArt from 'vue-qart'
export default {
  components: { VueQArt },
  data () {
    return {
      config: {
        value: '',
        imagePath: 'qr.png',
        filter: 'color'
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.updateQRcode()
    })
  },
  methods: {
    updateQRcode () {
      const url = require('url')
      const arr = this.$store.state.number
        .map((v, i) => {
          if (v.length) return v
          else return ['none']
        })
      this.config.value = url.format({
        protocol: 'https:',
        host: 'twinte.net',
        pathname: '/number',
        query: arr
      })
      console.log(this.config.value)
      if (this.config.value.length > 48) {
        location.href = this.config.value
      }
    }
  }
}
</script>