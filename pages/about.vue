<template>
  <v-container
    fluid
    grid-list-sm
  >
    <h1 class='title font-weight-bold pa-4 font-italic text-xs-center'>About</h1>
    <h3 class='pa-4 text-xs-center'>このサイトの製作者</h3>
    <h5 class="pa-4 text-xs-center">意見・連絡等はDMでお願いします</h5>
    <v-layout class='pa-4' v-for='(nthMenber, i) in randMenbers' :key='i'>
      <v-flex
        xs12
        sm6
        offset-sm3
      >
        <v-card>
          <v-img
            :src='nthMenber.icon'
            aspect-ratio='1'
          ></v-img>
          <v-card-title
            primary-title
            class='title font-weight-bold'
          >{{ nthMenber.name }}</v-card-title>
          <v-img
            src='/Twitter_Logo_Blue.png'
            aspect-ratio='1'
            height='60px'
            width='60px'
            class='ma-2'
            @click='link(nthMenber.twitter)'
          >
          </v-img>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      menbers: [
        {
          name: 'takonasu(@ITF_tako)',
          twitter: 'https://twitter.com/ITF_tako?ref_src=twsrc%5Etfw',
          icon:
            'https://pbs.twimg.com/profile_images/1079755767119409153/aTlUrEPU_400x400.jpg'
        },
        {
          name: 'Hikaru Egashira(@ITF_hikary)',
          twitter: 'https://twitter.com/ITF_hikary?ref_src=twsrc%5Etfw',
          icon:
            'https://pbs.twimg.com/profile_images/1087841873429856256/8L9jb05i_400x400.jpg'
        }
      ]
    }
  },
  methods: {
    link (href) {
      location.href = href
    }
  },
  computed: {
    randMenbers: function () {
      return Math.floor(Math.random() * 2) === 1
        ? this.menbers.reverse()
        : this.menbers
    }
  }
}
</script>