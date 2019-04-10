import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'

module.exports = {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Twin:te',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, minimal-ui'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'このアプリは筑波大学生向けの時間割作成アプリです。'
      },
      { name: 'format-detection', content: 'telephone=no' },
      {
        property: 'og:image', content: 'https://twinte.net/icon.png'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
    ]
  },
  plugins: ['~/plugins/vuetify.js', '~/plugins/cooper.js'],
  css: ['~/assets/style/app.styl'],
  /*
   ** Customize the progress bar color
   */
  loading: { color: '#3B8070' },
  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    extend (config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      config.plugins.push(new VuetifyLoaderPlugin())
      // const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
      // config.plugins.push(new HardSourceWebpackPlugin())
    }
  },
  /** 高速化 */
  render: {
    resourceHints: false
  },
  modules: [
    '@nuxtjs/pwa',
    ['@nuxtjs/google-analytics', {
      id: 'UA-133970007-1'
    }]
  ],
  workbox: {
    dev: true
  },
  meta: {
    mobileAppIOS: true,
    appleStatusBarStyle: false,
    lang: 'ja',
    nativeUI: true
  },
  manifest: {
    name: 'Twin:te',
    short_name: 'Twin:te',
    lang: 'ja',
    start_url: '/',
    display: 'standalone'
  }
}
