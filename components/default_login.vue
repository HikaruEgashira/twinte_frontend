<template>
  <div>
    <!-- ログイン画面 -->
    <v-dialog
      :value='!isLogin'
      fullscreen
      hide-overlay
      transition='dialog-bottom-transition'
    >
      <v-card>
        <v-toolbar
          dark
          color='teal darken-1'
        >
          <v-toolbar-title>Twin:te</v-toolbar-title>
        </v-toolbar>
        <v-card-title class="title grey--text">Twinsへのログイン</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              prepend-icon='person'
              name='login'
              label='学籍番号'
              type='text'
              v-model='form.id'
              @keyup.enter="login"
            ></v-text-field>
            <v-text-field
              id='password'
              prepend-icon='lock'
              name='password'
              label='Password'
              type='password'
              v-model='form.pass'
              @keyup.enter="login"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-text>・以下の利用規約をよく読んでご利用ください</v-card-text>
        <br>
        <v-btn href="https://twinte.net/api/info.html" flat color="success" v-if="isSafari()">
          利用規約(こちらをクリック)
        </v-btn>
        <v-card-text id='vue-frame' @click='info = true' v-else>
            <vue-frame text='利用規約(こちらをクリック)' url='https://twinte.net/api/info.html' frame='info'></vue-frame>
        </v-card-text>
        <v-card-text class="py-0 my-0"><v-checkbox v-model="selected" label='利用規約に同意する' color="success" @keyup.enter="login"></v-checkbox></v-card-text>
        <div class="text-xs-right pr-3">
        <v-chip
          outline
          color="success"
          @click="login"
          ripple>
        　Login　
        </v-chip>
        </div>
        <v-card-title class="title grey--text">CSVファイルでのデータの取得</v-card-title>
        <v-card-text>
          <input class="pa-2" @change="selectedFile" type="file" name="file">
    　　　<v-btn class="py-2" outline color="success" @click="upload">データの取得</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- info -->
    <v-dialog v-model="info" width='800px'>
      <v-card>
        <v-container
          grid-list-sm
          class='px-0 pb-0'
        >
          <v-flex xs12>
            <div id="outer">
              <iframe id='info' height='400em' width='100%' frameborder='0' allowfullscreen>
              </iframe>
            </div>
          </v-flex>
        </v-container>
        <v-card-actions>
        <v-card-text class="py-0 my-0"><v-checkbox v-model="selected" label='利用規約に同意する' color="success"></v-checkbox></v-card-text>
          <v-spacer></v-spacer>
          <v-btn flat color='success' @click='info = false'>
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ローディング画面 -->
    <v-layout row justify-center>
    <v-dialog v-model='isLoading'>
      <v-progress-circular
      class="ma-3"
      :size="50"
      :width="5"
      color="blue-grey"
      indeterminate
    ></v-progress-circular>
    now loading...
    </v-dialog>
    </v-layout>
    <v-snackbar v-model="log" :top=true :timeout="1500">
      {{ message }}
      <v-btn
        color="pink"
        flat
        @click="log = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import VueFrame from 'vue-frame'
import axios from 'axios'
export default {
  components: { VueFrame },
  data () {
    return {
      log: false,
      info: false,
      selected: false,
      uploadFile: null,
      message: '',
      form: {
        id: '',
        pass: ''
      }
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
    }
  },
  methods: {
    async login () {
      if (this.selected) {
        await this.$store.dispatch('login', { id: this.form.id, pass: this.form.pass })
        await this.$store.dispatch('getItemsData', this.$store.state.season.name)
        await this.$store.dispatch('bachgroundFetch', 'haruA')
        await this.$store.dispatch('bachgroundFetch', 'haruB')
        await this.$store.dispatch('bachgroundFetch', 'haruC')
        await this.$store.dispatch('bachgroundFetch', 'akiA')
        await this.$store.dispatch('bachgroundFetch', 'akiB')
        await this.$store.dispatch('bachgroundFetch', 'akiC')
        try {
          await axios.post('https://twinte.net/api/logout.php')
        } catch (error) {
          console.error(error)
        }
      } else {
        this.message = '利用規約に同意してからご利用ください。'
        this.log = true
      }
    },
    isSafari () {
      const userAgent = window.navigator.userAgent
      if (userAgent.indexOf('iPhone') != -1 || userAgent.indexOf('iPad') != -1){
        return true
      }else{
        return false
      }
    },
    selectedFile: function (e) {
      e.preventDefault()
      const files = e.target.files
      this.uploadFile = files[0]
    },
    async upload () {
      if (this.selected) {
        const formData = new FormData()
        formData.append('file_upload', this.uploadFile)
        const config = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }
        this.$store.dispatch('csvFunction', { formData, config })
      } else {
        this.message = '利用規約に同意してからご利用ください。'
        this.log = true
      }
    }
  }
}
</script>

<style>
  .dialog.centered-dialog,
  .v-dialog.centered-dialog
  {
    background: #282c2dad;
    box-shadow: none;
    border-radius: 6px;
    width: auto;
    color: whitesmoke;
  }
  div.outer {
    -webkit-overflow-scrolling: touch;
  }
</style>