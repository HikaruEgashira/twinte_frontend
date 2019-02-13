<template>
  <v-container
    fill-height
    app
    ref="container"
    class="pa-2"
  >
    <!-- 時間割 -->
    <v-layout>
      <v-flex xs2>
        <v-card class='text-xs-center' elevation='1' tile color=''>
          {{ this.$store.state.season.realName }}
        </v-card>
        <v-card :height=tableSize elevation='1' tile v-for='(r, index) in timeTable' :key='index' class='text-xs-center font-weight-bold' color=''>
        <ul class="pa-1 mx-1">
          <li :style="{ fontSize: fontSize / 2 + 'px', height: tableSize / 3 + 'px'}">{{ r[0] }}</li>
          <li :style="{ fontSize: fontSize / 2 + 'px', height: tableSize / 3 + 'px'}">{{ index + 1 }}<small>限</small></li>
          <li :style="{ fontSize: fontSize / 2 + 'px', height: tableSize / 3 + 'px'}">{{ r[1] }}</li>
        </ul>
        </v-card>
      </v-flex>
      <!-- 教科 -->
      <v-flex xs2 v-for='(col, colNum) in items' :key='colNum'>
        <v-card class='text-xs-center' tile color=''>
          <p class='ma-0'>{{ week[colNum] }}</p>
        </v-card>
        <v-card :height=tableSize ripple tile elevation='1' ref='card' v-for='(row, rowNum) in col' :key='rowNum' @click='dialogAction (colNum, rowNum)' :color='color(row.number)'>
          <v-card-text class='pa-0'>
            <ul class='pa-0 mx-1'>
              <li :style="{ fontSize: fontSize / theme.table[0].size + 'px' }" v-if="theme.table[0].show">{{ row.number }}</li>
              <li :style="{ fontSize: fontSize / theme.table[1].size + 1 + 'px' }" v-if="theme.table[1].show" class="font-weight-bold">{{ row.name | cutName(12) }}</li>
              <li :style="{ fontSize: fontSize / theme.table[2].size + 'px' }" v-if="theme.table[2].show">{{ row.classroom | cutName(5) }}</li>
              <li :style="{ fontSize: fontSize / theme.table[3].size + 'px' }" v-if="theme.table[3].show">{{ row.teacher | cutName(5) }}</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- 変更画面 -->
    <v-dialog v-model='dialog.isShow' width='800px'>
      <v-card v-show='!dialog.more'>
        <v-card-title class='grey lighten-4 py-4 title hidden-xs-only'>Detail</v-card-title>
        <v-container grid-list-sm class='px-4'>
          <v-layout v-cloak>
            <v-flex xs12>
              <v-form>
                <v-container>
                  <v-layout>
                    <v-flex xs11>
                      <v-text-field v-model='dialog.className' label='class name' required @keyup.enter.prevent="dialogSave">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs1>
                      <v-btn icon @click='dialogSave'>
                        <v-icon>done</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
              <v-card>
                <v-card-text>科目番号: {{ dialog.number }}</v-card-text></v-card></v-flex></v-layout>
          <v-layout>
            <v-flex xs12>
              <v-card>
                <v-card-text>開講時期: {{ dialog.season }}</v-card-text></v-card></v-flex></v-layout>
          <v-layout>
            <v-flex xs12>
              <v-card>
                <v-card-text>授業時間: {{ dialog.time }}</v-card-text></v-card></v-flex></v-layout>
          <v-layout>
            <v-flex xs12>
              <v-card>
                <v-card-text>教室: {{ dialog.classroom }}</v-card-text></v-card></v-flex></v-layout>
          <v-layout>
            <v-flex xs12>
              <v-card>
                <v-card-text>担当教師: {{ dialog.teacher }}</v-card-text></v-card></v-flex></v-layout>
        </v-container>
        <v-card-actions>
          <div id='vue-frame' @click='dialog.more = true' class="px-4">
            <vue-frame text='シラバス' :url=dialog.url frame='myframe'></vue-frame>
          </div>
          <v-spacer></v-spacer>
          <v-btn flat color='success' @click='dialogSave'>
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- シラバス画面 -->
    <v-dialog
      v-model='dialog.more'
      width='800px'
    >
      <v-card>
        <v-card-title class='grey lighten-4 py-4 title hidden-xs-only'>Detail</v-card-title>
        <v-container
          grid-list-sm
          class='px-0 pb-0'
        >
          <v-flex xs12 class="outer">
            <iframe id='myframe' height='400em' width='100%' frameborder='0' allowfullscreen>
            </iframe>
          </v-flex>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color='success' @click='dialog.more = false'>
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import VueFrame from 'vue-frame'

export default {
  components: { VueFrame },
  data () {
    return {
      fontSize: 0,
      tableSize: 0,
      dialog: {
        isShow: false,
        more: false,
        url: '',
        col: 0,
        row: 0,
        number: '',
        className: '',
        season: '',
        time: '',
        classroom: '',
        teacher: ''
      },
      timeTable: [
        ['8:40', '9:55'],
        ['10:10', '11.25'],
        ['12:15', '13:30'],
        ['13:45', '15:00'],
        ['15:15', '16:30'],
        ['16:45', '18:00']
      ],
      week: ['月', '火', '水', '木', '金']
    }
  },
  computed: {
    // store/index.jsから参照
    items: function () {
      return this.$store.state.items[this.$store.state.season.array]
    },
    theme: function () {
      return this.$store.state.theme
    }
  },
  mounted () {
    this.$nextTick(() => {
      // テーブルの高さ調整
      this.tableSize = (this.$refs.container.clientHeight - 19 - 16) / this.timeTable.length
      this.adjustFontsize()
    })
  },
  filters: {
    cutName: function (value, limit) {
      if (value.search(/[E]/) === 0) return value.slice(0, 24)
      return value.slice(0, limit)
    }
  },
  methods: {
    dialogAction: function (col, row) {
      // クリックしたときに詳細を表示
      if (this.items[col][row].number !== '') {
        this.dialog.isShow = true
        this.dialog.more = false
        this.dialog.col = col
        this.dialog.row = row
        this.dialog.className = this.items[col][row].name
        this.dialog.number = this.items[col][row].number
        this.dialog.season = this.items[col][row].season
        this.dialog.time = this.items[col][row].time
        this.dialog.classroom = this.items[col][row].classroom
        this.dialog.teacher = this.items[col][row].teacher
        switch (this.dialog.number.split('')[0]) {
          default:
            this.dialog.url = `https://kdb.tsukuba.ac.jp/syllabi/2018/${this.items[col][row].number}/jpn/#course-title`
            break
        }
      }
    },
    dialogSave: function () {
      this.dialog.isShow = false
      this.$store.commit('update', this.dialog)
      this.$store.dispatch('save', { state: this.$store.state })
    },
    adjustFontsize () {
      const nowHeight = this.tableSize
      const listNum = this.theme.table.length
      this.fontSize = nowHeight / listNum
    },
    color (number) {
      const char = number.split('')[0]
      switch (char) {
        case 'A':
          return 'teal lighten-5'
        case 'B':
          return 'teal lighten-5'
        case 'C':
          return 'teal lighten-5'
        case 'E':
          return 'teal lighten-5'
        case 'F':
          return 'teal lighten-5'
        case 'G':
          return 'teal lighten-5'
        case 'H':
          return 'teal lighten-5'
        case 'W':
          return 'teal lighten-5'
        case 'Y':
          return 'teal lighten-5'
        case '1':
          return 'purple lighten-5'
        case '2':
          return 'indigo lighten-5'
        case '3':
          return 'yellow lighten-5'
        default:
          return ''
      }
    }
  }
}
</script>

<style>
li {
  list-style: none;
  word-break: break-all;
}
[v-cloak] {
  display: none;
}
div.outer {
  -webkit-overflow-scrolling: touch;
}
</style>