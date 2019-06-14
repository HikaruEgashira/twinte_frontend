<template>
  <v-container fill-height app ref="container" class="pa-2">
    <!-- 時間割 -->
    <v-layout>
      <v-flex xs2>
        <v-card
          class="text-xs-center"
          elevation="1"
          tile
          color
        >{{ this.$store.state.season[this.$store.state.nowSeason].realName }}</v-card>
        <v-card
          :height="tableSize"
          elevation="1"
          tile
          v-for="(r, index) in timeTable"
          :key="index"
          class="text-xs-center font-weight-bold"
          color
        >
          <ul class="pa-1 mx-1">
            <li :style="{ fontSize: fontSize / 2 + 'px', height: tableSize / 3 + 'px'}">{{ r[0] }}</li>
            <li :style="{ fontSize: fontSize / 2 + 'px', height: tableSize / 3 + 'px'}">
              {{ index + 1 }}
              <small>限</small>
            </li>
            <li :style="{ fontSize: fontSize / 2 + 'px', height: tableSize / 3 + 'px'}">{{ r[1] }}</li>
          </ul>
        </v-card>
      </v-flex>
      <!-- 教科 -->
      <v-flex xs2 v-for="(col, colNum) in items" :key="colNum">
        <v-card class="text-xs-center" tile color>
          <p class="ma-0">{{ week[colNum] }}</p>
        </v-card>
        <v-card
          :height="tableSize"
          ripple
          tile
          elevation="1"
          ref="card"
          v-for="(row, rowNum) in col"
          :key="rowNum"
          @click="dialogAction (colNum, rowNum)"
          :color="color(row.number)"
        >
          <v-card-text class="pa-0">
            <ul class="pa-0 mx-1">
              <li
                :style="{ fontSize: fontSize / theme.table[0].size + 'px' }"
                v-if="theme.table[0].show"
              >{{ row.number }}</li>
              <li
                :style="{ fontSize: fontSize / theme.table[1].size + 1 + 'px' }"
                v-if="theme.table[1].show"
                class="font-weight-bold"
              >{{ row.name | cutName(16) }}</li>
              <li
                :style="{ fontSize: fontSize / theme.table[2].size + 'px' }"
                v-if="theme.table[2].show"
              >{{ row.classroom | cutName(5) }}</li>
              <li
                :style="{ fontSize: fontSize / theme.table[3].size + 'px' }"
                v-if="theme.table[3].show"
              >{{ row.teacher | cutName(5) }}</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- 変更画面 -->
    <v-dialog v-model="dialog.isShow" width="800px" style="border-radius: 8px">
      <v-card v-show="!dialog.more">
        <v-card-title class="grey lighten-4 py-4 title hidden-xs-only">Detail</v-card-title>
        <v-container grid-list-sm class="px-4">
          <v-layout v-cloak>
            <v-flex xs12>
              <v-form>
                <v-layout>
                  <v-flex xs6>
                    <v-text-field
                      v-if="dialog.editmode"
                      v-model="dialog.className"
                      label="class name"
                      required
                      @keyup.enter.prevent="dialogSave"
                    ></v-text-field>
                    <v-card v-else>
                      <v-card-text>授業名: {{ dialog.className }}</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn icon @click="dialog.editmode=!dialog.editmode">
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn icon @click="dialogSave()">
                      <v-icon>done</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn icon @click="confirmI('このアイテムを削除しますか？', 'del')">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-card>
                <v-card-text>科目番号: {{ dialog.number }}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-card>
                <v-card-text>開講時期: {{ dialog.season }}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-card>
                <v-card-text>授業時間: {{ dialog.time }}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 v-if="!dialog.editmode">
              <v-card>
                <v-card-text>教室: {{ dialog.classroom }}</v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 v-else>
              <v-card>
                <v-card-text>
                <v-text-field
                  v-model="dialog.classroom"
                  label="教室"
                  required
                  @keyup.enter.prevent="dialogSave"
                ></v-text-field>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-card>
                <v-card-text>担当教師: {{ dialog.teacher }}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-expansion-panel>
                <v-expansion-panel-content>
                  <div slot="header">
                    授業出席: {{ value | trunc }}%
                    <v-progress-linear
                      :rotate="270"
                      :size="100"
                      :width="15"
                      :value="value"
                      color="teal"
                    ></v-progress-linear>
                  </div>
                  <v-card>
                    <v-card-text>授業回数: {{ dialog.absent + dialog.attend }}回</v-card-text>
                    <v-card-text>
                      出席: {{ dialog.attend }}回
                      <v-btn icon color="success lighten-5 black--text" @click="dialog.attend++">+</v-btn>
                      <v-fab-transition>
                        <v-btn
                          icon
                          color="primary lighten-5 black--text"
                          v-show="dialog.attend > 0"
                          @click="dialog.attend--"
                        >-</v-btn>
                      </v-fab-transition>
                    </v-card-text>
                    <v-card-text>
                      欠席: {{ dialog.absent }}回
                      <v-btn icon color="success lighten-5 black--text" @click="dialog.absent++">+</v-btn>
                      <v-fab-transition>
                        <v-btn
                          icon
                          color="primary lighten-5 black--text"
                          v-show="dialog.absent > 0"
                          @click="dialog.absent--"
                        >-</v-btn>
                      </v-fab-transition>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-textarea name="memo" label="memo" v-model="dialog.memo"></v-textarea>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn
            flat
            color="success"
            :href="dialog.url"
            v-if="isSafari() || dialog.url.indexOf('https') !== 0"
          >シラバス</v-btn>
          <div id="vue-frame" @click="dialog.more = true" class="px-4" v-else>
            <vue-frame text="シラバス" :url="dialog.url" frame="myframe"></vue-frame>
          </div>
          <v-spacer></v-spacer>
          <v-btn flat color="success" @click="dialogSave">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- シラバス画面 -->
    <v-dialog v-model="dialog.more" width="800px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title hidden-xs-only">Detail</v-card-title>
        <v-container grid-list-sm class="px-0 pb-0">
          <v-flex xs12>
            <iframe id="myframe" height="400em" width="100%" frameborder="0" allowfullscreen></iframe>
          </v-flex>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="success" @click="dialog.more = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- confirm -->
    <v-dialog v-model="Confirm.bool" max-width="290">
      <v-card style="border-radius: 8px">
        <v-card-title class="title">{{ Confirm.text }}</v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="teal darken-1" flat="flat" @click="Confirm.bool = false">Disagree</v-btn>

          <v-btn color="teal darken-1" flat="flat" @click="confirmAction(Confirm.func)">Agree</v-btn>
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
      Confirm: { text: '', func: '', bool: false },
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
        teacher: '',
        attend: 0,
        absent: 0,
        memo: '',
        editmode: false
      },
      timeTable: [
        ['8:40', '9:55'],
        ['10:10', '11:25'],
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
      return this.$store.state.items[this.$store.state.nowSeason]
    },
    theme: function () {
      return this.$store.state.theme
    },
    value: function () {
      if (this.dialog.attend === 0) return 0
      return (this.dialog.attend / (this.dialog.attend + this.dialog.absent)) * 100
    }
  },
  mounted () {
    this.$nextTick(() => {
      // テーブルの高さ調整
      this.tableSize =
        (this.$refs.container.clientHeight - 19 - 16 - 1) /
        this.timeTable.length
      this.adjustFontsize()
    })
  },
  filters: {
    cutName (value, limit) {
      if (value.search(/[E]/) === 0) return value.slice(0, 27)
      return value.slice(0, limit)
    },
    trunc (num, n) {
      if (!num) return num
      const digit = String(num).split('.')[1]
        ? String(num).split('.')[1].length
        : null
      if (!digit) return num
      Math.trunc = Math.trunc || function (x) {
        return x < 0 ? Math.ceil(x) : Math.floor(x)
      }
      if (n > 1) {
        num *= 10 ** n
        return Math.trunc(num) / 10 ** n
      } else {
        return Math.trunc(num)
      }
    }
  },
  methods: {
    confirmI (text, func) {
      this.Confirm = { text, func, bool: true }
    },
    confirmAction (func) {
      switch (func) {
        case 'del':
          this.deleteItem()
          break
        case 'save':
          this.dialogSave()
          break
      }
    },
    deleteItem () {
      this.$store.commit('update', { dialog: this.dialog, name: false })
      this.$store.dispatch('save', { state: this.$store.state })
      this.dialog.isShow = false
      this.Confirm.bool = false
    },
    dialogAction (col, row) {
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
        this.dialog.attend = this.items[col][row].attend
        this.dialog.absent = this.items[col][row].absent
        this.dialog.memo = this.items[col][row].memo
        switch (this.dialog.number.split('')[0]) {
          case 'G':
            this.dialog.url = `http://www.coins.tsukuba.ac.jp/syllabus/${this.items[col][row].number}.html`
            break
          default:
            this.dialog.url = `https://kdb.tsukuba.ac.jp/syllabi/2019/${this.items[col][row].number}/jpn/#course-title`
            break
        }
      }
    },
    dialogSave () {
      this.confirm = true
      this.dialog.isShow = false
      this.dialog.editmode = false
      this.$store.commit('update', { dialog: this.dialog, name: true })
      this.$store.dispatch('save', { state: this.$store.state })
      this.Confirm.bool = false
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
    },
    isSafari () {
      const userAgent = window.navigator.userAgent
      return userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1
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
</style>