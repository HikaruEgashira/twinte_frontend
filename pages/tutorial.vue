<template>
  <v-container>
    <v-flex xs12>
      <h2 class="headline font-weight-bold mb-3">このアプリの使い方</h2>
      <v-stepper v-model="page" vertical>
        <!-- 1 -->
        <v-stepper-step :complete="page > 1" step="1">
          ホーム画面に追加
          <small>アプリとしてオフラインで利用できます。</small>
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-card color="grey lighten-1" class="mb-5" height="450px">
<v-container fluid grid-list-sm>
    <v-layout>
      <v-flex xs6>
        <v-img 
        src="/Android1.jpg"
        height="250px"
        contain
        ></v-img>
      </v-flex>

      <v-flex xs6>
        <v-img 
        src="/iPhone1.jpg"
        height="250px"
        contain
        >
        </v-img>
      </v-flex>

    </v-layout>
  </v-container>                        <v-card-text>
    ホーム画面に追加するとアプリとしてご利用いただけます。
                          </v-card-text>
        <v-img 
        src="/iPhone2.jpg"
        height="100px"
        contain
        >        </v-img>
          </v-card>
          <v-btn color="primary" @click="page = 2">次へ</v-btn>
        </v-stepper-content>
        <!-- 2 -->
        <v-stepper-step :complete="page > 2" step="2">
          時間割に表示する項目を選択
          <small>教室や教員の名前も表示できます。</small>
        </v-stepper-step>
        <v-stepper-content step="2">
          <v-card color="grey lighten-1" class="mb-5" height="410px">
<v-container fluid grid-list-sm>
    <v-layout>
      <v-flex xs6>
        <v-img 
        src="/iPhone3.jpg"
        height="250px"
        contain
        ></v-img>
      </v-flex>

      <v-flex xs6>
        <v-img 
        src="/iPhone4.jpg"
        height="250px"
        contain
        >
        </v-img>
      </v-flex>

    </v-layout>
  </v-container>
            <v-card-text>
              時間割に表示したい項目を設定することができます。
              ここで表示設定をオフにしたとしても授業の詳細は時間割のコマをタップすることで表示されます。
             </v-card-text> 


          </v-card>
          <v-btn color="primary" @click="page = 3">次へ</v-btn>
          <v-btn flat @click="page = 1">戻る</v-btn>
        </v-stepper-content>
        <!-- 3 -->
        <v-stepper-step :complete="page > 3" step="3">
          授業名を編集
        </v-stepper-step>
        <v-stepper-content step="3">
          <v-card color="grey lighten-1" class="mb-5" height="400px">
<v-container fluid grid-list-sm>
    <v-layout>
      <v-flex xs6>
        <v-img 
        src="/iPhone5.jpg"
        height="250px"
        contain
        ></v-img>
      </v-flex>

      <v-flex xs6>
        <v-img 
        src="/iPhone6.jpg"
        height="250px"
        contain
        >
        </v-img>
      </v-flex>

    </v-layout>
  </v-container>
            <v-card-text>
              デフォルトでは正式な授業名が時間割に記載されます。
              そのままでは長い！！と思ったら編集してみましょう。
             </v-card-text> 


          </v-card>
          <v-btn flat @click="page = 2">戻る</v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-flex>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        page: 1
      }
    }
  }
</script>