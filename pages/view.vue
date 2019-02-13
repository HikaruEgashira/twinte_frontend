<template>
  <v-container>
    <v-layout row>
      <v-flex>
        <v-card>
          <v-list
            two-line
            subheader
          >
            <v-subheader>Theme変更</v-subheader>
          </v-list>
          <v-divider></v-divider>
          <v-list
            subheader
            two-line
          >
            <v-subheader>表示内容</v-subheader>
            <v-list-tile v-for="(item, index) in theme.table" :key="index">
              <v-list-tile-action>
                <v-switch v-model='items[index]'></v-switch>
              </v-list-tile-action>
              <v-list-tile-content @click='items[index] = !items[index]'>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.key }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-title class="mx-5">設定の保存</v-list-tile-title>
              <v-spacer />
              <v-btn icon @click='save'>
                <v-icon>done</v-icon>
              </v-btn>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- 保存ボタン -->
    <v-snackbar v-model="saved" :top=true :timeout="900">
      saved!
      <v-btn
        color="pink"
        flat
        @click="saved = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      saved: false,
      items: [],
      sound: false,
      video: false,
      invites: false
    }
  },
  computed: {
    theme: function () {
      return this.$store.state.theme
    }
  },
  mounted () {
    this.themeImport()
  },
  watch: {
    items: {
      handler: function (items, index) {
        this.$store.dispatch('updateThemeShow', items)
      },
      deep: true
    }
  },
  methods: {
    themeImport () {
      this.items = this.$store.state.theme.table.map(v => v.show)
    },
    save () {
      this.$store.dispatch('save', { state: this.$store.state })
      this.saved = true
    }
  }
}
</script>