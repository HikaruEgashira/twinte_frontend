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
  computed: {
    message: function () {
      return this.$store.state.alert.message
    },
    log: function () {
      return this.$store.state.alert.log
    }
  }
}
</script>