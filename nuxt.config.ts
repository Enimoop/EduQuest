// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/styles.css'],
  plugins: [
    { src: '~/plugins/bootstrap.client.js', mode: 'client' },
  ]
})