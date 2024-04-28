// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/styles.css"],
  plugins: [{ src: "~/plugins/bootstrap.client.js", mode: "client" }],
  modules: ["@sidebase/nuxt-auth"],
  auth: {
    globalAppMiddleware: true,
  },
  runtimeConfig: {
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    public: {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    },
  },
  // auth: {
  //   baseURL: '/api/auth',
  //   provider: {
  //     type: 'local',
  //     endpoints: {
  //       signIn: { path: '/login', method: 'post' },
  //       signOut: { path: '/logout', method: 'post' },
  //       signUp: { path: '/register', method: 'post' },
  //       getSession: { path: '/session', method: 'get' }
  //     },
  //     token: { signInResponseTokenPointer: '/token/accessToken' },
  //   }
  // }
});
