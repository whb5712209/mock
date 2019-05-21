const pkg = require('./package')

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [ { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' } ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [ 'element-ui/lib/theme-chalk/index.css' ],

  /*  
  ** Plugins to load before mounting the App
  */
  plugins: [ '@/plugins/element-ui', '@/plugins/axios' ],

  /*
  ** Nuxt.js modules
  */
  modules: [ '@nuxtjs/axios' ],

  /*
  ** Build configuration
  */
  build: {
    transpile: [ /^element-ui/ ],

    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {}
  },
  server: {
    port: 4000, // default: 3000
    host: '0.0.0.0' // default: localhost
  }
}
