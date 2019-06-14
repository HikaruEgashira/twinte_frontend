<template>
  <v-container fluid grid-list-sm>
    <v-layout justify-center class="text-xs-center">
      <v-flex xs10 sm6>
        <!-- <v-card>
            <v-card-text>
                これはPCなど、ほかの端末で今登録してある時間割を管理するためのログイン機能です。お使いのemailでアカウントの作成が可能です。
            </v-card-text>
        </v-card>
         -->
        <v-img
          src="/icon.png"
          contain
          height="150px"
        ></v-img>
        <h1 class="title font-weight-bold pa-2">アカウントの作成</h1>
        <v-form v-model="valid">
          <v-text-field
            v-model="name"
            :rules="nameRules"
            label="ユーザー名"
            required
          ></v-text-field>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="メールアドレス"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            :append-icon="show ? 'visibility' : 'visibility_off'"
            :type="show ? 'text' : 'password'"
            name="input-10-1"
            label="パスワード"
            hint="6文字以上にしてください"
            :rules="passRules"
            counter
            @click:append="show = !show"
            required
          ></v-text-field>
        </v-form>
            <v-spacer></v-spacer>
            <v-btn color="#7ABCA8" dark depressed round @click="submit" class="font-weight-thin">Submit</v-btn>
        <div class="text-xs-right caption font-weight-thin py-2">
          <nuxt-link to="/account/forget">パスワードを忘れた方はこちら</nuxt-link><br />
          <nuxt-link to="/account/signin">アカウントを作成</nuxt-link>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    show: false,
    valid: false,
    name: '',
    password: '',
    passRules: [
      v => (v.length >= 6) || 'パスワードが短すぎます'
    ],
    nameRules: [
      v => !!v || 'ユーザー名を入力してください'
    ],
    email: '',
    emailRules: [
      v => !!v || '正しいメールアドレスを入力してください',
      v => /.+@.+/.test(v) || ''
    ]
  }),
  methods: {
    async submit () {
      await this.$store.dispatch('signin', { password: this.password, email: this.email, name: this.name })
    }
  }
}
</script>
