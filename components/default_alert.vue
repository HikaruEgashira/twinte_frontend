<template>
  <v-snackbar auto-height v-model="log" :top=true :timeout="1500">
    {{ message }}
    <v-btn
      color="pink"
      flat
      @click="this.$store.commit('message', { message, log: false })"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data: {
    message: false,
    log: ''
  },
  methods: {
    displayAlert (message) {
      this.message = message
      this.log = true
    }
  }
}
</script>