<template>
  <div>
    <v-dialog
      :value='!isLogin || reLogin'
      fullscreen
      hide-overlay
      transition='dialog-bottom-transition'
    >
      <v-card>
        <v-toolbar dark color='teal darken-1'>
          <v-toolbar-title>Twin:te</v-toolbar-title>
          <v-spacer/>
          <v-btn icon @click="$store.commit('reLogin', false)" v-if='reLogin'>
            <v-icon>clear</v-icon>
          </v-btn>
        </v-toolbar>

        <v-container style='max-width: 900px' class='text-xs-center'>
          <v-card-title class='title font-weight-bold'>Twin:teへようこそ！</v-card-title>
          <v-card class='my-3'>
            <v-card-text>
              <p>Twin:teは「簡単に・詳細で・見やすく・使いやすい」時間割を作ることができる筑波大学生専用のアプリです。</p>
              <p>はじめに利用規約をよくお読みください。</p>
            </v-card-text>
          </v-card>

          <v-btn
            href='https://twinte.net/api/info.html'
            flat
            color='success'
            v-if='isSafari()'
          >利用規約(こちらをクリック)</v-btn>
          <v-card-text id='vue-frame' @click='info = true' v-else>
            <vue-frame text='利用規約(こちらをクリック)' url='https://twinte.net/api/info.html' frame='info'></vue-frame>
          </v-card-text>
          <v-card-text>
            <v-checkbox v-model='selected' label='利用規約に同意する' color='success' @keyup.enter='login'></v-checkbox>
          </v-card-text>

          <v-card-title class='title font-weight-bold'>時間割を作る</v-card-title>
          <v-card min-height="700px">
            <v-card-text>
              <div>
                <v-tabs
                  fixed-tabs
                  color='teal'
                  dark
                  slider-color='yellow'
                  style="border-radius: 4px;"
                >
                  <v-tab :key='1'>授業番号登録</v-tab>
                  <v-tab :key='2'>スクリーンショットの読み取り</v-tab>
                  <v-tab :key='3'>CSVアップロード</v-tab>
                  <v-tab-item :key='1'>
                    <v-dialog v-model='dialog' width='500'>
                      <v-btn
                        absolute
                        icon
                        slot='activator'
                        color='success'
                        style='bottom:0px;left:0px;'
                      >?</v-btn>
                      <v-card>
                        <v-card-title class='headline teal white--text' primary-title dark>使い方</v-card-title>
                        <v-card-text>
                          履修している授業の授業番号入力することで時間割を作成することができます。複数入力することができますが、学期をまたぐ入力（春Aの授業と春Bの授業を同時に入力する等）は不具合が起こることがあるので学期を分けて入力してください。
                          時間割作成後に再度追加することが可能です。
                          授業番号がわからない場合は
                          <a href='https://twins.tsukuba.ac.jp'>Twins</a>や
                          <a href='https://kdb.tsukuba.ac.jp/'>KDB</a>を参照してください。
                        </v-card-text>
                        <v-divider></v-divider>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color='primary' flat @click='dialog = false'>OK</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>

                    <v-text-field v-model='task' label='授業番号を入力してください' solo @keydown.enter='create'>
                      <v-fade-transition slot='append'>
                        <v-icon v-if='task' @click='create'>add_circle</v-icon>
                      </v-fade-transition>
                    </v-text-field>

                    <v-divider class='mb-3'></v-divider>

                    <v-card v-if='tasks.length > 0'>
                      <v-slide-y-transition class='py-0' group tag='v-list'>
                        <template v-for='(task, i) in tasks'>
                          <v-divider v-if="i !== 0" :key="`${i}-divider`"></v-divider>

                          <v-list-tile :key='`${i}-${task}`'>
                            <v-list-tile-action>
                              <div slot='label' class='ml-3' v-text='task'></div>
                            </v-list-tile-action>

                            <v-spacer></v-spacer>

                            <v-scroll-x-transition>
                              <v-icon @click='deleteItem(i)'>delete</v-icon>
                            </v-scroll-x-transition>
                          </v-list-tile>
                        </template>
                      </v-slide-y-transition>
                    </v-card>
                    <!-- <div>
                        <v-menu offset-y>
                          <v-btn round slot='activator' color='primary' dark outline>入力する学期</v-btn>
                          <v-list>
                            <v-list-tile
                              v-for='(nthSemester, i) in semester'
                              :key='i'
                              @click='selectSemester = nthSemester'
                            >
                              <v-list-tile-title>{{ nthSemester }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </div>
                      {{ selectSemester }} -->
                    <div class='py-3'>
                      <v-btn round color='success' outline @click='numLogin()'>時間割の作成</v-btn>
                    </div>
                  </v-tab-item>

                  <v-tab-item :key='2'>
                    <v-dialog v-model='dialog3' width='500'>
                      <v-btn
                        absolute
                        icon
                        slot='activator'
                        color='success'
                        style='bottom:0px;left:0px;'
                      >?</v-btn>
                      <v-card>
                        <v-card-title class='headline teal white--text' primary-title dark>使い方</v-card-title>
                        <v-card-text>
                          <a href='https://twins.tsukuba.ac.jp'>Twins</a>にPC版でアクセスし、成績一覧を授業番号が見えるような状態でスクリーンショットしてください。以下のように授業番号のみが見えるように調節します。<br>
                          「解析開始」ボタンを押すと、写真を読み取り文字に変換します。<br>できるだけ画像が大きくなるようにトリミングしてあげると認識しやすくなります。<br>「登録画面に追加する」を押すと、授業登録番号のリストに追加されます。よく認識ミスを起こすので、確認して追加ボタンを押してください。<br>異なる学期同時に入力（春Aの1限と春Cの1限など）しないようにしてください。
                          <v-img 
                          src="/trimming.png"
                          height="250px"
                          contain
                          ></v-img>
                        </v-card-text>
                        <v-divider></v-divider>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color='primary' flat @click='dialog3 = false'>OK</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-card-text>
                      <v-flex xs12>
                        <v-subheader class="pl-0">縦</v-subheader>
                        <v-slider
                          v-model="height"
                          :thumb-size="36"
                          thumb-label="always"
                          :max="900"
                          :min="10"
                        ></v-slider>
                      </v-flex>
                      <v-flex xs12>
                        <v-subheader class="pl-0">横</v-subheader>
                        <v-slider
                          v-model="width"
                          :thumb-size="36"
                          thumb-label="always"
                          :max="300"
                          :min="10"
                        ></v-slider>
                      </v-flex>
                      <croppa v-model="croppa"
                              :width="width"
                              :height="height"
                              initial-size="cover"
                              initial-position="left top"
                              placeholder="こちらをタップ"
                              placeholder-color="black"
                              :placeholder-font-size="14"
                              remove-button-color="teal"
                              :show-remove-button="false"
                              :zoom-speed="5"
                              id="canvas"
                      ></croppa>
                      
                      <v-btn round outline @click="uploadedImage = croppa.generateDataUrl();recognizeImage()" color="primary">解析開始</v-btn>
                      <div id="progress">
                      </div>
                      <div>
                        <v-textarea v-model="text" name='out' label='出力画面'></v-textarea>
                      </div>
                      <v-btn round @click="addItem()" outline color="success">登録画面に追加する</v-btn>
                    </v-card-text>
                  </v-tab-item>

                  <v-tab-item :key='3'>
                    <div class='text-xs-center'></div>
                    <v-card-text>
                      <v-dialog v-model='dialog2' width='500'>
                        <v-btn
                          absolute
                          icon
                          slot='activator'
                          color='success'
                          style='bottom:0px;left:0px;'
                        >?</v-btn>
                        <v-card>
                          <v-card-title class='headline teal white--text' primary-title dark>使い方</v-card-title>
                          <v-card-text>
                            <a href='https://twins.tsukuba.ac.jp'>Twins</a>にPC版でアクセスし、CSVデータをダウンロードしてください。（文字コードはUnicode（UTF-8)）その後対応する学期を選択して「データを取得」ボタンを押すと時間割を作成することができます。
                          </v-card-text>

                          <v-divider></v-divider>

                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color='primary' flat @click='dialog2 = false'>OK</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                      <input
                        class='pa-2'
                        @change='selectedFile'
                        type='file'
                        name='file'
                      >
                      <br>

                      <div>
                        <v-menu offset-y>
                          <v-btn round slot='activator' color='primary' dark outline>入力する学期</v-btn>
                          <v-list>
                            <v-list-tile
                              v-for='(nthSemester, i) in semester'
                              :key='i'
                              @click='selectSemester = nthSemester'
                            >
                              <v-list-tile-title>{{ nthSemester }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </div>
                      {{ selectSemester }}
                      <div>
                        <v-btn round class='py-2' outline color='success' @click='upload'>データの取得</v-btn>
                      </div>
                    </v-card-text>
                  </v-tab-item>
                  
                </v-tabs>
              </div>
            </v-card-text>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- info -->
    <v-dialog v-model='info' width='800px'>
      <v-card>
        <v-container grid-list-sm class='px-0 pb-0'>
          <v-flex xs12>
            <iframe id='info' height='400em' width='100%' frameborder='0' allowfullscreen></iframe>
          </v-flex>
        </v-container>
        <v-card-actions>
          <v-card-text class='py-0 my-0'>
            <v-checkbox v-model='selected' label='利用規約に同意する' color='success'></v-checkbox>
          </v-card-text>
          <v-spacer></v-spacer>
          <v-btn flat color='success' @click='info = false'>Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ローディング画面 -->
    <v-layout row justify-center>
      <v-dialog v-model='isLoading'>
        <v-progress-circular class='ma-3' :size='50' :width='5' color='blue-grey' indeterminate></v-progress-circular>now loading...
      </v-dialog>
    </v-layout>
    <v-snackbar auto-height v-model='log' :top='true' :timeout='3000'>
      {{ message }}
      <v-btn color='pink' flat @click='log = false'>Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import VueFrame from 'vue-frame'
import Tesseract from 'tesseract.js'
export default {
  components: { VueFrame },
  data () {
    return {
      croppa: {},
      text: '',
      value: [],
      width: 200,
      height: 430,
      dialog: false,
      dialog2: false,
      dialog3: false,
      log: false,
      info: false,
      selected: false,
      uploadFile: null,
      uploadedImage: null,
      message: '',
      semester: ['春A', '春B', '春C', '秋A', '秋B', '秋C'],
      selectSemester: '',
      tasks: [],
      task: null
    }
  },
  props: {
    progressColor: { type: String, default: 'purple' }
  },
  computed: {
    isLogin: function () {
      return this.$store.state.isLogin
    },
    isLoading: function () {
      return this.$store.state.isLoading
    },
    reLogin: function () {
      return this.$store.state.reLogin
    }
  },
  methods: {
    addItem () {
      this.value = this.text.split('\n')
      Array.prototype.push.apply(this.tasks, this.value)
      this.message = '追加完了。授業番号登録を見てみてください。'
      this.log = true
    },
    onFileChange (e) {
      if (!this.selected) {
        this.message = '利用規約に同意してからご利用ください。'
      } else {
        let files = e.target.files
        this.createImage(files[0])
      }
    },
    // アップロードした画像を表示
    createImage (file) {
      let reader = new FileReader()
      reader.onload = (e) => {
        this.uploadedImage = e.target.result
        this.recognizeImage()
      }
      reader.readAsDataURL(file)
    },
    async recognizeImage () {
      if (!this.selected) {
        this.message = '利用規約に同意してからご利用ください。'
        this.log = true
      } else if (this.uploadedImage === '') {
        this.message = 'ファイルが入力されてません'
        this.log = true
      } else {
        const progress = document.getElementById('progress')
        Tesseract.recognize(this.uploadedImage, {
          lang: 'eng',
          tessedit_char_whitelist: '0123456789ABCEFGHXY'
        }).progress((p) => {
          if (p.progress === 1) {
            progress.innerHTML = 'Progress: 0%'
          } else {
            progress.innerHTML = `Progress: ${p.progress * 100}%`
          }
        }).then((r) => {
          progress.innerHTML = '読み取りが完了しました。'
          this.text = r.text
        })
      }
    },
    async numLogin () {
      if (!this.selected) {
        this.message = '利用規約に同意してからご利用ください。'
      } else {
        await this.$store.dispatch('number', { number: this.tasks, semester: 'haruA' })
        await this.$store.dispatch('number', { number: this.tasks, semester: 'haruB' })
        await this.$store.dispatch('number', { number: this.tasks, semester: 'haruC' })
        await this.$store.dispatch('number', { number: this.tasks, semester: 'akiA' })
        await this.$store.dispatch('number', { number: this.tasks, semester: 'akiB' })
        await this.$store.dispatch('number', { number: this.tasks, semester: 'akiC' })
        this.$store.commit('reLogin', false)
        if (this.$store.state.isLogin) {
          this.tasks = []
          this.$store.dispatch('save', { state: this.$store.state })
          this.message = '時間割を作成しました。'
        } else {
          this.message = '時間割の取得に失敗しました。'
        }
      }
      this.log = true
    },
    create () {
      this.tasks.push(this.task.toUpperCase())
      this.task = null
    },
    deleteItem (i) {
      this.tasks.splice(i, 1)
    },
    isSafari () {
      const userAgent = window.navigator.userAgent
      return (
        userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1
      )
    },
    selectedFile (e) {
      e.preventDefault()
      const files = e.target.files
      this.uploadFile = files[0]
    },
    async upload () {
      if (!this.selected) {
        this.message = '利用規約に同意してからご利用ください。'
        this.log = true
      } else if (this.selectSemester === '') {
        this.message = '学期を選択してください。'
        this.log = true
      } else if (this.uploadFile === null) {
        this.message = 'ファイルが入力されてません'
        this.log = true
      } else {
        const formData = new FormData()
        formData.append('file_upload', this.uploadFile)
        const config = {
          headers: { 'content-type': 'multipart/form-data' }
        }
        try {
          await this.$store
            .dispatch('csvFunction', {
              formData,
              config,
              semester: this.selectSemester
            })
            .then(res => {
              this.$store.commit('reLogin', false)
              this.message = this.$store.state.isLogin
                ? '時間割を作成しました。'
                : '時間割の取得に失敗しました。'
              this.log = true
            })
        } catch (error) {
          this.message = '通信エラーが発生しました'
          this.log = true
        }
      }
    }
  }
}
</script>

<style>
.dialog.centered-dialog,
.v-dialog.centered-dialog {
  background: #282c2dad;
  box-shadow: none;
  border-radius: 6px;
  width: auto;
  color: whitesmoke;
  overflow-x: hidden;
}
canvas {
  border: 1px solid grey;
  border-radius: 8px;
}
</style>