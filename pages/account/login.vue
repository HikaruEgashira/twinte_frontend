<template>
  <v-container fluid grid-list-sm>
    <v-layout justify-center class="text-xs-center">
      <v-flex xs10 sm6 v-if="!login">
        <v-img
          src="/icon.png"
          contain
          height="150px"
        ></v-img>
        <h1 class="title font-weight-bold pa-2">ログイン</h1>
        <!-- <v-card>
          <v-card-text
            class="caption font-weight-bold"
          >これはPCなど、ほかの端末で今登録してある時間割を管理するためのログイン機能です。お使いのemailでアカウントの作成が可能です。</v-card-text>
        </v-card> -->
          <v-form v-model="valid">
          <v-text-field
            v-model="name"
            label="ユーザー名"
            required
          ></v-text-field>
          <v-text-field
            v-model="email"
            label="E-mail"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            required
            :append-icon="show ? 'visibility' : 'visibility_off'"
            :type="show ? 'text' : 'password'"
            name="input-10-1"
            label="パスワード"
            data-vv-name="password"
            counter
            @click:append="show = !show"
          ></v-text-field>
        </v-form>
            <v-spacer></v-spacer>
            <v-btn color="#7ABCA8" dark depressed round @click="submit" class="font-weight-thin">Submit</v-btn>
        <div class="text-xs-right caption font-weight-thin py-2">
          <nuxt-link to="/account/forget">パスワードを忘れた方はこちら</nuxt-link><br />
          <nuxt-link to="/account/signin">アカウントを作成</nuxt-link>
        </div>
      </v-flex>
      <v-flex v-else>
        <h1 class="title font-weight-bold pa-2">{{ $store.state.username }}のページ</h1>
        <v-btn>ログインした状態で、データーベースに授業番号を保存したり更新したりする</v-btn>
        <v-btn>ログインした状態で、学期を指定してデーターベースから時間割情報を持ってくる</v-btn>
        <v-btn>ログインした状態で、データーベースに時間割のjsonを保存したり更新したりする,おくったjsonそのままの形で保存  </v-btn>
        <v-btn>データーベースから/api/storeで保存したjsonを持ってくる</v-btn>
        <v-btn>ログアウト</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    login: true,
    show: false,
    valid: false,
    name: '',
    password: '',
    nameRules: [
      v => !!v || 'ユーザー名を入力してください'
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mailを入力してください',
      v => /.+@.+/.test(v) || ''
    ]
  }),
  methods: {
    async submit () {
      await this.$store.dispatch('login', {
        name: this.name,
        password: this.password,
        email: this.email
      })
    }
  }
}
</script>
